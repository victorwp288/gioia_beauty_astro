import{j as e}from"./jsx-runtime.PRPpl5vZ.js";import"./index.RYns6xqu.js";function d({isOpen:r,setIsOpen:n,menuItems:s}){return e.jsxs("div",{children:[e.jsx("button",{onClick:()=>n(!r),className:"text-gray-500 hover:text-gray-700 focus:outline-none",children:e.jsx("svg",{className:"h-6 w-6",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:r?e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M6 18L18 6M6 6l12 12"}):e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M4 6h16M4 12h16M4 18h16"})})}),r&&e.jsx("div",{className:"absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg",children:e.jsx("ul",{className:"py-1",children:s.map(o=>e.jsx("li",{children:e.jsx("a",{href:o.link,onClick:l=>{if(l.preventDefault(),o.link.startsWith("#")){const t=document.querySelector(o.link);t?t.scrollIntoView({behavior:"smooth"}):window.location.href=o.link}else window.location.href=o.link},className:"block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",children:o.label})},o.id))})})]})}export{d as default};
