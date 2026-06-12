import { c as createComponent } from './astro-component_DqjkGFZ6.mjs';
import 'piccolore';
import { m as maybeRenderHead, k as renderTemplate, o as renderComponent } from './entrypoint_CaXNZmEO.mjs';
import { $ as $$Layout, a as $$Footer } from './Footer_k0mJAHN5.mjs';
import { $ as $$Navbar } from './Navbar_FlYiRqL1.mjs';
import 'clsx';

const $$About$1 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section class="h-screen flex items-center justify-center bg-[#F3EFE6]"> <h1 class="text-4xl font-bold text-center py-8 flex">COMING SOON</h1> </section>`;
}, "C:/laragon/www/mdpashaaa-archive-web/src/components/About.astro", void 0);

const $$About = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "About" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${renderComponent($$result2, "Abouts", $$About$1, {})} ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "C:/laragon/www/mdpashaaa-archive-web/src/pages/about.astro", void 0);

const $$file = "C:/laragon/www/mdpashaaa-archive-web/src/pages/about.astro";
const $$url = "/about";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$About,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
