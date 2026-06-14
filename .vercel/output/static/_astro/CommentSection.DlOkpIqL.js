import{j as e,s as v}from"./supabase._72BvvrS.js";import{a as o}from"./index.CmLIgCVx.js";function $({show:t,success:s,message:m}){return e.jsxs("div",{className:`
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
        ${t?"translate-y-0 opacity-100":"translate-y-20 opacity-0 pointer-events-none"}
      `,children:[e.jsx("span",{className:"material-symbols-outlined text-base",children:s?"check_circle":"error"}),e.jsx("span",{children:m})]})}function F({memoryId:t,visitorId:s,onCommentAdded:m,parentId:i=null}){const[f,x]=o.useState(""),[c,h]=o.useState(""),[j,b]=o.useState(!1),[g,N]=o.useState(!1),[r,y]=o.useState(""),[k,a]=o.useState(!1),[n,p]=o.useState({show:!1,success:!0,message:""});o.useEffect(()=>{if(!s)return;async function l(){const{data:_,error:u}=await v.from("comment_visitors").select("name").eq("visitor_id",s).maybeSingle();!u&&_&&(y(_.name),x(_.name),a(!0))}l()},[s]);function d(l,_=!0){p({show:!0,success:_,message:l}),setTimeout(()=>{p(u=>({...u,show:!1}))},3500)}async function C(){const l=c.trim();if(!l){d("Please write a comment before posting.",!1);return}let _="Anonymous";if(!g)if(k)_=r;else{const u=f.trim();if(!u){d("Please enter a name or choose 'Comment as Anonymous'.",!1);return}try{b(!0);const{error:w}=await v.from("comment_visitors").insert({visitor_id:s,name:u});if(w)throw w;y(u),a(!0),_=u}catch(w){console.error("Failed to register name:",w),d("Unable to lock username to device: "+(w.message||"Error"),!1),b(!1);return}}try{b(!0);const{data:u,error:w}=await v.from("memory_comments").insert({memory_id:t,username:_,comment:l,parent_id:i,visitor_id:s,is_anonymous:g}).select().single();if(w)throw w;m?.(u),h(""),d("Comment posted!",!0)}catch(u){console.error(u),d(u?.message||"Unable to post comment.",!1)}finally{b(!1)}}function A(l){(l.ctrlKey||l.metaKey)&&l.key==="Enter"&&C()}return e.jsxs(e.Fragment,{children:[e.jsxs("section",{className:"relative",children:[e.jsx("div",{className:`
            absolute
            -top-4
            -right-4
            z-10
            w-12
            h-12
            flex
            items-center
            justify-center
            bg-black
            text-white
            rounded-full
            shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]
          `,children:e.jsx("span",{className:"material-symbols-outlined text-base",children:"edit"})}),e.jsxs("div",{className:`
            bg-white
            p-8
            border-2
            border-black
            shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
          `,children:[e.jsx("div",{className:"mb-4",children:g?e.jsx("div",{className:"mb-5 p-3 border-2 border-dashed border-gray-400 bg-gray-50 text-gray-500 font-semibold text-xs uppercase tracking-wider",children:"👤 Posting anonymously (your name will not be shown)"}):k?e.jsxs("div",{className:"mb-5 p-3 border-2 border-black bg-[#DBE9FF] text-black font-bold text-xs uppercase tracking-wider shadow-[2px_2px_0px_#000]",children:["💬 Commenting as: ",e.jsx("span",{className:"underline",children:r})," (Locked to device)"]}):e.jsxs(e.Fragment,{children:[e.jsx("label",{className:`
                    block
                    text-sm
                    uppercase
                    tracking-[0.2em]
                    font-semibold
                    mb-1
                  `,children:"Name *"}),e.jsx("input",{type:"text",maxLength:60,autoComplete:"name",value:f,onChange:l=>x(l.target.value),placeholder:"Enter your name (locked to this device after posting)",className:`
                    w-full
                    h-10
                    px-4
                    bg-transparent
                    border-2
                    border-black
                    outline-none
                    transition-all
                    mb-4
                    focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                  `})]})}),e.jsxs("div",{className:"flex items-center gap-2 mb-5",children:[e.jsx("input",{type:"checkbox",id:`anon-check-${i||"main"}`,checked:g,onChange:l=>N(l.target.checked),className:`
                w-5
                h-5
                accent-black
                border-2
                border-black
                cursor-pointer
              `}),e.jsx("label",{htmlFor:`anon-check-${i||"main"}`,className:`
                text-xs
                font-black
                uppercase
                tracking-wider
                cursor-pointer
                select-none
              `,children:"Comment as Anonymous"})]}),e.jsx("label",{className:`
              block
              text-sm
              uppercase
              tracking-[0.2em]
              font-semibold
              mb-1
            `,children:"Add a thought to the archive"}),e.jsx("textarea",{rows:4,maxLength:500,value:c,onChange:l=>h(l.target.value),onKeyDown:A,placeholder:"Write your comment here…",className:`
              w-full
              px-4
              py-3
              bg-transparent
              border-2
              border-black
              outline-none
              transition-all
              resize-none
              focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
            `}),e.jsx("div",{className:"flex items-center justify-between mt-1 mb-5",children:e.jsxs("span",{className:"text-[11px] text-slate-400 tabular-nums",children:[c.length," / 500"]})}),e.jsx("button",{onClick:C,disabled:j,className:`
              cursor-pointer
              px-8
              py-3
              bg-black
              text-white
              text-sm
              font-semibold
              shadow-[4px_4px_0px_0px_rgba(191,217,255,1)]
              hover:translate-x-1
              hover:translate-y-1
              transition-transform
              disabled:opacity-50
              disabled:pointer-events-none
            `,children:j?"Posting...":"Post Comment"})]})]}),e.jsx($,{show:n.show,success:n.success,message:n.message})]})}const D=["bg-[#FFD6A5]","bg-[#FDFFB6]","bg-[#CAFFBF]","bg-[#9BF6FF]","bg-[#A0C4FF]","bg-[#BDB2FF]","bg-[#FFC6FF]","bg-[#FFADAD]"];function E(t="Anonymous"){const s=[...t].reduce((m,i)=>m+i.charCodeAt(0),0);return D[s%D.length]}function S(t){if(!t)return"Just now";const s=new Date,m=new Date(t),i=s-m,f=Math.floor(i/1e3),x=Math.floor(f/60),c=Math.floor(x/60),h=Math.floor(c/24);return f<60?"Just now":x<60?`${x} min${x>1?"s":""} ago`:c<24?`${c} hour${c>1?"s":""} ago`:h===1?"Yesterday":h<7?`${h} days ago`:m.toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}function R(t){return t.split(" ").filter(Boolean).map(s=>s[0]).join("").slice(0,2).toUpperCase()}function B({comment:t,index:s,visitorId:m,replies:i=[],onReply:f,onDelete:x}){const[c,h]=o.useState(!1),[j,b]=o.useState(!1),[g,N]=o.useState(null),r=t.deleted_at!==null,y=r?"[deleted]":t.is_anonymous?"Anonymous":t.username||"Anonymous";async function k(a){try{N(a);const{error:n}=await v.from("memory_comments").update({deleted_at:new Date().toISOString()}).eq("id",a);if(n)throw n;x?.(a)}catch(n){console.error("Error deleting comment:",n),alert("Failed to delete comment: "+n.message)}finally{N(null),b(!1)}}return e.jsx("article",{className:"group relative",children:e.jsxs("div",{className:`
          bg-white
          p-6
          border-2
          border-black
          shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
          group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
          transition-all
          ${s%2===0?"rotate-[0.4deg]":"rotate-[-0.3deg]"}
        `,children:[e.jsxs("div",{className:"flex items-start justify-between gap-3 mb-4",children:[e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("div",{className:`
                w-10
                h-10
                border-2
                border-black
                flex
                items-center
                justify-center
                font-bold
                text-sm
                shrink-0
                ${r?"bg-gray-200":E(y)}
              `,children:r?"🗑":R(y)}),e.jsxs("div",{children:[e.jsx("p",{className:`text-sm font-semibold leading-tight ${r?"text-gray-500 italic":"text-black"}`,children:y}),e.jsx("time",{className:"text-[10px] uppercase tracking-[0.2em] text-slate-500",children:S(t.created_at)})]})]}),!r&&t.visitor_id===m&&e.jsx("div",{className:"relative shrink-0",children:j?e.jsxs("div",{className:"flex items-center gap-2 border-2 border-black bg-[#FFD0CC] px-2 py-1 shadow-[2px_2px_0px_#000] text-xs font-bold",children:[e.jsx("span",{children:"Delete?"}),e.jsx("button",{onClick:()=>k(t.id),disabled:g===t.id,className:"text-red-600 underline cursor-pointer",children:"Yes"}),e.jsx("button",{onClick:()=>b(!1),className:"text-black underline cursor-pointer",children:"No"})]}):e.jsx("button",{onClick:()=>b(!0),className:`
                    text-[10px]
                    uppercase
                    tracking-[0.15em]
                    font-black
                    text-red-500
                    hover:underline
                    cursor-pointer
                  `,children:"🗑 Delete"})})]}),e.jsx("p",{className:`text-base leading-relaxed whitespace-pre-wrap wrap-break-word ${r?"text-gray-500 italic font-medium":"text-[#111111]"}`,children:r?"This comment has been deleted.":t.comment}),e.jsxs("div",{className:"flex items-center gap-4 mt-4",children:[!r&&e.jsx("button",{onClick:()=>f(t),className:`
                text-xs
                uppercase
                tracking-[0.15em]
                font-bold
                hover:underline
                cursor-pointer
              `,children:"↩ Reply"}),i.length>0&&e.jsx("button",{onClick:()=>h(!c),className:`
                text-xs
                uppercase
                tracking-[0.15em]
                text-slate-500
                hover:underline
                cursor-pointer
              `,children:c?"Hide replies":`View ${i.length} repl${i.length>1?"ies":"y"}`})]}),c&&i.length>0&&e.jsx("div",{className:`
              mt-5
              ml-6
              pl-5
              border-l-2
              border-black/20
              space-y-4
            `,children:i.map(a=>{const n=a.deleted_at!==null,p=n?"[deleted]":a.is_anonymous?"Anonymous":a.username||"Anonymous";return e.jsxs("div",{className:`
                    bg-[#FFFDF8]
                    border-2
                    border-black
                    p-4
                  `,children:[e.jsxs("div",{className:"flex justify-between items-start mb-2 gap-2",children:[e.jsxs("div",{children:[e.jsx("p",{className:`font-semibold text-sm ${n?"text-gray-500 italic":"text-black"}`,children:p}),e.jsx("time",{className:"text-[10px] uppercase tracking-[0.15em] text-slate-500",children:S(a.created_at)})]}),!n&&a.visitor_id===m&&e.jsx("button",{onClick:()=>{confirm("Delete this reply?")&&k(a.id)},disabled:g===a.id,className:`
                          text-[10px]
                          uppercase
                          tracking-[0.15em]
                          font-bold
                          text-red-500
                          hover:underline
                          cursor-pointer
                        `,children:g===a.id?"...":"🗑 Delete"})]}),e.jsx("p",{className:`text-sm whitespace-pre-wrap ${n?"text-gray-500 italic font-medium":"text-black"}`,children:n?"This comment has been deleted.":a.comment})]},a.id)})})]})})}function M(t){const{memoryId:s,initialComments:m=[]}=t,[i,f]=o.useState(m),[x,c]=o.useState(!1),[h,j]=o.useState(null),[b,g]=o.useState(null);function N(){return typeof crypto<"u"&&crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2)}`}o.useEffect(()=>{let n=localStorage.getItem("visitor-id");n||(n=N(),localStorage.setItem("visitor-id",n)),g(n)},[]),o.useEffect(()=>{async function n(){const{data:p,error:d}=await v.from("memory_comments").select("id, memory_id, username, comment, created_at, parent_id, visitor_id, is_anonymous, deleted_at").eq("memory_id",s).order("created_at",{ascending:!1});!d&&p&&f(p)}n()},[s]);const r=i.filter(n=>n.parent_id===null||n.parent_id===void 0);function y(n){f(p=>[n,...p])}function k(n){f(p=>p.map(d=>d.id===n?{...d,deleted_at:new Date().toISOString()}:d))}const a=x?r:r.slice(0,3);return e.jsxs("div",{className:"space-y-12",children:[e.jsx(F,{memoryId:s,visitorId:b,onCommentAdded:y}),h&&e.jsxs("div",{className:`\r
          bg-[#FFFDF8]\r
          border-2\r
          border-black\r
          p-4\r
          mb-8\r
          shadow-[4px_4px_0_rgba(0,0,0,1)]\r
        `,children:[e.jsxs("div",{className:"flex justify-between items-center mb-3",children:[e.jsxs("p",{className:"text-sm",children:["Replying to ",e.jsx("strong",{children:h.username})]}),e.jsx("button",{onClick:()=>j(null),className:"text-xs uppercase",children:"Cancel"})]}),e.jsx(F,{memoryId:s,parentId:h.id,visitorId:b,onCommentAdded:n=>{y(n),j(null)}})]}),e.jsxs("section",{"aria-label":"Reflections",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-6",children:[e.jsx("h2",{className:"text-sm uppercase tracking-[0.2em] font-semibold",children:"Comments"}),e.jsx("span",{className:`\r
              text-xs\r
              bg-black\r
              text-white\r
              px-2\r
              py-0.5\r
              font-bold\r
              tabular-nums\r
            `,children:r.length})]}),e.jsxs("div",{className:"space-y-6 relative",children:[e.jsx("div",{className:`\r
              absolute\r
              left-5\r
              top-0\r
              bottom-0\r
              w-[3px]\r
              bg-black/20\r
              -z-10\r
            `,"aria-hidden":"true"}),r.length===0?e.jsx("div",{className:`\r
                bg-white\r
                p-8\r
                border-2\r
                border-black\r
                shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]\r
              `,children:e.jsx("p",{className:"text-base text-[#111111]",children:"No Comments yet. Be the first to leave one."})}):e.jsxs(e.Fragment,{children:[a.map((n,p)=>e.jsx(B,{comment:n,index:p,visitorId:b,replies:i.filter(d=>d.parent_id===n.id),onReply:j,onDelete:k},n.id)),r.length>3&&!x&&e.jsxs("button",{onClick:()=>c(!0),className:`\r
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
                  `,children:["View More (",r.length-3," more)"]}),x&&r.length>3&&e.jsx("button",{onClick:()=>c(!1),className:`\r
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
                  `,children:"Show Less"})]})]})]})]})}export{M as default};
