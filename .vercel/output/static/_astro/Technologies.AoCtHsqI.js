import{j as e}from"./jsx-runtime.PRPpl5vZ.js";import{r}from"./index.RYns6xqu.js";const f=()=>{const[i,m]=r.useState(0),[a,p]=r.useState(0),s=r.useRef(null),c=()=>{const t=s.current.scrollLeft,o=s.current.offsetWidth,l=Math.round(t/o);m(l)},d=t=>{const o=s.current,l=o.offsetWidth;o.scrollTo({left:t*l,behavior:"smooth"})};r.useEffect(()=>{const t=s.current;return t.addEventListener("scroll",c),()=>{t.removeEventListener("scroll",c)}},[]),r.useEffect(()=>{const t=()=>{p(window.innerWidth)};return t(),window.addEventListener("resize",t),()=>{window.removeEventListener("resize",t)}},[]);const n=[{title:"Elettroporatore",description:"L’elettroporatore è un macchinario perfetto per trattare gli inestetismi di viso e corpo. Tramite piccoli impulsi elettrici rende le cellule più permeabili, facendo penetrare i cosmetici applicati in profondità. Perfetto per contrastare l'invecchiamento cutaneo, per pelli con rughe e macchie, per inestetismi come la perdita di tono e la cellulite."},{title:"Ossigeno dermo infusione",description:"L’ossigeno dermo infusione è una tecnologia estetica che, tramite ossigeno puro in combinazione con acido iarulonico, migliora l'idratazione, rende la pelle liftata, contrasta le rughe, drena e ossigena i tessuti. Dona alla pelle un immediato effetto di compattezza, rendendola fin da subito più liscia e luminosa."},{title:"Pressoterapia",description:"Attraverso compressioni e decompressioni graduali di specifici gambali, la pressoterapia simula un massaggio drenante manuale. Favorisce le naturali funzioni del corpo, il ritorno venoso e l'eliminazione di sostanze di scarto dell'organismo. È particolarmente indicata per chi soffre di ritenzione idrica, cellulite, gambe gonfie e adiposità."}];return e.jsxs("div",{className:"m-auto md:w-[70vw] md:py-12 py-6",children:[e.jsxs("div",{className:"m-auto w-[90vw] md:w-[70vw] flex flex-col gap-2 py-4 pb-6 md:gap-4 md:py-4",children:[e.jsx("h4",{className:"text-xs font-extrabold text-white",children:"SCOPRI"}),e.jsx("h2",{className:"font-serif text-3xl font-bold tracking-tight text-white md:text-3xl",children:"Le tecnologie"})]}),e.jsxs("div",{className:"relative",children:[e.jsx("div",{ref:s,className:"flex snap-x snap-mandatory overflow-x-scroll no-scrollbar md:grid md:grid-cols-3 md:gap-14 md:py-0",children:n.map((t,o)=>e.jsxs("div",{className:`snap-center text-white flex-col gap-2 flex min-w-[100vw] py-4 md:min-w-0 ${i===0&&o===0?"pl-6 md:pl-0":""} ${i===n.length-1&&o===n.length-1?"pl-8":""} ${i>0&&i<n.length-1?"pl-8 pr-2":""}`,children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("img",{src:"/images/tick-white.svg",width:"26",height:"26",alt:"technology indicator",className:"object-contain"}),e.jsx("h2",{className:"text-lg font-semibold",children:t.title})]}),e.jsx("p",{className:"text-sm w-[90%]",children:t.description})]},o))}),a<768&&i>0&&e.jsx("button",{onClick:()=>d(i-1),className:"absolute left-2 top-1/2 text-white rounded-full",children:e.jsx("img",{src:"/images/chevron-left.svg",alt:"left arrow",className:"w-6 h-6"})}),a<768&&i<n.length-1&&e.jsx("button",{onClick:()=>d(i+1),className:"absolute right-2 top-1/2 text-white rounded-full",children:e.jsx("img",{src:"/images/chevron-right.svg",alt:"right arrow",className:"w-6 h-6"})})]})]})};export{f as default};
