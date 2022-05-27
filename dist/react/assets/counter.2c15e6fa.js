import{R as y,u as h,b as D}from"./remesh-logger.82eef2ea.js";import{j as s,a as t}from"./jsx-runtime.a8396eb8.js";const p=y.domain({name:"CounterDomain",impl:e=>{const r=e.state({name:"CountState",default:0}),c=e.query({name:"CountIncreQuery",impl:({get:n})=>n(r())+1}),m=e.query({name:"CountDecreQuery",impl:({get:n})=>n(r())-1}),a=e.query({name:"CountDoubleQuery",impl:({get:n})=>{const o=n(c()),u=n(m());return 2*(o+u)}}),C=e.query({name:"CountInfoQuery",impl:({get:n})=>{const[o,u,d]=[n(c()),n(m()),n(a())];return{incre:o,decre:u,double:d}}}),i=e.command({name:"IncreCommand",impl:({get:n})=>{const o=n(r());return r().new(o+1)}}),l=e.command({name:"DecreCommand",impl:({get:n})=>{const o=n(r());return r().new(o-1)}});return{query:{CountInfoQuery:C},command:{IncreCommand:i,DecreCommand:l}}}});var f=()=>{const e=h(p()),r=D(e.query.CountInfoQuery());return s("div",{children:[t("h2",{children:"Counter"}),t("button",{onClick:()=>e.command.IncreCommand(),children:"Increment"})," ",t("button",{onClick:()=>e.command.DecreCommand(),children:"Decrement"}),s("div",{children:[t("h3",{children:"Count Query"}),t("pre",{children:JSON.stringify(r,null,2)})]})]})};export{f as default};
//# sourceMappingURL=counter.2c15e6fa.js.map