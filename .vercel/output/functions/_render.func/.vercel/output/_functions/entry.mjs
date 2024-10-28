import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_DSuKdxx4.mjs';
import { manifest } from './manifest_DyZ4Kpd9.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin.astro.mjs');
const _page2 = () => import('./pages/api/bookappointment.astro.mjs');
const _page3 = () => import('./pages/api/fetchappointments.astro.mjs');
const _page4 = () => import('./pages/api/sendcancellation.astro.mjs');
const _page5 = () => import('./pages/api/sendconfirmation.astro.mjs');
const _page6 = () => import('./pages/contacts.astro.mjs');
const _page7 = () => import('./pages/gallery.astro.mjs');
const _page8 = () => import('./pages/login.astro.mjs');
const _page9 = () => import('./pages/signup.astro.mjs');
const _page10 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/admin.astro", _page1],
    ["src/pages/api/bookAppointment.js", _page2],
    ["src/pages/api/fetchAppointments.js", _page3],
    ["src/pages/api/sendCancellation.js", _page4],
    ["src/pages/api/sendConfirmation.js", _page5],
    ["src/pages/contacts.astro", _page6],
    ["src/pages/gallery.astro", _page7],
    ["src/pages/login.astro", _page8],
    ["src/pages/signup.astro", _page9],
    ["src/pages/index.astro", _page10]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "0245f912-de27-410c-86b5-3e3515af7fe9",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
