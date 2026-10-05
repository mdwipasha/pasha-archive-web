import { SITE, getAbsoluteUrl } from "../config/seo";
import { supabase } from "../lib/supabase";

const staticPages = ["/", "/about", "/galleries", "/submit-memory"];

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export async function GET() {
  const { data } = await supabase
    .from("memories")
    .select("slug")
    .eq("visibility", "public")
    .not("slug", "is", null);
  const memoryPages = (data || []).map((memory) => `/galleries/${memory.slug}`);
  const urls = [...staticPages, ...memoryPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (path) => `  <url>
    <loc>${escapeXml(getAbsoluteUrl(path))}</loc>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
