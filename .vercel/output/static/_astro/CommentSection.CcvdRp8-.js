import{a as p}from"./index.CmLIgCVx.js";import{s as y}from"./supabase.B-vMg_pf.js";function E({show:e,success:t,message:n}){return React.createElement("div",{className:`
        fixed
        bottom-6
        right-6
        z-50
        flex
        items-center
        gap-3
        px-5
        py-4
        bg-black
        text-white
        text-sm
        font-semibold
        shadow-[4px_4px_0px_0px_rgba(191,217,255,1)]
        transition-all
        duration-300
        ${e?"translate-y-0 opacity-100":"translate-y-20 opacity-0 pointer-events-none"}
      `},React.createElement("span",{className:"material-symbols-outlined text-base"},t?"check_circle":"error"),React.createElement("span",null,n))}function R({memoryId:e,onCommentAdded:t,parentId:n=null}){const[c,l]=p.useState(""),[o,r]=p.useState(""),[i,u]=p.useState(!1),[m,x]=p.useState({show:!1,success:!0,message:""});function g(s,f=!0){x({show:!0,success:f,message:s}),setTimeout(()=>{x(b=>({...b,show:!1}))},3500)}async function a(){const s=c.trim()||"Anonymous",f=o.trim();if(!f){g("Please write a comment before posting.",!1);return}try{u(!0);const{data:b,error:h}=await y.from("memory_comments").insert({memory_id:e,username:s,comment:f,parent_id:n}).select().single();if(h)throw h;t?.(b),l(""),r(""),g("Comment posted!",!0)}catch(b){console.error(b),g(b?.message||"Unable to post comment.",!1)}finally{u(!1)}}function d(s){(s.ctrlKey||s.metaKey)&&s.key==="Enter"&&a()}return React.createElement(React.Fragment,null,React.createElement("section",{className:"relative"},React.createElement("div",{className:`\r
            absolute\r
            -top-4\r
            -right-4\r
            z-10\r
            w-12\r
            h-12\r
            flex\r
            items-center\r
            justify-center\r
            bg-black\r
            text-white\r
            rounded-full\r
            shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]\r
          `},React.createElement("span",{className:"material-symbols-outlined text-base"},"edit")),React.createElement("div",{className:`\r
            bg-white\r
            p-8\r
            border-2\r
            border-black\r
            shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]\r
          `},React.createElement("label",{className:`\r
              block\r
              text-sm\r
              uppercase\r
              tracking-[0.2em]\r
              font-semibold\r
              mb-1\r
            `},"Name"),React.createElement("input",{type:"text",maxLength:60,autoComplete:"name",value:c,onChange:s=>l(s.target.value),placeholder:"Your name (optional)",className:`\r
              w-full\r
              h-10\r
              px-4\r
              bg-transparent\r
              border-2\r
              border-black\r
              outline-none\r
              transition-all\r
              mb-5\r
              focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]\r
            `}),React.createElement("label",{className:`\r
              block\r
              text-sm\r
              uppercase\r
              tracking-[0.2em]\r
              font-semibold\r
              mb-1\r
            `},"Add a thought to the archive"),React.createElement("textarea",{rows:4,maxLength:500,value:o,onChange:s=>r(s.target.value),onKeyDown:d,placeholder:"Write your comment here…",className:`\r
              w-full\r
              px-4\r
              py-3\r
              bg-transparent\r
              border-2\r
              border-black\r
              outline-none\r
              transition-all\r
              resize-none\r
              focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]\r
            `}),React.createElement("div",{className:"flex items-center justify-between mt-1 mb-5"},React.createElement("span",{className:"text-[11px] text-slate-400 tabular-nums"},o.length," / 500")),React.createElement("button",{onClick:a,disabled:i,className:`\r
              cursor-pointer\r
              px-8\r
              py-3\r
              bg-black\r
              text-white\r
              text-sm\r
              font-semibold\r
              shadow-[4px_4px_0px_0px_rgba(191,217,255,1)]\r
              hover:translate-x-1\r
              hover:translate-y-1\r
              transition-transform\r
              disabled:opacity-50\r
              disabled:pointer-events-none\r
            `},i?"Posting...":"Post Comment"))),React.createElement(E,{show:m.show,success:m.success,message:m.message}))}const w=["bg-[#FFD6A5]","bg-[#FDFFB6]","bg-[#CAFFBF]","bg-[#9BF6FF]","bg-[#A0C4FF]","bg-[#BDB2FF]","bg-[#FFC6FF]","bg-[#FFADAD]"];function N(e="Anonymous"){const t=[...e].reduce((n,c)=>n+c.charCodeAt(0),0);return w[t%w.length]}function _(e){if(!e)return"Just now";const t=new Date,n=new Date(e),c=t-n,l=Math.floor(c/1e3),o=Math.floor(l/60),r=Math.floor(o/60),i=Math.floor(r/24);return l<60?"Just now":o<60?`${o} min${o>1?"s":""} ago`:r<24?`${r} hour${r>1?"s":""} ago`:i===1?"Yesterday":i<7?`${i} days ago`:n.toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}function v(e){return e.split(" ").filter(Boolean).map(t=>t[0]).join("").slice(0,2).toUpperCase()}function k({comment:e,index:t,replies:n=[],onReply:c}){const[l,o]=p.useState(!1);return React.createElement("article",{className:"group relative"},React.createElement("div",{className:`
          bg-white
          p-6
          border-2
          border-black
          shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
          group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
          transition-all
          ${t%2===0?"rotate-[0.4deg]":"rotate-[-0.3deg]"}
        `},React.createElement("div",{className:"flex items-start gap-3 mb-4"},React.createElement("div",{className:`
              w-10
              h-10
              bg-[#F6D1D8]
              border-2
              border-black
              flex
              items-center
              justify-center
              font-bold
              text-sm
              shrink-0
             ${N(e.username)}
            `},v(e.username||"Anonymous")),React.createElement("div",null,React.createElement("p",{className:"text-sm font-semibold leading-tight"},e.username||"Anonymous"),React.createElement("time",{className:"text-[10px] uppercase tracking-[0.2em] text-slate-500"},_(e.created_at)))),React.createElement("p",{className:"text-base leading-relaxed text-[#111111] whitespace-pre-wrap wrap-break-word"},e.comment),React.createElement("div",{className:"flex items-center gap-4 mt-4"},React.createElement("button",{onClick:()=>c(e),className:`\r
            text-xs\r
            uppercase\r
            tracking-[0.15em]\r
            font-bold\r
            hover:underline\r
          `},"↩ Reply"),n.length>0&&React.createElement("button",{onClick:()=>o(!l),className:`\r
              text-xs\r
              uppercase\r
              tracking-[0.15em]\r
              text-slate-500\r
              hover:underline\r
            `},l?"Hide replies":`View ${n.length} repl${n.length>1?"ies":"y"}`)),l&&n.length>0&&React.createElement("div",{className:`\r
            mt-5\r
            ml-6\r
            pl-5\r
            border-l-2\r
          border-black/20\r
            space-y-4\r
          `},n.map(r=>React.createElement("div",{key:r.id,className:`\r
              bg-[#FFFDF8]\r
                border-2\r
              border-black\r
                p-4\r
              `},React.createElement("div",{className:"mb-2"},React.createElement("p",{className:"font-semibold text-sm"},r.username),React.createElement("time",{className:"text-[10px] uppercase tracking-[0.15em] text-slate-500"},_(r.created_at))),React.createElement("p",{className:"text-sm whitespace-pre-wrap"},r.comment))))))}function D(e){const{memoryId:t,initialComments:n=[]}=e,[c,l]=p.useState(n),[o,r]=p.useState(!1),[i,u]=p.useState(null);p.useEffect(()=>{async function a(){const{data:d,error:s}=await y.from("memory_comments").select("id, memory_id, username, comment, created_at, parent_id").eq("memory_id",t).order("created_at",{ascending:!1});!s&&d&&l(d)}a()},[t]);const m=c.filter(a=>a.parent_id===null||a.parent_id===void 0);function x(a){l(d=>[a,...d])}const g=o?m:m.slice(0,3);return React.createElement("div",{className:"space-y-12"},React.createElement(R,{memoryId:t,onCommentAdded:x}),i&&React.createElement("div",{className:`\r
          bg-[#FFFDF8]\r
          border-2\r
          border-black\r
          p-4\r
          mb-8\r
          shadow-[4px_4px_0_rgba(0,0,0,1)]\r
        `},React.createElement("div",{className:"flex justify-between items-center mb-3"},React.createElement("p",{className:"text-sm"},"Replying to ",React.createElement("strong",null,i.username)),React.createElement("button",{onClick:()=>u(null),className:"text-xs uppercase"},"Cancel")),React.createElement(R,{memoryId:t,parentId:i.id,onCommentAdded:a=>{x(a),u(null)}})),React.createElement("section",{"aria-label":"Reflections"},React.createElement("div",{className:"flex items-center gap-3 mb-6"},React.createElement("h2",{className:"text-sm uppercase tracking-[0.2em] font-semibold"},"Comments"),React.createElement("span",{className:`\r
              text-xs\r
              bg-black\r
              text-white\r
              px-2\r
              py-0.5\r
              font-bold\r
              tabular-nums\r
            `},m.length)),React.createElement("div",{className:"space-y-6 relative"},React.createElement("div",{className:`\r
              absolute\r
              left-5\r
              top-0\r
              bottom-0\r
              w-[3px]\r
              bg-black/20\r
              -z-10\r
            `,"aria-hidden":"true"}),m.length===0?React.createElement("div",{className:`\r
                bg-white\r
                p-8\r
                border-2\r
                border-black\r
                shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]\r
              `},React.createElement("p",{className:"text-base text-[#111111]"},"No Comments yet. Be the first to leave one.")):React.createElement(React.Fragment,null,g.map((a,d)=>React.createElement(k,{key:a.id,comment:a,index:d,replies:c.filter(s=>s.parent_id===a.id),onReply:u})),m.length>3&&!o&&React.createElement("button",{onClick:()=>r(!0),className:`\r
                    mt-6\r
                    w-full\r
                    px-4\r
                    py-2\r
                    cursor-pointer\r
                    border-2 \r
                    border-black \r
                    bg-[#FFFDF8] \r
                    uppercase \r
                    tracking-[0.18em] \r
                    text-sm \r
                    font-black \r
                    shadow-[4px_4px_0_rgba(0,0,0,1)] \r
                    transition-all duration-200 \r
                    hover:translate-x-[2px] \r
                    hover:translate-y-[2px] \r
                    hover:shadow-none\r
                  `},"View More (",m.length-3," more)"),o&&m.length>3&&React.createElement("button",{onClick:()=>r(!1),className:`\r
                   mt-6\r
                    w-full\r
                    px-4\r
                    py-2\r
                    cursor-pointer\r
                    border-2 \r
                    border-black \r
                    bg-[#FFFDF8] \r
                    uppercase \r
                    tracking-[0.18em] \r
                    text-sm \r
                    font-black \r
                    shadow-[4px_4px_0_rgba(0,0,0,1)] \r
                    transition-all duration-200 \r
                    hover:translate-x-[2px] \r
                    hover:translate-y-[2px] \r
                    hover:shadow-none\r
                  `},"Show Less")))))}export{D as default};
