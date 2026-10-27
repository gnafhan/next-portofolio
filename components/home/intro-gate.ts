/**
 * Decides before first paint whether the home intro plays (WebGL on a real GPU, no reduced motion,
 * once per tab session; ?intro forces it), so the page never flashes. Runs from the root layout as a
 * beforeInteractive script; it only acts on "/". Kept out of the client component so React never
 * has to render a <script> tag during client-side navigation.
 */
export const INTRO_GATE = `(function(){try{if(location.pathname!=='/')return;var d=document.documentElement,force=/[?&]intro\\b/.test(location.search),why=function(r){console.info('[intro] skipped: '+r+' (add ?intro to the URL to force it)');};if(!force&&matchMedia('(prefers-reduced-motion: reduce)').matches)return why('reduced motion is on in system settings');if(!force&&sessionStorage.getItem('intro-seen'))return why('already shown in this tab');var g=document.createElement('canvas').getContext('webgl');if(!g)return why('WebGL unavailable');var i=g.getExtension('WEBGL_debug_renderer_info');var r=i?String(g.getParameter(i.UNMASKED_RENDERER_WEBGL)):'';if(!force&&/swiftshader|llvmpipe|software/i.test(r))return why('software renderer: '+r);d.dataset.intro='on';}catch(e){console.info('[intro] skipped: '+e);}})();`;
