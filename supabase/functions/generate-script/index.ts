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
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Authenticate user for rate limiting
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    const token = authHeader.replace("Bearer ", "");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) throw new Error("User not authenticated");
    const userId = userData.user.id;

    // Rate limit: 10 requests per minute
    const { data: allowed, error: rlError } = await supabase.rpc("check_rate_limit", {
      p_user_id: userId,
      p_function_name: "generate-script",
      p_max_requests: 10,
      p_window_seconds: 60,
    });
    if (rlError) console.error("Rate limit check error:", rlError.message);
    if (allowed === false) {
      return new Response(
        JSON.stringify({ error: "For mange forespørsler. Prøv igjen om litt." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { brandName, targetAudience, language, videoLength } = await req.json();

    if (!brandName || !targetAudience) {
      return new Response(
        JSON.stringify({ error: "Merkenavn og målgruppe er påkrevd." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `Du er en profesjonell UGC-manusforfattar. Du skriver korte, engasjerende videomanus for sosiale medier (TikTok, Instagram Reels). Manuset skal føles autentisk og naturlig, som om en ekte person snakker til kamera. Skriv alltid på ${language || "norsk"}.

Regler:
- Skriv i førsteperson
- Start med en sterk hook (de første 2 sekundene)
- Hold det kort og konsist (${videoLength === "30" ? "ca. 60-80 ord" : "ca. 30-40 ord"})
- Bruk et uformelt, vennlig språk
- Avslutt med en tydelig call-to-action
- Ikke bruk emojis eller hashtags
- Returner KUN manuset, ingen ekstra forklaring eller formatering`;

    const userPrompt = `Skriv et UGC-videomanus for merket "${brandName}" rettet mot målgruppen: ${targetAudience}.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "For mange forespørsler. Prøv igjen om litt." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI-kreditter brukt opp. Legg til mer i innstillinger." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const script = data.choices?.[0]?.message?.content?.trim();

    return new Response(
      JSON.stringify({ script }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-script error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Ukjent feil" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
