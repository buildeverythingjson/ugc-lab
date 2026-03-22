import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");

    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { data: userData, error: userError } = await supabaseAuth.auth.getUser(token);
    if (userError || !userData?.user) {
      throw new Error("User not authenticated");
    }

    const userId = userData.user.id;

    // Check if user already used trial
    const { data: profile } = await supabase
      .from("profiles")
      .select("has_used_trial, subscription_tier")
      .eq("id", userId)
      .single();

    if (profile?.has_used_trial || ["trial", "startup", "growth", "business"].includes(profile?.subscription_tier ?? "")) {
      return new Response(JSON.stringify({ error: "Du har allerede brukt gratisprøven din." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Get IP from headers
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || req.headers.get("cf-connecting-ip")
      || req.headers.get("x-real-ip")
      || "unknown";

    // Check if this IP already activated a trial
    const { data: existingIp } = await supabase
      .from("trial_activations")
      .select("id")
      .eq("ip_address", ip)
      .limit(1);

    if (existingIp && existingIp.length > 0) {
      return new Response(JSON.stringify({ error: "En gratisprøve er allerede aktivert fra denne tilkoblingen." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Activate trial: set tier, give 1 credit, mark trial used
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        subscription_tier: "trial",
        has_used_trial: true,
        videos_remaining: 1,
        videos_used_this_month: 0,
      })
      .eq("id", userId);

    if (updateError) throw updateError;

    // Record IP
    await supabase
      .from("trial_activations")
      .insert({ user_id: userId, ip_address: ip });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
