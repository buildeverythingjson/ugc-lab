import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

serve(async (req) => {
  // Only allow POST (from cron)
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);

    // Find completed/failed jobs older than 30 days
    const { data: oldJobs, error: queryError } = await supabase
      .from("video_jobs")
      .select("id, product_image_url")
      .in("status", ["completed", "failed"])
      .lt("created_at", cutoffDate.toISOString())
      .limit(100);

    if (queryError) throw queryError;
    if (!oldJobs || oldJobs.length === 0) {
      return new Response(JSON.stringify({ deleted: 0 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    let deletedCount = 0;
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";

    for (const job of oldJobs) {
      if (!job.product_image_url) continue;

      // Extract file path from URL: .../product-images/filename
      try {
        const url = new URL(job.product_image_url);
        const pathMatch = url.pathname.match(/\/object\/public\/product-images\/(.+)$/);
        if (!pathMatch) continue;

        const filePath = decodeURIComponent(pathMatch[1]);
        const { error: deleteError } = await supabase.storage
          .from("product-images")
          .remove([filePath]);

        if (!deleteError) {
          deletedCount++;
        } else {
          console.error(`Failed to delete ${filePath}:`, deleteError.message);
        }
      } catch {
        // Skip malformed URLs
      }
    }

    console.log(`[cleanup-product-images] Deleted ${deletedCount} images from ${oldJobs.length} old jobs`);

    return new Response(JSON.stringify({ deleted: deletedCount, checked: oldJobs.length }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[cleanup-product-images] Error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
