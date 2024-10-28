import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_DSuKdxx4.mjs';
import { manifest } from './manifest_CG4PyKr3.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin.astro.mjs');
const _page2 = () => import('./pages/api/bookappointment.astro.mjs');
const _page3 = () => import('./pages/api/fetchappointments.astro.mjs');
const _page4 = () => import('./pages/contacts.astro.mjs');
const _page5 = () => import('./pages/gallery.astro.mjs');
const _page6 = () => import('./pages/login.astro.mjs');
const _page7 = () => import('./pages/signup.astro.mjs');
const _page8 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/admin.astro", _page1],
    ["src/pages/api/bookAppointment.js", _page2],
    ["src/pages/api/fetchAppointments.js", _page3],
    ["src/pages/contacts.astro", _page4],
    ["src/pages/gallery.astro", _page5],
    ["src/pages/login.astro", _page6],
    ["src/pages/signup.astro", _page7],
    ["src/pages/index.astro", _page8]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "20063d75-deec-4f4f-a0ec-a7494c8e28fc",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
