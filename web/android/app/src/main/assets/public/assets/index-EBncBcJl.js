const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./web-CCOC1Aej.js","./vendor-N--QU9DW.js","./spring-C_ef_Vck.js"])))=>i.map(i=>d[i]);
import{r as rd,a as ad}from"./vendor-N--QU9DW.js";import{r as F,R as Zi,u as od,a as ld}from"./spring-C_ef_Vck.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();var lr={exports:{}},Bi={};var bo;function cd(){if(bo)return Bi;bo=1;var n=rd(),e=Symbol.for("react.element"),t=Symbol.for("react.fragment"),i=Object.prototype.hasOwnProperty,s=n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,r={key:!0,ref:!0,__self:!0,__source:!0};function o(l,c,d){var h,u={},p=null,g=null;d!==void 0&&(p=""+d),c.key!==void 0&&(p=""+c.key),c.ref!==void 0&&(g=c.ref);for(h in c)i.call(c,h)&&!r.hasOwnProperty(h)&&(u[h]=c[h]);if(l&&l.defaultProps)for(h in c=l.defaultProps,c)u[h]===void 0&&(u[h]=c[h]);return{$$typeof:e,type:l,key:p,ref:g,props:u,_owner:s.current}}return Bi.Fragment=t,Bi.jsx=o,Bi.jsxs=o,Bi}var yo;function dd(){return yo||(yo=1,lr.exports=cd()),lr.exports}var a=dd(),us={},wo;function ud(){if(wo)return us;wo=1;var n=ad();return us.createRoot=n.createRoot,us.hydrateRoot=n.hydrateRoot,us}var hd=ud();function fd(n={}){const{nonce:e,onScriptLoadSuccess:t,onScriptLoadError:i}=n,[s,r]=F.useState(!1),o=F.useRef(t);o.current=t;const l=F.useRef(i);return l.current=i,F.useEffect(()=>{const c=document.createElement("script");return c.src="https://accounts.google.com/gsi/client",c.async=!0,c.defer=!0,c.nonce=e,c.onload=()=>{var d;r(!0),(d=o.current)===null||d===void 0||d.call(o)},c.onerror=()=>{var d;r(!1),(d=l.current)===null||d===void 0||d.call(l)},document.body.appendChild(c),()=>{document.body.removeChild(c)}},[e]),s}const Gl=F.createContext(null);function pd({clientId:n,nonce:e,onScriptLoadSuccess:t,onScriptLoadError:i,children:s}){const r=fd({nonce:e,onScriptLoadSuccess:t,onScriptLoadError:i}),o=F.useMemo(()=>({clientId:n,scriptLoadedSuccessfully:r}),[n,r]);return Zi.createElement(Gl.Provider,{value:o},s)}function md(){const n=F.useContext(Gl);if(!n)throw new Error("Google OAuth components must be used within GoogleOAuthProvider");return n}function gd({flow:n="implicit",scope:e="",onSuccess:t,onError:i,onNonOAuthError:s,overrideScope:r,state:o,...l}){const{clientId:c,scriptLoadedSuccessfully:d}=md(),h=F.useRef(),u=F.useRef(t);u.current=t;const p=F.useRef(i);p.current=i;const g=F.useRef(s);g.current=s,F.useEffect(()=>{var m,f;if(!d)return;const y=n==="implicit"?"initTokenClient":"initCodeClient",M=(f=(m=window?.google)===null||m===void 0?void 0:m.accounts)===null||f===void 0?void 0:f.oauth2[y]({client_id:c,scope:r?e:`openid profile email ${e}`,callback:w=>{var T,R;if(w.error)return(T=p.current)===null||T===void 0?void 0:T.call(p,w);(R=u.current)===null||R===void 0||R.call(u,w)},error_callback:w=>{var T;(T=g.current)===null||T===void 0||T.call(g,w)},state:o,...l});h.current=M},[c,d,n,e,o]);const _=F.useCallback(m=>{var f;return(f=h.current)===null||f===void 0?void 0:f.requestAccessToken(m)},[]),v=F.useCallback(()=>{var m;return(m=h.current)===null||m===void 0?void 0:m.requestCode()},[]);return n==="implicit"?_:v}var Ri;(function(n){n.Unimplemented="UNIMPLEMENTED",n.Unavailable="UNAVAILABLE"})(Ri||(Ri={}));class cr extends Error{constructor(e,t,i){super(e),this.message=e,this.code=t,this.data=i}}const xd=n=>{var e,t;return n?.androidBridge?"android":!((t=(e=n?.webkit)===null||e===void 0?void 0:e.messageHandlers)===null||t===void 0)&&t.bridge?"ios":"web"},_d=n=>{const e=n.CapacitorCustomPlatform||null,t=n.Capacitor||{},i=t.Plugins=t.Plugins||{},s=()=>e!==null?e.name:xd(n),r=()=>s()!=="web",o=u=>{const p=d.get(u);return!!(p?.platforms.has(s())||l(u))},l=u=>{var p;return(p=t.PluginHeaders)===null||p===void 0?void 0:p.find(g=>g.name===u)},c=u=>n.console.error(u),d=new Map,h=(u,p={})=>{const g=d.get(u);if(g)return console.warn(`Capacitor plugin "${u}" already registered. Cannot register plugins twice.`),g.proxy;const _=s(),v=l(u);let m;const f=async()=>(!m&&_ in p?m=typeof p[_]=="function"?m=await p[_]():m=p[_]:e!==null&&!m&&"web"in p&&(m=typeof p.web=="function"?m=await p.web():m=p.web),m),y=(B,b)=>{var E,N;if(v){const U=v?.methods.find(D=>b===D.name);if(U)return U.rtype==="promise"?D=>t.nativePromise(u,b.toString(),D):(D,P)=>t.nativeCallback(u,b.toString(),D,P);if(B)return(E=B[b])===null||E===void 0?void 0:E.bind(B)}else{if(B)return(N=B[b])===null||N===void 0?void 0:N.bind(B);throw new cr(`"${u}" plugin is not implemented on ${_}`,Ri.Unimplemented)}},M=B=>{let b;const E=(...N)=>{const U=f().then(D=>{const P=y(D,B);if(P){const I=P(...N);return b=I?.remove,I}else throw new cr(`"${u}.${B}()" is not implemented on ${_}`,Ri.Unimplemented)});return B==="addListener"&&(U.remove=async()=>b()),U};return E.toString=()=>`${B.toString()}() { [capacitor code] }`,Object.defineProperty(E,"name",{value:B,writable:!1,configurable:!1}),E},w=M("addListener"),T=M("removeListener"),R=(B,b)=>{const E=w({eventName:B},b),N=async()=>{const D=await E;T({eventName:B,callbackId:D},b)},U=new Promise(D=>E.then(()=>D({remove:N})));return U.remove=async()=>{console.warn("Using addListener() without 'await' is deprecated."),await N()},U},A=new Proxy({},{get(B,b){switch(b){case"$$typeof":return;case"toJSON":return()=>({});case"addListener":return v?R:w;case"removeListener":return T;default:return M(b)}}});return i[u]=A,d.set(u,{name:u,proxy:A,platforms:new Set([...Object.keys(p),...v?[_]:[]])}),A};return t.convertFileSrc||(t.convertFileSrc=u=>u),t.getPlatform=s,t.handleError=c,t.isNativePlatform=r,t.isPluginAvailable=o,t.registerPlugin=h,t.Exception=cr,t.DEBUG=!!t.DEBUG,t.isLoggingEnabled=!!t.isLoggingEnabled,t},vd=n=>n.Capacitor=_d(n),oi=vd(typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{}),Js=oi.registerPlugin;class Ya{constructor(){this.listeners={},this.retainedEventArguments={},this.windowListeners={}}addListener(e,t){let i=!1;this.listeners[e]||(this.listeners[e]=[],i=!0),this.listeners[e].push(t);const r=this.windowListeners[e];r&&!r.registered&&this.addWindowListener(r),i&&this.sendRetainedArgumentsForEvent(e);const o=async()=>this.removeListener(e,t);return Promise.resolve({remove:o})}async removeAllListeners(){this.listeners={};for(const e in this.windowListeners)this.removeWindowListener(this.windowListeners[e]);this.windowListeners={}}notifyListeners(e,t,i){const s=this.listeners[e];if(!s){if(i){let r=this.retainedEventArguments[e];r||(r=[]),r.push(t),this.retainedEventArguments[e]=r}return}s.forEach(r=>r(t))}hasListeners(e){var t;return!!(!((t=this.listeners[e])===null||t===void 0)&&t.length)}registerWindowListener(e,t){this.windowListeners[t]={registered:!1,windowEventName:e,pluginEventName:t,handler:i=>{this.notifyListeners(t,i)}}}unimplemented(e="not implemented"){return new oi.Exception(e,Ri.Unimplemented)}unavailable(e="not available"){return new oi.Exception(e,Ri.Unavailable)}async removeListener(e,t){const i=this.listeners[e];if(!i)return;const s=i.indexOf(t);this.listeners[e].splice(s,1),this.listeners[e].length||this.removeWindowListener(this.windowListeners[e])}addWindowListener(e){window.addEventListener(e.windowEventName,e.handler),e.registered=!0}removeWindowListener(e){e&&(window.removeEventListener(e.windowEventName,e.handler),e.registered=!1)}sendRetainedArgumentsForEvent(e){const t=this.retainedEventArguments[e];t&&(delete this.retainedEventArguments[e],t.forEach(i=>{this.notifyListeners(e,i)}))}}const So=n=>encodeURIComponent(n).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape),Mo=n=>n.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent);class bd extends Ya{async getCookies(){const e=document.cookie,t={};return e.split(";").forEach(i=>{if(i.length<=0)return;let[s,r]=i.replace(/=/,"CAP_COOKIE").split("CAP_COOKIE");s=Mo(s).trim(),r=Mo(r).trim(),t[s]=r}),t}async setCookie(e){try{const t=So(e.key),i=So(e.value),s=`; expires=${(e.expires||"").replace("expires=","")}`,r=(e.path||"/").replace("path=",""),o=e.url!=null&&e.url.length>0?`domain=${e.url}`:"";document.cookie=`${t}=${i||""}${s}; path=${r}; ${o};`}catch(t){return Promise.reject(t)}}async deleteCookie(e){try{document.cookie=`${e.key}=; Max-Age=0`}catch(t){return Promise.reject(t)}}async clearCookies(){try{const e=document.cookie.split(";")||[];for(const t of e)document.cookie=t.replace(/^ +/,"").replace(/=.*/,`=;expires=${new Date().toUTCString()};path=/`)}catch(e){return Promise.reject(e)}}async clearAllCookies(){try{await this.clearCookies()}catch(e){return Promise.reject(e)}}}Js("CapacitorCookies",{web:()=>new bd});const yd=async n=>new Promise((e,t)=>{const i=new FileReader;i.onload=()=>{const s=i.result;e(s.indexOf(",")>=0?s.split(",")[1]:s)},i.onerror=s=>t(s),i.readAsDataURL(n)}),wd=(n={})=>{const e=Object.keys(n);return Object.keys(n).map(s=>s.toLocaleLowerCase()).reduce((s,r,o)=>(s[r]=n[e[o]],s),{})},Sd=(n,e=!0)=>n?Object.entries(n).reduce((i,s)=>{const[r,o]=s;let l,c;return Array.isArray(o)?(c="",o.forEach(d=>{l=e?encodeURIComponent(d):d,c+=`${r}=${l}&`}),c.slice(0,-1)):(l=e?encodeURIComponent(o):o,c=`${r}=${l}`),`${i}&${c}`},"").substr(1):null,Md=(n,e={})=>{const t=Object.assign({method:n.method||"GET",headers:n.headers},e),s=wd(n.headers)["content-type"]||"";if(typeof n.data=="string")t.body=n.data;else if(s.includes("application/x-www-form-urlencoded")){const r=new URLSearchParams;for(const[o,l]of Object.entries(n.data||{}))r.set(o,l);t.body=r.toString()}else if(s.includes("multipart/form-data")||n.data instanceof FormData){const r=new FormData;if(n.data instanceof FormData)n.data.forEach((l,c)=>{r.append(c,l)});else for(const l of Object.keys(n.data))r.append(l,n.data[l]);t.body=r;const o=new Headers(t.headers);o.delete("content-type"),t.headers=o}else(s.includes("application/json")||typeof n.data=="object")&&(t.body=JSON.stringify(n.data));return t};class Ed extends Ya{async request(e){const t=Md(e,e.webFetchExtra),i=Sd(e.params,e.shouldEncodeUrlParams),s=i?`${e.url}?${i}`:e.url,r=await fetch(s,t),o=r.headers.get("content-type")||"";let{responseType:l="text"}=r.ok?e:{};o.includes("application/json")&&(l="json");let c,d;switch(l){case"arraybuffer":case"blob":d=await r.blob(),c=await yd(d);break;case"json":c=await r.json();break;default:c=await r.text()}const h={};return r.headers.forEach((u,p)=>{h[p]=u}),{data:c,headers:h,status:r.status,url:r.url}}async get(e){return this.request(Object.assign(Object.assign({},e),{method:"GET"}))}async post(e){return this.request(Object.assign(Object.assign({},e),{method:"POST"}))}async put(e){return this.request(Object.assign(Object.assign({},e),{method:"PUT"}))}async patch(e){return this.request(Object.assign(Object.assign({},e),{method:"PATCH"}))}async delete(e){return this.request(Object.assign(Object.assign({},e),{method:"DELETE"}))}}Js("CapacitorHttp",{web:()=>new Ed});var Eo;(function(n){n.Dark="DARK",n.Light="LIGHT",n.Default="DEFAULT"})(Eo||(Eo={}));var To;(function(n){n.StatusBar="StatusBar",n.NavigationBar="NavigationBar"})(To||(To={}));class Td extends Ya{async setStyle(){this.unavailable("not available for web")}async setAnimation(){this.unavailable("not available for web")}async show(){this.unavailable("not available for web")}async hide(){this.unavailable("not available for web")}}Js("SystemBars",{web:()=>new Td});const Ad="modulepreload",Cd=function(n,e){return new URL(n,e).href},Ao={},qr=function(e,t,i){let s=Promise.resolve();if(t&&t.length>0){let d=function(h){return Promise.all(h.map(u=>Promise.resolve(u).then(p=>({status:"fulfilled",value:p}),p=>({status:"rejected",reason:p}))))};const o=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),c=l?.nonce||l?.getAttribute("nonce");s=d(t.map(h=>{if(h=Cd(h,i),h in Ao)return;Ao[h]=!0;const u=h.endsWith(".css"),p=u?'[rel="stylesheet"]':"";if(i)for(let _=o.length-1;_>=0;_--){const v=o[_];if(v.href===h&&(!u||v.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${h}"]${p}`))return;const g=document.createElement("link");if(g.rel=u?"stylesheet":Ad,u||(g.as="script"),g.crossOrigin="",g.href=h,c&&g.setAttribute("nonce",c),document.head.appendChild(g),u)return new Promise((_,v)=>{g.addEventListener("load",_),g.addEventListener("error",()=>v(new Error(`Unable to preload CSS for ${h}`)))})}))}function r(o){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=o,window.dispatchEvent(l),!l.defaultPrevented)throw o}return s.then(o=>{for(const l of o||[])l.status==="rejected"&&r(l.reason);return e().catch(r)})},Hl=Js("SocialLogin",{web:()=>qr(()=>import("./web-CCOC1Aej.js"),__vite__mapDeps([0,1,2]),import.meta.url).then(n=>new n.SocialLoginWeb)}),Rd={BASE_URL:"./",DEV:!1,MODE:"production",PROD:!0,SSR:!1,VITE_API_BASE_URL:"http://localhost:3001",VITE_APP_DESCRIPTION:"Social beauty ranking community",VITE_APP_NAME:"Berkeley Goggles",VITE_GOOGLE_CLIENT_ID:"683730085300-rf9g73ca25lh2e6gq1qih6lhd0sm9331.apps.googleusercontent.com"},Wl=oi.isNativePlatform()?"https://berkeley-goggles-production.up.railway.app":"http://localhost:3001";console.log("🔧 API Configuration Debug:",{VITE_API_BASE_URL:"http://localhost:3001",MODE:"production",DEV:!1,PROD:!0,hostname:window.location.hostname,baseURL:Wl,allEnvVars:Rd});const li={baseURL:Wl,timeout:3e4},Ve=async(n,e={})=>{const t=n.startsWith("http")?n:`${li.baseURL}${n}`,i={headers:{"Content-Type":"application/json",...e.headers},credentials:"include",...e},s=new AbortController,r=setTimeout(()=>s.abort(),li.timeout);try{const o=await fetch(t,{...i,signal:s.signal});if(!o.ok)try{const l=await o.clone().text();console.log("❌ API Error Response Body:",l.substring(0,500))}catch{console.log("❌ Could not read error response body")}return clearTimeout(r),o}catch(o){throw console.log("💥 API Request Failed:",{url:t,error:o instanceof Error?o.message:String(o),stack:o instanceof Error?o.stack:void 0}),clearTimeout(r),o}},Us={auth:{login:"/api/auth/login",register:"/api/auth/register",logout:"/api/auth/logout",refresh:"/api/auth/refresh",google:"/api/auth/google"},user:{profile:"/api/user/profile",update:"/api/user/profile"},photos:{upload:"/api/photos",webcam:"/api/photos/webcam",presigned:"/api/photos/presigned",get:n=>`/api/photos/${n}`,delete:n=>`/api/photos/${n}`},comparisons:{pair:"/api/comparisons/pair",submit:"/api/comparisons/submit"}},Co=Object.freeze(Object.defineProperty({__proto__:null,API_CONFIG:li,API_ENDPOINTS:Us,apiRequest:Ve},Symbol.toStringTag,{value:"Module"})),Xl=F.createContext(void 0),Nd=({children:n})=>{const[e,t]=F.useState(null),[i,s]=F.useState(!0),[r,o]=F.useState({currentTab:"profile",profileSetupComplete:!1,isAuthenticated:!1});F.useEffect(()=>{(async()=>{try{const y=localStorage.getItem("elo-check-user");if(y){const M=JSON.parse(y),w={...M,createdAt:new Date(M.createdAt),lastActive:new Date(M.lastActive),profilePhoto:M.profilePhoto&&!M.profilePhoto.startsWith("http")?`https://berkeley-goggles-production.up.railway.app${M.profilePhoto}`:M.profilePhoto};t(w),o(T=>({...T,isAuthenticated:!0,profileSetupComplete:M.profileComplete,currentTab:M.profileComplete?"play":"profile"}))}}catch(y){console.error("Failed to initialize auth:",y),localStorage.removeItem("elo-check-user")}finally{s(!1)}})()},[]);const l=async(f,y)=>{try{const M=await Ve(Us.auth.login,{method:"POST",body:JSON.stringify({email:f,password:y})});if(!M.ok)return!1;const w=await M.json();if(w.success&&w.user){const T={...w.user,profilePhoto:w.user.profilePhotoUrl,createdAt:new Date(w.user.createdAt),lastActive:new Date(w.user.lastActive)};return t(T),localStorage.setItem("elo-check-user",JSON.stringify(T)),o(R=>({...R,isAuthenticated:!0,profileSetupComplete:T.profileComplete,currentTab:T.profileComplete?"play":"profile"})),!0}return!1}catch(M){return console.error("Login failed:",M),!1}},c=async(f,y=!1)=>{try{const M=localStorage.getItem("inviteToken");console.log("🎫 AuthContext: loginWithGoogle - inviteToken from localStorage:",M),console.log("🎫 AuthContext: loginWithGoogle - isAccessToken:",y);const w=await Ve(Us.auth.google,{method:"POST",body:JSON.stringify({idToken:y?void 0:f,accessToken:y?f:void 0,inviteToken:M||void 0})});if(console.log("🎫 AuthContext: loginWithGoogle - API response status:",w.status),!w.ok)return!1;const T=await w.json();if(T.success&&T.user){const R={...T.user,profilePhoto:T.user.profilePhotoUrl,createdAt:new Date(T.user.createdAt),lastActive:new Date(T.user.lastActive)};return t(R),localStorage.setItem("elo-check-user",JSON.stringify(R)),M&&(localStorage.removeItem("inviteToken"),T.referrer&&console.log(`Now friends with ${T.referrer.name} via invite link`)),o(A=>({...A,isAuthenticated:!0,profileSetupComplete:R.profileComplete,currentTab:R.profileComplete?"play":"profile"})),!0}return!1}catch(M){return console.error("Google login failed:",M),!1}},d=async f=>{try{const y=localStorage.getItem("inviteToken");console.log("🎫 AuthContext: register - inviteToken from localStorage:",y);const M=await Ve(Us.auth.register,{method:"POST",body:JSON.stringify({...f,inviteToken:y||void 0})});if(!M.ok)return!1;const w=await M.json();if(w.success&&w.user){const T={...w.user,profilePhoto:w.user.profilePhotoUrl,createdAt:new Date(w.user.createdAt),lastActive:new Date(w.user.lastActive)};return t(T),localStorage.setItem("elo-check-user",JSON.stringify(T)),y&&(localStorage.removeItem("inviteToken"),w.referrer&&console.log(`Now friends with ${w.referrer.name} via invite link`)),o(R=>({...R,isAuthenticated:!0,profileSetupComplete:T.profileComplete,currentTab:T.profileComplete?"play":"profile"})),!0}return!1}catch(y){return console.error("Registration failed:",y),!1}},h=()=>{t(null),localStorage.removeItem("elo-check-user"),localStorage.removeItem("berkeley-goggles-user"),o({currentTab:"profile",profileSetupComplete:!1,isAuthenticated:!1})},u=async f=>{try{if(!e)return!1;const y=new FormData;y.append("userId",e.id),y.append("profileData",JSON.stringify({name:f.name,age:f.age,gender:f.gender,profilePhotoUrl:f.photoUrl})),f.photo&&y.append("photo",f.photo,"profile-photo.jpg");const M=await Ve("/api/user/setup",{method:"POST",body:y,headers:{}});if(!M.ok)return!1;const w=await M.json();if(w.success&&w.user){const T={...w.user,profilePhoto:w.user.profilePhotoUrl,createdAt:new Date(w.user.createdAt),lastActive:new Date(w.user.lastActive)};return t(T),localStorage.setItem("elo-check-user",JSON.stringify(T)),o(R=>({...R,profileSetupComplete:!0,currentTab:"play"})),!0}return!1}catch(y){return console.error("Profile setup failed:",y),!1}},p=async f=>{try{if(!e)return!1;const y=await Ve("/api/user/profile",{method:"PUT",body:JSON.stringify({userId:e.id,name:f.trim()})});if(!y.ok)return!1;const M=await y.json();if(M.success&&M.user){const w={...M.user,profilePhoto:M.user.profilePhotoUrl,createdAt:new Date(M.user.createdAt),lastActive:new Date(M.user.lastActive)};return t(w),localStorage.setItem("elo-check-user",JSON.stringify(w)),!0}return!1}catch(y){return console.error("Name update failed:",y),!1}},g=async f=>{try{if(!e)return!1;if(f.r2Url){const y=await Ve("/api/user/photo",{method:"POST",body:JSON.stringify({userId:e.id,r2PhotoUrl:f.r2Url,r2ThumbnailUrl:f.r2ThumbnailUrl})});if(!y.ok)try{const w=await y.json();throw console.error("R2 photo update failed:",w),new Error(w.error||"Photo update failed")}catch(w){throw w instanceof Error&&w.message!=="Photo update failed"?w:new Error("Photo update failed")}const M=await y.json();if(console.log("Photo update response:",M),M.success&&M.user){const w={...M.user,profilePhoto:M.user.profilePhotoUrl,createdAt:new Date(M.user.createdAt),lastActive:new Date(M.user.lastActive)};return console.log("Updated user with photo:",w),t(w),localStorage.setItem("elo-check-user",JSON.stringify(w)),!0}throw new Error(M.error||"Photo update failed")}else if(f.blob){const y=new FormData;y.append("userId",e.id),y.append("photo",f.blob,"profile-photo.jpg");const M=await Ve("/api/user/photo",{method:"POST",body:y,headers:{}});if(!M.ok)try{const T=await M.json();throw console.error("Blob photo update failed:",T),new Error(T.error||"Photo update failed")}catch(T){throw T instanceof Error&&T.message!=="Photo update failed"?T:new Error("Photo update failed")}const w=await M.json();if(console.log("Photo update response:",w),w.success&&w.user){const T={...w.user,profilePhoto:w.user.profilePhotoUrl,createdAt:new Date(w.user.createdAt),lastActive:new Date(w.user.lastActive)};return console.log("Updated user with photo:",T),t(T),localStorage.setItem("elo-check-user",JSON.stringify(T)),!0}throw new Error(w.error||"Photo update failed")}else return console.error("No photo blob or R2 URL provided"),!1}catch(y){throw console.error("Photo update failed:",y),y}},_=f=>{o(y=>({...y,currentTab:f}))},v=async f=>{try{if(!e?.id)return!1;const y=await Ve("/api/user/profile",{method:"PUT",body:JSON.stringify({userId:e.id,...f})});if(!y.ok)return!1;const M=await y.json();if(M.success&&M.user){const w={...M.user,profilePhoto:M.user.profilePhotoUrl,createdAt:new Date(M.user.createdAt),lastActive:new Date(M.user.lastActive)};return t(w),localStorage.setItem("elo-check-user",JSON.stringify(w)),!0}return!1}catch(y){return console.error("Failed to update profile:",y),!1}},m=async()=>{try{if(!e?.id)return!1;const f=await Ve(`/api/user/profile?userId=${e.id}`);if(!f.ok)return!1;const y=await f.json();if(y.success&&y.user){const M={...y.user,profilePhoto:y.user.profilePhotoUrl,createdAt:new Date(y.user.createdAt),lastActive:new Date(y.user.lastActive)};return t(M),localStorage.setItem("elo-check-user",JSON.stringify(M)),!0}return!1}catch(f){return console.error("Failed to refresh user data:",f),!1}};return a.jsx(Xl.Provider,{value:{user:e,navigationState:r,isLoading:i,login:l,loginWithGoogle:c,register:d,logout:h,setupProfile:u,updateUserName:p,updateUserPhoto:g,updateProfile:v,refreshUser:m,updateNavigationTab:_},children:n})},vn=()=>{const n=F.useContext(Xl);if(n===void 0)throw new Error("useAuth must be used within an AuthProvider");return n},ql=""+new URL("choski-BhnXc4Uo.jpg",import.meta.url).href,dr=""+new URL("oskimax--ui8DFym.png",import.meta.url).href,$l=""+new URL("goggles-DD1nNDfm.svg",import.meta.url).href,Fn=320,kn=320,Yn=45,ur=100,Ro=0,No=-50,Po=2,Lo=.65,Pd=()=>{const{loginWithGoogle:n}=vn(),[e,t]=F.useState(!1),[i,s]=F.useState(null),[r,o]=F.useState(()=>({x:Math.random()*(Fn-kn),y:Math.random()*(Fn-kn)})),l=F.useRef({x:Po*Lo*(Math.random()>.5?1:-1)*(.8+Math.random()*.4),y:Po*Lo*(Math.random()>.5?1:-1)*(.8+Math.random()*.4)}),c=F.useRef(),d=F.useCallback(()=>{const m=kn/2+Ro+ur/2+Yn,f=kn/2+No+Yn,y=-65,M=Fn-m,w=-65,T=Fn-f;o(R=>{let A=R.x+l.current.x,B=R.y+l.current.y;return(A<=y||A>=M)&&(l.current.x*=-1,A=Math.max(y,Math.min(A,M))),(B<=w||B>=T)&&(l.current.y*=-1,B=Math.max(w,Math.min(B,T))),{x:A,y:B}}),c.current=requestAnimationFrame(d)},[]);F.useEffect(()=>(c.current=requestAnimationFrame(d),()=>{c.current&&cancelAnimationFrame(c.current)}),[d]);const h=r.x+kn/2+Ro,u=r.y+kn/2+No,p=h-ur/2,g=h+ur/2,_=gd({onSuccess:async m=>{t(!0),s(null);try{if(!await n(m.access_token,!0))throw new Error("Google login failed")}catch(f){console.error("Google login failed:",f),s("Google login failed. Please try again.")}finally{t(!1)}},onError:()=>{s("Google login failed. Please try again.")}}),v=async()=>{console.log("🔵 Google button clicked, isNative:",oi.isNativePlatform()),t(!0),s(null);try{if(oi.isNativePlatform()){console.log("🔵 Using native Google Auth...");const m=await Hl.login({provider:"google",options:{scopes:["profile","email"]}});console.log("🔵 Native Google Auth result:",m);const f=m.result.responseType==="online"?m.result.idToken:null;if(!f)throw new Error("No ID token received from Google");if(!await n(f,!1))throw new Error("Login failed")}else console.log("🔵 Using web Google OAuth..."),t(!1),_()}catch(m){console.error("Google login failed:",m),s("Google login failed. Please try again."),t(!1)}};return a.jsxs("div",{className:"min-h-screen flex flex-col safe-area-inset",children:[a.jsx("div",{className:"flex-1 flex items-center justify-center px-6 relative z-10",children:a.jsxs("div",{className:"max-w-md mx-auto text-center",children:[a.jsxs("h1",{className:"text-5xl font-black italic uppercase tracking-tighter text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] mb-8",children:["Berkeley ",a.jsx("span",{className:"text-blue-300",children:"Goggles"})]}),a.jsx("div",{className:"mb-8",children:a.jsxs("div",{className:"mx-auto rounded-[2rem] overflow-hidden relative border border-white/20 shadow-2xl",style:{width:Fn,height:Fn},children:[a.jsx("img",{src:ql,alt:"",className:"absolute inset-0 w-full h-full object-cover"}),a.jsx("div",{className:"absolute inset-0",style:{clipPath:`circle(${Yn}px at ${p}px ${u}px)`},children:a.jsx("img",{src:dr,alt:"",className:"absolute inset-0 w-full h-full object-cover"})}),a.jsx("div",{className:"absolute inset-0",style:{clipPath:`circle(${Yn}px at ${g}px ${u}px)`},children:a.jsx("img",{src:dr,alt:"",className:"absolute inset-0 w-full h-full object-cover"})}),a.jsx("div",{className:"absolute inset-0",style:{clipPath:`inset(${u-Yn}px ${Fn-g}px ${Fn-(u-Yn+Yn*1.5)}px ${p}px)`},children:a.jsx("img",{src:dr,alt:"",className:"absolute inset-0 w-full h-full object-cover"})}),a.jsx("div",{className:"absolute pointer-events-none",style:{left:r.x,top:r.y,width:kn,height:kn},children:a.jsx("img",{src:$l,alt:"Goggles",className:"w-full h-full drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]"})})]})}),a.jsxs("div",{className:"space-y-4",children:[a.jsx("div",{className:"w-full flex justify-center",children:e?a.jsx("div",{className:"w-full py-3 px-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-center",children:a.jsx("span",{className:"text-white/80 font-medium",children:"Signing in with Google..."})}):a.jsxs("button",{onClick:v,className:"w-full flex items-center justify-center gap-3 py-3 px-4 bg-white rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors",children:[a.jsxs("svg",{className:"w-5 h-5",viewBox:"0 0 24 24",children:[a.jsx("path",{fill:"#4285F4",d:"M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"}),a.jsx("path",{fill:"#34A853",d:"M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"}),a.jsx("path",{fill:"#FBBC05",d:"M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"}),a.jsx("path",{fill:"#EA4335",d:"M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"})]}),"Sign in with Google"]})}),i&&a.jsx("div",{className:"p-4 bg-red-500/20 backdrop-blur-md border border-red-400/30 rounded-xl",children:a.jsx("p",{className:"text-red-200 text-sm font-medium",children:i})}),a.jsx("p",{className:"text-xs text-white/40 leading-relaxed text-center font-medium",children:"Dev Build v0.1.0-alpha"})]})]})}),a.jsx("footer",{className:"px-6 py-4 text-center relative z-10",children:a.jsx("p",{className:"text-xs text-white/30 font-medium tracking-wide",children:"Berkeley Goggles • Privacy First"})})]})};class Ld{async uploadDirect(e,t={}){const i=new FormData;i.append("photo",e),t.userId&&i.append("userId",t.userId);const s=await Ve("/api/photos",{method:"POST",body:i,headers:{}});if(!s.ok){const o=await s.json().catch(()=>({}));throw new Error(o.error||"Failed to upload photo")}const r=await s.json();if(!r.success)throw new Error(r.error||"Upload failed");return r.photo}async uploadWebcamPhoto(e,t,i){const s=new FormData;s.append("photo",e,"webcam-capture.jpg"),t&&s.append("userId",t),console.log("📡 PhotoUpload Debug (API_REQUEST):",{"API_CONFIG.baseURL":li.baseURL,"Current location":window.location.href,"Env MODE":"production","Env PROD":!0,"Env VITE_API_BASE_URL":"http://localhost:3001",Hostname:window.location.hostname});try{console.log("🚀 About to make API request to: /api/photos/webcam");const r=await Ve("/api/photos/webcam",{method:"POST",body:s,headers:{}});if(console.log("📡 Fetch Response:",{url:r.url,status:r.status,statusText:r.statusText,headers:Object.fromEntries(r.headers.entries())}),!r.ok){const l=await r.text();throw console.error("❌ Response not OK:",{status:r.status,statusText:r.statusText,body:l}),new Error(`Upload failed with status: ${r.status} ${r.statusText}`)}const o=await r.json();if(console.log("📦 Parsed Response JSON:",{fullResponse:o,hasSuccess:"success"in o,successValue:o.success,hasPhoto:"photo"in o,photoValue:o.photo,hasError:"error"in o,errorValue:o.error}),!o.success)throw console.error("❌ Backend reported failure:",o.error||"Upload failed"),new Error(o.error||"Upload failed");if(!o.photo)throw console.error("❌ No photo data in successful response:",o),new Error("No photo data returned from server");return console.log("✅ Returning photo result:",o.photo),o.photo}catch(r){throw console.error("💥 Fetch upload error:",r),r}}async getPresignedUploadData(e){const t=await Ve("/api/photos/presigned",{method:"POST",body:JSON.stringify({prefix:e||"uploads",expiresIn:300})});if(!t.ok){const s=await t.json().catch(()=>({}));throw new Error(s.error||"Failed to get presigned URL")}const i=await t.json();if(!i.success)throw new Error(i.error||"Failed to get presigned URL");return i.upload}async uploadToR2(e,t,i){const s=new XMLHttpRequest;return new Promise((r,o)=>{i&&s.upload.addEventListener("progress",c=>{c.lengthComputable&&i({loaded:c.loaded,total:c.total,percentage:Math.round(c.loaded/c.total*100)})}),s.addEventListener("load",()=>{s.status>=200&&s.status<300?r({id:t.key,url:t.publicUrl,status:"uploaded"}):o(new Error(`R2 upload failed with status: ${s.status}`))}),s.addEventListener("error",()=>{o(new Error("Network error during R2 upload"))});const l=new FormData;Object.entries(t.fields).forEach(([c,d])=>{l.append(c,d)}),l.append("file",e),s.open("PUT",t.uploadUrl),s.send(e)})}async uploadPresigned(e,t={}){const i=await this.getPresignedUploadData(t.prefix);return this.uploadToR2(e,i,t.onProgress)}async uploadPhoto(e,t={}){const{method:i="direct"}=t;try{return i==="presigned"?await this.uploadPresigned(e,t):await this.uploadDirect(e,t)}catch(s){if(i==="presigned")return console.warn("Presigned upload failed, falling back to direct upload:",s),await this.uploadDirect(e,t);throw s}}async deletePhoto(e){try{const t=e.startsWith("http"),i=t?`/api/photos/${encodeURIComponent(e)}`:`/api/photos/${e}`,s=await Ve(i,{method:"DELETE",body:JSON.stringify(t?{url:e}:{})});if(!s.ok)throw new Error("Failed to delete photo");return(await s.json()).success}catch(t){return console.error("Failed to delete photo:",t),!1}}getOptimalUploadMethod(e){return e>2*1024*1024?"presigned":"direct"}validateFile(e){return e.size>10*1024*1024?{valid:!1,error:"File size must be less than 10MB"}:e instanceof File&&!["image/jpeg","image/png","image/webp"].includes(e.type)?{valid:!1,error:"File must be a JPEG, PNG, or WebP image"}:{valid:!0}}async optimizeImage(e,t=1920,i=.8){return new Promise((s,r)=>{const o=document.createElement("canvas"),l=o.getContext("2d"),c=new Image;c.onload=()=>{let{width:d,height:h}=c;d>t&&(h=h*t/d,d=t),o.width=d,o.height=h,l?.drawImage(c,0,0,d,h),o.toBlob(u=>{u?s(u):r(new Error("Failed to optimize image"))},"image/jpeg",i)},c.onerror=()=>r(new Error("Failed to load image")),c.src=URL.createObjectURL(e)})}}const Ka=new Ld,Yl=({onCapture:n,onError:e,onUsePhoto:t,className:i="",userId:s,autoUpload:r=!0,onUploadProgress:o,mode:l="capture",onLiveDetectionComplete:c,targetConfidence:d=.95})=>{const h=F.useRef(null),u=F.useRef(null),p=F.useRef(null),g=F.useRef(!1),[_,v]=F.useState(!1),[m,f]=F.useState(!1),[y,M]=F.useState(!1),[w,T]=F.useState(null),[R,A]=F.useState(!1),[B,b]=F.useState(null),[E,N]=F.useState(!1),[U,D]=F.useState("Analyzing your face..."),P=F.useCallback(async()=>{try{M(!1);const Q=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:640},height:{ideal:640},facingMode:"user"},audio:!1});h.current&&(h.current.srcObject=Q,p.current=Q,v(!0))}catch(Q){console.error("Camera access failed:",Q),M(!0),Q instanceof Error&&(Q.name==="NotAllowedError"?e("Camera permission denied. Please allow camera access and try again."):Q.name==="NotFoundError"?e("No camera found on this device."):e("Failed to access camera. Please check your device settings."))}},[e]),I=F.useCallback(()=>{p.current&&(p.current.getTracks().forEach(Q=>Q.stop()),p.current=null),v(!1)},[]),k=F.useCallback(async()=>{if(!(!h.current||!u.current||!_)){f(!0);try{const Q=h.current,ne=u.current,Se=ne.getContext("2d");if(!Se)throw new Error("Could not get canvas context");ne.width=Q.videoWidth,ne.height=Q.videoHeight,Se.drawImage(Q,0,0,ne.width,ne.height);const ve=await new Promise((X,Z)=>{ne.toBlob(ce=>{ce?X(ce):Z(new Error("Failed to create image blob"))},"image/jpeg",.8)}),oe=ne.toDataURL("image/jpeg",.8);T(oe);let ue={blob:ve,dataUrl:oe,timestamp:Date.now()};if(r)try{console.log("🚀 Starting auto-upload...",{userId:s,blobSize:ve.size}),A(!0),b({loaded:0,total:ve.size,percentage:0});const X=await Ka.uploadWebcamPhoto(ve,s,Z=>{b(Z),o?.(Z)});console.log("✅ Upload completed successfully:",X),console.log("✅ Upload completed successfully:",X.url),ue.uploadResult=X,b({loaded:ve.size,total:ve.size,percentage:100})}catch(X){console.error("❌ Photo upload failed in camera component:",{error:X,message:X instanceof Error?X.message:String(X),stack:X instanceof Error?X.stack:void 0}),e("Photo captured but upload failed. You can retry later.")}finally{A(!1),b(null)}console.log("📸 Calling onCapture with capture data:",{hasBlob:!!ue.blob,hasDataUrl:!!ue.dataUrl,hasUploadResult:!!ue.uploadResult,uploadResult:ue.uploadResult}),n(ue),I()}catch(Q){console.error("Photo capture failed:",Q),e("Failed to capture photo. Please try again.")}finally{f(!1)}}},[_,n,e,I,r,s,o]),j=F.useCallback(()=>{T(null),P()},[P]),W=F.useCallback(async()=>{if(!h.current||!u.current||!_)return null;const Q=h.current,ne=u.current,Se=ne.getContext("2d");if(!Se)return null;ne.width=Q.videoWidth,ne.height=Q.videoHeight,Se.drawImage(Q,0,0,ne.width,ne.height);const ve=await new Promise(ue=>{ne.toBlob(X=>ue(X),"image/jpeg",.7)});if(!ve)return null;const oe=ne.toDataURL("image/jpeg",.7);return{blob:ve,dataUrl:oe}},[_]),ee=F.useCallback(async Q=>{try{const ne=new FormData;ne.append("photo",Q,"frame.jpg");const ve=await(await fetch(`${li.baseURL}/api/user/detect-gender?live=true`,{method:"POST",body:ne,credentials:"include"})).json();return ve.success?{gender:ve.detectedGender,confidence:ve.confidence}:null}catch(ne){return console.error("Frame analysis error:",ne),null}},[]);return F.useEffect(()=>{if(l!=="live-detection"||!_||g.current)return;g.current=!0,N(!0);const Q=["Analyzing your face...","Try moving the camera around","Make sure your face is well lit","Hold still...","Almost there...","That was amazing"];let ne=0,Se=0;const ve=Date.now(),oe=5e3;let ue=null;return(async()=>{for(;g.current;){const Z=await W();if(!Z){await new Promise(Ue=>setTimeout(Ue,500));continue}const ce=await ee(Z.blob);if(Se++,ce){console.log("Gender detection:",ce.gender,`${(ce.confidence*100).toFixed(1)}%`),(!ue||ce.confidence>ue.confidence)&&(ue={gender:ce.gender,confidence:ce.confidence,blob:Z.blob,dataUrl:Z.dataUrl});const Ue=Date.now()-ve;if(ce.confidence>=d&&Ue>=oe){console.log("Target confidence reached after minimum time!"),g.current=!1,N(!1),I(),c?.({gender:ce.gender,confidence:ce.confidence,photoBlob:Z.blob,photoDataUrl:Z.dataUrl});return}}Se%3===0&&(ne=(ne+1)%Q.length,D(Q[ne])),await new Promise(Ue=>setTimeout(Ue,750))}})(),()=>{g.current=!1}},[l,_,W,ee,d,c,I]),F.useEffect(()=>()=>{g.current=!1,I()},[I]),F.useEffect(()=>{P()},[P]),a.jsxs("div",{className:`camera-capture relative ${i}`,children:[!w&&a.jsxs("div",{className:"relative w-full aspect-square bg-gray-900 rounded-2xl overflow-hidden",children:[a.jsx("video",{ref:h,autoPlay:!0,playsInline:!0,muted:!0,className:"w-full h-full object-cover",style:{transform:"scaleX(-1)"}}),a.jsxs("div",{className:"absolute inset-0 pointer-events-none",children:[a.jsx("div",{className:"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",children:a.jsx("div",{className:`w-64 h-64 border-2 rounded-full ${E?"border-blue-400 animate-pulse":"border-white/50"}`})}),a.jsx("div",{className:"absolute bottom-4 left-4 right-4 text-center",children:a.jsx("p",{className:"text-white/80 text-sm font-medium",children:l==="live-detection"&&E?U:"Position your face within the circle"})})]}),y&&a.jsx("div",{className:"absolute inset-0 bg-black/80 flex items-center justify-center p-6",children:a.jsxs("div",{className:"text-center",children:[a.jsx("div",{className:"text-4xl mb-4",children:"📷"}),a.jsx("h3",{className:"text-lg font-semibold text-white mb-2",children:"Camera Access Required"}),a.jsx("p",{className:"text-gray-300 text-sm mb-4",children:"We need camera access to take your profile photo"}),a.jsx("button",{onClick:P,className:"btn-primary",children:"Try Again"})]})})]}),w&&a.jsxs("div",{className:"relative w-full aspect-square bg-gray-900 rounded-2xl overflow-hidden",children:[a.jsx("img",{src:w,alt:"Captured photo",className:"w-full h-full object-cover"}),a.jsxs("div",{className:"absolute bottom-4 left-4 right-4 flex gap-3",children:[a.jsx("button",{onClick:j,className:"flex-1 bg-gray-700/80 backdrop-blur text-white py-3 px-4 rounded-lg font-medium",children:"Retake"}),a.jsx("button",{onClick:t,className:"flex-1 bg-green-600/80 backdrop-blur text-white py-3 px-4 rounded-lg font-medium",children:"Use Photo"})]})]}),R&&B&&a.jsxs("div",{className:"mt-4 p-4 bg-gray-800/80 rounded-lg",children:[a.jsxs("div",{className:"flex items-center justify-between mb-2",children:[a.jsx("span",{className:"text-white text-sm",children:"Uploading photo..."}),a.jsxs("span",{className:"text-white text-sm",children:[B.percentage,"%"]})]}),a.jsx("div",{className:"w-full bg-gray-700 rounded-full h-2",children:a.jsx("div",{className:"bg-blue-500 h-2 rounded-full transition-all duration-300",style:{width:`${B.percentage}%`}})})]}),l==="capture"&&_&&!w&&a.jsx("div",{className:"mt-6 flex justify-center",children:a.jsx("button",{onClick:k,disabled:m||!_||R,className:`w-20 h-20 rounded-full border-4 border-white bg-transparent transition-all duration-200 ${m||!_||R?"opacity-50 cursor-not-allowed":"hover:bg-white/20 active:scale-95"}`,children:a.jsx("div",{className:"w-16 h-16 bg-white rounded-full mx-auto"})})}),a.jsx("canvas",{ref:u,className:"hidden"})]})},Dd=()=>{const{setupProfile:n,logout:e,user:t}=vn(),[i,s]=F.useState("name"),[r,o]=F.useState(!1),[l,c]=F.useState(null),[d,h]=F.useState({name:"",age:18}),[u,p]=F.useState(null),[g,_]=F.useState(null),[v,m]=F.useState(!1),[f,y]=F.useState(null),[M,w]=F.useState(!1),[T,R]=F.useState(null),[A,B]=F.useState(""),[b,E]=F.useState([]),[N,U]=F.useState(!1),[D,P]=F.useState(0),I=oe=>{if(oe.preventDefault(),d.name.trim().length<2){c("Please enter your name (at least 2 characters)");return}if(d.age<18){c("You must be at least 18 years old");return}c(null),s("photo")},k=oe=>{console.log("📷 ProfileSetup: Photo captured:",{hasBlob:!!oe.blob,hasDataUrl:!!oe.dataUrl,hasUploadResult:!!oe.uploadResult,uploadResult:oe.uploadResult,timestamp:oe.timestamp}),p(oe),w(!1),R(null),y(null),c(null)},j=async oe=>{console.log("✅ Live detection complete:",oe.gender,`${(oe.confidence*100).toFixed(1)}%`);const ue={blob:oe.photoBlob,dataUrl:oe.photoDataUrl,timestamp:Date.now()};m(!0);try{const X=await Ka.uploadWebcamPhoto(oe.photoBlob,t?.id,_);ue.uploadResult=X,console.log("📤 Photo uploaded:",X.url)}catch(X){console.error("Upload failed:",X)}p(ue),y(oe.gender),h(X=>({...X,gender:oe.gender})),m(!1),s("friends")},W=oe=>{console.error("📷 ProfileSetup: Photo capture error:",oe),c(oe)},ee=async()=>{if(!A.trim()){c("Please enter some emails to find friends");return}U(!0),c(null);try{const oe=A.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi)||[];if(oe.length===0)throw new Error("No valid emails found. Make sure to include @berkeley.edu emails!");const X=await(await Ve("/api/friends/match-contacts",{method:"POST",body:JSON.stringify({userId:t?.id,contacts:oe})})).json();if(X.success)E(X.matches),P(X.matches.length);else throw new Error(X.error||"Failed to match contacts")}catch(oe){console.error("Sync error:",oe),c(oe instanceof Error?oe.message:"Failed to find friends. Please try again.")}finally{U(!1)}},Q=async oe=>{try{(await(await Ve("/api/friends/request",{method:"POST",body:JSON.stringify({userId:t?.id,friendId:oe})})).json()).success&&E(Z=>Z.map(ce=>ce.id===oe?{...ce,friendshipStatus:"pending",isInitiator:!0}:ce))}catch(ue){console.error("Friend request error:",ue)}},ne=()=>{s("terms")},Se=async oe=>{if(oe.preventDefault(),!u){c("Please take a profile photo. A photo is required for gender detection.");return}if(!f){c("Gender detection must complete before proceeding. Please retake your photo.");return}o(!0),c(null);try{console.log("👤 ProfileSetup: Starting profile setup with data:",{formData:d,capturedPhoto:u?{hasBlob:!!u.blob,hasUploadResult:!!u.uploadResult,uploadResultUrl:u.uploadResult?.url}:{skipped:!0}});const ue={...d,gender:f,...u&&u.uploadResult?.url?{photoUrl:u.uploadResult.url}:u?{photo:u.blob}:{}};if(console.log("👤 ProfileSetup: Calling setupProfile with:",ue),!await n(ue))throw new Error("Failed to setup profile");console.log("✅ ProfileSetup: Profile setup completed successfully")}catch(ue){console.error("Profile setup error:",ue),c("Failed to setup your profile. Please try again.")}finally{o(!1)}},ve=()=>{i==="photo"?s("name"):i==="friends"?s("photo"):i==="terms"&&s("friends")};return a.jsxs("div",{className:"min-h-screen flex flex-col safe-area-inset",children:[a.jsxs("header",{className:"px-6 py-4 flex-shrink-0",children:[a.jsxs("div",{className:"flex items-center justify-between",children:[i!=="name"?a.jsx("button",{onClick:ve,className:"text-white hover:text-gray-300 transition-colors",children:"← Back"}):a.jsx("button",{onClick:e,className:"text-gray-400 hover:text-gray-300 transition-colors text-sm",children:"← Sign out"}),a.jsx("h1",{className:"text-2xl font-bold text-white",children:"Profile Setup"}),a.jsx("button",{onClick:e,className:"text-gray-400 hover:text-gray-300 transition-colors text-sm",children:"Sign out"})]}),a.jsxs("div",{className:"mt-4 flex space-x-2",children:[a.jsx("div",{className:"flex-1 h-1 rounded bg-blue-500"}),a.jsx("div",{className:`flex-1 h-1 rounded ${i==="photo"||i==="friends"||i==="terms"?"bg-blue-500":"bg-gray-700"}`}),a.jsx("div",{className:`flex-1 h-1 rounded ${i==="friends"||i==="terms"?"bg-blue-500":"bg-gray-700"}`}),a.jsx("div",{className:`flex-1 h-1 rounded ${i==="terms"?"bg-blue-500":"bg-gray-700"}`})]})]}),a.jsxs("main",{className:"flex-1 px-6 py-4 overflow-y-auto",children:[i==="name"&&a.jsxs("div",{className:"max-w-md mx-auto",children:[a.jsxs("div",{className:"text-center mb-8",children:[a.jsx("h2",{className:"text-3xl font-bold text-white mb-2",children:"Welcome!"}),a.jsx("p",{className:"text-gray-400",children:"Let's set up your profile to get started"})]}),a.jsxs("form",{onSubmit:I,className:"space-y-6",children:[a.jsxs("div",{children:[a.jsx("label",{htmlFor:"name",className:"block text-sm font-medium text-white mb-2",children:"What's your name?"}),a.jsx("input",{type:"text",id:"name",value:d.name,onChange:oe=>h(ue=>({...ue,name:oe.target.value})),placeholder:"Enter your name",className:"w-full px-4 py-3 liquid-glass rounded-lg text-white placeholder-gray-400 focus:outline-none",autoComplete:"given-name",autoFocus:!0})]}),a.jsxs("div",{children:[a.jsx("label",{htmlFor:"age",className:"block text-sm font-medium text-white mb-2",children:"Age"}),a.jsx("input",{type:"number",id:"age",min:"18",max:"99",value:d.age,onChange:oe=>h(ue=>({...ue,age:parseInt(oe.target.value)})),className:"w-full px-4 py-3 liquid-glass rounded-lg text-white placeholder-gray-400 focus:outline-none"})]}),l&&a.jsx("div",{className:"p-4 bg-red-600/20 border border-red-600/50 rounded-lg",children:a.jsx("p",{className:"text-red-400 text-sm",children:l})}),a.jsx("button",{type:"submit",className:"w-full btn-primary",children:"Continue"})]})]}),i==="photo"&&a.jsxs("div",{className:"max-w-md mx-auto",children:[a.jsxs("div",{className:"text-center mb-8",children:[a.jsx("h2",{className:"text-3xl font-bold text-white mb-2",children:"Face Scan"}),a.jsx("p",{className:"text-gray-400",children:"Position your face in the circle - we'll automatically detect when ready"})]}),l&&a.jsx("div",{className:"mb-6 p-4 bg-red-600/20 border border-red-600/50 rounded-lg",children:a.jsx("p",{className:"text-red-400 text-sm",children:l})}),a.jsx(Yl,{onCapture:k,onError:W,className:"mb-6",userId:t?.id,autoUpload:!1,onUploadProgress:_,mode:"live-detection",onLiveDetectionComplete:j,targetConfidence:.95}),v&&a.jsx("div",{className:"mt-4 p-6 bg-blue-600/20 border-2 border-blue-500/50 rounded-2xl animate-pulse",children:a.jsxs("div",{className:"flex flex-col items-center text-center",children:[a.jsx("div",{className:"w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"}),a.jsx("h3",{className:"text-xl font-black text-white uppercase tracking-tighter mb-1",children:"AI Analyzing Photo"}),a.jsx("p",{className:"text-blue-200 text-xs font-bold uppercase tracking-widest",children:"Identifying gender & biological traits..."})]})}),M&&u&&a.jsx("div",{className:"mt-4 p-6 bg-red-600/20 border-2 border-red-500/50 rounded-2xl",children:a.jsxs("div",{className:"flex flex-col items-center text-center",children:[a.jsx("span",{className:"text-4xl mb-3",children:"📷"}),a.jsx("h3",{className:"text-lg font-black text-red-400 uppercase tracking-tighter mb-2",children:"Photo Quality Too Low"}),a.jsx("p",{className:"text-red-200 text-sm mb-3",children:"Please take a clearer photo"}),a.jsxs("ul",{className:"text-gray-300 text-xs mb-4 text-left space-y-1 w-full px-4",children:[a.jsx("li",{children:"• Make sure your face is clearly visible"}),a.jsx("li",{children:"• Use good lighting (avoid shadows)"}),a.jsx("li",{children:"• Look directly at the camera"}),a.jsx("li",{children:"• Remove sunglasses or hats"})]}),a.jsx("div",{className:"space-y-3 w-full",children:a.jsx("button",{type:"button",onClick:()=>p(null),className:"w-full bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded-lg font-bold transition-colors",children:"Take New Photo"})})]})}),g&&a.jsxs("div",{className:"mt-4 p-4 bg-gray-800/80 rounded-lg",children:[a.jsxs("div",{className:"flex items-center justify-between mb-2",children:[a.jsx("span",{className:"text-white text-sm",children:"Uploading to cloud storage..."}),a.jsxs("span",{className:"text-white text-sm",children:[g.percentage,"%"]})]}),a.jsx("div",{className:"w-full bg-gray-700 rounded-full h-2",children:a.jsx("div",{className:"bg-blue-500 h-2 rounded-full transition-all duration-300",style:{width:`${g.percentage}%`}})})]}),a.jsx("div",{className:"mt-8 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg",children:a.jsxs("div",{className:"flex items-center space-x-3",children:[a.jsx("span",{className:"text-2xl",children:"🤖"}),a.jsxs("div",{children:[a.jsx("h3",{className:"text-white font-bold text-sm",children:"Live AI Detection"}),a.jsx("p",{className:"text-blue-200 text-xs mt-1",children:"Our AI is scanning in real-time. Once we're confident in the detection, you'll automatically proceed to the next step."})]})]})})]}),i==="friends"&&a.jsxs("div",{className:"max-w-md mx-auto",children:[a.jsxs("div",{className:"text-center mb-8",children:[a.jsx("h2",{className:"text-3xl font-bold text-white mb-2",children:"Find Your Friends"}),a.jsx("p",{className:"text-gray-400",children:"Challenge your friends to MOG battles and see who ranks higher!"})]}),a.jsxs("div",{className:"space-y-6",children:[a.jsxs("div",{children:[a.jsx("label",{className:"block text-sm font-medium text-white mb-2",children:"Address Book Sync"}),a.jsxs("div",{className:"p-4 bg-gray-800 border border-gray-600 rounded-lg",children:[a.jsx("p",{className:"text-sm text-gray-300 mb-4",children:"Paste emails of friends you want to find on the app (comma or space separated). We'll match them against our directory."}),a.jsx("textarea",{value:A,onChange:oe=>B(oe.target.value),placeholder:"friend1@berkeley.edu, friend2@berkeley.edu...",className:"w-full h-32 px-4 py-3 liquid-glass rounded-lg text-white placeholder-gray-500 focus:outline-none"}),a.jsx("button",{onClick:ee,disabled:N,className:"mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-bold transition-colors disabled:opacity-50",children:N?"Syncing...":"Sync Contacts"})]})]}),b.length>0&&a.jsxs("div",{className:"space-y-4",children:[a.jsxs("h3",{className:"text-white font-bold flex items-center",children:[a.jsx("span",{className:"bg-green-500 text-white text-xs px-2 py-1 rounded-full mr-2",children:D}),"Friends Found"]}),a.jsx("div",{className:"max-h-60 overflow-y-auto pr-2 space-y-2 custom-scrollbar",children:b.map(oe=>a.jsxs("div",{className:"flex items-center justify-between p-3 bg-gray-800 rounded-xl border border-white/5",children:[a.jsxs("div",{className:"flex items-center space-x-3",children:[a.jsx("div",{className:"w-10 h-10 rounded-full bg-gray-700 overflow-hidden border border-white/10",children:oe.profilePhotoUrl?a.jsx("img",{src:oe.profilePhotoUrl,alt:oe.name,className:"w-full h-full object-cover"}):a.jsx("div",{className:"w-full h-full flex items-center justify-center text-gray-500 text-xs",children:oe.name.charAt(0)})}),a.jsxs("div",{children:[a.jsx("p",{className:"text-white font-bold text-sm",children:oe.name}),a.jsx("p",{className:"text-gray-500 text-xs",children:oe.email})]})]}),oe.friendshipStatus==="none"?a.jsx("button",{onClick:()=>Q(oe.id),className:"bg-white text-black px-3 py-1 rounded-lg text-xs font-black hover:bg-gray-200 transition-colors",children:"ADD"}):a.jsx("span",{className:"text-blue-400 text-xs font-bold uppercase",children:oe.friendshipStatus==="pending"?oe.isInitiator?"Requested":"Wants to add you":"Friends"})]},oe.id))})]}),l&&a.jsx("div",{className:"p-4 bg-red-600/20 border border-red-600/50 rounded-lg",children:a.jsx("p",{className:"text-red-400 text-sm",children:l})}),a.jsx("button",{onClick:ne,className:"w-full btn-primary",children:"Continue"})]})]}),i==="terms"&&a.jsxs("div",{className:"max-w-md mx-auto",children:[a.jsxs("div",{className:"text-center mb-8",children:[a.jsx("h2",{className:"text-3xl font-bold text-white mb-2",children:"Almost Done!"}),a.jsx("p",{className:"text-gray-400",children:"Ready to complete your profile setup"})]}),u?a.jsxs("div",{className:"mb-6",children:[a.jsx("img",{src:u.dataUrl,alt:"Your profile photo",className:"w-32 h-32 rounded-full object-cover mx-auto border-4 border-gray-600"}),a.jsxs("p",{className:"text-center text-gray-400 mt-4",children:["Hello, ",d.name,"!"]}),f&&a.jsxs("div",{className:"mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center justify-center space-x-3",children:[a.jsx("span",{className:"text-2xl",children:f==="male"?"🕺":"💃"}),a.jsxs("div",{className:"text-left",children:[a.jsx("p",{className:"text-[10px] font-black text-blue-300 uppercase tracking-widest leading-none",children:"AI Detected"}),a.jsx("p",{className:"text-lg font-black text-white uppercase tracking-tighter",children:f})]})]})]}):a.jsx("div",{className:"mb-6 p-4 bg-red-900/20 border border-red-600/50 rounded-lg",children:a.jsx("p",{className:"text-red-400 text-sm text-center",children:"⚠️ Please go back and take a profile photo. A photo is required for gender detection."})}),l&&a.jsx("div",{className:"p-4 bg-red-600/20 border border-red-600/50 rounded-lg",children:a.jsx("p",{className:"text-red-400 text-sm",children:l})}),a.jsx("button",{onClick:Se,disabled:r,className:"w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed",children:r?"Setting up your profile...":"Complete Setup"})]})]})]})},gn=Object.create(null);gn.open="0";gn.close="1";gn.ping="2";gn.pong="3";gn.message="4";gn.upgrade="5";gn.noop="6";const Fs=Object.create(null);Object.keys(gn).forEach(n=>{Fs[gn[n]]=n});const $r={type:"error",data:"parser error"},Kl=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",Zl=typeof ArrayBuffer=="function",Jl=n=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(n):n&&n.buffer instanceof ArrayBuffer,Za=({type:n,data:e},t,i)=>Kl&&e instanceof Blob?t?i(e):Do(e,i):Zl&&(e instanceof ArrayBuffer||Jl(e))?t?i(e):Do(new Blob([e]),i):i(gn[n]+(e||"")),Do=(n,e)=>{const t=new FileReader;return t.onload=function(){const i=t.result.split(",")[1];e("b"+(i||""))},t.readAsDataURL(n)};function Io(n){return n instanceof Uint8Array?n:n instanceof ArrayBuffer?new Uint8Array(n):new Uint8Array(n.buffer,n.byteOffset,n.byteLength)}let hr;function Id(n,e){if(Kl&&n.data instanceof Blob)return n.data.arrayBuffer().then(Io).then(e);if(Zl&&(n.data instanceof ArrayBuffer||Jl(n.data)))return e(Io(n.data));Za(n,!1,t=>{hr||(hr=new TextEncoder),e(hr.encode(t))})}const Uo="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",$i=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let n=0;n<Uo.length;n++)$i[Uo.charCodeAt(n)]=n;const Ud=n=>{let e=n.length*.75,t=n.length,i,s=0,r,o,l,c;n[n.length-1]==="="&&(e--,n[n.length-2]==="="&&e--);const d=new ArrayBuffer(e),h=new Uint8Array(d);for(i=0;i<t;i+=4)r=$i[n.charCodeAt(i)],o=$i[n.charCodeAt(i+1)],l=$i[n.charCodeAt(i+2)],c=$i[n.charCodeAt(i+3)],h[s++]=r<<2|o>>4,h[s++]=(o&15)<<4|l>>2,h[s++]=(l&3)<<6|c&63;return d},Fd=typeof ArrayBuffer=="function",Ja=(n,e)=>{if(typeof n!="string")return{type:"message",data:Ql(n,e)};const t=n.charAt(0);return t==="b"?{type:"message",data:kd(n.substring(1),e)}:Fs[t]?n.length>1?{type:Fs[t],data:n.substring(1)}:{type:Fs[t]}:$r},kd=(n,e)=>{if(Fd){const t=Ud(n);return Ql(t,e)}else return{base64:!0,data:n}},Ql=(n,e)=>e==="blob"?n instanceof Blob?n:new Blob([n]):n instanceof ArrayBuffer?n:n.buffer,ec="",Od=(n,e)=>{const t=n.length,i=new Array(t);let s=0;n.forEach((r,o)=>{Za(r,!1,l=>{i[o]=l,++s===t&&e(i.join(ec))})})},Bd=(n,e)=>{const t=n.split(ec),i=[];for(let s=0;s<t.length;s++){const r=Ja(t[s],e);if(i.push(r),r.type==="error")break}return i};function jd(){return new TransformStream({transform(n,e){Id(n,t=>{const i=t.length;let s;if(i<126)s=new Uint8Array(1),new DataView(s.buffer).setUint8(0,i);else if(i<65536){s=new Uint8Array(3);const r=new DataView(s.buffer);r.setUint8(0,126),r.setUint16(1,i)}else{s=new Uint8Array(9);const r=new DataView(s.buffer);r.setUint8(0,127),r.setBigUint64(1,BigInt(i))}n.data&&typeof n.data!="string"&&(s[0]|=128),e.enqueue(s),e.enqueue(t)})}})}let fr;function hs(n){return n.reduce((e,t)=>e+t.length,0)}function fs(n,e){if(n[0].length===e)return n.shift();const t=new Uint8Array(e);let i=0;for(let s=0;s<e;s++)t[s]=n[0][i++],i===n[0].length&&(n.shift(),i=0);return n.length&&i<n[0].length&&(n[0]=n[0].slice(i)),t}function zd(n,e){fr||(fr=new TextDecoder);const t=[];let i=0,s=-1,r=!1;return new TransformStream({transform(o,l){for(t.push(o);;){if(i===0){if(hs(t)<1)break;const c=fs(t,1);r=(c[0]&128)===128,s=c[0]&127,s<126?i=3:s===126?i=1:i=2}else if(i===1){if(hs(t)<2)break;const c=fs(t,2);s=new DataView(c.buffer,c.byteOffset,c.length).getUint16(0),i=3}else if(i===2){if(hs(t)<8)break;const c=fs(t,8),d=new DataView(c.buffer,c.byteOffset,c.length),h=d.getUint32(0);if(h>Math.pow(2,21)-1){l.enqueue($r);break}s=h*Math.pow(2,32)+d.getUint32(4),i=3}else{if(hs(t)<s)break;const c=fs(t,s);l.enqueue(Ja(r?c:fr.decode(c),e)),i=0}if(s===0||s>n){l.enqueue($r);break}}}})}const tc=4;function bt(n){if(n)return Vd(n)}function Vd(n){for(var e in bt.prototype)n[e]=bt.prototype[e];return n}bt.prototype.on=bt.prototype.addEventListener=function(n,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+n]=this._callbacks["$"+n]||[]).push(e),this};bt.prototype.once=function(n,e){function t(){this.off(n,t),e.apply(this,arguments)}return t.fn=e,this.on(n,t),this};bt.prototype.off=bt.prototype.removeListener=bt.prototype.removeAllListeners=bt.prototype.removeEventListener=function(n,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var t=this._callbacks["$"+n];if(!t)return this;if(arguments.length==1)return delete this._callbacks["$"+n],this;for(var i,s=0;s<t.length;s++)if(i=t[s],i===e||i.fn===e){t.splice(s,1);break}return t.length===0&&delete this._callbacks["$"+n],this};bt.prototype.emit=function(n){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),t=this._callbacks["$"+n],i=1;i<arguments.length;i++)e[i-1]=arguments[i];if(t){t=t.slice(0);for(var i=0,s=t.length;i<s;++i)t[i].apply(this,e)}return this};bt.prototype.emitReserved=bt.prototype.emit;bt.prototype.listeners=function(n){return this._callbacks=this._callbacks||{},this._callbacks["$"+n]||[]};bt.prototype.hasListeners=function(n){return!!this.listeners(n).length};const Qs=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,t)=>t(e,0),Yt=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),Gd="arraybuffer";function nc(n,...e){return e.reduce((t,i)=>(n.hasOwnProperty(i)&&(t[i]=n[i]),t),{})}const Hd=Yt.setTimeout,Wd=Yt.clearTimeout;function er(n,e){e.useNativeTimers?(n.setTimeoutFn=Hd.bind(Yt),n.clearTimeoutFn=Wd.bind(Yt)):(n.setTimeoutFn=Yt.setTimeout.bind(Yt),n.clearTimeoutFn=Yt.clearTimeout.bind(Yt))}const Xd=1.33;function qd(n){return typeof n=="string"?$d(n):Math.ceil((n.byteLength||n.size)*Xd)}function $d(n){let e=0,t=0;for(let i=0,s=n.length;i<s;i++)e=n.charCodeAt(i),e<128?t+=1:e<2048?t+=2:e<55296||e>=57344?t+=3:(i++,t+=4);return t}function ic(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function Yd(n){let e="";for(let t in n)n.hasOwnProperty(t)&&(e.length&&(e+="&"),e+=encodeURIComponent(t)+"="+encodeURIComponent(n[t]));return e}function Kd(n){let e={},t=n.split("&");for(let i=0,s=t.length;i<s;i++){let r=t[i].split("=");e[decodeURIComponent(r[0])]=decodeURIComponent(r[1])}return e}class Zd extends Error{constructor(e,t,i){super(e),this.description=t,this.context=i,this.type="TransportError"}}class Qa extends bt{constructor(e){super(),this.writable=!1,er(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,t,i){return super.emitReserved("error",new Zd(e,t,i)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const t=Ja(e,this.socket.binaryType);this.onPacket(t)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,t={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(t)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const t=Yd(e);return t.length?"?"+t:""}}class Jd extends Qa{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const t=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let i=0;this._polling&&(i++,this.once("pollComplete",function(){--i||t()})),this.writable||(i++,this.once("drain",function(){--i||t()}))}else t()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const t=i=>{if(this.readyState==="opening"&&i.type==="open"&&this.onOpen(),i.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(i)};Bd(e,this.socket.binaryType).forEach(t),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,Od(e,t=>{this.doWrite(t,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",t=this.query||{};return this.opts.timestampRequests!==!1&&(t[this.opts.timestampParam]=ic()),!this.supportsBinary&&!t.sid&&(t.b64=1),this.createUri(e,t)}}let sc=!1;try{sc=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const Qd=sc;function eu(){}class tu extends Jd{constructor(e){if(super(e),typeof location<"u"){const t=location.protocol==="https:";let i=location.port;i||(i=t?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||i!==e.port}}doWrite(e,t){const i=this.request({method:"POST",data:e});i.on("success",t),i.on("error",(s,r)=>{this.onError("xhr post error",s,r)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(t,i)=>{this.onError("xhr poll error",t,i)}),this.pollXhr=e}}class hn extends bt{constructor(e,t,i){super(),this.createRequest=e,er(this,i),this._opts=i,this._method=i.method||"GET",this._uri=t,this._data=i.data!==void 0?i.data:null,this._create()}_create(){var e;const t=nc(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");t.xdomain=!!this._opts.xd;const i=this._xhr=this.createRequest(t);try{i.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){i.setDisableHeaderCheck&&i.setDisableHeaderCheck(!0);for(let s in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(s)&&i.setRequestHeader(s,this._opts.extraHeaders[s])}}catch{}if(this._method==="POST")try{i.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{i.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(i),"withCredentials"in i&&(i.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(i.timeout=this._opts.requestTimeout),i.onreadystatechange=()=>{var s;i.readyState===3&&((s=this._opts.cookieJar)===null||s===void 0||s.parseCookies(i.getResponseHeader("set-cookie"))),i.readyState===4&&(i.status===200||i.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof i.status=="number"?i.status:0)},0))},i.send(this._data)}catch(s){this.setTimeoutFn(()=>{this._onError(s)},0);return}typeof document<"u"&&(this._index=hn.requestsCount++,hn.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=eu,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete hn.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}hn.requestsCount=0;hn.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",Fo);else if(typeof addEventListener=="function"){const n="onpagehide"in Yt?"pagehide":"unload";addEventListener(n,Fo,!1)}}function Fo(){for(let n in hn.requests)hn.requests.hasOwnProperty(n)&&hn.requests[n].abort()}const nu=(function(){const n=rc({xdomain:!1});return n&&n.responseType!==null})();class iu extends tu{constructor(e){super(e);const t=e&&e.forceBase64;this.supportsBinary=nu&&!t}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new hn(rc,this.uri(),e)}}function rc(n){const e=n.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||Qd))return new XMLHttpRequest}catch{}if(!e)try{return new Yt[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const ac=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class su extends Qa{get name(){return"websocket"}doOpen(){const e=this.uri(),t=this.opts.protocols,i=ac?{}:nc(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(i.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,t,i)}catch(s){return this.emitReserved("error",s)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const i=e[t],s=t===e.length-1;Za(i,this.supportsBinary,r=>{try{this.doWrite(i,r)}catch{}s&&Qs(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",t=this.query||{};return this.opts.timestampRequests&&(t[this.opts.timestampParam]=ic()),this.supportsBinary||(t.b64=1),this.createUri(e,t)}}const pr=Yt.WebSocket||Yt.MozWebSocket;class ru extends su{createSocket(e,t,i){return ac?new pr(e,t,i):t?new pr(e,t):new pr(e)}doWrite(e,t){this.ws.send(t)}}class au extends Qa{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const t=zd(Number.MAX_SAFE_INTEGER,this.socket.binaryType),i=e.readable.pipeThrough(t).getReader(),s=jd();s.readable.pipeTo(e.writable),this._writer=s.writable.getWriter();const r=()=>{i.read().then(({done:l,value:c})=>{l||(this.onPacket(c),r())}).catch(l=>{})};r();const o={type:"open"};this.query.sid&&(o.data=`{"sid":"${this.query.sid}"}`),this._writer.write(o).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const i=e[t],s=t===e.length-1;this._writer.write(i).then(()=>{s&&Qs(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const ou={websocket:ru,webtransport:au,polling:iu},lu=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,cu=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function Yr(n){if(n.length>8e3)throw"URI too long";const e=n,t=n.indexOf("["),i=n.indexOf("]");t!=-1&&i!=-1&&(n=n.substring(0,t)+n.substring(t,i).replace(/:/g,";")+n.substring(i,n.length));let s=lu.exec(n||""),r={},o=14;for(;o--;)r[cu[o]]=s[o]||"";return t!=-1&&i!=-1&&(r.source=e,r.host=r.host.substring(1,r.host.length-1).replace(/;/g,":"),r.authority=r.authority.replace("[","").replace("]","").replace(/;/g,":"),r.ipv6uri=!0),r.pathNames=du(r,r.path),r.queryKey=uu(r,r.query),r}function du(n,e){const t=/\/{2,9}/g,i=e.replace(t,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&i.splice(0,1),e.slice(-1)=="/"&&i.splice(i.length-1,1),i}function uu(n,e){const t={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(i,s,r){s&&(t[s]=r)}),t}const Kr=typeof addEventListener=="function"&&typeof removeEventListener=="function",ks=[];Kr&&addEventListener("offline",()=>{ks.forEach(n=>n())},!1);class Xn extends bt{constructor(e,t){if(super(),this.binaryType=Gd,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(t=e,e=null),e){const i=Yr(e);t.hostname=i.host,t.secure=i.protocol==="https"||i.protocol==="wss",t.port=i.port,i.query&&(t.query=i.query)}else t.host&&(t.hostname=Yr(t.host).host);er(this,t),this.secure=t.secure!=null?t.secure:typeof location<"u"&&location.protocol==="https:",t.hostname&&!t.port&&(t.port=this.secure?"443":"80"),this.hostname=t.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=t.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},t.transports.forEach(i=>{const s=i.prototype.name;this.transports.push(s),this._transportsByName[s]=i}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},t),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=Kd(this.opts.query)),Kr&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},ks.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const t=Object.assign({},this.opts.query);t.EIO=tc,t.transport=e,this.id&&(t.sid=this.id);const i=Object.assign({},this.opts,{query:t,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](i)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&Xn.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const t=this.createTransport(e);t.open(),this.setTransport(t)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",t=>this._onClose("transport close",t))}onOpen(){this.readyState="open",Xn.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const t=new Error("server error");t.code=e.data,this._onError(t);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let t=1;for(let i=0;i<this.writeBuffer.length;i++){const s=this.writeBuffer[i].data;if(s&&(t+=qd(s)),i>0&&t>this._maxPayload)return this.writeBuffer.slice(0,i);t+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,Qs(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,t,i){return this._sendPacket("message",e,t,i),this}send(e,t,i){return this._sendPacket("message",e,t,i),this}_sendPacket(e,t,i,s){if(typeof t=="function"&&(s=t,t=void 0),typeof i=="function"&&(s=i,i=null),this.readyState==="closing"||this.readyState==="closed")return;i=i||{},i.compress=i.compress!==!1;const r={type:e,data:t,options:i};this.emitReserved("packetCreate",r),this.writeBuffer.push(r),s&&this.once("flush",s),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},t=()=>{this.off("upgrade",t),this.off("upgradeError",t),e()},i=()=>{this.once("upgrade",t),this.once("upgradeError",t)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?i():e()}):this.upgrading?i():e()),this}_onError(e){if(Xn.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,t){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),Kr&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const i=ks.indexOf(this._offlineEventListener);i!==-1&&ks.splice(i,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,t),this.writeBuffer=[],this._prevBufferLen=0}}}Xn.protocol=tc;class hu extends Xn{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let t=this.createTransport(e),i=!1;Xn.priorWebsocketSuccess=!1;const s=()=>{i||(t.send([{type:"ping",data:"probe"}]),t.once("packet",u=>{if(!i)if(u.type==="pong"&&u.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",t),!t)return;Xn.priorWebsocketSuccess=t.name==="websocket",this.transport.pause(()=>{i||this.readyState!=="closed"&&(h(),this.setTransport(t),t.send([{type:"upgrade"}]),this.emitReserved("upgrade",t),t=null,this.upgrading=!1,this.flush())})}else{const p=new Error("probe error");p.transport=t.name,this.emitReserved("upgradeError",p)}}))};function r(){i||(i=!0,h(),t.close(),t=null)}const o=u=>{const p=new Error("probe error: "+u);p.transport=t.name,r(),this.emitReserved("upgradeError",p)};function l(){o("transport closed")}function c(){o("socket closed")}function d(u){t&&u.name!==t.name&&r()}const h=()=>{t.removeListener("open",s),t.removeListener("error",o),t.removeListener("close",l),this.off("close",c),this.off("upgrading",d)};t.once("open",s),t.once("error",o),t.once("close",l),this.once("close",c),this.once("upgrading",d),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{i||t.open()},200):t.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const t=[];for(let i=0;i<e.length;i++)~this.transports.indexOf(e[i])&&t.push(e[i]);return t}}let fu=class extends hu{constructor(e,t={}){const i=typeof e=="object"?e:t;(!i.transports||i.transports&&typeof i.transports[0]=="string")&&(i.transports=(i.transports||["polling","websocket","webtransport"]).map(s=>ou[s]).filter(s=>!!s)),super(e,i)}};function pu(n,e="",t){let i=n;t=t||typeof location<"u"&&location,n==null&&(n=t.protocol+"//"+t.host),typeof n=="string"&&(n.charAt(0)==="/"&&(n.charAt(1)==="/"?n=t.protocol+n:n=t.host+n),/^(https?|wss?):\/\//.test(n)||(typeof t<"u"?n=t.protocol+"//"+n:n="https://"+n),i=Yr(n)),i.port||(/^(http|ws)$/.test(i.protocol)?i.port="80":/^(http|ws)s$/.test(i.protocol)&&(i.port="443")),i.path=i.path||"/";const r=i.host.indexOf(":")!==-1?"["+i.host+"]":i.host;return i.id=i.protocol+"://"+r+":"+i.port+e,i.href=i.protocol+"://"+r+(t&&t.port===i.port?"":":"+i.port),i}const mu=typeof ArrayBuffer=="function",gu=n=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(n):n.buffer instanceof ArrayBuffer,oc=Object.prototype.toString,xu=typeof Blob=="function"||typeof Blob<"u"&&oc.call(Blob)==="[object BlobConstructor]",_u=typeof File=="function"||typeof File<"u"&&oc.call(File)==="[object FileConstructor]";function eo(n){return mu&&(n instanceof ArrayBuffer||gu(n))||xu&&n instanceof Blob||_u&&n instanceof File}function Os(n,e){if(!n||typeof n!="object")return!1;if(Array.isArray(n)){for(let t=0,i=n.length;t<i;t++)if(Os(n[t]))return!0;return!1}if(eo(n))return!0;if(n.toJSON&&typeof n.toJSON=="function"&&arguments.length===1)return Os(n.toJSON(),!0);for(const t in n)if(Object.prototype.hasOwnProperty.call(n,t)&&Os(n[t]))return!0;return!1}function vu(n){const e=[],t=n.data,i=n;return i.data=Zr(t,e),i.attachments=e.length,{packet:i,buffers:e}}function Zr(n,e){if(!n)return n;if(eo(n)){const t={_placeholder:!0,num:e.length};return e.push(n),t}else if(Array.isArray(n)){const t=new Array(n.length);for(let i=0;i<n.length;i++)t[i]=Zr(n[i],e);return t}else if(typeof n=="object"&&!(n instanceof Date)){const t={};for(const i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=Zr(n[i],e));return t}return n}function bu(n,e){return n.data=Jr(n.data,e),delete n.attachments,n}function Jr(n,e){if(!n)return n;if(n&&n._placeholder===!0){if(typeof n.num=="number"&&n.num>=0&&n.num<e.length)return e[n.num];throw new Error("illegal attachments")}else if(Array.isArray(n))for(let t=0;t<n.length;t++)n[t]=Jr(n[t],e);else if(typeof n=="object")for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&(n[t]=Jr(n[t],e));return n}const lc=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"],yu=5;var qe;(function(n){n[n.CONNECT=0]="CONNECT",n[n.DISCONNECT=1]="DISCONNECT",n[n.EVENT=2]="EVENT",n[n.ACK=3]="ACK",n[n.CONNECT_ERROR=4]="CONNECT_ERROR",n[n.BINARY_EVENT=5]="BINARY_EVENT",n[n.BINARY_ACK=6]="BINARY_ACK"})(qe||(qe={}));class wu{constructor(e){this.replacer=e}encode(e){return(e.type===qe.EVENT||e.type===qe.ACK)&&Os(e)?this.encodeAsBinary({type:e.type===qe.EVENT?qe.BINARY_EVENT:qe.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let t=""+e.type;return(e.type===qe.BINARY_EVENT||e.type===qe.BINARY_ACK)&&(t+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(t+=e.nsp+","),e.id!=null&&(t+=e.id),e.data!=null&&(t+=JSON.stringify(e.data,this.replacer)),t}encodeAsBinary(e){const t=vu(e),i=this.encodeAsString(t.packet),s=t.buffers;return s.unshift(i),s}}class to extends bt{constructor(e){super(),this.reviver=e}add(e){let t;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");t=this.decodeString(e);const i=t.type===qe.BINARY_EVENT;i||t.type===qe.BINARY_ACK?(t.type=i?qe.EVENT:qe.ACK,this.reconstructor=new Su(t),t.attachments===0&&super.emitReserved("decoded",t)):super.emitReserved("decoded",t)}else if(eo(e)||e.base64)if(this.reconstructor)t=this.reconstructor.takeBinaryData(e),t&&(this.reconstructor=null,super.emitReserved("decoded",t));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let t=0;const i={type:Number(e.charAt(0))};if(qe[i.type]===void 0)throw new Error("unknown packet type "+i.type);if(i.type===qe.BINARY_EVENT||i.type===qe.BINARY_ACK){const r=t+1;for(;e.charAt(++t)!=="-"&&t!=e.length;);const o=e.substring(r,t);if(o!=Number(o)||e.charAt(t)!=="-")throw new Error("Illegal attachments");i.attachments=Number(o)}if(e.charAt(t+1)==="/"){const r=t+1;for(;++t&&!(e.charAt(t)===","||t===e.length););i.nsp=e.substring(r,t)}else i.nsp="/";const s=e.charAt(t+1);if(s!==""&&Number(s)==s){const r=t+1;for(;++t;){const o=e.charAt(t);if(o==null||Number(o)!=o){--t;break}if(t===e.length)break}i.id=Number(e.substring(r,t+1))}if(e.charAt(++t)){const r=this.tryParse(e.substr(t));if(to.isPayloadValid(i.type,r))i.data=r;else throw new Error("invalid payload")}return i}tryParse(e){try{return JSON.parse(e,this.reviver)}catch{return!1}}static isPayloadValid(e,t){switch(e){case qe.CONNECT:return qs(t);case qe.DISCONNECT:return t===void 0;case qe.CONNECT_ERROR:return typeof t=="string"||qs(t);case qe.EVENT:case qe.BINARY_EVENT:return Array.isArray(t)&&(typeof t[0]=="number"||typeof t[0]=="string"&&lc.indexOf(t[0])===-1);case qe.ACK:case qe.BINARY_ACK:return Array.isArray(t)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class Su{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const t=bu(this.reconPack,this.buffers);return this.finishedReconstruction(),t}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}function Mu(n){return typeof n=="string"}const Eu=Number.isInteger||function(n){return typeof n=="number"&&isFinite(n)&&Math.floor(n)===n};function Tu(n){return n===void 0||Eu(n)}function qs(n){return Object.prototype.toString.call(n)==="[object Object]"}function Au(n,e){switch(n){case qe.CONNECT:return e===void 0||qs(e);case qe.DISCONNECT:return e===void 0;case qe.EVENT:return Array.isArray(e)&&(typeof e[0]=="number"||typeof e[0]=="string"&&lc.indexOf(e[0])===-1);case qe.ACK:return Array.isArray(e);case qe.CONNECT_ERROR:return typeof e=="string"||qs(e);default:return!1}}function Cu(n){return Mu(n.nsp)&&Tu(n.id)&&Au(n.type,n.data)}const Ru=Object.freeze(Object.defineProperty({__proto__:null,Decoder:to,Encoder:wu,get PacketType(){return qe},isPacketValid:Cu,protocol:yu},Symbol.toStringTag,{value:"Module"}));function nn(n,e,t){return n.on(e,t),function(){n.off(e,t)}}const Nu=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class cc extends bt{constructor(e,t,i){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=t,i&&i.auth&&(this.auth=i.auth),this._opts=Object.assign({},i),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[nn(e,"open",this.onopen.bind(this)),nn(e,"packet",this.onpacket.bind(this)),nn(e,"error",this.onerror.bind(this)),nn(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...t){var i,s,r;if(Nu.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(t.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(t),this;const o={type:qe.EVENT,data:t};if(o.options={},o.options.compress=this.flags.compress!==!1,typeof t[t.length-1]=="function"){const h=this.ids++,u=t.pop();this._registerAckCallback(h,u),o.id=h}const l=(s=(i=this.io.engine)===null||i===void 0?void 0:i.transport)===null||s===void 0?void 0:s.writable,c=this.connected&&!(!((r=this.io.engine)===null||r===void 0)&&r._hasPingExpired());return this.flags.volatile&&!l||(c?(this.notifyOutgoingListeners(o),this.packet(o)):this.sendBuffer.push(o)),this.flags={},this}_registerAckCallback(e,t){var i;const s=(i=this.flags.timeout)!==null&&i!==void 0?i:this._opts.ackTimeout;if(s===void 0){this.acks[e]=t;return}const r=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let l=0;l<this.sendBuffer.length;l++)this.sendBuffer[l].id===e&&this.sendBuffer.splice(l,1);t.call(this,new Error("operation has timed out"))},s),o=(...l)=>{this.io.clearTimeoutFn(r),t.apply(this,l)};o.withError=!0,this.acks[e]=o}emitWithAck(e,...t){return new Promise((i,s)=>{const r=(o,l)=>o?s(o):i(l);r.withError=!0,t.push(r),this.emit(e,...t)})}_addToQueue(e){let t;typeof e[e.length-1]=="function"&&(t=e.pop());const i={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((s,...r)=>(this._queue[0],s!==null?i.tryCount>this._opts.retries&&(this._queue.shift(),t&&t(s)):(this._queue.shift(),t&&t(null,...r)),i.pending=!1,this._drainQueue())),this._queue.push(i),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const t=this._queue[0];t.pending&&!e||(t.pending=!0,t.tryCount++,this.flags=t.flags,this.emit.apply(this,t.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:qe.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,t){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,t),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(i=>String(i.id)===e)){const i=this.acks[e];delete this.acks[e],i.withError&&i.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case qe.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case qe.EVENT:case qe.BINARY_EVENT:this.onevent(e);break;case qe.ACK:case qe.BINARY_ACK:this.onack(e);break;case qe.DISCONNECT:this.ondisconnect();break;case qe.CONNECT_ERROR:this.destroy();const i=new Error(e.data.message);i.data=e.data.data,this.emitReserved("connect_error",i);break}}onevent(e){const t=e.data||[];e.id!=null&&t.push(this.ack(e.id)),this.connected?this.emitEvent(t):this.receiveBuffer.push(Object.freeze(t))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const t=this._anyListeners.slice();for(const i of t)i.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const t=this;let i=!1;return function(...s){i||(i=!0,t.packet({type:qe.ACK,id:e,data:s}))}}onack(e){const t=this.acks[e.id];typeof t=="function"&&(delete this.acks[e.id],t.withError&&e.data.unshift(null),t.apply(this,e.data))}onconnect(e,t){this.id=e,this.recovered=t&&this._pid===t,this._pid=t,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:qe.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const t=this._anyListeners;for(let i=0;i<t.length;i++)if(e===t[i])return t.splice(i,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const t=this._anyOutgoingListeners;for(let i=0;i<t.length;i++)if(e===t[i])return t.splice(i,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const t=this._anyOutgoingListeners.slice();for(const i of t)i.apply(this,e.data)}}}function Ui(n){n=n||{},this.ms=n.min||100,this.max=n.max||1e4,this.factor=n.factor||2,this.jitter=n.jitter>0&&n.jitter<=1?n.jitter:0,this.attempts=0}Ui.prototype.duration=function(){var n=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),t=Math.floor(e*this.jitter*n);n=(Math.floor(e*10)&1)==0?n-t:n+t}return Math.min(n,this.max)|0};Ui.prototype.reset=function(){this.attempts=0};Ui.prototype.setMin=function(n){this.ms=n};Ui.prototype.setMax=function(n){this.max=n};Ui.prototype.setJitter=function(n){this.jitter=n};class Qr extends bt{constructor(e,t){var i;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(t=e,e=void 0),t=t||{},t.path=t.path||"/socket.io",this.opts=t,er(this,t),this.reconnection(t.reconnection!==!1),this.reconnectionAttempts(t.reconnectionAttempts||1/0),this.reconnectionDelay(t.reconnectionDelay||1e3),this.reconnectionDelayMax(t.reconnectionDelayMax||5e3),this.randomizationFactor((i=t.randomizationFactor)!==null&&i!==void 0?i:.5),this.backoff=new Ui({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(t.timeout==null?2e4:t.timeout),this._readyState="closed",this.uri=e;const s=t.parser||Ru;this.encoder=new s.Encoder,this.decoder=new s.Decoder,this._autoConnect=t.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var t;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(t=this.backoff)===null||t===void 0||t.setMin(e),this)}randomizationFactor(e){var t;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(t=this.backoff)===null||t===void 0||t.setJitter(e),this)}reconnectionDelayMax(e){var t;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(t=this.backoff)===null||t===void 0||t.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new fu(this.uri,this.opts);const t=this.engine,i=this;this._readyState="opening",this.skipReconnect=!1;const s=nn(t,"open",function(){i.onopen(),e&&e()}),r=l=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",l),e?e(l):this.maybeReconnectOnOpen()},o=nn(t,"error",r);if(this._timeout!==!1){const l=this._timeout,c=this.setTimeoutFn(()=>{s(),r(new Error("timeout")),t.close()},l);this.opts.autoUnref&&c.unref(),this.subs.push(()=>{this.clearTimeoutFn(c)})}return this.subs.push(s),this.subs.push(o),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(nn(e,"ping",this.onping.bind(this)),nn(e,"data",this.ondata.bind(this)),nn(e,"error",this.onerror.bind(this)),nn(e,"close",this.onclose.bind(this)),nn(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(t){this.onclose("parse error",t)}}ondecoded(e){Qs(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,t){let i=this.nsps[e];return i?this._autoConnect&&!i.active&&i.connect():(i=new cc(this,e,t),this.nsps[e]=i),i}_destroy(e){const t=Object.keys(this.nsps);for(const i of t)if(this.nsps[i].active)return;this._close()}_packet(e){const t=this.encoder.encode(e);for(let i=0;i<t.length;i++)this.engine.write(t[i],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,t){var i;this.cleanup(),(i=this.engine)===null||i===void 0||i.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,t),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const t=this.backoff.duration();this._reconnecting=!0;const i=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(s=>{s?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",s)):e.onreconnect()}))},t);this.opts.autoUnref&&i.unref(),this.subs.push(()=>{this.clearTimeoutFn(i)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const ji={};function Bs(n,e){typeof n=="object"&&(e=n,n=void 0),e=e||{};const t=pu(n,e.path||"/socket.io"),i=t.source,s=t.id,r=t.path,o=ji[s]&&r in ji[s].nsps,l=e.forceNew||e["force new connection"]||e.multiplex===!1||o;let c;return l?c=new Qr(i,e):(ji[s]||(ji[s]=new Qr(i,e)),c=ji[s]),t.query&&!e.query&&(e.query=t.queryKey),c.socket(t.path,e)}Object.assign(Bs,{Manager:Qr,Socket:cc,io:Bs,connect:Bs});let Ct=null;const dc=n=>(Ct?.connected||(Ct&&(Ct.disconnect(),Ct=null),console.log("🔌 Connecting to Socket.IO:",li.baseURL),Ct=Bs(li.baseURL,{query:{userId:n},withCredentials:!0,transports:["polling","websocket"],reconnection:!0,reconnectionAttempts:10,reconnectionDelay:1e3,reconnectionDelayMax:5e3,timeout:2e4}),Ct.on("connect",()=>{console.log("🔌 Socket connected:",Ct?.id)}),Ct.on("disconnect",e=>{e==="io client disconnect"?console.log("🔌 Socket manually disconnected"):console.log("🔌 Socket disconnected, will reconnect:",e)}),Ct.on("connect_error",e=>{console.error("🔌 Socket connect_error:",e.message)}),Ct.on("reconnect",e=>{console.log("🔌 Socket reconnected after",e,"attempts")}),Ct.on("reconnect_attempt",e=>{console.log("🔌 Socket reconnect attempt:",e)}),Ct.on("reconnect_error",e=>{console.error("🔌 Socket reconnect_error:",e.message)}),Ct.on("reconnect_failed",()=>{console.error("🔌 Socket reconnect failed after all attempts")})),Ct),Pu=()=>Ct,Lu="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'%20standalone='no'?%3e%3c!--%20Created%20with%20Inkscape%20(http://www.inkscape.org/)%20--%3e%3csvg%20width='210mm'%20height='297mm'%20viewBox='0%200%20210%20297'%20version='1.1'%20id='svg1'%20inkscape:export-filename='bitmap.svg'%20inkscape:export-xdpi='96'%20inkscape:export-ydpi='96'%20sodipodi:docname='bitmap.svg'%20inkscape:version='1.4.3%20(0d15f75,%202025-12-25)'%20xml:space='preserve'%20xmlns:inkscape='http://www.inkscape.org/namespaces/inkscape'%20xmlns:sodipodi='http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:svg='http://www.w3.org/2000/svg'%3e%3csodipodi:namedview%20id='namedview1'%20pagecolor='%23000000'%20bordercolor='%23000000'%20borderopacity='0'%20inkscape:showpageshadow='2'%20inkscape:pageopacity='0.0'%20inkscape:pagecheckerboard='0'%20inkscape:deskcolor='%23d1d1d1'%20inkscape:document-units='mm'%20inkscape:zoom='0.49204085'%20inkscape:cx='447.11735'%20inkscape:cy='900.33175'%20inkscape:window-width='1229'%20inkscape:window-height='781'%20inkscape:window-x='0'%20inkscape:window-y='38'%20inkscape:window-maximized='0'%20inkscape:current-layer='layer1'%20inkscape:antialias-rendering='true'%20showborder='true'%20inkscape:export-bgcolor='%23ffffff00'%3e%3cinkscape:page%20x='0'%20y='0'%20width='210'%20height='297'%20id='page2'%20margin='0'%20bleed='0'%20/%3e%3c/sodipodi:namedview%3e%3cdefs%20id='defs1'%20/%3e%3cg%20inkscape:groupmode='layer'%20id='layer1'%20inkscape:label='Layer%201'%3e%3cpath%20style='fill:%23ffffff;fill-opacity:1;stroke-width:0.264583'%20d='m%20-25.069447,262.20675%20c%200.133941,-0.1536%2019.2454054,-13.61319%2060.369386,-58.80553%20L%206.0415313,162.98944%2017.160263,145.71268%2049.879129,181.01487%20168.6468,38.952377%20211.29098,13.581042%20190.31214,58.894369%2068.432274,203.91962%2097.597062,239.50485%2080.940811,252.37857%2050.751336,218.46363%20C%2031.666979,243.25045%2013.056845,261.08674%20-4.8965254,286.69818%20-13.939649,277.97792%20-18.127109,272.67342%20-25.069447,262.20675%20Z'%20id='path2'%20sodipodi:nodetypes='cccccccccccccc'%20/%3e%3cpath%20style='fill:%23ffffff;fill-opacity:1;stroke-width:0.264583'%20d='m%20235.73394,260.79122%20c%20-0.13394,-0.1536%20-19.2454,-13.61319%20-60.36938,-58.80553%20l%2029.2584,-40.41178%20-11.11873,-17.27676%20-32.71886,35.30219%20L%2042.017691,37.53685%20-0.62649087,12.165515%2020.352351,57.478842%20142.23222,202.50409%20l%20-29.16479,35.58523%2016.65625,12.87372%2030.18948,-33.91494%20c%2019.08436,24.78682%2037.69449,42.62311%2055.64786,68.23455%209.04312,-8.72026%2013.23058,-14.02476%2020.17292,-24.49143%20z'%20id='path2-9'%20sodipodi:nodetypes='cccccccccccccc'%20/%3e%3c/g%3e%3c/svg%3e",Du=()=>{const{user:n,logout:e,updateUserPhoto:t,updateProfile:i,refreshUser:s,updateNavigationTab:r}=vn(),[o,l]=F.useState(!1),[c,d]=F.useState(!1),[h,u]=F.useState(null),[p,g]=F.useState(null),[_,v]=F.useState([]),[m,f]=F.useState(!1),[y,M]=F.useState(null),[w,T]=F.useState(!1),[R,A]=F.useState([]),[B,b]=F.useState([]),[E,N]=F.useState(null),[U,D]=F.useState([]),[P,I]=F.useState([]),[k,j]=F.useState([]),[W,ee]=F.useState(null),[Q,ne]=F.useState(null),[Se,ve]=F.useState(null),[oe,ue]=F.useState(!1),[X,Z]=F.useState(null),[ce,Ue]=F.useState(!1),[me,$e]=F.useState(null),[se,ye]=F.useState([]),[Te,Ie]=F.useState(""),[Ee,Je]=F.useState(!1),[L,ft]=F.useState({}),Qe=F.useRef(null),[ot,Re]=F.useState(!1),[C,x]=F.useState(18),[V,J]=F.useState(""),[ie,K]=F.useState(!1),[De,de]=F.useState(null);F.useEffect(()=>{n?.id&&(Ne(),Be(),re(),pe(),s())},[n?.id]),F.useEffect(()=>{Qe.current?.scrollIntoView({behavior:"smooth"})},[se]),F.useEffect(()=>{if(!n?.id)return;const O=dc(n.id);return O.on("message:new",we=>{console.log("📨 New message received:",we),me?.id===we.senderId&&ye(Ke=>[...Ke,we]),ft(Ke=>({...Ke,[we.senderId]:(Ke[we.senderId]||0)+1}))}),O.on("challenge:vote",we=>{console.log("🗳️ Challenge vote received:",we),j(Ke=>Ke.map(mt=>mt.id===we.challengeId?{...mt,challengerVotes:we.challengerVotes,challengedVotes:we.challengedVotes}:mt)),we.isComplete&&re()}),O.on("challenge:new",we=>{console.log("⚔️ New challenge received:",we),D(Ke=>[...Ke,we])}),O.on("challenge:accepted",we=>{console.log("✅ Challenge accepted:",we),I(Ke=>Ke.filter(mt=>mt.id!==we.id)),j(Ke=>[...Ke,we])}),()=>{O.off("message:new"),O.off("challenge:vote"),O.off("challenge:new"),O.off("challenge:accepted")}},[n?.id,me?.id]);const Ne=async()=>{if(n?.id)try{const we=await(await Ve(`/api/rankings/my-stats?userId=${n.id}`)).json();we.success&&g(we.stats);const mt=await(await Ve(`/api/rankings/battle-log?userId=${n.id}&limit=50`)).json();mt.success&&v(mt.log)}catch(O){console.error("Failed to fetch user data:",O)}},Be=async()=>{if(n?.id)try{const we=await(await Ve(`/api/friends/list?userId=${n.id}`)).json();we.success&&A(we.friends);const mt=await(await Ve(`/api/friends/pending?userId=${n.id}`)).json();mt.success&&b(mt.pending)}catch(O){console.error("Failed to fetch friends:",O)}},re=async()=>{if(n?.id)try{const we=await(await Ve(`/api/challenges/pending/${n.id}`)).json();we.success&&(D(we.incoming),I(we.outgoing),j(we.active||[]))}catch(O){console.error("Failed to fetch challenges:",O)}},pe=async()=>{if(n?.id)try{const we=await(await Ve(`/api/messages/unread/${n.id}`)).json();we.success&&ft(we.unreadByFriend)}catch(O){console.error("Failed to fetch unread counts:",O)}},Ce=async O=>{if(n?.id){ne(O);try{const Ke=await(await Ve("/api/challenges",{method:"POST",body:JSON.stringify({challengerId:n.id,challengedId:O})})).json();Ke.success?re():alert(Ke.error||"Failed to send challenge")}catch(we){console.error("Failed to send challenge:",we)}finally{ne(null)}}},Le=async O=>{if(n?.id){ee(O);try{(await(await Ve(`/api/challenges/accept/${O}`,{method:"POST",body:JSON.stringify({userId:n.id})})).json()).success&&re()}catch(we){console.error("Failed to accept challenge:",we)}finally{ee(null)}}},he=async O=>{if(n?.id)try{(await(await Ve(`/api/challenges/decline/${O}`,{method:"POST",body:JSON.stringify({userId:n.id})})).json()).success&&re()}catch(we){console.error("Failed to decline challenge:",we)}},He=async O=>{$e(O),Ue(!0),await z(O.id),await Ve(`/api/messages/read/${O.id}`,{method:"PUT",body:JSON.stringify({userId:n?.id})}),pe()},z=async O=>{if(n?.id)try{const Ke=await(await Ve(`/api/messages/conversation/${O}?userId=${n.id}`)).json();Ke.success&&ye(Ke.messages)}catch(we){console.error("Failed to fetch messages:",we)}},xe=async()=>{if(!(!n?.id||!me||!Te.trim())){Je(!0);try{(await(await Ve("/api/messages",{method:"POST",body:JSON.stringify({senderId:n.id,receiverId:me.id,content:Te.trim()})})).json()).success&&(Ie(""),z(me.id))}catch(O){console.error("Failed to send message:",O)}finally{Je(!1)}}},le=O=>P.some(we=>we.challenged?.id===O)||U.some(we=>we.challenger?.id===O),Me=async O=>{if(n?.id){N(O);try{(await(await Ve("/api/friends/accept",{method:"POST",body:JSON.stringify({userId:n.id,friendId:O})})).json()).success&&Be()}catch(we){console.error("Failed to accept friend:",we)}finally{N(null)}}},ae=async O=>{if(n?.id)try{(await(await Ve("/api/friends/decline",{method:"POST",body:JSON.stringify({userId:n.id,friendId:O})})).json()).success&&Be()}catch(we){console.error("Failed to decline friend:",we)}},te=async()=>{if(n?.id)try{const we=await(await Ve("/api/invite/create",{method:"POST",body:JSON.stringify({userId:n.id})})).json();if(!we.success){console.error("Failed to create invite:",we.error),alert("Failed to create invite link. Please try again.");return}const Ke=`${window.location.origin}/invite/${we.token}`,mt=`Join me on Berkeley Goggles! See how you rank and challenge me to a MOG battle. ${Ke}`;if(navigator.share)try{await navigator.share({title:"Berkeley Goggles",text:mt,url:Ke})}catch(bn){console.error("Error sharing:",bn)}else try{await navigator.clipboard.writeText(mt),alert("Invite link copied to clipboard!")}catch(bn){console.error("Failed to copy:",bn)}}catch(O){console.error("Error creating invite:",O),alert("Failed to create invite link. Please try again.")}},fe=()=>{l(!0),u(null)},ze=async O=>{console.log("✅ Live detection complete:",O.gender,`${(O.confidence*100).toFixed(1)}%`),d(!0),u(null);try{const we=await Ka.uploadWebcamPhoto(O.photoBlob,n?.id);console.log("📤 Photo uploaded:",we.url);const Ke={r2Url:we.url,r2ThumbnailUrl:we.thumbnailUrl};await t(Ke)?(l(!1),Ne()):u("Failed to update photo.")}catch(we){console.error("Failed to update photo:",we),u("Failed to update photo. Please try again.")}finally{d(!1)}},lt=O=>{u(O)},it=()=>{Re(!0),de(null),x(n?.age||18),J(n?.bio||"")},Wt=()=>{Re(!1),de(null)},Jt=async()=>{if(n){if(!V.trim()){de("Bio is required");return}if(V.length>25){de("Bio must be 25 characters or less");return}K(!0),de(null);try{const O={age:C,bio:V.trim()};await i(O)?Re(!1):de("Failed to update profile.")}catch(O){console.error("Failed to update profile:",O),de("Failed to update profile.")}finally{K(!1)}}},ar=O=>O.split(" ")[0];return n?a.jsxs("div",{className:"absolute inset-0 flex flex-col",style:{background:"linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)"},children:[a.jsxs("div",{className:"absolute inset-0 overflow-hidden pointer-events-none",children:[a.jsx("div",{className:"absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-blue-400/20 rounded-full blur-[80px]"}),a.jsx("div",{className:"absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[100px]"})]}),a.jsxs("header",{className:"bg-white/5 backdrop-blur-md border-b border-white/10 px-6 py-3 flex-shrink-0 z-20 flex items-center justify-between",children:[a.jsx("h1",{className:"text-2xl font-black text-white tracking-tighter drop-shadow-md",children:"PROFILE"}),a.jsxs("div",{className:"flex items-center space-x-2",children:[a.jsxs("div",{className:"relative",children:[a.jsxs("button",{type:"button",onClick:()=>ue(!oe),className:"relative p-2 bg-white/10 rounded-xl border border-white/20 transition-transform hover:scale-110 active:scale-95 group",title:"Challenges",children:[a.jsx("img",{src:Lu,alt:"Challenges",className:"w-6 h-6"}),U.length+k.length>0&&a.jsx("span",{className:"absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-[#1e3a8a] animate-bounce shadow-lg",children:U.length+k.length})]}),oe&&a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"fixed inset-0 z-40",onClick:()=>{ue(!1),Z(null)}}),a.jsx("div",{className:"fixed top-16 right-4 w-80 z-[100]",children:a.jsxs("div",{className:"bg-[#2d3748] rounded-xl border-[3px] border-[#4a5568] shadow-2xl overflow-hidden",children:[k.length>0&&a.jsxs("div",{children:[a.jsx("div",{className:"px-3 py-2 bg-[#ed8936]/20 border-b border-[#4a5568]",children:a.jsxs("p",{className:"text-[#ed8936] text-xs font-black uppercase tracking-wider flex items-center",children:[a.jsx("span",{className:"mr-2",children:"⚔️"}),"Active Battles"]})}),a.jsx("div",{className:"max-h-48 overflow-y-auto",children:k.map(O=>{const Ke=O.challengerId===n?.id?O.challenged:O.challenger,mt=O.challengerVotes+O.challengedVotes,bn=X===O.id;return a.jsxs("div",{children:[a.jsx("div",{className:"p-3 border-b border-[#4a5568] last:border-b-0 bg-gradient-to-r from-[#ed8936]/10 to-transparent",children:a.jsxs("div",{className:"flex items-center justify-between",children:[a.jsxs("div",{className:"flex items-center space-x-2",children:[a.jsx("div",{className:"w-9 h-9 rounded-full bg-white/10 overflow-hidden border-2 border-[#48bb78]",children:n?.profilePhoto?a.jsx("img",{src:n.profilePhoto,alt:"You",className:"w-full h-full object-cover"}):a.jsx("div",{className:"w-full h-full flex items-center justify-center text-sm",children:"👤"})}),a.jsx("span",{className:"text-[#ed8936] font-black text-xs",children:"VS"}),a.jsx("div",{className:"w-9 h-9 rounded-full bg-white/10 overflow-hidden border-2 border-[#ed8936]",children:Ke?.profilePhotoUrl?a.jsx("img",{src:Ke.profilePhotoUrl,alt:Ke.name,className:"w-full h-full object-cover"}):a.jsx("div",{className:"w-full h-full flex items-center justify-center text-sm",children:"👤"})}),a.jsxs("div",{className:"ml-1",children:[a.jsxs("p",{className:"text-white font-bold text-xs truncate max-w-[80px]",children:["vs ",Ke?.name]}),a.jsxs("div",{className:"flex items-center space-x-1 mt-1",children:[a.jsx("div",{className:"w-16 h-1.5 bg-[#4a5568] rounded-full overflow-hidden",children:a.jsx("div",{className:"h-full bg-[#ed8936] rounded-full transition-all",style:{width:`${mt/O.votesRequired*100}%`}})}),a.jsxs("span",{className:"text-[10px] text-gray-400",children:[mt,"/",O.votesRequired]})]})]})]}),a.jsx("button",{type:"button",onClick:()=>Z(bn?null:O.id),className:"w-8 h-8 bg-[#ed8936] hover:bg-[#dd7726] rounded-lg flex items-center justify-center border-b-2 border-[#c05621] active:border-b-0 active:translate-y-[1px] transition-all",title:"View votes",children:a.jsx("span",{className:"text-white text-sm",children:"👁️"})})]})}),bn&&a.jsxs("div",{className:"bg-[#1a202c] border-t border-b border-[#4a5568]",children:[a.jsxs("div",{className:"px-3 py-2 flex items-center justify-between border-b border-[#4a5568]",children:[a.jsxs("p",{className:"text-white text-xs font-bold",children:["Battle Votes (",mt,"/",O.votesRequired,")"]}),a.jsx("button",{type:"button",onClick:()=>Z(null),className:"text-gray-400 hover:text-white text-xs",title:"Close",children:"✕"})]}),O.votes&&O.votes.length>0?a.jsx("div",{className:"max-h-32 overflow-y-auto",children:O.votes.map(It=>{const di=It.chosenUserId===n?.id;return a.jsxs("div",{className:"px-3 py-2 flex items-center space-x-2 border-b border-[#4a5568]/50 last:border-b-0",children:[a.jsx("div",{className:"w-6 h-6 rounded-full bg-white/10 overflow-hidden",children:It.voter?.profilePhotoUrl?a.jsx("img",{src:It.voter.profilePhotoUrl,alt:It.voter.name,className:"w-full h-full object-cover"}):a.jsx("div",{className:"w-full h-full flex items-center justify-center text-[10px]",children:"👤"})}),a.jsxs("p",{className:"text-gray-300 text-xs flex-1",children:[a.jsx("span",{className:"font-bold text-white",children:It.voter?.name}),a.jsx("span",{className:"mx-1",children:"voted for"}),a.jsx("span",{className:di?"text-[#48bb78] font-bold":"text-[#ed8936] font-bold",children:di?"You":Ke?.name})]})]},It.id)})}):a.jsx("div",{className:"px-3 py-4 text-center text-gray-500 text-xs",children:"No votes yet"})]})]},O.id)})})]}),U.length>0&&a.jsxs("div",{children:[a.jsx("div",{className:"px-3 py-2 bg-[#3182ce]/20 border-b border-[#4a5568]",children:a.jsxs("p",{className:"text-[#63b3ed] text-xs font-black uppercase tracking-wider flex items-center",children:[a.jsx("span",{className:"mr-2",children:"📥"}),"Incoming Challenges"]})}),a.jsx("div",{className:"max-h-48 overflow-y-auto",children:U.map(O=>a.jsx("div",{className:"p-3 border-b border-[#4a5568] last:border-b-0 bg-gradient-to-r from-[#3182ce]/20 to-transparent",children:a.jsxs("div",{className:"flex items-center justify-between",children:[a.jsxs("div",{className:"flex items-center space-x-3",children:[a.jsx("div",{className:"w-10 h-10 rounded-full bg-white/10 overflow-hidden border-2 border-[#ed8936]",children:O.challenger?.profilePhotoUrl?a.jsx("img",{src:O.challenger.profilePhotoUrl,alt:O.challenger.name,className:"w-full h-full object-cover"}):a.jsx("div",{className:"w-full h-full flex items-center justify-center text-lg",children:"👤"})}),a.jsxs("div",{children:[a.jsx("p",{className:"text-white font-black italic text-sm",children:O.challenger?.name}),a.jsx("p",{className:"text-[#ed8936] text-[10px] font-bold italic uppercase",children:"Mog Battle"})]})]}),a.jsxs("div",{className:"flex items-center space-x-2",children:[a.jsx("button",{type:"button",onClick:()=>{Le(O.id),ue(!1)},disabled:W===O.id,className:"w-8 h-8 bg-[#48bb78] hover:bg-[#38a169] rounded-lg flex items-center justify-center border-b-2 border-[#2f855a] active:border-b-0 active:translate-y-[1px] transition-all disabled:opacity-50",title:"Accept challenge",children:a.jsx("span",{className:"text-white text-sm font-bold",children:"✓"})}),a.jsx("button",{type:"button",onClick:()=>{he(O.id)},className:"w-8 h-8 bg-[#e53e3e] hover:bg-[#c53030] rounded-lg flex items-center justify-center border-b-2 border-[#9b2c2c] active:border-b-0 active:translate-y-[1px] transition-all",title:"Decline challenge",children:a.jsx("span",{className:"text-white text-sm font-bold",children:"✕"})})]})]})},O.id))})]}),k.length===0&&U.length===0&&a.jsxs("div",{className:"p-4 flex items-center justify-center space-x-2",children:[a.jsx("span",{className:"text-xl",children:"ℹ️"}),a.jsx("span",{className:"text-gray-400 font-bold italic",children:"No challenges."})]})]})})]})]}),a.jsxs("button",{type:"button",onClick:()=>T(!0),className:"relative p-2 bg-white/10 rounded-xl border border-white/20 transition-transform hover:scale-110 active:scale-95 group",children:[a.jsx("svg",{className:"w-6 h-6 text-white",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"})}),B.length>0&&a.jsx("span",{className:"absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-[#1e3a8a] animate-bounce shadow-lg",children:B.length})]})]})]}),a.jsx("main",{className:"flex-1 overflow-y-auto px-4 py-6 relative z-10",style:{WebkitOverflowScrolling:"touch",touchAction:"pan-y",minHeight:0,paddingBottom:"100px"},children:a.jsxs("div",{className:"max-w-md mx-auto space-y-6",children:[a.jsxs("div",{className:"flex flex-col items-center",children:[a.jsxs("div",{className:"relative group cursor-pointer transition-transform duration-300 hover:scale-105",onClick:fe,children:[a.jsx("div",{className:"absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500 animate-tilt"}),n.profilePhoto?a.jsx("img",{src:n.profilePhoto,alt:"Profile",className:"relative w-36 h-36 rounded-full object-cover border-4 border-white shadow-xl"}):a.jsx("div",{className:"relative w-36 h-36 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border-4 border-white/30 shadow-xl",children:a.jsx("svg",{className:"w-16 h-16 text-white/50",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:1.5,d:"M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"})})}),a.jsx("div",{className:"absolute bottom-1 right-1 bg-blue-600 rounded-full p-2 border-2 border-[#1e3a8a] shadow-lg transition-transform duration-300 group-hover:scale-110",children:a.jsxs("svg",{className:"w-5 h-5 text-white",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:[a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"}),a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 13a3 3 0 11-6 0 3 3 0 016 0z"})]})})]}),a.jsx("div",{className:"mt-4 text-center w-full",children:a.jsxs("div",{className:"flex flex-col items-center",children:[a.jsxs("div",{className:"inline-flex items-center space-x-2",children:[a.jsx("h2",{className:"text-3xl font-black text-white tracking-tight drop-shadow-lg",children:ar(n.name)}),a.jsx("button",{onClick:()=>r("league"),className:"w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border-2 border-white/40 transition-transform hover:scale-125",style:{backgroundColor:p?.league.currentLeague.color||"#7F1D1D",boxShadow:`0 0 15px ${p?.league.currentLeague.color||"#7F1D1D"}66`},title:`Current League: ${p?.league.currentLeague.name||"Cooked 1"}`,children:a.jsx("span",{className:"text-white font-black text-xl drop-shadow-md",children:p?.league.currentLeague.tier||1})})]}),a.jsxs("div",{className:"flex items-center space-x-2 mt-1.5 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 group cursor-pointer hover:bg-black/30 transition-all",onClick:it,children:[a.jsxs("span",{className:"text-[10px] font-black text-blue-100 uppercase tracking-widest",children:[n.age||"—"," YRS"]}),a.jsx("span",{className:"text-white/30 text-[10px]",children:"•"}),a.jsx("span",{className:"text-[10px] font-black text-blue-100 uppercase tracking-widest",children:n.gender||"—"}),a.jsx("svg",{className:"w-3 h-3 text-white/30 group-hover:text-white/60 transition-colors ml-1",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"})})]}),ot?a.jsx("div",{className:"mt-4 w-full max-w-[300px] bg-white/10 backdrop-blur-2xl rounded-2xl p-4 border border-white/20 shadow-2xl animate-in fade-in slide-in-from-top-2",children:a.jsxs("div",{className:"space-y-3",children:[a.jsxs("div",{className:"flex justify-between items-center px-1",children:[a.jsx("label",{className:"text-[8px] font-black text-blue-100 uppercase tracking-widest",children:"Bio"}),a.jsxs("span",{className:"text-[8px] font-black text-blue-100/40",children:[V.length,"/25"]})]}),a.jsx("textarea",{value:V,onChange:O=>J(O.target.value),maxLength:25,className:"w-full liquid-glass rounded-xl px-3 py-2 text-white font-bold text-xs focus:outline-none min-h-[50px]",placeholder:"Say something..."}),a.jsx("div",{className:"grid grid-cols-1 gap-2",children:a.jsx("input",{type:"number",value:C,onChange:O=>x(parseInt(O.target.value)),className:"w-full liquid-glass rounded-lg px-2 py-1.5 text-white font-bold text-[10px] text-center"})}),De&&a.jsx("p",{className:"text-red-300 font-bold text-[8px] text-center uppercase",children:De}),a.jsxs("div",{className:"flex gap-2 pt-1",children:[a.jsx("button",{onClick:Jt,disabled:ie,className:"flex-1 bg-white text-blue-700 py-2 rounded-lg font-black text-[10px] uppercase shadow-md active:scale-95 transition-all",children:"SAVE"}),a.jsx("button",{onClick:Wt,disabled:ie,className:"flex-1 bg-black/30 text-white py-2 rounded-lg font-black text-[10px] uppercase active:scale-95 transition-all",children:"CANCEL"})]})]})}):a.jsx("p",{className:"text-white/70 font-medium text-xs mt-2 italic px-6 leading-tight max-w-[280px]",children:n.bio||"No bio set yet."})]})})]}),a.jsx("div",{className:"bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-2xl rounded-[2rem] p-6 border border-white/30 shadow-2xl transform transition-transform duration-300 hover:scale-102",children:a.jsxs("div",{className:"flex flex-col items-center text-center",children:[a.jsx("div",{className:"w-full bg-black/20 backdrop-blur-xl px-6 py-8 rounded-[2.5rem] border border-white/10 mb-6 transition-transform hover:scale-105 shadow-inner",children:a.jsxs("div",{className:"flex items-center justify-center space-x-6",children:[a.jsx("span",{className:"text-6xl drop-shadow-lg",children:"🏆"}),a.jsxs("div",{className:"text-left",children:[a.jsx("div",{className:"text-7xl font-black text-white leading-none tracking-tighter drop-shadow-2xl",children:Math.round(p?.performance.trophyScore||0)}),a.jsx("div",{className:"text-blue-200 font-black text-sm uppercase tracking-[0.4em] mt-2 opacity-80",children:"TROPHIES"})]})]})}),a.jsx("div",{className:"mt-2 flex flex-col items-center",children:!p||p.performance.totalComparisons<100?a.jsxs("div",{className:"flex flex-col items-center",children:[a.jsx("div",{className:"w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border-2 border-white/20 shadow-inner mb-2 group transition-transform hover:scale-110",children:a.jsx("svg",{className:"w-8 h-8 text-white/40 group-hover:text-white/60 transition-colors",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"})})}),a.jsx("div",{className:"text-[10px] font-black text-blue-100/60 uppercase tracking-widest",children:"Unlock Percentile at 100 Ratings"}),a.jsx("div",{className:"mt-1 w-32 bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/10",children:a.jsx("div",{className:"bg-blue-400 h-full transition-all duration-500",style:{width:`${Math.min(p?.performance.totalComparisons||0,100)}%`}})}),a.jsxs("div",{className:"text-[8px] font-black text-blue-200/40 mt-1 uppercase",children:[p?.performance.totalComparisons||0," / 100"]})]}):a.jsxs("div",{className:"flex flex-col items-center animate-in fade-in zoom-in duration-500",children:[a.jsx("div",{className:"bg-gradient-to-br from-blue-500 to-indigo-600 w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/30 mb-2 transform transition-transform hover:scale-110",children:a.jsxs("div",{className:"text-center",children:[a.jsx("div",{className:"text-3xl font-black text-white leading-none",children:Math.round(p.performance.currentPercentile)}),a.jsx("div",{className:"text-[10px] font-black text-white/80",children:"TH"})]})}),a.jsx("div",{className:"text-xs font-black text-white uppercase tracking-[0.2em] drop-shadow-md",children:"USER PERCENTILE"})]})})]})}),a.jsxs("div",{className:"bg-white/10 backdrop-blur-xl rounded-[2rem] p-6 border border-white/20 shadow-2xl space-y-4",children:[a.jsxs("div",{className:"flex items-center justify-between mb-2",children:[a.jsx("h3",{className:"text-lg font-black text-white tracking-tight uppercase",children:"Battle Log"}),a.jsx("button",{onClick:()=>f(!0),className:"text-blue-200 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors",children:"View All"})]}),_.length>0?a.jsx("div",{className:"space-y-3",children:_.slice(0,3).map(O=>a.jsxs("div",{className:"flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5 transition-transform hover:scale-[1.02]",children:[a.jsxs("div",{className:"flex items-center space-x-4",children:[a.jsxs("div",{className:"flex flex-col items-center space-y-1",children:[O.rater.photoUrl?a.jsx("img",{src:O.rater.photoUrl,alt:O.rater.name,className:"w-12 h-12 rounded-full object-cover border-2 border-white/20"}):a.jsx("div",{className:"w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20 text-lg",children:O.rater.gender==="female"?"💃":"🕺"}),a.jsx("span",{className:"text-[8px] font-black text-white/60 uppercase tracking-widest",children:"Rater"})]}),a.jsx("div",{className:"w-8"}),O.opponent?a.jsxs("div",{className:"flex flex-col items-center space-y-1",children:[a.jsxs("div",{className:"flex items-center space-x-2",children:[a.jsxs("button",{onClick:()=>O.opponent&&O.opponent.id!=="Sample"&&O.opponent.trophyScore!==null&&M(O.opponent),className:`relative ${O.opponent.id!=="Sample"&&O.opponent.trophyScore!==null?"cursor-pointer hover:opacity-80":""}`,children:[O.opponent.photoUrl?a.jsx("img",{src:O.opponent.photoUrl,alt:O.opponent.name,className:"w-12 h-12 rounded-full object-cover border-2 border-white/20"}):a.jsx("div",{className:"w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20 text-lg",children:O.opponent.gender==="female"?"💃":"🕺"}),O.isUpset&&a.jsx("div",{className:"absolute -top-1 -right-1 bg-yellow-500 text-black text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase",children:"UPSET"})]}),a.jsxs("div",{className:"flex flex-col items-center space-y-1",children:[a.jsx("div",{className:`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black border-2 border-gray-900 ${O.isWinner?"bg-green-500":"bg-red-500"}`,children:O.isWinner?"W":"L"}),O.hasMultiplier&&a.jsxs("div",{className:"bg-purple-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full",children:[O.consecutiveWins,"x"]})]})]}),a.jsx("span",{className:"text-[8px] font-black text-white/60 uppercase tracking-widest",children:"Opponent"})]}):a.jsxs("div",{className:"flex flex-col items-center space-y-1",children:[a.jsxs("div",{className:"flex items-center space-x-2",children:[a.jsx("div",{className:"w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20 text-lg",children:"?"}),a.jsx("div",{className:`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black border-2 border-gray-900 ${O.isWinner?"bg-green-500":"bg-red-500"}`,children:O.isWinner?"W":"L"})]}),a.jsx("span",{className:"text-[8px] font-black text-white/60 uppercase tracking-widest",children:"Opponent"})]})]}),a.jsxs("div",{className:"text-right",children:[a.jsxs("div",{className:`text-sm font-black ${O.isWinner?"text-green-400":"text-red-400"}`,children:[O.isWinner?"+":"",O.trophyDelta]}),a.jsx("div",{className:"text-[8px] font-black text-blue-200/40 uppercase tracking-widest",children:"Trophies"}),O.hasMultiplier&&a.jsxs("div",{className:"text-[8px] font-black text-purple-400 uppercase tracking-widest mt-1",children:[O.consecutiveWins," Win Streak"]})]})]},O.id))}):a.jsx("div",{className:"text-center py-4 bg-white/5 rounded-2xl border border-dashed border-white/10",children:a.jsx("p",{className:"text-[10px] font-black text-white/20 uppercase tracking-[0.2em]",children:"No battles recorded yet"})})]}),a.jsx("button",{onClick:e,className:"w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 py-4 rounded-[1.5rem] font-black transition-all border border-red-500/20 uppercase tracking-[0.2em] hover:scale-102 text-xs",children:"Sign Out"})]})}),o&&a.jsx("div",{className:"fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4",onClick:O=>{O.target===O.currentTarget&&l(!1)},children:a.jsxs("div",{className:"w-full max-w-md bg-gray-900 rounded-[2.5rem] p-8 border border-white/10 shadow-2xl",children:[a.jsxs("div",{className:"flex items-center justify-between mb-8",children:[a.jsx("h3",{className:"text-2xl font-black text-white uppercase tracking-tight",children:"Face Scan"}),a.jsx("button",{onClick:()=>l(!1),className:"text-white/50 hover:text-white transition-transform hover:scale-125",children:a.jsx("svg",{className:"w-8 h-8",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]}),h&&a.jsxs("div",{className:"mb-4 p-4 bg-red-600/20 border border-red-600/50 rounded-xl",children:[a.jsx("p",{className:"text-red-400 text-sm font-bold text-center mb-2",children:h}),(h.includes("quality")||h.includes("gender"))&&a.jsxs("div",{className:"text-center",children:[a.jsxs("ul",{className:"text-gray-300 text-xs mb-3 text-left space-y-1 px-2",children:[a.jsx("li",{children:"• Make sure your face is clearly visible"}),a.jsx("li",{children:"• Use good lighting (avoid shadows)"}),a.jsx("li",{children:"• Look directly at the camera"}),a.jsx("li",{children:"• Remove sunglasses or hats"})]}),a.jsx("button",{type:"button",onClick:()=>u(null),className:"bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors",children:"Try Again"})]})]}),a.jsx(Yl,{onCapture:()=>{},onError:lt,className:"mb-6 rounded-3xl overflow-hidden",userId:n?.id,autoUpload:!1,mode:"live-detection",onLiveDetectionComplete:ze,targetConfidence:.95}),c&&a.jsxs("div",{className:"flex items-center justify-center space-x-3 text-blue-400 font-black uppercase text-xs tracking-widest bg-blue-400/10 py-4 rounded-2xl border border-blue-400/20",children:[a.jsx("div",{className:"w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"}),a.jsx("span",{children:"Processing..."})]})]})}),m&&a.jsx("div",{className:"fixed inset-0 bg-black/95 backdrop-blur-2xl z-50 flex items-center justify-center p-4",onClick:O=>{O.target===O.currentTarget&&f(!1)},children:a.jsxs("div",{className:"w-full max-w-md h-[80vh] bg-gray-900 rounded-[2.5rem] flex flex-col border border-white/10 shadow-2xl overflow-hidden",children:[a.jsxs("header",{className:"p-8 border-b border-white/5 flex items-center justify-between",children:[a.jsx("h3",{className:"text-2xl font-black text-white uppercase tracking-tight",children:"Full Battle Log"}),a.jsx("button",{onClick:()=>f(!1),className:"text-white/50 hover:text-white transition-transform hover:scale-125",children:a.jsx("svg",{className:"w-8 h-8",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]}),a.jsxs("div",{className:"flex-1 overflow-y-auto p-6 space-y-4",children:[_.map(O=>a.jsxs("div",{className:"flex items-center justify-between p-4 bg-white/5 rounded-3xl border border-white/5 transition-colors hover:bg-white/10",children:[a.jsxs("div",{className:"flex items-center space-x-4",children:[a.jsxs("div",{className:"flex flex-col items-center space-y-2",children:[O.rater.photoUrl?a.jsx("img",{src:O.rater.photoUrl,alt:O.rater.name,className:"w-16 h-16 rounded-2xl object-cover border-2 border-white/20"}):a.jsx("div",{className:"w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border-2 border-white/20 text-2xl",children:O.rater.gender==="female"?"💃":"🕺"}),a.jsx("span",{className:"text-[10px] font-black text-white/60 uppercase tracking-widest",children:"Rater"})]}),a.jsx("div",{className:"w-12"}),O.opponent?a.jsxs("div",{className:"flex flex-col items-center space-y-2",children:[a.jsxs("div",{className:"flex items-center space-x-3",children:[O.opponent.photoUrl?a.jsx("img",{src:O.opponent.photoUrl,alt:O.opponent.name,className:"w-16 h-16 rounded-2xl object-cover border-2 border-white/20"}):a.jsx("div",{className:"w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border-2 border-white/20 text-2xl",children:O.opponent.gender==="female"?"💃":"🕺"}),a.jsx("div",{className:`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black border-2 border-gray-900 ${O.isWinner?"bg-green-500":"bg-red-500"}`,children:O.isWinner?"W":"L"})]}),a.jsx("span",{className:"text-[10px] font-black text-white/60 uppercase tracking-widest",children:"Opponent"})]}):a.jsxs("div",{className:"flex flex-col items-center space-y-2",children:[a.jsxs("div",{className:"flex items-center space-x-3",children:[a.jsx("div",{className:"w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border-2 border-white/20 text-2xl",children:"?"}),a.jsx("div",{className:`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black border-2 border-gray-900 ${O.isWinner?"bg-green-500":"bg-red-500"}`,children:O.isWinner?"W":"L"})]}),a.jsx("span",{className:"text-[10px] font-black text-white/60 uppercase tracking-widest",children:"Opponent"})]})]}),a.jsxs("div",{className:"text-right",children:[a.jsxs("div",{className:`text-xl font-black ${O.isWinner?"text-green-400":"text-red-400"}`,children:[O.isWinner?"+":"",O.trophyDelta]}),a.jsx("div",{className:"text-[8px] font-black text-blue-200/40 uppercase tracking-[0.2em]",children:"Trophies"})]})]},O.id)),_.length===0&&a.jsx("div",{className:"text-center py-20",children:a.jsx("p",{className:"text-white/20 font-black uppercase tracking-widest",children:"No battles recorded yet"})})]})]})}),y&&a.jsx("div",{className:"fixed inset-0 bg-black/95 backdrop-blur-2xl z-50 flex items-center justify-center p-4",onClick:O=>{O.target===O.currentTarget&&M(null)},children:a.jsxs("div",{className:"w-full max-w-md bg-gray-900 rounded-[2.5rem] p-8 border border-white/10 shadow-2xl",children:[a.jsxs("div",{className:"flex items-center justify-between mb-6",children:[a.jsx("h3",{className:"text-2xl font-black text-white uppercase tracking-tight",children:"Opponent Stats"}),a.jsx("button",{onClick:()=>M(null),className:"text-white/50 hover:text-white transition-transform hover:scale-125",children:a.jsx("svg",{className:"w-8 h-8",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]}),a.jsxs("div",{className:"flex flex-col items-center space-y-6",children:[y.photoUrl?a.jsx("img",{src:y.photoUrl,alt:y.name,className:"w-24 h-24 rounded-full object-cover border-4 border-white/20"}):a.jsx("div",{className:"w-24 h-24 rounded-full bg-white/10 flex items-center justify-center border-4 border-white/20 text-4xl",children:y.gender==="female"?"💃":"🕺"}),a.jsxs("div",{className:"text-center",children:[a.jsx("h4",{className:"text-2xl font-black text-white mb-2",children:y.name}),a.jsx("p",{className:"text-sm text-white/60 uppercase tracking-widest",children:y.gender==="female"?"Female":"Male"})]}),a.jsxs("div",{className:"w-full grid grid-cols-2 gap-4",children:[y.trophyScore!=null&&a.jsxs("div",{className:"bg-white/5 rounded-2xl p-4 text-center border border-white/10",children:[a.jsx("div",{className:"text-2xl font-black text-yellow-400 mb-1",children:Math.round(y.trophyScore)}),a.jsx("div",{className:"text-xs font-black text-white/60 uppercase tracking-widest",children:"Trophies"})]}),y.percentile!=null&&a.jsxs("div",{className:"bg-white/5 rounded-2xl p-4 text-center border border-white/10",children:[a.jsxs("div",{className:"text-2xl font-black text-blue-400 mb-1",children:[Math.round(y.percentile),"%"]}),a.jsx("div",{className:"text-xs font-black text-white/60 uppercase tracking-widest",children:"Percentile"})]})]})]})]})}),w&&a.jsx("div",{className:"fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4",onClick:O=>{O.target===O.currentTarget&&T(!1)},children:a.jsxs("div",{className:"w-full max-w-md h-[85vh] bg-[#4a5568] rounded-[1.5rem] flex flex-col border-[3px] border-[#2d3748] shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden font-sans",children:[a.jsxs("div",{className:"bg-[#2d3748] p-4 flex items-center justify-center relative shadow-lg",children:[a.jsx("h3",{className:"text-2xl font-black text-white italic tracking-wider uppercase drop-shadow-[0_2px_0_rgba(0,0,0,1)]",children:"Social"}),a.jsx("button",{onClick:()=>T(!1),className:"absolute right-3 top-3 bg-[#e53e3e] hover:bg-[#c53030] text-white w-8 h-8 rounded-lg flex items-center justify-center border-b-4 border-[#9b2c2c] active:border-b-0 active:translate-y-[2px] shadow-lg transition-all",children:a.jsx("svg",{className:"w-5 h-5 font-bold",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:4,d:"M6 18L18 6M6 6l12 12"})})})]}),a.jsxs("div",{className:"flex-1 overflow-y-auto p-4 space-y-4 bg-[#cbd5e0] relative",children:[a.jsx("div",{className:"text-center",children:a.jsxs("p",{className:"text-[#38a169] font-black italic uppercase tracking-widest text-xs drop-shadow-[0_1px_0_rgba(0,0,0,0.2)]",children:["Online: ",R.length>0?"1":"0"]})}),a.jsx("button",{onClick:te,className:"w-full bg-gradient-to-b from-[#f6ad55] to-[#ed8936] hover:from-[#ed8936] hover:to-[#dd6b20] text-white py-4 rounded-xl font-black italic uppercase tracking-[0.15em] border-b-[6px] border-[#c05621] active:border-b-0 active:translate-y-[4px] shadow-xl text-lg drop-shadow-[0_2px_0_rgba(0,0,0,0.5)] transition-all",children:"Invite Friend"}),B.length>0&&a.jsxs("div",{className:"space-y-3 mb-4",children:[a.jsxs("div",{className:"flex items-center space-x-2 py-2",children:[a.jsx("div",{className:"flex-1 h-[2px] bg-red-400/30"}),a.jsx("span",{className:"text-red-600 font-black text-[10px] uppercase tracking-[0.3em] italic",children:"Friend Requests"}),a.jsx("div",{className:"flex-1 h-[2px] bg-red-400/30"})]}),B.map(O=>a.jsxs("div",{className:"bg-white p-4 rounded-2xl border-[3px] border-[#3182ce] shadow-md flex items-center justify-between transition-transform active:scale-[0.98]",children:[a.jsxs("div",{className:"flex items-center space-x-3",children:[a.jsx("div",{className:"w-12 h-12 rounded-xl bg-gray-200 overflow-hidden border-2 border-gray-300",children:O.profilePhotoUrl?a.jsx("img",{src:O.profilePhotoUrl,alt:O.name,className:"w-full h-full object-cover"}):a.jsx("div",{className:"w-full h-full flex items-center justify-center text-xl",children:"👤"})}),a.jsxs("div",{children:[a.jsx("p",{className:"text-[#2d3748] font-black italic uppercase text-sm",children:O.name}),a.jsx("p",{className:"text-[#718096] font-bold text-[10px] uppercase italic",children:"Wants to friend you"})]})]}),a.jsxs("div",{className:"flex flex-col gap-2",children:[a.jsx("button",{type:"button",onClick:()=>Me(O.id),disabled:E===O.id,className:"bg-[#48bb78] hover:bg-[#38a169] text-white px-4 py-2 rounded-lg text-[10px] font-black italic uppercase tracking-widest border-b-4 border-[#2f855a] active:border-b-0 active:translate-y-[2px] disabled:opacity-50",children:E===O.id?"...":"Accept"}),a.jsx("button",{type:"button",onClick:()=>ae(O.id),className:"bg-[#e53e3e] hover:bg-[#c53030] text-white px-4 py-1 rounded-lg text-[10px] font-black italic uppercase tracking-widest border-b-4 border-[#9b2c2c] active:border-b-0 active:translate-y-[2px]",children:"Decline"})]})]},O.id))]}),U.length>0&&a.jsxs("div",{className:"space-y-3 mb-4",children:[a.jsxs("div",{className:"flex items-center space-x-2 py-2",children:[a.jsx("div",{className:"flex-1 h-[2px] bg-orange-400/30"}),a.jsx("span",{className:"text-orange-600 font-black text-[10px] uppercase tracking-[0.3em] italic",children:"⚔️ Battle Challenges"}),a.jsx("div",{className:"flex-1 h-[2px] bg-orange-400/30"})]}),U.map(O=>a.jsxs("div",{className:"bg-white p-4 rounded-2xl border-[3px] border-[#ed8936] shadow-md flex items-center justify-between transition-transform active:scale-[0.98]",children:[a.jsxs("div",{className:"flex items-center space-x-3",children:[a.jsx("div",{className:"w-12 h-12 rounded-xl bg-gray-200 overflow-hidden border-2 border-orange-300",children:O.challenger?.profilePhotoUrl?a.jsx("img",{src:O.challenger.profilePhotoUrl,alt:O.challenger.name,className:"w-full h-full object-cover"}):a.jsx("div",{className:"w-full h-full flex items-center justify-center text-xl",children:"👤"})}),a.jsxs("div",{children:[a.jsx("p",{className:"text-[#2d3748] font-black italic uppercase text-sm",children:O.challenger?.name}),a.jsx("p",{className:"text-[#ed8936] font-bold text-[10px] uppercase italic",children:"Challenges you to battle!"})]})]}),a.jsxs("div",{className:"flex flex-col gap-2",children:[a.jsx("button",{type:"button",onClick:()=>Le(O.id),disabled:W===O.id,className:"bg-[#ed8936] hover:bg-[#dd6b20] text-white px-4 py-2 rounded-lg text-[10px] font-black italic uppercase tracking-widest border-b-4 border-[#c05621] active:border-b-0 active:translate-y-[2px] disabled:opacity-50",children:W===O.id?"...":"Accept"}),a.jsx("button",{type:"button",onClick:()=>he(O.id),className:"bg-[#718096] hover:bg-[#4a5568] text-white px-4 py-1 rounded-lg text-[10px] font-black italic uppercase tracking-widest border-b-4 border-[#2d3748] active:border-b-0 active:translate-y-[2px]",children:"Decline"})]})]},O.id))]}),a.jsxs("div",{className:"flex items-center space-x-2 py-2",children:[a.jsx("div",{className:"flex-1 h-[2px] bg-[#a0aec0]/50"}),a.jsx("span",{className:"text-[#4a5568] font-black text-[10px] uppercase tracking-[0.3em] italic",children:"Leaderboard"}),a.jsx("div",{className:"flex-1 h-[2px] bg-[#a0aec0]/50"})]}),a.jsx("div",{className:"space-y-2",children:R.length>0?R.map(O=>a.jsx("div",{className:"bg-gradient-to-b from-[#edf2f7] to-[#e2e8f0] p-3 rounded-2xl border-[3px] border-[#a0aec0] shadow-md transition-transform",children:a.jsxs("div",{className:"flex items-center justify-between",children:[a.jsxs("div",{className:"flex items-center space-x-3",children:[a.jsxs("div",{className:"relative",children:[a.jsx("div",{className:"w-12 h-12 rounded-full bg-white overflow-hidden border-2 border-[#718096] shadow-inner",children:O.profilePhotoUrl?a.jsx("img",{src:O.profilePhotoUrl,alt:O.name,className:"w-full h-full object-cover"}):a.jsx("div",{className:"w-full h-full flex items-center justify-center text-xl text-[#a0aec0]",children:"👤"})}),a.jsx("div",{className:"absolute top-0 left-0 bg-[#48bb78] w-3 h-3 rounded-full border-2 border-white shadow-sm"})]}),a.jsxs("div",{children:[a.jsx("span",{className:"text-[#2d3748] font-black italic uppercase text-sm leading-tight tracking-tight drop-shadow-[0_1px_0_rgba(255,255,255,1)]",children:O.name}),a.jsxs("p",{className:"text-[#718096] font-bold text-[9px] uppercase tracking-wider italic leading-none",children:["🏆 ",Math.round(O.trophyScore||0)]})]})]}),a.jsxs("div",{className:"flex items-center space-x-2",children:[a.jsx("button",{type:"button",onClick:()=>ve(O),disabled:le(O.id)||Q===O.id,className:"bg-[#ed8936] hover:bg-[#dd6b20] text-white p-2 rounded-lg border-b-4 border-[#c05621] active:border-b-0 active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed transition-all",title:le(O.id)?"Challenge pending":"Challenge to battle",children:a.jsx("span",{className:"text-lg",children:"⚔️"})}),a.jsxs("button",{type:"button",onClick:()=>He(O),className:"bg-[#3182ce] hover:bg-[#2c5282] text-white p-2 rounded-lg border-b-4 border-[#2c5282] active:border-b-0 active:translate-y-[2px] transition-all relative",title:"Send message",children:[a.jsx("span",{className:"text-lg",children:"💬"}),L[O.id]>0&&a.jsx("span",{className:"absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center",children:L[O.id]})]})]})]})},O.id)):a.jsxs("div",{className:"text-center py-20 bg-black/5 rounded-3xl border-4 border-dashed border-[#a0aec0]/30",children:[a.jsx("div",{className:"text-5xl mb-4 grayscale opacity-30 drop-shadow-lg",children:"🤝"}),a.jsx("p",{className:"text-xs font-black text-[#4a5568]/40 uppercase italic tracking-[0.2em] px-10 leading-relaxed",children:"No friends yet. Add some to start your climb!"})]})})]})]})}),ce&&me&&a.jsx("div",{className:"fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4",onClick:O=>{O.target===O.currentTarget&&(Ue(!1),$e(null))},children:a.jsxs("div",{className:"w-full max-w-md h-[85vh] bg-[#4a5568] rounded-[1.5rem] flex flex-col border-[3px] border-[#2d3748] shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden font-sans",children:[a.jsxs("div",{className:"bg-[#2d3748] p-4 flex items-center justify-between shadow-lg",children:[a.jsxs("div",{className:"flex items-center space-x-3",children:[a.jsx("div",{className:"w-10 h-10 rounded-full bg-white overflow-hidden border-2 border-[#718096]",children:me.profilePhotoUrl?a.jsx("img",{src:me.profilePhotoUrl,alt:me.name,className:"w-full h-full object-cover"}):a.jsx("div",{className:"w-full h-full flex items-center justify-center text-lg",children:"👤"})}),a.jsx("h3",{className:"text-xl font-black text-white italic tracking-wider uppercase drop-shadow-[0_2px_0_rgba(0,0,0,1)]",children:me.name})]}),a.jsx("button",{type:"button",onClick:()=>{Ue(!1),$e(null)},className:"bg-[#e53e3e] hover:bg-[#c53030] text-white w-8 h-8 rounded-lg flex items-center justify-center border-b-4 border-[#9b2c2c] active:border-b-0 active:translate-y-[2px] shadow-lg transition-all",children:a.jsx("svg",{className:"w-5 h-5 font-bold",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:4,d:"M6 18L18 6M6 6l12 12"})})})]}),a.jsxs("div",{className:"flex-1 overflow-y-auto p-4 space-y-3 bg-[#cbd5e0]",children:[se.length===0?a.jsxs("div",{className:"text-center py-20",children:[a.jsx("div",{className:"text-4xl mb-4 opacity-30",children:"💬"}),a.jsx("p",{className:"text-[#4a5568]/50 font-bold text-sm italic",children:"No messages yet. Say hi!"})]}):se.map(O=>a.jsx("div",{className:`flex ${O.senderId===n?.id?"justify-end":"justify-start"}`,children:a.jsxs("div",{className:`max-w-[75%] p-3 rounded-2xl shadow-md ${O.senderId===n?.id?"bg-[#3182ce] text-white rounded-br-sm":"bg-white text-[#2d3748] rounded-bl-sm"}`,children:[a.jsx("p",{className:"text-sm",children:O.content}),a.jsx("p",{className:`text-[10px] mt-1 ${O.senderId===n?.id?"text-blue-200":"text-gray-400"}`,children:new Date(O.createdAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})})]})},O.id)),a.jsx("div",{ref:Qe})]}),a.jsxs("div",{className:"bg-[#2d3748] p-3 flex items-center space-x-2",children:[a.jsx("input",{type:"text",value:Te,onChange:O=>Ie(O.target.value),onKeyPress:O=>O.key==="Enter"&&xe(),placeholder:"Type a message...",className:"flex-1 bg-[#4a5568] text-white placeholder-gray-400 px-4 py-3 rounded-xl border-2 border-[#718096] focus:border-[#3182ce] focus:outline-none font-bold"}),a.jsx("button",{type:"button",onClick:xe,disabled:!Te.trim()||Ee,className:"bg-[#3182ce] hover:bg-[#2c5282] text-white p-3 rounded-xl border-b-4 border-[#2c5282] active:border-b-0 active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed transition-all",children:a.jsx("svg",{className:"w-6 h-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 19l9 2-9-18-9 18 9-2zm0 0v-8"})})})]})]})}),Se&&a.jsx("div",{className:"fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] flex items-center justify-center p-4",onClick:O=>{O.target===O.currentTarget&&ve(null)},children:a.jsxs("div",{className:"bg-[#4a5568] rounded-2xl border-[3px] border-[#2d3748] shadow-[0_0_30px_rgba(0,0,0,0.5)] max-w-sm w-full overflow-hidden",children:[a.jsxs("div",{className:"bg-[#2d3748] p-4 flex items-center justify-center relative shadow-lg",children:[a.jsx("h3",{className:"text-lg font-black text-white italic uppercase tracking-wide drop-shadow-[0_2px_0_rgba(0,0,0,1)]",children:"Mog Battle"}),a.jsx("button",{type:"button",onClick:()=>ve(null),className:"absolute right-3 bg-[#e53e3e] hover:bg-[#c53030] text-white w-7 h-7 rounded-lg flex items-center justify-center border-b-2 border-[#9b2c2c] active:border-b-0 active:translate-y-[1px] transition-all",children:a.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:3,d:"M6 18L18 6M6 6l12 12"})})})]}),a.jsxs("div",{className:"bg-[#cbd5e0] p-6 text-center",children:[a.jsx("div",{className:"text-5xl mb-4 drop-shadow-lg",children:"⚔️"}),a.jsxs("p",{className:"text-[#2d3748] font-black italic text-lg leading-tight",children:["Challenge ",a.jsx("span",{className:"text-[#ed8936]",children:Se.name})," to a Mog Battle?"]})]}),a.jsxs("div",{className:"bg-[#4a5568] p-4 flex space-x-4",children:[a.jsx("button",{type:"button",onClick:()=>ve(null),className:"flex-1 bg-gradient-to-b from-[#fc8181] to-[#e53e3e] hover:from-[#e53e3e] hover:to-[#c53030] text-white py-3 rounded-xl font-black italic uppercase tracking-wide border-b-4 border-[#9b2c2c] active:border-b-0 active:translate-y-[2px] shadow-lg transition-all drop-shadow-[0_2px_0_rgba(0,0,0,0.3)]",children:"Cancel"}),a.jsx("button",{type:"button",onClick:()=>{Ce(Se.id),ve(null)},className:"flex-1 bg-gradient-to-b from-[#63b3ed] to-[#3182ce] hover:from-[#3182ce] hover:to-[#2c5282] text-white py-3 rounded-xl font-black italic uppercase tracking-wide border-b-4 border-[#2c5282] active:border-b-0 active:translate-y-[2px] shadow-lg transition-all drop-shadow-[0_2px_0_rgba(0,0,0,0.3)]",children:"Challenge"})]})]})})]}):a.jsx("div",{className:"absolute inset-0 flex items-center justify-center bg-blue-900",children:a.jsxs("div",{className:"text-white text-center",children:[a.jsx("div",{className:"w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"}),a.jsx("p",{className:"font-black tracking-widest uppercase",children:"Loading..."})]})})},uc=F.forwardRef(({children:n,className:e="",onSwipe:t,onCardLeftScreen:i,onDragMove:s,onDragEnd:r,onSwipeRequirementFulfilled:o,onSwipeRequirementUnfulfilled:l,preventSwipe:c=[],swipeRequirementType:d="velocity",swipeThreshold:h=.1,flickOnSwipe:u=!0},p)=>{const[{xyrot:g},_]=od(()=>({xyrot:[0,0,0],config:{tension:400,friction:40}})),v=F.useRef({dx:0,dy:0,vx:0,vy:0,startTime:0,startX:0,startY:0,currentDirection:null,isDragging:!1,wasMovingOnRelease:!1,lastMoveTime:0}),m=(P,I,k,j)=>{if(d==="velocity"){const W=Math.abs(P),ee=Math.abs(I);return W>ee?P>0?"right":"left":I>0?"down":"up"}else{const W=Math.abs(k),ee=Math.abs(j);return W>ee?k>0?"right":"left":j>0?"down":"up"}},f=(P,I,k,j)=>d==="velocity"?Math.sqrt(P*P+I*I)>h:Math.sqrt(k*k+j*j)>h,y=(P,I,k,j)=>{const W=k*0,ee=c.includes("left")&&c.includes("right"),Q=c.includes("up")&&c.includes("down"),ne=ee?0:P,Se=Q?0:I;_.start({xyrot:[ne,Se,W]}),v.current.lastMoveTime=Date.now();const ve=m(k,j,P,I),oe=Math.min(Math.sqrt(P*P+I*I)/80,1);let ue=null;(Math.abs(P)>10||Math.abs(I)>10)&&(Math.abs(P)>Math.abs(I)?ue=P>0?"right":"left":ue=I>0?"down":"up"),s?.({dx:P,dy:I,direction:ue,progress:oe,vx:k,vy:j});const Z=f(k,j,P,I);Z&&v.current.currentDirection!==ve?(v.current.currentDirection=ve,c.includes(ve)||o?.(ve)):!Z&&v.current.currentDirection&&(v.current.currentDirection=null,l?.())},M=(P,I,k,j)=>{v.current.isDragging=!1,r?.();const W=m(k,j,P,I),ee=f(k,j,P,I),ne=Date.now()-v.current.lastMoveTime<100;let Se=ee&&!c.includes(W);u&&Se&&(Se=ne),Se?(_.start({xyrot:[P*3,I*3,k*5],config:{tension:200,friction:20}}),t?.(W),setTimeout(()=>{i?.()},300)):(_.start({xyrot:[0,0,0],config:{tension:400,friction:40}}),l?.())},w=P=>{const I="touches"in P,k=I?P.touches[0]?.clientX??P.changedTouches?.[0]?.clientX:P.clientX,j=I?P.touches[0]?.clientY??P.changedTouches?.[0]?.clientY:P.clientY;v.current.startTime===0&&(v.current.startTime=Date.now(),v.current.startX=k,v.current.startY=j,v.current.isDragging=!0);const W=k-v.current.startX,ee=j-v.current.startY,Q=Date.now()-v.current.startTime,ne=Q>0&&!isNaN(W)?W/Q*1e3:0,Se=Q>0&&!isNaN(ee)?ee/Q*1e3:0;return v.current.dx=W,v.current.dy=ee,v.current.vx=ne,v.current.vy=Se,{dx:W,dy:ee,vx:ne,vy:Se}},T=P=>{P.preventDefault(),v.current.startTime=0;const{dx:I,dy:k,vx:j,vy:W}=w(P.nativeEvent);y(I,k,j,W)},R=P=>{if(!v.current.isDragging)return;const{dx:I,dy:k,vx:j,vy:W}=w(P.nativeEvent);y(I,k,j,W)},A=P=>{if(!v.current.isDragging)return;const{dx:I,dy:k,vx:j,vy:W}=v.current;M(I,k,j,W),v.current.startTime=0},B=P=>{v.current.startTime=0;const{dx:I,dy:k,vx:j,vy:W}=w(P.nativeEvent);y(I,k,j,W)},b=P=>{const{dx:I,dy:k,vx:j,vy:W}=w(P.nativeEvent);y(I,k,j,W)},E=P=>{const{dx:I,dy:k,vx:j,vy:W}=v.current;M(I,k,j,W),v.current.startTime=0};F.useImperativeHandle(p,()=>({swipe:(P="left")=>{const k={left:[-300,0,-5],right:[300,0,5],up:[0,-300,0],down:[0,300,0]},[j,W,ee]=k[P]||k.left;_.start({xyrot:[j,W,ee],config:{tension:200,friction:20}}),t?.(P),setTimeout(()=>{i?.()},300)},restoreCard:()=>{_.start({xyrot:[0,0,0],config:{tension:400,friction:40}})}}));const N=c.includes("left")&&c.includes("right"),U=c.includes("up")&&c.includes("down");let D="none";return N&&!U?D="pan-x":U&&!N&&(D="pan-y"),a.jsx(ld.div,{className:e,style:{transform:g.to((P,I,k)=>`translate3d(${P}px, ${I}px, 0px) rotate(${k}deg)`),touchAction:D},onMouseDown:T,onMouseMove:R,onMouseUp:A,onMouseLeave:A,onTouchStart:B,onTouchMove:b,onTouchEnd:E,children:n})});uc.displayName="TinderCard";const ko=({votes:n,maxDisplay:e=3,className:t="",animate:i=!1})=>{if(!n||n.length===0)return null;const s=n.slice(0,e),r=n.length-e;return a.jsx("div",{className:`flex items-center ${t} ${i?"animate-fade-in-scale":""}`,children:a.jsxs("div",{className:"flex -space-x-2",children:[s.map((o,l)=>a.jsx("div",{className:"relative",style:{zIndex:e-l,animationDelay:i?`${l*100}ms`:"0ms"},title:o.name,children:a.jsx("div",{className:i?"animate-pop-in":"",style:{animationDelay:i?`${l*100}ms`:"0ms"},children:o.profilePhotoUrl?a.jsx("img",{src:o.profilePhotoUrl,alt:o.name,className:"w-7 h-7 rounded-full border-2 border-white/80 object-cover shadow-md"}):a.jsx("div",{className:"w-7 h-7 rounded-full border-2 border-white/80 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md",children:a.jsx("span",{className:"text-white text-xs font-bold",children:o.name.charAt(0).toUpperCase()})})})},o.id)),r>0&&a.jsx("div",{className:`relative w-7 h-7 rounded-full border-2 border-white/80 bg-black/60 backdrop-blur-sm flex items-center justify-center shadow-md ${i?"animate-pop-in":""}`,style:{zIndex:0,animationDelay:i?`${s.length*100}ms`:"0ms"},children:a.jsxs("span",{className:"text-white text-[10px] font-bold",children:["+",r]})})]})})},Iu=F.forwardRef(({topPhoto:n,bottomPhoto:e,onSelection:t,className:i="",disabled:s=!1,shouldShowCard:r=!0,onAnimationComplete:o,bufferStats:l,topPhotoFriendVotes:c=[],bottomPhotoFriendVotes:d=[]},h)=>{const u=F.useRef(null),[p,g]=F.useState(!0),_=F.useRef(!0),v=F.useRef(!0),m=F.useRef(!1),f=F.useRef(null),[y,M]=F.useState(null),[w,T]=F.useState(0),[R,A]=F.useState(!1),[B,b]=F.useState(!1),E=F.useRef(!1),N=F.useRef(null),U=F.useRef(null);F.useImperativeHandle(h,()=>({swipe:ue=>{u.current&&u.current.swipe(ue)}}));const D=F.useCallback(()=>{P(),N.current=window.setTimeout(()=>{console.log("⏰ Inactivity timer fired - showing hints and updating ref"),b(!0),E.current=!0},5e3)},[]),P=F.useCallback(()=>{N.current&&(window.clearTimeout(N.current),N.current=null)},[]),I=F.useCallback(()=>{console.log("🔄 resetInactivityTimer - starting new timer (hints will be hidden after interaction)"),D()},[D]),k=F.useCallback(()=>{console.log("🔄 hideHintsAfterInteraction - hiding hints and updating ref"),b(!1),E.current=!1},[]),j=F.useCallback(()=>{m.current=!0,f.current&&window.clearTimeout(f.current),f.current=window.setTimeout(()=>{m.current=!1,f.current=null},200)},[]),W=F.useCallback(()=>{console.log("📋 Dismissing instructions"),_.current=!1,g(!1),j()},[j]),ee=F.useCallback(()=>{console.log("👋 Dismissing visible elements - instructions:",_.current,"hints:",E.current),(_.current||E.current)&&(m.current=!0,j()),_.current&&(_.current=!1,g(!1)),E.current&&(E.current=!1,b(!1)),k()},[j,k]),Q=F.useCallback((ue,X,Z)=>{if(console.log("👆 handleSelectionInteraction called, instructionsVisible (ref):",_.current,"hintsVisible (ref):",E.current,"cooldown (ref):",m.current),s)return;if(_.current||E.current){console.log("📋💡 Interaction - UI elements visible, dismissing only"),ue.cancelable&&ue.preventDefault(),ue.stopPropagation(),ee(),I();return}const ce=Date.now(),Ue=U.current;if(Ue&&Ue.id===X.id&&ce-Ue.time<300){console.log("✅ Double tap confirmed - processing selection:",X.id),U.current=null,navigator.vibrate&&navigator.vibrate(50);const me=X.id===n.id?"up":"down";M(me),T(1),A(!0),t(X.id,Z.id),setTimeout(()=>{u.current&&u.current.swipe(me)},100)}else U.current={id:X.id,time:ce},I(),console.log("👆 First tap recorded for",X.id)},[s,t,n.id,e.id,I,ee]);F.useEffect(()=>{_.current=p},[p]),F.useEffect(()=>{A(!1)},[n.id,e.id]),F.useEffect(()=>(console.log("🔄 useEffect - shouldShowCard:",r,"disabled:",s,"isFirstLoad:",v.current),r&&!s?(v.current&&(console.log("💡 First load - showing hints and updating ref"),b(!0),E.current=!0,v.current=!1),D()):(console.log("💡 Hiding hints and updating ref"),P(),b(!1),E.current=!1),()=>{P(),f.current&&window.clearTimeout(f.current)}),[r,s,D,P]);const ne=F.useCallback(ue=>{if(console.log("🔄 handleSwipe called:",ue,"instructionsVisible (ref):",_.current,"hintsVisible (ref):",E.current,"cooldown (ref):",m.current),!s){if(_.current||E.current){console.log("📋💡 UI elements visible - dismissing only"),ee(),I();return}if(m.current){console.log("⏱️ In cooldown period - ignoring swipe");return}switch(I(),console.log("✅ Processing swipe:",ue),ue){case"up":console.log("📤 Submitting selection: top photo wins"),A(!0),t(n.id,e.id);break;case"down":console.log("📤 Submitting selection: bottom photo wins"),A(!0),t(e.id,n.id);break;case"left":case"right":console.log("Skip disabled - ignoring left/right swipe");break}}},[s,I,ee,t,n.id,e.id]),Se=F.useCallback(()=>{console.log("Card left screen"),M(null),T(0),A(!1),o&&o()},[o]),ve=F.useCallback(ue=>{if(E.current){ee();return}I(),ue.direction==="up"||ue.direction==="down"?(M(ue.direction),T(ue.progress)):(M(null),T(0))},[I,ee]),oe=F.useCallback(()=>{M(null),T(0)},[]);return r?a.jsxs("div",{className:`relative w-full max-w-lg mx-auto ${i}`,children:[a.jsx(uc,{ref:u,onSwipe:ne,onCardLeftScreen:Se,onDragMove:ve,onDragEnd:oe,preventSwipe:s?["up","down","left","right"]:["left","right"],swipeRequirementType:"velocity",swipeThreshold:300,flickOnSwipe:!0,className:"w-full h-[75vh] cursor-grab active:cursor-grabbing",children:a.jsxs("div",{className:"flex flex-col h-full gap-8 p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl",children:[a.jsxs("button",{onClick:ue=>Q(ue,n,e),className:"flex-1 relative overflow-hidden rounded-2xl border-4 border-white/10 hover:border-blue-500/50 transition-all duration-300 group touch-target prevent-zoom shadow-lg",disabled:s,children:[a.jsx("img",{src:n.url,alt:"Comparison option A",className:"w-full h-full object-cover",loading:"eager",draggable:!1}),a.jsx("div",{className:"absolute top-3 left-3 bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",children:"A"}),R&&c.length>0&&a.jsx(ko,{votes:c,maxDisplay:3,className:"absolute top-3 left-12",animate:!0}),n.type==="sample"&&a.jsx("div",{className:`absolute top-3 ${R&&c.length>0?"left-32":"left-12"} bg-blue-500/90 text-white px-2 py-1 rounded text-xs font-medium transition-all duration-300`,children:"Sample"}),n.bio&&a.jsx("div",{className:"absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg max-w-[calc(100%-1.5rem)]",children:a.jsx("p",{className:"text-xs text-white/90",children:n.bio})}),B&&a.jsx("div",{className:"absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ease-in-out",children:a.jsxs("div",{className:"text-white",children:[a.jsx("svg",{className:"w-16 h-16 mx-auto animate-bounce",fill:"currentColor",viewBox:"0 0 20 20",children:a.jsx("path",{fillRule:"evenodd",d:"M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z",clipRule:"evenodd"})}),a.jsx("p",{className:"text-center mt-2 font-semibold text-lg",children:"Tap or Swipe Up"})]})}),y==="up"&&a.jsx("div",{className:"absolute inset-0 flex items-center justify-center transition-opacity duration-100 ease-out pointer-events-none z-20",style:{backgroundColor:`rgba(34, 197, 94, ${w*.7})`,opacity:Math.max(.3,w)},children:a.jsx("div",{className:"text-white text-6xl font-black italic tracking-widest drop-shadow-2xl animate-pulse",children:"MOGS"})})]}),a.jsxs("button",{onClick:ue=>Q(ue,e,n),className:"flex-1 relative overflow-hidden rounded-2xl border-4 border-white/10 hover:border-blue-500/50 transition-all duration-300 group touch-target prevent-zoom shadow-lg",disabled:s,children:[a.jsx("img",{src:e.url,alt:"Comparison option B",className:"w-full h-full object-cover",loading:"eager",draggable:!1}),a.jsx("div",{className:"absolute top-3 left-3 bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",children:"B"}),R&&d.length>0&&a.jsx(ko,{votes:d,maxDisplay:3,className:"absolute top-3 left-12",animate:!0}),e.type==="sample"&&a.jsx("div",{className:`absolute top-3 ${R&&d.length>0?"left-32":"left-12"} bg-blue-500/90 text-white px-2 py-1 rounded text-xs font-medium transition-all duration-300`,children:"Sample"}),e.bio&&a.jsx("div",{className:"absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg max-w-[calc(100%-1.5rem)]",children:a.jsx("p",{className:"text-xs text-white/90",children:e.bio})}),B&&a.jsx("div",{className:"absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ease-in-out",children:a.jsxs("div",{className:"text-white",children:[a.jsx("svg",{className:"w-16 h-16 mx-auto animate-bounce",fill:"currentColor",viewBox:"0 0 20 20",children:a.jsx("path",{fillRule:"evenodd",d:"M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z",clipRule:"evenodd"})}),a.jsx("p",{className:"text-center mt-2 font-semibold text-lg",children:"Tap or Swipe Down"})]})}),y==="down"&&a.jsx("div",{className:"absolute inset-0 flex items-center justify-center transition-opacity duration-100 ease-out pointer-events-none z-20",style:{backgroundColor:`rgba(34, 197, 94, ${w*.7})`,opacity:Math.max(.3,w)},children:a.jsx("div",{className:"text-white text-6xl font-black italic tracking-widest drop-shadow-2xl animate-pulse",children:"MOGS"})})]})]})}),p&&a.jsx("div",{className:"absolute bottom-4 left-4 right-4 z-50 pointer-events-none",children:a.jsxs("div",{className:"bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center relative pointer-events-auto shadow-2xl",children:[a.jsx("button",{onClick:W,className:"absolute top-3 right-3 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors","aria-label":"Close instructions",children:"×"}),a.jsx("p",{className:"text-white font-black italic uppercase tracking-widest mb-1",children:"Double tap to choose who is more attractive"}),a.jsx("p",{className:"text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]",children:"Tap twice to select your preference"})]})})]}):a.jsx("div",{className:`relative w-full max-w-md mx-auto ${i}`,children:a.jsx("div",{className:"w-full h-[70vh] flex items-center justify-center",children:a.jsxs("div",{className:"text-center",children:[a.jsx("div",{className:"w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"}),a.jsxs("p",{className:"text-white text-sm",children:["Loading next pair... ",l?.current??0]})]})})})}),Uu=({bufferSize:n=5,refillThreshold:e=2,userId:t,recentlySubmittedPair:i,onError:s})=>{const[r,o]=F.useState([]),[l,c]=F.useState(0),[d,h]=F.useState(!0),[u,p]=F.useState(!1),g=F.useRef({}),_=F.useRef(!1),v=F.useCallback((N,U={})=>{},[r,l,u,d]),m=F.useCallback((N,U)=>{const D=N.leftPhoto.id,P=N.rightPhoto.id,I=N.leftPhoto.type,k=N.rightPhoto.type,j=D===U.winnerId&&I===U.winnerType||P===U.winnerId&&k===U.winnerType,W=D===U.loserId&&I===U.loserType||P===U.loserId&&k===U.loserType;return j&&W},[]),f=F.useCallback(N=>new Promise((U,D)=>{if(g.current[N]?.loaded){U();return}if(g.current[N]?.error){D(new Error("Image failed to load previously"));return}const P=new Image;P.onload=()=>{g.current[N]={loaded:!0,error:!1,image:P},U()},P.onerror=()=>{g.current[N]={loaded:!1,error:!0},D(new Error(`Failed to load image: ${N}`))},g.current[N]={loaded:!1,error:!1},P.src=N}),[]),y=F.useCallback(async N=>{const U=[N.leftPhoto.url,N.rightPhoto.url,N.leftPhoto.thumbnailUrl,N.rightPhoto.thumbnailUrl].filter(Boolean);try{await Promise.allSettled(U.map(D=>f(D)))}catch(D){console.warn("Some images failed to preload for pair:",N.sessionId,D)}},[f]),M=F.useCallback(async(N,U)=>{try{const{apiRequest:D}=await qr(async()=>{const{apiRequest:ee}=await Promise.resolve().then(()=>Co);return{apiRequest:ee}},void 0,import.meta.url),P=new URLSearchParams({userId:t,buffer:N.toString()}),I=U||i;I&&(P.append("recentWinnerId",I.winnerId),P.append("recentLoserId",I.loserId),P.append("recentWinnerType",I.winnerType),P.append("recentLoserType",I.loserType));const j=await(await D(`/api/comparisons/next-pair?${P.toString()}`)).json();if(!j.success)throw new Error(j.error||"Failed to fetch pairs");let W=[];return j.pairs&&Array.isArray(j.pairs)?W=j.pairs:j.pair&&(W=[j.pair]),W}catch(D){throw console.error("Failed to fetch pairs:",D),D}},[t,i]),w=F.useCallback(async()=>{try{const{apiRequest:N}=await qr(async()=>{const{apiRequest:k}=await Promise.resolve().then(()=>Co);return{apiRequest:k}},void 0,import.meta.url),D=await(await N(`/api/challenges/active?excludeUserId=${t}`)).json();if(!D.success||!D.challenge)return null;const P=D.challenge,I={sessionId:`challenge_${P.id}`,isChallenge:!0,challengeId:P.id,leftPhoto:{id:P.challenger.id,url:P.challenger.profilePhotoUrl||"",thumbnailUrl:P.challenger.profilePhotoUrl||"",userId:P.challenger.id,userAge:0,userGender:"",bio:"",type:"user",name:P.challenger.name},rightPhoto:{id:P.challenged.id,url:P.challenged.profilePhotoUrl||"",thumbnailUrl:P.challenged.profilePhotoUrl||"",userId:P.challenged.id,userAge:0,userGender:"",bio:"",type:"user",name:P.challenged.name}};return console.log("⚔️ Fetched challenge pair:",I.sessionId),I}catch(N){return console.warn("Failed to fetch challenge pair:",N),null}},[t]),T=F.useCallback(async N=>{if(!_.current){_.current=!0,p(!0);try{const U=await M(n,N);let D=null;if(Math.random()<.3&&(D=await w()),U.length===0&&!D){s?.("No more pairs available");return}let P=U.map(I=>({...I,preloaded:!1}));if(D){const I={...D,preloaded:!1},k=Math.floor(Math.random()*P.length)+1;P.splice(Math.min(k,P.length),0,I),console.log(`⚔️ Inserted challenge at position ${k}`)}v("before_refill",{newPairsReceived:U.length,newPairsFiltered:P.length,recentPairOverride:!!N}),o(I=>{if(I.length===0)return P.length>0&&c(0),P.length>0&&setTimeout(()=>{y(P[0]).catch(console.error)},0),P;const k=[...I,...P];return setTimeout(()=>{v("after_refill",{prevLength:I.length,newPairsAdded:P.length,totalAfterRefill:k.length})},0),k}),P.forEach(async(I,k)=>{if(k<2)try{await y(I),o(j=>{const W=j.findIndex(ee=>ee.sessionId===I.sessionId);if(W!==-1){const ee=[...j];return ee[W]={...ee[W],preloaded:!0},ee}return j})}catch(j){console.warn(`Failed to preload pair ${k}:`,j)}})}catch(U){console.error("Buffer refill failed:",U),s?.(U instanceof Error?U.message:"Failed to load pairs")}finally{_.current=!1,p(!1)}}},[n,M,w,y,s]),R=F.useCallback(async()=>{h(!0);try{await T()}finally{h(!1)}},[T]),A=F.useCallback(N=>{},[]),B=F.useCallback(()=>{if(r.length===0)return null;if(l>=r.length){if(c(0),r.length>0){const U=r[0];return U&&A(U),U}return null}const N=r[l];return N&&A(N),N},[r,l,A]),b=F.useCallback(async N=>{v("before_advance",{hasRecentPair:!!N,recentPair:N});const U=l+1;if(U>=r.length){await T(N);return}c(U),r[U]&&setTimeout(()=>{y(r[U]).catch(console.error)},0),v("after_advance",{previousIndex:l,nextIndex:U}),r.length-U<=e&&!u&&setTimeout(()=>{T(N).catch(console.error)},100);const P=r[U+1];P&&!P.preloaded&&y(P).then(()=>{o(I=>{const k=[...I],j=U+1;return k[j]&&(k[j]={...k[j],preloaded:!0}),k})}).catch(console.warn)},[l,r,e,u,T,y,m]),E=F.useCallback(()=>{const N=B();if(!N)return!1;const U=[N.leftPhoto.url,N.rightPhoto.url],D=U.map(I=>({url:I,cached:!!g.current[I],loaded:g.current[I]?.loaded||!1,error:g.current[I]?.error||!1,hasImage:!!g.current[I]?.image})),P=U.every(I=>g.current[I]?.loaded);return D.forEach(I=>{I.loaded}),P},[B]);return F.useEffect(()=>{(()=>{const U=new Set;for(let D=Math.max(0,l-1);D<Math.min(r.length,l+3);D++){const P=r[D];P&&(U.add(P.leftPhoto.url),U.add(P.rightPhoto.url),U.add(P.leftPhoto.thumbnailUrl),U.add(P.rightPhoto.thumbnailUrl))}Object.keys(g.current).forEach(D=>{U.has(D)||delete g.current[D]})})()},[l,r]),{getCurrentPair:B,advanceToNext:b,initializeBuffer:R,isLoading:d,isBuffering:u,isCurrentPairReady:E,bufferStats:{total:r.length,current:l,remaining:r.length-l,preloadedCount:r.filter(N=>N.preloaded).length}}},Fu=()=>{const{user:n}=vn(),[e,t]=F.useState(null),[i,s]=F.useState(!1),[r,o]=F.useState(null),[l,c]=F.useState(!1),[d,h]=F.useState(null),[u,p]=F.useState([]),[g,_]=F.useState([]),v=F.useRef(null),{getCurrentPair:m,advanceToNext:f,initializeBuffer:y,isLoading:M,isBuffering:w,isCurrentPairReady:T,bufferStats:R}=Uu({bufferSize:10,refillThreshold:3,userId:n?.id||"",recentlySubmittedPair:d,onError:o}),A=m(),B=!!(A&&!l&&T()),b=F.useCallback(async D=>{c(!0),await f(D)},[f]);F.useEffect(()=>{n?.id&&E()},[n?.id]),F.useEffect(()=>{const D=!!A,P=T();l&&D&&P&&(console.log("✅ Resetting isTransitioning to false"),c(!1))},[l,A,T]),F.useEffect(()=>{(async()=>{if(!A||!n?.id){p([]),_([]);return}try{const P=new URLSearchParams({userId:n.id,leftPhotoId:A.leftPhoto.id,rightPhotoId:A.rightPhoto.id,leftType:A.leftPhoto.type||"user",rightType:A.rightPhoto.type||"user"}),k=await(await Ve(`/api/comparisons/friend-votes?${P}`)).json();k.success&&(p(k.leftVotes||[]),_(k.rightVotes||[]))}catch(P){console.error("Failed to fetch friend votes:",P),p([]),_([])}})()},[A?.leftPhoto?.id,A?.rightPhoto?.id,n?.id]);const E=async()=>{try{o(null),await Promise.all([y(),N()])}catch(D){console.error("Failed to load initial data:",D),o("Failed to load comparison data")}},N=async()=>{if(n?.id)try{const P=await(await Ve(`/api/comparisons/daily-progress?userId=${n.id}`)).json();P.success?t(P.progress):console.error("Failed to get daily progress:",P.error)}catch(D){console.error("Failed to fetch daily progress:",D)}},U=async(D,P)=>{if(!(i||!A||!n?.id))try{if(s(!0),A.isChallenge&&A.challengeId){const k=await(await Ve("/api/challenges/vote",{method:"POST",body:JSON.stringify({challengeId:A.challengeId,voterId:n.id,chosenUserId:D})})).json();k.success?(console.log("⚔️ Challenge vote submitted:",{challengeId:A.challengeId,winner:D,totalVotes:k.totalVotes}),navigator.vibrate&&navigator.vibrate([50,100,50])):k.error?.includes("Already voted")||o(k.error||"Failed to submit challenge vote")}else{const I=D===A.leftPhoto.id?A.leftPhoto:A.rightPhoto,k=P===A.leftPhoto.id?A.leftPhoto:A.rightPhoto,W=await(await Ve("/api/comparisons/submit",{method:"POST",body:JSON.stringify({sessionId:A.sessionId,winnerId:D,loserId:P,winnerType:I.type,loserType:k.type,userId:n.id})})).json();if(W.success){const ee={winnerId:D,loserId:P,winnerType:I.type,loserType:k.type};v.current=ee,h(ee),navigator.vibrate&&navigator.vibrate([50,50,50]),await N()}else o(W.error||"Failed to submit comparison")}}catch(I){console.error("Failed to submit comparison:",I),o("Failed to submit comparison")}finally{s(!1)}};return M?a.jsx("div",{className:"absolute inset-0 flex items-center justify-center",style:{background:"#4A90E2"},children:a.jsxs("div",{className:"text-white text-center",children:[a.jsx("div",{className:"w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"}),a.jsx("p",{className:"drop-shadow-lg",style:{textShadow:"1px 1px 2px rgba(0, 0, 0, 0.5)"},children:"Loading photos..."}),a.jsx("p",{className:"text-white/80 text-sm mt-2 drop-shadow",style:{textShadow:"1px 1px 2px rgba(0, 0, 0, 0.5)"},children:"Preparing buffer..."})]})}):r?a.jsx("div",{className:"min-h-screen flex items-center justify-center p-6 safe-area-inset",children:a.jsxs("div",{className:"text-center max-w-sm",children:[a.jsx("div",{className:"text-6xl mb-6",children:"❌"}),a.jsx("h1",{className:"text-2xl font-bold text-white mb-4",children:"Something went wrong"}),a.jsx("p",{className:"text-gray-400 mb-8",children:r}),a.jsx("button",{onClick:E,className:"bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors",children:"Try Again"})]})}):!A&&(w||!T())?a.jsx("div",{className:"min-h-screen bg-black flex items-center justify-center safe-area-inset",children:a.jsxs("div",{className:"text-center",children:[a.jsx("div",{className:"w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"}),a.jsx("p",{className:"text-white",children:"Preparing next pair..."}),a.jsx("p",{className:"text-gray-400 text-sm mt-2",children:w?"Loading new pairs...":"Loading images..."})]})}):A?a.jsxs("div",{className:"flex flex-col overflow-hidden h-full absolute inset-0",style:{background:"linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"},children:[a.jsxs("header",{className:"px-6 py-2 flex-shrink-0",children:[a.jsxs("div",{className:"flex items-center justify-between mb-2",children:[a.jsxs("h1",{className:"text-2xl font-black italic uppercase tracking-tight",style:{textShadow:"2px 2px 4px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 0, 0, 0.3)"},children:[a.jsx("span",{className:"text-white",children:"BERKELEY "}),a.jsx("span",{className:"text-blue-300",children:"GOGGLES"})]}),a.jsxs("div",{className:"text-sm text-white font-semibold",style:{textShadow:"1px 1px 2px rgba(0, 0, 0, 0.5)"},children:[e?.comparisonsCompleted||0,"/",e?.dailyTarget||20," today"]})]}),a.jsx("div",{className:"w-full bg-gray-800 rounded-full h-2 overflow-hidden",children:a.jsx("div",{className:"h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out",style:{width:`${e?.progress||0}%`}})}),a.jsxs("div",{className:"flex items-center justify-between mt-2 text-sm",children:[a.jsxs("div",{className:"flex items-center",style:{textShadow:"1px 1px 2px rgba(0, 0, 0, 0.5)"},children:[a.jsx("span",{className:"mr-2",children:"🔥"}),a.jsxs("span",{className:"text-white font-semibold",children:[e?.streak||0," day streak"]})]}),a.jsxs("div",{className:"flex items-center text-xs text-white font-semibold",style:{textShadow:"1px 1px 2px rgba(0, 0, 0, 0.5)"},children:[w&&a.jsx("span",{className:"mr-2",children:"⏳ Loading..."}),a.jsxs("span",{children:[R.remaining," pairs ready"]}),!T()&&a.jsx("span",{className:"ml-2 text-yellow-500",children:"📷"})]})]})]}),A?.isChallenge&&a.jsxs("div",{className:"px-6 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center space-x-2 shadow-lg",children:[a.jsx("span",{className:"text-2xl",children:"⚔️"}),a.jsx("span",{className:"text-white font-black italic uppercase tracking-wider drop-shadow-md",children:"Mog Battle"}),a.jsx("span",{className:"text-2xl",children:"⚔️"})]}),a.jsx("main",{className:"flex-1 flex items-center justify-center p-2 overflow-hidden",children:A?a.jsx(Iu,{topPhoto:{id:A.leftPhoto.id,url:A.leftPhoto.url.startsWith("http")?A.leftPhoto.url:`http://localhost:3001/api/user/photo/${A.leftPhoto.url.split("/").pop()}`,userId:A.leftPhoto.userId,name:A.leftPhoto.name,age:A.leftPhoto.userAge,gender:A.leftPhoto.userGender,bio:A.leftPhoto.bio,type:A.leftPhoto.type},bottomPhoto:{id:A.rightPhoto.id,url:A.rightPhoto.url.startsWith("http")?A.rightPhoto.url:`http://localhost:3001/api/user/photo/${A.rightPhoto.url.split("/").pop()}`,userId:A.rightPhoto.userId,name:A.rightPhoto.name,age:A.rightPhoto.userAge,gender:A.rightPhoto.userGender,bio:A.rightPhoto.bio,type:A.rightPhoto.type},onSelection:U,className:"fade-up",disabled:i,shouldShowCard:B,bufferStats:R,topPhotoFriendVotes:u,bottomPhotoFriendVotes:g,onAnimationComplete:()=>{const D=v.current;v.current=null,b(D)}}):a.jsxs("div",{className:"text-center",children:[a.jsx("div",{className:"w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"}),a.jsxs("p",{className:"text-white text-sm",children:["Loading next pair rn ",R.current]})]})}),a.jsx("footer",{className:"px-6 py-4 flex-shrink-0",children:a.jsx("div",{className:"text-center",children:a.jsxs("div",{className:"flex justify-center space-x-6 text-xs text-gray-400",children:[a.jsx("span",{children:"↔️ Swipe left/right to skip"}),a.jsx("span",{children:"👆 Double tap to select"})]})})})]}):a.jsx("div",{className:"min-h-screen flex items-center justify-center p-6 safe-area-inset",children:a.jsxs("div",{className:"text-center max-w-sm",children:[a.jsx("div",{className:"text-6xl mb-6",children:"🎉"}),a.jsx("h1",{className:"text-3xl font-bold text-white mb-4",children:"All Done!"}),a.jsxs("p",{className:"text-xl text-blue-400 mb-4",children:[e?.comparisonsCompleted||0," comparisons completed today"]}),a.jsx("p",{className:"text-gray-400 mb-8 leading-relaxed",children:"Thank you for helping improve our ranking algorithm! Your honest feedback makes our system better for everyone."}),a.jsx("button",{onClick:E,className:"bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full",children:"Refresh"})]})})},ku=()=>{const{user:n}=vn(),[e,t]=F.useState([]),[i,s]=F.useState([]),[r]=F.useState([]),[o,l]=F.useState(!0),[c,d]=F.useState(null),[h,u]=F.useState([]),p=F.useRef(null),[g,_]=F.useState(""),[v,m]=F.useState(!0),[f,y]=F.useState(!0),[M,w]=F.useState(!1),[T,R]=F.useState(!1),[A,B]=F.useState(!1),[b,E]=F.useState([]),[N,U]=F.useState(new Set),[D,P]=F.useState(null),[I,k]=F.useState(!1),[j,W]=F.useState(!1),[ee,Q]=F.useState(!1),[ne,Se]=F.useState(null),[ve,oe]=F.useState(null);F.useEffect(()=>{t([{id:"oski-bear",name:"Oski",profilePhotoUrl:ql,lastMessage:"heyy",lastMessageTime:"Just now",isYourTurn:!0,age:118}])},[]),F.useEffect(()=>{if(!n?.id)return;const se=dc(n.id);return se.on("oski:response",ye=>{console.log("🐻 Oski response received:",ye.message);const Te={id:Date.now().toString(),senderId:"oski-bear",receiverId:n.id,message:ye.message,timestamp:new Date(ye.timestamp),isFromOski:!0};u(Ie=>[...Ie,Te])}),()=>{se.off("oski:response")}},[n?.id]),F.useEffect(()=>{(async()=>{if(!n?.id){l(!1);return}try{const Te=await(await Ve(`/api/match-messages/conversations/${n.id}`)).json();if(Te.success&&Te.conversations){const Ie=Te.conversations.map(L=>({id:L.match.id,name:L.partner.name,profilePhotoUrl:L.partner.profilePhotoUrl,age:L.partner.age,lastMessage:L.lastMessage?.content,lastMessageTime:L.lastMessage?ue(new Date(L.lastMessage.createdAt)):void 0,isYourTurn:L.unreadCount>0})),Ee=Ie.filter(L=>L.isYourTurn),Je=Ie.filter(L=>!L.isYourTurn);t(L=>[...L.filter(ft=>ft.id==="oski-bear"),...Ee]),s(Je)}}catch(ye){console.error("Failed to fetch matches:",ye)}l(!1)})()},[n?.id]);const ue=se=>{const Te=new Date().getTime()-se.getTime(),Ie=Math.floor(Te/6e4);if(Ie<1)return"Just now";if(Ie<60)return`${Ie}m ago`;const Ee=Math.floor(Ie/60);return Ee<24?`${Ee}h ago`:`${Math.floor(Ee/24)}d ago`};F.useEffect(()=>{c&&(c.id==="oski-bear"?u([{id:"1",senderId:"oski-bear",receiverId:n?.id||"",message:"heyy",timestamp:new Date,isFromOski:!0}]):X(c.id))},[c,n?.id]),F.useEffect(()=>{p.current?.scrollIntoView({behavior:"smooth"})},[h]);const X=async se=>{if(n?.id)try{const Te=await(await Ve(`/api/match-messages/${se}?userId=${n.id}`)).json();if(Te.success&&Te.messages){const Ie=Te.messages.map(Ee=>({id:Ee.id,senderId:Ee.senderId,receiverId:se,message:Ee.content,timestamp:new Date(Ee.createdAt)}));u(Ie)}}catch(ye){console.error("Failed to load chat messages:",ye),u([])}},Z=async()=>{if(!g.trim()||!c)return;const se={id:Date.now().toString(),senderId:n?.id||"",receiverId:c.id,message:g.trim(),timestamp:new Date};if(u(ye=>[...ye,se]),_(""),c.id==="oski-bear"){const ye=Pu();ye&&ye.emit("oski:message",{message:g.trim(),conversationHistory:h.map(Te=>({message:Te.message,isFromOski:Te.isFromOski||Te.senderId==="oski-bear"}))})}else try{const Te=await(await Ve("/api/match-messages",{method:"POST",body:JSON.stringify({matchId:c.id,senderId:n?.id,content:se.message})})).json();Te.success||console.error("Failed to send message:",Te.error)}catch(ye){console.error("Failed to send message:",ye)}},ce=se=>{const Te=new Date().getTime()-se.getTime(),Ie=Math.floor(Te/6e4);if(Ie<1)return"Just now";if(Ie<60)return`${Ie}m ago`;const Ee=Math.floor(Ie/60);return Ee<24?`${Ee}h ago`:`${Math.floor(Ee/24)}d ago`},Ue=async()=>{if(n?.id){k(!0);try{const ye=await(await Ve(`/api/matches/potential-matches?userId=${n.id}`)).json();if(ye.success){const Te=ye.matches||[];E(Te),U(new Set),P(null),B(!0)}else console.error("Failed to fetch potential matches:",ye.error),ye.hasUsedDailyMatch?(Q(!0),alert(ye.error||"You have already used your daily match today. Come back tomorrow!")):alert(ye.error||"Failed to load matches")}catch(se){console.error("Error fetching potential matches:",se),alert("Failed to load matches")}finally{k(!1)}}},me=async se=>{Se(se),setTimeout(()=>{U(ye=>new Set(ye).add(se)),Se(null)},300)},$e=async se=>{!n?.id||j||(W(!0),P(se),oe(se),setTimeout(async()=>{try{const Te=await(await Ve("/api/matches/create-match",{method:"POST",body:JSON.stringify({userId:n.id,selectedUserId:se})})).json();if(Te.success){const Ie=b.find(Ee=>Ee.id===se);if(Ie){const Ee={id:Ie.id,name:Ie.name,profilePhotoUrl:Ie.profilePhotoUrl||Ie.photoUrl,isYourTurn:!1,age:Ie.age||void 0};s(Je=>[...Je,Ee]),Q(!0),setTimeout(()=>{E([]),U(new Set),B(!1),oe(null)},500)}}else console.error("Failed to create match:",Te.error),alert(Te.error||"Failed to create match"),P(null),oe(null)}catch(ye){console.error("Error creating match:",ye),alert("Failed to create match"),P(null),oe(null)}finally{W(!1)}},400))};return o?a.jsx("div",{className:"absolute inset-0 flex items-center justify-center",style:{background:"#4A90E2"},children:a.jsxs("div",{className:"text-white text-center",children:[a.jsx("div",{className:"w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"}),a.jsx("p",{className:"drop-shadow-lg",style:{textShadow:"1px 1px 2px rgba(0, 0, 0, 0.5)"},children:"Loading matches..."})]})}):c?a.jsxs("div",{className:"absolute inset-0 flex flex-col",style:{background:"#4A90E2",top:0,left:0,right:0,bottom:0,height:"100dvh"},children:[a.jsxs("header",{className:"bg-white/20 backdrop-blur-sm border-b border-white/30 px-4 py-3 flex items-center justify-between flex-shrink-0",children:[a.jsx("button",{onClick:()=>d(null),className:"text-white hover:text-white/80",children:a.jsx("svg",{className:"w-6 h-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 19l-7-7 7-7"})})}),a.jsxs("button",{onClick:()=>R(!0),className:"flex items-center space-x-3 flex-1 ml-4 text-left",children:[a.jsx("img",{src:c.profilePhotoUrl||"https://via.placeholder.com/50",alt:c.name,className:"w-12 h-12 rounded-full object-cover border-2 border-white/50 shadow-lg"}),a.jsxs("div",{className:"flex items-center space-x-2",children:[a.jsx("h2",{className:"font-bold text-white drop-shadow-lg",style:{textShadow:"1px 1px 2px rgba(0, 0, 0, 0.5)"},children:c.name}),c.age&&a.jsxs(a.Fragment,{children:[a.jsx("span",{className:"text-white/70 drop-shadow",style:{textShadow:"1px 1px 2px rgba(0, 0, 0, 0.5)"},children:"•"}),a.jsx("span",{className:"text-sm text-white/90 drop-shadow",style:{textShadow:"1px 1px 2px rgba(0, 0, 0, 0.5)"},children:c.age})]})]})]}),a.jsx("div",{className:"w-6 h-6"})," "]}),T&&a.jsx("div",{className:"fixed inset-0 bg-black/90 backdrop-blur z-50 flex items-center justify-center p-4",onClick:()=>R(!1),children:a.jsxs("div",{className:"relative max-w-4xl w-full",children:[a.jsx("button",{onClick:()=>R(!1),className:"absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-2",children:a.jsx("svg",{className:"w-6 h-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})}),a.jsx("img",{src:c.profilePhotoUrl||"https://via.placeholder.com/400",alt:c.name,className:"w-full h-auto rounded-lg object-contain max-h-[90vh]",onClick:se=>se.stopPropagation()})]})}),a.jsxs("main",{className:"flex-1 overflow-y-auto px-4 py-4 space-y-3",style:{paddingBottom:"16px",minHeight:0,maxHeight:"calc(100vh - 180px)"},children:[h.map(se=>a.jsx("div",{className:`flex ${se.senderId===n?.id?"justify-end":"justify-start"} mb-2`,children:a.jsxs("div",{className:`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl ${se.senderId===n?.id?"bg-blue-500 text-white rounded-tr-sm":"bg-white text-gray-900 rounded-tl-sm"}`,style:{boxShadow:"0 2px 8px rgba(0, 0, 0, 0.15)"},children:[a.jsx("p",{className:"text-base leading-relaxed",children:se.message}),a.jsx("p",{className:`text-xs mt-1.5 ${se.senderId===n?.id?"text-blue-50":"text-gray-500"}`,children:ce(se.timestamp)})]})},se.id)),a.jsx("div",{ref:p})]}),a.jsx("div",{className:"bg-white/20 backdrop-blur-sm border-t border-white/30 px-4 py-3 flex-shrink-0",style:{paddingBottom:"calc(env(safe-area-inset-bottom) + 64px)",marginBottom:0},children:a.jsxs("div",{className:"flex items-center space-x-2",children:[a.jsx("input",{type:"text",value:g,onChange:se=>_(se.target.value),onKeyPress:se=>se.key==="Enter"&&Z(),placeholder:"Type a message...",className:"flex-1 px-4 py-2.5 bg-white border border-white/40 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-500 text-base",style:{boxShadow:"0 2px 8px rgba(0, 0, 0, 0.1)"}}),a.jsx("button",{onClick:Z,disabled:!g.trim(),className:"w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed ml-2",style:{boxShadow:"0 2px 8px rgba(0, 0, 0, 0.2)"},children:a.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 19l9 2-9-18-9 18 9-2zm0 0v-8"})})})]})})]}):a.jsxs("div",{className:"absolute inset-0 flex flex-col",style:{background:"#4A90E2"},children:[a.jsx("header",{className:"bg-white/10 backdrop-blur-sm border-b border-white/20 px-6 py-4 flex-shrink-0",children:a.jsxs("div",{className:"flex items-center justify-between",children:[a.jsx("h1",{className:"text-3xl font-bold text-white drop-shadow-lg",style:{textShadow:"2px 2px 4px rgba(0, 0, 0, 0.5)"},children:"Matches"}),n?.gender==="female"&&a.jsx("button",{type:"button",onClick:Ue,disabled:I||ee,className:`${ee?"bg-gray-400 cursor-not-allowed":"bg-pink-500 hover:bg-pink-600"} text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed`,title:ee?"You have already used your daily match today. Come back tomorrow!":"Get 3 potential matches (one per day)",children:I?"Loading...":"Daily Match"})]})}),A&&a.jsx("div",{className:"fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4",onClick:se=>{se.target===se.currentTarget&&(B(!1),E([]),U(new Set),P(null),Se(null),oe(null))},children:a.jsxs("div",{className:"bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto",children:[a.jsxs("div",{className:"flex items-center justify-between mb-4",children:[a.jsxs("div",{children:[a.jsx("h2",{className:"text-2xl font-bold text-gray-900",children:"Choose Your Match"}),a.jsx("p",{className:"text-sm text-gray-500 mt-1",children:"One match per day"})]}),a.jsx("button",{type:"button",onClick:()=>{B(!1),E([]),U(new Set),P(null),Se(null),oe(null)},className:"text-gray-500 hover:text-gray-700",children:a.jsx("svg",{className:"w-6 h-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]}),b.length===0?a.jsx("div",{className:"text-center py-8",children:a.jsx("p",{className:"text-gray-600",children:"No matches available right now. Try again later!"})}):a.jsx("div",{className:"space-y-4",children:b.map(se=>{const ye=N.has(se.id),Te=D===se.id,Ie=ne===se.id,Ee=ve===se.id,Je=j||D!==null&&!Te;return a.jsx("div",{className:`w-full rounded-xl transition-all duration-300 border-2 ${Ee?"border-pink-500 bg-pink-50 scale-105 shadow-lg":Te?"border-pink-500 bg-pink-50":ye?"border-gray-200 bg-gray-50 hover:bg-gray-100":"border-gray-300 bg-gray-100 hover:bg-gray-200 cursor-pointer"} ${Je&&!Te?"opacity-30":""} ${Ie?"animate-pulse":""}`,style:{animation:Ee?"bounce 0.5s ease-in-out":void 0},children:ye?a.jsxs("button",{type:"button",onClick:()=>$e(se.id),disabled:Je,className:`w-full flex items-center space-x-4 p-4 disabled:cursor-not-allowed transition-all duration-300 ${Ee?"transform scale-105":""}`,children:[a.jsxs("div",{className:`relative transition-all duration-300 ${Ee?"animate-bounce":""}`,children:[a.jsx("img",{src:se.profilePhotoUrl||se.photoUrl,alt:se.name,className:"w-20 h-20 rounded-full object-cover border-2 border-pink-200"}),Ee&&a.jsx("div",{className:"absolute inset-0 rounded-full border-4 border-pink-400 animate-ping"})]}),a.jsxs("div",{className:"flex-1 text-left",children:[a.jsx("h3",{className:"font-bold text-lg text-gray-900",children:se.name}),se.age&&a.jsxs("p",{className:"text-sm text-gray-600",children:[se.age," years old"]}),a.jsxs("p",{className:"text-xs text-gray-500 mt-1",children:[Math.round(se.currentPercentile),"th percentile"]})]}),j&&Te&&a.jsx("div",{className:"w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"}),Ee&&!j&&a.jsx("div",{className:"text-2xl",children:"✨"})]}):a.jsx("button",{type:"button",onClick:()=>me(se.id),disabled:Je||Ie,className:`w-full flex items-center justify-center p-8 min-h-[120px] transition-all duration-300 ${Ie?"scale-95":"hover:scale-105"}`,children:a.jsxs("div",{className:`text-center transition-all duration-300 ${Ie?"opacity-50 scale-90":""}`,children:[a.jsx("div",{className:"text-4xl mb-2 transform transition-transform duration-300 hover:scale-110",children:"🎁"}),a.jsx("p",{className:"text-gray-600 font-semibold",children:"Click to reveal"})]})})},se.id)})})]})}),a.jsxs("main",{className:"flex-1 overflow-y-auto px-6 py-4",style:{WebkitOverflowScrolling:"touch",touchAction:"pan-y",minHeight:0,paddingBottom:"80px"},children:[a.jsxs("div",{className:"mb-6",children:[a.jsxs("button",{onClick:()=>m(!v),className:"w-full flex items-center justify-between py-4 text-left",children:[a.jsxs("span",{className:"text-xl font-bold text-white drop-shadow-lg",style:{textShadow:"1px 1px 3px rgba(0, 0, 0, 0.5)"},children:["Your turn (",e.length,")"]}),a.jsx("svg",{className:`w-6 h-6 text-white/90 transition-transform ${v?"rotate-180":""}`,fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M19 9l-7 7-7-7"})})]}),v&&a.jsx("div",{className:"space-y-3",children:e.map(se=>a.jsxs("button",{onClick:()=>d(se),className:"w-full flex items-center space-x-4 p-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-all border border-white/30",children:[a.jsx("img",{src:se.profilePhotoUrl||"https://via.placeholder.com/80",alt:se.name,className:"w-20 h-20 rounded-full object-cover border-2 border-white/50 shadow-lg"}),a.jsxs("div",{className:"flex-1 text-left min-w-0",children:[a.jsx("h3",{className:"font-bold text-lg text-white drop-shadow-lg mb-1",style:{textShadow:"1px 1px 2px rgba(0, 0, 0, 0.5)"},children:se.name}),a.jsx("p",{className:"text-base text-white/90 truncate drop-shadow",style:{textShadow:"1px 1px 2px rgba(0, 0, 0, 0.5)"},children:se.lastMessage})]}),se.lastMessageTime&&a.jsx("span",{className:"text-sm text-white/80 drop-shadow flex-shrink-0",style:{textShadow:"1px 1px 2px rgba(0, 0, 0, 0.5)"},children:se.lastMessageTime})]},se.id))})]}),a.jsxs("div",{className:"mb-6",children:[a.jsxs("button",{onClick:()=>y(!f),className:"w-full flex items-center justify-between py-4 text-left",children:[a.jsxs("span",{className:"text-xl font-bold text-white drop-shadow-lg",style:{textShadow:"1px 1px 3px rgba(0, 0, 0, 0.5)"},children:["Their turn (",i.length,")"]}),a.jsx("svg",{className:`w-6 h-6 text-white/90 transition-transform ${f?"rotate-180":""}`,fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M19 9l-7 7-7-7"})})]}),f&&a.jsx("div",{className:"space-y-3",children:i.length===0?a.jsx("p",{className:"text-white/80 text-base py-4 drop-shadow",style:{textShadow:"1px 1px 2px rgba(0, 0, 0, 0.5)"},children:"No matches waiting for your response"}):i.map(se=>a.jsxs("button",{onClick:()=>d(se),className:"w-full flex items-center space-x-4 p-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-all border border-white/30",children:[a.jsx("img",{src:se.profilePhotoUrl||"https://via.placeholder.com/80",alt:se.name,className:"w-20 h-20 rounded-full object-cover border-2 border-white/50 shadow-lg"}),a.jsxs("div",{className:"flex-1 text-left min-w-0",children:[a.jsx("h3",{className:"font-bold text-lg text-white drop-shadow-lg mb-1",style:{textShadow:"1px 1px 2px rgba(0, 0, 0, 0.5)"},children:se.name}),a.jsx("p",{className:"text-base text-white/90 truncate drop-shadow",style:{textShadow:"1px 1px 2px rgba(0, 0, 0, 0.5)"},children:se.lastMessage})]}),se.lastMessageTime&&a.jsx("span",{className:"text-sm text-white/80 drop-shadow flex-shrink-0",style:{textShadow:"1px 1px 2px rgba(0, 0, 0, 0.5)"},children:se.lastMessageTime})]},se.id))})]}),a.jsxs("div",{className:"mb-6",children:[a.jsxs("button",{onClick:()=>w(!M),className:"w-full flex items-center justify-between py-4 text-left",children:[a.jsxs("span",{className:"text-xl font-bold text-white drop-shadow-lg",style:{textShadow:"1px 1px 3px rgba(0, 0, 0, 0.5)"},children:["Hidden (",r.length,")"]}),a.jsx("svg",{className:`w-6 h-6 text-white/90 transition-transform ${M?"rotate-180":""}`,fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M19 9l-7 7-7-7"})})]}),M&&a.jsx("div",{className:"space-y-3",children:r.length===0?a.jsx("p",{className:"text-white/80 text-base py-4 drop-shadow",style:{textShadow:"1px 1px 2px rgba(0, 0, 0, 0.5)"},children:"No hidden matches"}):r.map(se=>a.jsxs("button",{onClick:()=>d(se),className:"w-full flex items-center space-x-4 p-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-all border border-white/30",children:[a.jsx("img",{src:se.profilePhotoUrl||"https://via.placeholder.com/80",alt:se.name,className:"w-20 h-20 rounded-full object-cover border-2 border-white/50 shadow-lg"}),a.jsxs("div",{className:"flex-1 text-left min-w-0",children:[a.jsx("h3",{className:"font-bold text-lg text-white drop-shadow-lg mb-1",style:{textShadow:"1px 1px 2px rgba(0, 0, 0, 0.5)"},children:se.name}),a.jsx("p",{className:"text-base text-white/90 truncate drop-shadow",style:{textShadow:"1px 1px 2px rgba(0, 0, 0, 0.5)"},children:se.lastMessage})]}),se.lastMessageTime&&a.jsx("span",{className:"text-sm text-white/80 drop-shadow flex-shrink-0",style:{textShadow:"1px 1px 2px rgba(0, 0, 0, 0.5)"},children:se.lastMessageTime})]},se.id))})]})]})]})},Ou=()=>{const{user:n}=vn(),[e,t]=F.useState(null),[i,s]=F.useState([]),[r,o]=F.useState(!0),[l,c]=F.useState(!1),[d,h]=F.useState("my-league"),[u,p]=F.useState(null);F.useEffect(()=>{n?.id&&g()},[n?.id]),F.useEffect(()=>{n?.id&&_()},[n?.id,e?.currentLeague.id]);const g=async()=>{if(n?.id)try{o(!0);const f=await(await Ve(`/api/rankings/my-stats?userId=${n.id}`)).json();f.success&&f.stats?t(f.stats.league):t({currentLeague:v[0],progressToNext:0,eloFromPreviousLeague:0,eloToNextLeague:v[0].maxElo})}catch(m){console.error("Failed to fetch user league:",m)}finally{o(!1)}},_=async()=>{if(!n?.id)return;const m=e?.currentLeague.id||v[0].id;try{c(!0);const y=await(await Ve(`/api/rankings/league-leaderboard?userId=${n.id}&leagueId=${m}&limit=20`)).json();y.success&&s(y.leaderboard)}catch(f){console.error("Failed to fetch league leaderboard:",f)}finally{c(!1)}},v=[{id:"cooked-1",name:"Cooked 1",tier:1,category:"cooked",minElo:0,maxElo:240,color:"#7F1D1D",description:"Starting your journey"},{id:"cooked-2",name:"Cooked 2",tier:2,category:"cooked",minElo:240,maxElo:480,color:"#B91C1C",description:"Finding your style"},{id:"chopped-1",name:"Chopped 1",tier:1,category:"chopped",minElo:480,maxElo:720,color:"#C2410C",description:"Getting competitive"},{id:"chopped-2",name:"Chopped 2",tier:2,category:"chopped",minElo:720,maxElo:960,color:"#F97316",description:"Proving your worth"},{id:"chuzz-1",name:"Chuzz 1",tier:1,category:"chuzz",minElo:960,maxElo:1200,color:"#A16207",description:"Above average"},{id:"chuzz-2",name:"Chuzz 2",tier:2,category:"chuzz",minElo:1200,maxElo:1440,color:"#EAB308",description:"Making waves"},{id:"mid-1",name:"Mid 1",tier:1,category:"mid",minElo:1440,maxElo:1680,color:"#16A34A",description:"Solid performance"},{id:"mid-2",name:"Mid 2",tier:2,category:"mid",minElo:1680,maxElo:1920,color:"#4ADE80",description:"Approaching excellence"},{id:"huzz-1",name:"Huzz 1",tier:1,category:"huzz",minElo:1920,maxElo:2160,color:"#0EA5E9",description:"Elite territory"},{id:"huzz-2",name:"Huzz 2",tier:2,category:"huzz",minElo:2160,maxElo:2400,color:"#6366F1",description:"Nearing legendary status"},{id:"ultimate-champion",name:"Ultimate Champion",tier:1,category:"ultimate",minElo:2400,maxElo:1/0,color:"#9333EA",description:"The pinnacle of achievement"}];return n?a.jsxs("div",{className:"absolute inset-0 flex flex-col",style:{background:"linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)"},children:[a.jsxs("div",{className:"absolute inset-0 overflow-hidden pointer-events-none",children:[a.jsx("div",{className:"absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-blue-400/20 rounded-full blur-[80px]"}),a.jsx("div",{className:"absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[100px]"})]}),a.jsx("header",{className:"bg-white/5 backdrop-blur-md border-b border-white/10 px-6 py-3 flex-shrink-0 z-10",children:a.jsx("h1",{className:"text-2xl font-black text-white tracking-tighter drop-shadow-md",children:"LEAGUE"})}),a.jsx("div",{className:"px-6 mt-4 z-10",children:a.jsxs("div",{className:"flex bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/20 shadow-xl",children:[a.jsx("button",{type:"button",onClick:()=>h("my-league"),className:`flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${d==="my-league"?"bg-white text-blue-700 shadow-lg":"text-white/60 hover:text-white"}`,children:"Leaderboard"}),a.jsx("button",{type:"button",onClick:()=>h("info"),className:`flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${d==="info"?"bg-white text-blue-700 shadow-lg":"text-white/60 hover:text-white"}`,children:"All Leagues"})]})}),a.jsx("main",{className:"flex-1 overflow-y-auto px-4 py-6 relative z-10",style:{WebkitOverflowScrolling:"touch",touchAction:"pan-y",minHeight:0,paddingBottom:"100px"},children:a.jsxs("div",{className:"max-w-md mx-auto space-y-6",children:[d==="my-league"&&a.jsxs(a.Fragment,{children:[r?a.jsxs("div",{className:"bg-white/10 backdrop-blur-xl rounded-[2rem] p-8 border border-white/20 text-center",children:[a.jsx("div",{className:"w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"}),a.jsx("p",{className:"text-white/60 font-black uppercase tracking-widest text-xs",children:"Identifying League..."})]}):e?a.jsxs("div",{className:"bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-2xl rounded-[2rem] p-6 border border-white/30 shadow-2xl text-center transform transition-transform hover:scale-102",children:[a.jsx("div",{className:"w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-white/40 shadow-xl",style:{backgroundColor:e.currentLeague.color,boxShadow:`0 0 30px ${e.currentLeague.color}66`},children:a.jsx("span",{className:"text-white font-black text-4xl drop-shadow-lg",children:e.currentLeague.tier})}),a.jsx("h3",{className:"text-3xl font-black text-white tracking-tight uppercase mb-1",children:e.currentLeague.name}),a.jsx("div",{className:"inline-block px-4 py-1.5 bg-black/20 backdrop-blur-md rounded-full border border-white/10",children:a.jsx("p",{className:"text-blue-100/80 font-black text-[10px] uppercase tracking-[0.2em]",children:e.currentLeague.id==="ultimate-champion"?`${e.currentLeague.minElo}+ Trophies`:`${e.currentLeague.minElo} - ${e.currentLeague.maxElo} Trophies`})})]}):a.jsx("div",{className:"bg-red-500/10 backdrop-blur-xl rounded-[2rem] p-8 border border-red-500/20 text-center",children:a.jsx("p",{className:"text-red-300 font-black uppercase tracking-widest text-xs",children:"Failed to load league"})}),a.jsxs("div",{className:"bg-white/10 backdrop-blur-xl rounded-[2.5rem] p-6 border border-white/20 shadow-2xl space-y-4",children:[a.jsxs("div",{className:"flex items-center justify-between mb-4 px-2",children:[a.jsx("h3",{className:"text-lg font-black text-white tracking-tight uppercase",children:"Leaderboard"}),a.jsx("div",{className:"text-[10px] font-black text-blue-100/40 uppercase tracking-widest",children:"Top 20 Players"})]}),l?a.jsxs("div",{className:"py-20 text-center",children:[a.jsx("div",{className:"w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"}),a.jsx("p",{className:"text-white/40 font-black uppercase tracking-widest text-[10px]",children:"Loading rankings..."})]}):i.length>0?a.jsx("div",{className:"space-y-3",children:i.map(m=>a.jsxs("button",{type:"button",onClick:()=>p(m),className:`w-full group flex items-center space-x-4 p-4 rounded-[1.5rem] transition-all duration-300 hover:scale-[1.03] ${m.isCurrentUser?"bg-blue-500/30 border-2 border-white/50 shadow-lg":"bg-white/5 border border-white/10 hover:bg-white/10"}`,children:[a.jsx("div",{className:"w-10 h-10 flex-shrink-0 flex items-center justify-center",children:a.jsx("span",{className:`text-xl font-black ${m.rank===1?"text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]":m.rank===2?"text-gray-300 drop-shadow-[0_0_8px_rgba(209,213,219,0.5)]":m.rank===3?"text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]":"text-white/40"}`,children:m.rank===1?"🥇":m.rank===2?"🥈":m.rank===3?"🥉":m.rank})}),a.jsxs("div",{className:"relative flex-shrink-0",children:[a.jsx("img",{src:m.user.profilePhotoUrl||m.photo.url,alt:m.user.name,className:"w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-md group-hover:border-white/40 transition-colors"}),m.isCurrentUser&&a.jsx("div",{className:"absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-blue-900"})]}),a.jsx("div",{className:"flex-1 min-w-0 text-left flex items-center",children:a.jsx("h4",{className:`font-black uppercase tracking-tight text-sm ${m.isCurrentUser?"text-white":"text-white/90"}`,style:{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:m.user.name.split(" ")[0]})}),a.jsxs("div",{className:"text-right flex-shrink-0",children:[a.jsxs("div",{className:"flex items-center justify-end space-x-1",children:[a.jsx("span",{className:"text-white font-black text-lg",children:Math.round(m.stats.trophyScore)}),a.jsx("span",{className:"text-lg",children:"🏆"})]}),a.jsxs("div",{className:`text-[8px] font-black uppercase tracking-widest ${m.stats.winRate>50?"text-green-400":"text-blue-200/40"}`,children:[Math.round(m.stats.winRate),"% Win Rate"]})]})]},m.user.id))}):a.jsx("div",{className:"py-20 text-center bg-white/5 rounded-[2rem] border-2 border-dashed border-white/10",children:a.jsx("p",{className:"text-white/20 font-black uppercase tracking-[0.2em] text-[10px]",children:"No competitors yet"})})]})]}),d==="info"&&a.jsxs("div",{className:"bg-white/10 backdrop-blur-xl rounded-[2.5rem] p-6 border border-white/20 shadow-2xl space-y-4",children:[a.jsx("h3",{className:"text-lg font-black text-white tracking-tight uppercase px-2 mb-2",children:"League Progression"}),a.jsx("div",{className:"space-y-3",children:v.slice().reverse().map(m=>{const f=e?.currentLeague.id===m.id;return a.jsxs("div",{className:`flex items-center space-x-4 p-4 rounded-2xl transition-all ${f?"bg-blue-500/20 border-2 border-white/40 shadow-lg":"bg-white/5 border border-white/5"}`,children:[a.jsx("div",{className:"w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-white/20",style:{backgroundColor:m.color},children:a.jsx("span",{className:"text-white font-black text-xl",children:m.tier})}),a.jsxs("div",{className:"flex-1 min-w-0",children:[a.jsxs("div",{className:"flex items-center space-x-2",children:[a.jsx("h4",{className:"text-white font-black text-sm uppercase tracking-tight",children:m.name}),f&&a.jsx("span",{className:"bg-white text-blue-700 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm",children:"Current"})]}),a.jsx("p",{className:"text-white/40 font-black text-[9px] uppercase tracking-widest mt-1",children:m.id==="ultimate-champion"?`${m.minElo}+ Trophies`:`${m.minElo} - ${m.maxElo} Trophies`})]})]},m.id)})})]})]})}),u&&a.jsx("div",{className:"fixed inset-0 bg-black/95 backdrop-blur-2xl z-50 flex items-center justify-center p-4",onClick:m=>{m.target===m.currentTarget&&p(null)},children:a.jsxs("div",{className:"w-full max-w-sm bg-gray-900 rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative",children:[a.jsx("button",{type:"button",onClick:()=>p(null),className:"absolute top-6 right-6 text-white/50 hover:text-white transition-transform hover:scale-125",children:a.jsx("svg",{className:"w-8 h-8",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})}),a.jsxs("div",{className:"text-center space-y-6",children:[a.jsxs("div",{className:"relative inline-block",children:[a.jsx("div",{className:"absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-3xl blur opacity-75"}),a.jsx("img",{src:u.user.profilePhotoUrl||u.photo.url,alt:u.user.name,className:"relative w-48 h-48 rounded-3xl object-cover border-4 border-white shadow-2xl"})]}),a.jsxs("div",{children:[a.jsx("h4",{className:"text-3xl font-black text-white tracking-tight uppercase mb-1",children:u.user.name.split(" ")[0]}),a.jsxs("div",{className:"flex items-center justify-center space-x-2 text-white/60 font-black text-xs uppercase tracking-widest",children:[a.jsxs("span",{children:[u.user.age," YRS"]}),a.jsx("span",{children:"•"}),a.jsx("span",{children:u.user.location||"UC BERKELEY"})]})]}),a.jsxs("div",{className:"bg-black/40 backdrop-blur-xl rounded-2xl p-4 border border-white/10 flex items-center justify-between",children:[a.jsxs("div",{className:"text-left",children:[a.jsx("div",{className:"text-[10px] font-black text-blue-200/40 uppercase tracking-widest mb-1",children:"LEAGUE RANK"}),a.jsxs("div",{className:"text-2xl font-black text-white tracking-tighter",children:["#",u.rank]})]}),a.jsxs("div",{className:"text-right",children:[a.jsx("div",{className:"text-[10px] font-black text-blue-200/40 uppercase tracking-widest mb-1",children:"CURRENT LEAGUE"}),a.jsx("div",{className:"text-sm font-black text-white uppercase tracking-tight",children:e?.currentLeague.name})]})]}),a.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[a.jsxs("div",{className:"bg-white/5 rounded-2xl p-4 border border-white/10",children:[a.jsx("div",{className:"text-[10px] font-black text-blue-200/40 uppercase tracking-widest mb-1",children:"TROPHIES"}),a.jsxs("div",{className:"text-2xl font-black text-blue-400 tracking-tighter flex items-center justify-center space-x-1",children:[a.jsx("span",{children:Math.round(u.stats.trophyScore)}),a.jsx("span",{className:"text-xl",children:"🏆"})]})]}),a.jsxs("div",{className:"bg-white/5 rounded-2xl p-4 border border-white/10",children:[a.jsx("div",{className:"text-[10px] font-black text-blue-200/40 uppercase tracking-widest mb-1",children:"WIN RATE"}),a.jsxs("div",{className:"text-2xl font-black text-green-400 tracking-tighter",children:[Math.round(u.stats.winRate),"%"]})]})]}),a.jsxs("div",{className:"bg-black/20 rounded-2xl p-4 border border-white/5",children:[a.jsx("div",{className:"text-[10px] font-black text-blue-200/40 uppercase tracking-widest mb-1",children:"TOTAL BATTLES"}),a.jsx("div",{className:"text-xl font-black text-white",children:u.stats.totalComparisons})]})]})]})})]}):a.jsx("div",{className:"absolute inset-0 flex items-center justify-center",style:{background:"#4A90E2"},children:a.jsxs("div",{className:"text-white text-center",children:[a.jsx("div",{className:"w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"}),a.jsx("p",{className:"drop-shadow-lg",style:{textShadow:"1px 1px 2px rgba(0, 0, 0, 0.5)"},children:"Loading..."})]})})},Bu=({inviteToken:n,onComplete:e})=>{const{user:t}=vn(),[i,s]=F.useState("loading"),[r,o]=F.useState(null),[l,c]=F.useState(null);return F.useEffect(()=>{(async()=>{console.log("🎫 InvitePage: Received invite token:",n),console.log("🎫 InvitePage: Current user:",t?t.id:"NOT LOGGED IN"),s("validating");try{console.log("🎫 InvitePage: Validating token with API...");const u=await(await Ve(`/api/invite/${n}`)).json();if(console.log("🎫 InvitePage: API response:",u),!u.success||!u.valid){console.log("🎫 InvitePage: Token validation FAILED:",u.error),localStorage.removeItem("inviteToken"),e();return}if(console.log("🎫 InvitePage: Token is VALID, creator:",u.creator?.name),o(u.creator?.name||"your friend"),!t){console.log("🎫 InvitePage: User not logged in, storing token in localStorage..."),localStorage.setItem("inviteToken",n),console.log("🎫 InvitePage: Token stored! Verifying:",localStorage.getItem("inviteToken")),e();return}const g=await(await Ve("/api/friends/accept-invite-token",{method:"POST",body:JSON.stringify({userId:t.id,inviteToken:n})})).json();g.success?(s("success"),setTimeout(()=>{window.history.replaceState({},"","/"),e()},2e3)):(c(g.error||"Failed to add friend"),s("error"))}catch(h){console.error("Failed to process invite:",h),c("Failed to connect. Please try again."),s("error")}})()},[t,n,e]),!t&&i==="loading"?a.jsx("div",{className:"min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex items-center justify-center",children:a.jsxs("div",{className:"text-white text-center",children:[a.jsx("div",{className:"w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"}),a.jsx("p",{className:"font-bold",children:"Processing invite..."})]})}):a.jsx("div",{className:"min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex items-center justify-center p-6",children:a.jsxs("div",{className:"max-w-sm w-full bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center",children:[(i==="loading"||i==="validating")&&a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-6"}),a.jsx("h2",{className:"text-xl font-black text-white uppercase tracking-wide mb-2",children:i==="validating"?"Validating Invite":"Adding Friend"}),a.jsx("p",{className:"text-white/60 text-sm",children:"Please wait..."})]}),i==="success"&&a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg",children:a.jsx("svg",{className:"w-10 h-10 text-white",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:3,d:"M5 13l4 4L19 7"})})}),a.jsx("h2",{className:"text-2xl font-black text-white uppercase tracking-wide mb-2",children:"Friend Added!"}),a.jsxs("p",{className:"text-white/80 text-sm mb-4",children:["You are now friends with ",a.jsx("span",{className:"font-bold",children:r})]}),a.jsx("p",{className:"text-white/40 text-xs",children:"Redirecting..."})]}),i==="error"&&a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg",children:a.jsx("svg",{className:"w-10 h-10 text-white",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:3,d:"M6 18L18 6M6 6l12 12"})})}),a.jsx("h2",{className:"text-xl font-black text-white uppercase tracking-wide mb-2",children:"Oops!"}),a.jsx("p",{className:"text-white/80 text-sm mb-6",children:l}),a.jsx("button",{type:"button",onClick:()=>{window.history.replaceState({},"","/"),e()},className:"bg-white text-blue-700 font-black py-3 px-8 rounded-xl uppercase tracking-wide shadow-lg hover:bg-blue-50 transition-colors",children:"Continue"})]})]})})},ju=({className:n="",size:e=32})=>a.jsxs("svg",{width:e,height:e,viewBox:"0 0 64 64",fill:"none",xmlns:"http://www.w3.org/2000/svg",className:n,children:[a.jsxs("g",{transform:"rotate(-45 32 32)",children:[a.jsx("path",{d:"M32 8 L36 12 L36 38 L32 42 L28 38 L28 12 Z",fill:"url(#bladeSilver)",stroke:"#5a6988",strokeWidth:"1"}),a.jsx("path",{d:"M30 12 L30 36 L32 38 L32 12 Z",fill:"rgba(255,255,255,0.4)"}),a.jsx("rect",{x:"24",y:"40",width:"16",height:"4",rx:"1",fill:"url(#goldGradient)",stroke:"#8B6914",strokeWidth:"0.5"}),a.jsx("rect",{x:"29",y:"44",width:"6",height:"10",rx:"1",fill:"url(#handleBrown)",stroke:"#4a3520",strokeWidth:"0.5"}),a.jsx("circle",{cx:"32",cy:"56",r:"3",fill:"url(#goldGradient)",stroke:"#8B6914",strokeWidth:"0.5"})]}),a.jsxs("g",{transform:"rotate(45 32 32)",children:[a.jsx("path",{d:"M32 8 L36 12 L36 38 L32 42 L28 38 L28 12 Z",fill:"url(#bladeSilver)",stroke:"#5a6988",strokeWidth:"1"}),a.jsx("path",{d:"M30 12 L30 36 L32 38 L32 12 Z",fill:"rgba(255,255,255,0.4)"}),a.jsx("rect",{x:"24",y:"40",width:"16",height:"4",rx:"1",fill:"url(#goldGradient)",stroke:"#8B6914",strokeWidth:"0.5"}),a.jsx("rect",{x:"29",y:"44",width:"6",height:"10",rx:"1",fill:"url(#handleBrown)",stroke:"#4a3520",strokeWidth:"0.5"}),a.jsx("circle",{cx:"32",cy:"56",r:"3",fill:"url(#goldGradient)",stroke:"#8B6914",strokeWidth:"0.5"})]}),a.jsxs("defs",{children:[a.jsxs("linearGradient",{id:"bladeSilver",x1:"0%",y1:"0%",x2:"100%",y2:"0%",children:[a.jsx("stop",{offset:"0%",stopColor:"#a8b4c4"}),a.jsx("stop",{offset:"30%",stopColor:"#e8eef5"}),a.jsx("stop",{offset:"50%",stopColor:"#ffffff"}),a.jsx("stop",{offset:"70%",stopColor:"#e8eef5"}),a.jsx("stop",{offset:"100%",stopColor:"#a8b4c4"})]}),a.jsxs("linearGradient",{id:"goldGradient",x1:"0%",y1:"0%",x2:"0%",y2:"100%",children:[a.jsx("stop",{offset:"0%",stopColor:"#FFD700"}),a.jsx("stop",{offset:"50%",stopColor:"#FFA500"}),a.jsx("stop",{offset:"100%",stopColor:"#CD853F"})]}),a.jsxs("linearGradient",{id:"handleBrown",x1:"0%",y1:"0%",x2:"100%",y2:"0%",children:[a.jsx("stop",{offset:"0%",stopColor:"#5c3d2e"}),a.jsx("stop",{offset:"50%",stopColor:"#8B4513"}),a.jsx("stop",{offset:"100%",stopColor:"#5c3d2e"})]})]})]}),zu=({className:n="",size:e=32})=>a.jsxs("svg",{width:e,height:e,viewBox:"0 0 64 64",fill:"none",xmlns:"http://www.w3.org/2000/svg",className:n,children:[a.jsx("path",{d:"M8 30 L8 52 Q8 56 12 56 L52 56 Q56 56 56 52 L56 30 Z",fill:"url(#chestWood)",stroke:"#5c3d2e",strokeWidth:"1.5"}),a.jsx("path",{d:"M6 30 Q6 18 32 14 Q58 18 58 30 L58 32 L6 32 Z",fill:"url(#chestLid)",stroke:"#5c3d2e",strokeWidth:"1.5"}),a.jsx("path",{d:"M12 34 L12 52",stroke:"#4a3520",strokeWidth:"0.5",opacity:"0.5"}),a.jsx("path",{d:"M22 34 L22 52",stroke:"#4a3520",strokeWidth:"0.5",opacity:"0.5"}),a.jsx("path",{d:"M42 34 L42 52",stroke:"#4a3520",strokeWidth:"0.5",opacity:"0.5"}),a.jsx("path",{d:"M52 34 L52 52",stroke:"#4a3520",strokeWidth:"0.5",opacity:"0.5"}),a.jsx("rect",{x:"6",y:"28",width:"52",height:"6",fill:"url(#metalBand)",stroke:"#5a6988",strokeWidth:"1"}),a.jsx("rect",{x:"10",y:"34",width:"4",height:"20",rx:"1",fill:"url(#metalBand)",stroke:"#5a6988",strokeWidth:"0.5"}),a.jsx("rect",{x:"50",y:"34",width:"4",height:"20",rx:"1",fill:"url(#metalBand)",stroke:"#5a6988",strokeWidth:"0.5"}),a.jsx("rect",{x:"26",y:"36",width:"12",height:"14",rx:"2",fill:"url(#goldGradient2)",stroke:"#8B6914",strokeWidth:"1"}),a.jsx("circle",{cx:"32",cy:"43",r:"3",fill:"#5c3d2e",stroke:"#3d2817",strokeWidth:"0.5"}),a.jsx("circle",{cx:"20",cy:"24",r:"3",fill:"#e74c3c",stroke:"#c0392b",strokeWidth:"0.5"}),a.jsx("circle",{cx:"32",cy:"20",r:"4",fill:"#3498db",stroke:"#2980b9",strokeWidth:"0.5"}),a.jsx("circle",{cx:"44",cy:"24",r:"3",fill:"#2ecc71",stroke:"#27ae60",strokeWidth:"0.5"}),a.jsxs("defs",{children:[a.jsxs("linearGradient",{id:"chestWood",x1:"0%",y1:"0%",x2:"0%",y2:"100%",children:[a.jsx("stop",{offset:"0%",stopColor:"#A0522D"}),a.jsx("stop",{offset:"50%",stopColor:"#8B4513"}),a.jsx("stop",{offset:"100%",stopColor:"#654321"})]}),a.jsxs("linearGradient",{id:"chestLid",x1:"0%",y1:"0%",x2:"0%",y2:"100%",children:[a.jsx("stop",{offset:"0%",stopColor:"#CD853F"}),a.jsx("stop",{offset:"100%",stopColor:"#8B4513"})]}),a.jsxs("linearGradient",{id:"metalBand",x1:"0%",y1:"0%",x2:"0%",y2:"100%",children:[a.jsx("stop",{offset:"0%",stopColor:"#c0c0c0"}),a.jsx("stop",{offset:"50%",stopColor:"#808080"}),a.jsx("stop",{offset:"100%",stopColor:"#606060"})]}),a.jsxs("linearGradient",{id:"goldGradient2",x1:"0%",y1:"0%",x2:"0%",y2:"100%",children:[a.jsx("stop",{offset:"0%",stopColor:"#FFD700"}),a.jsx("stop",{offset:"50%",stopColor:"#DAA520"}),a.jsx("stop",{offset:"100%",stopColor:"#B8860B"})]})]})]}),Vu=({className:n="",size:e=32})=>a.jsxs("svg",{width:e,height:e,viewBox:"0 0 64 64",fill:"none",xmlns:"http://www.w3.org/2000/svg",className:n,children:[a.jsxs("g",{transform:"translate(-8, 0) rotate(-30 32 40)",children:[a.jsx("path",{d:"M32 4 L35 7 L35 28 L32 31 L29 28 L29 7 Z",fill:"url(#bladeSilver3)",stroke:"#5a6988",strokeWidth:"0.5"}),a.jsx("rect",{x:"27",y:"30",width:"10",height:"3",rx:"1",fill:"url(#goldGradient3)"}),a.jsx("rect",{x:"30",y:"33",width:"4",height:"8",rx:"1",fill:"#8B4513"})]}),a.jsxs("g",{transform:"translate(8, 0) rotate(30 32 40)",children:[a.jsx("path",{d:"M32 4 L35 7 L35 28 L32 31 L29 28 L29 7 Z",fill:"url(#bladeSilver3)",stroke:"#5a6988",strokeWidth:"0.5"}),a.jsx("rect",{x:"27",y:"30",width:"10",height:"3",rx:"1",fill:"url(#goldGradient3)"}),a.jsx("rect",{x:"30",y:"33",width:"4",height:"8",rx:"1",fill:"#8B4513"})]}),a.jsx("path",{d:"M32 8 L52 16 L52 34 Q52 52 32 58 Q12 52 12 34 L12 16 Z",fill:"url(#shieldBlue)",stroke:"#1a3a5c",strokeWidth:"2"}),a.jsx("path",{d:"M32 12 L48 19 L48 33 Q48 48 32 54 Q16 48 16 33 L16 19 Z",fill:"none",stroke:"url(#goldGradient3)",strokeWidth:"2"}),a.jsxs("g",{transform:"translate(32 34) scale(0.4)",children:[a.jsx("path",{d:"M0 -30 L4 -26 L4 0 L0 4 L-4 0 L-4 -26 Z",fill:"#e8eef5",stroke:"#5a6988",strokeWidth:"1",transform:"rotate(-45)"}),a.jsx("path",{d:"M0 -30 L4 -26 L4 0 L0 4 L-4 0 L-4 -26 Z",fill:"#e8eef5",stroke:"#5a6988",strokeWidth:"1",transform:"rotate(45)"})]}),a.jsx("path",{d:"M18 20 Q24 24 24 32 Q24 40 22 44",fill:"none",stroke:"rgba(255,255,255,0.3)",strokeWidth:"3",strokeLinecap:"round"}),a.jsxs("defs",{children:[a.jsxs("linearGradient",{id:"bladeSilver3",x1:"0%",y1:"0%",x2:"100%",y2:"0%",children:[a.jsx("stop",{offset:"0%",stopColor:"#a8b4c4"}),a.jsx("stop",{offset:"50%",stopColor:"#e8eef5"}),a.jsx("stop",{offset:"100%",stopColor:"#a8b4c4"})]}),a.jsxs("linearGradient",{id:"goldGradient3",x1:"0%",y1:"0%",x2:"0%",y2:"100%",children:[a.jsx("stop",{offset:"0%",stopColor:"#FFD700"}),a.jsx("stop",{offset:"50%",stopColor:"#FFA500"}),a.jsx("stop",{offset:"100%",stopColor:"#CD853F"})]}),a.jsxs("linearGradient",{id:"shieldBlue",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[a.jsx("stop",{offset:"0%",stopColor:"#4a90d9"}),a.jsx("stop",{offset:"50%",stopColor:"#2563eb"}),a.jsx("stop",{offset:"100%",stopColor:"#1e40af"})]})]})]}),Gu=({className:n="",size:e=32})=>a.jsxs("svg",{width:e,height:e,viewBox:"0 0 64 64",fill:"none",xmlns:"http://www.w3.org/2000/svg",className:n,children:[a.jsx("circle",{cx:"32",cy:"32",r:"28",fill:"url(#profileBg)",stroke:"#1a3a5c",strokeWidth:"2"}),a.jsx("circle",{cx:"32",cy:"24",r:"10",fill:"url(#skinTone)",stroke:"#c9a87c",strokeWidth:"1"}),a.jsx("path",{d:"M16 54 Q16 40 32 38 Q48 40 48 54",fill:"url(#shirtColor)",stroke:"#1a5f2a",strokeWidth:"1"}),a.jsx("path",{d:"M22 16 L24 10 L28 14 L32 8 L36 14 L40 10 L42 16 Z",fill:"url(#crownGold)",stroke:"#8B6914",strokeWidth:"0.5"}),a.jsx("circle",{cx:"32",cy:"12",r:"2",fill:"#e74c3c"}),a.jsx("circle",{cx:"26",cy:"14",r:"1.5",fill:"#3498db"}),a.jsx("circle",{cx:"38",cy:"14",r:"1.5",fill:"#2ecc71"}),a.jsxs("defs",{children:[a.jsxs("linearGradient",{id:"profileBg",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[a.jsx("stop",{offset:"0%",stopColor:"#667eea"}),a.jsx("stop",{offset:"100%",stopColor:"#764ba2"})]}),a.jsxs("linearGradient",{id:"skinTone",x1:"0%",y1:"0%",x2:"0%",y2:"100%",children:[a.jsx("stop",{offset:"0%",stopColor:"#f5d0a9"}),a.jsx("stop",{offset:"100%",stopColor:"#e5b896"})]}),a.jsxs("linearGradient",{id:"shirtColor",x1:"0%",y1:"0%",x2:"0%",y2:"100%",children:[a.jsx("stop",{offset:"0%",stopColor:"#27ae60"}),a.jsx("stop",{offset:"100%",stopColor:"#1e8449"})]}),a.jsxs("linearGradient",{id:"crownGold",x1:"0%",y1:"100%",x2:"0%",y2:"0%",children:[a.jsx("stop",{offset:"0%",stopColor:"#CD853F"}),a.jsx("stop",{offset:"50%",stopColor:"#FFD700"}),a.jsx("stop",{offset:"100%",stopColor:"#FFF8DC"})]})]})]}),Hu=[{id:"league",icon:Vu,label:"League"},{id:"play",icon:ju,label:"Battle"},{id:"matched",icon:zu,label:"Matches"},{id:"profile",icon:Gu,label:"Profile"}],Wu=()=>{const{navigationState:n,updateNavigationTab:e}=vn(),{currentTab:t}=n;return a.jsx("nav",{className:"fixed bottom-0 left-0 right-0 safe-area-inset z-50",children:a.jsxs("div",{className:"bg-gradient-to-t from-[#1a2744] to-[#243b5c] border-t-2 border-[#3d5a80] shadow-2xl",children:[a.jsx("div",{className:"absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#4a90d9] to-transparent opacity-50"}),a.jsx("div",{className:"flex items-center justify-around px-4 h-16",children:Hu.map((i,s)=>{const r=t===i.id,o=i.icon;return a.jsxs(Zi.Fragment,{children:[s>0&&a.jsx("div",{className:"flex items-center opacity-40",children:a.jsx("svg",{width:"6",height:"10",viewBox:"0 0 6 10",fill:"none",children:a.jsx("path",{d:"M1 1 L5 5 L1 9",stroke:"#4a90d9",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})}),a.jsxs("button",{onClick:()=>e(i.id),className:"flex flex-col items-center justify-center relative w-16 h-14",children:[a.jsxs("div",{className:`relative flex items-center justify-center transition-all duration-300 ease-out ${r?"-translate-y-1":""}`,children:[r&&a.jsx("div",{className:"absolute inset-0 bg-[#4a90d9]/30 rounded-full blur-md scale-125"}),a.jsx(o,{size:r?32:28,className:`relative z-10 transition-all duration-300 ${r?"drop-shadow-lg":"drop-shadow-sm opacity-60"}`})]}),r&&a.jsx("span",{className:"text-[8px] font-bold uppercase tracking-wider text-white mt-0.5 drop-shadow-md",children:i.label})]})]},i.id)})}),a.jsx("div",{className:"h-safe-area-inset-bottom bg-[#1a2744]"})]})})};function Xu(n,e,t){return Math.max(e,Math.min(n,t))}const Rt={toVector(n,e){return n===void 0&&(n=e),Array.isArray(n)?n:[n,n]},add(n,e){return[n[0]+e[0],n[1]+e[1]]},sub(n,e){return[n[0]-e[0],n[1]-e[1]]},addTo(n,e){n[0]+=e[0],n[1]+=e[1]},subTo(n,e){n[0]-=e[0],n[1]-=e[1]}};function Oo(n,e,t){return e===0||Math.abs(e)===1/0?Math.pow(n,t*5):n*e*t/(e+t*n)}function Bo(n,e,t,i=.15){return i===0?Xu(n,e,t):n<e?-Oo(e-n,t-e,i)+e:n>t?+Oo(n-t,t-e,i)+t:n}function qu(n,[e,t],[i,s]){const[[r,o],[l,c]]=n;return[Bo(e,r,o,i),Bo(t,l,c,s)]}function $u(n,e){if(typeof n!="object"||n===null)return n;var t=n[Symbol.toPrimitive];if(t!==void 0){var i=t.call(n,e);if(typeof i!="object")return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(n)}function Yu(n){var e=$u(n,"string");return typeof e=="symbol"?e:String(e)}function Ot(n,e,t){return e=Yu(e),e in n?Object.defineProperty(n,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[e]=t,n}function jo(n,e){var t=Object.keys(n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(n);e&&(i=i.filter(function(s){return Object.getOwnPropertyDescriptor(n,s).enumerable})),t.push.apply(t,i)}return t}function pt(n){for(var e=1;e<arguments.length;e++){var t=arguments[e]!=null?arguments[e]:{};e%2?jo(Object(t),!0).forEach(function(i){Ot(n,i,t[i])}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(t)):jo(Object(t)).forEach(function(i){Object.defineProperty(n,i,Object.getOwnPropertyDescriptor(t,i))})}return n}const hc={pointer:{start:"down",change:"move",end:"up"},mouse:{start:"down",change:"move",end:"up"},touch:{start:"start",change:"move",end:"end"},gesture:{start:"start",change:"change",end:"end"}};function zo(n){return n?n[0].toUpperCase()+n.slice(1):""}const Ku=["enter","leave"];function Zu(n=!1,e){return n&&!Ku.includes(e)}function Ju(n,e="",t=!1){const i=hc[n],s=i&&i[e]||e;return"on"+zo(n)+zo(s)+(Zu(t,s)?"Capture":"")}const Qu=["gotpointercapture","lostpointercapture"];function eh(n){let e=n.substring(2).toLowerCase();const t=!!~e.indexOf("passive");t&&(e=e.replace("passive",""));const i=Qu.includes(e)?"capturecapture":"capture",s=!!~e.indexOf(i);return s&&(e=e.replace("capture","")),{device:e,capture:s,passive:t}}function th(n,e=""){const t=hc[n],i=t&&t[e]||e;return n+i}function tr(n){return"touches"in n}function fc(n){return tr(n)?"touch":"pointerType"in n?n.pointerType:"mouse"}function nh(n){return Array.from(n.touches).filter(e=>{var t,i;return e.target===n.currentTarget||((t=n.currentTarget)===null||t===void 0||(i=t.contains)===null||i===void 0?void 0:i.call(t,e.target))})}function ih(n){return n.type==="touchend"||n.type==="touchcancel"?n.changedTouches:n.targetTouches}function pc(n){return tr(n)?ih(n)[0]:n}function sh(n){return nh(n).map(e=>e.identifier)}function mr(n){const e=pc(n);return tr(n)?e.identifier:e.pointerId}function Vo(n){const e=pc(n);return[e.clientX,e.clientY]}function rh(n){const e={};if("buttons"in n&&(e.buttons=n.buttons),"shiftKey"in n){const{shiftKey:t,altKey:i,metaKey:s,ctrlKey:r}=n;Object.assign(e,{shiftKey:t,altKey:i,metaKey:s,ctrlKey:r})}return e}function $s(n,...e){return typeof n=="function"?n(...e):n}function ah(){}function oh(...n){return n.length===0?ah:n.length===1?n[0]:function(){let e;for(const t of n)e=t.apply(this,arguments)||e;return e}}function Go(n,e){return Object.assign({},e,n||{})}const lh=32;class ch{constructor(e,t,i){this.ctrl=e,this.args=t,this.key=i,this.state||(this.state={},this.computeValues([0,0]),this.computeInitial(),this.init&&this.init(),this.reset())}get state(){return this.ctrl.state[this.key]}set state(e){this.ctrl.state[this.key]=e}get shared(){return this.ctrl.state.shared}get eventStore(){return this.ctrl.gestureEventStores[this.key]}get timeoutStore(){return this.ctrl.gestureTimeoutStores[this.key]}get config(){return this.ctrl.config[this.key]}get sharedConfig(){return this.ctrl.config.shared}get handler(){return this.ctrl.handlers[this.key]}reset(){const{state:e,shared:t,ingKey:i,args:s}=this;t[i]=e._active=e.active=e._blocked=e._force=!1,e._step=[!1,!1],e.intentional=!1,e._movement=[0,0],e._distance=[0,0],e._direction=[0,0],e._delta=[0,0],e._bounds=[[-1/0,1/0],[-1/0,1/0]],e.args=s,e.axis=void 0,e.memo=void 0,e.elapsedTime=e.timeDelta=0,e.direction=[0,0],e.distance=[0,0],e.overflow=[0,0],e._movementBound=[!1,!1],e.velocity=[0,0],e.movement=[0,0],e.delta=[0,0],e.timeStamp=0}start(e){const t=this.state,i=this.config;t._active||(this.reset(),this.computeInitial(),t._active=!0,t.target=e.target,t.currentTarget=e.currentTarget,t.lastOffset=i.from?$s(i.from,t):t.offset,t.offset=t.lastOffset,t.startTime=t.timeStamp=e.timeStamp)}computeValues(e){const t=this.state;t._values=e,t.values=this.config.transform(e)}computeInitial(){const e=this.state;e._initial=e._values,e.initial=e.values}compute(e){const{state:t,config:i,shared:s}=this;t.args=this.args;let r=0;if(e&&(t.event=e,i.preventDefault&&e.cancelable&&t.event.preventDefault(),t.type=e.type,s.touches=this.ctrl.pointerIds.size||this.ctrl.touchIds.size,s.locked=!!document.pointerLockElement,Object.assign(s,rh(e)),s.down=s.pressed=s.buttons%2===1||s.touches>0,r=e.timeStamp-t.timeStamp,t.timeStamp=e.timeStamp,t.elapsedTime=t.timeStamp-t.startTime),t._active){const R=t._delta.map(Math.abs);Rt.addTo(t._distance,R)}this.axisIntent&&this.axisIntent(e);const[o,l]=t._movement,[c,d]=i.threshold,{_step:h,values:u}=t;if(i.hasCustomTransform?(h[0]===!1&&(h[0]=Math.abs(o)>=c&&u[0]),h[1]===!1&&(h[1]=Math.abs(l)>=d&&u[1])):(h[0]===!1&&(h[0]=Math.abs(o)>=c&&Math.sign(o)*c),h[1]===!1&&(h[1]=Math.abs(l)>=d&&Math.sign(l)*d)),t.intentional=h[0]!==!1||h[1]!==!1,!t.intentional)return;const p=[0,0];if(i.hasCustomTransform){const[R,A]=u;p[0]=h[0]!==!1?R-h[0]:0,p[1]=h[1]!==!1?A-h[1]:0}else p[0]=h[0]!==!1?o-h[0]:0,p[1]=h[1]!==!1?l-h[1]:0;this.restrictToAxis&&!t._blocked&&this.restrictToAxis(p);const g=t.offset,_=t._active&&!t._blocked||t.active;_&&(t.first=t._active&&!t.active,t.last=!t._active&&t.active,t.active=s[this.ingKey]=t._active,e&&(t.first&&("bounds"in i&&(t._bounds=$s(i.bounds,t)),this.setup&&this.setup()),t.movement=p,this.computeOffset()));const[v,m]=t.offset,[[f,y],[M,w]]=t._bounds;t.overflow=[v<f?-1:v>y?1:0,m<M?-1:m>w?1:0],t._movementBound[0]=t.overflow[0]?t._movementBound[0]===!1?t._movement[0]:t._movementBound[0]:!1,t._movementBound[1]=t.overflow[1]?t._movementBound[1]===!1?t._movement[1]:t._movementBound[1]:!1;const T=t._active?i.rubberband||[0,0]:[0,0];if(t.offset=qu(t._bounds,t.offset,T),t.delta=Rt.sub(t.offset,g),this.computeMovement(),_&&(!t.last||r>lh)){t.delta=Rt.sub(t.offset,g);const R=t.delta.map(Math.abs);Rt.addTo(t.distance,R),t.direction=t.delta.map(Math.sign),t._direction=t._delta.map(Math.sign),!t.first&&r>0&&(t.velocity=[R[0]/r,R[1]/r],t.timeDelta=r)}}emit(){const e=this.state,t=this.shared,i=this.config;if(e._active||this.clean(),(e._blocked||!e.intentional)&&!e._force&&!i.triggerAllEvents)return;const s=this.handler(pt(pt(pt({},t),e),{},{[this.aliasKey]:e.values}));s!==void 0&&(e.memo=s)}clean(){this.eventStore.clean(),this.timeoutStore.clean()}}function dh([n,e],t){const i=Math.abs(n),s=Math.abs(e);if(i>s&&i>t)return"x";if(s>i&&s>t)return"y"}class uh extends ch{constructor(...e){super(...e),Ot(this,"aliasKey","xy")}reset(){super.reset(),this.state.axis=void 0}init(){this.state.offset=[0,0],this.state.lastOffset=[0,0]}computeOffset(){this.state.offset=Rt.add(this.state.lastOffset,this.state.movement)}computeMovement(){this.state.movement=Rt.sub(this.state.offset,this.state.lastOffset)}axisIntent(e){const t=this.state,i=this.config;if(!t.axis&&e){const s=typeof i.axisThreshold=="object"?i.axisThreshold[fc(e)]:i.axisThreshold;t.axis=dh(t._movement,s)}t._blocked=(i.lockDirection||!!i.axis)&&!t.axis||!!i.axis&&i.axis!==t.axis}restrictToAxis(e){if(this.config.axis||this.config.lockDirection)switch(this.state.axis){case"x":e[1]=0;break;case"y":e[0]=0;break}}}const hh=n=>n,Ho=.15,mc={enabled(n=!0){return n},eventOptions(n,e,t){return pt(pt({},t.shared.eventOptions),n)},preventDefault(n=!1){return n},triggerAllEvents(n=!1){return n},rubberband(n=0){switch(n){case!0:return[Ho,Ho];case!1:return[0,0];default:return Rt.toVector(n)}},from(n){if(typeof n=="function")return n;if(n!=null)return Rt.toVector(n)},transform(n,e,t){const i=n||t.shared.transform;return this.hasCustomTransform=!!i,i||hh},threshold(n){return Rt.toVector(n,0)}},fh=0,ns=pt(pt({},mc),{},{axis(n,e,{axis:t}){if(this.lockDirection=t==="lock",!this.lockDirection)return t},axisThreshold(n=fh){return n},bounds(n={}){if(typeof n=="function")return r=>ns.bounds(n(r));if("current"in n)return()=>n.current;if(typeof HTMLElement=="function"&&n instanceof HTMLElement)return n;const{left:e=-1/0,right:t=1/0,top:i=-1/0,bottom:s=1/0}=n;return[[e,t],[i,s]]}}),Wo={ArrowRight:(n,e=1)=>[n*e,0],ArrowLeft:(n,e=1)=>[-1*n*e,0],ArrowUp:(n,e=1)=>[0,-1*n*e],ArrowDown:(n,e=1)=>[0,n*e]};class ph extends uh{constructor(...e){super(...e),Ot(this,"ingKey","dragging")}reset(){super.reset();const e=this.state;e._pointerId=void 0,e._pointerActive=!1,e._keyboardActive=!1,e._preventScroll=!1,e._delayed=!1,e.swipe=[0,0],e.tap=!1,e.canceled=!1,e.cancel=this.cancel.bind(this)}setup(){const e=this.state;if(e._bounds instanceof HTMLElement){const t=e._bounds.getBoundingClientRect(),i=e.currentTarget.getBoundingClientRect(),s={left:t.left-i.left+e.offset[0],right:t.right-i.right+e.offset[0],top:t.top-i.top+e.offset[1],bottom:t.bottom-i.bottom+e.offset[1]};e._bounds=ns.bounds(s)}}cancel(){const e=this.state;e.canceled||(e.canceled=!0,e._active=!1,setTimeout(()=>{this.compute(),this.emit()},0))}setActive(){this.state._active=this.state._pointerActive||this.state._keyboardActive}clean(){this.pointerClean(),this.state._pointerActive=!1,this.state._keyboardActive=!1,super.clean()}pointerDown(e){const t=this.config,i=this.state;if(e.buttons!=null&&(Array.isArray(t.pointerButtons)?!t.pointerButtons.includes(e.buttons):t.pointerButtons!==-1&&t.pointerButtons!==e.buttons))return;const s=this.ctrl.setEventIds(e);t.pointerCapture&&e.target.setPointerCapture(e.pointerId),!(s&&s.size>1&&i._pointerActive)&&(this.start(e),this.setupPointer(e),i._pointerId=mr(e),i._pointerActive=!0,this.computeValues(Vo(e)),this.computeInitial(),t.preventScrollAxis&&fc(e)!=="mouse"?(i._active=!1,this.setupScrollPrevention(e)):t.delay>0?(this.setupDelayTrigger(e),t.triggerAllEvents&&(this.compute(e),this.emit())):this.startPointerDrag(e))}startPointerDrag(e){const t=this.state;t._active=!0,t._preventScroll=!0,t._delayed=!1,this.compute(e),this.emit()}pointerMove(e){const t=this.state,i=this.config;if(!t._pointerActive)return;const s=mr(e);if(t._pointerId!==void 0&&s!==t._pointerId)return;const r=Vo(e);if(document.pointerLockElement===e.target?t._delta=[e.movementX,e.movementY]:(t._delta=Rt.sub(r,t._values),this.computeValues(r)),Rt.addTo(t._movement,t._delta),this.compute(e),t._delayed&&t.intentional){this.timeoutStore.remove("dragDelay"),t.active=!1,this.startPointerDrag(e);return}if(i.preventScrollAxis&&!t._preventScroll)if(t.axis)if(t.axis===i.preventScrollAxis||i.preventScrollAxis==="xy"){t._active=!1,this.clean();return}else{this.timeoutStore.remove("startPointerDrag"),this.startPointerDrag(e);return}else return;this.emit()}pointerUp(e){this.ctrl.setEventIds(e);try{this.config.pointerCapture&&e.target.hasPointerCapture(e.pointerId)&&e.target.releasePointerCapture(e.pointerId)}catch{}const t=this.state,i=this.config;if(!t._active||!t._pointerActive)return;const s=mr(e);if(t._pointerId!==void 0&&s!==t._pointerId)return;this.state._pointerActive=!1,this.setActive(),this.compute(e);const[r,o]=t._distance;if(t.tap=r<=i.tapsThreshold&&o<=i.tapsThreshold,t.tap&&i.filterTaps)t._force=!0;else{const[l,c]=t._delta,[d,h]=t._movement,[u,p]=i.swipe.velocity,[g,_]=i.swipe.distance,v=i.swipe.duration;if(t.elapsedTime<v){const m=Math.abs(l/t.timeDelta),f=Math.abs(c/t.timeDelta);m>u&&Math.abs(d)>g&&(t.swipe[0]=Math.sign(l)),f>p&&Math.abs(h)>_&&(t.swipe[1]=Math.sign(c))}}this.emit()}pointerClick(e){!this.state.tap&&e.detail>0&&(e.preventDefault(),e.stopPropagation())}setupPointer(e){const t=this.config,i=t.device;t.pointerLock&&e.currentTarget.requestPointerLock(),t.pointerCapture||(this.eventStore.add(this.sharedConfig.window,i,"change",this.pointerMove.bind(this)),this.eventStore.add(this.sharedConfig.window,i,"end",this.pointerUp.bind(this)),this.eventStore.add(this.sharedConfig.window,i,"cancel",this.pointerUp.bind(this)))}pointerClean(){this.config.pointerLock&&document.pointerLockElement===this.state.currentTarget&&document.exitPointerLock()}preventScroll(e){this.state._preventScroll&&e.cancelable&&e.preventDefault()}setupScrollPrevention(e){this.state._preventScroll=!1,mh(e);const t=this.eventStore.add(this.sharedConfig.window,"touch","change",this.preventScroll.bind(this),{passive:!1});this.eventStore.add(this.sharedConfig.window,"touch","end",t),this.eventStore.add(this.sharedConfig.window,"touch","cancel",t),this.timeoutStore.add("startPointerDrag",this.startPointerDrag.bind(this),this.config.preventScrollDelay,e)}setupDelayTrigger(e){this.state._delayed=!0,this.timeoutStore.add("dragDelay",()=>{this.state._step=[0,0],this.startPointerDrag(e)},this.config.delay)}keyDown(e){const t=Wo[e.key];if(t){const i=this.state,s=e.shiftKey?10:e.altKey?.1:1;this.start(e),i._delta=t(this.config.keyboardDisplacement,s),i._keyboardActive=!0,Rt.addTo(i._movement,i._delta),this.compute(e),this.emit()}}keyUp(e){e.key in Wo&&(this.state._keyboardActive=!1,this.setActive(),this.compute(e),this.emit())}bind(e){const t=this.config.device;e(t,"start",this.pointerDown.bind(this)),this.config.pointerCapture&&(e(t,"change",this.pointerMove.bind(this)),e(t,"end",this.pointerUp.bind(this)),e(t,"cancel",this.pointerUp.bind(this)),e("lostPointerCapture","",this.pointerUp.bind(this))),this.config.keys&&(e("key","down",this.keyDown.bind(this)),e("key","up",this.keyUp.bind(this))),this.config.filterTaps&&e("click","",this.pointerClick.bind(this),{capture:!0,passive:!1})}}function mh(n){"persist"in n&&typeof n.persist=="function"&&n.persist()}const is=typeof window<"u"&&window.document&&window.document.createElement;function gc(){return is&&"ontouchstart"in window}function gh(){return gc()||is&&window.navigator.maxTouchPoints>1}function xh(){return is&&"onpointerdown"in window}function _h(){return is&&"exitPointerLock"in window.document}function vh(){try{return"constructor"in GestureEvent}catch{return!1}}const Kt={isBrowser:is,gesture:vh(),touch:gc(),touchscreen:gh(),pointer:xh(),pointerLock:_h()},bh=250,yh=180,wh=.5,Sh=50,Mh=250,Eh=10,Xo={mouse:0,touch:0,pen:8},Th=pt(pt({},ns),{},{device(n,e,{pointer:{touch:t=!1,lock:i=!1,mouse:s=!1}={}}){return this.pointerLock=i&&Kt.pointerLock,Kt.touch&&t?"touch":this.pointerLock?"mouse":Kt.pointer&&!s?"pointer":Kt.touch?"touch":"mouse"},preventScrollAxis(n,e,{preventScroll:t}){if(this.preventScrollDelay=typeof t=="number"?t:t||t===void 0&&n?bh:void 0,!(!Kt.touchscreen||t===!1))return n||(t!==void 0?"y":void 0)},pointerCapture(n,e,{pointer:{capture:t=!0,buttons:i=1,keys:s=!0}={}}){return this.pointerButtons=i,this.keys=s,!this.pointerLock&&this.device==="pointer"&&t},threshold(n,e,{filterTaps:t=!1,tapsThreshold:i=3,axis:s=void 0}){const r=Rt.toVector(n,t?i:s?1:0);return this.filterTaps=t,this.tapsThreshold=i,r},swipe({velocity:n=wh,distance:e=Sh,duration:t=Mh}={}){return{velocity:this.transform(Rt.toVector(n)),distance:this.transform(Rt.toVector(e)),duration:t}},delay(n=0){switch(n){case!0:return yh;case!1:return 0;default:return n}},axisThreshold(n){return n?pt(pt({},Xo),n):Xo},keyboardDisplacement(n=Eh){return n}});pt(pt({},mc),{},{device(n,e,{shared:t,pointer:{touch:i=!1}={}}){if(t.target&&!Kt.touch&&Kt.gesture)return"gesture";if(Kt.touch&&i)return"touch";if(Kt.touchscreen){if(Kt.pointer)return"pointer";if(Kt.touch)return"touch"}},bounds(n,e,{scaleBounds:t={},angleBounds:i={}}){const s=o=>{const l=Go($s(t,o),{min:-1/0,max:1/0});return[l.min,l.max]},r=o=>{const l=Go($s(i,o),{min:-1/0,max:1/0});return[l.min,l.max]};return typeof t!="function"&&typeof i!="function"?[s(),r()]:o=>[s(o),r(o)]},threshold(n,e,t){return this.lockDirection=t.axis==="lock",Rt.toVector(n,this.lockDirection?[.1,3]:0)},modifierKey(n){return n===void 0?"ctrlKey":n},pinchOnWheel(n=!0){return n}});pt(pt({},ns),{},{mouseOnly:(n=!0)=>n});pt(pt({},ns),{},{mouseOnly:(n=!0)=>n});const xc=new Map,ea=new Map;function Ah(n){xc.set(n.key,n.engine),ea.set(n.key,n.resolver)}const Ch={key:"drag",engine:ph,resolver:Th};function Rh(n,e){if(n==null)return{};var t={},i=Object.keys(n),s,r;for(r=0;r<i.length;r++)s=i[r],!(e.indexOf(s)>=0)&&(t[s]=n[s]);return t}function Nh(n,e){if(n==null)return{};var t=Rh(n,e),i,s;if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(n);for(s=0;s<r.length;s++)i=r[s],!(e.indexOf(i)>=0)&&Object.prototype.propertyIsEnumerable.call(n,i)&&(t[i]=n[i])}return t}const Ph={target(n){if(n)return()=>"current"in n?n.current:n},enabled(n=!0){return n},window(n=Kt.isBrowser?window:void 0){return n},eventOptions({passive:n=!0,capture:e=!1}={}){return{passive:n,capture:e}},transform(n){return n}},Lh=["target","eventOptions","window","enabled","transform"];function js(n={},e){const t={};for(const[i,s]of Object.entries(e))switch(typeof s){case"function":t[i]=s.call(t,n[i],i,n);break;case"object":t[i]=js(n[i],s);break;case"boolean":s&&(t[i]=n[i]);break}return t}function Dh(n,e,t={}){const i=n,{target:s,eventOptions:r,window:o,enabled:l,transform:c}=i,d=Nh(i,Lh);if(t.shared=js({target:s,eventOptions:r,window:o,enabled:l,transform:c},Ph),e){const h=ea.get(e);t[e]=js(pt({shared:t.shared},d),h)}else for(const h in d){const u=ea.get(h);u&&(t[h]=js(pt({shared:t.shared},d[h]),u))}return t}class _c{constructor(e,t){Ot(this,"_listeners",new Set),this._ctrl=e,this._gestureKey=t}add(e,t,i,s,r){const o=this._listeners,l=th(t,i),c=this._gestureKey?this._ctrl.config[this._gestureKey].eventOptions:{},d=pt(pt({},c),r);e.addEventListener(l,s,d);const h=()=>{e.removeEventListener(l,s,d),o.delete(h)};return o.add(h),h}clean(){this._listeners.forEach(e=>e()),this._listeners.clear()}}class Ih{constructor(){Ot(this,"_timeouts",new Map)}add(e,t,i=140,...s){this.remove(e),this._timeouts.set(e,window.setTimeout(t,i,...s))}remove(e){const t=this._timeouts.get(e);t&&window.clearTimeout(t)}clean(){this._timeouts.forEach(e=>{window.clearTimeout(e)}),this._timeouts.clear()}}class Uh{constructor(e){Ot(this,"gestures",new Set),Ot(this,"_targetEventStore",new _c(this)),Ot(this,"gestureEventStores",{}),Ot(this,"gestureTimeoutStores",{}),Ot(this,"handlers",{}),Ot(this,"config",{}),Ot(this,"pointerIds",new Set),Ot(this,"touchIds",new Set),Ot(this,"state",{shared:{shiftKey:!1,metaKey:!1,ctrlKey:!1,altKey:!1}}),Fh(this,e)}setEventIds(e){if(tr(e))return this.touchIds=new Set(sh(e)),this.touchIds;if("pointerId"in e)return e.type==="pointerup"||e.type==="pointercancel"?this.pointerIds.delete(e.pointerId):e.type==="pointerdown"&&this.pointerIds.add(e.pointerId),this.pointerIds}applyHandlers(e,t){this.handlers=e,this.nativeHandlers=t}applyConfig(e,t){this.config=Dh(e,t,this.config)}clean(){this._targetEventStore.clean();for(const e of this.gestures)this.gestureEventStores[e].clean(),this.gestureTimeoutStores[e].clean()}effect(){return this.config.shared.target&&this.bind(),()=>this._targetEventStore.clean()}bind(...e){const t=this.config.shared,i={};let s;if(!(t.target&&(s=t.target(),!s))){if(t.enabled){for(const o of this.gestures){const l=this.config[o],c=qo(i,l.eventOptions,!!s);if(l.enabled){const d=xc.get(o);new d(this,e,o).bind(c)}}const r=qo(i,t.eventOptions,!!s);for(const o in this.nativeHandlers)r(o,"",l=>this.nativeHandlers[o](pt(pt({},this.state.shared),{},{event:l,args:e})),void 0,!0)}for(const r in i)i[r]=oh(...i[r]);if(!s)return i;for(const r in i){const{device:o,capture:l,passive:c}=eh(r);this._targetEventStore.add(s,o,"",i[r],{capture:l,passive:c})}}}}function hi(n,e){n.gestures.add(e),n.gestureEventStores[e]=new _c(n,e),n.gestureTimeoutStores[e]=new Ih}function Fh(n,e){e.drag&&hi(n,"drag"),e.wheel&&hi(n,"wheel"),e.scroll&&hi(n,"scroll"),e.move&&hi(n,"move"),e.pinch&&hi(n,"pinch"),e.hover&&hi(n,"hover")}const qo=(n,e,t)=>(i,s,r,o={},l=!1)=>{var c,d;const h=(c=o.capture)!==null&&c!==void 0?c:e.capture,u=(d=o.passive)!==null&&d!==void 0?d:e.passive;let p=l?i:Ju(i,s,h);t&&u&&(p+="Passive"),n[p]=n[p]||[],n[p].push(r)};function kh(n,e={},t,i){const s=Zi.useMemo(()=>new Uh(n),[]);if(s.applyHandlers(n,i),s.applyConfig(e,t),Zi.useEffect(s.effect.bind(s)),Zi.useEffect(()=>s.clean.bind(s),[]),e.target===void 0)return s.bind.bind(s)}function Oh(n,e){return Ah(Ch),kh({drag:n},e||{},"drag")}const yn=["league","play","matched","profile"],Bh=({pages:n})=>{const{navigationState:e,updateNavigationTab:t}=vn(),{currentTab:i}=e,[s,r]=F.useState(0),[o,l]=F.useState(!1),c=yn.indexOf(i),d=c>=0?c:1,h=window.innerWidth*.08,u=Oh(({movement:[g,_],velocity:[v,m],direction:[f,y],active:M,first:w,last:T})=>{if(console.log("🖐️ Gesture:",{active:M,first:w,last:T,movement:{x:g.toFixed(1),y:_.toFixed(1)},velocity:{x:v.toFixed(3),y:m.toFixed(3)},direction:{x:f,y},currentTab:i,currentIndex:d}),M){const R=d>0,A=d<yn.length-1;let B=g;B>0&&!R&&(B=B*.3),B<0&&!A&&(B=B*.3),r(B)}else{const R=Math.abs(v)>.15,A=Math.abs(g)>h,B=R||A;console.log("🏁 Gesture ended:",{velocityMet:`${R} (|${v.toFixed(3)}| > 0.3)`,distanceMet:`${A} (|${g.toFixed(1)}| > ${h.toFixed(1)})`,shouldSwipe:B,direction:g>0?"RIGHT (prev tab)":"LEFT (next tab)"}),l(!0),B?g>0&&d>0?(console.log("✅ Navigating to:",yn[d-1]),t(yn[d-1])):g<0&&d<yn.length-1?(console.log("✅ Navigating to:",yn[d+1]),t(yn[d+1])):console.log("⚠️ Cannot navigate: at boundary"):console.log("❌ Swipe not registered: thresholds not met"),r(0),setTimeout(()=>{l(!1)},300)}},{axis:"x",filterTaps:!0,from:()=>[s,0]});F.useEffect(()=>{r(0),l(!0);const g=setTimeout(()=>l(!1),300);return()=>clearTimeout(g)},[i]);const p=s/window.innerWidth*100;return a.jsxs("div",{...u(),className:"absolute inset-0 overflow-hidden touch-pan-y",children:[yn.map((g,_)=>{const v=n.find(M=>M.id===g),m=_-d,f=m*100+p,y=Math.abs(m)<=1||s!==0;return a.jsx("div",{className:`absolute inset-0 ${o?"transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]":""}`,style:{transform:`translateX(${f}%)`,visibility:y?"visible":"hidden"},children:v?.component},g)}),a.jsx("div",{className:"absolute bottom-20 left-0 right-0 flex justify-center gap-2 z-50 pointer-events-none",children:yn.map((g,_)=>a.jsx("div",{className:`h-2 rounded-full transition-all duration-300 ${_===d?"bg-white w-6":"bg-white/30 w-2"}`},g))})]})};const no="182",jh=0,$o=1,zh=2,zs=1,Vh=2,Yi=3,qn=0,Bt=1,An=2,Rn=0,Ai=1,Yo=2,Ko=3,Zo=4,Gh=5,ii=100,Hh=101,Wh=102,Xh=103,qh=104,$h=200,Yh=201,Kh=202,Zh=203,ta=204,na=205,Jh=206,Qh=207,ef=208,tf=209,nf=210,sf=211,rf=212,af=213,of=214,ia=0,sa=1,ra=2,Ni=3,aa=4,oa=5,la=6,ca=7,vc=0,lf=1,cf=2,fn=0,bc=1,yc=2,wc=3,Sc=4,Mc=5,Ec=6,Tc=7,Ac=300,ci=301,Pi=302,da=303,ua=304,nr=306,ha=1e3,Cn=1001,fa=1002,Et=1003,df=1004,ps=1005,Nt=1006,gr=1007,ri=1008,Zt=1009,Cc=1010,Rc=1011,Ji=1012,io=1013,xn=1014,dn=1015,Ln=1016,so=1017,ro=1018,Qi=1020,Nc=35902,Pc=35899,Lc=1021,Dc=1022,an=1023,Dn=1026,ai=1027,Ic=1028,ao=1029,Li=1030,oo=1031,lo=1033,Vs=33776,Gs=33777,Hs=33778,Ws=33779,pa=35840,ma=35841,ga=35842,xa=35843,_a=36196,va=37492,ba=37496,ya=37488,wa=37489,Sa=37490,Ma=37491,Ea=37808,Ta=37809,Aa=37810,Ca=37811,Ra=37812,Na=37813,Pa=37814,La=37815,Da=37816,Ia=37817,Ua=37818,Fa=37819,ka=37820,Oa=37821,Ba=36492,ja=36494,za=36495,Va=36283,Ga=36284,Ha=36285,Wa=36286,uf=3200,hf=0,ff=1,Hn="",$t="srgb",Di="srgb-linear",Ys="linear",rt="srgb",fi=7680,Jo=519,pf=512,mf=513,gf=514,co=515,xf=516,_f=517,uo=518,vf=519,Qo=35044,el="300 es",un=2e3,Ks=2001;function Uc(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Zs(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function bf(){const n=Zs("canvas");return n.style.display="block",n}const tl={};function nl(...n){const e="THREE."+n.shift();console.log(e,...n)}function Ge(...n){const e="THREE."+n.shift();console.warn(e,...n)}function nt(...n){const e="THREE."+n.shift();console.error(e,...n)}function es(...n){const e=n.join(" ");e in tl||(tl[e]=!0,Ge(...n))}function yf(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}class Fi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}}const Tt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],xr=Math.PI/180,Xa=180/Math.PI;function ss(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Tt[n&255]+Tt[n>>8&255]+Tt[n>>16&255]+Tt[n>>24&255]+"-"+Tt[e&255]+Tt[e>>8&255]+"-"+Tt[e>>16&15|64]+Tt[e>>24&255]+"-"+Tt[t&63|128]+Tt[t>>8&255]+"-"+Tt[t>>16&255]+Tt[t>>24&255]+Tt[i&255]+Tt[i>>8&255]+Tt[i>>16&255]+Tt[i>>24&255]).toLowerCase()}function Ze(n,e,t){return Math.max(e,Math.min(t,n))}function wf(n,e){return(n%e+e)%e}function _r(n,e,t){return(1-t)*n+t*e}function zi(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function kt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}class at{constructor(e=0,t=0){at.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ze(this.x,e.x,t.x),this.y=Ze(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ze(this.x,e,t),this.y=Ze(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ze(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ze(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*i-o*s+e.x,this.y=r*s+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class rs{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,o,l){let c=i[s+0],d=i[s+1],h=i[s+2],u=i[s+3],p=r[o+0],g=r[o+1],_=r[o+2],v=r[o+3];if(l<=0){e[t+0]=c,e[t+1]=d,e[t+2]=h,e[t+3]=u;return}if(l>=1){e[t+0]=p,e[t+1]=g,e[t+2]=_,e[t+3]=v;return}if(u!==v||c!==p||d!==g||h!==_){let m=c*p+d*g+h*_+u*v;m<0&&(p=-p,g=-g,_=-_,v=-v,m=-m);let f=1-l;if(m<.9995){const y=Math.acos(m),M=Math.sin(y);f=Math.sin(f*y)/M,l=Math.sin(l*y)/M,c=c*f+p*l,d=d*f+g*l,h=h*f+_*l,u=u*f+v*l}else{c=c*f+p*l,d=d*f+g*l,h=h*f+_*l,u=u*f+v*l;const y=1/Math.sqrt(c*c+d*d+h*h+u*u);c*=y,d*=y,h*=y,u*=y}}e[t]=c,e[t+1]=d,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,s,r,o){const l=i[s],c=i[s+1],d=i[s+2],h=i[s+3],u=r[o],p=r[o+1],g=r[o+2],_=r[o+3];return e[t]=l*_+h*u+c*g-d*p,e[t+1]=c*_+h*p+d*u-l*g,e[t+2]=d*_+h*g+l*p-c*u,e[t+3]=h*_-l*u-c*p-d*g,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,r=e._z,o=e._order,l=Math.cos,c=Math.sin,d=l(i/2),h=l(s/2),u=l(r/2),p=c(i/2),g=c(s/2),_=c(r/2);switch(o){case"XYZ":this._x=p*h*u+d*g*_,this._y=d*g*u-p*h*_,this._z=d*h*_+p*g*u,this._w=d*h*u-p*g*_;break;case"YXZ":this._x=p*h*u+d*g*_,this._y=d*g*u-p*h*_,this._z=d*h*_-p*g*u,this._w=d*h*u+p*g*_;break;case"ZXY":this._x=p*h*u-d*g*_,this._y=d*g*u+p*h*_,this._z=d*h*_+p*g*u,this._w=d*h*u-p*g*_;break;case"ZYX":this._x=p*h*u-d*g*_,this._y=d*g*u+p*h*_,this._z=d*h*_-p*g*u,this._w=d*h*u+p*g*_;break;case"YZX":this._x=p*h*u+d*g*_,this._y=d*g*u+p*h*_,this._z=d*h*_-p*g*u,this._w=d*h*u-p*g*_;break;case"XZY":this._x=p*h*u-d*g*_,this._y=d*g*u-p*h*_,this._z=d*h*_+p*g*u,this._w=d*h*u+p*g*_;break;default:Ge("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],r=t[8],o=t[1],l=t[5],c=t[9],d=t[2],h=t[6],u=t[10],p=i+l+u;if(p>0){const g=.5/Math.sqrt(p+1);this._w=.25/g,this._x=(h-c)*g,this._y=(r-d)*g,this._z=(o-s)*g}else if(i>l&&i>u){const g=2*Math.sqrt(1+i-l-u);this._w=(h-c)/g,this._x=.25*g,this._y=(s+o)/g,this._z=(r+d)/g}else if(l>u){const g=2*Math.sqrt(1+l-i-u);this._w=(r-d)/g,this._x=(s+o)/g,this._y=.25*g,this._z=(c+h)/g}else{const g=2*Math.sqrt(1+u-i-l);this._w=(o-s)/g,this._x=(r+d)/g,this._y=(c+h)/g,this._z=.25*g}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ze(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,r=e._z,o=e._w,l=t._x,c=t._y,d=t._z,h=t._w;return this._x=i*h+o*l+s*d-r*c,this._y=s*h+o*c+r*l-i*d,this._z=r*h+o*d+i*c-s*l,this._w=o*h-i*l-s*c-r*d,this._onChangeCallback(),this}slerp(e,t){if(t<=0)return this;if(t>=1)return this.copy(e);let i=e._x,s=e._y,r=e._z,o=e._w,l=this.dot(e);l<0&&(i=-i,s=-s,r=-r,o=-o,l=-l);let c=1-t;if(l<.9995){const d=Math.acos(l),h=Math.sin(d);c=Math.sin(c*d)/h,t=Math.sin(t*d)/h,this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+o*t,this._onChangeCallback()}else this._x=this._x*c+i*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+o*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class ${constructor(e=0,t=0,i=0){$.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(il.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(il.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*o,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,r=e.x,o=e.y,l=e.z,c=e.w,d=2*(o*s-l*i),h=2*(l*t-r*s),u=2*(r*i-o*t);return this.x=t+c*d+o*u-l*h,this.y=i+c*h+l*d-r*u,this.z=s+c*u+r*h-o*d,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ze(this.x,e.x,t.x),this.y=Ze(this.y,e.y,t.y),this.z=Ze(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ze(this.x,e,t),this.y=Ze(this.y,e,t),this.z=Ze(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ze(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,r=e.z,o=t.x,l=t.y,c=t.z;return this.x=s*c-r*l,this.y=r*o-i*c,this.z=i*l-s*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return vr.copy(this).projectOnVector(e),this.sub(vr)}reflect(e){return this.sub(vr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ze(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const vr=new $,il=new rs;class We{constructor(e,t,i,s,r,o,l,c,d){We.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,o,l,c,d)}set(e,t,i,s,r,o,l,c,d){const h=this.elements;return h[0]=e,h[1]=s,h[2]=l,h[3]=t,h[4]=r,h[5]=c,h[6]=i,h[7]=o,h[8]=d,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,o=i[0],l=i[3],c=i[6],d=i[1],h=i[4],u=i[7],p=i[2],g=i[5],_=i[8],v=s[0],m=s[3],f=s[6],y=s[1],M=s[4],w=s[7],T=s[2],R=s[5],A=s[8];return r[0]=o*v+l*y+c*T,r[3]=o*m+l*M+c*R,r[6]=o*f+l*w+c*A,r[1]=d*v+h*y+u*T,r[4]=d*m+h*M+u*R,r[7]=d*f+h*w+u*A,r[2]=p*v+g*y+_*T,r[5]=p*m+g*M+_*R,r[8]=p*f+g*w+_*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],l=e[5],c=e[6],d=e[7],h=e[8];return t*o*h-t*l*d-i*r*h+i*l*c+s*r*d-s*o*c}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],l=e[5],c=e[6],d=e[7],h=e[8],u=h*o-l*d,p=l*c-h*r,g=d*r-o*c,_=t*u+i*p+s*g;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/_;return e[0]=u*v,e[1]=(s*d-h*i)*v,e[2]=(l*i-s*o)*v,e[3]=p*v,e[4]=(h*t-s*c)*v,e[5]=(s*r-l*t)*v,e[6]=g*v,e[7]=(i*c-d*t)*v,e[8]=(o*t-i*r)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,o,l){const c=Math.cos(r),d=Math.sin(r);return this.set(i*c,i*d,-i*(c*o+d*l)+o+e,-s*d,s*c,-s*(-d*o+c*l)+l+t,0,0,1),this}scale(e,t){return this.premultiply(br.makeScale(e,t)),this}rotate(e){return this.premultiply(br.makeRotation(-e)),this}translate(e,t){return this.premultiply(br.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const br=new We,sl=new We().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),rl=new We().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Sf(){const n={enabled:!0,workingColorSpace:Di,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===rt&&(s.r=Nn(s.r),s.g=Nn(s.g),s.b=Nn(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===rt&&(s.r=Ci(s.r),s.g=Ci(s.g),s.b=Ci(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Hn?Ys:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return es("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return es("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Di]:{primaries:e,whitePoint:i,transfer:Ys,toXYZ:sl,fromXYZ:rl,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:$t},outputColorSpaceConfig:{drawingBufferColorSpace:$t}},[$t]:{primaries:e,whitePoint:i,transfer:rt,toXYZ:sl,fromXYZ:rl,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:$t}}}),n}const et=Sf();function Nn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Ci(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let pi;class Mf{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{pi===void 0&&(pi=Zs("canvas")),pi.width=e.width,pi.height=e.height;const s=pi.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=pi}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Zs("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Nn(r[o]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Nn(t[i]/255)*255):t[i]=Nn(t[i]);return{data:t,width:e.width,height:e.height}}else return Ge("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Ef=0;class ho{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ef++}),this.uuid=ss(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,l=s.length;o<l;o++)s[o].isDataTexture?r.push(yr(s[o].image)):r.push(yr(s[o]))}else r=yr(s);i.url=r}return t||(e.images[this.uuid]=i),i}}function yr(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Mf.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Ge("Texture: Unable to serialize Texture."),{})}let Tf=0;const wr=new $;class Dt extends Fi{constructor(e=Dt.DEFAULT_IMAGE,t=Dt.DEFAULT_MAPPING,i=Cn,s=Cn,r=Nt,o=ri,l=an,c=Zt,d=Dt.DEFAULT_ANISOTROPY,h=Hn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Tf++}),this.uuid=ss(),this.name="",this.source=new ho(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=d,this.format=l,this.internalFormat=null,this.type=c,this.offset=new at(0,0),this.repeat=new at(1,1),this.center=new at(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new We,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(wr).x}get height(){return this.source.getSize(wr).y}get depth(){return this.source.getSize(wr).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){Ge(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Ge(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Ac)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case ha:e.x=e.x-Math.floor(e.x);break;case Cn:e.x=e.x<0?0:1;break;case fa:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case ha:e.y=e.y-Math.floor(e.y);break;case Cn:e.y=e.y<0?0:1;break;case fa:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Dt.DEFAULT_IMAGE=null;Dt.DEFAULT_MAPPING=Ac;Dt.DEFAULT_ANISOTROPY=1;class _t{constructor(e=0,t=0,i=0,s=1){_t.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*i+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*i+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*i+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r;const c=e.elements,d=c[0],h=c[4],u=c[8],p=c[1],g=c[5],_=c[9],v=c[2],m=c[6],f=c[10];if(Math.abs(h-p)<.01&&Math.abs(u-v)<.01&&Math.abs(_-m)<.01){if(Math.abs(h+p)<.1&&Math.abs(u+v)<.1&&Math.abs(_+m)<.1&&Math.abs(d+g+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const M=(d+1)/2,w=(g+1)/2,T=(f+1)/2,R=(h+p)/4,A=(u+v)/4,B=(_+m)/4;return M>w&&M>T?M<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(M),s=R/i,r=A/i):w>T?w<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(w),i=R/s,r=B/s):T<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(T),i=A/r,s=B/r),this.set(i,s,r,t),this}let y=Math.sqrt((m-_)*(m-_)+(u-v)*(u-v)+(p-h)*(p-h));return Math.abs(y)<.001&&(y=1),this.x=(m-_)/y,this.y=(u-v)/y,this.z=(p-h)/y,this.w=Math.acos((d+g+f-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ze(this.x,e.x,t.x),this.y=Ze(this.y,e.y,t.y),this.z=Ze(this.z,e.z,t.z),this.w=Ze(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ze(this.x,e,t),this.y=Ze(this.y,e,t),this.z=Ze(this.z,e,t),this.w=Ze(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ze(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Af extends Fi{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Nt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new _t(0,0,e,t),this.scissorTest=!1,this.viewport=new _t(0,0,e,t);const s={width:e,height:t,depth:i.depth},r=new Dt(s);this.textures=[];const o=i.count;for(let l=0;l<o;l++)this.textures[l]=r.clone(),this.textures[l].isRenderTargetTexture=!0,this.textures[l].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:Nt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new ho(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class pn extends Af{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Fc extends Dt{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Et,this.minFilter=Et,this.wrapR=Cn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Cf extends Dt{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Et,this.minFilter=Et,this.wrapR=Cn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class as{constructor(e=new $(1/0,1/0,1/0),t=new $(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Qt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Qt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Qt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,l=r.count;o<l;o++)e.isMesh===!0?e.getVertexPosition(o,Qt):Qt.fromBufferAttribute(r,o),Qt.applyMatrix4(e.matrixWorld),this.expandByPoint(Qt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ms.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),ms.copy(i.boundingBox)),ms.applyMatrix4(e.matrixWorld),this.union(ms)}const s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Qt),Qt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Vi),gs.subVectors(this.max,Vi),mi.subVectors(e.a,Vi),gi.subVectors(e.b,Vi),xi.subVectors(e.c,Vi),On.subVectors(gi,mi),Bn.subVectors(xi,gi),Kn.subVectors(mi,xi);let t=[0,-On.z,On.y,0,-Bn.z,Bn.y,0,-Kn.z,Kn.y,On.z,0,-On.x,Bn.z,0,-Bn.x,Kn.z,0,-Kn.x,-On.y,On.x,0,-Bn.y,Bn.x,0,-Kn.y,Kn.x,0];return!Sr(t,mi,gi,xi,gs)||(t=[1,0,0,0,1,0,0,0,1],!Sr(t,mi,gi,xi,gs))?!1:(xs.crossVectors(On,Bn),t=[xs.x,xs.y,xs.z],Sr(t,mi,gi,xi,gs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Qt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Qt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(wn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),wn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),wn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),wn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),wn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),wn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),wn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),wn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(wn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const wn=[new $,new $,new $,new $,new $,new $,new $,new $],Qt=new $,ms=new as,mi=new $,gi=new $,xi=new $,On=new $,Bn=new $,Kn=new $,Vi=new $,gs=new $,xs=new $,Zn=new $;function Sr(n,e,t,i,s){for(let r=0,o=n.length-3;r<=o;r+=3){Zn.fromArray(n,r);const l=s.x*Math.abs(Zn.x)+s.y*Math.abs(Zn.y)+s.z*Math.abs(Zn.z),c=e.dot(Zn),d=t.dot(Zn),h=i.dot(Zn);if(Math.max(-Math.max(c,d,h),Math.min(c,d,h))>l)return!1}return!0}const Rf=new as,Gi=new $,Mr=new $;class fo{constructor(e=new $,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Rf.setFromPoints(e).getCenter(i);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Gi.subVectors(e,this.center);const t=Gi.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(Gi,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Mr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Gi.copy(e.center).add(Mr)),this.expandByPoint(Gi.copy(e.center).sub(Mr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const Sn=new $,Er=new $,_s=new $,jn=new $,Tr=new $,vs=new $,Ar=new $;class Nf{constructor(e=new $,t=new $(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Sn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Sn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Sn.copy(this.origin).addScaledVector(this.direction,t),Sn.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){Er.copy(e).add(t).multiplyScalar(.5),_s.copy(t).sub(e).normalize(),jn.copy(this.origin).sub(Er);const r=e.distanceTo(t)*.5,o=-this.direction.dot(_s),l=jn.dot(this.direction),c=-jn.dot(_s),d=jn.lengthSq(),h=Math.abs(1-o*o);let u,p,g,_;if(h>0)if(u=o*c-l,p=o*l-c,_=r*h,u>=0)if(p>=-_)if(p<=_){const v=1/h;u*=v,p*=v,g=u*(u+o*p+2*l)+p*(o*u+p+2*c)+d}else p=r,u=Math.max(0,-(o*p+l)),g=-u*u+p*(p+2*c)+d;else p=-r,u=Math.max(0,-(o*p+l)),g=-u*u+p*(p+2*c)+d;else p<=-_?(u=Math.max(0,-(-o*r+l)),p=u>0?-r:Math.min(Math.max(-r,-c),r),g=-u*u+p*(p+2*c)+d):p<=_?(u=0,p=Math.min(Math.max(-r,-c),r),g=p*(p+2*c)+d):(u=Math.max(0,-(o*r+l)),p=u>0?r:Math.min(Math.max(-r,-c),r),g=-u*u+p*(p+2*c)+d);else p=o>0?-r:r,u=Math.max(0,-(o*p+l)),g=-u*u+p*(p+2*c)+d;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Er).addScaledVector(_s,p),g}intersectSphere(e,t){Sn.subVectors(e.center,this.origin);const i=Sn.dot(this.direction),s=Sn.dot(Sn)-i*i,r=e.radius*e.radius;if(s>r)return null;const o=Math.sqrt(r-s),l=i-o,c=i+o;return c<0?null:l<0?this.at(c,t):this.at(l,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,o,l,c;const d=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,p=this.origin;return d>=0?(i=(e.min.x-p.x)*d,s=(e.max.x-p.x)*d):(i=(e.max.x-p.x)*d,s=(e.min.x-p.x)*d),h>=0?(r=(e.min.y-p.y)*h,o=(e.max.y-p.y)*h):(r=(e.max.y-p.y)*h,o=(e.min.y-p.y)*h),i>o||r>s||((r>i||isNaN(i))&&(i=r),(o<s||isNaN(s))&&(s=o),u>=0?(l=(e.min.z-p.z)*u,c=(e.max.z-p.z)*u):(l=(e.max.z-p.z)*u,c=(e.min.z-p.z)*u),i>c||l>s)||((l>i||i!==i)&&(i=l),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,Sn)!==null}intersectTriangle(e,t,i,s,r){Tr.subVectors(t,e),vs.subVectors(i,e),Ar.crossVectors(Tr,vs);let o=this.direction.dot(Ar),l;if(o>0){if(s)return null;l=1}else if(o<0)l=-1,o=-o;else return null;jn.subVectors(this.origin,e);const c=l*this.direction.dot(vs.crossVectors(jn,vs));if(c<0)return null;const d=l*this.direction.dot(Tr.cross(jn));if(d<0||c+d>o)return null;const h=-l*jn.dot(Ar);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class yt{constructor(e,t,i,s,r,o,l,c,d,h,u,p,g,_,v,m){yt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,o,l,c,d,h,u,p,g,_,v,m)}set(e,t,i,s,r,o,l,c,d,h,u,p,g,_,v,m){const f=this.elements;return f[0]=e,f[4]=t,f[8]=i,f[12]=s,f[1]=r,f[5]=o,f[9]=l,f[13]=c,f[2]=d,f[6]=h,f[10]=u,f[14]=p,f[3]=g,f[7]=_,f[11]=v,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new yt().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const t=this.elements,i=e.elements,s=1/_i.setFromMatrixColumn(e,0).length(),r=1/_i.setFromMatrixColumn(e,1).length(),o=1/_i.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,r=e.z,o=Math.cos(i),l=Math.sin(i),c=Math.cos(s),d=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const p=o*h,g=o*u,_=l*h,v=l*u;t[0]=c*h,t[4]=-c*u,t[8]=d,t[1]=g+_*d,t[5]=p-v*d,t[9]=-l*c,t[2]=v-p*d,t[6]=_+g*d,t[10]=o*c}else if(e.order==="YXZ"){const p=c*h,g=c*u,_=d*h,v=d*u;t[0]=p+v*l,t[4]=_*l-g,t[8]=o*d,t[1]=o*u,t[5]=o*h,t[9]=-l,t[2]=g*l-_,t[6]=v+p*l,t[10]=o*c}else if(e.order==="ZXY"){const p=c*h,g=c*u,_=d*h,v=d*u;t[0]=p-v*l,t[4]=-o*u,t[8]=_+g*l,t[1]=g+_*l,t[5]=o*h,t[9]=v-p*l,t[2]=-o*d,t[6]=l,t[10]=o*c}else if(e.order==="ZYX"){const p=o*h,g=o*u,_=l*h,v=l*u;t[0]=c*h,t[4]=_*d-g,t[8]=p*d+v,t[1]=c*u,t[5]=v*d+p,t[9]=g*d-_,t[2]=-d,t[6]=l*c,t[10]=o*c}else if(e.order==="YZX"){const p=o*c,g=o*d,_=l*c,v=l*d;t[0]=c*h,t[4]=v-p*u,t[8]=_*u+g,t[1]=u,t[5]=o*h,t[9]=-l*h,t[2]=-d*h,t[6]=g*u+_,t[10]=p-v*u}else if(e.order==="XZY"){const p=o*c,g=o*d,_=l*c,v=l*d;t[0]=c*h,t[4]=-u,t[8]=d*h,t[1]=p*u+v,t[5]=o*h,t[9]=g*u-_,t[2]=_*u-g,t[6]=l*h,t[10]=v*u+p}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Pf,e,Lf)}lookAt(e,t,i){const s=this.elements;return Vt.subVectors(e,t),Vt.lengthSq()===0&&(Vt.z=1),Vt.normalize(),zn.crossVectors(i,Vt),zn.lengthSq()===0&&(Math.abs(i.z)===1?Vt.x+=1e-4:Vt.z+=1e-4,Vt.normalize(),zn.crossVectors(i,Vt)),zn.normalize(),bs.crossVectors(Vt,zn),s[0]=zn.x,s[4]=bs.x,s[8]=Vt.x,s[1]=zn.y,s[5]=bs.y,s[9]=Vt.y,s[2]=zn.z,s[6]=bs.z,s[10]=Vt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,o=i[0],l=i[4],c=i[8],d=i[12],h=i[1],u=i[5],p=i[9],g=i[13],_=i[2],v=i[6],m=i[10],f=i[14],y=i[3],M=i[7],w=i[11],T=i[15],R=s[0],A=s[4],B=s[8],b=s[12],E=s[1],N=s[5],U=s[9],D=s[13],P=s[2],I=s[6],k=s[10],j=s[14],W=s[3],ee=s[7],Q=s[11],ne=s[15];return r[0]=o*R+l*E+c*P+d*W,r[4]=o*A+l*N+c*I+d*ee,r[8]=o*B+l*U+c*k+d*Q,r[12]=o*b+l*D+c*j+d*ne,r[1]=h*R+u*E+p*P+g*W,r[5]=h*A+u*N+p*I+g*ee,r[9]=h*B+u*U+p*k+g*Q,r[13]=h*b+u*D+p*j+g*ne,r[2]=_*R+v*E+m*P+f*W,r[6]=_*A+v*N+m*I+f*ee,r[10]=_*B+v*U+m*k+f*Q,r[14]=_*b+v*D+m*j+f*ne,r[3]=y*R+M*E+w*P+T*W,r[7]=y*A+M*N+w*I+T*ee,r[11]=y*B+M*U+w*k+T*Q,r[15]=y*b+M*D+w*j+T*ne,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],o=e[1],l=e[5],c=e[9],d=e[13],h=e[2],u=e[6],p=e[10],g=e[14],_=e[3],v=e[7],m=e[11],f=e[15],y=c*g-d*p,M=l*g-d*u,w=l*p-c*u,T=o*g-d*h,R=o*p-c*h,A=o*u-l*h;return t*(v*y-m*M+f*w)-i*(_*y-m*T+f*R)+s*(_*M-v*T+f*A)-r*(_*w-v*R+m*A)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],o=e[4],l=e[5],c=e[6],d=e[7],h=e[8],u=e[9],p=e[10],g=e[11],_=e[12],v=e[13],m=e[14],f=e[15],y=u*m*d-v*p*d+v*c*g-l*m*g-u*c*f+l*p*f,M=_*p*d-h*m*d-_*c*g+o*m*g+h*c*f-o*p*f,w=h*v*d-_*u*d+_*l*g-o*v*g-h*l*f+o*u*f,T=_*u*c-h*v*c-_*l*p+o*v*p+h*l*m-o*u*m,R=t*y+i*M+s*w+r*T;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/R;return e[0]=y*A,e[1]=(v*p*r-u*m*r-v*s*g+i*m*g+u*s*f-i*p*f)*A,e[2]=(l*m*r-v*c*r+v*s*d-i*m*d-l*s*f+i*c*f)*A,e[3]=(u*c*r-l*p*r-u*s*d+i*p*d+l*s*g-i*c*g)*A,e[4]=M*A,e[5]=(h*m*r-_*p*r+_*s*g-t*m*g-h*s*f+t*p*f)*A,e[6]=(_*c*r-o*m*r-_*s*d+t*m*d+o*s*f-t*c*f)*A,e[7]=(o*p*r-h*c*r+h*s*d-t*p*d-o*s*g+t*c*g)*A,e[8]=w*A,e[9]=(_*u*r-h*v*r-_*i*g+t*v*g+h*i*f-t*u*f)*A,e[10]=(o*v*r-_*l*r+_*i*d-t*v*d-o*i*f+t*l*f)*A,e[11]=(h*l*r-o*u*r-h*i*d+t*u*d+o*i*g-t*l*g)*A,e[12]=T*A,e[13]=(h*v*s-_*u*s+_*i*p-t*v*p-h*i*m+t*u*m)*A,e[14]=(_*l*s-o*v*s-_*i*c+t*v*c+o*i*m-t*l*m)*A,e[15]=(o*u*s-h*l*s+h*i*c-t*u*c-o*i*p+t*l*p)*A,this}scale(e){const t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),r=1-i,o=e.x,l=e.y,c=e.z,d=r*o,h=r*l;return this.set(d*o+i,d*l-s*c,d*c+s*l,0,d*l+s*c,h*l+i,h*c-s*o,0,d*c-s*l,h*c+s*o,r*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,o){return this.set(1,i,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,r=t._x,o=t._y,l=t._z,c=t._w,d=r+r,h=o+o,u=l+l,p=r*d,g=r*h,_=r*u,v=o*h,m=o*u,f=l*u,y=c*d,M=c*h,w=c*u,T=i.x,R=i.y,A=i.z;return s[0]=(1-(v+f))*T,s[1]=(g+w)*T,s[2]=(_-M)*T,s[3]=0,s[4]=(g-w)*R,s[5]=(1-(p+f))*R,s[6]=(m+y)*R,s[7]=0,s[8]=(_+M)*A,s[9]=(m-y)*A,s[10]=(1-(p+v))*A,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;if(e.x=s[12],e.y=s[13],e.z=s[14],this.determinant()===0)return i.set(1,1,1),t.identity(),this;let r=_i.set(s[0],s[1],s[2]).length();const o=_i.set(s[4],s[5],s[6]).length(),l=_i.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),en.copy(this);const d=1/r,h=1/o,u=1/l;return en.elements[0]*=d,en.elements[1]*=d,en.elements[2]*=d,en.elements[4]*=h,en.elements[5]*=h,en.elements[6]*=h,en.elements[8]*=u,en.elements[9]*=u,en.elements[10]*=u,t.setFromRotationMatrix(en),i.x=r,i.y=o,i.z=l,this}makePerspective(e,t,i,s,r,o,l=un,c=!1){const d=this.elements,h=2*r/(t-e),u=2*r/(i-s),p=(t+e)/(t-e),g=(i+s)/(i-s);let _,v;if(c)_=r/(o-r),v=o*r/(o-r);else if(l===un)_=-(o+r)/(o-r),v=-2*o*r/(o-r);else if(l===Ks)_=-o/(o-r),v=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+l);return d[0]=h,d[4]=0,d[8]=p,d[12]=0,d[1]=0,d[5]=u,d[9]=g,d[13]=0,d[2]=0,d[6]=0,d[10]=_,d[14]=v,d[3]=0,d[7]=0,d[11]=-1,d[15]=0,this}makeOrthographic(e,t,i,s,r,o,l=un,c=!1){const d=this.elements,h=2/(t-e),u=2/(i-s),p=-(t+e)/(t-e),g=-(i+s)/(i-s);let _,v;if(c)_=1/(o-r),v=o/(o-r);else if(l===un)_=-2/(o-r),v=-(o+r)/(o-r);else if(l===Ks)_=-1/(o-r),v=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+l);return d[0]=h,d[4]=0,d[8]=0,d[12]=p,d[1]=0,d[5]=u,d[9]=0,d[13]=g,d[2]=0,d[6]=0,d[10]=_,d[14]=v,d[3]=0,d[7]=0,d[11]=0,d[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const _i=new $,en=new yt,Pf=new $(0,0,0),Lf=new $(1,1,1),zn=new $,bs=new $,Vt=new $,al=new yt,ol=new rs;class In{constructor(e=0,t=0,i=0,s=In.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,r=s[0],o=s[4],l=s[8],c=s[1],d=s[5],h=s[9],u=s[2],p=s[6],g=s[10];switch(t){case"XYZ":this._y=Math.asin(Ze(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,g),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(p,d),this._z=0);break;case"YXZ":this._x=Math.asin(-Ze(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(l,g),this._z=Math.atan2(c,d)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ze(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-u,g),this._z=Math.atan2(-o,d)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Ze(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(p,g),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,d));break;case"YZX":this._z=Math.asin(Ze(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,d),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(l,g));break;case"XZY":this._z=Math.asin(-Ze(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(p,d),this._y=Math.atan2(l,r)):(this._x=Math.atan2(-h,g),this._y=0);break;default:Ge("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return al.makeRotationFromQuaternion(e),this.setFromRotationMatrix(al,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ol.setFromEuler(this),this.setFromQuaternion(ol,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}In.DEFAULT_ORDER="XYZ";class kc{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Df=0;const ll=new $,vi=new rs,Mn=new yt,ys=new $,Hi=new $,If=new $,Uf=new rs,cl=new $(1,0,0),dl=new $(0,1,0),ul=new $(0,0,1),hl={type:"added"},Ff={type:"removed"},bi={type:"childadded",child:null},Cr={type:"childremoved",child:null};class Ht extends Fi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Df++}),this.uuid=ss(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ht.DEFAULT_UP.clone();const e=new $,t=new In,i=new rs,s=new $(1,1,1);function r(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new yt},normalMatrix:{value:new We}}),this.matrix=new yt,this.matrixWorld=new yt,this.matrixAutoUpdate=Ht.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ht.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new kc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return vi.setFromAxisAngle(e,t),this.quaternion.multiply(vi),this}rotateOnWorldAxis(e,t){return vi.setFromAxisAngle(e,t),this.quaternion.premultiply(vi),this}rotateX(e){return this.rotateOnAxis(cl,e)}rotateY(e){return this.rotateOnAxis(dl,e)}rotateZ(e){return this.rotateOnAxis(ul,e)}translateOnAxis(e,t){return ll.copy(e).applyQuaternion(this.quaternion),this.position.add(ll.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(cl,e)}translateY(e){return this.translateOnAxis(dl,e)}translateZ(e){return this.translateOnAxis(ul,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Mn.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?ys.copy(e):ys.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),Hi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Mn.lookAt(Hi,ys,this.up):Mn.lookAt(ys,Hi,this.up),this.quaternion.setFromRotationMatrix(Mn),s&&(Mn.extractRotation(s.matrixWorld),vi.setFromRotationMatrix(Mn),this.quaternion.premultiply(vi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(nt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(hl),bi.child=e,this.dispatchEvent(bi),bi.child=null):nt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Ff),Cr.child=e,this.dispatchEvent(Cr),Cr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Mn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Mn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Mn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(hl),bi.child=e,this.dispatchEvent(bi),bi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Hi,e,If),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Hi,Uf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(l=>({...l,boundingBox:l.boundingBox?l.boundingBox.toJSON():void 0,boundingSphere:l.boundingSphere?l.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(l=>({...l})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(l,c){return l[c.uuid]===void 0&&(l[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const l=this.geometry.parameters;if(l!==void 0&&l.shapes!==void 0){const c=l.shapes;if(Array.isArray(c))for(let d=0,h=c.length;d<h;d++){const u=c[d];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const l=[];for(let c=0,d=this.material.length;c<d;c++)l.push(r(e.materials,this.material[c]));s.material=l}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let l=0;l<this.children.length;l++)s.children.push(this.children[l].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let l=0;l<this.animations.length;l++){const c=this.animations[l];s.animations.push(r(e.animations,c))}}if(t){const l=o(e.geometries),c=o(e.materials),d=o(e.textures),h=o(e.images),u=o(e.shapes),p=o(e.skeletons),g=o(e.animations),_=o(e.nodes);l.length>0&&(i.geometries=l),c.length>0&&(i.materials=c),d.length>0&&(i.textures=d),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),p.length>0&&(i.skeletons=p),g.length>0&&(i.animations=g),_.length>0&&(i.nodes=_)}return i.object=s,i;function o(l){const c=[];for(const d in l){const h=l[d];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}Ht.DEFAULT_UP=new $(0,1,0);Ht.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ht.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const tn=new $,En=new $,Rr=new $,Tn=new $,yi=new $,wi=new $,fl=new $,Nr=new $,Pr=new $,Lr=new $,Dr=new _t,Ir=new _t,Ur=new _t;class rn{constructor(e=new $,t=new $,i=new $){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),tn.subVectors(e,t),s.cross(tn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){tn.subVectors(s,t),En.subVectors(i,t),Rr.subVectors(e,t);const o=tn.dot(tn),l=tn.dot(En),c=tn.dot(Rr),d=En.dot(En),h=En.dot(Rr),u=o*d-l*l;if(u===0)return r.set(0,0,0),null;const p=1/u,g=(d*c-l*h)*p,_=(o*h-l*c)*p;return r.set(1-g-_,_,g)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,Tn)===null?!1:Tn.x>=0&&Tn.y>=0&&Tn.x+Tn.y<=1}static getInterpolation(e,t,i,s,r,o,l,c){return this.getBarycoord(e,t,i,s,Tn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Tn.x),c.addScaledVector(o,Tn.y),c.addScaledVector(l,Tn.z),c)}static getInterpolatedAttribute(e,t,i,s,r,o){return Dr.setScalar(0),Ir.setScalar(0),Ur.setScalar(0),Dr.fromBufferAttribute(e,t),Ir.fromBufferAttribute(e,i),Ur.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(Dr,r.x),o.addScaledVector(Ir,r.y),o.addScaledVector(Ur,r.z),o}static isFrontFacing(e,t,i,s){return tn.subVectors(i,t),En.subVectors(e,t),tn.cross(En).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return tn.subVectors(this.c,this.b),En.subVectors(this.a,this.b),tn.cross(En).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return rn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return rn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return rn.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return rn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return rn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,r=this.c;let o,l;yi.subVectors(s,i),wi.subVectors(r,i),Nr.subVectors(e,i);const c=yi.dot(Nr),d=wi.dot(Nr);if(c<=0&&d<=0)return t.copy(i);Pr.subVectors(e,s);const h=yi.dot(Pr),u=wi.dot(Pr);if(h>=0&&u<=h)return t.copy(s);const p=c*u-h*d;if(p<=0&&c>=0&&h<=0)return o=c/(c-h),t.copy(i).addScaledVector(yi,o);Lr.subVectors(e,r);const g=yi.dot(Lr),_=wi.dot(Lr);if(_>=0&&g<=_)return t.copy(r);const v=g*d-c*_;if(v<=0&&d>=0&&_<=0)return l=d/(d-_),t.copy(i).addScaledVector(wi,l);const m=h*_-g*u;if(m<=0&&u-h>=0&&g-_>=0)return fl.subVectors(r,s),l=(u-h)/(u-h+(g-_)),t.copy(s).addScaledVector(fl,l);const f=1/(m+v+p);return o=v*f,l=p*f,t.copy(i).addScaledVector(yi,o).addScaledVector(wi,l)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Oc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Vn={h:0,s:0,l:0},ws={h:0,s:0,l:0};function Fr(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class dt{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=$t){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,et.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=et.workingColorSpace){return this.r=e,this.g=t,this.b=i,et.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=et.workingColorSpace){if(e=wf(e,1),t=Ze(t,0,1),i=Ze(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,o=2*i-r;this.r=Fr(o,r,e+1/3),this.g=Fr(o,r,e),this.b=Fr(o,r,e-1/3)}return et.colorSpaceToWorking(this,s),this}setStyle(e,t=$t){function i(r){r!==void 0&&parseFloat(r)<1&&Ge("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const o=s[1],l=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ge("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);Ge("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=$t){const i=Oc[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Ge("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Nn(e.r),this.g=Nn(e.g),this.b=Nn(e.b),this}copyLinearToSRGB(e){return this.r=Ci(e.r),this.g=Ci(e.g),this.b=Ci(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=$t){return et.workingToColorSpace(At.copy(this),e),Math.round(Ze(At.r*255,0,255))*65536+Math.round(Ze(At.g*255,0,255))*256+Math.round(Ze(At.b*255,0,255))}getHexString(e=$t){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=et.workingColorSpace){et.workingToColorSpace(At.copy(this),t);const i=At.r,s=At.g,r=At.b,o=Math.max(i,s,r),l=Math.min(i,s,r);let c,d;const h=(l+o)/2;if(l===o)c=0,d=0;else{const u=o-l;switch(d=h<=.5?u/(o+l):u/(2-o-l),o){case i:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-i)/u+2;break;case r:c=(i-s)/u+4;break}c/=6}return e.h=c,e.s=d,e.l=h,e}getRGB(e,t=et.workingColorSpace){return et.workingToColorSpace(At.copy(this),t),e.r=At.r,e.g=At.g,e.b=At.b,e}getStyle(e=$t){et.workingToColorSpace(At.copy(this),e);const t=At.r,i=At.g,s=At.b;return e!==$t?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(Vn),this.setHSL(Vn.h+e,Vn.s+t,Vn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Vn),e.getHSL(ws);const i=_r(Vn.h,ws.h,t),s=_r(Vn.s,ws.s,t),r=_r(Vn.l,ws.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const At=new dt;dt.NAMES=Oc;let kf=0;class ir extends Fi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:kf++}),this.uuid=ss(),this.name="",this.type="Material",this.blending=Ai,this.side=qn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ta,this.blendDst=na,this.blendEquation=ii,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new dt(0,0,0),this.blendAlpha=0,this.depthFunc=Ni,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Jo,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=fi,this.stencilZFail=fi,this.stencilZPass=fi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){Ge(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Ge(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Ai&&(i.blending=this.blending),this.side!==qn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==ta&&(i.blendSrc=this.blendSrc),this.blendDst!==na&&(i.blendDst=this.blendDst),this.blendEquation!==ii&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ni&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Jo&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==fi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==fi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==fi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const o=[];for(const l in r){const c=r[l];delete c.metadata,o.push(c)}return o}if(t){const r=s(e.textures),o=s(e.images);r.length>0&&(i.textures=r),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Bc extends ir{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new dt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new In,this.combine=vc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const vt=new $,Ss=new at;let Of=0;class mn{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Of++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Qo,this.updateRanges=[],this.gpuType=dn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Ss.fromBufferAttribute(this,t),Ss.applyMatrix3(e),this.setXY(t,Ss.x,Ss.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)vt.fromBufferAttribute(this,t),vt.applyMatrix3(e),this.setXYZ(t,vt.x,vt.y,vt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)vt.fromBufferAttribute(this,t),vt.applyMatrix4(e),this.setXYZ(t,vt.x,vt.y,vt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)vt.fromBufferAttribute(this,t),vt.applyNormalMatrix(e),this.setXYZ(t,vt.x,vt.y,vt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)vt.fromBufferAttribute(this,t),vt.transformDirection(e),this.setXYZ(t,vt.x,vt.y,vt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=zi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=kt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=zi(t,this.array)),t}setX(e,t){return this.normalized&&(t=kt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=zi(t,this.array)),t}setY(e,t){return this.normalized&&(t=kt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=zi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=kt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=zi(t,this.array)),t}setW(e,t){return this.normalized&&(t=kt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=kt(t,this.array),i=kt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=kt(t,this.array),i=kt(i,this.array),s=kt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=kt(t,this.array),i=kt(i,this.array),s=kt(s,this.array),r=kt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Qo&&(e.usage=this.usage),e}}class jc extends mn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class zc extends mn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class Pn extends mn{constructor(e,t,i){super(new Float32Array(e),t,i)}}let Bf=0;const qt=new yt,kr=new Ht,Si=new $,Gt=new as,Wi=new as,Mt=new $;class Un extends Fi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Bf++}),this.uuid=ss(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Uc(e)?zc:jc)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new We().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return qt.makeRotationFromQuaternion(e),this.applyMatrix4(qt),this}rotateX(e){return qt.makeRotationX(e),this.applyMatrix4(qt),this}rotateY(e){return qt.makeRotationY(e),this.applyMatrix4(qt),this}rotateZ(e){return qt.makeRotationZ(e),this.applyMatrix4(qt),this}translate(e,t,i){return qt.makeTranslation(e,t,i),this.applyMatrix4(qt),this}scale(e,t,i){return qt.makeScale(e,t,i),this.applyMatrix4(qt),this}lookAt(e){return kr.lookAt(e),kr.updateMatrix(),this.applyMatrix4(kr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Si).negate(),this.translate(Si.x,Si.y,Si.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const o=e[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Pn(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Ge("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new as);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){nt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new $(-1/0,-1/0,-1/0),new $(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const r=t[i];Gt.setFromBufferAttribute(r),this.morphTargetsRelative?(Mt.addVectors(this.boundingBox.min,Gt.min),this.boundingBox.expandByPoint(Mt),Mt.addVectors(this.boundingBox.max,Gt.max),this.boundingBox.expandByPoint(Mt)):(this.boundingBox.expandByPoint(Gt.min),this.boundingBox.expandByPoint(Gt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&nt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new fo);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){nt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new $,1/0);return}if(e){const i=this.boundingSphere.center;if(Gt.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){const l=t[r];Wi.setFromBufferAttribute(l),this.morphTargetsRelative?(Mt.addVectors(Gt.min,Wi.min),Gt.expandByPoint(Mt),Mt.addVectors(Gt.max,Wi.max),Gt.expandByPoint(Mt)):(Gt.expandByPoint(Wi.min),Gt.expandByPoint(Wi.max))}Gt.getCenter(i);let s=0;for(let r=0,o=e.count;r<o;r++)Mt.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(Mt));if(t)for(let r=0,o=t.length;r<o;r++){const l=t[r],c=this.morphTargetsRelative;for(let d=0,h=l.count;d<h;d++)Mt.fromBufferAttribute(l,d),c&&(Si.fromBufferAttribute(e,d),Mt.add(Si)),s=Math.max(s,i.distanceToSquared(Mt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&nt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){nt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new mn(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),l=[],c=[];for(let B=0;B<i.count;B++)l[B]=new $,c[B]=new $;const d=new $,h=new $,u=new $,p=new at,g=new at,_=new at,v=new $,m=new $;function f(B,b,E){d.fromBufferAttribute(i,B),h.fromBufferAttribute(i,b),u.fromBufferAttribute(i,E),p.fromBufferAttribute(r,B),g.fromBufferAttribute(r,b),_.fromBufferAttribute(r,E),h.sub(d),u.sub(d),g.sub(p),_.sub(p);const N=1/(g.x*_.y-_.x*g.y);isFinite(N)&&(v.copy(h).multiplyScalar(_.y).addScaledVector(u,-g.y).multiplyScalar(N),m.copy(u).multiplyScalar(g.x).addScaledVector(h,-_.x).multiplyScalar(N),l[B].add(v),l[b].add(v),l[E].add(v),c[B].add(m),c[b].add(m),c[E].add(m))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let B=0,b=y.length;B<b;++B){const E=y[B],N=E.start,U=E.count;for(let D=N,P=N+U;D<P;D+=3)f(e.getX(D+0),e.getX(D+1),e.getX(D+2))}const M=new $,w=new $,T=new $,R=new $;function A(B){T.fromBufferAttribute(s,B),R.copy(T);const b=l[B];M.copy(b),M.sub(T.multiplyScalar(T.dot(b))).normalize(),w.crossVectors(R,b);const N=w.dot(c[B])<0?-1:1;o.setXYZW(B,M.x,M.y,M.z,N)}for(let B=0,b=y.length;B<b;++B){const E=y[B],N=E.start,U=E.count;for(let D=N,P=N+U;D<P;D+=3)A(e.getX(D+0)),A(e.getX(D+1)),A(e.getX(D+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new mn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let p=0,g=i.count;p<g;p++)i.setXYZ(p,0,0,0);const s=new $,r=new $,o=new $,l=new $,c=new $,d=new $,h=new $,u=new $;if(e)for(let p=0,g=e.count;p<g;p+=3){const _=e.getX(p+0),v=e.getX(p+1),m=e.getX(p+2);s.fromBufferAttribute(t,_),r.fromBufferAttribute(t,v),o.fromBufferAttribute(t,m),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,v),d.fromBufferAttribute(i,m),l.add(h),c.add(h),d.add(h),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(v,c.x,c.y,c.z),i.setXYZ(m,d.x,d.y,d.z)}else for(let p=0,g=t.count;p<g;p+=3)s.fromBufferAttribute(t,p+0),r.fromBufferAttribute(t,p+1),o.fromBufferAttribute(t,p+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),i.setXYZ(p+0,h.x,h.y,h.z),i.setXYZ(p+1,h.x,h.y,h.z),i.setXYZ(p+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Mt.fromBufferAttribute(e,t),Mt.normalize(),e.setXYZ(t,Mt.x,Mt.y,Mt.z)}toNonIndexed(){function e(l,c){const d=l.array,h=l.itemSize,u=l.normalized,p=new d.constructor(c.length*h);let g=0,_=0;for(let v=0,m=c.length;v<m;v++){l.isInterleavedBufferAttribute?g=c[v]*l.data.stride+l.offset:g=c[v]*h;for(let f=0;f<h;f++)p[_++]=d[g++]}return new mn(p,h,u)}if(this.index===null)return Ge("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Un,i=this.index.array,s=this.attributes;for(const l in s){const c=s[l],d=e(c,i);t.setAttribute(l,d)}const r=this.morphAttributes;for(const l in r){const c=[],d=r[l];for(let h=0,u=d.length;h<u;h++){const p=d[h],g=e(p,i);c.push(g)}t.morphAttributes[l]=c}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let l=0,c=o.length;l<c;l++){const d=o[l];t.addGroup(d.start,d.count,d.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const d in c)c[d]!==void 0&&(e[d]=c[d]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const c in i){const d=i[c];e.data.attributes[c]=d.toJSON(e.data)}const s={};let r=!1;for(const c in this.morphAttributes){const d=this.morphAttributes[c],h=[];for(let u=0,p=d.length;u<p;u++){const g=d[u];h.push(g.toJSON(e.data))}h.length>0&&(s[c]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const l=this.boundingSphere;return l!==null&&(e.data.boundingSphere=l.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const d in s){const h=s[d];this.setAttribute(d,h.clone(t))}const r=e.morphAttributes;for(const d in r){const h=[],u=r[d];for(let p=0,g=u.length;p<g;p++)h.push(u[p].clone(t));this.morphAttributes[d]=h}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let d=0,h=o.length;d<h;d++){const u=o[d];this.addGroup(u.start,u.count,u.materialIndex)}const l=e.boundingBox;l!==null&&(this.boundingBox=l.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const pl=new yt,Jn=new Nf,Ms=new fo,ml=new $,Es=new $,Ts=new $,As=new $,Or=new $,Cs=new $,gl=new $,Rs=new $;class _n extends Ht{constructor(e=new Un,t=new Bc){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const l=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[l]=r}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const l=this.morphTargetInfluences;if(r&&l){Cs.set(0,0,0);for(let c=0,d=r.length;c<d;c++){const h=l[c],u=r[c];h!==0&&(Or.fromBufferAttribute(u,e),o?Cs.addScaledVector(Or,h):Cs.addScaledVector(Or.sub(t),h))}t.add(Cs)}return t}raycast(e,t){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ms.copy(i.boundingSphere),Ms.applyMatrix4(r),Jn.copy(e.ray).recast(e.near),!(Ms.containsPoint(Jn.origin)===!1&&(Jn.intersectSphere(Ms,ml)===null||Jn.origin.distanceToSquared(ml)>(e.far-e.near)**2))&&(pl.copy(r).invert(),Jn.copy(e.ray).applyMatrix4(pl),!(i.boundingBox!==null&&Jn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Jn)))}_computeIntersections(e,t,i){let s;const r=this.geometry,o=this.material,l=r.index,c=r.attributes.position,d=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,p=r.groups,g=r.drawRange;if(l!==null)if(Array.isArray(o))for(let _=0,v=p.length;_<v;_++){const m=p[_],f=o[m.materialIndex],y=Math.max(m.start,g.start),M=Math.min(l.count,Math.min(m.start+m.count,g.start+g.count));for(let w=y,T=M;w<T;w+=3){const R=l.getX(w),A=l.getX(w+1),B=l.getX(w+2);s=Ns(this,f,e,i,d,h,u,R,A,B),s&&(s.faceIndex=Math.floor(w/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const _=Math.max(0,g.start),v=Math.min(l.count,g.start+g.count);for(let m=_,f=v;m<f;m+=3){const y=l.getX(m),M=l.getX(m+1),w=l.getX(m+2);s=Ns(this,o,e,i,d,h,u,y,M,w),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let _=0,v=p.length;_<v;_++){const m=p[_],f=o[m.materialIndex],y=Math.max(m.start,g.start),M=Math.min(c.count,Math.min(m.start+m.count,g.start+g.count));for(let w=y,T=M;w<T;w+=3){const R=w,A=w+1,B=w+2;s=Ns(this,f,e,i,d,h,u,R,A,B),s&&(s.faceIndex=Math.floor(w/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const _=Math.max(0,g.start),v=Math.min(c.count,g.start+g.count);for(let m=_,f=v;m<f;m+=3){const y=m,M=m+1,w=m+2;s=Ns(this,o,e,i,d,h,u,y,M,w),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function jf(n,e,t,i,s,r,o,l){let c;if(e.side===Bt?c=i.intersectTriangle(o,r,s,!0,l):c=i.intersectTriangle(s,r,o,e.side===qn,l),c===null)return null;Rs.copy(l),Rs.applyMatrix4(n.matrixWorld);const d=t.ray.origin.distanceTo(Rs);return d<t.near||d>t.far?null:{distance:d,point:Rs.clone(),object:n}}function Ns(n,e,t,i,s,r,o,l,c,d){n.getVertexPosition(l,Es),n.getVertexPosition(c,Ts),n.getVertexPosition(d,As);const h=jf(n,e,t,i,Es,Ts,As,gl);if(h){const u=new $;rn.getBarycoord(gl,Es,Ts,As,u),s&&(h.uv=rn.getInterpolatedAttribute(s,l,c,d,u,new at)),r&&(h.uv1=rn.getInterpolatedAttribute(r,l,c,d,u,new at)),o&&(h.normal=rn.getInterpolatedAttribute(o,l,c,d,u,new $),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const p={a:l,b:c,c:d,normal:new $,materialIndex:0};rn.getNormal(Es,Ts,As,p.normal),h.face=p,h.barycoord=u}return h}class os extends Un{constructor(e=1,t=1,i=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:o};const l=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const c=[],d=[],h=[],u=[];let p=0,g=0;_("z","y","x",-1,-1,i,t,e,o,r,0),_("z","y","x",1,-1,i,t,-e,o,r,1),_("x","z","y",1,1,e,i,t,s,o,2),_("x","z","y",1,-1,e,i,-t,s,o,3),_("x","y","z",1,-1,e,t,i,s,r,4),_("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new Pn(d,3)),this.setAttribute("normal",new Pn(h,3)),this.setAttribute("uv",new Pn(u,2));function _(v,m,f,y,M,w,T,R,A,B,b){const E=w/A,N=T/B,U=w/2,D=T/2,P=R/2,I=A+1,k=B+1;let j=0,W=0;const ee=new $;for(let Q=0;Q<k;Q++){const ne=Q*N-D;for(let Se=0;Se<I;Se++){const ve=Se*E-U;ee[v]=ve*y,ee[m]=ne*M,ee[f]=P,d.push(ee.x,ee.y,ee.z),ee[v]=0,ee[m]=0,ee[f]=R>0?1:-1,h.push(ee.x,ee.y,ee.z),u.push(Se/A),u.push(1-Q/B),j+=1}}for(let Q=0;Q<B;Q++)for(let ne=0;ne<A;ne++){const Se=p+ne+I*Q,ve=p+ne+I*(Q+1),oe=p+(ne+1)+I*(Q+1),ue=p+(ne+1)+I*Q;c.push(Se,ve,ue),c.push(ve,oe,ue),W+=6}l.addGroup(g,W,b),g+=W,p+=j}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new os(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Ii(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(Ge("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function Lt(n){const e={};for(let t=0;t<n.length;t++){const i=Ii(n[t]);for(const s in i)e[s]=i[s]}return e}function zf(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Vc(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:et.workingColorSpace}const Vf={clone:Ii,merge:Lt};var Gf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Hf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class on extends ir{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Gf,this.fragmentShader=Hf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ii(e.uniforms),this.uniformsGroups=zf(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class po extends Ht{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new yt,this.projectionMatrix=new yt,this.projectionMatrixInverse=new yt,this.coordinateSystem=un,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Gn=new $,xl=new at,_l=new at;class sn extends po{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Xa*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(xr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Xa*2*Math.atan(Math.tan(xr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Gn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Gn.x,Gn.y).multiplyScalar(-e/Gn.z),Gn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Gn.x,Gn.y).multiplyScalar(-e/Gn.z)}getViewSize(e,t){return this.getViewBounds(e,xl,_l),t.subVectors(_l,xl)}setViewOffset(e,t,i,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(xr*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,d=o.fullHeight;r+=o.offsetX*s/c,t-=o.offsetY*i/d,s*=o.width/c,i*=o.height/d}const l=this.filmOffset;l!==0&&(r+=e*l/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Mi=-90,Ei=1;class Wf extends Ht{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new sn(Mi,Ei,e,t);s.layers=this.layers,this.add(s);const r=new sn(Mi,Ei,e,t);r.layers=this.layers,this.add(r);const o=new sn(Mi,Ei,e,t);o.layers=this.layers,this.add(o);const l=new sn(Mi,Ei,e,t);l.layers=this.layers,this.add(l);const c=new sn(Mi,Ei,e,t);c.layers=this.layers,this.add(c);const d=new sn(Mi,Ei,e,t);d.layers=this.layers,this.add(d)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,r,o,l,c]=t;for(const d of t)this.remove(d);if(e===un)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),l.up.set(0,1,0),l.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Ks)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),l.up.set(0,-1,0),l.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const d of t)this.add(d),d.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,o,l,c,d,h]=this.children,u=e.getRenderTarget(),p=e.getActiveCubeFace(),g=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,r),e.setRenderTarget(i,1,s),e.render(t,o),e.setRenderTarget(i,2,s),e.render(t,l),e.setRenderTarget(i,3,s),e.render(t,c),e.setRenderTarget(i,4,s),e.render(t,d),i.texture.generateMipmaps=v,e.setRenderTarget(i,5,s),e.render(t,h),e.setRenderTarget(u,p,g),e.xr.enabled=_,i.texture.needsPMREMUpdate=!0}}class Gc extends Dt{constructor(e=[],t=ci,i,s,r,o,l,c,d,h){super(e,t,i,s,r,o,l,c,d,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Hc extends pn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Gc(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new os(5,5,5),r=new on({name:"CubemapFromEquirect",uniforms:Ii(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Bt,blending:Rn});r.uniforms.tEquirect.value=t;const o=new _n(s,r),l=t.minFilter;return t.minFilter===ri&&(t.minFilter=Nt),new Wf(1,10,this).update(e,o),t.minFilter=l,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,s);e.setRenderTarget(r)}}class Ps extends Ht{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Xf={type:"move"};class Br{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ps,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ps,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new $,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new $),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ps,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new $,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new $),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,o=null;const l=this._targetRay,c=this._grip,d=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(d&&e.hand){o=!0;for(const v of e.hand.values()){const m=t.getJointPose(v,i),f=this._getHandJoint(d,v);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const h=d.joints["index-finger-tip"],u=d.joints["thumb-tip"],p=h.position.distanceTo(u.position),g=.02,_=.005;d.inputState.pinching&&p>g+_?(d.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!d.inputState.pinching&&p<=g-_&&(d.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));l!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,this.dispatchEvent(Xf)))}return l!==null&&(l.visible=s!==null),c!==null&&(c.visible=r!==null),d!==null&&(d.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Ps;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class qf extends Ht{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new In,this.environmentIntensity=1,this.environmentRotation=new In,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class $f extends Dt{constructor(e=null,t=1,i=1,s,r,o,l,c,d=Et,h=Et,u,p){super(null,o,l,c,d,h,s,r,u,p),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const jr=new $,Yf=new $,Kf=new We;class ni{constructor(e=new $(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=jr.subVectors(i,t).cross(Yf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(jr),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||Kf.getNormalMatrix(e),s=this.coplanarPoint(jr).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Qn=new fo,Zf=new at(.5,.5),Ls=new $;class Wc{constructor(e=new ni,t=new ni,i=new ni,s=new ni,r=new ni,o=new ni){this.planes=[e,t,i,s,r,o]}set(e,t,i,s,r,o){const l=this.planes;return l[0].copy(e),l[1].copy(t),l[2].copy(i),l[3].copy(s),l[4].copy(r),l[5].copy(o),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=un,i=!1){const s=this.planes,r=e.elements,o=r[0],l=r[1],c=r[2],d=r[3],h=r[4],u=r[5],p=r[6],g=r[7],_=r[8],v=r[9],m=r[10],f=r[11],y=r[12],M=r[13],w=r[14],T=r[15];if(s[0].setComponents(d-o,g-h,f-_,T-y).normalize(),s[1].setComponents(d+o,g+h,f+_,T+y).normalize(),s[2].setComponents(d+l,g+u,f+v,T+M).normalize(),s[3].setComponents(d-l,g-u,f-v,T-M).normalize(),i)s[4].setComponents(c,p,m,w).normalize(),s[5].setComponents(d-c,g-p,f-m,T-w).normalize();else if(s[4].setComponents(d-c,g-p,f-m,T-w).normalize(),t===un)s[5].setComponents(d+c,g+p,f+m,T+w).normalize();else if(t===Ks)s[5].setComponents(c,p,m,w).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Qn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Qn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Qn)}intersectsSprite(e){Qn.center.set(0,0,0);const t=Zf.distanceTo(e.center);return Qn.radius=.7071067811865476+t,Qn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Qn)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(Ls.x=s.normal.x>0?e.max.x:e.min.x,Ls.y=s.normal.y>0?e.max.y:e.min.y,Ls.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Ls)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class ts extends Dt{constructor(e,t,i=xn,s,r,o,l=Et,c=Et,d,h=Dn,u=1){if(h!==Dn&&h!==ai)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const p={width:e,height:t,depth:u};super(p,s,r,o,l,c,h,i,d),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new ho(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Jf extends ts{constructor(e,t=xn,i=ci,s,r,o=Et,l=Et,c,d=Dn){const h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,i,s,r,o,l,c,d),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Xc extends Dt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class ls extends Un{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const r=e/2,o=t/2,l=Math.floor(i),c=Math.floor(s),d=l+1,h=c+1,u=e/l,p=t/c,g=[],_=[],v=[],m=[];for(let f=0;f<h;f++){const y=f*p-o;for(let M=0;M<d;M++){const w=M*u-r;_.push(w,-y,0),v.push(0,0,1),m.push(M/l),m.push(1-f/c)}}for(let f=0;f<c;f++)for(let y=0;y<l;y++){const M=y+d*f,w=y+d*(f+1),T=y+1+d*(f+1),R=y+1+d*f;g.push(M,w,R),g.push(w,T,R)}this.setIndex(g),this.setAttribute("position",new Pn(_,3)),this.setAttribute("normal",new Pn(v,3)),this.setAttribute("uv",new Pn(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ls(e.width,e.height,e.widthSegments,e.heightSegments)}}class Qf extends on{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class ep extends ir{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=uf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class tp extends ir{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class qc extends po{constructor(e=-1,t=1,i=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,o=i+e,l=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const d=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=d*this.view.offsetX,o=r+d*this.view.width,l-=h*this.view.offsetY,c=l-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,l,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class np extends sn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}function vl(n,e,t,i){const s=ip(i);switch(t){case Lc:return n*e;case Ic:return n*e/s.components*s.byteLength;case ao:return n*e/s.components*s.byteLength;case Li:return n*e*2/s.components*s.byteLength;case oo:return n*e*2/s.components*s.byteLength;case Dc:return n*e*3/s.components*s.byteLength;case an:return n*e*4/s.components*s.byteLength;case lo:return n*e*4/s.components*s.byteLength;case Vs:case Gs:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Hs:case Ws:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case ma:case xa:return Math.max(n,16)*Math.max(e,8)/4;case pa:case ga:return Math.max(n,8)*Math.max(e,8)/2;case _a:case va:case ya:case wa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case ba:case Sa:case Ma:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Ea:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Ta:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Aa:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Ca:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Ra:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Na:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Pa:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case La:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Da:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Ia:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Ua:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Fa:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case ka:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Oa:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Ba:case ja:case za:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Va:case Ga:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Ha:case Wa:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function ip(n){switch(n){case Zt:case Cc:return{byteLength:1,components:1};case Ji:case Rc:case Ln:return{byteLength:2,components:1};case so:case ro:return{byteLength:2,components:4};case xn:case io:case dn:return{byteLength:4,components:1};case Nc:case Pc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:no}}));typeof window<"u"&&(window.__THREE__?Ge("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=no);function $c(){let n=null,e=!1,t=null,i=null;function s(r,o){t(r,o),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function sp(n){const e=new WeakMap;function t(l,c){const d=l.array,h=l.usage,u=d.byteLength,p=n.createBuffer();n.bindBuffer(c,p),n.bufferData(c,d,h),l.onUploadCallback();let g;if(d instanceof Float32Array)g=n.FLOAT;else if(typeof Float16Array<"u"&&d instanceof Float16Array)g=n.HALF_FLOAT;else if(d instanceof Uint16Array)l.isFloat16BufferAttribute?g=n.HALF_FLOAT:g=n.UNSIGNED_SHORT;else if(d instanceof Int16Array)g=n.SHORT;else if(d instanceof Uint32Array)g=n.UNSIGNED_INT;else if(d instanceof Int32Array)g=n.INT;else if(d instanceof Int8Array)g=n.BYTE;else if(d instanceof Uint8Array)g=n.UNSIGNED_BYTE;else if(d instanceof Uint8ClampedArray)g=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+d);return{buffer:p,type:g,bytesPerElement:d.BYTES_PER_ELEMENT,version:l.version,size:u}}function i(l,c,d){const h=c.array,u=c.updateRanges;if(n.bindBuffer(d,l),u.length===0)n.bufferSubData(d,0,h);else{u.sort((g,_)=>g.start-_.start);let p=0;for(let g=1;g<u.length;g++){const _=u[p],v=u[g];v.start<=_.start+_.count+1?_.count=Math.max(_.count,v.start+v.count-_.start):(++p,u[p]=v)}u.length=p+1;for(let g=0,_=u.length;g<_;g++){const v=u[g];n.bufferSubData(d,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(l){return l.isInterleavedBufferAttribute&&(l=l.data),e.get(l)}function r(l){l.isInterleavedBufferAttribute&&(l=l.data);const c=e.get(l);c&&(n.deleteBuffer(c.buffer),e.delete(l))}function o(l,c){if(l.isInterleavedBufferAttribute&&(l=l.data),l.isGLBufferAttribute){const h=e.get(l);(!h||h.version<l.version)&&e.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}const d=e.get(l);if(d===void 0)e.set(l,t(l,c));else if(d.version<l.version){if(d.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(d.buffer,l,c),d.version=l.version}}return{get:s,remove:r,update:o}}var rp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ap=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,op=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,lp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,cp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,dp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,up=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,hp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,fp=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,pp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,mp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,gp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,xp=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,_p=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,vp=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,bp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,yp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,wp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Sp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Mp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Ep=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Tp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Ap=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Cp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Rp=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Np=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Pp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Lp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Dp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ip=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Up="gl_FragColor = linearToOutputTexel( gl_FragColor );",Fp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,kp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Op=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Bp=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,jp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,zp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Vp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Gp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Hp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Wp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Xp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,qp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,$p=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Yp=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Kp=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Zp=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Jp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Qp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,em=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,tm=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,nm=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,im=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return v;
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( vec3( 1.0 ) - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,sm=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,rm=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,am=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,om=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,lm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,cm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,dm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,um=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,hm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,fm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,pm=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,mm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,gm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,xm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,_m=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,vm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,bm=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,ym=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,wm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Sm=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Mm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Em=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Tm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Am=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Cm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Rm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Nm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Pm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Lm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Dm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Im=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Um=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Fm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,km=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Om=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Bm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,jm=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * 6.28318530718;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * 6.28318530718;
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 0, 5, phi ).x + bitangent * vogelDiskSample( 0, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 1, 5, phi ).x + bitangent * vogelDiskSample( 1, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 2, 5, phi ).x + bitangent * vogelDiskSample( 2, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 3, 5, phi ).x + bitangent * vogelDiskSample( 3, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 4, 5, phi ).x + bitangent * vogelDiskSample( 4, 5, phi ).y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadow = step( depth, dp );
			#else
				shadow = step( dp, depth );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,zm=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Vm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Gm=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Hm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Wm=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Xm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,qm=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,$m=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Ym=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Km=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Zm=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Jm=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Qm=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,eg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,tg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ng=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,ig=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const sg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,rg=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ag=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,og=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,lg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,ug=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,hg=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,fg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,pg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,mg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,gg=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,xg=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,_g=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,vg=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,bg=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,yg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,wg=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Sg=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Mg=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Eg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Tg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ag=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Cg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Rg=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ng=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Pg=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Lg=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Dg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Ig=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ug=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Fg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,kg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Xe={alphahash_fragment:rp,alphahash_pars_fragment:ap,alphamap_fragment:op,alphamap_pars_fragment:lp,alphatest_fragment:cp,alphatest_pars_fragment:dp,aomap_fragment:up,aomap_pars_fragment:hp,batching_pars_vertex:fp,batching_vertex:pp,begin_vertex:mp,beginnormal_vertex:gp,bsdfs:xp,iridescence_fragment:_p,bumpmap_pars_fragment:vp,clipping_planes_fragment:bp,clipping_planes_pars_fragment:yp,clipping_planes_pars_vertex:wp,clipping_planes_vertex:Sp,color_fragment:Mp,color_pars_fragment:Ep,color_pars_vertex:Tp,color_vertex:Ap,common:Cp,cube_uv_reflection_fragment:Rp,defaultnormal_vertex:Np,displacementmap_pars_vertex:Pp,displacementmap_vertex:Lp,emissivemap_fragment:Dp,emissivemap_pars_fragment:Ip,colorspace_fragment:Up,colorspace_pars_fragment:Fp,envmap_fragment:kp,envmap_common_pars_fragment:Op,envmap_pars_fragment:Bp,envmap_pars_vertex:jp,envmap_physical_pars_fragment:Zp,envmap_vertex:zp,fog_vertex:Vp,fog_pars_vertex:Gp,fog_fragment:Hp,fog_pars_fragment:Wp,gradientmap_pars_fragment:Xp,lightmap_pars_fragment:qp,lights_lambert_fragment:$p,lights_lambert_pars_fragment:Yp,lights_pars_begin:Kp,lights_toon_fragment:Jp,lights_toon_pars_fragment:Qp,lights_phong_fragment:em,lights_phong_pars_fragment:tm,lights_physical_fragment:nm,lights_physical_pars_fragment:im,lights_fragment_begin:sm,lights_fragment_maps:rm,lights_fragment_end:am,logdepthbuf_fragment:om,logdepthbuf_pars_fragment:lm,logdepthbuf_pars_vertex:cm,logdepthbuf_vertex:dm,map_fragment:um,map_pars_fragment:hm,map_particle_fragment:fm,map_particle_pars_fragment:pm,metalnessmap_fragment:mm,metalnessmap_pars_fragment:gm,morphinstance_vertex:xm,morphcolor_vertex:_m,morphnormal_vertex:vm,morphtarget_pars_vertex:bm,morphtarget_vertex:ym,normal_fragment_begin:wm,normal_fragment_maps:Sm,normal_pars_fragment:Mm,normal_pars_vertex:Em,normal_vertex:Tm,normalmap_pars_fragment:Am,clearcoat_normal_fragment_begin:Cm,clearcoat_normal_fragment_maps:Rm,clearcoat_pars_fragment:Nm,iridescence_pars_fragment:Pm,opaque_fragment:Lm,packing:Dm,premultiplied_alpha_fragment:Im,project_vertex:Um,dithering_fragment:Fm,dithering_pars_fragment:km,roughnessmap_fragment:Om,roughnessmap_pars_fragment:Bm,shadowmap_pars_fragment:jm,shadowmap_pars_vertex:zm,shadowmap_vertex:Vm,shadowmask_pars_fragment:Gm,skinbase_vertex:Hm,skinning_pars_vertex:Wm,skinning_vertex:Xm,skinnormal_vertex:qm,specularmap_fragment:$m,specularmap_pars_fragment:Ym,tonemapping_fragment:Km,tonemapping_pars_fragment:Zm,transmission_fragment:Jm,transmission_pars_fragment:Qm,uv_pars_fragment:eg,uv_pars_vertex:tg,uv_vertex:ng,worldpos_vertex:ig,background_vert:sg,background_frag:rg,backgroundCube_vert:ag,backgroundCube_frag:og,cube_vert:lg,cube_frag:cg,depth_vert:dg,depth_frag:ug,distance_vert:hg,distance_frag:fg,equirect_vert:pg,equirect_frag:mg,linedashed_vert:gg,linedashed_frag:xg,meshbasic_vert:_g,meshbasic_frag:vg,meshlambert_vert:bg,meshlambert_frag:yg,meshmatcap_vert:wg,meshmatcap_frag:Sg,meshnormal_vert:Mg,meshnormal_frag:Eg,meshphong_vert:Tg,meshphong_frag:Ag,meshphysical_vert:Cg,meshphysical_frag:Rg,meshtoon_vert:Ng,meshtoon_frag:Pg,points_vert:Lg,points_frag:Dg,shadow_vert:Ig,shadow_frag:Ug,sprite_vert:Fg,sprite_frag:kg},_e={common:{diffuse:{value:new dt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new We}},envmap:{envMap:{value:null},envMapRotation:{value:new We},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new We}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new We}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new We},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new We},normalScale:{value:new at(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new We},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new We}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new We}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new We}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new dt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new dt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0},uvTransform:{value:new We}},sprite:{diffuse:{value:new dt(16777215)},opacity:{value:1},center:{value:new at(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}}},cn={basic:{uniforms:Lt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.fog]),vertexShader:Xe.meshbasic_vert,fragmentShader:Xe.meshbasic_frag},lambert:{uniforms:Lt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new dt(0)}}]),vertexShader:Xe.meshlambert_vert,fragmentShader:Xe.meshlambert_frag},phong:{uniforms:Lt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new dt(0)},specular:{value:new dt(1118481)},shininess:{value:30}}]),vertexShader:Xe.meshphong_vert,fragmentShader:Xe.meshphong_frag},standard:{uniforms:Lt([_e.common,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.roughnessmap,_e.metalnessmap,_e.fog,_e.lights,{emissive:{value:new dt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag},toon:{uniforms:Lt([_e.common,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.gradientmap,_e.fog,_e.lights,{emissive:{value:new dt(0)}}]),vertexShader:Xe.meshtoon_vert,fragmentShader:Xe.meshtoon_frag},matcap:{uniforms:Lt([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,{matcap:{value:null}}]),vertexShader:Xe.meshmatcap_vert,fragmentShader:Xe.meshmatcap_frag},points:{uniforms:Lt([_e.points,_e.fog]),vertexShader:Xe.points_vert,fragmentShader:Xe.points_frag},dashed:{uniforms:Lt([_e.common,_e.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xe.linedashed_vert,fragmentShader:Xe.linedashed_frag},depth:{uniforms:Lt([_e.common,_e.displacementmap]),vertexShader:Xe.depth_vert,fragmentShader:Xe.depth_frag},normal:{uniforms:Lt([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,{opacity:{value:1}}]),vertexShader:Xe.meshnormal_vert,fragmentShader:Xe.meshnormal_frag},sprite:{uniforms:Lt([_e.sprite,_e.fog]),vertexShader:Xe.sprite_vert,fragmentShader:Xe.sprite_frag},background:{uniforms:{uvTransform:{value:new We},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xe.background_vert,fragmentShader:Xe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new We}},vertexShader:Xe.backgroundCube_vert,fragmentShader:Xe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xe.cube_vert,fragmentShader:Xe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xe.equirect_vert,fragmentShader:Xe.equirect_frag},distance:{uniforms:Lt([_e.common,_e.displacementmap,{referencePosition:{value:new $},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xe.distance_vert,fragmentShader:Xe.distance_frag},shadow:{uniforms:Lt([_e.lights,_e.fog,{color:{value:new dt(0)},opacity:{value:1}}]),vertexShader:Xe.shadow_vert,fragmentShader:Xe.shadow_frag}};cn.physical={uniforms:Lt([cn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new We},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new We},clearcoatNormalScale:{value:new at(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new We},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new We},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new We},sheen:{value:0},sheenColor:{value:new dt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new We},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new We},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new We},transmissionSamplerSize:{value:new at},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new We},attenuationDistance:{value:0},attenuationColor:{value:new dt(0)},specularColor:{value:new dt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new We},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new We},anisotropyVector:{value:new at},anisotropyMap:{value:null},anisotropyMapTransform:{value:new We}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag};const Ds={r:0,b:0,g:0},ei=new In,Og=new yt;function Bg(n,e,t,i,s,r,o){const l=new dt(0);let c=r===!0?0:1,d,h,u=null,p=0,g=null;function _(M){let w=M.isScene===!0?M.background:null;return w&&w.isTexture&&(w=(M.backgroundBlurriness>0?t:e).get(w)),w}function v(M){let w=!1;const T=_(M);T===null?f(l,c):T&&T.isColor&&(f(T,1),w=!0);const R=n.xr.getEnvironmentBlendMode();R==="additive"?i.buffers.color.setClear(0,0,0,1,o):R==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||w)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(M,w){const T=_(w);T&&(T.isCubeTexture||T.mapping===nr)?(h===void 0&&(h=new _n(new os(1,1,1),new on({name:"BackgroundCubeMaterial",uniforms:Ii(cn.backgroundCube.uniforms),vertexShader:cn.backgroundCube.vertexShader,fragmentShader:cn.backgroundCube.fragmentShader,side:Bt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(R,A,B){this.matrixWorld.copyPosition(B.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),ei.copy(w.backgroundRotation),ei.x*=-1,ei.y*=-1,ei.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(ei.y*=-1,ei.z*=-1),h.material.uniforms.envMap.value=T,h.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Og.makeRotationFromEuler(ei)),h.material.toneMapped=et.getTransfer(T.colorSpace)!==rt,(u!==T||p!==T.version||g!==n.toneMapping)&&(h.material.needsUpdate=!0,u=T,p=T.version,g=n.toneMapping),h.layers.enableAll(),M.unshift(h,h.geometry,h.material,0,0,null)):T&&T.isTexture&&(d===void 0&&(d=new _n(new ls(2,2),new on({name:"BackgroundMaterial",uniforms:Ii(cn.background.uniforms),vertexShader:cn.background.vertexShader,fragmentShader:cn.background.fragmentShader,side:qn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),Object.defineProperty(d.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(d)),d.material.uniforms.t2D.value=T,d.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,d.material.toneMapped=et.getTransfer(T.colorSpace)!==rt,T.matrixAutoUpdate===!0&&T.updateMatrix(),d.material.uniforms.uvTransform.value.copy(T.matrix),(u!==T||p!==T.version||g!==n.toneMapping)&&(d.material.needsUpdate=!0,u=T,p=T.version,g=n.toneMapping),d.layers.enableAll(),M.unshift(d,d.geometry,d.material,0,0,null))}function f(M,w){M.getRGB(Ds,Vc(n)),i.buffers.color.setClear(Ds.r,Ds.g,Ds.b,w,o)}function y(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0)}return{getClearColor:function(){return l},setClearColor:function(M,w=1){l.set(M),c=w,f(l,c)},getClearAlpha:function(){return c},setClearAlpha:function(M){c=M,f(l,c)},render:v,addToRenderList:m,dispose:y}}function jg(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=p(null);let r=s,o=!1;function l(E,N,U,D,P){let I=!1;const k=u(D,U,N);r!==k&&(r=k,d(r.object)),I=g(E,D,U,P),I&&_(E,D,U,P),P!==null&&e.update(P,n.ELEMENT_ARRAY_BUFFER),(I||o)&&(o=!1,w(E,N,U,D),P!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(P).buffer))}function c(){return n.createVertexArray()}function d(E){return n.bindVertexArray(E)}function h(E){return n.deleteVertexArray(E)}function u(E,N,U){const D=U.wireframe===!0;let P=i[E.id];P===void 0&&(P={},i[E.id]=P);let I=P[N.id];I===void 0&&(I={},P[N.id]=I);let k=I[D];return k===void 0&&(k=p(c()),I[D]=k),k}function p(E){const N=[],U=[],D=[];for(let P=0;P<t;P++)N[P]=0,U[P]=0,D[P]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:U,attributeDivisors:D,object:E,attributes:{},index:null}}function g(E,N,U,D){const P=r.attributes,I=N.attributes;let k=0;const j=U.getAttributes();for(const W in j)if(j[W].location>=0){const Q=P[W];let ne=I[W];if(ne===void 0&&(W==="instanceMatrix"&&E.instanceMatrix&&(ne=E.instanceMatrix),W==="instanceColor"&&E.instanceColor&&(ne=E.instanceColor)),Q===void 0||Q.attribute!==ne||ne&&Q.data!==ne.data)return!0;k++}return r.attributesNum!==k||r.index!==D}function _(E,N,U,D){const P={},I=N.attributes;let k=0;const j=U.getAttributes();for(const W in j)if(j[W].location>=0){let Q=I[W];Q===void 0&&(W==="instanceMatrix"&&E.instanceMatrix&&(Q=E.instanceMatrix),W==="instanceColor"&&E.instanceColor&&(Q=E.instanceColor));const ne={};ne.attribute=Q,Q&&Q.data&&(ne.data=Q.data),P[W]=ne,k++}r.attributes=P,r.attributesNum=k,r.index=D}function v(){const E=r.newAttributes;for(let N=0,U=E.length;N<U;N++)E[N]=0}function m(E){f(E,0)}function f(E,N){const U=r.newAttributes,D=r.enabledAttributes,P=r.attributeDivisors;U[E]=1,D[E]===0&&(n.enableVertexAttribArray(E),D[E]=1),P[E]!==N&&(n.vertexAttribDivisor(E,N),P[E]=N)}function y(){const E=r.newAttributes,N=r.enabledAttributes;for(let U=0,D=N.length;U<D;U++)N[U]!==E[U]&&(n.disableVertexAttribArray(U),N[U]=0)}function M(E,N,U,D,P,I,k){k===!0?n.vertexAttribIPointer(E,N,U,P,I):n.vertexAttribPointer(E,N,U,D,P,I)}function w(E,N,U,D){v();const P=D.attributes,I=U.getAttributes(),k=N.defaultAttributeValues;for(const j in I){const W=I[j];if(W.location>=0){let ee=P[j];if(ee===void 0&&(j==="instanceMatrix"&&E.instanceMatrix&&(ee=E.instanceMatrix),j==="instanceColor"&&E.instanceColor&&(ee=E.instanceColor)),ee!==void 0){const Q=ee.normalized,ne=ee.itemSize,Se=e.get(ee);if(Se===void 0)continue;const ve=Se.buffer,oe=Se.type,ue=Se.bytesPerElement,X=oe===n.INT||oe===n.UNSIGNED_INT||ee.gpuType===io;if(ee.isInterleavedBufferAttribute){const Z=ee.data,ce=Z.stride,Ue=ee.offset;if(Z.isInstancedInterleavedBuffer){for(let me=0;me<W.locationSize;me++)f(W.location+me,Z.meshPerAttribute);E.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let me=0;me<W.locationSize;me++)m(W.location+me);n.bindBuffer(n.ARRAY_BUFFER,ve);for(let me=0;me<W.locationSize;me++)M(W.location+me,ne/W.locationSize,oe,Q,ce*ue,(Ue+ne/W.locationSize*me)*ue,X)}else{if(ee.isInstancedBufferAttribute){for(let Z=0;Z<W.locationSize;Z++)f(W.location+Z,ee.meshPerAttribute);E.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let Z=0;Z<W.locationSize;Z++)m(W.location+Z);n.bindBuffer(n.ARRAY_BUFFER,ve);for(let Z=0;Z<W.locationSize;Z++)M(W.location+Z,ne/W.locationSize,oe,Q,ne*ue,ne/W.locationSize*Z*ue,X)}}else if(k!==void 0){const Q=k[j];if(Q!==void 0)switch(Q.length){case 2:n.vertexAttrib2fv(W.location,Q);break;case 3:n.vertexAttrib3fv(W.location,Q);break;case 4:n.vertexAttrib4fv(W.location,Q);break;default:n.vertexAttrib1fv(W.location,Q)}}}}y()}function T(){B();for(const E in i){const N=i[E];for(const U in N){const D=N[U];for(const P in D)h(D[P].object),delete D[P];delete N[U]}delete i[E]}}function R(E){if(i[E.id]===void 0)return;const N=i[E.id];for(const U in N){const D=N[U];for(const P in D)h(D[P].object),delete D[P];delete N[U]}delete i[E.id]}function A(E){for(const N in i){const U=i[N];if(U[E.id]===void 0)continue;const D=U[E.id];for(const P in D)h(D[P].object),delete D[P];delete U[E.id]}}function B(){b(),o=!0,r!==s&&(r=s,d(r.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:l,reset:B,resetDefaultState:b,dispose:T,releaseStatesOfGeometry:R,releaseStatesOfProgram:A,initAttributes:v,enableAttribute:m,disableUnusedAttributes:y}}function zg(n,e,t){let i;function s(d){i=d}function r(d,h){n.drawArrays(i,d,h),t.update(h,i,1)}function o(d,h,u){u!==0&&(n.drawArraysInstanced(i,d,h,u),t.update(h,i,u))}function l(d,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,d,0,h,0,u);let g=0;for(let _=0;_<u;_++)g+=h[_];t.update(g,i,1)}function c(d,h,u,p){if(u===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let _=0;_<d.length;_++)o(d[_],h[_],p[_]);else{g.multiDrawArraysInstancedWEBGL(i,d,0,h,0,p,0,u);let _=0;for(let v=0;v<u;v++)_+=h[v]*p[v];t.update(_,i,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=l,this.renderMultiDrawInstances=c}function Vg(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(A){return!(A!==an&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function l(A){const B=A===Ln&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==Zt&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==dn&&!B)}function c(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let d=t.precision!==void 0?t.precision:"highp";const h=c(d);h!==d&&(Ge("WebGLRenderer:",d,"not supported, using",h,"instead."),d=h);const u=t.logarithmicDepthBuffer===!0,p=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),g=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),f=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),M=n.getParameter(n.MAX_VARYING_VECTORS),w=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),T=n.getParameter(n.MAX_SAMPLES),R=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:l,precision:d,logarithmicDepthBuffer:u,reversedDepthBuffer:p,maxTextures:g,maxVertexTextures:_,maxTextureSize:v,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:y,maxVaryings:M,maxFragmentUniforms:w,maxSamples:T,samples:R}}function Gg(n){const e=this;let t=null,i=0,s=!1,r=!1;const o=new ni,l=new We,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,p){const g=u.length!==0||p||i!==0||s;return s=p,i=u.length,g},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,p){t=h(u,p,0)},this.setState=function(u,p,g){const _=u.clippingPlanes,v=u.clipIntersection,m=u.clipShadows,f=n.get(u);if(!s||_===null||_.length===0||r&&!m)r?h(null):d();else{const y=r?0:i,M=y*4;let w=f.clippingState||null;c.value=w,w=h(_,p,M,g);for(let T=0;T!==M;++T)w[T]=t[T];f.clippingState=w,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=y}};function d(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(u,p,g,_){const v=u!==null?u.length:0;let m=null;if(v!==0){if(m=c.value,_!==!0||m===null){const f=g+v*4,y=p.matrixWorldInverse;l.getNormalMatrix(y),(m===null||m.length<f)&&(m=new Float32Array(f));for(let M=0,w=g;M!==v;++M,w+=4)o.copy(u[M]).applyMatrix4(y,l),o.normal.toArray(m,w),m[w+3]=o.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,m}}function Hg(n){let e=new WeakMap;function t(o,l){return l===da?o.mapping=ci:l===ua&&(o.mapping=Pi),o}function i(o){if(o&&o.isTexture){const l=o.mapping;if(l===da||l===ua)if(e.has(o)){const c=e.get(o).texture;return t(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const d=new Hc(c.height);return d.fromEquirectangularTexture(n,o),e.set(o,d),o.addEventListener("dispose",s),t(d.texture,o.mapping)}else return null}}return o}function s(o){const l=o.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function r(){e=new WeakMap}return{get:i,dispose:r}}const Wn=4,bl=[.125,.215,.35,.446,.526,.582],si=20,Wg=256,Xi=new qc,yl=new dt;let zr=null,Vr=0,Gr=0,Hr=!1;const Xg=new $;class wl{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,s=100,r={}){const{size:o=256,position:l=Xg}=r;zr=this._renderer.getRenderTarget(),Vr=this._renderer.getActiveCubeFace(),Gr=this._renderer.getActiveMipmapLevel(),Hr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,i,s,c,l),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=El(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ml(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(zr,Vr,Gr),this._renderer.xr.enabled=Hr,e.scissorTest=!1,Ti(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ci||e.mapping===Pi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),zr=this._renderer.getRenderTarget(),Vr=this._renderer.getActiveCubeFace(),Gr=this._renderer.getActiveMipmapLevel(),Hr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Nt,minFilter:Nt,generateMipmaps:!1,type:Ln,format:an,colorSpace:Di,depthBuffer:!1},s=Sl(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Sl(e,t,i);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=qg(r)),this._blurMaterial=Yg(r,e,t),this._ggxMaterial=$g(r,e,t)}return s}_compileMaterial(e){const t=new _n(new Un,e);this._renderer.compile(t,Xi)}_sceneToCubeUV(e,t,i,s,r){const c=new sn(90,1,t,i),d=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,p=u.autoClear,g=u.toneMapping;u.getClearColor(yl),u.toneMapping=fn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new _n(new os,new Bc({name:"PMREM.Background",side:Bt,depthWrite:!1,depthTest:!1})));const v=this._backgroundBox,m=v.material;let f=!1;const y=e.background;y?y.isColor&&(m.color.copy(y),e.background=null,f=!0):(m.color.copy(yl),f=!0);for(let M=0;M<6;M++){const w=M%3;w===0?(c.up.set(0,d[M],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+h[M],r.y,r.z)):w===1?(c.up.set(0,0,d[M]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+h[M],r.z)):(c.up.set(0,d[M],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+h[M]));const T=this._cubeSize;Ti(s,w*T,M>2?T:0,T,T),u.setRenderTarget(s),f&&u.render(v,c),u.render(e,c)}u.toneMapping=g,u.autoClear=p,e.background=y}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===ci||e.mapping===Pi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=El()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ml());const r=s?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;const l=r.uniforms;l.envMap.value=e;const c=this._cubeSize;Ti(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(o,Xi)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=i}_applyGGXFilter(e,t,i){const s=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,l=this._lodMeshes[i];l.material=o;const c=o.uniforms,d=i/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),u=Math.sqrt(d*d-h*h),p=0+d*1.25,g=u*p,{_lodMax:_}=this,v=this._sizeLods[i],m=3*v*(i>_-Wn?i-_+Wn:0),f=4*(this._cubeSize-v);c.envMap.value=e.texture,c.roughness.value=g,c.mipInt.value=_-t,Ti(r,m,f,3*v,2*v),s.setRenderTarget(r),s.render(l,Xi),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=_-i,Ti(e,m,f,3*v,2*v),s.setRenderTarget(e),s.render(l,Xi)}_blur(e,t,i,s,r){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,s,"latitudinal",r),this._halfBlur(o,e,i,i,s,"longitudinal",r)}_halfBlur(e,t,i,s,r,o,l){const c=this._renderer,d=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&nt("blur direction must be either latitudinal or longitudinal!");const h=3,u=this._lodMeshes[s];u.material=d;const p=d.uniforms,g=this._sizeLods[i]-1,_=isFinite(r)?Math.PI/(2*g):2*Math.PI/(2*si-1),v=r/_,m=isFinite(r)?1+Math.floor(h*v):si;m>si&&Ge(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${si}`);const f=[];let y=0;for(let A=0;A<si;++A){const B=A/v,b=Math.exp(-B*B/2);f.push(b),A===0?y+=b:A<m&&(y+=2*b)}for(let A=0;A<f.length;A++)f[A]=f[A]/y;p.envMap.value=e.texture,p.samples.value=m,p.weights.value=f,p.latitudinal.value=o==="latitudinal",l&&(p.poleAxis.value=l);const{_lodMax:M}=this;p.dTheta.value=_,p.mipInt.value=M-i;const w=this._sizeLods[s],T=3*w*(s>M-Wn?s-M+Wn:0),R=4*(this._cubeSize-w);Ti(t,T,R,3*w,2*w),c.setRenderTarget(t),c.render(u,Xi)}}function qg(n){const e=[],t=[],i=[];let s=n;const r=n-Wn+1+bl.length;for(let o=0;o<r;o++){const l=Math.pow(2,s);e.push(l);let c=1/l;o>n-Wn?c=bl[o-n+Wn-1]:o===0&&(c=0),t.push(c);const d=1/(l-2),h=-d,u=1+d,p=[h,h,u,h,u,u,h,h,u,u,h,u],g=6,_=6,v=3,m=2,f=1,y=new Float32Array(v*_*g),M=new Float32Array(m*_*g),w=new Float32Array(f*_*g);for(let R=0;R<g;R++){const A=R%3*2/3-1,B=R>2?0:-1,b=[A,B,0,A+2/3,B,0,A+2/3,B+1,0,A,B,0,A+2/3,B+1,0,A,B+1,0];y.set(b,v*_*R),M.set(p,m*_*R);const E=[R,R,R,R,R,R];w.set(E,f*_*R)}const T=new Un;T.setAttribute("position",new mn(y,v)),T.setAttribute("uv",new mn(M,m)),T.setAttribute("faceIndex",new mn(w,f)),i.push(new _n(T,null)),s>Wn&&s--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function Sl(n,e,t){const i=new pn(n,e,t);return i.texture.mapping=nr,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Ti(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function $g(n,e,t){return new on({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Wg,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:sr(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 3.2: Transform view direction to hemisphere configuration
				vec3 Vh = normalize(vec3(alpha * V.x, alpha * V.y, V.z));

				// Section 4.1: Orthonormal basis
				float lensq = Vh.x * Vh.x + Vh.y * Vh.y;
				vec3 T1 = lensq > 0.0 ? vec3(-Vh.y, Vh.x, 0.0) / sqrt(lensq) : vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(Vh, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + Vh.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * Vh;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function Yg(n,e,t){const i=new Float32Array(si),s=new $(0,1,0);return new on({name:"SphericalGaussianBlur",defines:{n:si,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:sr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function Ml(){return new on({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:sr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function El(){return new on({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:sr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function sr(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Kg(n){let e=new WeakMap,t=null;function i(l){if(l&&l.isTexture){const c=l.mapping,d=c===da||c===ua,h=c===ci||c===Pi;if(d||h){let u=e.get(l);const p=u!==void 0?u.texture.pmremVersion:0;if(l.isRenderTargetTexture&&l.pmremVersion!==p)return t===null&&(t=new wl(n)),u=d?t.fromEquirectangular(l,u):t.fromCubemap(l,u),u.texture.pmremVersion=l.pmremVersion,e.set(l,u),u.texture;if(u!==void 0)return u.texture;{const g=l.image;return d&&g&&g.height>0||h&&g&&s(g)?(t===null&&(t=new wl(n)),u=d?t.fromEquirectangular(l):t.fromCubemap(l),u.texture.pmremVersion=l.pmremVersion,e.set(l,u),l.addEventListener("dispose",r),u.texture):null}}}return l}function s(l){let c=0;const d=6;for(let h=0;h<d;h++)l[h]!==void 0&&c++;return c===d}function r(l){const c=l.target;c.removeEventListener("dispose",r);const d=e.get(c);d!==void 0&&(e.delete(c),d.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:o}}function Zg(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&es("WebGLRenderer: "+i+" extension not supported."),s}}}function Jg(n,e,t,i){const s={},r=new WeakMap;function o(u){const p=u.target;p.index!==null&&e.remove(p.index);for(const _ in p.attributes)e.remove(p.attributes[_]);p.removeEventListener("dispose",o),delete s[p.id];const g=r.get(p);g&&(e.remove(g),r.delete(p)),i.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,t.memory.geometries--}function l(u,p){return s[p.id]===!0||(p.addEventListener("dispose",o),s[p.id]=!0,t.memory.geometries++),p}function c(u){const p=u.attributes;for(const g in p)e.update(p[g],n.ARRAY_BUFFER)}function d(u){const p=[],g=u.index,_=u.attributes.position;let v=0;if(g!==null){const y=g.array;v=g.version;for(let M=0,w=y.length;M<w;M+=3){const T=y[M+0],R=y[M+1],A=y[M+2];p.push(T,R,R,A,A,T)}}else if(_!==void 0){const y=_.array;v=_.version;for(let M=0,w=y.length/3-1;M<w;M+=3){const T=M+0,R=M+1,A=M+2;p.push(T,R,R,A,A,T)}}else return;const m=new(Uc(p)?zc:jc)(p,1);m.version=v;const f=r.get(u);f&&e.remove(f),r.set(u,m)}function h(u){const p=r.get(u);if(p){const g=u.index;g!==null&&p.version<g.version&&d(u)}else d(u);return r.get(u)}return{get:l,update:c,getWireframeAttribute:h}}function Qg(n,e,t){let i;function s(p){i=p}let r,o;function l(p){r=p.type,o=p.bytesPerElement}function c(p,g){n.drawElements(i,g,r,p*o),t.update(g,i,1)}function d(p,g,_){_!==0&&(n.drawElementsInstanced(i,g,r,p*o,_),t.update(g,i,_))}function h(p,g,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,g,0,r,p,0,_);let m=0;for(let f=0;f<_;f++)m+=g[f];t.update(m,i,1)}function u(p,g,_,v){if(_===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<p.length;f++)d(p[f]/o,g[f],v[f]);else{m.multiDrawElementsInstancedWEBGL(i,g,0,r,p,0,v,0,_);let f=0;for(let y=0;y<_;y++)f+=g[y]*v[y];t.update(f,i,1)}}this.setMode=s,this.setIndex=l,this.render=c,this.renderInstances=d,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function e0(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,o,l){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=l*(r/3);break;case n.LINES:t.lines+=l*(r/2);break;case n.LINE_STRIP:t.lines+=l*(r-1);break;case n.LINE_LOOP:t.lines+=l*r;break;case n.POINTS:t.points+=l*r;break;default:nt("WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function t0(n,e,t){const i=new WeakMap,s=new _t;function r(o,l,c){const d=o.morphTargetInfluences,h=l.morphAttributes.position||l.morphAttributes.normal||l.morphAttributes.color,u=h!==void 0?h.length:0;let p=i.get(l);if(p===void 0||p.count!==u){let b=function(){A.dispose(),i.delete(l),l.removeEventListener("dispose",b)};p!==void 0&&p.texture.dispose();const g=l.morphAttributes.position!==void 0,_=l.morphAttributes.normal!==void 0,v=l.morphAttributes.color!==void 0,m=l.morphAttributes.position||[],f=l.morphAttributes.normal||[],y=l.morphAttributes.color||[];let M=0;g===!0&&(M=1),_===!0&&(M=2),v===!0&&(M=3);let w=l.attributes.position.count*M,T=1;w>e.maxTextureSize&&(T=Math.ceil(w/e.maxTextureSize),w=e.maxTextureSize);const R=new Float32Array(w*T*4*u),A=new Fc(R,w,T,u);A.type=dn,A.needsUpdate=!0;const B=M*4;for(let E=0;E<u;E++){const N=m[E],U=f[E],D=y[E],P=w*T*4*E;for(let I=0;I<N.count;I++){const k=I*B;g===!0&&(s.fromBufferAttribute(N,I),R[P+k+0]=s.x,R[P+k+1]=s.y,R[P+k+2]=s.z,R[P+k+3]=0),_===!0&&(s.fromBufferAttribute(U,I),R[P+k+4]=s.x,R[P+k+5]=s.y,R[P+k+6]=s.z,R[P+k+7]=0),v===!0&&(s.fromBufferAttribute(D,I),R[P+k+8]=s.x,R[P+k+9]=s.y,R[P+k+10]=s.z,R[P+k+11]=D.itemSize===4?s.w:1)}}p={count:u,texture:A,size:new at(w,T)},i.set(l,p),l.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let g=0;for(let v=0;v<d.length;v++)g+=d[v];const _=l.morphTargetsRelative?1:1-g;c.getUniforms().setValue(n,"morphTargetBaseInfluence",_),c.getUniforms().setValue(n,"morphTargetInfluences",d)}c.getUniforms().setValue(n,"morphTargetsTexture",p.texture,t),c.getUniforms().setValue(n,"morphTargetsTextureSize",p.size)}return{update:r}}function n0(n,e,t,i){let s=new WeakMap;function r(c){const d=i.render.frame,h=c.geometry,u=e.get(c,h);if(s.get(u)!==d&&(e.update(u),s.set(u,d)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==d&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,d))),c.isSkinnedMesh){const p=c.skeleton;s.get(p)!==d&&(p.update(),s.set(p,d))}return u}function o(){s=new WeakMap}function l(c){const d=c.target;d.removeEventListener("dispose",l),t.remove(d.instanceMatrix),d.instanceColor!==null&&t.remove(d.instanceColor)}return{update:r,dispose:o}}const i0={[bc]:"LINEAR_TONE_MAPPING",[yc]:"REINHARD_TONE_MAPPING",[wc]:"CINEON_TONE_MAPPING",[Sc]:"ACES_FILMIC_TONE_MAPPING",[Ec]:"AGX_TONE_MAPPING",[Tc]:"NEUTRAL_TONE_MAPPING",[Mc]:"CUSTOM_TONE_MAPPING"};function s0(n,e,t,i,s){const r=new pn(e,t,{type:n,depthBuffer:i,stencilBuffer:s}),o=new pn(e,t,{type:Ln,depthBuffer:!1,stencilBuffer:!1}),l=new Un;l.setAttribute("position",new Pn([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new Pn([0,2,0,0,2,0],2));const c=new Qf({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new _n(l,c),h=new qc(-1,1,1,-1,0,1);let u=null,p=null,g=!1,_,v=null,m=[],f=!1;this.setSize=function(y,M){r.setSize(y,M),o.setSize(y,M);for(let w=0;w<m.length;w++){const T=m[w];T.setSize&&T.setSize(y,M)}},this.setEffects=function(y){m=y,f=m.length>0&&m[0].isRenderPass===!0;const M=r.width,w=r.height;for(let T=0;T<m.length;T++){const R=m[T];R.setSize&&R.setSize(M,w)}},this.begin=function(y,M){if(g||y.toneMapping===fn&&m.length===0)return!1;if(v=M,M!==null){const w=M.width,T=M.height;(r.width!==w||r.height!==T)&&this.setSize(w,T)}return f===!1&&y.setRenderTarget(r),_=y.toneMapping,y.toneMapping=fn,!0},this.hasRenderPass=function(){return f},this.end=function(y,M){y.toneMapping=_,g=!0;let w=r,T=o;for(let R=0;R<m.length;R++){const A=m[R];if(A.enabled!==!1&&(A.render(y,T,w,M),A.needsSwap!==!1)){const B=w;w=T,T=B}}if(u!==y.outputColorSpace||p!==y.toneMapping){u=y.outputColorSpace,p=y.toneMapping,c.defines={},et.getTransfer(u)===rt&&(c.defines.SRGB_TRANSFER="");const R=i0[p];R&&(c.defines[R]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=w.texture,y.setRenderTarget(v),y.render(d,h),v=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){r.dispose(),o.dispose(),l.dispose(),c.dispose()}}const Yc=new Dt,qa=new ts(1,1),Kc=new Fc,Zc=new Cf,Jc=new Gc,Tl=[],Al=[],Cl=new Float32Array(16),Rl=new Float32Array(9),Nl=new Float32Array(4);function ki(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let r=Tl[s];if(r===void 0&&(r=new Float32Array(s),Tl[s]=r),e!==0){i.toArray(r,0);for(let o=1,l=0;o!==e;++o)l+=t,n[o].toArray(r,l)}return r}function wt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function St(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function rr(n,e){let t=Al[e];t===void 0&&(t=new Int32Array(e),Al[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function r0(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function a0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(wt(t,e))return;n.uniform2fv(this.addr,e),St(t,e)}}function o0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(wt(t,e))return;n.uniform3fv(this.addr,e),St(t,e)}}function l0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(wt(t,e))return;n.uniform4fv(this.addr,e),St(t,e)}}function c0(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(wt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),St(t,e)}else{if(wt(t,i))return;Nl.set(i),n.uniformMatrix2fv(this.addr,!1,Nl),St(t,i)}}function d0(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(wt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),St(t,e)}else{if(wt(t,i))return;Rl.set(i),n.uniformMatrix3fv(this.addr,!1,Rl),St(t,i)}}function u0(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(wt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),St(t,e)}else{if(wt(t,i))return;Cl.set(i),n.uniformMatrix4fv(this.addr,!1,Cl),St(t,i)}}function h0(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function f0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(wt(t,e))return;n.uniform2iv(this.addr,e),St(t,e)}}function p0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(wt(t,e))return;n.uniform3iv(this.addr,e),St(t,e)}}function m0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(wt(t,e))return;n.uniform4iv(this.addr,e),St(t,e)}}function g0(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function x0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(wt(t,e))return;n.uniform2uiv(this.addr,e),St(t,e)}}function _0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(wt(t,e))return;n.uniform3uiv(this.addr,e),St(t,e)}}function v0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(wt(t,e))return;n.uniform4uiv(this.addr,e),St(t,e)}}function b0(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(qa.compareFunction=t.isReversedDepthBuffer()?uo:co,r=qa):r=Yc,t.setTexture2D(e||r,s)}function y0(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||Zc,s)}function w0(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||Jc,s)}function S0(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||Kc,s)}function M0(n){switch(n){case 5126:return r0;case 35664:return a0;case 35665:return o0;case 35666:return l0;case 35674:return c0;case 35675:return d0;case 35676:return u0;case 5124:case 35670:return h0;case 35667:case 35671:return f0;case 35668:case 35672:return p0;case 35669:case 35673:return m0;case 5125:return g0;case 36294:return x0;case 36295:return _0;case 36296:return v0;case 35678:case 36198:case 36298:case 36306:case 35682:return b0;case 35679:case 36299:case 36307:return y0;case 35680:case 36300:case 36308:case 36293:return w0;case 36289:case 36303:case 36311:case 36292:return S0}}function E0(n,e){n.uniform1fv(this.addr,e)}function T0(n,e){const t=ki(e,this.size,2);n.uniform2fv(this.addr,t)}function A0(n,e){const t=ki(e,this.size,3);n.uniform3fv(this.addr,t)}function C0(n,e){const t=ki(e,this.size,4);n.uniform4fv(this.addr,t)}function R0(n,e){const t=ki(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function N0(n,e){const t=ki(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function P0(n,e){const t=ki(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function L0(n,e){n.uniform1iv(this.addr,e)}function D0(n,e){n.uniform2iv(this.addr,e)}function I0(n,e){n.uniform3iv(this.addr,e)}function U0(n,e){n.uniform4iv(this.addr,e)}function F0(n,e){n.uniform1uiv(this.addr,e)}function k0(n,e){n.uniform2uiv(this.addr,e)}function O0(n,e){n.uniform3uiv(this.addr,e)}function B0(n,e){n.uniform4uiv(this.addr,e)}function j0(n,e,t){const i=this.cache,s=e.length,r=rr(t,s);wt(i,r)||(n.uniform1iv(this.addr,r),St(i,r));let o;this.type===n.SAMPLER_2D_SHADOW?o=qa:o=Yc;for(let l=0;l!==s;++l)t.setTexture2D(e[l]||o,r[l])}function z0(n,e,t){const i=this.cache,s=e.length,r=rr(t,s);wt(i,r)||(n.uniform1iv(this.addr,r),St(i,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||Zc,r[o])}function V0(n,e,t){const i=this.cache,s=e.length,r=rr(t,s);wt(i,r)||(n.uniform1iv(this.addr,r),St(i,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||Jc,r[o])}function G0(n,e,t){const i=this.cache,s=e.length,r=rr(t,s);wt(i,r)||(n.uniform1iv(this.addr,r),St(i,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||Kc,r[o])}function H0(n){switch(n){case 5126:return E0;case 35664:return T0;case 35665:return A0;case 35666:return C0;case 35674:return R0;case 35675:return N0;case 35676:return P0;case 5124:case 35670:return L0;case 35667:case 35671:return D0;case 35668:case 35672:return I0;case 35669:case 35673:return U0;case 5125:return F0;case 36294:return k0;case 36295:return O0;case 36296:return B0;case 35678:case 36198:case 36298:case 36306:case 35682:return j0;case 35679:case 36299:case 36307:return z0;case 35680:case 36300:case 36308:case 36293:return V0;case 36289:case 36303:case 36311:case 36292:return G0}}class W0{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=M0(t.type)}}class X0{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=H0(t.type)}}class q0{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const l=s[r];l.setValue(e,t[l.id],i)}}}const Wr=/(\w+)(\])?(\[|\.)?/g;function Pl(n,e){n.seq.push(e),n.map[e.id]=e}function $0(n,e,t){const i=n.name,s=i.length;for(Wr.lastIndex=0;;){const r=Wr.exec(i),o=Wr.lastIndex;let l=r[1];const c=r[2]==="]",d=r[3];if(c&&(l=l|0),d===void 0||d==="["&&o+2===s){Pl(t,d===void 0?new W0(l,n,e):new X0(l,n,e));break}else{let u=t.map[l];u===void 0&&(u=new q0(l),Pl(t,u)),t=u}}}class Xs{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){const l=e.getActiveUniform(t,o),c=e.getUniformLocation(t,l.name);$0(l,c,this)}const s=[],r=[];for(const o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,i,s){const r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,o=t.length;r!==o;++r){const l=t[r],c=i[l.id];c.needsUpdate!==!1&&l.setValue(e,c.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,r=e.length;s!==r;++s){const o=e[s];o.id in t&&i.push(o)}return i}}function Ll(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const Y0=37297;let K0=0;function Z0(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){const l=o+1;i.push(`${l===e?">":" "} ${l}: ${t[o]}`)}return i.join(`
`)}const Dl=new We;function J0(n){et._getMatrix(Dl,et.workingColorSpace,n);const e=`mat3( ${Dl.elements.map(t=>t.toFixed(4))} )`;switch(et.getTransfer(n)){case Ys:return[e,"LinearTransferOETF"];case rt:return[e,"sRGBTransferOETF"];default:return Ge("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Il(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const o=/ERROR: 0:(\d+)/.exec(r);if(o){const l=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+Z0(n.getShaderSource(e),l)}else return r}function Q0(n,e){const t=J0(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const ex={[bc]:"Linear",[yc]:"Reinhard",[wc]:"Cineon",[Sc]:"ACESFilmic",[Ec]:"AgX",[Tc]:"Neutral",[Mc]:"Custom"};function tx(n,e){const t=ex[e];return t===void 0?(Ge("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Is=new $;function nx(){et.getLuminanceCoefficients(Is);const n=Is.x.toFixed(4),e=Is.y.toFixed(4),t=Is.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function ix(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ki).join(`
`)}function sx(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function rx(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(e,s),o=r.name;let l=1;r.type===n.FLOAT_MAT2&&(l=2),r.type===n.FLOAT_MAT3&&(l=3),r.type===n.FLOAT_MAT4&&(l=4),t[o]={type:r.type,location:n.getAttribLocation(e,o),locationSize:l}}return t}function Ki(n){return n!==""}function Ul(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Fl(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const ax=/^[ \t]*#include +<([\w\d./]+)>/gm;function $a(n){return n.replace(ax,lx)}const ox=new Map;function lx(n,e){let t=Xe[e];if(t===void 0){const i=ox.get(e);if(i!==void 0)t=Xe[i],Ge('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return $a(t)}const cx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function kl(n){return n.replace(cx,dx)}function dx(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Ol(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const ux={[zs]:"SHADOWMAP_TYPE_PCF",[Yi]:"SHADOWMAP_TYPE_VSM"};function hx(n){return ux[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const fx={[ci]:"ENVMAP_TYPE_CUBE",[Pi]:"ENVMAP_TYPE_CUBE",[nr]:"ENVMAP_TYPE_CUBE_UV"};function px(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":fx[n.envMapMode]||"ENVMAP_TYPE_CUBE"}const mx={[Pi]:"ENVMAP_MODE_REFRACTION"};function gx(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":mx[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const xx={[vc]:"ENVMAP_BLENDING_MULTIPLY",[lf]:"ENVMAP_BLENDING_MIX",[cf]:"ENVMAP_BLENDING_ADD"};function _x(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":xx[n.combine]||"ENVMAP_BLENDING_NONE"}function vx(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function bx(n,e,t,i){const s=n.getContext(),r=t.defines;let o=t.vertexShader,l=t.fragmentShader;const c=hx(t),d=px(t),h=gx(t),u=_x(t),p=vx(t),g=ix(t),_=sx(r),v=s.createProgram();let m,f,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Ki).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Ki).join(`
`),f.length>0&&(f+=`
`)):(m=[Ol(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ki).join(`
`),f=[Ol(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==fn?"#define TONE_MAPPING":"",t.toneMapping!==fn?Xe.tonemapping_pars_fragment:"",t.toneMapping!==fn?tx("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Xe.colorspace_pars_fragment,Q0("linearToOutputTexel",t.outputColorSpace),nx(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ki).join(`
`)),o=$a(o),o=Ul(o,t),o=Fl(o,t),l=$a(l),l=Ul(l,t),l=Fl(l,t),o=kl(o),l=kl(l),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,m=[g,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",t.glslVersion===el?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===el?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const M=y+m+o,w=y+f+l,T=Ll(s,s.VERTEX_SHADER,M),R=Ll(s,s.FRAGMENT_SHADER,w);s.attachShader(v,T),s.attachShader(v,R),t.index0AttributeName!==void 0?s.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function A(N){if(n.debug.checkShaderErrors){const U=s.getProgramInfoLog(v)||"",D=s.getShaderInfoLog(T)||"",P=s.getShaderInfoLog(R)||"",I=U.trim(),k=D.trim(),j=P.trim();let W=!0,ee=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(W=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,v,T,R);else{const Q=Il(s,T,"vertex"),ne=Il(s,R,"fragment");nt("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+N.name+`
Material Type: `+N.type+`

Program Info Log: `+I+`
`+Q+`
`+ne)}else I!==""?Ge("WebGLProgram: Program Info Log:",I):(k===""||j==="")&&(ee=!1);ee&&(N.diagnostics={runnable:W,programLog:I,vertexShader:{log:k,prefix:m},fragmentShader:{log:j,prefix:f}})}s.deleteShader(T),s.deleteShader(R),B=new Xs(s,v),b=rx(s,v)}let B;this.getUniforms=function(){return B===void 0&&A(this),B};let b;this.getAttributes=function(){return b===void 0&&A(this),b};let E=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=s.getProgramParameter(v,Y0)),E},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=K0++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=T,this.fragmentShader=R,this}let yx=0;class wx{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new Sx(e),t.set(e,i)),i}}class Sx{constructor(e){this.id=yx++,this.code=e,this.usedTimes=0}}function Mx(n,e,t,i,s,r,o){const l=new kc,c=new wx,d=new Set,h=[],u=new Map,p=s.logarithmicDepthBuffer;let g=s.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(b){return d.add(b),b===0?"uv":`uv${b}`}function m(b,E,N,U,D){const P=U.fog,I=D.geometry,k=b.isMeshStandardMaterial?U.environment:null,j=(b.isMeshStandardMaterial?t:e).get(b.envMap||k),W=j&&j.mapping===nr?j.image.height:null,ee=_[b.type];b.precision!==null&&(g=s.getMaxPrecision(b.precision),g!==b.precision&&Ge("WebGLProgram.getParameters:",b.precision,"not supported, using",g,"instead."));const Q=I.morphAttributes.position||I.morphAttributes.normal||I.morphAttributes.color,ne=Q!==void 0?Q.length:0;let Se=0;I.morphAttributes.position!==void 0&&(Se=1),I.morphAttributes.normal!==void 0&&(Se=2),I.morphAttributes.color!==void 0&&(Se=3);let ve,oe,ue,X;if(ee){const it=cn[ee];ve=it.vertexShader,oe=it.fragmentShader}else ve=b.vertexShader,oe=b.fragmentShader,c.update(b),ue=c.getVertexShaderID(b),X=c.getFragmentShaderID(b);const Z=n.getRenderTarget(),ce=n.state.buffers.depth.getReversed(),Ue=D.isInstancedMesh===!0,me=D.isBatchedMesh===!0,$e=!!b.map,se=!!b.matcap,ye=!!j,Te=!!b.aoMap,Ie=!!b.lightMap,Ee=!!b.bumpMap,Je=!!b.normalMap,L=!!b.displacementMap,ft=!!b.emissiveMap,Qe=!!b.metalnessMap,ot=!!b.roughnessMap,Re=b.anisotropy>0,C=b.clearcoat>0,x=b.dispersion>0,V=b.iridescence>0,J=b.sheen>0,ie=b.transmission>0,K=Re&&!!b.anisotropyMap,De=C&&!!b.clearcoatMap,de=C&&!!b.clearcoatNormalMap,Ne=C&&!!b.clearcoatRoughnessMap,Be=V&&!!b.iridescenceMap,re=V&&!!b.iridescenceThicknessMap,pe=J&&!!b.sheenColorMap,Ce=J&&!!b.sheenRoughnessMap,Le=!!b.specularMap,he=!!b.specularColorMap,He=!!b.specularIntensityMap,z=ie&&!!b.transmissionMap,xe=ie&&!!b.thicknessMap,le=!!b.gradientMap,Me=!!b.alphaMap,ae=b.alphaTest>0,te=!!b.alphaHash,fe=!!b.extensions;let ze=fn;b.toneMapped&&(Z===null||Z.isXRRenderTarget===!0)&&(ze=n.toneMapping);const lt={shaderID:ee,shaderType:b.type,shaderName:b.name,vertexShader:ve,fragmentShader:oe,defines:b.defines,customVertexShaderID:ue,customFragmentShaderID:X,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:g,batching:me,batchingColor:me&&D._colorsTexture!==null,instancing:Ue,instancingColor:Ue&&D.instanceColor!==null,instancingMorph:Ue&&D.morphTexture!==null,outputColorSpace:Z===null?n.outputColorSpace:Z.isXRRenderTarget===!0?Z.texture.colorSpace:Di,alphaToCoverage:!!b.alphaToCoverage,map:$e,matcap:se,envMap:ye,envMapMode:ye&&j.mapping,envMapCubeUVHeight:W,aoMap:Te,lightMap:Ie,bumpMap:Ee,normalMap:Je,displacementMap:L,emissiveMap:ft,normalMapObjectSpace:Je&&b.normalMapType===ff,normalMapTangentSpace:Je&&b.normalMapType===hf,metalnessMap:Qe,roughnessMap:ot,anisotropy:Re,anisotropyMap:K,clearcoat:C,clearcoatMap:De,clearcoatNormalMap:de,clearcoatRoughnessMap:Ne,dispersion:x,iridescence:V,iridescenceMap:Be,iridescenceThicknessMap:re,sheen:J,sheenColorMap:pe,sheenRoughnessMap:Ce,specularMap:Le,specularColorMap:he,specularIntensityMap:He,transmission:ie,transmissionMap:z,thicknessMap:xe,gradientMap:le,opaque:b.transparent===!1&&b.blending===Ai&&b.alphaToCoverage===!1,alphaMap:Me,alphaTest:ae,alphaHash:te,combine:b.combine,mapUv:$e&&v(b.map.channel),aoMapUv:Te&&v(b.aoMap.channel),lightMapUv:Ie&&v(b.lightMap.channel),bumpMapUv:Ee&&v(b.bumpMap.channel),normalMapUv:Je&&v(b.normalMap.channel),displacementMapUv:L&&v(b.displacementMap.channel),emissiveMapUv:ft&&v(b.emissiveMap.channel),metalnessMapUv:Qe&&v(b.metalnessMap.channel),roughnessMapUv:ot&&v(b.roughnessMap.channel),anisotropyMapUv:K&&v(b.anisotropyMap.channel),clearcoatMapUv:De&&v(b.clearcoatMap.channel),clearcoatNormalMapUv:de&&v(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ne&&v(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Be&&v(b.iridescenceMap.channel),iridescenceThicknessMapUv:re&&v(b.iridescenceThicknessMap.channel),sheenColorMapUv:pe&&v(b.sheenColorMap.channel),sheenRoughnessMapUv:Ce&&v(b.sheenRoughnessMap.channel),specularMapUv:Le&&v(b.specularMap.channel),specularColorMapUv:he&&v(b.specularColorMap.channel),specularIntensityMapUv:He&&v(b.specularIntensityMap.channel),transmissionMapUv:z&&v(b.transmissionMap.channel),thicknessMapUv:xe&&v(b.thicknessMap.channel),alphaMapUv:Me&&v(b.alphaMap.channel),vertexTangents:!!I.attributes.tangent&&(Je||Re),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!I.attributes.color&&I.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!I.attributes.uv&&($e||Me),fog:!!P,useFog:b.fog===!0,fogExp2:!!P&&P.isFogExp2,flatShading:b.flatShading===!0&&b.wireframe===!1,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:p,reversedDepthBuffer:ce,skinning:D.isSkinnedMesh===!0,morphTargets:I.morphAttributes.position!==void 0,morphNormals:I.morphAttributes.normal!==void 0,morphColors:I.morphAttributes.color!==void 0,morphTargetsCount:ne,morphTextureStride:Se,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:n.shadowMap.enabled&&N.length>0,shadowMapType:n.shadowMap.type,toneMapping:ze,decodeVideoTexture:$e&&b.map.isVideoTexture===!0&&et.getTransfer(b.map.colorSpace)===rt,decodeVideoTextureEmissive:ft&&b.emissiveMap.isVideoTexture===!0&&et.getTransfer(b.emissiveMap.colorSpace)===rt,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===An,flipSided:b.side===Bt,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:fe&&b.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(fe&&b.extensions.multiDraw===!0||me)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return lt.vertexUv1s=d.has(1),lt.vertexUv2s=d.has(2),lt.vertexUv3s=d.has(3),d.clear(),lt}function f(b){const E=[];if(b.shaderID?E.push(b.shaderID):(E.push(b.customVertexShaderID),E.push(b.customFragmentShaderID)),b.defines!==void 0)for(const N in b.defines)E.push(N),E.push(b.defines[N]);return b.isRawShaderMaterial===!1&&(y(E,b),M(E,b),E.push(n.outputColorSpace)),E.push(b.customProgramCacheKey),E.join()}function y(b,E){b.push(E.precision),b.push(E.outputColorSpace),b.push(E.envMapMode),b.push(E.envMapCubeUVHeight),b.push(E.mapUv),b.push(E.alphaMapUv),b.push(E.lightMapUv),b.push(E.aoMapUv),b.push(E.bumpMapUv),b.push(E.normalMapUv),b.push(E.displacementMapUv),b.push(E.emissiveMapUv),b.push(E.metalnessMapUv),b.push(E.roughnessMapUv),b.push(E.anisotropyMapUv),b.push(E.clearcoatMapUv),b.push(E.clearcoatNormalMapUv),b.push(E.clearcoatRoughnessMapUv),b.push(E.iridescenceMapUv),b.push(E.iridescenceThicknessMapUv),b.push(E.sheenColorMapUv),b.push(E.sheenRoughnessMapUv),b.push(E.specularMapUv),b.push(E.specularColorMapUv),b.push(E.specularIntensityMapUv),b.push(E.transmissionMapUv),b.push(E.thicknessMapUv),b.push(E.combine),b.push(E.fogExp2),b.push(E.sizeAttenuation),b.push(E.morphTargetsCount),b.push(E.morphAttributeCount),b.push(E.numDirLights),b.push(E.numPointLights),b.push(E.numSpotLights),b.push(E.numSpotLightMaps),b.push(E.numHemiLights),b.push(E.numRectAreaLights),b.push(E.numDirLightShadows),b.push(E.numPointLightShadows),b.push(E.numSpotLightShadows),b.push(E.numSpotLightShadowsWithMaps),b.push(E.numLightProbes),b.push(E.shadowMapType),b.push(E.toneMapping),b.push(E.numClippingPlanes),b.push(E.numClipIntersection),b.push(E.depthPacking)}function M(b,E){l.disableAll(),E.instancing&&l.enable(0),E.instancingColor&&l.enable(1),E.instancingMorph&&l.enable(2),E.matcap&&l.enable(3),E.envMap&&l.enable(4),E.normalMapObjectSpace&&l.enable(5),E.normalMapTangentSpace&&l.enable(6),E.clearcoat&&l.enable(7),E.iridescence&&l.enable(8),E.alphaTest&&l.enable(9),E.vertexColors&&l.enable(10),E.vertexAlphas&&l.enable(11),E.vertexUv1s&&l.enable(12),E.vertexUv2s&&l.enable(13),E.vertexUv3s&&l.enable(14),E.vertexTangents&&l.enable(15),E.anisotropy&&l.enable(16),E.alphaHash&&l.enable(17),E.batching&&l.enable(18),E.dispersion&&l.enable(19),E.batchingColor&&l.enable(20),E.gradientMap&&l.enable(21),b.push(l.mask),l.disableAll(),E.fog&&l.enable(0),E.useFog&&l.enable(1),E.flatShading&&l.enable(2),E.logarithmicDepthBuffer&&l.enable(3),E.reversedDepthBuffer&&l.enable(4),E.skinning&&l.enable(5),E.morphTargets&&l.enable(6),E.morphNormals&&l.enable(7),E.morphColors&&l.enable(8),E.premultipliedAlpha&&l.enable(9),E.shadowMapEnabled&&l.enable(10),E.doubleSided&&l.enable(11),E.flipSided&&l.enable(12),E.useDepthPacking&&l.enable(13),E.dithering&&l.enable(14),E.transmission&&l.enable(15),E.sheen&&l.enable(16),E.opaque&&l.enable(17),E.pointsUvs&&l.enable(18),E.decodeVideoTexture&&l.enable(19),E.decodeVideoTextureEmissive&&l.enable(20),E.alphaToCoverage&&l.enable(21),b.push(l.mask)}function w(b){const E=_[b.type];let N;if(E){const U=cn[E];N=Vf.clone(U.uniforms)}else N=b.uniforms;return N}function T(b,E){let N=u.get(E);return N!==void 0?++N.usedTimes:(N=new bx(n,E,b,r),h.push(N),u.set(E,N)),N}function R(b){if(--b.usedTimes===0){const E=h.indexOf(b);h[E]=h[h.length-1],h.pop(),u.delete(b.cacheKey),b.destroy()}}function A(b){c.remove(b)}function B(){c.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:w,acquireProgram:T,releaseProgram:R,releaseShaderCache:A,programs:h,dispose:B}}function Ex(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let l=n.get(o);return l===void 0&&(l={},n.set(o,l)),l}function i(o){n.delete(o)}function s(o,l,c){n.get(o)[l]=c}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function Tx(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function Bl(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function jl(){const n=[];let e=0;const t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function o(u,p,g,_,v,m){let f=n[e];return f===void 0?(f={id:u.id,object:u,geometry:p,material:g,groupOrder:_,renderOrder:u.renderOrder,z:v,group:m},n[e]=f):(f.id=u.id,f.object=u,f.geometry=p,f.material=g,f.groupOrder=_,f.renderOrder=u.renderOrder,f.z=v,f.group=m),e++,f}function l(u,p,g,_,v,m){const f=o(u,p,g,_,v,m);g.transmission>0?i.push(f):g.transparent===!0?s.push(f):t.push(f)}function c(u,p,g,_,v,m){const f=o(u,p,g,_,v,m);g.transmission>0?i.unshift(f):g.transparent===!0?s.unshift(f):t.unshift(f)}function d(u,p){t.length>1&&t.sort(u||Tx),i.length>1&&i.sort(p||Bl),s.length>1&&s.sort(p||Bl)}function h(){for(let u=e,p=n.length;u<p;u++){const g=n[u];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:l,unshift:c,finish:h,sort:d}}function Ax(){let n=new WeakMap;function e(i,s){const r=n.get(i);let o;return r===void 0?(o=new jl,n.set(i,[o])):s>=r.length?(o=new jl,r.push(o)):o=r[s],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function Cx(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new $,color:new dt};break;case"SpotLight":t={position:new $,direction:new $,color:new dt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new $,color:new dt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new $,skyColor:new dt,groundColor:new dt};break;case"RectAreaLight":t={color:new dt,position:new $,halfWidth:new $,halfHeight:new $};break}return n[e.id]=t,t}}}function Rx(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new at};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new at};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new at,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let Nx=0;function Px(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function Lx(n){const e=new Cx,t=Rx(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let d=0;d<9;d++)i.probe.push(new $);const s=new $,r=new yt,o=new yt;function l(d){let h=0,u=0,p=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let g=0,_=0,v=0,m=0,f=0,y=0,M=0,w=0,T=0,R=0,A=0;d.sort(Px);for(let b=0,E=d.length;b<E;b++){const N=d[b],U=N.color,D=N.intensity,P=N.distance;let I=null;if(N.shadow&&N.shadow.map&&(N.shadow.map.texture.format===Li?I=N.shadow.map.texture:I=N.shadow.map.depthTexture||N.shadow.map.texture),N.isAmbientLight)h+=U.r*D,u+=U.g*D,p+=U.b*D;else if(N.isLightProbe){for(let k=0;k<9;k++)i.probe[k].addScaledVector(N.sh.coefficients[k],D);A++}else if(N.isDirectionalLight){const k=e.get(N);if(k.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){const j=N.shadow,W=t.get(N);W.shadowIntensity=j.intensity,W.shadowBias=j.bias,W.shadowNormalBias=j.normalBias,W.shadowRadius=j.radius,W.shadowMapSize=j.mapSize,i.directionalShadow[g]=W,i.directionalShadowMap[g]=I,i.directionalShadowMatrix[g]=N.shadow.matrix,y++}i.directional[g]=k,g++}else if(N.isSpotLight){const k=e.get(N);k.position.setFromMatrixPosition(N.matrixWorld),k.color.copy(U).multiplyScalar(D),k.distance=P,k.coneCos=Math.cos(N.angle),k.penumbraCos=Math.cos(N.angle*(1-N.penumbra)),k.decay=N.decay,i.spot[v]=k;const j=N.shadow;if(N.map&&(i.spotLightMap[T]=N.map,T++,j.updateMatrices(N),N.castShadow&&R++),i.spotLightMatrix[v]=j.matrix,N.castShadow){const W=t.get(N);W.shadowIntensity=j.intensity,W.shadowBias=j.bias,W.shadowNormalBias=j.normalBias,W.shadowRadius=j.radius,W.shadowMapSize=j.mapSize,i.spotShadow[v]=W,i.spotShadowMap[v]=I,w++}v++}else if(N.isRectAreaLight){const k=e.get(N);k.color.copy(U).multiplyScalar(D),k.halfWidth.set(N.width*.5,0,0),k.halfHeight.set(0,N.height*.5,0),i.rectArea[m]=k,m++}else if(N.isPointLight){const k=e.get(N);if(k.color.copy(N.color).multiplyScalar(N.intensity),k.distance=N.distance,k.decay=N.decay,N.castShadow){const j=N.shadow,W=t.get(N);W.shadowIntensity=j.intensity,W.shadowBias=j.bias,W.shadowNormalBias=j.normalBias,W.shadowRadius=j.radius,W.shadowMapSize=j.mapSize,W.shadowCameraNear=j.camera.near,W.shadowCameraFar=j.camera.far,i.pointShadow[_]=W,i.pointShadowMap[_]=I,i.pointShadowMatrix[_]=N.shadow.matrix,M++}i.point[_]=k,_++}else if(N.isHemisphereLight){const k=e.get(N);k.skyColor.copy(N.color).multiplyScalar(D),k.groundColor.copy(N.groundColor).multiplyScalar(D),i.hemi[f]=k,f++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=_e.LTC_FLOAT_1,i.rectAreaLTC2=_e.LTC_FLOAT_2):(i.rectAreaLTC1=_e.LTC_HALF_1,i.rectAreaLTC2=_e.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=p;const B=i.hash;(B.directionalLength!==g||B.pointLength!==_||B.spotLength!==v||B.rectAreaLength!==m||B.hemiLength!==f||B.numDirectionalShadows!==y||B.numPointShadows!==M||B.numSpotShadows!==w||B.numSpotMaps!==T||B.numLightProbes!==A)&&(i.directional.length=g,i.spot.length=v,i.rectArea.length=m,i.point.length=_,i.hemi.length=f,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=M,i.pointShadowMap.length=M,i.spotShadow.length=w,i.spotShadowMap.length=w,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=M,i.spotLightMatrix.length=w+T-R,i.spotLightMap.length=T,i.numSpotLightShadowsWithMaps=R,i.numLightProbes=A,B.directionalLength=g,B.pointLength=_,B.spotLength=v,B.rectAreaLength=m,B.hemiLength=f,B.numDirectionalShadows=y,B.numPointShadows=M,B.numSpotShadows=w,B.numSpotMaps=T,B.numLightProbes=A,i.version=Nx++)}function c(d,h){let u=0,p=0,g=0,_=0,v=0;const m=h.matrixWorldInverse;for(let f=0,y=d.length;f<y;f++){const M=d[f];if(M.isDirectionalLight){const w=i.directional[u];w.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(m),u++}else if(M.isSpotLight){const w=i.spot[g];w.position.setFromMatrixPosition(M.matrixWorld),w.position.applyMatrix4(m),w.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(m),g++}else if(M.isRectAreaLight){const w=i.rectArea[_];w.position.setFromMatrixPosition(M.matrixWorld),w.position.applyMatrix4(m),o.identity(),r.copy(M.matrixWorld),r.premultiply(m),o.extractRotation(r),w.halfWidth.set(M.width*.5,0,0),w.halfHeight.set(0,M.height*.5,0),w.halfWidth.applyMatrix4(o),w.halfHeight.applyMatrix4(o),_++}else if(M.isPointLight){const w=i.point[p];w.position.setFromMatrixPosition(M.matrixWorld),w.position.applyMatrix4(m),p++}else if(M.isHemisphereLight){const w=i.hemi[v];w.direction.setFromMatrixPosition(M.matrixWorld),w.direction.transformDirection(m),v++}}}return{setup:l,setupView:c,state:i}}function zl(n){const e=new Lx(n),t=[],i=[];function s(h){d.camera=h,t.length=0,i.length=0}function r(h){t.push(h)}function o(h){i.push(h)}function l(){e.setup(t)}function c(h){e.setupView(t,h)}const d={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:d,setupLights:l,setupLightsView:c,pushLight:r,pushShadow:o}}function Dx(n){let e=new WeakMap;function t(s,r=0){const o=e.get(s);let l;return o===void 0?(l=new zl(n),e.set(s,[l])):r>=o.length?(l=new zl(n),o.push(l)):l=o[r],l}function i(){e=new WeakMap}return{get:t,dispose:i}}const Ix=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Ux=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Fx=[new $(1,0,0),new $(-1,0,0),new $(0,1,0),new $(0,-1,0),new $(0,0,1),new $(0,0,-1)],kx=[new $(0,-1,0),new $(0,-1,0),new $(0,0,1),new $(0,0,-1),new $(0,-1,0),new $(0,-1,0)],Vl=new yt,qi=new $,Xr=new $;function Ox(n,e,t){let i=new Wc;const s=new at,r=new at,o=new _t,l=new ep,c=new tp,d={},h=t.maxTextureSize,u={[qn]:Bt,[Bt]:qn,[An]:An},p=new on({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new at},radius:{value:4}},vertexShader:Ix,fragmentShader:Ux}),g=p.clone();g.defines.HORIZONTAL_PASS=1;const _=new Un;_.setAttribute("position",new mn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new _n(_,p),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=zs;let f=this.type;this.render=function(R,A,B){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||R.length===0)return;R.type===Vh&&(Ge("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),R.type=zs);const b=n.getRenderTarget(),E=n.getActiveCubeFace(),N=n.getActiveMipmapLevel(),U=n.state;U.setBlending(Rn),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const D=f!==this.type;D&&A.traverse(function(P){P.material&&(Array.isArray(P.material)?P.material.forEach(I=>I.needsUpdate=!0):P.material.needsUpdate=!0)});for(let P=0,I=R.length;P<I;P++){const k=R[P],j=k.shadow;if(j===void 0){Ge("WebGLShadowMap:",k,"has no shadow.");continue}if(j.autoUpdate===!1&&j.needsUpdate===!1)continue;s.copy(j.mapSize);const W=j.getFrameExtents();if(s.multiply(W),r.copy(j.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/W.x),s.x=r.x*W.x,j.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/W.y),s.y=r.y*W.y,j.mapSize.y=r.y)),j.map===null||D===!0){if(j.map!==null&&(j.map.depthTexture!==null&&(j.map.depthTexture.dispose(),j.map.depthTexture=null),j.map.dispose()),this.type===Yi){if(k.isPointLight){Ge("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}j.map=new pn(s.x,s.y,{format:Li,type:Ln,minFilter:Nt,magFilter:Nt,generateMipmaps:!1}),j.map.texture.name=k.name+".shadowMap",j.map.depthTexture=new ts(s.x,s.y,dn),j.map.depthTexture.name=k.name+".shadowMapDepth",j.map.depthTexture.format=Dn,j.map.depthTexture.compareFunction=null,j.map.depthTexture.minFilter=Et,j.map.depthTexture.magFilter=Et}else{k.isPointLight?(j.map=new Hc(s.x),j.map.depthTexture=new Jf(s.x,xn)):(j.map=new pn(s.x,s.y),j.map.depthTexture=new ts(s.x,s.y,xn)),j.map.depthTexture.name=k.name+".shadowMap",j.map.depthTexture.format=Dn;const Q=n.state.buffers.depth.getReversed();this.type===zs?(j.map.depthTexture.compareFunction=Q?uo:co,j.map.depthTexture.minFilter=Nt,j.map.depthTexture.magFilter=Nt):(j.map.depthTexture.compareFunction=null,j.map.depthTexture.minFilter=Et,j.map.depthTexture.magFilter=Et)}j.camera.updateProjectionMatrix()}const ee=j.map.isWebGLCubeRenderTarget?6:1;for(let Q=0;Q<ee;Q++){if(j.map.isWebGLCubeRenderTarget)n.setRenderTarget(j.map,Q),n.clear();else{Q===0&&(n.setRenderTarget(j.map),n.clear());const ne=j.getViewport(Q);o.set(r.x*ne.x,r.y*ne.y,r.x*ne.z,r.y*ne.w),U.viewport(o)}if(k.isPointLight){const ne=j.camera,Se=j.matrix,ve=k.distance||ne.far;ve!==ne.far&&(ne.far=ve,ne.updateProjectionMatrix()),qi.setFromMatrixPosition(k.matrixWorld),ne.position.copy(qi),Xr.copy(ne.position),Xr.add(Fx[Q]),ne.up.copy(kx[Q]),ne.lookAt(Xr),ne.updateMatrixWorld(),Se.makeTranslation(-qi.x,-qi.y,-qi.z),Vl.multiplyMatrices(ne.projectionMatrix,ne.matrixWorldInverse),j._frustum.setFromProjectionMatrix(Vl,ne.coordinateSystem,ne.reversedDepth)}else j.updateMatrices(k);i=j.getFrustum(),w(A,B,j.camera,k,this.type)}j.isPointLightShadow!==!0&&this.type===Yi&&y(j,B),j.needsUpdate=!1}f=this.type,m.needsUpdate=!1,n.setRenderTarget(b,E,N)};function y(R,A){const B=e.update(v);p.defines.VSM_SAMPLES!==R.blurSamples&&(p.defines.VSM_SAMPLES=R.blurSamples,g.defines.VSM_SAMPLES=R.blurSamples,p.needsUpdate=!0,g.needsUpdate=!0),R.mapPass===null&&(R.mapPass=new pn(s.x,s.y,{format:Li,type:Ln})),p.uniforms.shadow_pass.value=R.map.depthTexture,p.uniforms.resolution.value=R.mapSize,p.uniforms.radius.value=R.radius,n.setRenderTarget(R.mapPass),n.clear(),n.renderBufferDirect(A,null,B,p,v,null),g.uniforms.shadow_pass.value=R.mapPass.texture,g.uniforms.resolution.value=R.mapSize,g.uniforms.radius.value=R.radius,n.setRenderTarget(R.map),n.clear(),n.renderBufferDirect(A,null,B,g,v,null)}function M(R,A,B,b){let E=null;const N=B.isPointLight===!0?R.customDistanceMaterial:R.customDepthMaterial;if(N!==void 0)E=N;else if(E=B.isPointLight===!0?c:l,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const U=E.uuid,D=A.uuid;let P=d[U];P===void 0&&(P={},d[U]=P);let I=P[D];I===void 0&&(I=E.clone(),P[D]=I,A.addEventListener("dispose",T)),E=I}if(E.visible=A.visible,E.wireframe=A.wireframe,b===Yi?E.side=A.shadowSide!==null?A.shadowSide:A.side:E.side=A.shadowSide!==null?A.shadowSide:u[A.side],E.alphaMap=A.alphaMap,E.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,E.map=A.map,E.clipShadows=A.clipShadows,E.clippingPlanes=A.clippingPlanes,E.clipIntersection=A.clipIntersection,E.displacementMap=A.displacementMap,E.displacementScale=A.displacementScale,E.displacementBias=A.displacementBias,E.wireframeLinewidth=A.wireframeLinewidth,E.linewidth=A.linewidth,B.isPointLight===!0&&E.isMeshDistanceMaterial===!0){const U=n.properties.get(E);U.light=B}return E}function w(R,A,B,b,E){if(R.visible===!1)return;if(R.layers.test(A.layers)&&(R.isMesh||R.isLine||R.isPoints)&&(R.castShadow||R.receiveShadow&&E===Yi)&&(!R.frustumCulled||i.intersectsObject(R))){R.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,R.matrixWorld);const D=e.update(R),P=R.material;if(Array.isArray(P)){const I=D.groups;for(let k=0,j=I.length;k<j;k++){const W=I[k],ee=P[W.materialIndex];if(ee&&ee.visible){const Q=M(R,ee,b,E);R.onBeforeShadow(n,R,A,B,D,Q,W),n.renderBufferDirect(B,null,D,Q,R,W),R.onAfterShadow(n,R,A,B,D,Q,W)}}}else if(P.visible){const I=M(R,P,b,E);R.onBeforeShadow(n,R,A,B,D,I,null),n.renderBufferDirect(B,null,D,I,R,null),R.onAfterShadow(n,R,A,B,D,I,null)}}const U=R.children;for(let D=0,P=U.length;D<P;D++)w(U[D],A,B,b,E)}function T(R){R.target.removeEventListener("dispose",T);for(const B in d){const b=d[B],E=R.target.uuid;E in b&&(b[E].dispose(),delete b[E])}}}const Bx={[ia]:sa,[ra]:la,[aa]:ca,[Ni]:oa,[sa]:ia,[la]:ra,[ca]:aa,[oa]:Ni};function jx(n,e){function t(){let z=!1;const xe=new _t;let le=null;const Me=new _t(0,0,0,0);return{setMask:function(ae){le!==ae&&!z&&(n.colorMask(ae,ae,ae,ae),le=ae)},setLocked:function(ae){z=ae},setClear:function(ae,te,fe,ze,lt){lt===!0&&(ae*=ze,te*=ze,fe*=ze),xe.set(ae,te,fe,ze),Me.equals(xe)===!1&&(n.clearColor(ae,te,fe,ze),Me.copy(xe))},reset:function(){z=!1,le=null,Me.set(-1,0,0,0)}}}function i(){let z=!1,xe=!1,le=null,Me=null,ae=null;return{setReversed:function(te){if(xe!==te){const fe=e.get("EXT_clip_control");te?fe.clipControlEXT(fe.LOWER_LEFT_EXT,fe.ZERO_TO_ONE_EXT):fe.clipControlEXT(fe.LOWER_LEFT_EXT,fe.NEGATIVE_ONE_TO_ONE_EXT),xe=te;const ze=ae;ae=null,this.setClear(ze)}},getReversed:function(){return xe},setTest:function(te){te?Z(n.DEPTH_TEST):ce(n.DEPTH_TEST)},setMask:function(te){le!==te&&!z&&(n.depthMask(te),le=te)},setFunc:function(te){if(xe&&(te=Bx[te]),Me!==te){switch(te){case ia:n.depthFunc(n.NEVER);break;case sa:n.depthFunc(n.ALWAYS);break;case ra:n.depthFunc(n.LESS);break;case Ni:n.depthFunc(n.LEQUAL);break;case aa:n.depthFunc(n.EQUAL);break;case oa:n.depthFunc(n.GEQUAL);break;case la:n.depthFunc(n.GREATER);break;case ca:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Me=te}},setLocked:function(te){z=te},setClear:function(te){ae!==te&&(xe&&(te=1-te),n.clearDepth(te),ae=te)},reset:function(){z=!1,le=null,Me=null,ae=null,xe=!1}}}function s(){let z=!1,xe=null,le=null,Me=null,ae=null,te=null,fe=null,ze=null,lt=null;return{setTest:function(it){z||(it?Z(n.STENCIL_TEST):ce(n.STENCIL_TEST))},setMask:function(it){xe!==it&&!z&&(n.stencilMask(it),xe=it)},setFunc:function(it,Wt,Jt){(le!==it||Me!==Wt||ae!==Jt)&&(n.stencilFunc(it,Wt,Jt),le=it,Me=Wt,ae=Jt)},setOp:function(it,Wt,Jt){(te!==it||fe!==Wt||ze!==Jt)&&(n.stencilOp(it,Wt,Jt),te=it,fe=Wt,ze=Jt)},setLocked:function(it){z=it},setClear:function(it){lt!==it&&(n.clearStencil(it),lt=it)},reset:function(){z=!1,xe=null,le=null,Me=null,ae=null,te=null,fe=null,ze=null,lt=null}}}const r=new t,o=new i,l=new s,c=new WeakMap,d=new WeakMap;let h={},u={},p=new WeakMap,g=[],_=null,v=!1,m=null,f=null,y=null,M=null,w=null,T=null,R=null,A=new dt(0,0,0),B=0,b=!1,E=null,N=null,U=null,D=null,P=null;const I=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,j=0;const W=n.getParameter(n.VERSION);W.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec(W)[1]),k=j>=1):W.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),k=j>=2);let ee=null,Q={};const ne=n.getParameter(n.SCISSOR_BOX),Se=n.getParameter(n.VIEWPORT),ve=new _t().fromArray(ne),oe=new _t().fromArray(Se);function ue(z,xe,le,Me){const ae=new Uint8Array(4),te=n.createTexture();n.bindTexture(z,te),n.texParameteri(z,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(z,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let fe=0;fe<le;fe++)z===n.TEXTURE_3D||z===n.TEXTURE_2D_ARRAY?n.texImage3D(xe,0,n.RGBA,1,1,Me,0,n.RGBA,n.UNSIGNED_BYTE,ae):n.texImage2D(xe+fe,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ae);return te}const X={};X[n.TEXTURE_2D]=ue(n.TEXTURE_2D,n.TEXTURE_2D,1),X[n.TEXTURE_CUBE_MAP]=ue(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),X[n.TEXTURE_2D_ARRAY]=ue(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),X[n.TEXTURE_3D]=ue(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),l.setClear(0),Z(n.DEPTH_TEST),o.setFunc(Ni),Ee(!1),Je($o),Z(n.CULL_FACE),Te(Rn);function Z(z){h[z]!==!0&&(n.enable(z),h[z]=!0)}function ce(z){h[z]!==!1&&(n.disable(z),h[z]=!1)}function Ue(z,xe){return u[z]!==xe?(n.bindFramebuffer(z,xe),u[z]=xe,z===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=xe),z===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=xe),!0):!1}function me(z,xe){let le=g,Me=!1;if(z){le=p.get(xe),le===void 0&&(le=[],p.set(xe,le));const ae=z.textures;if(le.length!==ae.length||le[0]!==n.COLOR_ATTACHMENT0){for(let te=0,fe=ae.length;te<fe;te++)le[te]=n.COLOR_ATTACHMENT0+te;le.length=ae.length,Me=!0}}else le[0]!==n.BACK&&(le[0]=n.BACK,Me=!0);Me&&n.drawBuffers(le)}function $e(z){return _!==z?(n.useProgram(z),_=z,!0):!1}const se={[ii]:n.FUNC_ADD,[Hh]:n.FUNC_SUBTRACT,[Wh]:n.FUNC_REVERSE_SUBTRACT};se[Xh]=n.MIN,se[qh]=n.MAX;const ye={[$h]:n.ZERO,[Yh]:n.ONE,[Kh]:n.SRC_COLOR,[ta]:n.SRC_ALPHA,[nf]:n.SRC_ALPHA_SATURATE,[ef]:n.DST_COLOR,[Jh]:n.DST_ALPHA,[Zh]:n.ONE_MINUS_SRC_COLOR,[na]:n.ONE_MINUS_SRC_ALPHA,[tf]:n.ONE_MINUS_DST_COLOR,[Qh]:n.ONE_MINUS_DST_ALPHA,[sf]:n.CONSTANT_COLOR,[rf]:n.ONE_MINUS_CONSTANT_COLOR,[af]:n.CONSTANT_ALPHA,[of]:n.ONE_MINUS_CONSTANT_ALPHA};function Te(z,xe,le,Me,ae,te,fe,ze,lt,it){if(z===Rn){v===!0&&(ce(n.BLEND),v=!1);return}if(v===!1&&(Z(n.BLEND),v=!0),z!==Gh){if(z!==m||it!==b){if((f!==ii||w!==ii)&&(n.blendEquation(n.FUNC_ADD),f=ii,w=ii),it)switch(z){case Ai:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Yo:n.blendFunc(n.ONE,n.ONE);break;case Ko:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Zo:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:nt("WebGLState: Invalid blending: ",z);break}else switch(z){case Ai:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Yo:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Ko:nt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Zo:nt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:nt("WebGLState: Invalid blending: ",z);break}y=null,M=null,T=null,R=null,A.set(0,0,0),B=0,m=z,b=it}return}ae=ae||xe,te=te||le,fe=fe||Me,(xe!==f||ae!==w)&&(n.blendEquationSeparate(se[xe],se[ae]),f=xe,w=ae),(le!==y||Me!==M||te!==T||fe!==R)&&(n.blendFuncSeparate(ye[le],ye[Me],ye[te],ye[fe]),y=le,M=Me,T=te,R=fe),(ze.equals(A)===!1||lt!==B)&&(n.blendColor(ze.r,ze.g,ze.b,lt),A.copy(ze),B=lt),m=z,b=!1}function Ie(z,xe){z.side===An?ce(n.CULL_FACE):Z(n.CULL_FACE);let le=z.side===Bt;xe&&(le=!le),Ee(le),z.blending===Ai&&z.transparent===!1?Te(Rn):Te(z.blending,z.blendEquation,z.blendSrc,z.blendDst,z.blendEquationAlpha,z.blendSrcAlpha,z.blendDstAlpha,z.blendColor,z.blendAlpha,z.premultipliedAlpha),o.setFunc(z.depthFunc),o.setTest(z.depthTest),o.setMask(z.depthWrite),r.setMask(z.colorWrite);const Me=z.stencilWrite;l.setTest(Me),Me&&(l.setMask(z.stencilWriteMask),l.setFunc(z.stencilFunc,z.stencilRef,z.stencilFuncMask),l.setOp(z.stencilFail,z.stencilZFail,z.stencilZPass)),ft(z.polygonOffset,z.polygonOffsetFactor,z.polygonOffsetUnits),z.alphaToCoverage===!0?Z(n.SAMPLE_ALPHA_TO_COVERAGE):ce(n.SAMPLE_ALPHA_TO_COVERAGE)}function Ee(z){E!==z&&(z?n.frontFace(n.CW):n.frontFace(n.CCW),E=z)}function Je(z){z!==jh?(Z(n.CULL_FACE),z!==N&&(z===$o?n.cullFace(n.BACK):z===zh?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):ce(n.CULL_FACE),N=z}function L(z){z!==U&&(k&&n.lineWidth(z),U=z)}function ft(z,xe,le){z?(Z(n.POLYGON_OFFSET_FILL),(D!==xe||P!==le)&&(n.polygonOffset(xe,le),D=xe,P=le)):ce(n.POLYGON_OFFSET_FILL)}function Qe(z){z?Z(n.SCISSOR_TEST):ce(n.SCISSOR_TEST)}function ot(z){z===void 0&&(z=n.TEXTURE0+I-1),ee!==z&&(n.activeTexture(z),ee=z)}function Re(z,xe,le){le===void 0&&(ee===null?le=n.TEXTURE0+I-1:le=ee);let Me=Q[le];Me===void 0&&(Me={type:void 0,texture:void 0},Q[le]=Me),(Me.type!==z||Me.texture!==xe)&&(ee!==le&&(n.activeTexture(le),ee=le),n.bindTexture(z,xe||X[z]),Me.type=z,Me.texture=xe)}function C(){const z=Q[ee];z!==void 0&&z.type!==void 0&&(n.bindTexture(z.type,null),z.type=void 0,z.texture=void 0)}function x(){try{n.compressedTexImage2D(...arguments)}catch(z){nt("WebGLState:",z)}}function V(){try{n.compressedTexImage3D(...arguments)}catch(z){nt("WebGLState:",z)}}function J(){try{n.texSubImage2D(...arguments)}catch(z){nt("WebGLState:",z)}}function ie(){try{n.texSubImage3D(...arguments)}catch(z){nt("WebGLState:",z)}}function K(){try{n.compressedTexSubImage2D(...arguments)}catch(z){nt("WebGLState:",z)}}function De(){try{n.compressedTexSubImage3D(...arguments)}catch(z){nt("WebGLState:",z)}}function de(){try{n.texStorage2D(...arguments)}catch(z){nt("WebGLState:",z)}}function Ne(){try{n.texStorage3D(...arguments)}catch(z){nt("WebGLState:",z)}}function Be(){try{n.texImage2D(...arguments)}catch(z){nt("WebGLState:",z)}}function re(){try{n.texImage3D(...arguments)}catch(z){nt("WebGLState:",z)}}function pe(z){ve.equals(z)===!1&&(n.scissor(z.x,z.y,z.z,z.w),ve.copy(z))}function Ce(z){oe.equals(z)===!1&&(n.viewport(z.x,z.y,z.z,z.w),oe.copy(z))}function Le(z,xe){let le=d.get(xe);le===void 0&&(le=new WeakMap,d.set(xe,le));let Me=le.get(z);Me===void 0&&(Me=n.getUniformBlockIndex(xe,z.name),le.set(z,Me))}function he(z,xe){const Me=d.get(xe).get(z);c.get(xe)!==Me&&(n.uniformBlockBinding(xe,Me,z.__bindingPointIndex),c.set(xe,Me))}function He(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},ee=null,Q={},u={},p=new WeakMap,g=[],_=null,v=!1,m=null,f=null,y=null,M=null,w=null,T=null,R=null,A=new dt(0,0,0),B=0,b=!1,E=null,N=null,U=null,D=null,P=null,ve.set(0,0,n.canvas.width,n.canvas.height),oe.set(0,0,n.canvas.width,n.canvas.height),r.reset(),o.reset(),l.reset()}return{buffers:{color:r,depth:o,stencil:l},enable:Z,disable:ce,bindFramebuffer:Ue,drawBuffers:me,useProgram:$e,setBlending:Te,setMaterial:Ie,setFlipSided:Ee,setCullFace:Je,setLineWidth:L,setPolygonOffset:ft,setScissorTest:Qe,activeTexture:ot,bindTexture:Re,unbindTexture:C,compressedTexImage2D:x,compressedTexImage3D:V,texImage2D:Be,texImage3D:re,updateUBOMapping:Le,uniformBlockBinding:he,texStorage2D:de,texStorage3D:Ne,texSubImage2D:J,texSubImage3D:ie,compressedTexSubImage2D:K,compressedTexSubImage3D:De,scissor:pe,viewport:Ce,reset:He}}function zx(n,e,t,i,s,r,o){const l=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),d=new at,h=new WeakMap;let u;const p=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(C,x){return g?new OffscreenCanvas(C,x):Zs("canvas")}function v(C,x,V){let J=1;const ie=Re(C);if((ie.width>V||ie.height>V)&&(J=V/Math.max(ie.width,ie.height)),J<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const K=Math.floor(J*ie.width),De=Math.floor(J*ie.height);u===void 0&&(u=_(K,De));const de=x?_(K,De):u;return de.width=K,de.height=De,de.getContext("2d").drawImage(C,0,0,K,De),Ge("WebGLRenderer: Texture has been resized from ("+ie.width+"x"+ie.height+") to ("+K+"x"+De+")."),de}else return"data"in C&&Ge("WebGLRenderer: Image in DataTexture is too big ("+ie.width+"x"+ie.height+")."),C;return C}function m(C){return C.generateMipmaps}function f(C){n.generateMipmap(C)}function y(C){return C.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?n.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function M(C,x,V,J,ie=!1){if(C!==null){if(n[C]!==void 0)return n[C];Ge("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let K=x;if(x===n.RED&&(V===n.FLOAT&&(K=n.R32F),V===n.HALF_FLOAT&&(K=n.R16F),V===n.UNSIGNED_BYTE&&(K=n.R8)),x===n.RED_INTEGER&&(V===n.UNSIGNED_BYTE&&(K=n.R8UI),V===n.UNSIGNED_SHORT&&(K=n.R16UI),V===n.UNSIGNED_INT&&(K=n.R32UI),V===n.BYTE&&(K=n.R8I),V===n.SHORT&&(K=n.R16I),V===n.INT&&(K=n.R32I)),x===n.RG&&(V===n.FLOAT&&(K=n.RG32F),V===n.HALF_FLOAT&&(K=n.RG16F),V===n.UNSIGNED_BYTE&&(K=n.RG8)),x===n.RG_INTEGER&&(V===n.UNSIGNED_BYTE&&(K=n.RG8UI),V===n.UNSIGNED_SHORT&&(K=n.RG16UI),V===n.UNSIGNED_INT&&(K=n.RG32UI),V===n.BYTE&&(K=n.RG8I),V===n.SHORT&&(K=n.RG16I),V===n.INT&&(K=n.RG32I)),x===n.RGB_INTEGER&&(V===n.UNSIGNED_BYTE&&(K=n.RGB8UI),V===n.UNSIGNED_SHORT&&(K=n.RGB16UI),V===n.UNSIGNED_INT&&(K=n.RGB32UI),V===n.BYTE&&(K=n.RGB8I),V===n.SHORT&&(K=n.RGB16I),V===n.INT&&(K=n.RGB32I)),x===n.RGBA_INTEGER&&(V===n.UNSIGNED_BYTE&&(K=n.RGBA8UI),V===n.UNSIGNED_SHORT&&(K=n.RGBA16UI),V===n.UNSIGNED_INT&&(K=n.RGBA32UI),V===n.BYTE&&(K=n.RGBA8I),V===n.SHORT&&(K=n.RGBA16I),V===n.INT&&(K=n.RGBA32I)),x===n.RGB&&(V===n.UNSIGNED_INT_5_9_9_9_REV&&(K=n.RGB9_E5),V===n.UNSIGNED_INT_10F_11F_11F_REV&&(K=n.R11F_G11F_B10F)),x===n.RGBA){const De=ie?Ys:et.getTransfer(J);V===n.FLOAT&&(K=n.RGBA32F),V===n.HALF_FLOAT&&(K=n.RGBA16F),V===n.UNSIGNED_BYTE&&(K=De===rt?n.SRGB8_ALPHA8:n.RGBA8),V===n.UNSIGNED_SHORT_4_4_4_4&&(K=n.RGBA4),V===n.UNSIGNED_SHORT_5_5_5_1&&(K=n.RGB5_A1)}return(K===n.R16F||K===n.R32F||K===n.RG16F||K===n.RG32F||K===n.RGBA16F||K===n.RGBA32F)&&e.get("EXT_color_buffer_float"),K}function w(C,x){let V;return C?x===null||x===xn||x===Qi?V=n.DEPTH24_STENCIL8:x===dn?V=n.DEPTH32F_STENCIL8:x===Ji&&(V=n.DEPTH24_STENCIL8,Ge("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===xn||x===Qi?V=n.DEPTH_COMPONENT24:x===dn?V=n.DEPTH_COMPONENT32F:x===Ji&&(V=n.DEPTH_COMPONENT16),V}function T(C,x){return m(C)===!0||C.isFramebufferTexture&&C.minFilter!==Et&&C.minFilter!==Nt?Math.log2(Math.max(x.width,x.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?x.mipmaps.length:1}function R(C){const x=C.target;x.removeEventListener("dispose",R),B(x),x.isVideoTexture&&h.delete(x)}function A(C){const x=C.target;x.removeEventListener("dispose",A),E(x)}function B(C){const x=i.get(C);if(x.__webglInit===void 0)return;const V=C.source,J=p.get(V);if(J){const ie=J[x.__cacheKey];ie.usedTimes--,ie.usedTimes===0&&b(C),Object.keys(J).length===0&&p.delete(V)}i.remove(C)}function b(C){const x=i.get(C);n.deleteTexture(x.__webglTexture);const V=C.source,J=p.get(V);delete J[x.__cacheKey],o.memory.textures--}function E(C){const x=i.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),i.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let J=0;J<6;J++){if(Array.isArray(x.__webglFramebuffer[J]))for(let ie=0;ie<x.__webglFramebuffer[J].length;ie++)n.deleteFramebuffer(x.__webglFramebuffer[J][ie]);else n.deleteFramebuffer(x.__webglFramebuffer[J]);x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer[J])}else{if(Array.isArray(x.__webglFramebuffer))for(let J=0;J<x.__webglFramebuffer.length;J++)n.deleteFramebuffer(x.__webglFramebuffer[J]);else n.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&n.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let J=0;J<x.__webglColorRenderbuffer.length;J++)x.__webglColorRenderbuffer[J]&&n.deleteRenderbuffer(x.__webglColorRenderbuffer[J]);x.__webglDepthRenderbuffer&&n.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const V=C.textures;for(let J=0,ie=V.length;J<ie;J++){const K=i.get(V[J]);K.__webglTexture&&(n.deleteTexture(K.__webglTexture),o.memory.textures--),i.remove(V[J])}i.remove(C)}let N=0;function U(){N=0}function D(){const C=N;return C>=s.maxTextures&&Ge("WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+s.maxTextures),N+=1,C}function P(C){const x=[];return x.push(C.wrapS),x.push(C.wrapT),x.push(C.wrapR||0),x.push(C.magFilter),x.push(C.minFilter),x.push(C.anisotropy),x.push(C.internalFormat),x.push(C.format),x.push(C.type),x.push(C.generateMipmaps),x.push(C.premultiplyAlpha),x.push(C.flipY),x.push(C.unpackAlignment),x.push(C.colorSpace),x.join()}function I(C,x){const V=i.get(C);if(C.isVideoTexture&&Qe(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&V.__version!==C.version){const J=C.image;if(J===null)Ge("WebGLRenderer: Texture marked for update but no image data found.");else if(J.complete===!1)Ge("WebGLRenderer: Texture marked for update but image is incomplete");else{X(V,C,x);return}}else C.isExternalTexture&&(V.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,V.__webglTexture,n.TEXTURE0+x)}function k(C,x){const V=i.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&V.__version!==C.version){X(V,C,x);return}else C.isExternalTexture&&(V.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,V.__webglTexture,n.TEXTURE0+x)}function j(C,x){const V=i.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&V.__version!==C.version){X(V,C,x);return}t.bindTexture(n.TEXTURE_3D,V.__webglTexture,n.TEXTURE0+x)}function W(C,x){const V=i.get(C);if(C.isCubeDepthTexture!==!0&&C.version>0&&V.__version!==C.version){Z(V,C,x);return}t.bindTexture(n.TEXTURE_CUBE_MAP,V.__webglTexture,n.TEXTURE0+x)}const ee={[ha]:n.REPEAT,[Cn]:n.CLAMP_TO_EDGE,[fa]:n.MIRRORED_REPEAT},Q={[Et]:n.NEAREST,[df]:n.NEAREST_MIPMAP_NEAREST,[ps]:n.NEAREST_MIPMAP_LINEAR,[Nt]:n.LINEAR,[gr]:n.LINEAR_MIPMAP_NEAREST,[ri]:n.LINEAR_MIPMAP_LINEAR},ne={[pf]:n.NEVER,[vf]:n.ALWAYS,[mf]:n.LESS,[co]:n.LEQUAL,[gf]:n.EQUAL,[uo]:n.GEQUAL,[xf]:n.GREATER,[_f]:n.NOTEQUAL};function Se(C,x){if(x.type===dn&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===Nt||x.magFilter===gr||x.magFilter===ps||x.magFilter===ri||x.minFilter===Nt||x.minFilter===gr||x.minFilter===ps||x.minFilter===ri)&&Ge("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(C,n.TEXTURE_WRAP_S,ee[x.wrapS]),n.texParameteri(C,n.TEXTURE_WRAP_T,ee[x.wrapT]),(C===n.TEXTURE_3D||C===n.TEXTURE_2D_ARRAY)&&n.texParameteri(C,n.TEXTURE_WRAP_R,ee[x.wrapR]),n.texParameteri(C,n.TEXTURE_MAG_FILTER,Q[x.magFilter]),n.texParameteri(C,n.TEXTURE_MIN_FILTER,Q[x.minFilter]),x.compareFunction&&(n.texParameteri(C,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(C,n.TEXTURE_COMPARE_FUNC,ne[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===Et||x.minFilter!==ps&&x.minFilter!==ri||x.type===dn&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||i.get(x).__currentAnisotropy){const V=e.get("EXT_texture_filter_anisotropic");n.texParameterf(C,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),i.get(x).__currentAnisotropy=x.anisotropy}}}function ve(C,x){let V=!1;C.__webglInit===void 0&&(C.__webglInit=!0,x.addEventListener("dispose",R));const J=x.source;let ie=p.get(J);ie===void 0&&(ie={},p.set(J,ie));const K=P(x);if(K!==C.__cacheKey){ie[K]===void 0&&(ie[K]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,V=!0),ie[K].usedTimes++;const De=ie[C.__cacheKey];De!==void 0&&(ie[C.__cacheKey].usedTimes--,De.usedTimes===0&&b(x)),C.__cacheKey=K,C.__webglTexture=ie[K].texture}return V}function oe(C,x,V){return Math.floor(Math.floor(C/V)/x)}function ue(C,x,V,J){const K=C.updateRanges;if(K.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,x.width,x.height,V,J,x.data);else{K.sort((re,pe)=>re.start-pe.start);let De=0;for(let re=1;re<K.length;re++){const pe=K[De],Ce=K[re],Le=pe.start+pe.count,he=oe(Ce.start,x.width,4),He=oe(pe.start,x.width,4);Ce.start<=Le+1&&he===He&&oe(Ce.start+Ce.count-1,x.width,4)===he?pe.count=Math.max(pe.count,Ce.start+Ce.count-pe.start):(++De,K[De]=Ce)}K.length=De+1;const de=n.getParameter(n.UNPACK_ROW_LENGTH),Ne=n.getParameter(n.UNPACK_SKIP_PIXELS),Be=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,x.width);for(let re=0,pe=K.length;re<pe;re++){const Ce=K[re],Le=Math.floor(Ce.start/4),he=Math.ceil(Ce.count/4),He=Le%x.width,z=Math.floor(Le/x.width),xe=he,le=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,He),n.pixelStorei(n.UNPACK_SKIP_ROWS,z),t.texSubImage2D(n.TEXTURE_2D,0,He,z,xe,le,V,J,x.data)}C.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,de),n.pixelStorei(n.UNPACK_SKIP_PIXELS,Ne),n.pixelStorei(n.UNPACK_SKIP_ROWS,Be)}}function X(C,x,V){let J=n.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(J=n.TEXTURE_2D_ARRAY),x.isData3DTexture&&(J=n.TEXTURE_3D);const ie=ve(C,x),K=x.source;t.bindTexture(J,C.__webglTexture,n.TEXTURE0+V);const De=i.get(K);if(K.version!==De.__version||ie===!0){t.activeTexture(n.TEXTURE0+V);const de=et.getPrimaries(et.workingColorSpace),Ne=x.colorSpace===Hn?null:et.getPrimaries(x.colorSpace),Be=x.colorSpace===Hn||de===Ne?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Be);let re=v(x.image,!1,s.maxTextureSize);re=ot(x,re);const pe=r.convert(x.format,x.colorSpace),Ce=r.convert(x.type);let Le=M(x.internalFormat,pe,Ce,x.colorSpace,x.isVideoTexture);Se(J,x);let he;const He=x.mipmaps,z=x.isVideoTexture!==!0,xe=De.__version===void 0||ie===!0,le=K.dataReady,Me=T(x,re);if(x.isDepthTexture)Le=w(x.format===ai,x.type),xe&&(z?t.texStorage2D(n.TEXTURE_2D,1,Le,re.width,re.height):t.texImage2D(n.TEXTURE_2D,0,Le,re.width,re.height,0,pe,Ce,null));else if(x.isDataTexture)if(He.length>0){z&&xe&&t.texStorage2D(n.TEXTURE_2D,Me,Le,He[0].width,He[0].height);for(let ae=0,te=He.length;ae<te;ae++)he=He[ae],z?le&&t.texSubImage2D(n.TEXTURE_2D,ae,0,0,he.width,he.height,pe,Ce,he.data):t.texImage2D(n.TEXTURE_2D,ae,Le,he.width,he.height,0,pe,Ce,he.data);x.generateMipmaps=!1}else z?(xe&&t.texStorage2D(n.TEXTURE_2D,Me,Le,re.width,re.height),le&&ue(x,re,pe,Ce)):t.texImage2D(n.TEXTURE_2D,0,Le,re.width,re.height,0,pe,Ce,re.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){z&&xe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Me,Le,He[0].width,He[0].height,re.depth);for(let ae=0,te=He.length;ae<te;ae++)if(he=He[ae],x.format!==an)if(pe!==null)if(z){if(le)if(x.layerUpdates.size>0){const fe=vl(he.width,he.height,x.format,x.type);for(const ze of x.layerUpdates){const lt=he.data.subarray(ze*fe/he.data.BYTES_PER_ELEMENT,(ze+1)*fe/he.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ae,0,0,ze,he.width,he.height,1,pe,lt)}x.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ae,0,0,0,he.width,he.height,re.depth,pe,he.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,ae,Le,he.width,he.height,re.depth,0,he.data,0,0);else Ge("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else z?le&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,ae,0,0,0,he.width,he.height,re.depth,pe,Ce,he.data):t.texImage3D(n.TEXTURE_2D_ARRAY,ae,Le,he.width,he.height,re.depth,0,pe,Ce,he.data)}else{z&&xe&&t.texStorage2D(n.TEXTURE_2D,Me,Le,He[0].width,He[0].height);for(let ae=0,te=He.length;ae<te;ae++)he=He[ae],x.format!==an?pe!==null?z?le&&t.compressedTexSubImage2D(n.TEXTURE_2D,ae,0,0,he.width,he.height,pe,he.data):t.compressedTexImage2D(n.TEXTURE_2D,ae,Le,he.width,he.height,0,he.data):Ge("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):z?le&&t.texSubImage2D(n.TEXTURE_2D,ae,0,0,he.width,he.height,pe,Ce,he.data):t.texImage2D(n.TEXTURE_2D,ae,Le,he.width,he.height,0,pe,Ce,he.data)}else if(x.isDataArrayTexture)if(z){if(xe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Me,Le,re.width,re.height,re.depth),le)if(x.layerUpdates.size>0){const ae=vl(re.width,re.height,x.format,x.type);for(const te of x.layerUpdates){const fe=re.data.subarray(te*ae/re.data.BYTES_PER_ELEMENT,(te+1)*ae/re.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,te,re.width,re.height,1,pe,Ce,fe)}x.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,re.width,re.height,re.depth,pe,Ce,re.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Le,re.width,re.height,re.depth,0,pe,Ce,re.data);else if(x.isData3DTexture)z?(xe&&t.texStorage3D(n.TEXTURE_3D,Me,Le,re.width,re.height,re.depth),le&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,re.width,re.height,re.depth,pe,Ce,re.data)):t.texImage3D(n.TEXTURE_3D,0,Le,re.width,re.height,re.depth,0,pe,Ce,re.data);else if(x.isFramebufferTexture){if(xe)if(z)t.texStorage2D(n.TEXTURE_2D,Me,Le,re.width,re.height);else{let ae=re.width,te=re.height;for(let fe=0;fe<Me;fe++)t.texImage2D(n.TEXTURE_2D,fe,Le,ae,te,0,pe,Ce,null),ae>>=1,te>>=1}}else if(He.length>0){if(z&&xe){const ae=Re(He[0]);t.texStorage2D(n.TEXTURE_2D,Me,Le,ae.width,ae.height)}for(let ae=0,te=He.length;ae<te;ae++)he=He[ae],z?le&&t.texSubImage2D(n.TEXTURE_2D,ae,0,0,pe,Ce,he):t.texImage2D(n.TEXTURE_2D,ae,Le,pe,Ce,he);x.generateMipmaps=!1}else if(z){if(xe){const ae=Re(re);t.texStorage2D(n.TEXTURE_2D,Me,Le,ae.width,ae.height)}le&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,pe,Ce,re)}else t.texImage2D(n.TEXTURE_2D,0,Le,pe,Ce,re);m(x)&&f(J),De.__version=K.version,x.onUpdate&&x.onUpdate(x)}C.__version=x.version}function Z(C,x,V){if(x.image.length!==6)return;const J=ve(C,x),ie=x.source;t.bindTexture(n.TEXTURE_CUBE_MAP,C.__webglTexture,n.TEXTURE0+V);const K=i.get(ie);if(ie.version!==K.__version||J===!0){t.activeTexture(n.TEXTURE0+V);const De=et.getPrimaries(et.workingColorSpace),de=x.colorSpace===Hn?null:et.getPrimaries(x.colorSpace),Ne=x.colorSpace===Hn||De===de?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ne);const Be=x.isCompressedTexture||x.image[0].isCompressedTexture,re=x.image[0]&&x.image[0].isDataTexture,pe=[];for(let te=0;te<6;te++)!Be&&!re?pe[te]=v(x.image[te],!0,s.maxCubemapSize):pe[te]=re?x.image[te].image:x.image[te],pe[te]=ot(x,pe[te]);const Ce=pe[0],Le=r.convert(x.format,x.colorSpace),he=r.convert(x.type),He=M(x.internalFormat,Le,he,x.colorSpace),z=x.isVideoTexture!==!0,xe=K.__version===void 0||J===!0,le=ie.dataReady;let Me=T(x,Ce);Se(n.TEXTURE_CUBE_MAP,x);let ae;if(Be){z&&xe&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Me,He,Ce.width,Ce.height);for(let te=0;te<6;te++){ae=pe[te].mipmaps;for(let fe=0;fe<ae.length;fe++){const ze=ae[fe];x.format!==an?Le!==null?z?le&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,fe,0,0,ze.width,ze.height,Le,ze.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,fe,He,ze.width,ze.height,0,ze.data):Ge("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):z?le&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,fe,0,0,ze.width,ze.height,Le,he,ze.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,fe,He,ze.width,ze.height,0,Le,he,ze.data)}}}else{if(ae=x.mipmaps,z&&xe){ae.length>0&&Me++;const te=Re(pe[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Me,He,te.width,te.height)}for(let te=0;te<6;te++)if(re){z?le&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,pe[te].width,pe[te].height,Le,he,pe[te].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,He,pe[te].width,pe[te].height,0,Le,he,pe[te].data);for(let fe=0;fe<ae.length;fe++){const lt=ae[fe].image[te].image;z?le&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,fe+1,0,0,lt.width,lt.height,Le,he,lt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,fe+1,He,lt.width,lt.height,0,Le,he,lt.data)}}else{z?le&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,Le,he,pe[te]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,He,Le,he,pe[te]);for(let fe=0;fe<ae.length;fe++){const ze=ae[fe];z?le&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,fe+1,0,0,Le,he,ze.image[te]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,fe+1,He,Le,he,ze.image[te])}}}m(x)&&f(n.TEXTURE_CUBE_MAP),K.__version=ie.version,x.onUpdate&&x.onUpdate(x)}C.__version=x.version}function ce(C,x,V,J,ie,K){const De=r.convert(V.format,V.colorSpace),de=r.convert(V.type),Ne=M(V.internalFormat,De,de,V.colorSpace),Be=i.get(x),re=i.get(V);if(re.__renderTarget=x,!Be.__hasExternalTextures){const pe=Math.max(1,x.width>>K),Ce=Math.max(1,x.height>>K);ie===n.TEXTURE_3D||ie===n.TEXTURE_2D_ARRAY?t.texImage3D(ie,K,Ne,pe,Ce,x.depth,0,De,de,null):t.texImage2D(ie,K,Ne,pe,Ce,0,De,de,null)}t.bindFramebuffer(n.FRAMEBUFFER,C),ft(x)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,J,ie,re.__webglTexture,0,L(x)):(ie===n.TEXTURE_2D||ie>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ie<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,J,ie,re.__webglTexture,K),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Ue(C,x,V){if(n.bindRenderbuffer(n.RENDERBUFFER,C),x.depthBuffer){const J=x.depthTexture,ie=J&&J.isDepthTexture?J.type:null,K=w(x.stencilBuffer,ie),De=x.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;ft(x)?l.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,L(x),K,x.width,x.height):V?n.renderbufferStorageMultisample(n.RENDERBUFFER,L(x),K,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,K,x.width,x.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,De,n.RENDERBUFFER,C)}else{const J=x.textures;for(let ie=0;ie<J.length;ie++){const K=J[ie],De=r.convert(K.format,K.colorSpace),de=r.convert(K.type),Ne=M(K.internalFormat,De,de,K.colorSpace);ft(x)?l.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,L(x),Ne,x.width,x.height):V?n.renderbufferStorageMultisample(n.RENDERBUFFER,L(x),Ne,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,Ne,x.width,x.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function me(C,x,V){const J=x.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,C),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ie=i.get(x.depthTexture);if(ie.__renderTarget=x,(!ie.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),J){if(ie.__webglInit===void 0&&(ie.__webglInit=!0,x.depthTexture.addEventListener("dispose",R)),ie.__webglTexture===void 0){ie.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,ie.__webglTexture),Se(n.TEXTURE_CUBE_MAP,x.depthTexture);const Be=r.convert(x.depthTexture.format),re=r.convert(x.depthTexture.type);let pe;x.depthTexture.format===Dn?pe=n.DEPTH_COMPONENT24:x.depthTexture.format===ai&&(pe=n.DEPTH24_STENCIL8);for(let Ce=0;Ce<6;Ce++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Ce,0,pe,x.width,x.height,0,Be,re,null)}}else I(x.depthTexture,0);const K=ie.__webglTexture,De=L(x),de=J?n.TEXTURE_CUBE_MAP_POSITIVE_X+V:n.TEXTURE_2D,Ne=x.depthTexture.format===ai?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(x.depthTexture.format===Dn)ft(x)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Ne,de,K,0,De):n.framebufferTexture2D(n.FRAMEBUFFER,Ne,de,K,0);else if(x.depthTexture.format===ai)ft(x)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Ne,de,K,0,De):n.framebufferTexture2D(n.FRAMEBUFFER,Ne,de,K,0);else throw new Error("Unknown depthTexture format")}function $e(C){const x=i.get(C),V=C.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==C.depthTexture){const J=C.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),J){const ie=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,J.removeEventListener("dispose",ie)};J.addEventListener("dispose",ie),x.__depthDisposeCallback=ie}x.__boundDepthTexture=J}if(C.depthTexture&&!x.__autoAllocateDepthBuffer)if(V)for(let J=0;J<6;J++)me(x.__webglFramebuffer[J],C,J);else{const J=C.texture.mipmaps;J&&J.length>0?me(x.__webglFramebuffer[0],C,0):me(x.__webglFramebuffer,C,0)}else if(V){x.__webglDepthbuffer=[];for(let J=0;J<6;J++)if(t.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[J]),x.__webglDepthbuffer[J]===void 0)x.__webglDepthbuffer[J]=n.createRenderbuffer(),Ue(x.__webglDepthbuffer[J],C,!1);else{const ie=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,K=x.__webglDepthbuffer[J];n.bindRenderbuffer(n.RENDERBUFFER,K),n.framebufferRenderbuffer(n.FRAMEBUFFER,ie,n.RENDERBUFFER,K)}}else{const J=C.texture.mipmaps;if(J&&J.length>0?t.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=n.createRenderbuffer(),Ue(x.__webglDepthbuffer,C,!1);else{const ie=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,K=x.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,K),n.framebufferRenderbuffer(n.FRAMEBUFFER,ie,n.RENDERBUFFER,K)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function se(C,x,V){const J=i.get(C);x!==void 0&&ce(J.__webglFramebuffer,C,C.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),V!==void 0&&$e(C)}function ye(C){const x=C.texture,V=i.get(C),J=i.get(x);C.addEventListener("dispose",A);const ie=C.textures,K=C.isWebGLCubeRenderTarget===!0,De=ie.length>1;if(De||(J.__webglTexture===void 0&&(J.__webglTexture=n.createTexture()),J.__version=x.version,o.memory.textures++),K){V.__webglFramebuffer=[];for(let de=0;de<6;de++)if(x.mipmaps&&x.mipmaps.length>0){V.__webglFramebuffer[de]=[];for(let Ne=0;Ne<x.mipmaps.length;Ne++)V.__webglFramebuffer[de][Ne]=n.createFramebuffer()}else V.__webglFramebuffer[de]=n.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){V.__webglFramebuffer=[];for(let de=0;de<x.mipmaps.length;de++)V.__webglFramebuffer[de]=n.createFramebuffer()}else V.__webglFramebuffer=n.createFramebuffer();if(De)for(let de=0,Ne=ie.length;de<Ne;de++){const Be=i.get(ie[de]);Be.__webglTexture===void 0&&(Be.__webglTexture=n.createTexture(),o.memory.textures++)}if(C.samples>0&&ft(C)===!1){V.__webglMultisampledFramebuffer=n.createFramebuffer(),V.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let de=0;de<ie.length;de++){const Ne=ie[de];V.__webglColorRenderbuffer[de]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,V.__webglColorRenderbuffer[de]);const Be=r.convert(Ne.format,Ne.colorSpace),re=r.convert(Ne.type),pe=M(Ne.internalFormat,Be,re,Ne.colorSpace,C.isXRRenderTarget===!0),Ce=L(C);n.renderbufferStorageMultisample(n.RENDERBUFFER,Ce,pe,C.width,C.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+de,n.RENDERBUFFER,V.__webglColorRenderbuffer[de])}n.bindRenderbuffer(n.RENDERBUFFER,null),C.depthBuffer&&(V.__webglDepthRenderbuffer=n.createRenderbuffer(),Ue(V.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(K){t.bindTexture(n.TEXTURE_CUBE_MAP,J.__webglTexture),Se(n.TEXTURE_CUBE_MAP,x);for(let de=0;de<6;de++)if(x.mipmaps&&x.mipmaps.length>0)for(let Ne=0;Ne<x.mipmaps.length;Ne++)ce(V.__webglFramebuffer[de][Ne],C,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+de,Ne);else ce(V.__webglFramebuffer[de],C,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+de,0);m(x)&&f(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(De){for(let de=0,Ne=ie.length;de<Ne;de++){const Be=ie[de],re=i.get(Be);let pe=n.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(pe=C.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(pe,re.__webglTexture),Se(pe,Be),ce(V.__webglFramebuffer,C,Be,n.COLOR_ATTACHMENT0+de,pe,0),m(Be)&&f(pe)}t.unbindTexture()}else{let de=n.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(de=C.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(de,J.__webglTexture),Se(de,x),x.mipmaps&&x.mipmaps.length>0)for(let Ne=0;Ne<x.mipmaps.length;Ne++)ce(V.__webglFramebuffer[Ne],C,x,n.COLOR_ATTACHMENT0,de,Ne);else ce(V.__webglFramebuffer,C,x,n.COLOR_ATTACHMENT0,de,0);m(x)&&f(de),t.unbindTexture()}C.depthBuffer&&$e(C)}function Te(C){const x=C.textures;for(let V=0,J=x.length;V<J;V++){const ie=x[V];if(m(ie)){const K=y(C),De=i.get(ie).__webglTexture;t.bindTexture(K,De),f(K),t.unbindTexture()}}}const Ie=[],Ee=[];function Je(C){if(C.samples>0){if(ft(C)===!1){const x=C.textures,V=C.width,J=C.height;let ie=n.COLOR_BUFFER_BIT;const K=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,De=i.get(C),de=x.length>1;if(de)for(let Be=0;Be<x.length;Be++)t.bindFramebuffer(n.FRAMEBUFFER,De.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Be,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,De.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Be,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,De.__webglMultisampledFramebuffer);const Ne=C.texture.mipmaps;Ne&&Ne.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,De.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,De.__webglFramebuffer);for(let Be=0;Be<x.length;Be++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(ie|=n.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(ie|=n.STENCIL_BUFFER_BIT)),de){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,De.__webglColorRenderbuffer[Be]);const re=i.get(x[Be]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,re,0)}n.blitFramebuffer(0,0,V,J,0,0,V,J,ie,n.NEAREST),c===!0&&(Ie.length=0,Ee.length=0,Ie.push(n.COLOR_ATTACHMENT0+Be),C.depthBuffer&&C.resolveDepthBuffer===!1&&(Ie.push(K),Ee.push(K),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,Ee)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Ie))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),de)for(let Be=0;Be<x.length;Be++){t.bindFramebuffer(n.FRAMEBUFFER,De.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Be,n.RENDERBUFFER,De.__webglColorRenderbuffer[Be]);const re=i.get(x[Be]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,De.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Be,n.TEXTURE_2D,re,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,De.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&c){const x=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[x])}}}function L(C){return Math.min(s.maxSamples,C.samples)}function ft(C){const x=i.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function Qe(C){const x=o.render.frame;h.get(C)!==x&&(h.set(C,x),C.update())}function ot(C,x){const V=C.colorSpace,J=C.format,ie=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||V!==Di&&V!==Hn&&(et.getTransfer(V)===rt?(J!==an||ie!==Zt)&&Ge("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):nt("WebGLTextures: Unsupported texture color space:",V)),x}function Re(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(d.width=C.naturalWidth||C.width,d.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(d.width=C.displayWidth,d.height=C.displayHeight):(d.width=C.width,d.height=C.height),d}this.allocateTextureUnit=D,this.resetTextureUnits=U,this.setTexture2D=I,this.setTexture2DArray=k,this.setTexture3D=j,this.setTextureCube=W,this.rebindTextures=se,this.setupRenderTarget=ye,this.updateRenderTargetMipmap=Te,this.updateMultisampleRenderTarget=Je,this.setupDepthRenderbuffer=$e,this.setupFrameBufferTexture=ce,this.useMultisampledRTT=ft,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function Vx(n,e){function t(i,s=Hn){let r;const o=et.getTransfer(s);if(i===Zt)return n.UNSIGNED_BYTE;if(i===so)return n.UNSIGNED_SHORT_4_4_4_4;if(i===ro)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Nc)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Pc)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Cc)return n.BYTE;if(i===Rc)return n.SHORT;if(i===Ji)return n.UNSIGNED_SHORT;if(i===io)return n.INT;if(i===xn)return n.UNSIGNED_INT;if(i===dn)return n.FLOAT;if(i===Ln)return n.HALF_FLOAT;if(i===Lc)return n.ALPHA;if(i===Dc)return n.RGB;if(i===an)return n.RGBA;if(i===Dn)return n.DEPTH_COMPONENT;if(i===ai)return n.DEPTH_STENCIL;if(i===Ic)return n.RED;if(i===ao)return n.RED_INTEGER;if(i===Li)return n.RG;if(i===oo)return n.RG_INTEGER;if(i===lo)return n.RGBA_INTEGER;if(i===Vs||i===Gs||i===Hs||i===Ws)if(o===rt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Vs)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Gs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Hs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Ws)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Vs)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Gs)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Hs)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Ws)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===pa||i===ma||i===ga||i===xa)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===pa)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===ma)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===ga)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===xa)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===_a||i===va||i===ba||i===ya||i===wa||i===Sa||i===Ma)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===_a||i===va)return o===rt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===ba)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===ya)return r.COMPRESSED_R11_EAC;if(i===wa)return r.COMPRESSED_SIGNED_R11_EAC;if(i===Sa)return r.COMPRESSED_RG11_EAC;if(i===Ma)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Ea||i===Ta||i===Aa||i===Ca||i===Ra||i===Na||i===Pa||i===La||i===Da||i===Ia||i===Ua||i===Fa||i===ka||i===Oa)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Ea)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Ta)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Aa)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Ca)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ra)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Na)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Pa)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===La)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Da)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Ia)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Ua)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Fa)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===ka)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Oa)return o===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Ba||i===ja||i===za)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===Ba)return o===rt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===ja)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===za)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Va||i===Ga||i===Ha||i===Wa)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===Va)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Ga)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Ha)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Wa)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Qi?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const Gx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Hx=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Wx{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new Xc(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new on({vertexShader:Gx,fragmentShader:Hx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new _n(new ls(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Xx extends Fi{constructor(e,t){super();const i=this;let s=null,r=1,o=null,l="local-floor",c=1,d=null,h=null,u=null,p=null,g=null,_=null;const v=typeof XRWebGLBinding<"u",m=new Wx,f={},y=t.getContextAttributes();let M=null,w=null;const T=[],R=[],A=new at;let B=null;const b=new sn;b.viewport=new _t;const E=new sn;E.viewport=new _t;const N=[b,E],U=new np;let D=null,P=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let Z=T[X];return Z===void 0&&(Z=new Br,T[X]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function(X){let Z=T[X];return Z===void 0&&(Z=new Br,T[X]=Z),Z.getGripSpace()},this.getHand=function(X){let Z=T[X];return Z===void 0&&(Z=new Br,T[X]=Z),Z.getHandSpace()};function I(X){const Z=R.indexOf(X.inputSource);if(Z===-1)return;const ce=T[Z];ce!==void 0&&(ce.update(X.inputSource,X.frame,d||o),ce.dispatchEvent({type:X.type,data:X.inputSource}))}function k(){s.removeEventListener("select",I),s.removeEventListener("selectstart",I),s.removeEventListener("selectend",I),s.removeEventListener("squeeze",I),s.removeEventListener("squeezestart",I),s.removeEventListener("squeezeend",I),s.removeEventListener("end",k),s.removeEventListener("inputsourceschange",j);for(let X=0;X<T.length;X++){const Z=R[X];Z!==null&&(R[X]=null,T[X].disconnect(Z))}D=null,P=null,m.reset();for(const X in f)delete f[X];e.setRenderTarget(M),g=null,p=null,u=null,s=null,w=null,ue.stop(),i.isPresenting=!1,e.setPixelRatio(B),e.setSize(A.width,A.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){r=X,i.isPresenting===!0&&Ge("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){l=X,i.isPresenting===!0&&Ge("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return d||o},this.setReferenceSpace=function(X){d=X},this.getBaseLayer=function(){return p!==null?p:g},this.getBinding=function(){return u===null&&v&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return _},this.getSession=function(){return s},this.setSession=async function(X){if(s=X,s!==null){if(M=e.getRenderTarget(),s.addEventListener("select",I),s.addEventListener("selectstart",I),s.addEventListener("selectend",I),s.addEventListener("squeeze",I),s.addEventListener("squeezestart",I),s.addEventListener("squeezeend",I),s.addEventListener("end",k),s.addEventListener("inputsourceschange",j),y.xrCompatible!==!0&&await t.makeXRCompatible(),B=e.getPixelRatio(),e.getSize(A),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let ce=null,Ue=null,me=null;y.depth&&(me=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ce=y.stencil?ai:Dn,Ue=y.stencil?Qi:xn);const $e={colorFormat:t.RGBA8,depthFormat:me,scaleFactor:r};u=this.getBinding(),p=u.createProjectionLayer($e),s.updateRenderState({layers:[p]}),e.setPixelRatio(1),e.setSize(p.textureWidth,p.textureHeight,!1),w=new pn(p.textureWidth,p.textureHeight,{format:an,type:Zt,depthTexture:new ts(p.textureWidth,p.textureHeight,Ue,void 0,void 0,void 0,void 0,void 0,void 0,ce),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}else{const ce={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:r};g=new XRWebGLLayer(s,t,ce),s.updateRenderState({baseLayer:g}),e.setPixelRatio(1),e.setSize(g.framebufferWidth,g.framebufferHeight,!1),w=new pn(g.framebufferWidth,g.framebufferHeight,{format:an,type:Zt,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:g.ignoreDepthValues===!1,resolveStencilBuffer:g.ignoreDepthValues===!1})}w.isXRRenderTarget=!0,this.setFoveation(c),d=null,o=await s.requestReferenceSpace(l),ue.setContext(s),ue.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function j(X){for(let Z=0;Z<X.removed.length;Z++){const ce=X.removed[Z],Ue=R.indexOf(ce);Ue>=0&&(R[Ue]=null,T[Ue].disconnect(ce))}for(let Z=0;Z<X.added.length;Z++){const ce=X.added[Z];let Ue=R.indexOf(ce);if(Ue===-1){for(let $e=0;$e<T.length;$e++)if($e>=R.length){R.push(ce),Ue=$e;break}else if(R[$e]===null){R[$e]=ce,Ue=$e;break}if(Ue===-1)break}const me=T[Ue];me&&me.connect(ce)}}const W=new $,ee=new $;function Q(X,Z,ce){W.setFromMatrixPosition(Z.matrixWorld),ee.setFromMatrixPosition(ce.matrixWorld);const Ue=W.distanceTo(ee),me=Z.projectionMatrix.elements,$e=ce.projectionMatrix.elements,se=me[14]/(me[10]-1),ye=me[14]/(me[10]+1),Te=(me[9]+1)/me[5],Ie=(me[9]-1)/me[5],Ee=(me[8]-1)/me[0],Je=($e[8]+1)/$e[0],L=se*Ee,ft=se*Je,Qe=Ue/(-Ee+Je),ot=Qe*-Ee;if(Z.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(ot),X.translateZ(Qe),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert(),me[10]===-1)X.projectionMatrix.copy(Z.projectionMatrix),X.projectionMatrixInverse.copy(Z.projectionMatrixInverse);else{const Re=se+Qe,C=ye+Qe,x=L-ot,V=ft+(Ue-ot),J=Te*ye/C*Re,ie=Ie*ye/C*Re;X.projectionMatrix.makePerspective(x,V,J,ie,Re,C),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}}function ne(X,Z){Z===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(Z.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(s===null)return;let Z=X.near,ce=X.far;m.texture!==null&&(m.depthNear>0&&(Z=m.depthNear),m.depthFar>0&&(ce=m.depthFar)),U.near=E.near=b.near=Z,U.far=E.far=b.far=ce,(D!==U.near||P!==U.far)&&(s.updateRenderState({depthNear:U.near,depthFar:U.far}),D=U.near,P=U.far),U.layers.mask=X.layers.mask|6,b.layers.mask=U.layers.mask&3,E.layers.mask=U.layers.mask&5;const Ue=X.parent,me=U.cameras;ne(U,Ue);for(let $e=0;$e<me.length;$e++)ne(me[$e],Ue);me.length===2?Q(U,b,E):U.projectionMatrix.copy(b.projectionMatrix),Se(X,U,Ue)};function Se(X,Z,ce){ce===null?X.matrix.copy(Z.matrixWorld):(X.matrix.copy(ce.matrixWorld),X.matrix.invert(),X.matrix.multiply(Z.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(Z.projectionMatrix),X.projectionMatrixInverse.copy(Z.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=Xa*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return U},this.getFoveation=function(){if(!(p===null&&g===null))return c},this.setFoveation=function(X){c=X,p!==null&&(p.fixedFoveation=X),g!==null&&g.fixedFoveation!==void 0&&(g.fixedFoveation=X)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(U)},this.getCameraTexture=function(X){return f[X]};let ve=null;function oe(X,Z){if(h=Z.getViewerPose(d||o),_=Z,h!==null){const ce=h.views;g!==null&&(e.setRenderTargetFramebuffer(w,g.framebuffer),e.setRenderTarget(w));let Ue=!1;ce.length!==U.cameras.length&&(U.cameras.length=0,Ue=!0);for(let ye=0;ye<ce.length;ye++){const Te=ce[ye];let Ie=null;if(g!==null)Ie=g.getViewport(Te);else{const Je=u.getViewSubImage(p,Te);Ie=Je.viewport,ye===0&&(e.setRenderTargetTextures(w,Je.colorTexture,Je.depthStencilTexture),e.setRenderTarget(w))}let Ee=N[ye];Ee===void 0&&(Ee=new sn,Ee.layers.enable(ye),Ee.viewport=new _t,N[ye]=Ee),Ee.matrix.fromArray(Te.transform.matrix),Ee.matrix.decompose(Ee.position,Ee.quaternion,Ee.scale),Ee.projectionMatrix.fromArray(Te.projectionMatrix),Ee.projectionMatrixInverse.copy(Ee.projectionMatrix).invert(),Ee.viewport.set(Ie.x,Ie.y,Ie.width,Ie.height),ye===0&&(U.matrix.copy(Ee.matrix),U.matrix.decompose(U.position,U.quaternion,U.scale)),Ue===!0&&U.cameras.push(Ee)}const me=s.enabledFeatures;if(me&&me.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){u=i.getBinding();const ye=u.getDepthInformation(ce[0]);ye&&ye.isValid&&ye.texture&&m.init(ye,s.renderState)}if(me&&me.includes("camera-access")&&v){e.state.unbindTexture(),u=i.getBinding();for(let ye=0;ye<ce.length;ye++){const Te=ce[ye].camera;if(Te){let Ie=f[Te];Ie||(Ie=new Xc,f[Te]=Ie);const Ee=u.getCameraImage(Te);Ie.sourceTexture=Ee}}}}for(let ce=0;ce<T.length;ce++){const Ue=R[ce],me=T[ce];Ue!==null&&me!==void 0&&me.update(Ue,Z,d||o)}ve&&ve(X,Z),Z.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Z}),_=null}const ue=new $c;ue.setAnimationLoop(oe),this.setAnimationLoop=function(X){ve=X},this.dispose=function(){}}}const ti=new In,qx=new yt;function $x(n,e){function t(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function i(m,f){f.color.getRGB(m.fogColor.value,Vc(n)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,y,M,w){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(m,f):f.isMeshToonMaterial?(r(m,f),u(m,f)):f.isMeshPhongMaterial?(r(m,f),h(m,f)):f.isMeshStandardMaterial?(r(m,f),p(m,f),f.isMeshPhysicalMaterial&&g(m,f,w)):f.isMeshMatcapMaterial?(r(m,f),_(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),v(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(o(m,f),f.isLineDashedMaterial&&l(m,f)):f.isPointsMaterial?c(m,f,y,M):f.isSpriteMaterial?d(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,t(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Bt&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,t(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Bt&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,t(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,t(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const y=e.get(f),M=y.envMap,w=y.envMapRotation;M&&(m.envMap.value=M,ti.copy(w),ti.x*=-1,ti.y*=-1,ti.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(ti.y*=-1,ti.z*=-1),m.envMapRotation.value.setFromMatrix4(qx.makeRotationFromEuler(ti)),m.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,m.aoMapTransform))}function o(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform))}function l(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function c(m,f,y,M){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*y,m.scale.value=M*.5,f.map&&(m.map.value=f.map,t(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function d(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function u(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function p(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function g(m,f,y){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Bt&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=y.texture,m.transmissionSamplerSize.value.set(y.width,y.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,m.specularIntensityMapTransform))}function _(m,f){f.matcap&&(m.matcap.value=f.matcap)}function v(m,f){const y=e.get(f).light;m.referencePosition.value.setFromMatrixPosition(y.matrixWorld),m.nearDistance.value=y.shadow.camera.near,m.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function Yx(n,e,t,i){let s={},r={},o=[];const l=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(y,M){const w=M.program;i.uniformBlockBinding(y,w)}function d(y,M){let w=s[y.id];w===void 0&&(_(y),w=h(y),s[y.id]=w,y.addEventListener("dispose",m));const T=M.program;i.updateUBOMapping(y,T);const R=e.render.frame;r[y.id]!==R&&(p(y),r[y.id]=R)}function h(y){const M=u();y.__bindingPointIndex=M;const w=n.createBuffer(),T=y.__size,R=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,w),n.bufferData(n.UNIFORM_BUFFER,T,R),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,M,w),w}function u(){for(let y=0;y<l;y++)if(o.indexOf(y)===-1)return o.push(y),y;return nt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(y){const M=s[y.id],w=y.uniforms,T=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,M);for(let R=0,A=w.length;R<A;R++){const B=Array.isArray(w[R])?w[R]:[w[R]];for(let b=0,E=B.length;b<E;b++){const N=B[b];if(g(N,R,b,T)===!0){const U=N.__offset,D=Array.isArray(N.value)?N.value:[N.value];let P=0;for(let I=0;I<D.length;I++){const k=D[I],j=v(k);typeof k=="number"||typeof k=="boolean"?(N.__data[0]=k,n.bufferSubData(n.UNIFORM_BUFFER,U+P,N.__data)):k.isMatrix3?(N.__data[0]=k.elements[0],N.__data[1]=k.elements[1],N.__data[2]=k.elements[2],N.__data[3]=0,N.__data[4]=k.elements[3],N.__data[5]=k.elements[4],N.__data[6]=k.elements[5],N.__data[7]=0,N.__data[8]=k.elements[6],N.__data[9]=k.elements[7],N.__data[10]=k.elements[8],N.__data[11]=0):(k.toArray(N.__data,P),P+=j.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,U,N.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function g(y,M,w,T){const R=y.value,A=M+"_"+w;if(T[A]===void 0)return typeof R=="number"||typeof R=="boolean"?T[A]=R:T[A]=R.clone(),!0;{const B=T[A];if(typeof R=="number"||typeof R=="boolean"){if(B!==R)return T[A]=R,!0}else if(B.equals(R)===!1)return B.copy(R),!0}return!1}function _(y){const M=y.uniforms;let w=0;const T=16;for(let A=0,B=M.length;A<B;A++){const b=Array.isArray(M[A])?M[A]:[M[A]];for(let E=0,N=b.length;E<N;E++){const U=b[E],D=Array.isArray(U.value)?U.value:[U.value];for(let P=0,I=D.length;P<I;P++){const k=D[P],j=v(k),W=w%T,ee=W%j.boundary,Q=W+ee;w+=ee,Q!==0&&T-Q<j.storage&&(w+=T-Q),U.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=w,w+=j.storage}}}const R=w%T;return R>0&&(w+=T-R),y.__size=w,y.__cache={},this}function v(y){const M={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(M.boundary=4,M.storage=4):y.isVector2?(M.boundary=8,M.storage=8):y.isVector3||y.isColor?(M.boundary=16,M.storage=12):y.isVector4?(M.boundary=16,M.storage=16):y.isMatrix3?(M.boundary=48,M.storage=48):y.isMatrix4?(M.boundary=64,M.storage=64):y.isTexture?Ge("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Ge("WebGLRenderer: Unsupported uniform value type.",y),M}function m(y){const M=y.target;M.removeEventListener("dispose",m);const w=o.indexOf(M.__bindingPointIndex);o.splice(w,1),n.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function f(){for(const y in s)n.deleteBuffer(s[y]);o=[],s={},r={}}return{bind:c,update:d,dispose:f}}const Kx=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let ln=null;function Zx(){return ln===null&&(ln=new $f(Kx,16,16,Li,Ln),ln.name="DFG_LUT",ln.minFilter=Nt,ln.magFilter=Nt,ln.wrapS=Cn,ln.wrapT=Cn,ln.generateMipmaps=!1,ln.needsUpdate=!0),ln}class Jx{constructor(e={}){const{canvas:t=bf(),context:i=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:l=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:d=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:p=!1,outputBufferType:g=Zt}=e;this.isWebGLRenderer=!0;let _;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");_=i.getContextAttributes().alpha}else _=o;const v=g,m=new Set([lo,oo,ao]),f=new Set([Zt,xn,Ji,Qi,so,ro]),y=new Uint32Array(4),M=new Int32Array(4);let w=null,T=null;const R=[],A=[];let B=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=fn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const b=this;let E=!1;this._outputColorSpace=$t;let N=0,U=0,D=null,P=-1,I=null;const k=new _t,j=new _t;let W=null;const ee=new dt(0);let Q=0,ne=t.width,Se=t.height,ve=1,oe=null,ue=null;const X=new _t(0,0,ne,Se),Z=new _t(0,0,ne,Se);let ce=!1;const Ue=new Wc;let me=!1,$e=!1;const se=new yt,ye=new $,Te=new _t,Ie={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ee=!1;function Je(){return D===null?ve:1}let L=i;function ft(S,G){return t.getContext(S,G)}try{const S={alpha:!0,depth:s,stencil:r,antialias:l,premultipliedAlpha:c,preserveDrawingBuffer:d,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${no}`),t.addEventListener("webglcontextlost",ze,!1),t.addEventListener("webglcontextrestored",lt,!1),t.addEventListener("webglcontextcreationerror",it,!1),L===null){const G="webgl2";if(L=ft(G,S),L===null)throw ft(G)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(S){throw nt("WebGLRenderer: "+S.message),S}let Qe,ot,Re,C,x,V,J,ie,K,De,de,Ne,Be,re,pe,Ce,Le,he,He,z,xe,le,Me,ae;function te(){Qe=new Zg(L),Qe.init(),le=new Vx(L,Qe),ot=new Vg(L,Qe,e,le),Re=new jx(L,Qe),ot.reversedDepthBuffer&&p&&Re.buffers.depth.setReversed(!0),C=new e0(L),x=new Ex,V=new zx(L,Qe,Re,x,ot,le,C),J=new Hg(b),ie=new Kg(b),K=new sp(L),Me=new jg(L,K),De=new Jg(L,K,C,Me),de=new n0(L,De,K,C),He=new t0(L,ot,V),Ce=new Gg(x),Ne=new Mx(b,J,ie,Qe,ot,Me,Ce),Be=new $x(b,x),re=new Ax,pe=new Dx(Qe),he=new Bg(b,J,ie,Re,de,_,c),Le=new Ox(b,de,ot),ae=new Yx(L,C,ot,Re),z=new zg(L,Qe,C),xe=new Qg(L,Qe,C),C.programs=Ne.programs,b.capabilities=ot,b.extensions=Qe,b.properties=x,b.renderLists=re,b.shadowMap=Le,b.state=Re,b.info=C}te(),v!==Zt&&(B=new s0(v,t.width,t.height,s,r));const fe=new Xx(b,L);this.xr=fe,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const S=Qe.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){const S=Qe.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return ve},this.setPixelRatio=function(S){S!==void 0&&(ve=S,this.setSize(ne,Se,!1))},this.getSize=function(S){return S.set(ne,Se)},this.setSize=function(S,G,Y=!0){if(fe.isPresenting){Ge("WebGLRenderer: Can't change size while VR device is presenting.");return}ne=S,Se=G,t.width=Math.floor(S*ve),t.height=Math.floor(G*ve),Y===!0&&(t.style.width=S+"px",t.style.height=G+"px"),B!==null&&B.setSize(t.width,t.height),this.setViewport(0,0,S,G)},this.getDrawingBufferSize=function(S){return S.set(ne*ve,Se*ve).floor()},this.setDrawingBufferSize=function(S,G,Y){ne=S,Se=G,ve=Y,t.width=Math.floor(S*Y),t.height=Math.floor(G*Y),this.setViewport(0,0,S,G)},this.setEffects=function(S){if(v===Zt){console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(S){for(let G=0;G<S.length;G++)if(S[G].isOutputPass===!0){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}B.setEffects(S||[])},this.getCurrentViewport=function(S){return S.copy(k)},this.getViewport=function(S){return S.copy(X)},this.setViewport=function(S,G,Y,q){S.isVector4?X.set(S.x,S.y,S.z,S.w):X.set(S,G,Y,q),Re.viewport(k.copy(X).multiplyScalar(ve).round())},this.getScissor=function(S){return S.copy(Z)},this.setScissor=function(S,G,Y,q){S.isVector4?Z.set(S.x,S.y,S.z,S.w):Z.set(S,G,Y,q),Re.scissor(j.copy(Z).multiplyScalar(ve).round())},this.getScissorTest=function(){return ce},this.setScissorTest=function(S){Re.setScissorTest(ce=S)},this.setOpaqueSort=function(S){oe=S},this.setTransparentSort=function(S){ue=S},this.getClearColor=function(S){return S.copy(he.getClearColor())},this.setClearColor=function(){he.setClearColor(...arguments)},this.getClearAlpha=function(){return he.getClearAlpha()},this.setClearAlpha=function(){he.setClearAlpha(...arguments)},this.clear=function(S=!0,G=!0,Y=!0){let q=0;if(S){let H=!1;if(D!==null){const ge=D.texture.format;H=m.has(ge)}if(H){const ge=D.texture.type,Ae=f.has(ge),be=he.getClearColor(),Pe=he.getClearAlpha(),Fe=be.r,je=be.g,ke=be.b;Ae?(y[0]=Fe,y[1]=je,y[2]=ke,y[3]=Pe,L.clearBufferuiv(L.COLOR,0,y)):(M[0]=Fe,M[1]=je,M[2]=ke,M[3]=Pe,L.clearBufferiv(L.COLOR,0,M))}else q|=L.COLOR_BUFFER_BIT}G&&(q|=L.DEPTH_BUFFER_BIT),Y&&(q|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ze,!1),t.removeEventListener("webglcontextrestored",lt,!1),t.removeEventListener("webglcontextcreationerror",it,!1),he.dispose(),re.dispose(),pe.dispose(),x.dispose(),J.dispose(),ie.dispose(),de.dispose(),Me.dispose(),ae.dispose(),Ne.dispose(),fe.dispose(),fe.removeEventListener("sessionstart",mt),fe.removeEventListener("sessionend",bn),It.stop()};function ze(S){S.preventDefault(),nl("WebGLRenderer: Context Lost."),E=!0}function lt(){nl("WebGLRenderer: Context Restored."),E=!1;const S=C.autoReset,G=Le.enabled,Y=Le.autoUpdate,q=Le.needsUpdate,H=Le.type;te(),C.autoReset=S,Le.enabled=G,Le.autoUpdate=Y,Le.needsUpdate=q,Le.type=H}function it(S){nt("WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function Wt(S){const G=S.target;G.removeEventListener("dispose",Wt),Jt(G)}function Jt(S){ar(S),x.remove(S)}function ar(S){const G=x.get(S).programs;G!==void 0&&(G.forEach(function(Y){Ne.releaseProgram(Y)}),S.isShaderMaterial&&Ne.releaseShaderCache(S))}this.renderBufferDirect=function(S,G,Y,q,H,ge){G===null&&(G=Ie);const Ae=H.isMesh&&H.matrixWorld.determinant()<0,be=Qc(S,G,Y,q,H);Re.setMaterial(q,Ae);let Pe=Y.index,Fe=1;if(q.wireframe===!0){if(Pe=De.getWireframeAttribute(Y),Pe===void 0)return;Fe=2}const je=Y.drawRange,ke=Y.attributes.position;let Ye=je.start*Fe,ct=(je.start+je.count)*Fe;ge!==null&&(Ye=Math.max(Ye,ge.start*Fe),ct=Math.min(ct,(ge.start+ge.count)*Fe)),Pe!==null?(Ye=Math.max(Ye,0),ct=Math.min(ct,Pe.count)):ke!=null&&(Ye=Math.max(Ye,0),ct=Math.min(ct,ke.count));const gt=ct-Ye;if(gt<0||gt===1/0)return;Me.setup(H,q,be,Y,Pe);let xt,ut=z;if(Pe!==null&&(xt=K.get(Pe),ut=xe,ut.setIndex(xt)),H.isMesh)q.wireframe===!0?(Re.setLineWidth(q.wireframeLinewidth*Je()),ut.setMode(L.LINES)):ut.setMode(L.TRIANGLES);else if(H.isLine){let Oe=q.linewidth;Oe===void 0&&(Oe=1),Re.setLineWidth(Oe*Je()),H.isLineSegments?ut.setMode(L.LINES):H.isLineLoop?ut.setMode(L.LINE_LOOP):ut.setMode(L.LINE_STRIP)}else H.isPoints?ut.setMode(L.POINTS):H.isSprite&&ut.setMode(L.TRIANGLES);if(H.isBatchedMesh)if(H._multiDrawInstances!==null)es("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ut.renderMultiDrawInstances(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount,H._multiDrawInstances);else if(Qe.get("WEBGL_multi_draw"))ut.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{const Oe=H._multiDrawStarts,st=H._multiDrawCounts,tt=H._multiDrawCount,jt=Pe?K.get(Pe).bytesPerElement:1,ui=x.get(q).currentProgram.getUniforms();for(let zt=0;zt<tt;zt++)ui.setValue(L,"_gl_DrawID",zt),ut.render(Oe[zt]/jt,st[zt])}else if(H.isInstancedMesh)ut.renderInstances(Ye,gt,H.count);else if(Y.isInstancedBufferGeometry){const Oe=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,st=Math.min(Y.instanceCount,Oe);ut.renderInstances(Ye,gt,st)}else ut.render(Ye,gt)};function O(S,G,Y){S.transparent===!0&&S.side===An&&S.forceSinglePass===!1?(S.side=Bt,S.needsUpdate=!0,ds(S,G,Y),S.side=qn,S.needsUpdate=!0,ds(S,G,Y),S.side=An):ds(S,G,Y)}this.compile=function(S,G,Y=null){Y===null&&(Y=S),T=pe.get(Y),T.init(G),A.push(T),Y.traverseVisible(function(H){H.isLight&&H.layers.test(G.layers)&&(T.pushLight(H),H.castShadow&&T.pushShadow(H))}),S!==Y&&S.traverseVisible(function(H){H.isLight&&H.layers.test(G.layers)&&(T.pushLight(H),H.castShadow&&T.pushShadow(H))}),T.setupLights();const q=new Set;return S.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;const ge=H.material;if(ge)if(Array.isArray(ge))for(let Ae=0;Ae<ge.length;Ae++){const be=ge[Ae];O(be,Y,H),q.add(be)}else O(ge,Y,H),q.add(ge)}),T=A.pop(),q},this.compileAsync=function(S,G,Y=null){const q=this.compile(S,G,Y);return new Promise(H=>{function ge(){if(q.forEach(function(Ae){x.get(Ae).currentProgram.isReady()&&q.delete(Ae)}),q.size===0){H(S);return}setTimeout(ge,10)}Qe.get("KHR_parallel_shader_compile")!==null?ge():setTimeout(ge,10)})};let we=null;function Ke(S){we&&we(S)}function mt(){It.stop()}function bn(){It.start()}const It=new $c;It.setAnimationLoop(Ke),typeof self<"u"&&It.setContext(self),this.setAnimationLoop=function(S){we=S,fe.setAnimationLoop(S),S===null?It.stop():It.start()},fe.addEventListener("sessionstart",mt),fe.addEventListener("sessionend",bn),this.render=function(S,G){if(G!==void 0&&G.isCamera!==!0){nt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(E===!0)return;const Y=fe.enabled===!0&&fe.isPresenting===!0,q=B!==null&&(D===null||Y)&&B.begin(b,D);if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),G.parent===null&&G.matrixWorldAutoUpdate===!0&&G.updateMatrixWorld(),fe.enabled===!0&&fe.isPresenting===!0&&(B===null||B.isCompositing()===!1)&&(fe.cameraAutoUpdate===!0&&fe.updateCamera(G),G=fe.getCamera()),S.isScene===!0&&S.onBeforeRender(b,S,G,D),T=pe.get(S,A.length),T.init(G),A.push(T),se.multiplyMatrices(G.projectionMatrix,G.matrixWorldInverse),Ue.setFromProjectionMatrix(se,un,G.reversedDepth),$e=this.localClippingEnabled,me=Ce.init(this.clippingPlanes,$e),w=re.get(S,R.length),w.init(),R.push(w),fe.enabled===!0&&fe.isPresenting===!0){const Ae=b.xr.getDepthSensingMesh();Ae!==null&&di(Ae,G,-1/0,b.sortObjects)}di(S,G,0,b.sortObjects),w.finish(),b.sortObjects===!0&&w.sort(oe,ue),Ee=fe.enabled===!1||fe.isPresenting===!1||fe.hasDepthSensing()===!1,Ee&&he.addToRenderList(w,S),this.info.render.frame++,me===!0&&Ce.beginShadows();const H=T.state.shadowsArray;if(Le.render(H,S,G),me===!0&&Ce.endShadows(),this.info.autoReset===!0&&this.info.reset(),(q&&B.hasRenderPass())===!1){const Ae=w.opaque,be=w.transmissive;if(T.setupLights(),G.isArrayCamera){const Pe=G.cameras;if(be.length>0)for(let Fe=0,je=Pe.length;Fe<je;Fe++){const ke=Pe[Fe];go(Ae,be,S,ke)}Ee&&he.render(S);for(let Fe=0,je=Pe.length;Fe<je;Fe++){const ke=Pe[Fe];mo(w,S,ke,ke.viewport)}}else be.length>0&&go(Ae,be,S,G),Ee&&he.render(S),mo(w,S,G)}D!==null&&U===0&&(V.updateMultisampleRenderTarget(D),V.updateRenderTargetMipmap(D)),q&&B.end(b),S.isScene===!0&&S.onAfterRender(b,S,G),Me.resetDefaultState(),P=-1,I=null,A.pop(),A.length>0?(T=A[A.length-1],me===!0&&Ce.setGlobalState(b.clippingPlanes,T.state.camera)):T=null,R.pop(),R.length>0?w=R[R.length-1]:w=null};function di(S,G,Y,q){if(S.visible===!1)return;if(S.layers.test(G.layers)){if(S.isGroup)Y=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(G);else if(S.isLight)T.pushLight(S),S.castShadow&&T.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||Ue.intersectsSprite(S)){q&&Te.setFromMatrixPosition(S.matrixWorld).applyMatrix4(se);const Ae=de.update(S),be=S.material;be.visible&&w.push(S,Ae,be,Y,Te.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||Ue.intersectsObject(S))){const Ae=de.update(S),be=S.material;if(q&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),Te.copy(S.boundingSphere.center)):(Ae.boundingSphere===null&&Ae.computeBoundingSphere(),Te.copy(Ae.boundingSphere.center)),Te.applyMatrix4(S.matrixWorld).applyMatrix4(se)),Array.isArray(be)){const Pe=Ae.groups;for(let Fe=0,je=Pe.length;Fe<je;Fe++){const ke=Pe[Fe],Ye=be[ke.materialIndex];Ye&&Ye.visible&&w.push(S,Ae,Ye,Y,Te.z,ke)}}else be.visible&&w.push(S,Ae,be,Y,Te.z,null)}}const ge=S.children;for(let Ae=0,be=ge.length;Ae<be;Ae++)di(ge[Ae],G,Y,q)}function mo(S,G,Y,q){const{opaque:H,transmissive:ge,transparent:Ae}=S;T.setupLightsView(Y),me===!0&&Ce.setGlobalState(b.clippingPlanes,Y),q&&Re.viewport(k.copy(q)),H.length>0&&cs(H,G,Y),ge.length>0&&cs(ge,G,Y),Ae.length>0&&cs(Ae,G,Y),Re.buffers.depth.setTest(!0),Re.buffers.depth.setMask(!0),Re.buffers.color.setMask(!0),Re.setPolygonOffset(!1)}function go(S,G,Y,q){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[q.id]===void 0){const Ye=Qe.has("EXT_color_buffer_half_float")||Qe.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[q.id]=new pn(1,1,{generateMipmaps:!0,type:Ye?Ln:Zt,minFilter:ri,samples:ot.samples,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:et.workingColorSpace})}const ge=T.state.transmissionRenderTarget[q.id],Ae=q.viewport||k;ge.setSize(Ae.z*b.transmissionResolutionScale,Ae.w*b.transmissionResolutionScale);const be=b.getRenderTarget(),Pe=b.getActiveCubeFace(),Fe=b.getActiveMipmapLevel();b.setRenderTarget(ge),b.getClearColor(ee),Q=b.getClearAlpha(),Q<1&&b.setClearColor(16777215,.5),b.clear(),Ee&&he.render(Y);const je=b.toneMapping;b.toneMapping=fn;const ke=q.viewport;if(q.viewport!==void 0&&(q.viewport=void 0),T.setupLightsView(q),me===!0&&Ce.setGlobalState(b.clippingPlanes,q),cs(S,Y,q),V.updateMultisampleRenderTarget(ge),V.updateRenderTargetMipmap(ge),Qe.has("WEBGL_multisampled_render_to_texture")===!1){let Ye=!1;for(let ct=0,gt=G.length;ct<gt;ct++){const xt=G[ct],{object:ut,geometry:Oe,material:st,group:tt}=xt;if(st.side===An&&ut.layers.test(q.layers)){const jt=st.side;st.side=Bt,st.needsUpdate=!0,xo(ut,Y,q,Oe,st,tt),st.side=jt,st.needsUpdate=!0,Ye=!0}}Ye===!0&&(V.updateMultisampleRenderTarget(ge),V.updateRenderTargetMipmap(ge))}b.setRenderTarget(be,Pe,Fe),b.setClearColor(ee,Q),ke!==void 0&&(q.viewport=ke),b.toneMapping=je}function cs(S,G,Y){const q=G.isScene===!0?G.overrideMaterial:null;for(let H=0,ge=S.length;H<ge;H++){const Ae=S[H],{object:be,geometry:Pe,group:Fe}=Ae;let je=Ae.material;je.allowOverride===!0&&q!==null&&(je=q),be.layers.test(Y.layers)&&xo(be,G,Y,Pe,je,Fe)}}function xo(S,G,Y,q,H,ge){S.onBeforeRender(b,G,Y,q,H,ge),S.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),H.onBeforeRender(b,G,Y,q,S,ge),H.transparent===!0&&H.side===An&&H.forceSinglePass===!1?(H.side=Bt,H.needsUpdate=!0,b.renderBufferDirect(Y,G,q,H,S,ge),H.side=qn,H.needsUpdate=!0,b.renderBufferDirect(Y,G,q,H,S,ge),H.side=An):b.renderBufferDirect(Y,G,q,H,S,ge),S.onAfterRender(b,G,Y,q,H,ge)}function ds(S,G,Y){G.isScene!==!0&&(G=Ie);const q=x.get(S),H=T.state.lights,ge=T.state.shadowsArray,Ae=H.state.version,be=Ne.getParameters(S,H.state,ge,G,Y),Pe=Ne.getProgramCacheKey(be);let Fe=q.programs;q.environment=S.isMeshStandardMaterial?G.environment:null,q.fog=G.fog,q.envMap=(S.isMeshStandardMaterial?ie:J).get(S.envMap||q.environment),q.envMapRotation=q.environment!==null&&S.envMap===null?G.environmentRotation:S.envMapRotation,Fe===void 0&&(S.addEventListener("dispose",Wt),Fe=new Map,q.programs=Fe);let je=Fe.get(Pe);if(je!==void 0){if(q.currentProgram===je&&q.lightsStateVersion===Ae)return vo(S,be),je}else be.uniforms=Ne.getUniforms(S),S.onBeforeCompile(be,b),je=Ne.acquireProgram(be,Pe),Fe.set(Pe,je),q.uniforms=be.uniforms;const ke=q.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(ke.clippingPlanes=Ce.uniform),vo(S,be),q.needsLights=td(S),q.lightsStateVersion=Ae,q.needsLights&&(ke.ambientLightColor.value=H.state.ambient,ke.lightProbe.value=H.state.probe,ke.directionalLights.value=H.state.directional,ke.directionalLightShadows.value=H.state.directionalShadow,ke.spotLights.value=H.state.spot,ke.spotLightShadows.value=H.state.spotShadow,ke.rectAreaLights.value=H.state.rectArea,ke.ltc_1.value=H.state.rectAreaLTC1,ke.ltc_2.value=H.state.rectAreaLTC2,ke.pointLights.value=H.state.point,ke.pointLightShadows.value=H.state.pointShadow,ke.hemisphereLights.value=H.state.hemi,ke.directionalShadowMap.value=H.state.directionalShadowMap,ke.directionalShadowMatrix.value=H.state.directionalShadowMatrix,ke.spotShadowMap.value=H.state.spotShadowMap,ke.spotLightMatrix.value=H.state.spotLightMatrix,ke.spotLightMap.value=H.state.spotLightMap,ke.pointShadowMap.value=H.state.pointShadowMap,ke.pointShadowMatrix.value=H.state.pointShadowMatrix),q.currentProgram=je,q.uniformsList=null,je}function _o(S){if(S.uniformsList===null){const G=S.currentProgram.getUniforms();S.uniformsList=Xs.seqWithValue(G.seq,S.uniforms)}return S.uniformsList}function vo(S,G){const Y=x.get(S);Y.outputColorSpace=G.outputColorSpace,Y.batching=G.batching,Y.batchingColor=G.batchingColor,Y.instancing=G.instancing,Y.instancingColor=G.instancingColor,Y.instancingMorph=G.instancingMorph,Y.skinning=G.skinning,Y.morphTargets=G.morphTargets,Y.morphNormals=G.morphNormals,Y.morphColors=G.morphColors,Y.morphTargetsCount=G.morphTargetsCount,Y.numClippingPlanes=G.numClippingPlanes,Y.numIntersection=G.numClipIntersection,Y.vertexAlphas=G.vertexAlphas,Y.vertexTangents=G.vertexTangents,Y.toneMapping=G.toneMapping}function Qc(S,G,Y,q,H){G.isScene!==!0&&(G=Ie),V.resetTextureUnits();const ge=G.fog,Ae=q.isMeshStandardMaterial?G.environment:null,be=D===null?b.outputColorSpace:D.isXRRenderTarget===!0?D.texture.colorSpace:Di,Pe=(q.isMeshStandardMaterial?ie:J).get(q.envMap||Ae),Fe=q.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,je=!!Y.attributes.tangent&&(!!q.normalMap||q.anisotropy>0),ke=!!Y.morphAttributes.position,Ye=!!Y.morphAttributes.normal,ct=!!Y.morphAttributes.color;let gt=fn;q.toneMapped&&(D===null||D.isXRRenderTarget===!0)&&(gt=b.toneMapping);const xt=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,ut=xt!==void 0?xt.length:0,Oe=x.get(q),st=T.state.lights;if(me===!0&&($e===!0||S!==I)){const Pt=S===I&&q.id===P;Ce.setState(q,S,Pt)}let tt=!1;q.version===Oe.__version?(Oe.needsLights&&Oe.lightsStateVersion!==st.state.version||Oe.outputColorSpace!==be||H.isBatchedMesh&&Oe.batching===!1||!H.isBatchedMesh&&Oe.batching===!0||H.isBatchedMesh&&Oe.batchingColor===!0&&H.colorTexture===null||H.isBatchedMesh&&Oe.batchingColor===!1&&H.colorTexture!==null||H.isInstancedMesh&&Oe.instancing===!1||!H.isInstancedMesh&&Oe.instancing===!0||H.isSkinnedMesh&&Oe.skinning===!1||!H.isSkinnedMesh&&Oe.skinning===!0||H.isInstancedMesh&&Oe.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&Oe.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&Oe.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&Oe.instancingMorph===!1&&H.morphTexture!==null||Oe.envMap!==Pe||q.fog===!0&&Oe.fog!==ge||Oe.numClippingPlanes!==void 0&&(Oe.numClippingPlanes!==Ce.numPlanes||Oe.numIntersection!==Ce.numIntersection)||Oe.vertexAlphas!==Fe||Oe.vertexTangents!==je||Oe.morphTargets!==ke||Oe.morphNormals!==Ye||Oe.morphColors!==ct||Oe.toneMapping!==gt||Oe.morphTargetsCount!==ut)&&(tt=!0):(tt=!0,Oe.__version=q.version);let jt=Oe.currentProgram;tt===!0&&(jt=ds(q,G,H));let ui=!1,zt=!1,Oi=!1;const ht=jt.getUniforms(),Ut=Oe.uniforms;if(Re.useProgram(jt.program)&&(ui=!0,zt=!0,Oi=!0),q.id!==P&&(P=q.id,zt=!0),ui||I!==S){Re.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),ht.setValue(L,"projectionMatrix",S.projectionMatrix),ht.setValue(L,"viewMatrix",S.matrixWorldInverse);const Ft=ht.map.cameraPosition;Ft!==void 0&&Ft.setValue(L,ye.setFromMatrixPosition(S.matrixWorld)),ot.logarithmicDepthBuffer&&ht.setValue(L,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(q.isMeshPhongMaterial||q.isMeshToonMaterial||q.isMeshLambertMaterial||q.isMeshBasicMaterial||q.isMeshStandardMaterial||q.isShaderMaterial)&&ht.setValue(L,"isOrthographic",S.isOrthographicCamera===!0),I!==S&&(I=S,zt=!0,Oi=!0)}if(Oe.needsLights&&(st.state.directionalShadowMap.length>0&&ht.setValue(L,"directionalShadowMap",st.state.directionalShadowMap,V),st.state.spotShadowMap.length>0&&ht.setValue(L,"spotShadowMap",st.state.spotShadowMap,V),st.state.pointShadowMap.length>0&&ht.setValue(L,"pointShadowMap",st.state.pointShadowMap,V)),H.isSkinnedMesh){ht.setOptional(L,H,"bindMatrix"),ht.setOptional(L,H,"bindMatrixInverse");const Pt=H.skeleton;Pt&&(Pt.boneTexture===null&&Pt.computeBoneTexture(),ht.setValue(L,"boneTexture",Pt.boneTexture,V))}H.isBatchedMesh&&(ht.setOptional(L,H,"batchingTexture"),ht.setValue(L,"batchingTexture",H._matricesTexture,V),ht.setOptional(L,H,"batchingIdTexture"),ht.setValue(L,"batchingIdTexture",H._indirectTexture,V),ht.setOptional(L,H,"batchingColorTexture"),H._colorsTexture!==null&&ht.setValue(L,"batchingColorTexture",H._colorsTexture,V));const Xt=Y.morphAttributes;if((Xt.position!==void 0||Xt.normal!==void 0||Xt.color!==void 0)&&He.update(H,Y,jt),(zt||Oe.receiveShadow!==H.receiveShadow)&&(Oe.receiveShadow=H.receiveShadow,ht.setValue(L,"receiveShadow",H.receiveShadow)),q.isMeshGouraudMaterial&&q.envMap!==null&&(Ut.envMap.value=Pe,Ut.flipEnvMap.value=Pe.isCubeTexture&&Pe.isRenderTargetTexture===!1?-1:1),q.isMeshStandardMaterial&&q.envMap===null&&G.environment!==null&&(Ut.envMapIntensity.value=G.environmentIntensity),Ut.dfgLUT!==void 0&&(Ut.dfgLUT.value=Zx()),zt&&(ht.setValue(L,"toneMappingExposure",b.toneMappingExposure),Oe.needsLights&&ed(Ut,Oi),ge&&q.fog===!0&&Be.refreshFogUniforms(Ut,ge),Be.refreshMaterialUniforms(Ut,q,ve,Se,T.state.transmissionRenderTarget[S.id]),Xs.upload(L,_o(Oe),Ut,V)),q.isShaderMaterial&&q.uniformsNeedUpdate===!0&&(Xs.upload(L,_o(Oe),Ut,V),q.uniformsNeedUpdate=!1),q.isSpriteMaterial&&ht.setValue(L,"center",H.center),ht.setValue(L,"modelViewMatrix",H.modelViewMatrix),ht.setValue(L,"normalMatrix",H.normalMatrix),ht.setValue(L,"modelMatrix",H.matrixWorld),q.isShaderMaterial||q.isRawShaderMaterial){const Pt=q.uniformsGroups;for(let Ft=0,or=Pt.length;Ft<or;Ft++){const $n=Pt[Ft];ae.update($n,jt),ae.bind($n,jt)}}return jt}function ed(S,G){S.ambientLightColor.needsUpdate=G,S.lightProbe.needsUpdate=G,S.directionalLights.needsUpdate=G,S.directionalLightShadows.needsUpdate=G,S.pointLights.needsUpdate=G,S.pointLightShadows.needsUpdate=G,S.spotLights.needsUpdate=G,S.spotLightShadows.needsUpdate=G,S.rectAreaLights.needsUpdate=G,S.hemisphereLights.needsUpdate=G}function td(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return N},this.getActiveMipmapLevel=function(){return U},this.getRenderTarget=function(){return D},this.setRenderTargetTextures=function(S,G,Y){const q=x.get(S);q.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,q.__autoAllocateDepthBuffer===!1&&(q.__useRenderToTexture=!1),x.get(S.texture).__webglTexture=G,x.get(S.depthTexture).__webglTexture=q.__autoAllocateDepthBuffer?void 0:Y,q.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,G){const Y=x.get(S);Y.__webglFramebuffer=G,Y.__useDefaultFramebuffer=G===void 0};const nd=L.createFramebuffer();this.setRenderTarget=function(S,G=0,Y=0){D=S,N=G,U=Y;let q=null,H=!1,ge=!1;if(S){const be=x.get(S);if(be.__useDefaultFramebuffer!==void 0){Re.bindFramebuffer(L.FRAMEBUFFER,be.__webglFramebuffer),k.copy(S.viewport),j.copy(S.scissor),W=S.scissorTest,Re.viewport(k),Re.scissor(j),Re.setScissorTest(W),P=-1;return}else if(be.__webglFramebuffer===void 0)V.setupRenderTarget(S);else if(be.__hasExternalTextures)V.rebindTextures(S,x.get(S.texture).__webglTexture,x.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){const je=S.depthTexture;if(be.__boundDepthTexture!==je){if(je!==null&&x.has(je)&&(S.width!==je.image.width||S.height!==je.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");V.setupDepthRenderbuffer(S)}}const Pe=S.texture;(Pe.isData3DTexture||Pe.isDataArrayTexture||Pe.isCompressedArrayTexture)&&(ge=!0);const Fe=x.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Fe[G])?q=Fe[G][Y]:q=Fe[G],H=!0):S.samples>0&&V.useMultisampledRTT(S)===!1?q=x.get(S).__webglMultisampledFramebuffer:Array.isArray(Fe)?q=Fe[Y]:q=Fe,k.copy(S.viewport),j.copy(S.scissor),W=S.scissorTest}else k.copy(X).multiplyScalar(ve).floor(),j.copy(Z).multiplyScalar(ve).floor(),W=ce;if(Y!==0&&(q=nd),Re.bindFramebuffer(L.FRAMEBUFFER,q)&&Re.drawBuffers(S,q),Re.viewport(k),Re.scissor(j),Re.setScissorTest(W),H){const be=x.get(S.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+G,be.__webglTexture,Y)}else if(ge){const be=G;for(let Pe=0;Pe<S.textures.length;Pe++){const Fe=x.get(S.textures[Pe]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+Pe,Fe.__webglTexture,Y,be)}}else if(S!==null&&Y!==0){const be=x.get(S.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,be.__webglTexture,Y)}P=-1},this.readRenderTargetPixels=function(S,G,Y,q,H,ge,Ae,be=0){if(!(S&&S.isWebGLRenderTarget)){nt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Pe=x.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&Ae!==void 0&&(Pe=Pe[Ae]),Pe){Re.bindFramebuffer(L.FRAMEBUFFER,Pe);try{const Fe=S.textures[be],je=Fe.format,ke=Fe.type;if(!ot.textureFormatReadable(je)){nt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ot.textureTypeReadable(ke)){nt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}G>=0&&G<=S.width-q&&Y>=0&&Y<=S.height-H&&(S.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+be),L.readPixels(G,Y,q,H,le.convert(je),le.convert(ke),ge))}finally{const Fe=D!==null?x.get(D).__webglFramebuffer:null;Re.bindFramebuffer(L.FRAMEBUFFER,Fe)}}},this.readRenderTargetPixelsAsync=async function(S,G,Y,q,H,ge,Ae,be=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Pe=x.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&Ae!==void 0&&(Pe=Pe[Ae]),Pe)if(G>=0&&G<=S.width-q&&Y>=0&&Y<=S.height-H){Re.bindFramebuffer(L.FRAMEBUFFER,Pe);const Fe=S.textures[be],je=Fe.format,ke=Fe.type;if(!ot.textureFormatReadable(je))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ot.textureTypeReadable(ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ye=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,Ye),L.bufferData(L.PIXEL_PACK_BUFFER,ge.byteLength,L.STREAM_READ),S.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+be),L.readPixels(G,Y,q,H,le.convert(je),le.convert(ke),0);const ct=D!==null?x.get(D).__webglFramebuffer:null;Re.bindFramebuffer(L.FRAMEBUFFER,ct);const gt=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await yf(L,gt,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,Ye),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,ge),L.deleteBuffer(Ye),L.deleteSync(gt),ge}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,G=null,Y=0){const q=Math.pow(2,-Y),H=Math.floor(S.image.width*q),ge=Math.floor(S.image.height*q),Ae=G!==null?G.x:0,be=G!==null?G.y:0;V.setTexture2D(S,0),L.copyTexSubImage2D(L.TEXTURE_2D,Y,0,0,Ae,be,H,ge),Re.unbindTexture()};const id=L.createFramebuffer(),sd=L.createFramebuffer();this.copyTextureToTexture=function(S,G,Y=null,q=null,H=0,ge=null){ge===null&&(H!==0?(es("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ge=H,H=0):ge=0);let Ae,be,Pe,Fe,je,ke,Ye,ct,gt;const xt=S.isCompressedTexture?S.mipmaps[ge]:S.image;if(Y!==null)Ae=Y.max.x-Y.min.x,be=Y.max.y-Y.min.y,Pe=Y.isBox3?Y.max.z-Y.min.z:1,Fe=Y.min.x,je=Y.min.y,ke=Y.isBox3?Y.min.z:0;else{const Xt=Math.pow(2,-H);Ae=Math.floor(xt.width*Xt),be=Math.floor(xt.height*Xt),S.isDataArrayTexture?Pe=xt.depth:S.isData3DTexture?Pe=Math.floor(xt.depth*Xt):Pe=1,Fe=0,je=0,ke=0}q!==null?(Ye=q.x,ct=q.y,gt=q.z):(Ye=0,ct=0,gt=0);const ut=le.convert(G.format),Oe=le.convert(G.type);let st;G.isData3DTexture?(V.setTexture3D(G,0),st=L.TEXTURE_3D):G.isDataArrayTexture||G.isCompressedArrayTexture?(V.setTexture2DArray(G,0),st=L.TEXTURE_2D_ARRAY):(V.setTexture2D(G,0),st=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,G.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,G.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,G.unpackAlignment);const tt=L.getParameter(L.UNPACK_ROW_LENGTH),jt=L.getParameter(L.UNPACK_IMAGE_HEIGHT),ui=L.getParameter(L.UNPACK_SKIP_PIXELS),zt=L.getParameter(L.UNPACK_SKIP_ROWS),Oi=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,xt.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,xt.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Fe),L.pixelStorei(L.UNPACK_SKIP_ROWS,je),L.pixelStorei(L.UNPACK_SKIP_IMAGES,ke);const ht=S.isDataArrayTexture||S.isData3DTexture,Ut=G.isDataArrayTexture||G.isData3DTexture;if(S.isDepthTexture){const Xt=x.get(S),Pt=x.get(G),Ft=x.get(Xt.__renderTarget),or=x.get(Pt.__renderTarget);Re.bindFramebuffer(L.READ_FRAMEBUFFER,Ft.__webglFramebuffer),Re.bindFramebuffer(L.DRAW_FRAMEBUFFER,or.__webglFramebuffer);for(let $n=0;$n<Pe;$n++)ht&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,x.get(S).__webglTexture,H,ke+$n),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,x.get(G).__webglTexture,ge,gt+$n)),L.blitFramebuffer(Fe,je,Ae,be,Ye,ct,Ae,be,L.DEPTH_BUFFER_BIT,L.NEAREST);Re.bindFramebuffer(L.READ_FRAMEBUFFER,null),Re.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(H!==0||S.isRenderTargetTexture||x.has(S)){const Xt=x.get(S),Pt=x.get(G);Re.bindFramebuffer(L.READ_FRAMEBUFFER,id),Re.bindFramebuffer(L.DRAW_FRAMEBUFFER,sd);for(let Ft=0;Ft<Pe;Ft++)ht?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Xt.__webglTexture,H,ke+Ft):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Xt.__webglTexture,H),Ut?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Pt.__webglTexture,ge,gt+Ft):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Pt.__webglTexture,ge),H!==0?L.blitFramebuffer(Fe,je,Ae,be,Ye,ct,Ae,be,L.COLOR_BUFFER_BIT,L.NEAREST):Ut?L.copyTexSubImage3D(st,ge,Ye,ct,gt+Ft,Fe,je,Ae,be):L.copyTexSubImage2D(st,ge,Ye,ct,Fe,je,Ae,be);Re.bindFramebuffer(L.READ_FRAMEBUFFER,null),Re.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else Ut?S.isDataTexture||S.isData3DTexture?L.texSubImage3D(st,ge,Ye,ct,gt,Ae,be,Pe,ut,Oe,xt.data):G.isCompressedArrayTexture?L.compressedTexSubImage3D(st,ge,Ye,ct,gt,Ae,be,Pe,ut,xt.data):L.texSubImage3D(st,ge,Ye,ct,gt,Ae,be,Pe,ut,Oe,xt):S.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,ge,Ye,ct,Ae,be,ut,Oe,xt.data):S.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,ge,Ye,ct,xt.width,xt.height,ut,xt.data):L.texSubImage2D(L.TEXTURE_2D,ge,Ye,ct,Ae,be,ut,Oe,xt);L.pixelStorei(L.UNPACK_ROW_LENGTH,tt),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,jt),L.pixelStorei(L.UNPACK_SKIP_PIXELS,ui),L.pixelStorei(L.UNPACK_SKIP_ROWS,zt),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Oi),ge===0&&G.generateMipmaps&&L.generateMipmap(st),Re.unbindTexture()},this.initRenderTarget=function(S){x.get(S).__webglFramebuffer===void 0&&V.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?V.setTextureCube(S,0):S.isData3DTexture?V.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?V.setTexture2DArray(S,0):V.setTexture2D(S,0),Re.unbindTexture()},this.resetState=function(){N=0,U=0,D=null,Re.reset(),Me.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return un}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=et._getDrawingBufferColorSpace(e),t.unpackColorSpace=et._getUnpackColorSpace()}}function Qx(){const n=F.useRef(null),e=F.useRef(null);return F.useEffect(()=>{if(!n.current)return;const t=n.current,i=`
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `,s=`
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time*0.05;
        float lineWidth = 0.002;
        vec3 color = vec3(0.0);
        for(int j = 0; j < 3; j++){
          for(int i=0; i < 5; i++){
            color[j] += lineWidth*float(i*i) / abs(fract(t - 0.01*float(j)+float(i)*0.01)*5.0 - length(uv) + mod(uv.x+uv.y, 0.2));
          }
        }
        
        gl_FragColor = vec4(color[0],color[1],color[2],1.0);
      }
    `,r=new po;r.position.z=1;const o=new qf,l=new ls(2,2),c={time:{type:"f",value:1},resolution:{type:"v2",value:new at}},d=new on({uniforms:c,vertexShader:i,fragmentShader:s}),h=new _n(l,d);o.add(h);const u=new Jx({antialias:!0});u.setPixelRatio(window.devicePixelRatio),t.appendChild(u.domElement);const p=()=>{const _=t.clientWidth,v=t.clientHeight;u.setSize(_,v),c.resolution.value.x=u.domElement.width,c.resolution.value.y=u.domElement.height};p(),window.addEventListener("resize",p,!1);const g=()=>{const _=requestAnimationFrame(g);c.time.value+=.05,u.render(o,r),e.current&&(e.current.animationId=_)};return e.current={camera:r,scene:o,renderer:u,uniforms:c,animationId:0},g(),()=>{window.removeEventListener("resize",p),e.current&&(cancelAnimationFrame(e.current.animationId),t&&e.current.renderer.domElement&&t.removeChild(e.current.renderer.domElement),e.current.renderer.dispose(),l.dispose(),d.dispose())}},[]),a.jsx("div",{ref:n,className:"w-full h-screen",style:{background:"#000",overflow:"hidden"}})}const e_=({onComplete:n})=>{const[e,t]=F.useState(0);return F.useEffect(()=>{const o=setInterval(()=>{t(l=>{const c=l+1;return c>=100?(clearInterval(o),setTimeout(n,200),100):c})},50);return()=>clearInterval(o)},[n]),a.jsxs("div",{className:"fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black",children:[a.jsx("div",{className:"absolute inset-0",children:a.jsx(Qx,{})}),a.jsxs("div",{className:"relative z-10 flex flex-col items-center",children:[a.jsxs("div",{className:"mb-12 text-center animate-in fade-in zoom-in duration-1000",children:[a.jsx("img",{src:$l,alt:"Goggles",className:"w-32 h-32 mb-4 mx-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"}),a.jsxs("h1",{className:"text-5xl font-black text-white italic uppercase tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]",children:["Berkeley ",a.jsx("span",{className:"text-blue-400",children:"Goggles"})]})]}),a.jsx("div",{className:"w-64 h-4 bg-white/10 backdrop-blur-md rounded-full border-2 border-white/20 overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)]",children:a.jsx("div",{className:"h-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 bg-[length:200%_100%] animate-shimmer transition-all duration-300 ease-out",style:{width:`${e}%`}})}),a.jsx("div",{className:"mt-3",children:a.jsxs("p",{className:"text-blue-200 font-black italic uppercase tracking-widest text-[10px] animate-pulse",children:["Syncing Rankings... ",Math.round(e),"%"]})})]}),a.jsx("style",{children:`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
      `})]})},t_={BASE_URL:"./",DEV:!1,MODE:"production",PROD:!0,SSR:!1,VITE_API_BASE_URL:"http://localhost:3001",VITE_APP_DESCRIPTION:"Social beauty ranking community",VITE_APP_NAME:"Berkeley Goggles",VITE_GOOGLE_CLIENT_ID:"683730085300-rf9g73ca25lh2e6gq1qih6lhd0sm9331.apps.googleusercontent.com"},n_=()=>{const n=window.location.pathname;console.log("🎫 App: Current pathname:",n);const e=n.startsWith("/invite"),t=n.match(/^\/invite\/([^/]+)$/),i=t?t[1]:null;return console.log("🎫 App: isInvitePath:",e,"token:",i),{isInvitePath:e,token:i}},i_=()=>{const{user:n,navigationState:e,isLoading:t}=vn(),[i,s]=F.useState(!1),[r,o]=F.useState(!1),[l,c]=F.useState(()=>n_());if(F.useEffect(()=>{e.isAuthenticated&&!r&&!t&&(s(!0),o(!0))},[e.isAuthenticated,r,t]),l.isInvitePath)return l.token?a.jsx(Bu,{inviteToken:l.token,onComplete:()=>{c({isInvitePath:!1,token:null}),window.history.replaceState({},"","/")}}):a.jsx("div",{className:"min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex items-center justify-center p-6",children:a.jsxs("div",{className:"max-w-sm w-full bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center",children:[a.jsx("div",{className:"w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg",children:a.jsx("svg",{className:"w-10 h-10 text-white",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:3,d:"M6 18L18 6M6 6l12 12"})})}),a.jsx("h2",{className:"text-xl font-black text-white uppercase tracking-wide mb-2",children:"Invalid Invite Link"}),a.jsx("p",{className:"text-white/80 text-sm mb-6",children:"This invite link is invalid or has expired. Please ask your friend to send you a new one."}),a.jsx("button",{type:"button",onClick:()=>{c({isInvitePath:!1,token:null}),window.history.replaceState({},"","/")},className:"bg-white text-blue-700 font-black py-3 px-8 rounded-xl uppercase tracking-wide shadow-lg hover:bg-blue-50 transition-colors",children:"Continue"})]})});if(t)return a.jsx("div",{className:"min-h-screen flex items-center justify-center",children:a.jsxs("div",{className:"text-white text-center",children:[a.jsx("div",{className:"w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"}),a.jsx("p",{children:"Loading..."})]})});if(i)return a.jsx(e_,{onComplete:()=>s(!1)});if(!e.isAuthenticated||!n)return a.jsx(Pd,{});if(!e.profileSetupComplete)return a.jsx(Dd,{});const d=[{id:"league",component:a.jsx(Ou,{})},{id:"play",component:a.jsx(Fu,{})},{id:"matched",component:a.jsx(ku,{})},{id:"profile",component:a.jsx(Du,{})}];return a.jsxs("div",{className:"relative w-full overflow-hidden",style:{height:"100dvh"},children:[a.jsx(Bh,{pages:d}),a.jsx(Wu,{})]})};function s_(){const n="683730085300-rf9g73ca25lh2e6gq1qih6lhd0sm9331.apps.googleusercontent.com";return F.useEffect(()=>{oi.isNativePlatform()&&(console.log("🔵 Initializing native Google Auth..."),Hl.initialize({google:{webClientId:n,iOSClientId:n,mode:"online"}}),console.log("🔵 Native Google Auth initialized"))},[n]),console.log("🔍 Google Client ID Debug:",{clientId:n,clientIdLength:n?.length||0,envVar:"683730085300-rf9g73ca25lh2e6gq1qih6lhd0sm9331.apps.googleusercontent.com",allEnvVars:Object.keys(t_).filter(e=>e.includes("GOOGLE")||e.includes("CLIENT"))}),console.log("✅ Google Client ID loaded:",n.substring(0,20)+"..."),a.jsx(pd,{clientId:n,children:a.jsx(Nd,{children:a.jsx(i_,{})})})}hd.createRoot(document.getElementById("root")).render(a.jsx(F.StrictMode,{children:a.jsx(s_,{})}));export{Ya as W};
