const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/BurgerMenu.BlxFKYT2.js","_astro/jsx-runtime.Dhsgnf4I.js","_astro/index.uubelm5h.js"])))=>i.map(i=>d[i]);
import{_ as a}from"./preload-helper.CLcXU_4U.js";import{j as e}from"./jsx-runtime.Dhsgnf4I.js";import{r as t}from"./index.uubelm5h.js";const d={src:"/_astro/logo.HM3criIb.png",width:1e3,height:410,format:"png"},f=t.lazy(()=>a(()=>import("./BurgerMenu.BlxFKYT2.js"),__vite__mapDeps([0,1,2])));function x(){const[l,o]=t.useState(!1),s=(i,r)=>{if(r.startsWith("#")){i.preventDefault();const n=document.querySelector(r);n?(n.scrollIntoView({behavior:"smooth"}),o(!1)):window.location.href=r}else o(!1)},c=[{id:1,link:"/#services",label:"I nostri servizi"},{id:2,link:"/gallery",label:"Gallery"},{id:3,link:"/contacts",label:"Contatti"},{id:4,link:"/#booking-section",label:"Prenota"}];return e.jsxs("div",{className:"fixed top-0 z-40 flex w-full items-center justify-between bg-white px-4 py-4 text-sm transition duration-300 ease-in-out md:px-28 lg:px-64",children:[e.jsx("a",{href:"/",children:e.jsx("img",{src:d,className:"w-16 lg:w-20",alt:"Logo"})}),e.jsxs("ul",{className:"hidden gap-10 md:flex",children:[e.jsx("li",{children:e.jsx("a",{href:"/#services",onClick:i=>s(i,"/#services"),className:"link cursor-pointer focus:font-bold focus:text-primary active:decoration-primary",children:"I NOSTRI SERVIZI"})}),e.jsx("li",{children:e.jsx("a",{href:"/gallery",onClick:i=>s(i,"/gallery"),className:"link cursor-pointer focus:font-bold focus:text-primary active:decoration-primary",children:"GALLERY"})}),e.jsx("li",{children:e.jsx("a",{href:"/contacts",onClick:i=>s(i,"/contacts"),className:"link cursor-pointer focus:font-bold focus:text-primary active:decoration-[#cfcccc]",children:"CONTATTI"})}),e.jsx("li",{children:e.jsx("a",{href:"/#booking-section",onClick:i=>s(i,"/#booking-section"),className:"link cursor-pointer focus:text-primary active:decoration-primary focus:font-bold",children:"PRENOTA"})})]}),e.jsx("div",{className:"md:hidden",children:e.jsx(t.Suspense,{fallback:e.jsx("div",{children:"Loading..."}),children:e.jsx(f,{isOpen:l,setIsOpen:o,menuItems:c})})})]})}export{x as default};