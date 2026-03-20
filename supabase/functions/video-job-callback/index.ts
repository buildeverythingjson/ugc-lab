import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

// Callback is called by n8n, not browsers — restrictive CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "",
  "Access-Control-Allow-Headers": "authorization, content-type",
};

const SITE_URL = "https://pixel-perfect-clone-2709.lovable.app";

function buildVideoReadyEmail(brandName: string, videoUrl: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 0;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;">
        <tr><td style="padding:40px 32px;text-align:center;">
          <h1 style="margin:0 0 8px;font-size:22px;color:#141414;">Videoen din er klar! 🎬</h1>
          <p style="margin:0 0 24px;font-size:15px;color:#71717a;line-height:1.6;">
            Videoen for <strong style="color:#141414;">${brandName}</strong> er ferdig generert og klar til nedlasting.
          </p>
          <a href="${videoUrl}" style="display:inline-block;padding:12px 28px;background-color:#141414;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">
            Se videoen din
          </a>
          <p style="margin:24px 0 0;font-size:13px;color:#a1a1aa;">
            Du finner alle videoene dine i dashboardet.
          </p>
        </td></tr>
      </table>
      <p style="margin:24px 0 0;font-size:12px;color:#a1a1aa;">
        Rendr. — Innhold på sekundet
      </p>
    </td></tr>
  </table>
</body>
</html>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate API key from header (preferred) or query param (backwards compat)
    const url = new URL(req.url);
    const expectedKey = Deno.env.get("VIDEO_CALLBACK_API_KEY") ?? "";

    const authHeader = req.headers.get("authorization");
    const headerKey = authHeader?.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : null;
    const queryKey = url.searchParams.get("apiKey");
    // TODO: Remove query param support once n8n is updated to use Authorization header
    const apiKey = headerKey || queryKey;

    if (!apiKey || apiKey !== expectedKey) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { jobId, status, videoUrl, driveLink, error } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    if (status === "completed") {
      const updateData: Record<string, unknown> = { status: "completed", video_url: videoUrl };
      if (driveLink) updateData.drive_link = driveLink;
      
      const { data: job } = await supabase
        .from("video_jobs")
        .update(updateData)
        .eq("id", jobId)
        .select("user_id, brand_name")
        .single();

      // Send notification email
      if (job?.user_id) {
        try {
          const { data: userData } = await supabase.auth.admin.getUserById(job.user_id);
          const userEmail = userData?.user?.email;

          if (userEmail) {
            const videoPageUrl = `${SITE_URL}/dashboard/videos/${jobId}`;
            const brandName = job.brand_name || "ditt produkt";
            const messageId = crypto.randomUUID();

            await supabase.rpc("enqueue_email", {
              queue_name: "transactional_emails",
              payload: {
                message_id: messageId,
                to: userEmail,
                from: "Rendr. <noreply@notify.ugclab.no>",
                sender_domain: "notify.ugclab.no",
                subject: `Videoen din for ${brandName} er klar!`,
                html: buildVideoReadyEmail(brandName, videoPageUrl),
                purpose: "transactional",
                label: "video_ready",
                queued_at: new Date().toISOString(),
              },
            });
            console.log(`[VIDEO-CALLBACK] Notification email enqueued for ${userEmail}`);
          }
        } catch (emailErr) {
          // Don't fail the callback if email fails
          console.error("[VIDEO-CALLBACK] Failed to enqueue notification email:", emailErr);
        }
      }
    } else if (status === "failed") {
      const { data: job } = await supabase
        .from("video_jobs")
        .update({ status: "failed", error_message: error })
        .eq("id", jobId)
        .select("user_id")
        .single();

      // Atomically refund credit
      if (job?.user_id) {
        await supabase.rpc("refund_video_credit", { p_user_id: job.user_id });
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});