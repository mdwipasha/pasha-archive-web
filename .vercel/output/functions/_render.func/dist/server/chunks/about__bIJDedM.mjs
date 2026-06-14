import { c as createComponent } from './astro-component_FQePYB_a.mjs';
import 'piccolore';
import { m as maybeRenderHead, k as renderTemplate, o as renderComponent } from './entrypoint_CSZW9EA2.mjs';
import { $ as $$Layout, a as $$Footer } from './Footer_c_KphKF2.mjs';
import { $ as $$Navbar } from './Navbar_9haCsZMI.mjs';
import 'clsx';

const $$About$1 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section class="h-screen flex items-center justify-center bg-[#F3EFE6]"> <h1 class="text-4xl font-bold text-center py-8 flex">COMING SOON</h1> </section>`;
}, "D:/CODING/pasha-archive-web/src/components/About.astro", void 0);

const $$About = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "About" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${renderComponent($$result2, "Abouts", $$About$1, {})} ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "D:/CODING/pasha-archive-web/src/pages/about.astro", void 0);

const $$file = "D:/CODING/pasha-archive-web/src/pages/about.astro";
const $$url = "/about";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$About,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
