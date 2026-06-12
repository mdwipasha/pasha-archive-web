import { c as createComponent } from './astro-component_CJ15kxtp.mjs';
import 'piccolore';
import { k as createRenderInstruction, p as maybeRenderHead, j as addAttribute, u as renderTemplate } from './entrypoint_BVRuuQGF.mjs';
import 'clsx';

async function renderScript(result, id) {
  const inlined = result.inlinedScripts.get(id);
  let content = "";
  if (inlined != null) {
    if (inlined) {
      content = `<script type="module">${inlined}</script>`;
    }
  } else {
    const resolved = await result.resolve(id);
    content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"></script>`;
  }
  return createRenderInstruction({ type: "script", id, content });
}

const $$Navbar = createComponent(($$result, $$props, $$slots) => {
  const navItems = [
    { name: "Home", href: "/#home" },
    { name: "Gallery", href: "/galleries" },
    { name: "About", href: "/" }
  ];
  return renderTemplate`${maybeRenderHead()}<header class="sticky top-0 w-full border-b-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-[#F3EFE6] z-100"> <nav class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"> <a href="/" class="text-2xl font-black uppercase tracking-tighter">
Pasha Archive
</a> <!-- Desktop --> <div class="hidden md:flex items-center gap-8"> ${navItems.map((item) => renderTemplate`<a${addAttribute(item.href, "href")} class="text-sm font-semibold uppercase tracking-[0.12em] text-[#6B7280] hover:text-black transition"> ${item.name} </a>`)} </div> <!-- Mobile Button --> <button id="menu-btn" class="md:hidden flex items-center justify-center" aria-label="Open Menu"> <span class="material-symbols-outlined text-3xl">menu</span> </button> </nav> </header> <!-- Overlay --> <div id="mobile-menu" class="fixed inset-0 z-[999] translate-x-full transition-transform duration-300 ease-out bg-[#F3EFE6]"> <div class="flex items-center justify-between border-b-2 border-black px-6 py-4"> <span class="text-2xl font-black uppercase tracking-tight">
Pasha Archive
</span> <button id="close-menu"> <span class="material-symbols-outlined text-3xl">close</span> </button> </div> <div class="flex h-[calc(100vh-73px)] flex-col justify-center px-8"> ${navItems.map((item) => renderTemplate`<a${addAttribute(item.href, "href")} class="group border-b-2 border-black py-6 text-4xl font-black uppercase tracking-tight transition-all hover:translate-x-2"> <div class="flex items-center justify-between"> <span>${item.name}</span> <span class="opacity-0 transition-opacity group-hover:opacity-100">
→
</span> </div> </a>`)} <div class="mt-12 text-sm uppercase tracking-[0.2em] text-neutral-500">
Documenting moments across time.
</div> </div> </div> ${renderScript($$result, "C:/laragon/www/mdpashaaa-archive-web/src/components/Navbar.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/laragon/www/mdpashaaa-archive-web/src/components/Navbar.astro", void 0);

export { $$Navbar as $ };
