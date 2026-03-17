import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate lengths
    if (name.length > 100 || email.length > 255 || message.length > 2000) {
      return new Response(
        JSON.stringify({ error: "Input exceeds maximum length" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Store in database
    const { error: dbError } = await supabase
      .from("contact_submissions")
      .insert({ name, email, message });

    if (dbError) {
      console.error("DB error:", dbError);
      throw new Error("Failed to store submission");
    }

    // Send email notification via Resend
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (RESEND_API_KEY) {
      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "UGC Lab <noreply@ugclab.no>",
          to: ["hjelp@ugclab.no"],
          subject: `Ny henvendelse fra ${name}`,
          html: `
            <h2>Ny kontakthenvendelse</h2>
            <p><strong>Navn:</strong> ${name}</p>
            <p><strong>E-post:</strong> ${email}</p>
            <p><strong>Melding:</strong></p>
            <p>${message.replace(/\n/g, "<br>")}</p>
          `,
          reply_to: email,
        }),
      });

      if (!emailRes.ok) {
        const errBody = await emailRes.text();
        console.error("Resend error:", errBody);
      }
    } else {
      console.warn("RESEND_API_KEY not configured – email not sent, but submission stored.");
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in send-contact-email:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
