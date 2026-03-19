import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

// ⚠️ SYNC: This mapping must match src/lib/stripe-config.ts STRIPE_TIERS and check-subscription/index.ts TIER_MAP
const TIER_MAP: Record<string, { tier: string; videos: number }> = {
  "prod_UAG5kKbvPbhTYE": { tier: "trial", videos: 1 },
  "prod_U9i6QeNaASwqqS": { tier: "startup", videos: 5 },
  "prod_U9i6UdxaxHRbcS": { tier: "growth", videos: 15 },
  "prod_U9i6JhAVuRPx6u": { tier: "business", videos: 30 },
};

serve(async (req) => {
  // Stripe sends POST; no CORS needed for webhook calls
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2026-02-25.clover",
  });

  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!webhookSecret) {
    console.error("[STRIPE-WEBHOOK] STRIPE_WEBHOOK_SECRET not configured");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  let event: Stripe.Event;
  const body = await req.text();

  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (err) {
    console.error("[STRIPE-WEBHOOK] Signature verification failed:", err.message);
    return new Response(`Signature verification failed: ${err.message}`, { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    console.log(`[STRIPE-WEBHOOK] Received event: ${event.type}`);

    if (
      event.type === "checkout.session.completed" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      let customerId: string | null = null;
      let profileId: string | null = null;
      let subscription: Stripe.Subscription | null = null;

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        customerId = (session.customer as string) ?? null;
        profileId = session.client_reference_id ?? session.metadata?.user_id ?? null;

        const subscriptionId = typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;

        if (subscriptionId) {
          subscription = await stripe.subscriptions.retrieve(subscriptionId);
        }
      } else {
        subscription = event.data.object as Stripe.Subscription;
        customerId = subscription.customer as string;
      }

      let profile = null;

      if (profileId) {
        const { data } = await supabase
          .from("profiles")
          .select("id, subscription_tier")
          .eq("id", profileId)
          .maybeSingle();
        profile = data;
      }

      if (!profile && customerId) {
        const { data } = await supabase
          .from("profiles")
          .select("id, subscription_tier")
          .eq("stripe_customer_id", customerId)
          .maybeSingle();
        profile = data;
      }

      if (!profile) {
        console.warn(`[STRIPE-WEBHOOK] No profile found for customer ${customerId}`);
        return new Response(JSON.stringify({ received: true }), { status: 200 });
      }

      if (event.type === "customer.subscription.deleted") {
        await supabase.from("profiles").update({
          subscription_status: "canceled",
          subscription_tier: null,
          stripe_customer_id: customerId,
          stripe_subscription_id: null,
          videos_remaining: 0,
          current_period_end: null,
        }).eq("id", profile.id);
      } else if (subscription) {
        const status = subscription.status;
        const productId = subscription.items.data[0]?.price?.product as string;
        const tierInfo = TIER_MAP[productId] || { tier: "startup", videos: 5 };
        const subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();

        const updateData: Record<string, unknown> = {
          stripe_customer_id: customerId,
          subscription_status: status,
          subscription_tier: tierInfo.tier,
          stripe_subscription_id: subscription.id,
          current_period_end: subscriptionEnd,
        };

        if (profile.subscription_tier !== tierInfo.tier) {
          updateData.videos_remaining = tierInfo.videos;
          updateData.videos_used_this_month = 0;
        }

        if (tierInfo.tier === "trial") {
          updateData.has_used_trial = true;
        }

        await supabase.from("profiles").update(updateData).eq("id", profile.id);
      }
    } else if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      await supabase
        .from("profiles")
        .update({ subscription_status: "past_due" })
        .eq("stripe_customer_id", customerId);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    console.error("[STRIPE-WEBHOOK] Error processing event:", err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
