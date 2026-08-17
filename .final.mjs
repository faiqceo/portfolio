import fs from 'fs';
import { JSDOM, VirtualConsole } from 'jsdom';
const html = fs.readFileSync('dist/index.html','utf8');
const errs=[]; const vc=new VirtualConsole();
vc.on('jsdomError',e=>errs.push('jsdomError: '+(e.message||e)));
const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc,url:'http://localhost/'});
const w=dom.window,d=w.document;
let mm = q => ({matches: q.includes('hover: hover')||q.includes('pointer: fine'), media:q, addEventListener(){},removeEventListener(){},addListener(){},removeListener(){}});
w.matchMedia = mm;
w.IntersectionObserver=class{observe(){}unobserve(){}disconnect(){}};
Object.defineProperty(w,'innerHeight',{value:900,writable:true});
let scrollY=0;
const panels=[...d.querySelectorAll('.work-panel')];
panels.forEach((p,i)=>{p.getBoundingClientRect=()=>({top:i*600-scrollY,height:600,bottom:i*600+600-scrollY,left:0,right:0,width:500});});
try{ w.eval(fs.readFileSync('script.js','utf8')); }catch(e){errs.push('THREW: '+e.message);}
d.dispatchEvent(new w.Event('DOMContentLoaded'));

console.log('sections:', [...d.querySelectorAll('section[id]')].map(s=>s.id).join(', '));
console.log('contact rows:', d.querySelectorAll('.contact-line').length, '| socials:', d.querySelectorAll('.contact-socials a').length);
console.log('cursor els  :', d.querySelectorAll('.cursor-dot,.cursor-ring').length);
console.log('react root  :', d.getElementById('root') ? 'STILL PRESENT' : 'removed');

// cursor: simulate a mouse move
const ev = new w.PointerEvent('pointermove', {clientX:120, clientY:200, bubbles:true});
Object.defineProperty(ev,'pointerType',{value:'mouse'});
Object.defineProperty(ev,'target',{value:d.body});
w.dispatchEvent(ev);
await new Promise(r=>setTimeout(r,60));
console.log('has-cursor  :', d.documentElement.classList.contains('has-cursor'));
console.log('dot moved   :', d.querySelector('.cursor-dot').style.transform || '(none)');

// work scroll
const act=()=>{const p=panels.findIndex(x=>x.classList.contains('is-active'));const s=[...d.querySelectorAll('.work-shot')].findIndex(x=>x.classList.contains('is-active'));return `${p}/${s} ${p===s?'OK':'MISMATCH'}`;};
process.stdout.write('work scroll : ');
const out=[];
for(const y of [0,600,1200,1800]){scrollY=y;w.dispatchEvent(new w.Event('scroll'));await new Promise(r=>setTimeout(r,30));out.push(act());}
console.log(out.join('  '));
console.log('\nerrors:', errs.length?errs:'none');
