// Stripe tier configuration
export const STRIPE_TIERS = {
  trial: {
    name: "Startup Trial",
    price: "10",
    price_id: "price_1TBvZn09raYItIuAon2pFcJT",
    product_id: "prod_UAG5kKbvPbhTYE",
    videos_per_month: 1,
    max_length: 15,
    features: [
      "1 video",
      "Opptil 15 sekunder",
      "AI-analyse av produktet",
      "Last ned i HD",
    ],
  },
  startup: {
    name: "Basis",
    price: "499",
    price_id: "price_1TBOg909raYItIuAgRaaN8zT",
    product_id: "prod_U9i6QeNaASwqqS",
    videos_per_month: 5,
    max_length: 15,
    features: [
      "5 videoer per måned",
      "30 bilder per måned (kommer snart)",
      "Opptil 15 sekunder",
      "AI-analyse av produktet",
      "Last ned i HD",
      "E-poststøtte",
    ],
  },
  growth: {
    name: "Growth",
    price: "899",
    price_id: "price_1TBOgG09raYItIuApOD5GBfp",
    product_id: "prod_U9i6UdxaxHRbcS",
    videos_per_month: 15,
    max_length: 15,
    features: [
      "15 videoer per måned",
      "150 bilder per måned (kommer snart)",
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
      "300 bilder per måned (kommer snart)",
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
