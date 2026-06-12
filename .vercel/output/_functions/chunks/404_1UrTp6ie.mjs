import { c as createComponent } from './astro-component_BRqMzFq8.mjs';
import 'piccolore';
import { o as renderComponent, k as renderTemplate, m as maybeRenderHead } from './entrypoint_C29uGayX.mjs';
import { $ as $$Layout, a as $$Footer } from './Footer_CA2chA3Q.mjs';
import { $ as $$Navbar } from './Navbar_CrbcDzle.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "404 - Archive Entry Not Found" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${maybeRenderHead()}<main class="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-16"> <div class="max-w-6xl w-full grid md:grid-cols-2 gap-16 items-center"> <!-- POLAROID --> <div class="flex justify-center"> <div class="relative bg-[#faf7f1] neo-card p-4 w-[320px] rotate-[-3deg] polaroid-float"> <div class="tape blue scrapbook-tape"></div> <div class="aspect-[4/5] border-[3px] border-dashed border-black relative overflow-hidden flex items-center justify-center paper-texture"> <div class="text-center z-10"></div> <div class="absolute border-[4px] border-red-600 text-red-600 font-black text-3xl px-4 py-1 rotate-[-12deg]">
REDACTED
</div> </div> <p class="mt-5 text-center font-bold text-lg">ARCHIVE ID #404</p> </div> </div> <!-- CONTENT --> <div> <span class="inline-block bg-black text-white px-3 py-1 text-xs font-bold tracking-[0.2em] uppercase">
Lost Memory
</span> <h1 class="mt-4 text-5xl md:text-7xl font-black leading-none">
Archive Not Found
</h1> <p class="mt-6 text-lg opacity-80 max-w-xl leading-relaxed">
The memory you're looking for doesn't exist, has been removed, or was
          never captured in the archive.
</p> <div class="flex flex-wrap gap-4 mt-8"> <a href="/" class="neo-button bg-[#faf7f1] px-6 py-3 font-semibold">
← Go Home
</a> </div> <div class="mt-12 border-t-2 border-black pt-6 grid grid-cols-3 gap-6"> <div> <p class="text-xs uppercase tracking-widest opacity-50">
Archive ID
</p> <p class="font-bold mt-1">#404</p> </div> <div> <p class="text-xs uppercase tracking-widest opacity-50">Status</p> <p class="font-bold mt-1">Lost</p> </div> <div> <p class="text-xs uppercase tracking-widest opacity-50">Date</p> <p class="font-bold mt-1">Unknown</p> </div> </div> </div> </div> </main> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "C:/laragon/www/mdpashaaa-archive-web/src/pages/404.astro", void 0);

const $$file = "C:/laragon/www/mdpashaaa-archive-web/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
