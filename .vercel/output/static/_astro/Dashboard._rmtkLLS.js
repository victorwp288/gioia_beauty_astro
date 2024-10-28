import{j as e}from"./jsx-runtime.B4ELNKBR.js";import{r as t}from"./index.B80Lgev0.js";import{s as n}from"./supabaseClient.TEOPL8hC.js";import"./preload-helper.CLcXU_4U.js";const f=()=>{const[s,a]=t.useState(null),[c,i]=t.useState(!0);t.useEffect(()=>{(async()=>{try{const{data:{session:o}}=await n.auth.getSession();if(console.log("Current session:",o),!o){console.log("No session found, redirecting to login"),window.location.replace("/login");return}a(o)}catch(o){console.error("Session check error:",o),window.location.replace("/login")}finally{i(!1)}})();const{data:{subscription:d}}=n.auth.onAuthStateChange((o,r)=>{if(console.log("Auth state changed:",o,r),!r){window.location.replace("/login");return}a(r),i(!1)});return()=>d.unsubscribe()},[]);const u=async()=>{try{await n.auth.signOut(),window.location.replace("/")}catch(l){console.error("Logout error:",l)}};return c?e.jsx("div",{className:"p-4",children:"Loading..."}):s?.user?e.jsxs("div",{className:"p-4",children:[e.jsxs("h1",{className:"text-2xl font-bold mb-4",children:["Welcome to the Dashboard, ",s.user.email]}),e.jsxs("div",{className:"mb-4",children:[e.jsx("h2",{className:"text-lg font-semibold",children:"Session Info:"}),e.jsx("pre",{className:"bg-gray-100 p-2 rounded",children:JSON.stringify({email:s.user.email,id:s.user.id,role:s.user.role},null,2)})]}),e.jsx("button",{onClick:u,className:"px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700",children:"Logout"})]}):e.jsx("div",{className:"p-4",children:"Redirecting to login..."})};export{f as default};