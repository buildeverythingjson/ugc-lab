import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ⚠️ SYNC: This mapping must match src/lib/stripe-config.ts STRIPE_TIERS and stripe-webhook/index.ts TIER_MAP
const TIER_MAP: Record<string, { tier: string; videos: number }> = {
  "prod_UAG5kKbvPbhTYE": { tier: "trial", videos: 1 },
  "prod_U9i6QeNaASwqqS": { tier: "startup", videos: 5 },
  "prod_U9i6UdxaxHRbcS": { tier: "growth", videos: 15 },
  "prod_U9i6JhAVuRPx6u": { tier: "business", videos: 30 },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Auth error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2026-02-25.clover",
    });

    const customers = await stripe.customers.list({ email: user.email, limit: 1 });

    if (customers.data.length === 0) {
      await supabaseClient.from("profiles").update({
        subscription_tier: null,
        subscription_status: null,
        videos_remaining: 0,
      }).eq("id", user.id);

      return new Response(JSON.stringify({ subscribed: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const customerId = customers.data[0].id;
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      await supabaseClient.from("profiles").update({
        stripe_customer_id: customerId,
        subscription_tier: null,
        subscription_status: null,
        videos_remaining: 0,
      }).eq("id", user.id);

      return new Response(JSON.stringify({ subscribed: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const subscription = subscriptions.data[0];
    const productId = subscription.items.data[0].price.product as string;
    const tierInfo = TIER_MAP[productId] || { tier: "starter", videos: 5 };
    const subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();

    const { data: profile } = await supabaseClient.from("profiles").select("*").eq("id", user.id).single();

    const updateData: Record<string, any> = {
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      subscription_tier: tierInfo.tier,
      subscription_status: "active",
      current_period_end: subscriptionEnd,
    };

    if (tierInfo.tier === "trial") {
      updateData.has_used_trial = true;
    }

    if (!profile?.subscription_tier || profile.subscription_tier !== tierInfo.tier) {
      updateData.videos_remaining = tierInfo.videos;
      updateData.videos_used_this_month = 0;
    }

    await supabaseClient.from("profiles").update(updateData).eq("id", user.id);

    return new Response(JSON.stringify({
      subscribed: true,
      tier: tierInfo.tier,
      subscription_end: subscriptionEnd,
      videos_remaining: updateData.videos_remaining ?? profile?.videos_remaining ?? 0,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
