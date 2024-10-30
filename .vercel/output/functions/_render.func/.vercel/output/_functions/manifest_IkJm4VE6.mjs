import 'cookie';
import 'kleur/colors';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_Bz1HOx7w.mjs';
import 'es-module-lexer';
import { g as decodeKey } from './chunks/astro/server_DIC2AA-k.mjs';
import 'clsx';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/victo/code/gioia_beauty_astro/","adapterName":"@astrojs/vercel/serverless","routes":[{"file":"admin/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/admin","isIndex":false,"type":"page","pattern":"^\\/admin\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin.astro","pathname":"/admin","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"api/bookAppointment","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/bookappointment","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/bookAppointment\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"bookAppointment","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/bookAppointment.js","pathname":"/api/bookAppointment","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"api/fetchAppointments","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/fetchappointments","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/fetchAppointments\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"fetchAppointments","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/fetchAppointments.js","pathname":"/api/fetchAppointments","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"contacts/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/contacts","isIndex":false,"type":"page","pattern":"^\\/contacts\\/?$","segments":[[{"content":"contacts","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contacts.astro","pathname":"/contacts","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"gallery/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/gallery","isIndex":false,"type":"page","pattern":"^\\/gallery\\/?$","segments":[[{"content":"gallery","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/gallery.astro","pathname":"/gallery","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"login/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/login","isIndex":false,"type":"page","pattern":"^\\/login\\/?$","segments":[[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/login.astro","pathname":"/login","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"robots.txt","links":[],"scripts":[],"styles":[],"routeData":{"route":"/robots.txt","isIndex":false,"type":"endpoint","pattern":"^\\/robots\\.txt\\/?$","segments":[[{"content":"robots.txt","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/robots.txt.js","pathname":"/robots.txt","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"signup/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/signup","isIndex":false,"type":"page","pattern":"^\\/signup\\/?$","segments":[[{"content":"signup","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/signup.astro","pathname":"/signup","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"sitemap.xml","links":[],"scripts":[],"styles":[],"routeData":{"route":"/sitemap.xml","isIndex":false,"type":"endpoint","pattern":"^\\/sitemap\\.xml\\/?$","segments":[[{"content":"sitemap.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/sitemap.xml.js","pathname":"/sitemap.xml","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"unsubscribe/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/unsubscribe","isIndex":false,"type":"page","pattern":"^\\/unsubscribe\\/?$","segments":[[{"content":"unsubscribe","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/unsubscribe.astro","pathname":"/unsubscribe","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[],"routeData":{"route":"/api/sendcancellation","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/sendCancellation\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"sendCancellation","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/sendCancellation.js","pathname":"/api/sendCancellation","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"stage":"head-inline","children":"window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };\n\t\tvar script = document.createElement('script');\n\t\tscript.defer = true;\n\t\tscript.src = '/_vercel/insights/script.js';\n\t\tvar head = document.querySelector('head');\n\t\thead.appendChild(script);\n\t"}],"styles":[],"routeData":{"route":"/api/sendconfirmation","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/sendConfirmation\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"sendConfirmation","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/sendConfirmation.js","pathname":"/api/sendConfirmation","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"site":"https://your-website.com","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/victo/code/gioia_beauty_astro/src/pages/admin.astro",{"propagation":"none","containsHead":true}],["C:/Users/victo/code/gioia_beauty_astro/src/pages/login.astro",{"propagation":"none","containsHead":true}],["C:/Users/victo/code/gioia_beauty_astro/src/pages/signup.astro",{"propagation":"none","containsHead":true}],["C:/Users/victo/code/gioia_beauty_astro/src/pages/contacts.astro",{"propagation":"none","containsHead":true}],["C:/Users/victo/code/gioia_beauty_astro/src/pages/gallery.astro",{"propagation":"none","containsHead":true}],["C:/Users/victo/code/gioia_beauty_astro/src/pages/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/victo/code/gioia_beauty_astro/src/pages/unsubscribe.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(o,t)=>{let i=async()=>{await(await o())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-page:src/pages/admin@_@astro":"pages/admin.astro.mjs","\u0000@astro-page:src/pages/api/bookAppointment@_@js":"pages/api/bookappointment.astro.mjs","\u0000@astro-page:src/pages/api/fetchAppointments@_@js":"pages/api/fetchappointments.astro.mjs","\u0000@astro-page:src/pages/contacts@_@astro":"pages/contacts.astro.mjs","\u0000@astro-page:src/pages/robots.txt@_@js":"pages/robots.txt.astro.mjs","\u0000@astro-page:src/pages/sitemap.xml@_@js":"pages/sitemap.xml.astro.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/api/sendCancellation@_@js":"pages/api/sendcancellation.astro.mjs","\u0000@astro-page:src/pages/api/sendConfirmation@_@js":"pages/api/sendconfirmation.astro.mjs","\u0000@astro-page:src/pages/gallery@_@astro":"pages/gallery.astro.mjs","\u0000@astro-page:src/pages/login@_@astro":"pages/login.astro.mjs","\u0000@astro-page:src/pages/signup@_@astro":"pages/signup.astro.mjs","\u0000@astro-page:src/pages/unsubscribe@_@astro":"pages/unsubscribe.astro.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","C:/Users/victo/code/gioia_beauty_astro/node_modules/astro/dist/env/setup.js":"chunks/astro/env-setup_Cr6XTFvb.mjs","C:/Users/victo/code/gioia_beauty_astro/node_modules/@astrojs/react/vnode-children.js":"chunks/vnode-children_BkR_XoPb.mjs","C:/Users/victo/code/gioia_beauty_astro/src/components/react/BurgerMenu.jsx":"_astro/BurgerMenu.BlxFKYT2.js","\u0000@astrojs-manifest":"manifest_IkJm4VE6.mjs","C:/Users/victo/code/gioia_beauty_astro/src/components/react/GalleryClient.jsx":"_astro/GalleryClient.CAI-tCaw.js","C:/Users/victo/code/gioia_beauty_astro/src/components/react/LoginForm.jsx":"_astro/LoginForm.DJmQMNPj.js","C:/Users/victo/code/gioia_beauty_astro/src/components/react/SignupForm.jsx":"_astro/SignupForm.CRqe9UDO.js","C:/Users/victo/code/gioia_beauty_astro/src/components/react/UnsubscribeForm":"_astro/UnsubscribeForm.CLrLi5LK.js","C:/Users/victo/code/gioia_beauty_astro/src/components/react/NewsletterSignup.jsx":"_astro/NewsletterSignup.BDpp6rxi.js","/astro/hoisted.js?q=0":"_astro/hoisted.92EllTQZ.js","C:/Users/victo/code/gioia_beauty_astro/src/components/react/Navbar.jsx":"_astro/Navbar.CelwJExs.js","@astrojs/react/client.js":"_astro/client.Ctjm0SqP.js","C:/Users/victo/code/gioia_beauty_astro/src/components/react/Technologies.jsx":"_astro/Technologies.dEOXyey7.js","C:/Users/victo/code/gioia_beauty_astro/src/components/react/Map.jsx":"_astro/Map.CWB3s0T5.js","C:/Users/victo/code/gioia_beauty_astro/src/components/react/Dashboard":"_astro/Dashboard.B_IW1VG6.js","C:/Users/victo/code/gioia_beauty_astro/src/components/react/AppointmentForm.jsx":"_astro/AppointmentForm.YL18Zlxj.js","/astro/hoisted.js?q=1":"_astro/hoisted.C4Y-xgaG.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/chevron-left.9cHszsJI.svg","/_astro/tick-white.ERGbEr2K.svg","/_astro/chevron-right.DkrnMVAd.svg","/_astro/gioia-portrait.CgvfbhzR.jpg","/_astro/reception4.CPFVN0sk.jpg","/_astro/gioia-portrait-square.Bxi2hheF.jpg","/_astro/rituale.BQwCXjsq.jpg","/_astro/clock.BwfWGzjZ.svg","/_astro/tick.Bc4ec0vo.svg","/_astro/ceretta.BjsjkFhp.jpg","/_astro/logo.HM3criIb.png","/_astro/admin.BWTBX5W1.css","/_astro/contacts.ChR5IsxK.css","/favicon.svg","/ogimage.png","/_astro/AppointmentForm.YL18Zlxj.js","/_astro/browser.GpdNoz3E.js","/_astro/BurgerMenu.BlxFKYT2.js","/_astro/client.Ctjm0SqP.js","/_astro/clsx.BxO5_u5y.js","/_astro/Dashboard.B_IW1VG6.js","/_astro/GalleryClient.CAI-tCaw.js","/_astro/hoisted.92EllTQZ.js","/_astro/hoisted.C4Y-xgaG.js","/_astro/index.BYMnT60G.js","/_astro/index.uubelm5h.js","/_astro/jsx-runtime.Dhsgnf4I.js","/_astro/LoginForm.DJmQMNPj.js","/_astro/Map.CWB3s0T5.js","/_astro/Map.Dgihpmma.css","/_astro/Navbar.CelwJExs.js","/_astro/NewsletterSignup.BDpp6rxi.js","/_astro/preload-helper.CLcXU_4U.js","/_astro/SignupForm.CRqe9UDO.js","/_astro/supabaseClient.Cy5zftba.js","/_astro/Technologies.dEOXyey7.js","/_astro/UnsubscribeForm.CLrLi5LK.js","/admin/index.html","/api/bookAppointment","/api/fetchAppointments","/contacts/index.html","/gallery/index.html","/login/index.html","/robots.txt","/signup/index.html","/sitemap.xml","/unsubscribe/index.html","/index.html"],"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"key":"wJspg4g23lRROQdR6/zmzPVGx7aghf6pQlRfwaIUN40=","experimentalEnvGetSecretEnabled":false});

export { manifest };
