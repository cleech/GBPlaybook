import{c as F,b as S,r as d,d as R,j as h,s as T,f as k,h as y,i as N,B as P,k as I,m as w,z as j,t as V,E}from"./index-vrGLaMjv.js";import{a as M,c as D,k as B}from"./emotion-css.esm-C_2-o0kZ.js";import{u as U}from"./useNetworkState-BXY2l0KQ.js";import{u as W}from"./useGameState-CREmXQbl.js";import{m as z}from"./gbdb-ByVlvCfB.js";import{f as g}from"./firstValueFrom-D1SthV8Z.js";function A(a){return S("MuiFab",a)}const C=F("MuiFab",["root","primary","secondary","extended","circular","focusVisible","disabled","colorInherit","sizeSmall","sizeMedium","sizeLarge","info","error","warning","success"]),G=a=>{const{color:t,variant:s,classes:o,size:l}=a,u={root:["root",s,`size${y(l)}`,t==="inherit"?"colorInherit":t]},f=N(u,A,o);return{...o,...f}},$=T(P,{name:"MuiFab",slot:"Root",shouldForwardProp:a=>I(a)||a==="classes",overridesResolver:(a,t)=>{const{ownerState:s}=a;return[t.root,t[s.variant],t[`size${y(s.size)}`],s.color==="inherit"&&t.colorInherit,t[y(s.size)],t[s.color]]}})(w(({theme:a})=>{var t,s;return{...a.typography.button,minHeight:36,transition:a.transitions.create(["background-color","box-shadow","border-color"],{duration:a.transitions.duration.short}),borderRadius:"50%",padding:0,minWidth:0,width:56,height:56,zIndex:(a.vars||a).zIndex.fab,boxShadow:(a.vars||a).shadows[6],"&:active":{boxShadow:(a.vars||a).shadows[12]},color:a.vars?a.vars.palette.grey[900]:(s=(t=a.palette).getContrastText)==null?void 0:s.call(t,a.palette.grey[300]),backgroundColor:(a.vars||a).palette.grey[300],"&:hover":{backgroundColor:(a.vars||a).palette.grey.A100,"@media (hover: none)":{backgroundColor:(a.vars||a).palette.grey[300]},textDecoration:"none"},[`&.${C.focusVisible}`]:{boxShadow:(a.vars||a).shadows[6]},variants:[{props:{size:"small"},style:{width:40,height:40}},{props:{size:"medium"},style:{width:48,height:48}},{props:{variant:"extended"},style:{borderRadius:48/2,padding:"0 16px",width:"auto",minHeight:"auto",minWidth:48,height:48}},{props:{variant:"extended",size:"small"},style:{width:"auto",padding:"0 8px",borderRadius:34/2,minWidth:34,height:34}},{props:{variant:"extended",size:"medium"},style:{width:"auto",padding:"0 16px",borderRadius:40/2,minWidth:40,height:40}},{props:{color:"inherit"},style:{color:"inherit"}}]}}),w(({theme:a})=>({variants:[...Object.entries(a.palette).filter(j(["dark","contrastText"])).map(([t])=>({props:{color:t},style:{color:(a.vars||a).palette[t].contrastText,backgroundColor:(a.vars||a).palette[t].main,"&:hover":{backgroundColor:(a.vars||a).palette[t].dark,"@media (hover: none)":{backgroundColor:(a.vars||a).palette[t].main}}}}))]})),w(({theme:a})=>({[`&.${C.disabled}`]:{color:(a.vars||a).palette.action.disabled,boxShadow:(a.vars||a).shadows[0],backgroundColor:(a.vars||a).palette.action.disabledBackground}}))),H=d.forwardRef(function(t,s){const o=R({props:t,name:"MuiFab"}),{children:l,className:u,color:f="default",component:c="button",disabled:b=!1,disableFocusRipple:v=!1,focusVisibleClassName:m,size:n="large",variant:p="circular",...x}=o,r={...o,color:f,component:c,disabled:b,disableFocusRipple:v,size:n,variant:p},e=G(r);return h.jsx($,{className:k(e.root,u),component:c,disabled:b,focusRipple:!v,focusVisibleClassName:k(e.focusVisible,m),ownerState:r,ref:s,...x,classes:e,children:l})}),L=V(h.jsx("path",{d:"M8 5v14l11-7z"})),O=B`
  from {
    transform: translate(-50%, -50%) scale(1.4) rotate(0turn);
  }
  to {
    transform: translate(-50%, -50%) scale(1.4) rotate(1turn);
  }
`,q=D`
  --offset: 5px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    background: conic-gradient(transparent, darkred 280deg, transparent);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    aspect-ratio: 1;
    width: 100%;
    animation: ${O} 2s linear infinite;
  }

  &::after {
    content: "";
    background: inherit;
    border-radius: inherit;
    position: absolute;
    inset: var(--offset);
    height: calc(100% - 2 * var(--offset));
    width: calc(100% - 2 * var(--offset));
  }
`;function J(a){switch(a){case"Guilds":return"/game";case"Draft":return"/game/draft";case"Game":return"/game/draft/play"}}function aa(a){const t=E(),{gameState1$:s,gameState2$:o}=W(),{active:l}=U(),[u,f]=d.useState(),[c,b]=d.useState(),[v,m]=d.useState(!1),{dest:n,onAction:p,...x}=a;return d.useEffect(()=>{const r=s==null?void 0:s.pipe(z(i=>i==null?void 0:i.navigateTo)).subscribe(i=>f(i)),e=o==null?void 0:o.pipe(z(i=>i==null?void 0:i.navigateTo)).subscribe(i=>b(i));return()=>{r==null||r.unsubscribe(),e==null||e.unsubscribe()}},[s,o]),d.useEffect(()=>{const r=async()=>{await g(s).then(e=>{e==null||e.incrementalPatch({navigateTo:void 0}).catch(console.error)}),l||await g(o).then(e=>{e==null||e.incrementalPatch({navigateTo:void 0}).catch(console.error)}),t(J(n))};u==n&&c===n&&r()},[s,o,n,u,c,l,t,p]),d.useEffect(()=>{m(c===n)},[n,c]),h.jsx(H,{className:M({[q]:v}),...x,color:"secondary",onClick:()=>{p==null||p(),g(s).then(r=>{r==null||r.incrementalPatch({navigateTo:n}).catch(console.error)}),l||g(o).then(r=>{r==null||r.incrementalPatch({navigateTo:n}).catch(console.error)})},children:h.jsx(L,{fontSize:"large",sx:{zIndex:10}})})}export{aa as N};
