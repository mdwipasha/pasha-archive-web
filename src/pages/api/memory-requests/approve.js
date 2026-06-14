export const prerender = false;

import { createClient } from "@supabase/supabase-js";

function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

export async function POST({ request }) {
  try {
    // Verify the caller is an authenticated admin
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log("[Approve API] authHeader prefix:", authHeader.substring(0, 25) + "...");
    console.log("[Approve API] serviceRoleKey present:", !!serviceRoleKey);
    console.log("[Approve API] token prefix:", token ? token.substring(0, 15) + "..." : "none");

    // Fallback to user session token if service role key is not defined
    const supabaseAdmin = createClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      serviceRoleKey || token
    );

    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      console.error("[Approve API] Auth error details:", authError);
      console.log("[Approve API] User object retrieved:", user);
      return new Response(JSON.stringify({ error: "Unauthorized", details: authError?.message || "Invalid session or user not found" }), {
        status: 401,
      });
    }

    const { requestId } = await request.json();

    if (!requestId) {
      return new Response(
        JSON.stringify({ error: "requestId is required" }),
        { status: 400 }
      );
    }

    // Fetch the memory request
    const { data: memRequest, error: fetchError } = await supabaseAdmin
      .from("memory_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (fetchError || !memRequest) {
      return new Response(
        JSON.stringify({ error: "Memory request not found" }),
        { status: 404 }
      );
    }

    if (memRequest.status !== "pending") {
      return new Response(
        JSON.stringify({
          error: `Request is already ${memRequest.status}`,
        }),
        { status: 400 }
      );
    }

    // Generate slug
    const slug = generateSlug(memRequest.title);

    // Compute year from date
    const year = memRequest.date
      ? new Date(memRequest.date).getFullYear()
      : null;

    // Insert into memories table
    const { error: insertError } = await supabaseAdmin
      .from("memories")
      .insert({
        title: memRequest.title,
        slug,
        type: memRequest.type,
        description: memRequest.description,
        date: memRequest.date || null,
        year,
        location: memRequest.location,
        src: memRequest.src,
        cloudinary_public_id: memRequest.cloudinary_public_id,
        thumbnail_url: memRequest.thumbnail_url,
        latitude: memRequest.latitude,
        longitude: memRequest.longitude,
      });

    if (insertError) {
      console.error("Insert into memories failed:", insertError);
      return new Response(
        JSON.stringify({ error: insertError.message }),
        { status: 500 }
      );
    }

    // Update the request status
    const { error: updateError } = await supabaseAdmin
      .from("memory_requests")
      .update({
        status: "approved",
        approved_at: new Date().toISOString(),
        approved_by: user.email,
      })
      .eq("id", requestId);

    if (updateError) {
      console.error("Update memory_requests failed:", updateError);
      return new Response(
        JSON.stringify({ error: updateError.message }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Memory approved and added to collection" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Approve error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
