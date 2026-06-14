export const prerender = false;

import { createClient } from "@supabase/supabase-js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.CLOUDINARY_API_KEY,
  api_secret: import.meta.env.CLOUDINARY_API_SECRET,
});

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
    
    console.log("[Reject API] authHeader prefix:", authHeader.substring(0, 25) + "...");
    console.log("[Reject API] serviceRoleKey present:", !!serviceRoleKey);
    console.log("[Reject API] token prefix:", token ? token.substring(0, 15) + "..." : "none");

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
      console.error("[Reject API] Auth error details:", authError);
      console.log("[Reject API] User object retrieved:", user);
      return new Response(JSON.stringify({ error: "Unauthorized", details: authError?.message || "Invalid session or user not found" }), {
        status: 401,
      });
    }

    const { requestId, adminNote } = await request.json();

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

    // Delete media from Cloudinary
    try {
      const resourceType = memRequest.type === "Video" ? "video" : "image";
      await cloudinary.uploader.destroy(memRequest.cloudinary_public_id, {
        resource_type: resourceType,
      });
    } catch (cloudinaryError) {
      console.error("Cloudinary deletion failed:", cloudinaryError);
      // Continue with rejection even if Cloudinary delete fails
    }

    // Update the request status
    const { error: updateError } = await supabaseAdmin
      .from("memory_requests")
      .update({
        status: "rejected",
        admin_note: adminNote || null,
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
      JSON.stringify({ success: true, message: "Memory request rejected" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Reject error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
