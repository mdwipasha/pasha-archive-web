import { c as createComponent } from './astro-component_Cm1CKSpY.mjs';
import 'piccolore';
import { h as addAttribute, q as renderHead, v as renderSlot, k as renderTemplate, m as maybeRenderHead } from './entrypoint_BLBYqHYh.mjs';
import 'clsx';

const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="generator"${addAttribute(Astro2.generator, "content")}><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="icon" href="/favicon.ico"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="icon" type="image/png" sizes="32x32" href="/favicon.svg"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet"><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"><title>${title} - Pasha Archive</title>${renderHead()}</head> <body class="min-h-screen bg-[#F3EFE6] text-[#111111] font-sans overflow-x-hidden"> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "C:/laragon/www/mdpashaaa-archive-web/src/layouts/Layout.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<footer class="w-full mt-16 border-t-2 border-black bg-[#ECE6D8]"> <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-12 md:flex-row md:px-10"> <div class="text-2xl font-black uppercase tracking-[0.25em] text-black">
Pasha Archive
</div> <div class="text-center text-sm capitalize tracking-[0.1em] text-[#6B7280] md:text-left">
Designed by <a href="https://github.com/mdwipasha" class="hover:text-black underline transition-all duration-300" target="_blank" rel="noopener noreferrer">Capa.</a> </div> </div> </footer>`;
}, "C:/laragon/www/mdpashaaa-archive-web/src/components/Footer.astro", void 0);

export { $$Layout as $, $$Footer as a };
