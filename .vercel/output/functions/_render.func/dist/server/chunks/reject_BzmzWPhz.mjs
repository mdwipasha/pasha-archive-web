import { createClient } from '@supabase/supabase-js';
import { v2 } from 'cloudinary';

const prerender = false;
v2.config({
  cloud_name: "dfluo0iya",
  api_key: "464827444694754",
  api_secret: "7KVZ4XGicAxcnVKiyFWHyFxqVBg"
});
async function POST({ request }) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401
      });
    }
    const token = authHeader.replace("Bearer ", "");
    const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltaHZjeHdrcHlhamxjeWduY2J5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDQ0OTY4MCwiZXhwIjoyMDk2MDI1NjgwfQ.4DmY5m5CuU8nv5YIlKDSlY-vHjSkhb3ixGTxe2vpkv0";
    console.log("[Reject API] authHeader prefix:", authHeader.substring(0, 25) + "...");
    console.log("[Reject API] serviceRoleKey present:", !!serviceRoleKey);
    console.log("[Reject API] token prefix:", token ? token.substring(0, 15) + "..." : "none");
    const supabaseAdmin = createClient(
      "https://imhvcxwkpyajlcygncby.supabase.co",
      serviceRoleKey || token
    );
    const {
      data: { user },
      error: authError
    } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      console.error("[Reject API] Auth error details:", authError);
      console.log("[Reject API] User object retrieved:", user);
      return new Response(JSON.stringify({ error: "Unauthorized", details: authError?.message || "Invalid session or user not found" }), {
        status: 401
      });
    }
    const { requestId, adminNote } = await request.json();
    if (!requestId) {
      return new Response(
        JSON.stringify({ error: "requestId is required" }),
        { status: 400 }
      );
    }
    const { data: memRequest, error: fetchError } = await supabaseAdmin.from("memory_requests").select("*").eq("id", requestId).single();
    if (fetchError || !memRequest) {
      return new Response(
        JSON.stringify({ error: "Memory request not found" }),
        { status: 404 }
      );
    }
    if (memRequest.status !== "pending") {
      return new Response(
        JSON.stringify({
          error: `Request is already ${memRequest.status}`
        }),
        { status: 400 }
      );
    }
    try {
      const resourceType = memRequest.type === "Video" ? "video" : "image";
      await v2.uploader.destroy(memRequest.cloudinary_public_id, {
        resource_type: resourceType
      });
    } catch (cloudinaryError) {
      console.error("Cloudinary deletion failed:", cloudinaryError);
    }
    const { error: updateError } = await supabaseAdmin.from("memory_requests").update({
      status: "rejected",
      admin_note: adminNote || null
    }).eq("id", requestId);
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

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
