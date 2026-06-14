import { createClient } from '@supabase/supabase-js';

const prerender = false;
function generateSlug(text) {
  return text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}
async function POST({ request }) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401
      });
    }
    const token = authHeader.replace("Bearer ", "");
    const serviceRoleKey = undefined                                         ;
    const supabaseAdmin = createClient(
      "https://imhvcxwkpyajlcygncby.supabase.co",
      serviceRoleKey || token
    );
    const {
      data: { user },
      error: authError
    } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401
      });
    }
    const { requestId } = await request.json();
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
    const slug = generateSlug(memRequest.title);
    const year = memRequest.date ? new Date(memRequest.date).getFullYear() : null;
    const { error: insertError } = await supabaseAdmin.from("memories").insert({
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
      longitude: memRequest.longitude
    });
    if (insertError) {
      console.error("Insert into memories failed:", insertError);
      return new Response(
        JSON.stringify({ error: insertError.message }),
        { status: 500 }
      );
    }
    const { error: updateError } = await supabaseAdmin.from("memory_requests").update({
      status: "approved",
      approved_at: (/* @__PURE__ */ new Date()).toISOString(),
      approved_by: user.email
    }).eq("id", requestId);
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

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
