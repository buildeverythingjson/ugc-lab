// Stripe tier configuration
export const STRIPE_TIERS = {
  starter: {
    name: "Starter",
    price: "499",
    price_id: "price_1TBOg909raYItIuAgRaaN8zT",
    product_id: "prod_U9i6QeNaASwqqS",
    videos_per_month: 5,
    max_length: 15,
    features: [
      "5 videoer per måned",
      "Opptil 15 sekunder",
      "AI-analyse av produktet",
      "Last ned i HD",
      "E-poststøtte",
    ],
  },
  pro: {
    name: "Pro",
    price: "899",
    price_id: "price_1TBOgG09raYItIuApOD5GBfp",
    product_id: "prod_U9i6UdxaxHRbcS",
    videos_per_month: 15,
    max_length: 15,
    features: [
      "15 videoer per måned",
      "Opptil 15 sekunder",
      "AI-analyse av produktet",
      "Last ned i HD",
      "Prioritert støtte",
    ],
  },
  business: {
    name: "Business",
    price: "1 999",
    price_id: "price_1TBOgL09raYItIuA0kJtfct2",
    product_id: "prod_U9i6JhAVuRPx6u",
    videos_per_month: 30,
    max_length: 30,
    features: [
      "30 videoer per måned",
      "Opptil 30 sekunder",
      "AI-analyse av produktet",
      "Last ned i HD",
      "Dedikert støtte",
      "API-tilgang",
    ],
  },
} as const;

export type TierKey = keyof typeof STRIPE_TIERS;

export function getTierByProductId(productId: string): TierKey | null {
  for (const [key, tier] of Object.entries(STRIPE_TIERS)) {
    if (tier.product_id === productId) return key as TierKey;
  }
  return null;
}
