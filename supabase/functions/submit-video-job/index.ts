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

    // 2. Rate limit: 5 requests per minute
    const { data: allowed, error: rlError } = await supabase.rpc("check_rate_limit", {
      p_user_id: userId,
      p_function_name: "submit-video-job",
      p_max_requests: 5,
      p_window_seconds: 60,
    });
    if (rlError) console.error("Rate limit check error:", rlError.message);
    if (allowed === false) {
      return new Response(
        JSON.stringify({ error: "For mange forespørsler. Prøv igjen om litt." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Parse request body
    const { jobId, imageUrl, brandName, targetAudience, creativeDescription, language, videoLength } = await req.json();
    if (!imageUrl || typeof imageUrl !== "string") {
      throw new Error("imageUrl is required and must be a string");
    }

    // 4. Atomically decrement credits (race-condition safe)
    const { data: creditResult, error: creditError } = await supabase.rpc("decrement_video_credit", {
      p_user_id: userId,
    });

    if (creditError) throw new Error(`Credit check failed: ${creditError.message}`);
    if (creditResult === -1) {
      return new Response(
        JSON.stringify({ error: "Du har brukt alle videoene dine denne måneden" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 5. Build callback URL (key sent via header by n8n, not in query param)
    const callbackUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/video-job-callback`;

    // 5b. Create signed upload URL for Supabase Storage (video delivery)
    const videoFileName = `${jobId}.mp4`;
    const { data: signedUploadData, error: signedUploadError } = await supabase.storage
      .from("generated-videos")
      .createSignedUploadUrl(videoFileName);
    if (signedUploadError) throw new Error(`Storage signed URL error: ${signedUploadError.message}`);

    const videoPublicUrl = `${Deno.env.get("SUPABASE_URL")}/storage/v1/object/public/generated-videos/${videoFileName}`;

    // 6. Map values and POST to n8n
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

    // 7. Update job status to processing
    await supabase.from("video_jobs").update({ status: "processing" }).eq("id", jobId);

    // 8. Return success
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
