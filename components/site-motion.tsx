'use client';

import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import {animate,inView,useReducedMotion} from 'motion/react';
import {ScrollDetails} from './motion-details';

/** All effects progressively enhance visible server-rendered content. */
export default function SiteMotion(){
 const pathname=usePathname();
 const reduced=useReducedMotion();
 useEffect(()=>{
  const header=document.querySelector('header');
  const updateHeader=()=>header?.classList.toggle('is-scrolled',window.scrollY>16);
  updateHeader();
  window.addEventListener('scroll',updateHeader,{passive:true});
  if(reduced||window.matchMedia('(prefers-reduced-motion: reduce)').matches){
   return ()=>window.removeEventListener('scroll',updateHeader);
  }
  const animations:ReturnType<typeof animate>[]=[];
  const stops:(()=>void)[]=[];
  const touched=new Set<HTMLElement>();
  function play(element:HTMLElement,frames:Parameters<typeof animate>[1],duration:number,delay=0){
   touched.add(element);
   const control=animate(element,frames,{duration,delay,ease:[.22,1,.36,1]});
   animations.push(control);
   void control.then(()=>['transform','opacity','clip-path'].forEach(p=>element.style.removeProperty(p)));
  }
  document.querySelectorAll<HTMLElement>('.hero-line > span').forEach((line,i)=>{
   play(line,{y:['115%','0%'],rotate:[3,0],opacity:[0,1]},1.05,.12+i*.17);
  });
  const heroImage=document.querySelector<HTMLElement>('.hero > .photo img');
  if(heroImage)play(heroImage,{scale:[1.14,1],opacity:[.4,1]},1.8);
  const targets=document.querySelectorAll<HTMLElement>([
   '.hero-content > .eyebrow','.hero-content > p','.hero-content > .actions','.hero-content > .metrics',
   '.page-hero > .eyebrow','.page-hero > h1','.page-hero > p',
   'main .section-top','main .intro > div:first-child','main .intro-points > div',
   'main .service-grid > a','main .industries > div:first-child','main .industries > a',
   'main .process > div','main .clients-section > div:first-child','main .client-wall > div',
   'main .enquiry-copy','main .enquiry-form','main .about-story > div:not(.photo)',
   'main .commitment-grid > article','main .service-list > article > div:not(.photo)',
   'main .sector-list > article > div:not(.photo)','main .client-story > div:not(.photo)',
   '.closing-inner > div'
  ].join(','));
  stops.push(inView(Array.from(targets),element=>{
   const index=Array.from(element.parentElement?.children||[]).indexOf(element);
   const delay=Math.min(Math.max(index,0)*.11,.38);
   element.classList.add('is-revealed');
   play(element as HTMLElement,{opacity:[0,1],y:[44,0]},.85,delay);
  },{amount:.15}));
  const photos=document.querySelectorAll<HTMLElement>('main .photo:not(.photo-hero)');
  stops.push(inView(Array.from(photos),element=>{
   play(element as HTMLElement,{clipPath:['inset(0 100% 0 0)','inset(0 0% 0 0)']},1.05);
   const image=element.querySelector<HTMLElement>('img');
   if(image)play(image,{scale:[1.14,1]},1.35);
  },{amount:.16}));
  if(window.matchMedia('(hover: hover) and (pointer: fine)').matches){
   document.querySelectorAll<HTMLElement>('.service-card,.industry-card').forEach(card=>{
    const move=(e:PointerEvent)=>{
     const rect=card.getBoundingClientRect();
     const x=(e.clientX-rect.left)/rect.width;
     const y=(e.clientY-rect.top)/rect.height;
     card.style.setProperty('--tilt-x',`${(0.5-y)*7}deg`);
     card.style.setProperty('--tilt-y',`${(x-0.5)*7}deg`);
     card.style.setProperty('--spot-x',`${x*100}%`);
     card.style.setProperty('--spot-y',`${y*100}%`);
    };
    const leave=()=>['--tilt-x','--tilt-y','--spot-x','--spot-y'].forEach(p=>card.style.removeProperty(p));
    card.addEventListener('pointermove',move,{passive:true});
    card.addEventListener('pointerleave',leave);
    stops.push(()=>{card.removeEventListener('pointermove',move);card.removeEventListener('pointerleave',leave);leave();});
   });
  }
  return ()=>{
   stops.forEach(stop=>stop());
   animations.forEach(control=>control.stop());
   touched.forEach(element=>['transform','opacity','clip-path'].forEach(p=>element.style.removeProperty(p)));
   targets.forEach(element=>element.classList.remove('is-revealed'));
   window.removeEventListener('scroll',updateHeader);
  };
 },[pathname,reduced]);
 return <ScrollDetails/>;
}
