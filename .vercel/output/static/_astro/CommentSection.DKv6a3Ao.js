import{j as e,s as N}from"./supabase._72BvvrS.js";import{a as x}from"./index.CmLIgCVx.js";function v({show:n,success:r,message:t}){return e.jsxs("div",{className:`
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
        ${n?"translate-y-0 opacity-100":"translate-y-20 opacity-0 pointer-events-none"}
      `,children:[e.jsx("span",{className:"material-symbols-outlined text-base",children:r?"check_circle":"error"}),e.jsx("span",{children:t})]})}function j({memoryId:n,onCommentAdded:r,parentId:t=null}){const[c,i]=x.useState(""),[l,s]=x.useState(""),[d,h]=x.useState(!1),[m,b]=x.useState({show:!1,success:!0,message:""});function g(o,f=!0){b({show:!0,success:f,message:o}),setTimeout(()=>{b(u=>({...u,show:!1}))},3500)}async function a(){const o=c.trim()||"Anonymous",f=l.trim();if(!f){g("Please write a comment before posting.",!1);return}try{h(!0);const{data:u,error:w}=await N.from("memory_comments").insert({memory_id:n,username:o,comment:f,parent_id:t}).select().single();if(w)throw w;r?.(u),i(""),s(""),g("Comment posted!",!0)}catch(u){console.error(u),g(u?.message||"Unable to post comment.",!1)}finally{h(!1)}}function p(o){(o.ctrlKey||o.metaKey)&&o.key==="Enter"&&a()}return e.jsxs(e.Fragment,{children:[e.jsxs("section",{className:"relative",children:[e.jsx("div",{className:`\r
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
          `,children:e.jsx("span",{className:"material-symbols-outlined text-base",children:"edit"})}),e.jsxs("div",{className:`\r
            bg-white\r
            p-8\r
            border-2\r
            border-black\r
            shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]\r
          `,children:[e.jsx("label",{className:`\r
              block\r
              text-sm\r
              uppercase\r
              tracking-[0.2em]\r
              font-semibold\r
              mb-1\r
            `,children:"Name"}),e.jsx("input",{type:"text",maxLength:60,autoComplete:"name",value:c,onChange:o=>i(o.target.value),placeholder:"Your name (optional)",className:`\r
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
            `}),e.jsx("label",{className:`\r
              block\r
              text-sm\r
              uppercase\r
              tracking-[0.2em]\r
              font-semibold\r
              mb-1\r
            `,children:"Add a thought to the archive"}),e.jsx("textarea",{rows:4,maxLength:500,value:l,onChange:o=>s(o.target.value),onKeyDown:p,placeholder:"Write your comment here…",className:`\r
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
            `}),e.jsx("div",{className:"flex items-center justify-between mt-1 mb-5",children:e.jsxs("span",{className:"text-[11px] text-slate-400 tabular-nums",children:[l.length," / 500"]})}),e.jsx("button",{onClick:a,disabled:d,className:`\r
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
            `,children:d?"Posting...":"Post Comment"})]})]}),e.jsx(v,{show:m.show,success:m.success,message:m.message})]})}const _=["bg-[#FFD6A5]","bg-[#FDFFB6]","bg-[#CAFFBF]","bg-[#9BF6FF]","bg-[#A0C4FF]","bg-[#BDB2FF]","bg-[#FFC6FF]","bg-[#FFADAD]"];function F(n="Anonymous"){const r=[...n].reduce((t,c)=>t+c.charCodeAt(0),0);return _[r%_.length]}function y(n){if(!n)return"Just now";const r=new Date,t=new Date(n),c=r-t,i=Math.floor(c/1e3),l=Math.floor(i/60),s=Math.floor(l/60),d=Math.floor(s/24);return i<60?"Just now":l<60?`${l} min${l>1?"s":""} ago`:s<24?`${s} hour${s>1?"s":""} ago`:d===1?"Yesterday":d<7?`${d} days ago`:t.toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}function k(n){return n.split(" ").filter(Boolean).map(r=>r[0]).join("").slice(0,2).toUpperCase()}function C({comment:n,index:r,replies:t=[],onReply:c}){const[i,l]=x.useState(!1);return e.jsx("article",{className:"group relative",children:e.jsxs("div",{className:`
          bg-white
          p-6
          border-2
          border-black
          shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
          group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
          transition-all
          ${r%2===0?"rotate-[0.4deg]":"rotate-[-0.3deg]"}
        `,children:[e.jsxs("div",{className:"flex items-start gap-3 mb-4",children:[e.jsx("div",{className:`
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
             ${F(n.username)}
            `,children:k(n.username||"Anonymous")}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-semibold leading-tight",children:n.username||"Anonymous"}),e.jsx("time",{className:"text-[10px] uppercase tracking-[0.2em] text-slate-500",children:y(n.created_at)})]})]}),e.jsx("p",{className:"text-base leading-relaxed text-[#111111] whitespace-pre-wrap wrap-break-word",children:n.comment}),e.jsxs("div",{className:"flex items-center gap-4 mt-4",children:[e.jsx("button",{onClick:()=>c(n),className:`\r
            text-xs\r
            uppercase\r
            tracking-[0.15em]\r
            font-bold\r
            hover:underline\r
          `,children:"↩ Reply"}),t.length>0&&e.jsx("button",{onClick:()=>l(!i),className:`\r
              text-xs\r
              uppercase\r
              tracking-[0.15em]\r
              text-slate-500\r
              hover:underline\r
            `,children:i?"Hide replies":`View ${t.length} repl${t.length>1?"ies":"y"}`})]}),i&&t.length>0&&e.jsx("div",{className:`\r
            mt-5\r
            ml-6\r
            pl-5\r
            border-l-2\r
          border-black/20\r
            space-y-4\r
          `,children:t.map(s=>e.jsxs("div",{className:`\r
              bg-[#FFFDF8]\r
                border-2\r
              border-black\r
                p-4\r
              `,children:[e.jsxs("div",{className:"mb-2",children:[e.jsx("p",{className:"font-semibold text-sm",children:s.username}),e.jsx("time",{className:"text-[10px] uppercase tracking-[0.15em] text-slate-500",children:y(s.created_at)})]}),e.jsx("p",{className:"text-sm whitespace-pre-wrap",children:s.comment})]},s.id))})]})})}function S(n){const{memoryId:r,initialComments:t=[]}=n,[c,i]=x.useState(t),[l,s]=x.useState(!1),[d,h]=x.useState(null);x.useEffect(()=>{async function a(){const{data:p,error:o}=await N.from("memory_comments").select("id, memory_id, username, comment, created_at, parent_id").eq("memory_id",r).order("created_at",{ascending:!1});!o&&p&&i(p)}a()},[r]);const m=c.filter(a=>a.parent_id===null||a.parent_id===void 0);function b(a){i(p=>[a,...p])}const g=l?m:m.slice(0,3);return e.jsxs("div",{className:"space-y-12",children:[e.jsx(j,{memoryId:r,onCommentAdded:b}),d&&e.jsxs("div",{className:`\r
          bg-[#FFFDF8]\r
          border-2\r
          border-black\r
          p-4\r
          mb-8\r
          shadow-[4px_4px_0_rgba(0,0,0,1)]\r
        `,children:[e.jsxs("div",{className:"flex justify-between items-center mb-3",children:[e.jsxs("p",{className:"text-sm",children:["Replying to ",e.jsx("strong",{children:d.username})]}),e.jsx("button",{onClick:()=>h(null),className:"text-xs uppercase",children:"Cancel"})]}),e.jsx(j,{memoryId:r,parentId:d.id,onCommentAdded:a=>{b(a),h(null)}})]}),e.jsxs("section",{"aria-label":"Reflections",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-6",children:[e.jsx("h2",{className:"text-sm uppercase tracking-[0.2em] font-semibold",children:"Comments"}),e.jsx("span",{className:`\r
              text-xs\r
              bg-black\r
              text-white\r
              px-2\r
              py-0.5\r
              font-bold\r
              tabular-nums\r
            `,children:m.length})]}),e.jsxs("div",{className:"space-y-6 relative",children:[e.jsx("div",{className:`\r
              absolute\r
              left-5\r
              top-0\r
              bottom-0\r
              w-[3px]\r
              bg-black/20\r
              -z-10\r
            `,"aria-hidden":"true"}),m.length===0?e.jsx("div",{className:`\r
                bg-white\r
                p-8\r
                border-2\r
                border-black\r
                shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]\r
              `,children:e.jsx("p",{className:"text-base text-[#111111]",children:"No Comments yet. Be the first to leave one."})}):e.jsxs(e.Fragment,{children:[g.map((a,p)=>e.jsx(C,{comment:a,index:p,replies:c.filter(o=>o.parent_id===a.id),onReply:h},a.id)),m.length>3&&!l&&e.jsxs("button",{onClick:()=>s(!0),className:`\r
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
                  `,children:["View More (",m.length-3," more)"]}),l&&m.length>3&&e.jsx("button",{onClick:()=>s(!1),className:`\r
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
                  `,children:"Show Less"})]})]})]})]})}export{S as default};
