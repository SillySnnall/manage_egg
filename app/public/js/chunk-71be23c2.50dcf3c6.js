(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-71be23c2","chunk-2d0b90b4","chunk-2d0b90b4"],{"30ef":function(n,e,t){"use strict";t.d(e,"a",function(){return i});var a=t("2b0e"),i=new a["default"]},3211:function(n,e,t){},bb51:function(n,e,t){"use strict";t.r(e);var a=function(){var n=this,e=n.$createElement,t=n._self._c||e;return t("div",{staticClass:"layout"},[t("Sider",{style:{position:"fixed",height:"100vh",left:0,overflow:"auto",width:"150px",minWidth:"150px"}},[t("CellGroup",[t("Cell",{style:{padding:"14px 24px",color:"rgba(255,255,255,.7)"},attrs:{title:"商品"},nativeOn:{click:function(e){return n.commodityMenuItemClick(e)}}}),t("Cell",{style:{padding:"14px 24px",color:"rgba(255,255,255,.7)"},attrs:{title:"客户"},nativeOn:{click:function(e){return n.customerMenuItemClick(e)}}}),t("Cell",{style:{padding:"14px 24px",color:"rgba(255,255,255,.7)"},attrs:{title:"历史销售单"},nativeOn:{click:function(e){return n.historyMenuItemClick(e)}}}),t("Cell",{style:{padding:"14px 24px",color:"rgba(255,255,255,.7)"},attrs:{title:"退货单"},nativeOn:{click:function(e){return n.backMenuItemClick(e)}}}),t("Cell",{style:{padding:"14px 24px",color:"rgba(255,255,255,.7)"},attrs:{title:"历史退货单"},nativeOn:{click:function(e){return n.backHistoryMenuItemClick(e)}}})],1)],1),t("Layout",{style:{paddingLeft:"150px"}},[t("Content",[t("Tabs",{style:{margin:"20px"},attrs:{type:"card",value:n.currentTabPaneId},on:{"on-tab-remove":n.handleTabRemove,"on-click":n.handleTabClick}},n._l(n.tabPaneList,function(n){return t("TabPane",{key:n.id,attrs:{closable:0!==n.id,name:n.id+"",label:n.label}},[t(n.component,{tag:"component"})],1)}),1)],1)],1)],1)},i=[],c=t("30ef"),r={data:function(){return{name:"",currentTabPaneId:"0",tabPaneList:[]}},created:function(){null!=sessionStorage.getItem("user")?this.tabPaneList.push({id:0,label:"销售单",component:function(){return Promise.all([t.e("chunk-9096e7a8"),t.e("chunk-90520cb8")]).then(t.bind(null,"5cc9"))}}):this.$router.push({name:"login"})},components:{},computed:{},methods:{commodityMenuItemClick:function(){this.isAddTabPane(1)?this.currentTabPaneId="1":(this.tabPaneList.push({id:1,label:"商品",component:function(){return Promise.all([t.e("chunk-9096e7a8"),t.e("chunk-d01d1610")]).then(t.bind(null,"f0e6"))}}),this.currentTabPaneId="1")},customerMenuItemClick:function(){this.isAddTabPane(2)?this.currentTabPaneId="2":(this.tabPaneList.push({id:2,label:"客户",component:function(){return Promise.all([t.e("chunk-9096e7a8"),t.e("chunk-73eeec88")]).then(t.bind(null,"af6b"))}}),this.currentTabPaneId="2")},historyMenuItemClick:function(){this.isAddTabPane(3)?this.currentTabPaneId="3":(this.tabPaneList.push({id:3,label:"历史销售单",component:function(){return Promise.all([t.e("chunk-9096e7a8"),t.e("chunk-67de4c78"),t.e("chunk-44baeea2")]).then(t.bind(null,"49a3"))}}),this.currentTabPaneId="3")},backMenuItemClick:function(){this.isAddTabPane(4)?this.currentTabPaneId="4":(this.tabPaneList.push({id:4,label:"退货单",component:function(){return Promise.all([t.e("chunk-9096e7a8"),t.e("chunk-4632a8ba")]).then(t.bind(null,"2b9b"))}}),this.currentTabPaneId="4")},backHistoryMenuItemClick:function(){this.isAddTabPane(5)?this.currentTabPaneId="5":(this.tabPaneList.push({id:5,label:"历史退货单",component:function(){return Promise.all([t.e("chunk-9096e7a8"),t.e("chunk-67de4c78"),t.e("chunk-9d7d3034")]).then(t.bind(null,"d5b9"))}}),this.currentTabPaneId="5")},handleTabRemove:function(n){for(var e=0;e<this.tabPaneList.length;e++)if(this.tabPaneList[e].id===parseInt(n))return this.tabPaneList.splice(e,1),void(this.currentTabPaneId="0")},handleTabClick:function(n){this.currentTabPaneId=n},isAddTabPane:function(n){for(var e=0;e<this.tabPaneList.length;e++)if(this.tabPaneList[e].id===n)return this.currentTabPaneId=n+"",!0}},mounted:function(){var n=this;c["a"].$on("catOrder",function(e){e.code;n.historyMenuItemClick()}),c["a"].$on("catBackOrder",function(e){e.code;n.backHistoryMenuItemClick()})}},u=r,l=(t("dc19"),t("2877")),o=Object(l["a"])(u,a,i,!1,null,"a80e533a",null);e["default"]=o.exports},dc19:function(n,e,t){"use strict";var a=t("3211"),i=t.n(a);i.a}}]);
//# sourceMappingURL=chunk-71be23c2.50dcf3c6.js.map