import{g as F,h as S,r as d,i as R,j as h,s as T,l as z,m as y,n as N,y as P,z as I,o as m,p as j,c as V,x as M,v as k,f as g}from"./index-C8qF_m5L.js";import{a as D,c as E,k as U}from"./emotion-css.esm-DeF_GmNL.js";import{u as W}from"./useNetworkState-BK_55pyh.js";import{u as A}from"./useGameState-C-D6AvI3.js";function B(a){return S("MuiFab",a)}const C=F("MuiFab",["root","primary","secondary","extended","circular","focusVisible","disabled","colorInherit","sizeSmall","sizeMedium","sizeLarge","info","error","warning","success"]),G=a=>{const{color:t,variant:s,classes:o,size:l}=a,u={root:["root",s,`size${y(l)}`,t==="inherit"?"colorInherit":t]},f=N(u,B,o);return{...o,...f}},$=T(P,{name:"MuiFab",slot:"Root",shouldForwardProp:a=>I(a)||a==="classes",overridesResolver:(a,t)=>{const{ownerState:s}=a;return[t.root,t[s.variant],t[`size${y(s.size)}`],s.color==="inherit"&&t.colorInherit,t[y(s.size)],t[s.color]]}})(m(({theme:a})=>{var t,s;return{...a.typography.button,minHeight:36,transition:a.transitions.create(["background-color","box-shadow","border-color"],{duration:a.transitions.duration.short}),borderRadius:"50%",padding:0,minWidth:0,width:56,height:56,zIndex:(a.vars||a).zIndex.fab,boxShadow:(a.vars||a).shadows[6],"&:active":{boxShadow:(a.vars||a).shadows[12]},color:a.vars?a.vars.palette.grey[900]:(s=(t=a.palette).getContrastText)==null?void 0:s.call(t,a.palette.grey[300]),backgroundColor:(a.vars||a).palette.grey[300],"&:hover":{backgroundColor:(a.vars||a).palette.grey.A100,"@media (hover: none)":{backgroundColor:(a.vars||a).palette.grey[300]},textDecoration:"none"},[`&.${C.focusVisible}`]:{boxShadow:(a.vars||a).shadows[6]},variants:[{props:{size:"small"},style:{width:40,height:40}},{props:{size:"medium"},style:{width:48,height:48}},{props:{variant:"extended"},style:{borderRadius:48/2,padding:"0 16px",width:"auto",minHeight:"auto",minWidth:48,height:48}},{props:{variant:"extended",size:"small"},style:{width:"auto",padding:"0 8px",borderRadius:34/2,minWidth:34,height:34}},{props:{variant:"extended",size:"medium"},style:{width:"auto",padding:"0 16px",borderRadius:40/2,minWidth:40,height:40}},{props:{color:"inherit"},style:{color:"inherit"}}]}}),m(({theme:a})=>({variants:[...Object.entries(a.palette).filter(j(["dark","contrastText"])).map(([t])=>({props:{color:t},style:{color:(a.vars||a).palette[t].contrastText,backgroundColor:(a.vars||a).palette[t].main,"&:hover":{backgroundColor:(a.vars||a).palette[t].dark,"@media (hover: none)":{backgroundColor:(a.vars||a).palette[t].main}}}}))]})),m(({theme:a})=>({[`&.${C.disabled}`]:{color:(a.vars||a).palette.action.disabled,boxShadow:(a.vars||a).shadows[0],backgroundColor:(a.vars||a).palette.action.disabledBackground}}))),H=d.forwardRef(function(t,s){const o=R({props:t,name:"MuiFab"}),{children:l,className:u,color:f="default",component:c="button",disabled:b=!1,disableFocusRipple:v=!1,focusVisibleClassName:x,size:n="large",variant:p="circular",...w}=o,e={...o,color:f,component:c,disabled:b,disableFocusRipple:v,size:n,variant:p},r=G(e);return h.jsx($,{className:z(r.root,u),component:c,disabled:b,focusRipple:!v,focusVisibleClassName:z(r.focusVisible,x),ownerState:e,ref:s,...w,classes:r,children:l})}),L=V(h.jsx("path",{d:"M8 5v14l11-7z"})),O=U`
  from {
    transform: translate(-50%, -50%) scale(1.4) rotate(0turn);
  }
  to {
    transform: translate(-50%, -50%) scale(1.4) rotate(1turn);
  }
`,q=E`
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
`;function J(a){switch(a){case"Guilds":return"/game";case"Draft":return"/game/draft";case"Game":return"/game/draft/play"}}function Z(a){const t=M(),{gameState1$:s,gameState2$:o}=A(),{active:l}=W(),[u,f]=d.useState(),[c,b]=d.useState(),[v,x]=d.useState(!1),{dest:n,onAction:p,...w}=a;return d.useEffect(()=>{const e=s==null?void 0:s.pipe(k(i=>i==null?void 0:i.navigateTo)).subscribe(i=>f(i)),r=o==null?void 0:o.pipe(k(i=>i==null?void 0:i.navigateTo)).subscribe(i=>b(i));return()=>{e==null||e.unsubscribe(),r==null||r.unsubscribe()}},[s,o]),d.useEffect(()=>{const e=async()=>{await g(s).then(r=>{r==null||r.incrementalPatch({navigateTo:void 0}).catch(console.error)}),l||await g(o).then(r=>{r==null||r.incrementalPatch({navigateTo:void 0}).catch(console.error)}),t(J(n))};u==n&&c===n&&e()},[s,o,n,u,c,l,t,p]),d.useEffect(()=>{x(c===n)},[n,c]),h.jsx(H,{className:D({[q]:v}),...w,color:"secondary",onClick:()=>{p==null||p(),g(s).then(e=>{e==null||e.incrementalPatch({navigateTo:n}).catch(console.error)}),l||g(o).then(e=>{e==null||e.incrementalPatch({navigateTo:n}).catch(console.error)})},children:h.jsx(L,{fontSize:"large",sx:{zIndex:10}})})}export{Z as N};
