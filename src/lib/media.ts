type ImageSize = {
  width: number;
  height?: number;
};

/**
 * Uses Cloudinary's automatic format/quality and a size suited to the render slot.
 * Non-Cloudinary URLs are returned unchanged so local and external media keep working.
 */
export function getOptimizedImageUrl(url: string | null | undefined, size: ImageSize) {
  if (!url || !url.includes("res.cloudinary.com/") || !url.includes("/upload/")) {
    return url || "";
  }

  const crop = size.height ? `,c_fill,h_${size.height}` : ",c_limit";
  const transforms = `f_auto,q_auto,dpr_auto,w_${size.width}${crop}`;
  return url.replace("/upload/", `/upload/${transforms}/`);
}
