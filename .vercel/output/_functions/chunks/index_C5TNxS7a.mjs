import { c as createComponent } from './astro-component_BRqMzFq8.mjs';
import 'piccolore';
import { m as maybeRenderHead, k as renderTemplate, h as addAttribute, o as renderComponent } from './entrypoint_C29uGayX.mjs';
import { $ as $$Layout, a as $$Footer } from './Footer_CA2chA3Q.mjs';
import { $ as $$Navbar } from './Navbar_CrbcDzle.mjs';
import 'clsx';
import { s as supabase } from './supabase_DGD5oBn6.mjs';

const $$Hero = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section class="px-4 md:px-14 py-18 md:py-24 paper-texture" id="home"> <div class="max-w-7xl mx-auto"> <header class="flex flex-col gap-12 md:flex-row items-end border-b-2 border-black/10 pb-12"> <div class="w-full md:w-2/3"> <div class="inline-block bg-[#F6D1D8] border-2 border-black px-6 py-3 font-bold uppercase tracking-[0.16em] mb-6">
Digital Life Archive
</div> <h1 class="text-5xl md:text-[5.5rem] font-black uppercase leading-tight tracking-[-0.04em]">
MEMORIES, MOMENTS, &amp; EVERYTHING IN BETWEEN.
</h1> </div> <div class="w-full md:w-1/3 flex flex-col gap-8 pb-4"> <p class="max-w-md text-lg leading-relaxed text-[#6B7280]">
A personal archive of memories, life phases, random moments, and
          things I don't want to forget someday. not portfolio, not a blog, just a collection of moments worth keeping.
</p> <div class="flex flex-wrap gap-4"> <a href="/galleries" class="neo-button w-full text-center bg-[#DBE9FF] border-black px-8 py-4 font-bold uppercase text-sm">
View Gallery
</a> <!-- <button class="neo-button bg-black text-white px-8 py-4 font-bold uppercase text-sm">
            Explore Timeline
          </button> --> </div> </div> </header> </div> </section>`;
}, "C:/laragon/www/mdpashaaa-archive-web/src/components/Hero.astro", void 0);

const $$RecentArchive = createComponent(async ($$result, $$props, $$slots) => {
  const { data: featuredMemories } = await supabase.from("memories").select("*").eq("featured", true).order("year", { ascending: false }).limit(3);
  const memoryIds = (featuredMemories || []).map((m) => m.id);
  let tagsByMemoryId = /* @__PURE__ */ new Map();
  if (memoryIds.length > 0) {
    const { data: memoryTagsData } = await supabase.from("memory_tags").select("memory_id, tag_id").in("memory_id", memoryIds);
    const tagIds = (memoryTagsData || []).map((row) => row.tag_id);
    if (tagIds.length > 0) {
      const { data: tagsData } = await supabase.from("tags").select("id, tag").in("id", tagIds);
      const tagsById = new Map((tagsData || []).map((tag) => [tag.id, tag.tag]));
      for (const row of memoryTagsData || []) {
        const tagName = tagsById.get(row.tag_id);
        if (tagName) {
          const current = tagsByMemoryId.get(row.memory_id) || [];
          current.push(tagName);
          tagsByMemoryId.set(row.memory_id, current);
        }
      }
    }
  }
  const memories = (featuredMemories || []).map((memory) => ({
    ...memory,
    image: memory.type === "Video" ? memory.thumbnail_url : memory.src,
    tags: tagsByMemoryId.get(memory.id) || []
  }));
  const featured = memories[0] || null;
  const sideCards = memories.slice(1, 3);
  return renderTemplate`${featured && renderTemplate`${maybeRenderHead()}<section id="gallery" class="px-6 md:px-16 py-16 md:py-24"><div class="max-w-7xl mx-auto"><div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-12 border-b-2 border-black pb-4"><h2 class="text-4xl md:text-5xl font-black uppercase tracking-[-0.03em]">
Featured Archives
</h2><a href="/galleries" class="text-sm uppercase tracking-[0.18em] text-black underline decoration-2 underline-offset-4 hover:text-[#725c00]">
See all
</a></div><div class="grid grid-cols-1 md:grid-cols-[1.4fr_0.8fr] gap-8 md:gap-12 items-start"><article class="relative bg-white border-2 border-black shadow-[6px_6px_0_rgba(0,0,0,1)] p-6 rotate-[1deg] transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1"><div class="absolute -top-3 -left-4 w-20 h-6 bg-[#F6D1D8] border-2 border-black -rotate-6 opacity-90"></div><div class="absolute -bottom-2 -right-4 w-16 h-6 bg-[#BFD9FF] border-2 border-black -rotate-3 opacity-90"></div><div class="border-2 border-black mb-6 bg-white p-2 shadow-[2px_2px_0_rgba(0,0,0,0.5)]"><img${addAttribute(featured.image, "src")}${addAttribute(featured.title ?? "Memory Image", "alt")} class="w-full h-[300px] md:h-[500px] object-cover"></div><div class="flex flex-wrap gap-2 mb-3"><span class="border-2 border-black bg-[#BFD9FF] px-3 py-1 text-xs font-semibold uppercase">${featured.tags?.[0] ?? null}</span></div><h3 class="text-3xl md:text-4xl font-black mb-2">${featured.title ?? "Untitled Memory"}</h3><p class="text-[#6B7280] leading-relaxed">${featured.date || featured.year}</p><a${addAttribute(`/galleries/${featured.slug}`, "href")} class="absolute bottom-10 right-5 w-12 h-12 rounded-full border-2 border-black bg-[#FFE680] flex items-center justify-center text-xl font-black shadow-[3px_3px_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all" aria-label="Open Memory"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6"></path></svg></a></article><div class="flex flex-col gap-12 mt-8 md:mt-0">${sideCards.map((memory, index) => renderTemplate`<article${addAttribute(`relative border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] p-5 ${index === 0 ? "bg-[#F6D1D8]" : "bg-[#DBE9FF]"} ${index === 0 ? "-rotate-2" : "rotate-1"} transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1`, "class")}><div class="border-2 border-black mb-4 bg-white p-2"><img${addAttribute(memory.image, "src")}${addAttribute(memory.title ?? "Memory Image", "alt")} class="w-full h-[220px] object-cover rounded-xl"></div><h3 class="text-2xl font-black mb-2">${memory.title ?? "Untitled Memory"}</h3><p class="text-[#6B7280] leading-relaxed">${memory.date || memory.year}</p><a${addAttribute(`/galleries/${memory.slug}`, "href")} class="absolute bottom-8 right-5 w-10 h-10 rounded-full border-2 border-black bg-white flex items-center justify-center text-lg font-black shadow-[2px_2px_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all" aria-label="Open Memory"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6"></path></svg></a></article>`)}</div></div></div></section>`}`;
}, "C:/laragon/www/mdpashaaa-archive-web/src/components/RecentArchive.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Home" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${renderComponent($$result2, "Hero", $$Hero, {})} ${renderComponent($$result2, "RecentArchive", $$RecentArchive, {})} ${renderComponent($$result2, "MemoriesMap", null, { "client:only": true, "client:component-hydration": "only", "client:component-path": "C:/laragon/www/mdpashaaa-archive-web/src/components/MemoriesMap", "client:component-export": "default" })} ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "C:/laragon/www/mdpashaaa-archive-web/src/pages/index.astro", void 0);

const $$file = "C:/laragon/www/mdpashaaa-archive-web/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
