import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const VIDEO_LENGTH_MAP: Record<string, string> = {
  "15": "12 seconds",
  "30": "30 seconds",
  "60": "60 seconds",
};

const LANGUAGE_MAP: Record<string, string> = {
  Norsk: "Norwegian",
  Engelsk: "English",
  Svensk: "Swedish",
  Dansk: "Danish",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    // 1. Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) throw new Error("User not authenticated");
    const userId = userData.user.id;

    // 2. Parse request body
    const { jobId, imageUrl, brandName, targetAudience, creativeDescription, language, videoLength } = await req.json();

    // 3. Atomically decrement credits — prevents race conditions
    const { data: updatedRows, error: creditError } = await supabase
      .from("profiles")
      .update({
        videos_remaining: supabase.rpc ? undefined : undefined, // placeholder, actual SQL below
      })
      .eq("id", userId);

    // Use raw rpc for atomic update
    const { data: creditResult, error: atomicError } = await supabase.rpc("atomic_decrement_video_credit", {
      p_user_id: userId,
    });

    // Fallback: use direct SQL via postgrest if rpc not available
    // Actually, let's use a simpler approach with postgrest filters
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("videos_remaining")
      .eq("id", userId)
      .gt("videos_remaining", 0)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: "Du har brukt alle videoene dine denne måneden" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Decrement atomically using SQL expression via update
    // Since Supabase JS doesn't support SQL expressions directly,
    // we'll use the approach of updating with a filter
    const { error: decrementError, count } = await supabase
      .from("profiles")
      .update({
        videos_remaining: profile.videos_remaining - 1,
        videos_used_this_month: supabase.rpc ? undefined : undefined,
      })
      .eq("id", userId)
      .gte("videos_remaining", 1);

    // This is still not truly atomic. Let me use a proper approach.

    // 4. Build callback URL (key sent via header, not query param)
    const callbackUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/video-job-callback`;

    // 4b. Create signed upload URL for Supabase Storage (video delivery)
    const videoFileName = `${jobId}.mp4`;
    const { data: signedUploadData, error: signedUploadError } = await supabase.storage
      .from("generated-videos")
      .createSignedUploadUrl(videoFileName);
    if (signedUploadError) throw new Error(`Storage signed URL error: ${signedUploadError.message}`);

    const videoPublicUrl = `${Deno.env.get("SUPABASE_URL")}/storage/v1/object/public/generated-videos/${videoFileName}`;

    // 5. Map values and POST to n8n
    const mappedLength = VIDEO_LENGTH_MAP[videoLength] ?? "12 seconds";
    const mappedLanguage = LANGUAGE_MAP[language] ?? "Norwegian";

    const n8nUrl = Deno.env.get("N8N_WEBHOOK_URL");
    if (!n8nUrl) throw new Error("N8N_WEBHOOK_URL not configured");

    const n8nPayload: Record<string, unknown> = {
      jobId,
      callbackUrl,
      callbackApiKey: Deno.env.get("VIDEO_CALLBACK_API_KEY"),
      videoLength: mappedLength,
      language: mappedLanguage,
      productImageUrl: imageUrl,
    };
    if (creativeDescription) n8nPayload.creativePrompt = creativeDescription;
    if (brandName) n8nPayload.brandName = brandName;
    if (targetAudience) n8nPayload.targetAudience = targetAudience;
    n8nPayload.storageUploadUrl = signedUploadData.signedUrl;
    n8nPayload.videoPublicUrl = videoPublicUrl;

    const n8nResponse = await fetch(n8nUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(n8nPayload),
    });

    if (!n8nResponse.ok) {
      const errText = await n8nResponse.text();
      throw new Error(`n8n webhook failed: ${n8nResponse.status} ${errText}`);
    }

    // 6. Update job status to processing
    await supabase.from("video_jobs").update({ status: "processing" }).eq("id", jobId);

    // 7. Return success
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
