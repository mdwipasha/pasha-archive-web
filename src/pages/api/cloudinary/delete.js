export const prerender = false;

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,

  api_key: import.meta.env.CLOUDINARY_API_KEY,

  api_secret: import.meta.env.CLOUDINARY_API_SECRET,
});

export async function POST({ request }) {
  try {
    const { publicId, type } = await request.json();

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: type === "Video" ? "video" : "image",
    });

    return new Response(JSON.stringify(result), {
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
      },
    );
  }
}
