import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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
      await supabase.from("video_jobs").update(updateData).eq("id", jobId);
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
