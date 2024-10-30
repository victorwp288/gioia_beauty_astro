import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_B07ZIN_H.mjs';
import { manifest } from './manifest_IkJm4VE6.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin.astro.mjs');
const _page2 = () => import('./pages/api/bookappointment.astro.mjs');
const _page3 = () => import('./pages/api/fetchappointments.astro.mjs');
const _page4 = () => import('./pages/api/sendcancellation.astro.mjs');
const _page5 = () => import('./pages/api/sendconfirmation.astro.mjs');
const _page6 = () => import('./pages/contacts.astro.mjs');
const _page7 = () => import('./pages/gallery.astro.mjs');
const _page8 = () => import('./pages/login.astro.mjs');
const _page9 = () => import('./pages/robots.txt.astro.mjs');
const _page10 = () => import('./pages/signup.astro.mjs');
const _page11 = () => import('./pages/sitemap.xml.astro.mjs');
const _page12 = () => import('./pages/unsubscribe.astro.mjs');
const _page13 = () => import('./pages/index.astro.mjs');

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
    ["src/pages/robots.txt.js", _page9],
    ["src/pages/signup.astro", _page10],
    ["src/pages/sitemap.xml.js", _page11],
    ["src/pages/unsubscribe.astro", _page12],
    ["src/pages/index.astro", _page13]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "32b41918-cf8a-43e0-a063-dd9c8b90bb35",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
