import { v2 } from 'cloudinary';

const prerender = false;
v2.config({
  cloud_name: "dfluo0iya",
  api_key: "464827444694754",
  api_secret: "7KVZ4XGicAxcnVKiyFWHyFxqVBg"
});
async function POST({ request }) {
  try {
    const { publicId, type } = await request.json();
    const result = await v2.uploader.destroy(publicId, {
      resource_type: type === "Video" ? "video" : "image"
    });
    return new Response(JSON.stringify(result), {
      status: 200
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        error: error.message
      }),
      {
        status: 500
      }
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
