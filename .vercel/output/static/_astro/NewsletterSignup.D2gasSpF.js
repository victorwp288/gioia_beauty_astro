import{j as e}from"./jsx-runtime.PRPpl5vZ.js";import{r as a}from"./index.RYns6xqu.js";const c=()=>{const[r,s]=a.useState(""),[i,l]=a.useState(""),n=t=>{t.preventDefault(),l("Iscrizione avvenuta con successo!"),s("")};return e.jsx("div",{className:"w-full bg-rose-200 mt-16 py-12 text-center",children:e.jsxs("div",{className:"max-w-md mx-auto mt-10 md:w-full md:mt-0",children:[e.jsxs("div",{className:"text-white px-4 pt-6",children:[e.jsx("h2",{className:"font-bold text-2xl pb-4",children:"Newsletter"}),e.jsx("p",{className:"text-sm",children:"Per rimanere aggiornato sulle offerte e promozioni, puoi iscriverti alla newsletter mensile che, ogni primo giorno del mese, arriverà nella tua casella di posta."})]}),e.jsxs("form",{onSubmit:n,className:"flex flex-col gap-2 container mt-12",children:[e.jsx("input",{type:"email",value:r,onChange:t=>s(t.target.value),placeholder:"Inserisci la tua mail",required:!0,className:"bg-primary placeholder-white text-white p-2 rounded"}),e.jsx("button",{className:"text-primary inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:shadow disabled:pointer-events-none disabled:opacity-50 bg-white hover:bg-gray-100 h-10 px-4 py-2 mt-3",type:"submit",children:"Iscriviti alla newsletter"})]}),i&&e.jsx("div",{className:"mt-4 text-white",children:i})]})})};export{c as default};
