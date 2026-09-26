/* Progressive enhancement: a contained Ayurvedic treatment still life. */
(() => {
  'use strict';
  const stage=document.getElementById('webgl-stage');
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const progress=document.querySelector('.scroll-progress span');let progressFrame=0;
  function updateProgress(){progressFrame=0;if(progress)progress.style.transform=`scaleX(${Math.min(1,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight))})`;}
  function queueProgress(){if(!progressFrame)progressFrame=requestAnimationFrame(updateProgress);}
  addEventListener('scroll',queueProgress,{passive:true});addEventListener('resize',queueProgress,{passive:true});updateProgress();
  if(!stage || motion.matches || navigator.connection?.saveData)return;
  const load=src=>new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=src;script.onload=resolve;script.onerror=reject;document.head.append(script);});
  let initialized=false,cleanup=()=>{};
  const lazy=new IntersectionObserver(async entries=>{
    if(initialized || !entries.some(e=>e.isIntersecting))return;initialized=true;lazy.disconnect();
    try {await Promise.all([load('js/vendor/three.min.js'),load('js/vendor/gsap.min.js')]);await load('js/vendor/ScrollTrigger.min.js');if(!motion.matches)createScene();}catch{stage.classList.remove('is-ready');}
  },{rootMargin:'350px'});lazy.observe(stage);
  function createScene(){
    const T=window.THREE, mobile=innerWidth<701, segments=mobile?28:56;
    let renderer,raf=0,visible=false,disposed=false,last=0,frames=0,slowFrames=0,environment;
    const geometries=new Set(),materials=new Set(),textures=new Set(),triggers=[];
    let resizeObserver,visibilityObserver;
    const scene=new T.Scene();
    const camera=new T.PerspectiveCamera(34,1,.1,60);camera.position.set(4.2,4.4,6.4);camera.lookAt(0,.35,0);
    function dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(raf);resizeObserver?.disconnect();visibilityObserver?.disconnect();triggers.forEach(t=>t.kill());geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());environment?.dispose();renderer?.dispose();renderer?.domElement.remove();stage.classList.remove('is-ready');document.removeEventListener('visibilitychange',onVisibility);}
    cleanup=dispose;
    try{
      renderer=new T.WebGLRenderer({alpha:true,antialias:!mobile,powerPreference:'low-power'});
      renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.15:1.6));renderer.outputEncoding=T.sRGBEncoding;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.82;
      renderer.shadowMap.enabled=!mobile;renderer.shadowMap.type=T.PCFSoftShadowMap;
      stage.append(renderer.domElement);
      renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();dispose();},{once:true});
      const room=new T.Scene();room.background=new T.Color(0xe8eddf);
      const panelGeometry=new T.PlaneGeometry(12,12),panelMaterial=new T.MeshBasicMaterial({color:0xffffff});
      const panel=new T.Mesh(panelGeometry,panelMaterial);panel.position.set(-3,7,4);panel.lookAt(0,0,0);room.add(panel);
      const greenGeometry=new T.PlaneGeometry(8,8),greenMaterial=new T.MeshBasicMaterial({color:0xaab795});
      const greenPanel=new T.Mesh(greenGeometry,greenMaterial);greenPanel.position.set(6,1,-4);greenPanel.lookAt(0,0,0);room.add(greenPanel);
      const pmrem=new T.PMREMGenerator(renderer);environment=pmrem.fromScene(room,.04);scene.environment=environment.texture;pmrem.dispose();panelGeometry.dispose();panelMaterial.dispose();greenGeometry.dispose();greenMaterial.dispose();
      const ritual=new T.Group();scene.add(ritual);
      const material=options=>{const m=new T.MeshStandardMaterial({...options,envMapIntensity:.24});m.color.convertSRGBToLinear();materials.add(m);return m;};
      const brass=material({color:0xb69a50,metalness:.78,roughness:.29});
      const oil=material({color:0x9f651d,metalness:.15,roughness:.14});
      const wood=material({color:0x92714e,metalness:0,roughness:.72});
      const grainCanvas=document.createElement('canvas');grainCanvas.width=grainCanvas.height=256;
      const ctx=grainCanvas.getContext('2d');ctx.fillStyle='#d6bc94';ctx.fillRect(0,0,256,256);
      for(let i=0;i<150;i++){ctx.beginPath();ctx.strokeStyle=`rgba(87,52,24,${.06+(i%5)*.017})`;ctx.lineWidth=.5+(i%3)*.25;const y=i*1.8;ctx.moveTo(0,y);ctx.bezierCurveTo(80,y+Math.sin(i*.16)*13,165,y-8,256,y+Math.cos(i*.13)*8);ctx.stroke();}
      const grain=new T.CanvasTexture(grainCanvas);grain.encoding=T.sRGBEncoding;textures.add(grain);wood.map=grain;
      const woodEdge=material({color:0x785735,roughness:.66});
      const stone=material({color:0x61675a,roughness:.68});
      const linen=material({color:0xeee7d7,roughness:1});
      const leafMat=material({color:0x3e7527,roughness:.72,side:T.DoubleSide});
      const veinMat=material({color:0x819b56,roughness:.85});
      function mesh(g,m,pos,scale=[1,1,1],rotation=[0,0,0]){geometries.add(g);const obj=new T.Mesh(g,m);obj.position.set(...pos);obj.scale.set(...scale);obj.rotation.set(...rotation);obj.castShadow=!mobile;obj.receiveShadow=!mobile;ritual.add(obj);return obj;}
      mesh(new T.CylinderGeometry(2.35,2.38,.16,segments),wood,[0,0,0],[1,1,.7]);
      mesh(new T.TorusGeometry(2.3,.065,8,segments),woodEdge,[0,.075,0],[1,.7,1],[Math.PI/2,0,0]);
      // A closed lathed vessel with an inner wall, level oil and horizontal rim.
      const profile=[[.02,.1],[.35,.1],[.61,.16],[.86,.32],[1,.58],[1,.65],[.94,.65],[.86,.4],[.61,.23],[.32,.18],[.02,.18]].map(([x,y])=>new T.Vector2(x,y));
      mesh(new T.LatheGeometry(profile,segments),brass,[-.45,.1,.08]);
      mesh(new T.CircleGeometry(.93,segments),oil,[-.45,.7,.08],[1,1,1],[-Math.PI/2,0,0]);
      const ripple=mesh(new T.TorusGeometry(.53,.007,6,segments),brass,[-.45,.707,.08],[1,1,1],[Math.PI/2,0,0]);
      [[1.05,.31,.4,.63,.22,.44],[1.01,.59,.38,.51,.17,.35],[1.04,.8,.37,.39,.11,.29]].forEach(([x,y,z,sx,sy,sz])=>mesh(new T.SphereGeometry(1,mobile?16:26,mobile?10:18),stone,[x,y,z],[sx,sy,sz],[.03,.22,-.04]));
      mesh(new T.CylinderGeometry(.27,.27,1.5,segments),linen,[-.45,.42,-.98],[1,1,1],[0,0,Math.PI/2]);
      mesh(new T.CylinderGeometry(.027,.035,1.9,12),woodEdge,[.15,.19,.94],[1,1,1],[0,0,Math.PI/2-.15]);
      mesh(new T.SphereGeometry(1,18,10),wood,[1.02,.2,.94],[.28,.045,.16]);
      const shape=new T.Shape();shape.moveTo(0,0);shape.bezierCurveTo(.2,.28,.62,.3,.92,0);shape.bezierCurveTo(.6,-.28,.19,-.2,0,0);
      [[.76,.15,-.55,-.6],[1.04,.17,-.62,-1.5],[1.18,.16,-.48,.4],[-1.65,.17,.4,2.3]].forEach(([x,y,z,r])=>{
        mesh(new T.ShapeGeometry(shape,12),leafMat,[x,y,z],[.9,.9,.9],[-Math.PI/2,0,r]);
        const vein=new T.BufferGeometry().setFromPoints([new T.Vector3(0,0,.006),new T.Vector3(.78,0,.006)]);geometries.add(vein);const lm=new T.LineBasicMaterial({color:0x9cb176});materials.add(lm);const line=new T.Line(vein,lm);line.position.set(x,y,z);line.rotation.set(-Math.PI/2,0,r);line.scale.setScalar(.9);ritual.add(line);
      });
      scene.add(new T.HemisphereLight(0xffffff,0xd6dec9,.65));const sun=new T.DirectionalLight(0xfff5df,.95);sun.position.set(-3,7,5);sun.castShadow=!mobile;sun.shadow.mapSize.set(1024,1024);sun.shadow.normalBias=.03;sun.shadow.camera.left=-5;sun.shadow.camera.right=5;sun.shadow.camera.top=5;sun.shadow.camera.bottom=-5;scene.add(sun);
      const groundGeometry=new T.PlaneGeometry(25,25);geometries.add(groundGeometry);const groundMat=new T.ShadowMaterial({opacity:.13});materials.add(groundMat);const ground=new T.Mesh(groundGeometry,groundMat);ground.rotation.x=-Math.PI/2;ground.position.y=-.13;ground.receiveShadow=true;scene.add(ground);
      const target={rotation:-.23,x:0,zoom:1};
      gsap.registerPlugin(ScrollTrigger);
      const tl=gsap.timeline({scrollTrigger:{trigger:'#essence',start:'top bottom',end:'bottom top',scrub:1.7},defaults:{ease:'power2.inOut'}});
      tl.to(target,{rotation:-.12,x:-.1,zoom:1.05,duration:1}).to(target,{rotation:.2,x:.08,zoom:1.09,duration:1.4}).to(target,{rotation:.07,x:0,zoom:1.02,duration:1});triggers.push(tl.scrollTrigger,tl);
      function resize(){if(disposed)return;const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
      resizeObserver=new ResizeObserver(resize);resizeObserver.observe(stage);resize();
      let lastDraw=0;
      function render(time){raf=0;if(disposed || !visible || document.hidden)return;
        raf=requestAnimationFrame(render);if(time-lastDraw<(mobile?32:20))return;lastDraw=time;
        if(last){frames++;if(time-last>75)slowFrames++;}last=time;
        if(frames===100 && slowFrames>35){dispose();return;}
        ritual.rotation.y=target.rotation;ritual.position.x=target.x;camera.zoom=target.zoom;camera.updateProjectionMatrix();
        ripple.scale.setScalar(1+Math.sin(time*.0007)*.045);renderer.render(scene,camera);stage.classList.add('is-ready');
      }
      function start(){last=0;if(!raf && visible && !document.hidden && !disposed)raf=requestAnimationFrame(render);}
      function stop(){cancelAnimationFrame(raf);raf=0;}
      function visibility(entries){visible=entries.some(e=>e.isIntersecting);if(visible)start();else stop();}
      visibilityObserver=new IntersectionObserver(visibility,{threshold:.01});visibilityObserver.observe(stage);
      function handlePageHide(e){if(e.persisted)stop();else dispose();}
      addEventListener('pagehide',handlePageHide,{once:true});addEventListener('pageshow',start);
      onVisibility=()=>document.hidden?stop():start();document.addEventListener('visibilitychange',onVisibility);
    }catch{dispose();}
    function onVisibility(){}
  }
  motion.addEventListener('change',e=>{if(e.matches){lazy.disconnect();cleanup();}});
})();
