"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[685],{125:(e,t,n)=>{var r=n(2115),i="function"==typeof Object.is?Object.is:function(e,t){return e===t&&(0!==e||1/e==1/t)||e!=e&&t!=t},o=r.useState,a=r.useEffect,s=r.useLayoutEffect,l=r.useDebugValue;function c(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!i(e,n)}catch(e){return!0}}var u="undefined"==typeof window||void 0===window.document||void 0===window.document.createElement?function(e,t){return t()}:function(e,t){var n=t(),r=o({inst:{value:n,getSnapshot:t}}),i=r[0].inst,u=r[1];return s(function(){i.value=n,i.getSnapshot=t,c(i)&&u({inst:i})},[e,n,t]),a(function(){return c(i)&&u({inst:i}),e(function(){c(i)&&u({inst:i})})},[e]),l(n),n};t.useSyncExternalStore=void 0!==r.useSyncExternalStore?r.useSyncExternalStore:u},258:(e,t,n)=>{n.d(t,{Hl:()=>d});var r=n(6595),i=n(2115),o=n(5167);function a(e,t){let n;return(...r)=>{window.clearTimeout(n),n=window.setTimeout(()=>e(...r),t)}}let s=["x","y","top","bottom","left","right","width","height"];var l=n(4735),c=n(5155);function u({ref:e,children:t,fallback:n,resize:l,style:u,gl:d,events:f=r.f,eventSource:p,eventPrefix:m,shadows:h,linear:v,flat:b,legacy:y,orthographic:g,frameloop:w,dpr:E,performance:x,raycaster:S,camera:P,scene:A,onPointerMissed:M,onCreated:L,..._}){i.useMemo(()=>(0,r.e)(o),[]);let O=(0,r.u)(),[T,j]=function({debounce:e,scroll:t,polyfill:n,offsetSize:r}={debounce:0,scroll:!1,offsetSize:!1}){var o,l,c;let u=n||("undefined"==typeof window?class{}:window.ResizeObserver);if(!u)throw Error("This browser does not support ResizeObserver out of the box. See: https://github.com/react-spring/react-use-measure/#resize-observer-polyfills");let[d,f]=(0,i.useState)({left:0,top:0,width:0,height:0,bottom:0,right:0,x:0,y:0}),p=(0,i.useRef)({element:null,scrollContainers:null,resizeObserver:null,lastBounds:d,orientationHandler:null}),m=e?"number"==typeof e?e:e.scroll:null,h=e?"number"==typeof e?e:e.resize:null,v=(0,i.useRef)(!1);(0,i.useEffect)(()=>(v.current=!0,()=>void(v.current=!1)));let[b,y,g]=(0,i.useMemo)(()=>{let e=()=>{let e,t;if(!p.current.element)return;let{left:n,top:i,width:o,height:a,bottom:l,right:c,x:u,y:d}=p.current.element.getBoundingClientRect(),m={left:n,top:i,width:o,height:a,bottom:l,right:c,x:u,y:d};p.current.element instanceof HTMLElement&&r&&(m.height=p.current.element.offsetHeight,m.width=p.current.element.offsetWidth),Object.freeze(m),v.current&&(e=p.current.lastBounds,t=m,!s.every(n=>e[n]===t[n]))&&f(p.current.lastBounds=m)};return[e,h?a(e,h):e,m?a(e,m):e]},[f,r,m,h]);function w(){p.current.scrollContainers&&(p.current.scrollContainers.forEach(e=>e.removeEventListener("scroll",g,!0)),p.current.scrollContainers=null),p.current.resizeObserver&&(p.current.resizeObserver.disconnect(),p.current.resizeObserver=null),p.current.orientationHandler&&("orientation"in screen&&"removeEventListener"in screen.orientation?screen.orientation.removeEventListener("change",p.current.orientationHandler):"onorientationchange"in window&&window.removeEventListener("orientationchange",p.current.orientationHandler))}function E(){p.current.element&&(p.current.resizeObserver=new u(g),p.current.resizeObserver.observe(p.current.element),t&&p.current.scrollContainers&&p.current.scrollContainers.forEach(e=>e.addEventListener("scroll",g,{capture:!0,passive:!0})),p.current.orientationHandler=()=>{g()},"orientation"in screen&&"addEventListener"in screen.orientation?screen.orientation.addEventListener("change",p.current.orientationHandler):"onorientationchange"in window&&window.addEventListener("orientationchange",p.current.orientationHandler))}return o=g,l=!!t,(0,i.useEffect)(()=>{if(l)return window.addEventListener("scroll",o,{capture:!0,passive:!0}),()=>void window.removeEventListener("scroll",o,!0)},[o,l]),c=y,(0,i.useEffect)(()=>(window.addEventListener("resize",c),()=>void window.removeEventListener("resize",c)),[c]),(0,i.useEffect)(()=>{w(),E()},[t,g,y]),(0,i.useEffect)(()=>w,[]),[e=>{e&&e!==p.current.element&&(w(),p.current.element=e,p.current.scrollContainers=function e(t){let n=[];if(!t||t===document.body)return n;let{overflow:r,overflowX:i,overflowY:o}=window.getComputedStyle(t);return[r,i,o].some(e=>"auto"===e||"scroll"===e)&&n.push(t),[...n,...e(t.parentElement)]}(e),E())},d,b]}({scroll:!0,debounce:{scroll:50,resize:0},...l}),z=i.useRef(null),C=i.useRef(null);i.useImperativeHandle(e,()=>z.current);let I=(0,r.a)(M),R=i.useCallback(e=>null==I.current?void 0:I.current(e),[I]),[D,U]=i.useState(!1),[k,N]=i.useState(!1);if(D)throw D;if(k)throw k;let H=i.useRef(null),[B,F]=(0,r.b)(),Y=i.useRef(null),q=()=>p?(0,r.i)(p)?p.current:p:C.current;i.useInsertionEffect(()=>()=>{let e=H.current;H.current=null,null==e||e.unmount()},[]),(0,r.c)(()=>{let e=z.current;j.width>0&&j.height>0&&e&&(H.current||(H.current=(0,r.d)(e)),H.current.configure({gl:d,scene:A,events:f,shadows:h,linear:v,flat:b,legacy:y,orthographic:g,frameloop:w,dpr:E,performance:x,raycaster:S,camera:P,size:j,onPointerMissed:R,onCreated:e=>{var t;Y.current=e,null==e.events.connect||e.events.connect(null!=(t=q())?t:C.current),m&&e.setEvents({compute:(e,t)=>{let n=e[m+"X"],r=e[m+"Y"];t.pointer.set(n/t.size.width*2-1,-(2*(r/t.size.height))+1),t.raycaster.setFromCamera(t.pointer,t.camera)}}),null==L||L(e)}}).catch(N),"fulfilled"===H.current.ready.status?H.current.render((0,c.jsx)(O,{children:(0,c.jsx)(r.E,{set:N,children:(0,c.jsx)(i.Suspense,{fallback:(0,c.jsx)(r.B,{set:U}),children:null!=t?t:null})})})):"pending"===H.current.ready.status&&F(H.current.ready))}),i.useEffect(()=>{var e;let t=null==(e=Y.current)?void 0:e.get(),n=q();t&&n&&t.events.connected!==n&&(null==t.events.connect||t.events.connect(n))}),i.useEffect(()=>{let e=z.current;return()=>{var t;e.isConnected||null==(t=H.current)||t.unmount()}},[]);let W=p?"none":"auto";return(0,c.jsxs)("div",{ref:C,style:{position:"relative",width:"100%",height:"100%",overflow:"hidden",pointerEvents:W,...u},..._,children:[(0,c.jsx)("div",{ref:T,style:{width:"100%",height:"100%"},children:(0,c.jsx)("canvas",{ref:z,style:{display:"block"},children:n})}),B]})}function d(e){return(0,c.jsx)(l.Af,{children:(0,c.jsx)(u,{...e})})}n(9914)},1046:(e,t,n)=>{n.d(t,{n:()=>a});var r=n(2115),i=n(6595),o=n(5339);let a=r.forwardRef(({children:e,enabled:t=!0,speed:n=1,rotationIntensity:a=1,floatIntensity:s=1,floatingRange:l=[-.1,.1],autoInvalidate:c=!1,...u},d)=>{let f=r.useRef(null);r.useImperativeHandle(d,()=>f.current,[]);let p=r.useRef(1e4*Math.random());return(0,i.F)(e=>{var r,i;if(!t||0===n)return;c&&e.invalidate();let u=p.current+e.clock.elapsedTime;f.current.rotation.x=Math.cos(u/4*n)/8*a,f.current.rotation.y=Math.sin(u/4*n)/8*a,f.current.rotation.z=Math.sin(u/4*n)/20*a;let d=Math.sin(u/4*n)/10;d=o.cj9.mapLinear(d,-.1,.1,null!=(r=null==l?void 0:l[0])?r:-.1,null!=(i=null==l?void 0:l[1])?i:.1),f.current.position.y=d*s,f.current.updateMatrix()}),r.createElement("group",u,r.createElement("group",{ref:f,matrixAutoUpdate:!1},e))})},2912:(e,t,n)=>{n.d(t,{A:()=>c});var r=n(2115),i=n(6595),o=n(5339);let a=parseInt(o.sPf.replace(/\D+/g,""));class s extends o.BKk{constructor(){super({uniforms:{time:{value:0},fade:{value:1}},vertexShader:`
      uniform float time;
      attribute float size;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 0.5);
        gl_PointSize = size * (30.0 / -mvPosition.z) * (3.0 + sin(time + 100.0));
        gl_Position = projectionMatrix * mvPosition;
      }`,fragmentShader:`
      uniform sampler2D pointTexture;
      uniform float fade;
      varying vec3 vColor;
      void main() {
        float opacity = 1.0;
        if (fade == 1.0) {
          float d = distance(gl_PointCoord, vec2(0.5, 0.5));
          opacity = 1.0 / (1.0 + exp(16.0 * (d - 0.25)));
        }
        gl_FragColor = vec4(vColor, opacity);

        #include <tonemapping_fragment>
	      #include <${a>=154?"colorspace_fragment":"encodings_fragment"}>
      }`})}}let l=e=>new o.Pq0().setFromSpherical(new o.YHV(e,Math.acos(1-2*Math.random()),2*Math.random()*Math.PI)),c=r.forwardRef(({radius:e=100,depth:t=50,count:n=5e3,saturation:a=0,factor:c=4,fade:u=!1,speed:d=1},f)=>{let p=r.useRef(null),[m,h,v]=r.useMemo(()=>{let r=[],i=[],s=Array.from({length:n},()=>(.5+.5*Math.random())*c),u=new o.Q1f,d=e+t,f=t/n;for(let e=0;e<n;e++)d-=f*Math.random(),r.push(...l(d).toArray()),u.setHSL(e/n,a,.9),i.push(u.r,u.g,u.b);return[new Float32Array(r),new Float32Array(i),new Float32Array(s)]},[n,t,c,e,a]);(0,i.F)(e=>p.current&&(p.current.uniforms.time.value=e.clock.elapsedTime*d));let[b]=r.useState(()=>new s);return r.createElement("points",{ref:f},r.createElement("bufferGeometry",null,r.createElement("bufferAttribute",{attach:"attributes-position",args:[m,3]}),r.createElement("bufferAttribute",{attach:"attributes-color",args:[h,3]}),r.createElement("bufferAttribute",{attach:"attributes-size",args:[v,1]})),r.createElement("primitive",{ref:p,object:b,attach:"material",blending:o.EZo,"uniforms-fade-value":u,depthWrite:!1,transparent:!0,vertexColors:!0}))})},3646:(e,t,n)=>{let r,i;n.d(t,{E:()=>g});var o=n(8945),a=n(2115),s=n(2669),l=n(5339),c=n(6595);let u=new l.Pq0,d=new l.Pq0,f=new l.Pq0,p=new l.I9Y;function m(e,t,n){let r=u.setFromMatrixPosition(e.matrixWorld);r.project(t);let i=n.width/2,o=n.height/2;return[r.x*i+i,-(r.y*o)+o]}let h=e=>1e-10>Math.abs(e)?0:e;function v(e,t,n=""){let r="matrix3d(";for(let n=0;16!==n;n++)r+=h(t[n]*e.elements[n])+(15!==n?",":")");return n+r}let b=(r=[1,-1,1,1,1,-1,1,1,1,-1,1,1,1,-1,1,1],e=>v(e,r)),y=(i=e=>[1/e,1/e,1/e,1,-1/e,-1/e,-1/e,-1,1/e,1/e,1/e,1,1,1,1,1],(e,t)=>v(e,i(t),"translate(-50%,-50%)")),g=a.forwardRef(({children:e,eps:t=.001,style:n,className:r,prepend:i,center:v,fullscreen:g,portal:w,distanceFactor:E,sprite:x=!1,transform:S=!1,occlude:P,onOcclude:A,castShadow:M,receiveShadow:L,material:_,geometry:O,zIndexRange:T=[0x1000037,0],calculatePosition:j=m,as:z="div",wrapperClass:C,pointerEvents:I="auto",...R},D)=>{let{gl:U,camera:k,scene:N,size:H,raycaster:B,events:F,viewport:Y}=(0,c.D)(),[q]=a.useState(()=>document.createElement(z)),W=a.useRef(null),V=a.useRef(null),G=a.useRef(0),X=a.useRef([0,0]),Z=a.useRef(null),$=a.useRef(null),K=(null==w?void 0:w.current)||F.connected||U.domElement.parentNode,Q=a.useRef(null),J=a.useRef(!1),ee=a.useMemo(()=>P&&"blending"!==P||Array.isArray(P)&&P.length&&function(e){return e&&"object"==typeof e&&"current"in e}(P[0]),[P]);a.useLayoutEffect(()=>{let e=U.domElement;P&&"blending"===P?(e.style.zIndex=`${Math.floor(T[0]/2)}`,e.style.position="absolute",e.style.pointerEvents="none"):(e.style.zIndex=null,e.style.position=null,e.style.pointerEvents=null)},[P]),a.useLayoutEffect(()=>{if(V.current){let e=W.current=s.createRoot(q);if(N.updateMatrixWorld(),S)q.style.cssText="position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;";else{let e=j(V.current,k,H);q.style.cssText=`position:absolute;top:0;left:0;transform:translate3d(${e[0]}px,${e[1]}px,0);transform-origin:0 0;`}return K&&(i?K.prepend(q):K.appendChild(q)),()=>{K&&K.removeChild(q),e.unmount()}}},[K,S]),a.useLayoutEffect(()=>{C&&(q.className=C)},[C]);let et=a.useMemo(()=>S?{position:"absolute",top:0,left:0,width:H.width,height:H.height,transformStyle:"preserve-3d",pointerEvents:"none"}:{position:"absolute",transform:v?"translate3d(-50%,-50%,0)":"none",...g&&{top:-H.height/2,left:-H.width/2,width:H.width,height:H.height},...n},[n,v,g,H,S]),en=a.useMemo(()=>({position:"absolute",pointerEvents:I}),[I]);a.useLayoutEffect(()=>{var t,i;J.current=!1,S?null==(t=W.current)||t.render(a.createElement("div",{ref:Z,style:et},a.createElement("div",{ref:$,style:en},a.createElement("div",{ref:D,className:r,style:n,children:e})))):null==(i=W.current)||i.render(a.createElement("div",{ref:D,style:et,className:r,children:e}))});let er=a.useRef(!0);(0,c.F)(e=>{if(V.current){k.updateMatrixWorld(),V.current.updateWorldMatrix(!0,!1);let e=S?X.current:j(V.current,k,H);if(S||Math.abs(G.current-k.zoom)>t||Math.abs(X.current[0]-e[0])>t||Math.abs(X.current[1]-e[1])>t){let t=function(e,t){let n=u.setFromMatrixPosition(e.matrixWorld),r=d.setFromMatrixPosition(t.matrixWorld),i=n.sub(r),o=t.getWorldDirection(f);return i.angleTo(o)>Math.PI/2}(V.current,k),n=!1;ee&&(Array.isArray(P)?n=P.map(e=>e.current):"blending"!==P&&(n=[N]));let r=er.current;n?er.current=function(e,t,n,r){let i=u.setFromMatrixPosition(e.matrixWorld),o=i.clone();o.project(t),p.set(o.x,o.y),n.setFromCamera(p,t);let a=n.intersectObjects(r,!0);if(a.length){let e=a[0].distance;return i.distanceTo(n.ray.origin)<e}return!0}(V.current,k,B,n)&&!t:er.current=!t,r!==er.current&&(A?A(!er.current):q.style.display=er.current?"block":"none");let i=Math.floor(T[0]/2),o=P?ee?[T[0],i]:[i-1,0]:T;if(q.style.zIndex=`${function(e,t,n){if(t instanceof l.ubm||t instanceof l.qUd){let r=u.setFromMatrixPosition(e.matrixWorld),i=d.setFromMatrixPosition(t.matrixWorld),o=r.distanceTo(i),a=(n[1]-n[0])/(t.far-t.near),s=n[1]-a*t.far;return Math.round(a*o+s)}}(V.current,k,o)}`,S){let[e,t]=[H.width/2,H.height/2],n=k.projectionMatrix.elements[5]*t,{isOrthographicCamera:r,top:i,left:o,bottom:a,right:s}=k,l=b(k.matrixWorldInverse),c=r?`scale(${n})translate(${h(-(s+o)/2)}px,${h((i+a)/2)}px)`:`translateZ(${n}px)`,u=V.current.matrixWorld;x&&((u=k.matrixWorldInverse.clone().transpose().copyPosition(u).scale(V.current.scale)).elements[3]=u.elements[7]=u.elements[11]=0,u.elements[15]=1),q.style.width=H.width+"px",q.style.height=H.height+"px",q.style.perspective=r?"":`${n}px`,Z.current&&$.current&&(Z.current.style.transform=`${c}${l}translate(${e}px,${t}px)`,$.current.style.transform=y(u,1/((E||10)/400)))}else{let t=void 0===E?1:function(e,t){if(t instanceof l.qUd)return t.zoom;if(!(t instanceof l.ubm))return 1;{let n=u.setFromMatrixPosition(e.matrixWorld),r=d.setFromMatrixPosition(t.matrixWorld);return 1/(2*Math.tan(t.fov*Math.PI/180/2)*n.distanceTo(r))}}(V.current,k)*E;q.style.transform=`translate3d(${e[0]}px,${e[1]}px,0) scale(${t})`}X.current=e,G.current=k.zoom}}if(!ee&&Q.current&&!J.current)if(S){if(Z.current){let e=Z.current.children[0];if(null!=e&&e.clientWidth&&null!=e&&e.clientHeight){let{isOrthographicCamera:t}=k;if(t||O)R.scale&&(Array.isArray(R.scale)?R.scale instanceof l.Pq0?Q.current.scale.copy(R.scale.clone().divideScalar(1)):Q.current.scale.set(1/R.scale[0],1/R.scale[1],1/R.scale[2]):Q.current.scale.setScalar(1/R.scale));else{let t=(E||10)/400,n=e.clientWidth*t,r=e.clientHeight*t;Q.current.scale.set(n,r,1)}J.current=!0}}}else{let t=q.children[0];if(null!=t&&t.clientWidth&&null!=t&&t.clientHeight){let e=1/Y.factor,n=t.clientWidth*e,r=t.clientHeight*e;Q.current.scale.set(n,r,1),J.current=!0}Q.current.lookAt(e.camera.position)}});let ei=a.useMemo(()=>({vertexShader:S?void 0:`
          /*
            This shader is from the THREE's SpriteMaterial.
            We need to turn the backing plane into a Sprite
            (make it always face the camera) if "transfrom"
            is false.
          */
          #include <common>

          void main() {
            vec2 center = vec2(0., 1.);
            float rotation = 0.0;

            // This is somewhat arbitrary, but it seems to work well
            // Need to figure out how to derive this dynamically if it even matters
            float size = 0.03;

            vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
            vec2 scale;
            scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
            scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );

            bool isPerspective = isPerspectiveMatrix( projectionMatrix );
            if ( isPerspective ) scale *= - mvPosition.z;

            vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale * size;
            vec2 rotatedPosition;
            rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
            rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
            mvPosition.xy += rotatedPosition;

            gl_Position = projectionMatrix * mvPosition;
          }
      `,fragmentShader:`
        void main() {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        }
      `}),[S]);return a.createElement("group",(0,o.A)({},R,{ref:V}),P&&!ee&&a.createElement("mesh",{castShadow:M,receiveShadow:L,ref:Q},O||a.createElement("planeGeometry",null),_||a.createElement("shaderMaterial",{side:l.$EB,vertexShader:ei.vertexShader,fragmentShader:ei.fragmentShader})))})},3654:(e,t,n)=>{var r=n(2115),i=n(4806),o="function"==typeof Object.is?Object.is:function(e,t){return e===t&&(0!==e||1/e==1/t)||e!=e&&t!=t},a=i.useSyncExternalStore,s=r.useRef,l=r.useEffect,c=r.useMemo,u=r.useDebugValue;t.useSyncExternalStoreWithSelector=function(e,t,n,r,i){var d=s(null);if(null===d.current){var f={hasValue:!1,value:null};d.current=f}else f=d.current;var p=a(e,(d=c(function(){function e(e){if(!l){if(l=!0,a=e,e=r(e),void 0!==i&&f.hasValue){var t=f.value;if(i(t,e))return s=t}return s=e}if(t=s,o(a,e))return t;var n=r(e);return void 0!==i&&i(t,n)?(a=e,t):(a=e,s=n)}var a,s,l=!1,c=void 0===n?null:n;return[function(){return e(t())},null===c?void 0:function(){return e(c())}]},[t,n,r,i]))[0],d[1]);return l(function(){f.hasValue=!0,f.value=p},[p]),u(p),p}},3689:(e,t,n)=>{n.d(t,{DY:()=>a,IU:()=>l,uv:()=>s});let r=[];function i(e,t,n=(e,t)=>e===t){if(e===t)return!0;if(!e||!t)return!1;let r=e.length;if(t.length!==r)return!1;for(let i=0;i<r;i++)if(!n(e[i],t[i]))return!1;return!0}function o(e,t=null,n=!1,a={}){for(let o of(null===t&&(t=[e]),r))if(i(t,o.keys,o.equal)){if(n)return;if(Object.prototype.hasOwnProperty.call(o,"error"))throw o.error;if(Object.prototype.hasOwnProperty.call(o,"response"))return a.lifespan&&a.lifespan>0&&(o.timeout&&clearTimeout(o.timeout),o.timeout=setTimeout(o.remove,a.lifespan)),o.response;if(!n)throw o.promise}let s={keys:t,equal:a.equal,remove:()=>{let e=r.indexOf(s);-1!==e&&r.splice(e,1)},promise:("object"==typeof e&&"function"==typeof e.then?e:e(...t)).then(e=>{s.response=e,a.lifespan&&a.lifespan>0&&(s.timeout=setTimeout(s.remove,a.lifespan))}).catch(e=>s.error=e)};if(r.push(s),!n)throw s.promise}let a=(e,t,n)=>o(e,t,!1,n),s=(e,t,n)=>void o(e,t,!0,n),l=e=>{if(void 0===e||0===e.length)r.splice(0,r.length);else{let t=r.find(t=>i(e,t.keys,t.equal));t&&t.remove()}}},3718:(e,t,n)=>{n.d(t,{h:()=>l});var r=n(2115),i=n(8828);let o=e=>{let t,n=new Set,r=(e,r)=>{let i="function"==typeof e?e(t):e;if(!Object.is(i,t)){let e=t;t=(null!=r?r:"object"!=typeof i||null===i)?i:Object.assign({},t,i),n.forEach(n=>n(t,e))}},i=()=>t,o={setState:r,getState:i,getInitialState:()=>a,subscribe:e=>(n.add(e),()=>n.delete(e))},a=t=e(r,i,o);return o},{useSyncExternalStoreWithSelector:a}=i,s=(e,t)=>{let n=(e=>e?o(e):o)(e),i=(e,i=t)=>(function(e,t=e=>e,n){let i=a(e.subscribe,e.getState,e.getInitialState,t,n);return r.useDebugValue(i),i})(n,e,i);return Object.assign(i,n),i},l=(e,t)=>e?s(e,t):s},4735:(e,t,n)=>{n.d(t,{Af:()=>s,Go:()=>f,Nz:()=>i,u5:()=>l,y3:()=>d});var r=n(2115);function i(e,t,n){if(!e)return;if(!0===n(e))return e;let r=t?e.return:e.child;for(;r;){let e=i(r,t,n);if(e)return e;r=t?null:r.sibling}}function o(e){try{return Object.defineProperties(e,{_currentRenderer:{get:()=>null,set(){}},_currentRenderer2:{get:()=>null,set(){}}})}catch(t){return e}}(()=>{var e,t;return"undefined"!=typeof window&&((null==(e=window.document)?void 0:e.createElement)||(null==(t=window.navigator)?void 0:t.product)==="ReactNative")})()?r.useLayoutEffect:r.useEffect;let a=o(r.createContext(null));class s extends r.Component{render(){return r.createElement(a.Provider,{value:this._reactInternals},this.props.children)}}function l(){let e=r.useContext(a);if(null===e)throw Error("its-fine: useFiber must be called within a <FiberProvider />!");let t=r.useId();return r.useMemo(()=>{for(let n of[e,null==e?void 0:e.alternate]){if(!n)continue;let e=i(n,!1,e=>{let n=e.memoizedState;for(;n;){if(n.memoizedState===t)return!0;n=n.next}});if(e)return e}},[e,t])}let c=Symbol.for("react.context"),u=e=>null!==e&&"object"==typeof e&&"$$typeof"in e&&e.$$typeof===c;function d(){let e=function(){let e=l(),[t]=r.useState(()=>new Map);t.clear();let n=e;for(;n;){let e=n.type;u(e)&&e!==a&&!t.has(e)&&t.set(e,r.use(o(e))),n=n.return}return t}();return r.useMemo(()=>Array.from(e.keys()).reduce((t,n)=>i=>r.createElement(t,null,r.createElement(n.Provider,{...i,value:e.get(n)})),e=>r.createElement(s,{...e})),[e])}function f(){if(!r.Activity)throw Error("its-fine: useActivityBridge requires React 19.2 or later!");let e=l(),[t]=r.useState(()=>{let t,n=[],o=!1;i(e,!0,e=>{var t,i;if(e.elementType===r.Activity){let r=(null==(t=e.child)?void 0:t.tag)===22?e.child.stateNode:null;if("number"!=typeof(null==r?void 0:r._visibility))throw Error("its-fine: unsupported React Activity internals!");n.push(r)}else 22===e.tag&&(null==(i=e.return)?void 0:i.elementType)!==r.Activity&&(o=!0)});let a="hidden",s=new Set,l={mounted:!1,connected:!1,subscribe:e=>(s.add(e),()=>{s.delete(e)}),sync(e){l.mounted&&!l.connected&&o&&n.length>0?t||(t=function(e){if("function"==typeof requestAnimationFrame){let t=requestAnimationFrame(e);return()=>cancelAnimationFrame(t)}let t=setTimeout(e,16);return()=>clearTimeout(t)}(()=>{t=void 0,l.sync(!0)})):(null==t||t(),t=void 0);let r=a;if(l.mounted?l.connected?r="visible":e&&(r=n.every(e=>(1&e._visibility)!=0)?"visible":"hidden"):r="hidden",a!==r)for(let e of(a=r,s))e()},Bridge:({children:e})=>r.createElement(r.Activity,{mode:r.useSyncExternalStore(l.subscribe,()=>a,()=>"hidden")},e)};return l});return r.useInsertionEffect(()=>(t.mounted=!0,queueMicrotask(()=>t.sync(!1)),()=>{t.mounted=!1,queueMicrotask(()=>t.sync(!1))}),[t]),r.useLayoutEffect(()=>(t.connected=!0,t.sync(!1),()=>{t.connected=!1,t.sync(!0)}),[t]),t.Bridge}},4806:(e,t,n)=>{e.exports=n(125)},5571:(e,t,n)=>{let r,i;n.d(t,{N:()=>C});var o=n(8945),a=n(2115),s=n(5339),l=n(6595);let c=new s.NRn,u=new s.Pq0;class d extends s.CmU{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new s.qtW([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new s.qtW([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new s.LuO(t,6,1);return this.setAttribute("instanceStart",new s.eHs(n,3,0)),this.setAttribute("instanceEnd",new s.eHs(n,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let n;e instanceof Float32Array?n=e:Array.isArray(e)&&(n=new Float32Array(e));let r=new s.LuO(n,2*t,1);return this.setAttribute("instanceColorStart",new s.eHs(r,t,0)),this.setAttribute("instanceColorEnd",new s.eHs(r,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new s.XJ7(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new s.NRn);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),c.setFromBufferAttribute(t),this.boundingBox.union(c))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new s.iyt),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let r=0;for(let i=0,o=e.count;i<o;i++)u.fromBufferAttribute(e,i),r=Math.max(r,n.distanceToSquared(u)),u.fromBufferAttribute(t,i),r=Math.max(r,n.distanceToSquared(u));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var f=n(5167);let p=parseInt(s.sPf.replace(/\D+/g,""));class m extends s.BKk{constructor(e){super({type:"LineMaterial",uniforms:s.LlO.clone(s.LlO.merge([f.UniformsLib.common,f.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new s.I9Y(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${p>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let h=p>=125?"uv1":"uv2",v=new s.IUQ,b=new s.Pq0,y=new s.Pq0,g=new s.IUQ,w=new s.IUQ,E=new s.IUQ,x=new s.Pq0,S=new s.kn4,P=new s.cZY,A=new s.Pq0,M=new s.NRn,L=new s.iyt,_=new s.IUQ;function O(e,t,n){return _.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),_.multiplyScalar(1/_.w),_.x=i/n.width,_.y=i/n.height,_.applyMatrix4(e.projectionMatrixInverse),_.multiplyScalar(1/_.w),Math.abs(Math.max(_.x,_.y))}class T extends s.eaF{constructor(e=new d,t=new m({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,r=new Float32Array(2*t.count);for(let e=0,i=0,o=t.count;e<o;e++,i+=2)b.fromBufferAttribute(t,e),y.fromBufferAttribute(n,e),r[i]=0===i?0:r[i-1],r[i+1]=r[i]+b.distanceTo(y);let i=new s.LuO(r,2,1);return e.setAttribute("instanceDistanceStart",new s.eHs(i,1,0)),e.setAttribute("instanceDistanceEnd",new s.eHs(i,1,1)),this}raycast(e,t){let n,o,a=this.material.worldUnits,l=e.camera;null!==l||a||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let c=void 0!==e.params.Line2&&e.params.Line2.threshold||0;r=e.ray;let u=this.matrixWorld,d=this.geometry,f=this.material;if(i=f.linewidth+c,null===d.boundingSphere&&d.computeBoundingSphere(),L.copy(d.boundingSphere).applyMatrix4(u),a)n=.5*i;else{let e=Math.max(l.near,L.distanceToPoint(r.origin));n=O(l,e,f.resolution)}if(L.radius+=n,!1!==r.intersectsSphere(L)){if(null===d.boundingBox&&d.computeBoundingBox(),M.copy(d.boundingBox).applyMatrix4(u),a)o=.5*i;else{let e=Math.max(l.near,M.distanceToPoint(r.origin));o=O(l,e,f.resolution)}M.expandByScalar(o),!1!==r.intersectsBox(M)&&(a?function(e,t){let n=e.matrixWorld,o=e.geometry,a=o.attributes.instanceStart,l=o.attributes.instanceEnd,c=Math.min(o.instanceCount,a.count);for(let o=0;o<c;o++){P.start.fromBufferAttribute(a,o),P.end.fromBufferAttribute(l,o),P.applyMatrix4(n);let c=new s.Pq0,u=new s.Pq0;r.distanceSqToSegment(P.start,P.end,u,c),u.distanceTo(c)<.5*i&&t.push({point:u,pointOnLine:c,distance:r.origin.distanceTo(u),object:e,face:null,faceIndex:o,uv:null,[h]:null})}}(this,t):function(e,t,n){let o=t.projectionMatrix,a=e.material.resolution,l=e.matrixWorld,c=e.geometry,u=c.attributes.instanceStart,d=c.attributes.instanceEnd,f=Math.min(c.instanceCount,u.count),p=-t.near;r.at(1,E),E.w=1,E.applyMatrix4(t.matrixWorldInverse),E.applyMatrix4(o),E.multiplyScalar(1/E.w),E.x*=a.x/2,E.y*=a.y/2,E.z=0,x.copy(E),S.multiplyMatrices(t.matrixWorldInverse,l);for(let t=0;t<f;t++){if(g.fromBufferAttribute(u,t),w.fromBufferAttribute(d,t),g.w=1,w.w=1,g.applyMatrix4(S),w.applyMatrix4(S),g.z>p&&w.z>p)continue;if(g.z>p){let e=g.z-w.z,t=(g.z-p)/e;g.lerp(w,t)}else if(w.z>p){let e=w.z-g.z,t=(w.z-p)/e;w.lerp(g,t)}g.applyMatrix4(o),w.applyMatrix4(o),g.multiplyScalar(1/g.w),w.multiplyScalar(1/w.w),g.x*=a.x/2,g.y*=a.y/2,w.x*=a.x/2,w.y*=a.y/2,P.start.copy(g),P.start.z=0,P.end.copy(w),P.end.z=0;let c=P.closestPointToPointParameter(x,!0);P.at(c,A);let f=s.cj9.lerp(g.z,w.z,c),m=f>=-1&&f<=1,v=x.distanceTo(A)<.5*i;if(m&&v){P.start.fromBufferAttribute(u,t),P.end.fromBufferAttribute(d,t),P.start.applyMatrix4(l),P.end.applyMatrix4(l);let i=new s.Pq0,o=new s.Pq0;r.distanceSqToSegment(P.start,P.end,o,i),n.push({point:o,pointOnLine:i,distance:r.origin.distanceTo(o),object:e,face:null,faceIndex:t,uv:null,[h]:null})}}}(this,l,t))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(v),this.material.uniforms.resolution.value.set(v.z,v.w))}}class j extends d{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,n=new Float32Array(2*t);for(let r=0;r<t;r+=3)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5];return super.setPositions(n),this}setColors(e,t=3){let n=e.length-t,r=new Float32Array(2*n);if(3===t)for(let i=0;i<n;i+=t)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5];else for(let i=0;i<n;i+=t)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5],r[2*i+6]=e[i+6],r[2*i+7]=e[i+7];return super.setColors(r,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class z extends T{constructor(e=new j,t=new m({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let C=a.forwardRef(function({points:e,color:t=0xffffff,vertexColors:n,linewidth:r,lineWidth:i,segments:c,dashed:u,...f},p){var h,v;let b=(0,l.D)(e=>e.size),y=a.useMemo(()=>c?new T:new z,[c]),[g]=a.useState(()=>new m),w=(null==n||null==(h=n[0])?void 0:h.length)===4?4:3,E=a.useMemo(()=>{let r=c?new d:new j,i=e.map(e=>{let t=Array.isArray(e);return e instanceof s.Pq0||e instanceof s.IUQ?[e.x,e.y,e.z]:e instanceof s.I9Y?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(r.setPositions(i.flat()),n){t=0xffffff;let e=n.map(e=>e instanceof s.Q1f?e.toArray():e);r.setColors(e.flat(),w)}return r},[e,c,n,w]);return a.useLayoutEffect(()=>{y.computeLineDistances()},[e,y]),a.useLayoutEffect(()=>{u?g.defines.USE_DASH="":delete g.defines.USE_DASH,g.needsUpdate=!0},[u,g]),a.useEffect(()=>()=>{E.dispose(),g.dispose()},[E]),a.createElement("primitive",(0,o.A)({object:y,ref:p},f),a.createElement("primitive",{object:E,attach:"geometry"}),a.createElement("primitive",(0,o.A)({object:g,attach:"material",color:t,vertexColors:!!n,resolution:[b.width,b.height],linewidth:null!=(v=null!=r?r:i)?v:1,dashed:u,transparent:4===w},f)))})},6451:(e,t)=>{function n(e,t){var n=e.length;for(e.push(t);0<n;){var r=n-1>>>1,i=e[r];if(0<o(i,t))e[r]=t,e[n]=i,n=r;else break}}function r(e){return 0===e.length?null:e[0]}function i(e){if(0===e.length)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;for(var r=0,i=e.length,a=i>>>1;r<a;){var s=2*(r+1)-1,l=e[s],c=s+1,u=e[c];if(0>o(l,n))c<i&&0>o(u,l)?(e[r]=u,e[c]=n,r=c):(e[r]=l,e[s]=n,r=s);else if(c<i&&0>o(u,n))e[r]=u,e[c]=n,r=c;else break}}return t}function o(e,t){var n=e.sortIndex-t.sortIndex;return 0!==n?n:e.id-t.id}if(t.unstable_now=void 0,"object"==typeof performance&&"function"==typeof performance.now){var a,s=performance;t.unstable_now=function(){return s.now()}}else{var l=Date,c=l.now();t.unstable_now=function(){return l.now()-c}}var u=[],d=[],f=1,p=null,m=3,h=!1,v=!1,b=!1,y=!1,g="function"==typeof setTimeout?setTimeout:null,w="function"==typeof clearTimeout?clearTimeout:null,E="undefined"!=typeof setImmediate?setImmediate:null;function x(e){for(var t=r(d);null!==t;){if(null===t.callback)i(d);else if(t.startTime<=e)i(d),t.sortIndex=t.expirationTime,n(u,t);else break;t=r(d)}}function S(e){if(b=!1,x(e),!v)if(null!==r(u))v=!0,P||(P=!0,a());else{var t=r(d);null!==t&&z(S,t.startTime-e)}}var P=!1,A=-1,M=5,L=-1;function _(){return!!y||!(t.unstable_now()-L<M)}function O(){if(y=!1,P){var e=t.unstable_now();L=e;var n=!0;try{e:{v=!1,b&&(b=!1,w(A),A=-1),h=!0;var o=m;try{t:{for(x(e),p=r(u);null!==p&&!(p.expirationTime>e&&_());){var s=p.callback;if("function"==typeof s){p.callback=null,m=p.priorityLevel;var l=s(p.expirationTime<=e);if(e=t.unstable_now(),"function"==typeof l){p.callback=l,x(e),n=!0;break t}p===r(u)&&i(u),x(e)}else i(u);p=r(u)}if(null!==p)n=!0;else{var c=r(d);null!==c&&z(S,c.startTime-e),n=!1}}break e}finally{p=null,m=o,h=!1}}}finally{n?a():P=!1}}}if("function"==typeof E)a=function(){E(O)};else if("undefined"!=typeof MessageChannel){var T=new MessageChannel,j=T.port2;T.port1.onmessage=O,a=function(){j.postMessage(null)}}else a=function(){g(O,0)};function z(e,n){A=g(function(){e(t.unstable_now())},n)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(e){e.callback=null},t.unstable_forceFrameRate=function(e){0>e||125<e?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):M=0<e?Math.floor(1e3/e):5},t.unstable_getCurrentPriorityLevel=function(){return m},t.unstable_next=function(e){switch(m){case 1:case 2:case 3:var t=3;break;default:t=m}var n=m;m=t;try{return e()}finally{m=n}},t.unstable_requestPaint=function(){y=!0},t.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=m;m=e;try{return t()}finally{m=n}},t.unstable_scheduleCallback=function(e,i,o){var s=t.unstable_now();switch(o="object"==typeof o&&null!==o&&"number"==typeof(o=o.delay)&&0<o?s+o:s,e){case 1:var l=-1;break;case 2:l=250;break;case 5:l=0x3fffffff;break;case 4:l=1e4;break;default:l=5e3}return l=o+l,e={id:f++,callback:i,priorityLevel:e,startTime:o,expirationTime:l,sortIndex:-1},o>s?(e.sortIndex=o,n(d,e),null===r(u)&&e===r(d)&&(b?(w(A),A=-1):b=!0,z(S,o-s))):(e.sortIndex=l,n(u,e),v||h||(v=!0,P||(P=!0,a()))),e},t.unstable_shouldYield=_,t.unstable_wrapCallback=function(e){var t=m;return function(){var n=m;m=t;try{return e.apply(this,arguments)}finally{m=n}}}},6750:(e,t,n)=>{n.d(t,{N:()=>v});var r=n(8945),i=n(6595),o=n(2115),a=n(5339),s=Object.defineProperty;class l{constructor(){((e,t,n)=>((e,t,n)=>t in e?s(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n)(e,"symbol"!=typeof t?t+"":t,n))(this,"_listeners")}addEventListener(e,t){void 0===this._listeners&&(this._listeners={});let n=this._listeners;void 0===n[e]&&(n[e]=[]),-1===n[e].indexOf(t)&&n[e].push(t)}hasEventListener(e,t){if(void 0===this._listeners)return!1;let n=this._listeners;return void 0!==n[e]&&-1!==n[e].indexOf(t)}removeEventListener(e,t){if(void 0===this._listeners)return;let n=this._listeners[e];if(void 0!==n){let e=n.indexOf(t);-1!==e&&n.splice(e,1)}}dispatchEvent(e){if(void 0===this._listeners)return;let t=this._listeners[e.type];if(void 0!==t){e.target=this;let n=t.slice(0);for(let t=0,r=n.length;t<r;t++)n[t].call(this,e);e.target=null}}}var c=Object.defineProperty,u=(e,t,n)=>(((e,t,n)=>t in e?c(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n)(e,"symbol"!=typeof t?t+"":t,n),n);let d=new a.RlV,f=new a.Zcv,p=Math.cos(Math.PI/180*70),m=(e,t)=>(e%t+t)%t;class h extends l{constructor(e,t){super(),u(this,"object"),u(this,"domElement"),u(this,"enabled",!0),u(this,"target",new a.Pq0),u(this,"minDistance",0),u(this,"maxDistance",1/0),u(this,"minZoom",0),u(this,"maxZoom",1/0),u(this,"minPolarAngle",0),u(this,"maxPolarAngle",Math.PI),u(this,"minAzimuthAngle",-1/0),u(this,"maxAzimuthAngle",1/0),u(this,"enableDamping",!1),u(this,"dampingFactor",.05),u(this,"enableZoom",!0),u(this,"zoomSpeed",1),u(this,"enableRotate",!0),u(this,"rotateSpeed",1),u(this,"enablePan",!0),u(this,"panSpeed",1),u(this,"screenSpacePanning",!0),u(this,"keyPanSpeed",7),u(this,"zoomToCursor",!1),u(this,"autoRotate",!1),u(this,"autoRotateSpeed",2),u(this,"reverseOrbit",!1),u(this,"reverseHorizontalOrbit",!1),u(this,"reverseVerticalOrbit",!1),u(this,"keys",{LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"}),u(this,"mouseButtons",{LEFT:a.kBv.ROTATE,MIDDLE:a.kBv.DOLLY,RIGHT:a.kBv.PAN}),u(this,"touches",{ONE:a.wtR.ROTATE,TWO:a.wtR.DOLLY_PAN}),u(this,"target0"),u(this,"position0"),u(this,"zoom0"),u(this,"_domElementKeyEvents",null),u(this,"getPolarAngle"),u(this,"getAzimuthalAngle"),u(this,"setPolarAngle"),u(this,"setAzimuthalAngle"),u(this,"getDistance"),u(this,"getZoomScale"),u(this,"listenToKeyEvents"),u(this,"stopListenToKeyEvents"),u(this,"saveState"),u(this,"reset"),u(this,"update"),u(this,"connect"),u(this,"dispose"),u(this,"dollyIn"),u(this,"dollyOut"),u(this,"getScale"),u(this,"setScale"),this.object=e,this.domElement=t,this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this.getPolarAngle=()=>h.phi,this.getAzimuthalAngle=()=>h.theta,this.setPolarAngle=e=>{let t=m(e,2*Math.PI),r=h.phi;r<0&&(r+=2*Math.PI),t<0&&(t+=2*Math.PI);let i=Math.abs(t-r);2*Math.PI-i<i&&(t<r?t+=2*Math.PI:r+=2*Math.PI),v.phi=t-r,n.update()},this.setAzimuthalAngle=e=>{let t=m(e,2*Math.PI),r=h.theta;r<0&&(r+=2*Math.PI),t<0&&(t+=2*Math.PI);let i=Math.abs(t-r);2*Math.PI-i<i&&(t<r?t+=2*Math.PI:r+=2*Math.PI),v.theta=t-r,n.update()},this.getDistance=()=>n.object.position.distanceTo(n.target),this.listenToKeyEvents=e=>{e.addEventListener("keydown",ee),this._domElementKeyEvents=e},this.stopListenToKeyEvents=()=>{this._domElementKeyEvents.removeEventListener("keydown",ee),this._domElementKeyEvents=null},this.saveState=()=>{n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=()=>{n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(r),n.update(),l=s.NONE},this.update=(()=>{let t=new a.Pq0,i=new a.Pq0(0,1,0),o=new a.PTz().setFromUnitVectors(e.up,i),u=o.clone().invert(),m=new a.Pq0,g=new a.PTz,w=2*Math.PI;return function(){let E=n.object.position;o.setFromUnitVectors(e.up,i),u.copy(o).invert(),t.copy(E).sub(n.target),t.applyQuaternion(o),h.setFromVector3(t),n.autoRotate&&l===s.NONE&&I(2*Math.PI/60/60*n.autoRotateSpeed),n.enableDamping?(h.theta+=v.theta*n.dampingFactor,h.phi+=v.phi*n.dampingFactor):(h.theta+=v.theta,h.phi+=v.phi);let x=n.minAzimuthAngle,S=n.maxAzimuthAngle;isFinite(x)&&isFinite(S)&&(x<-Math.PI?x+=w:x>Math.PI&&(x-=w),S<-Math.PI?S+=w:S>Math.PI&&(S-=w),x<=S?h.theta=Math.max(x,Math.min(S,h.theta)):h.theta=h.theta>(x+S)/2?Math.max(x,h.theta):Math.min(S,h.theta)),h.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,h.phi)),h.makeSafe(),!0===n.enableDamping?n.target.addScaledVector(y,n.dampingFactor):n.target.add(y),n.zoomToCursor&&T||n.object.isOrthographicCamera?h.radius=B(h.radius):h.radius=B(h.radius*b),t.setFromSpherical(h),t.applyQuaternion(u),E.copy(n.target).add(t),n.object.matrixAutoUpdate||n.object.updateMatrix(),n.object.lookAt(n.target),!0===n.enableDamping?(v.theta*=1-n.dampingFactor,v.phi*=1-n.dampingFactor,y.multiplyScalar(1-n.dampingFactor)):(v.set(0,0,0),y.set(0,0,0));let P=!1;if(n.zoomToCursor&&T){let r=null;if(n.object instanceof a.ubm&&n.object.isPerspectiveCamera){let e=t.length();r=B(e*b);let i=e-r;n.object.position.addScaledVector(_,i),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){let e=new a.Pq0(O.x,O.y,0);e.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/b)),n.object.updateProjectionMatrix(),P=!0;let i=new a.Pq0(O.x,O.y,0);i.unproject(n.object),n.object.position.sub(i).add(e),n.object.updateMatrixWorld(),r=t.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;null!==r&&(n.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(r).add(n.object.position):(d.origin.copy(n.object.position),d.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(d.direction))<p?e.lookAt(n.target):(f.setFromNormalAndCoplanarPoint(n.object.up,n.target),d.intersectPlane(f,n.target))))}else n.object instanceof a.qUd&&n.object.isOrthographicCamera&&(P=1!==b)&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/b)),n.object.updateProjectionMatrix());return b=1,T=!1,!!(P||m.distanceToSquared(n.object.position)>c||8*(1-g.dot(n.object.quaternion))>c)&&(n.dispatchEvent(r),m.copy(n.object.position),g.copy(n.object.quaternion),P=!1,!0)}})(),this.connect=e=>{n.domElement=e,n.domElement.style.touchAction="none",n.domElement.addEventListener("contextmenu",et),n.domElement.addEventListener("pointerdown",$),n.domElement.addEventListener("pointercancel",Q),n.domElement.addEventListener("wheel",J)},this.dispose=()=>{var e,t,r,i,o,a;n.domElement&&(n.domElement.style.touchAction="auto"),null==(e=n.domElement)||e.removeEventListener("contextmenu",et),null==(t=n.domElement)||t.removeEventListener("pointerdown",$),null==(r=n.domElement)||r.removeEventListener("pointercancel",Q),null==(i=n.domElement)||i.removeEventListener("wheel",J),null==(o=n.domElement)||o.ownerDocument.removeEventListener("pointermove",K),null==(a=n.domElement)||a.ownerDocument.removeEventListener("pointerup",Q),null!==n._domElementKeyEvents&&n._domElementKeyEvents.removeEventListener("keydown",ee)};let n=this,r={type:"change"},i={type:"start"},o={type:"end"},s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},l=s.NONE,c=1e-6,h=new a.YHV,v=new a.YHV,b=1,y=new a.Pq0,g=new a.I9Y,w=new a.I9Y,E=new a.I9Y,x=new a.I9Y,S=new a.I9Y,P=new a.I9Y,A=new a.I9Y,M=new a.I9Y,L=new a.I9Y,_=new a.Pq0,O=new a.I9Y,T=!1,j=[],z={};function C(){return Math.pow(.95,n.zoomSpeed)}function I(e){n.reverseOrbit||n.reverseHorizontalOrbit?v.theta+=e:v.theta-=e}function R(e){n.reverseOrbit||n.reverseVerticalOrbit?v.phi+=e:v.phi-=e}let D=(()=>{let e=new a.Pq0;return function(t,n){e.setFromMatrixColumn(n,0),e.multiplyScalar(-t),y.add(e)}})(),U=(()=>{let e=new a.Pq0;return function(t,r){!0===n.screenSpacePanning?e.setFromMatrixColumn(r,1):(e.setFromMatrixColumn(r,0),e.crossVectors(n.object.up,e)),e.multiplyScalar(t),y.add(e)}})(),k=(()=>{let e=new a.Pq0;return function(t,r){let i=n.domElement;if(i&&n.object instanceof a.ubm&&n.object.isPerspectiveCamera){let o=n.object.position;e.copy(o).sub(n.target);let a=e.length();D(2*t*(a*=Math.tan(n.object.fov/2*Math.PI/180))/i.clientHeight,n.object.matrix),U(2*r*a/i.clientHeight,n.object.matrix)}else i&&n.object instanceof a.qUd&&n.object.isOrthographicCamera?(D(t*(n.object.right-n.object.left)/n.object.zoom/i.clientWidth,n.object.matrix),U(r*(n.object.top-n.object.bottom)/n.object.zoom/i.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}})();function N(e){n.object instanceof a.ubm&&n.object.isPerspectiveCamera||n.object instanceof a.qUd&&n.object.isOrthographicCamera?b=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function H(e){if(!n.zoomToCursor||!n.domElement)return;T=!0;let t=n.domElement.getBoundingClientRect(),r=e.clientX-t.left,i=e.clientY-t.top,o=t.width,a=t.height;O.x=r/o*2-1,O.y=-(i/a*2)+1,_.set(O.x,O.y,1).unproject(n.object).sub(n.object.position).normalize()}function B(e){return Math.max(n.minDistance,Math.min(n.maxDistance,e))}function F(e){g.set(e.clientX,e.clientY)}function Y(e){x.set(e.clientX,e.clientY)}function q(){if(1==j.length)g.set(j[0].pageX,j[0].pageY);else{let e=.5*(j[0].pageX+j[1].pageX),t=.5*(j[0].pageY+j[1].pageY);g.set(e,t)}}function W(){if(1==j.length)x.set(j[0].pageX,j[0].pageY);else{let e=.5*(j[0].pageX+j[1].pageX),t=.5*(j[0].pageY+j[1].pageY);x.set(e,t)}}function V(){let e=j[0].pageX-j[1].pageX,t=j[0].pageY-j[1].pageY,n=Math.sqrt(e*e+t*t);A.set(0,n)}function G(e){if(1==j.length)w.set(e.pageX,e.pageY);else{let t=er(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);w.set(n,r)}E.subVectors(w,g).multiplyScalar(n.rotateSpeed);let t=n.domElement;t&&(I(2*Math.PI*E.x/t.clientHeight),R(2*Math.PI*E.y/t.clientHeight)),g.copy(w)}function X(e){if(1==j.length)S.set(e.pageX,e.pageY);else{let t=er(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);S.set(n,r)}P.subVectors(S,x).multiplyScalar(n.panSpeed),k(P.x,P.y),x.copy(S)}function Z(e){var t;let r=er(e),i=e.pageX-r.x,o=e.pageY-r.y,a=Math.sqrt(i*i+o*o);M.set(0,a),L.set(0,Math.pow(M.y/A.y,n.zoomSpeed)),t=L.y,N(b/t),A.copy(M)}function $(e){var t,r,o;!1!==n.enabled&&(0===j.length&&(null==(t=n.domElement)||t.ownerDocument.addEventListener("pointermove",K),null==(r=n.domElement)||r.ownerDocument.addEventListener("pointerup",Q)),o=e,j.push(o),"touch"===e.pointerType?function(e){switch(en(e),j.length){case 1:switch(n.touches.ONE){case a.wtR.ROTATE:if(!1===n.enableRotate)return;q(),l=s.TOUCH_ROTATE;break;case a.wtR.PAN:if(!1===n.enablePan)return;W(),l=s.TOUCH_PAN;break;default:l=s.NONE}break;case 2:switch(n.touches.TWO){case a.wtR.DOLLY_PAN:if(!1===n.enableZoom&&!1===n.enablePan)return;n.enableZoom&&V(),n.enablePan&&W(),l=s.TOUCH_DOLLY_PAN;break;case a.wtR.DOLLY_ROTATE:if(!1===n.enableZoom&&!1===n.enableRotate)return;n.enableZoom&&V(),n.enableRotate&&q(),l=s.TOUCH_DOLLY_ROTATE;break;default:l=s.NONE}break;default:l=s.NONE}l!==s.NONE&&n.dispatchEvent(i)}(e):function(e){let t;switch(e.button){case 0:t=n.mouseButtons.LEFT;break;case 1:t=n.mouseButtons.MIDDLE;break;case 2:t=n.mouseButtons.RIGHT;break;default:t=-1}switch(t){case a.kBv.DOLLY:if(!1===n.enableZoom)return;H(e),A.set(e.clientX,e.clientY),l=s.DOLLY;break;case a.kBv.ROTATE:if(e.ctrlKey||e.metaKey||e.shiftKey){if(!1===n.enablePan)return;Y(e),l=s.PAN}else{if(!1===n.enableRotate)return;F(e),l=s.ROTATE}break;case a.kBv.PAN:if(e.ctrlKey||e.metaKey||e.shiftKey){if(!1===n.enableRotate)return;F(e),l=s.ROTATE}else{if(!1===n.enablePan)return;Y(e),l=s.PAN}break;default:l=s.NONE}l!==s.NONE&&n.dispatchEvent(i)}(e))}function K(e){!1!==n.enabled&&("touch"===e.pointerType?function(e){switch(en(e),l){case s.TOUCH_ROTATE:if(!1===n.enableRotate)return;G(e),n.update();break;case s.TOUCH_PAN:if(!1===n.enablePan)return;X(e),n.update();break;case s.TOUCH_DOLLY_PAN:if(!1===n.enableZoom&&!1===n.enablePan)return;n.enableZoom&&Z(e),n.enablePan&&X(e),n.update();break;case s.TOUCH_DOLLY_ROTATE:if(!1===n.enableZoom&&!1===n.enableRotate)return;n.enableZoom&&Z(e),n.enableRotate&&G(e),n.update();break;default:l=s.NONE}}(e):function(e){if(!1!==n.enabled)switch(l){case s.ROTATE:if(!1===n.enableRotate)return;w.set(e.clientX,e.clientY),E.subVectors(w,g).multiplyScalar(n.rotateSpeed);let t=n.domElement;t&&(I(2*Math.PI*E.x/t.clientHeight),R(2*Math.PI*E.y/t.clientHeight)),g.copy(w),n.update();break;case s.DOLLY:var r,i;if(!1===n.enableZoom)return;(M.set(e.clientX,e.clientY),L.subVectors(M,A),L.y>0)?(r=C(),N(b/r)):L.y<0&&(i=C(),N(b*i)),A.copy(M),n.update();break;case s.PAN:if(!1===n.enablePan)return;S.set(e.clientX,e.clientY),P.subVectors(S,x).multiplyScalar(n.panSpeed),k(P.x,P.y),x.copy(S),n.update()}}(e))}function Q(e){var t,r,i;(function(e){delete z[e.pointerId];for(let t=0;t<j.length;t++)if(j[t].pointerId==e.pointerId)return void j.splice(t,1)})(e),0===j.length&&(null==(t=n.domElement)||t.releasePointerCapture(e.pointerId),null==(r=n.domElement)||r.ownerDocument.removeEventListener("pointermove",K),null==(i=n.domElement)||i.ownerDocument.removeEventListener("pointerup",Q)),n.dispatchEvent(o),l=s.NONE}function J(e){if(!1!==n.enabled&&!1!==n.enableZoom&&(l===s.NONE||l===s.ROTATE)){var t,r;e.preventDefault(),n.dispatchEvent(i),(H(e),e.deltaY<0)?(t=C(),N(b*t)):e.deltaY>0&&(r=C(),N(b/r)),n.update(),n.dispatchEvent(o)}}function ee(e){if(!1!==n.enabled&&!1!==n.enablePan){let t=!1;switch(e.code){case n.keys.UP:k(0,n.keyPanSpeed),t=!0;break;case n.keys.BOTTOM:k(0,-n.keyPanSpeed),t=!0;break;case n.keys.LEFT:k(n.keyPanSpeed,0),t=!0;break;case n.keys.RIGHT:k(-n.keyPanSpeed,0),t=!0}t&&(e.preventDefault(),n.update())}}function et(e){!1!==n.enabled&&e.preventDefault()}function en(e){let t=z[e.pointerId];void 0===t&&(t=new a.I9Y,z[e.pointerId]=t),t.set(e.pageX,e.pageY)}function er(e){return z[(e.pointerId===j[0].pointerId?j[1]:j[0]).pointerId]}this.dollyIn=(e=C())=>{N(b*e),n.update()},this.dollyOut=(e=C())=>{N(b/e),n.update()},this.getScale=()=>b,this.setScale=e=>{N(e),n.update()},this.getZoomScale=()=>C(),void 0!==t&&this.connect(t),this.update()}}let v=o.forwardRef(({makeDefault:e,camera:t,regress:n,domElement:a,enableDamping:s=!0,keyEvents:l=!1,onChange:c,onStart:u,onEnd:d,...f},p)=>{let m=(0,i.D)(e=>e.invalidate),v=(0,i.D)(e=>e.camera),b=(0,i.D)(e=>e.gl),y=(0,i.D)(e=>e.events),g=(0,i.D)(e=>e.setEvents),w=(0,i.D)(e=>e.set),E=(0,i.D)(e=>e.get),x=(0,i.D)(e=>e.performance),S=t||v,P=a||y.connected||b.domElement,A=o.useMemo(()=>new h(S),[S]);return(0,i.F)(()=>{A.enabled&&A.update()},-1),o.useEffect(()=>(l&&A.connect(!0===l?P:l),A.connect(P),()=>void A.dispose()),[l,P,n,A,m]),o.useEffect(()=>{let e=e=>{m(),n&&x.regress(),c&&c(e)},t=e=>{u&&u(e)},r=e=>{d&&d(e)};return A.addEventListener("change",e),A.addEventListener("start",t),A.addEventListener("end",r),()=>{A.removeEventListener("start",t),A.removeEventListener("end",r),A.removeEventListener("change",e)}},[c,u,d,A,m,g]),o.useEffect(()=>{if(e){let e=E().controls;return w({controls:A}),()=>w({controls:e})}},[e,A]),o.createElement("primitive",(0,r.A)({ref:p,object:A,enableDamping:s},f))})},8828:(e,t,n)=>{e.exports=n(3654)},8945:(e,t,n)=>{n.d(t,{A:()=>r});function r(){return(r=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(null,arguments)}},9914:(e,t,n)=>{e.exports=n(6451)}}]);