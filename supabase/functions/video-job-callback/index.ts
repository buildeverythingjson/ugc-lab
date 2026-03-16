import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  // 1. Handle OPTIONS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 2. Validate API key from query params
    const url = new URL(req.url);
    const apiKey = url.searchParams.get("apiKey");
    const expectedKey = Deno.env.get("VIDEO_CALLBACK_API_KEY") ?? "";

    if (!apiKey || apiKey !== expectedKey) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Parse request body
    const { jobId, status, videoUrl, driveLink, error } = await req.json();

    // 4. Create Supabase client with service role key (bypass RLS)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // 5. Handle completed status
    if (status === "completed") {
      await supabase
        .from("video_jobs")
        .update({ status: "completed", video_url: videoUrl, drive_link: driveLink })
        .eq("id", jobId);
    }
    // 6. Handle failed status with credit refund
    else if (status === "failed") {
      const { data: job } = await supabase
        .from("video_jobs")
        .update({ status: "failed", error_message: error })
        .eq("id", jobId)
        .select("user_id")
        .single();

      if (job?.user_id) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("videos_remaining, videos_used_this_month")
          .eq("id", job.user_id)
          .single();

        if (profile) {
          await supabase
            .from("profiles")
            .update({
              videos_remaining: profile.videos_remaining + 1,
              videos_used_this_month: Math.max(0, profile.videos_used_this_month - 1),
            })
            .eq("id", job.user_id);
        }
      }
    }

    // 7. Return success
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
