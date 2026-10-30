'use client';

import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import {animate,inView,useReducedMotion} from 'motion/react';

/** Progressive enhancement: content stays visible if JavaScript or motion is unavailable. */
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
  const targets=document.querySelectorAll<HTMLElement>([
   '.hero-content > .eyebrow','.hero-content > h1','.hero-content > p',
   '.hero-content > .actions','.hero-content > .metrics',
   '.page-hero > .eyebrow','.page-hero > h1','.page-hero > p',
   'main .section-top','main .intro > div','main .service-grid > a',
   'main .industries > *','main .process > div','main .clients-section > div',
   'main .enquiry-copy','main .enquiry-form','main .about-story > *',
   'main .commitment-grid > article','main .service-list > article',
   'main .sector-list > article','main .client-story > *','.closing-inner > div'
  ].join(','));
  const animations:ReturnType<typeof animate>[]=[];
  const stop=inView(Array.from(targets),element=>{
   const siblings=Array.from(element.parentElement?.children||[]);
   const index=siblings.indexOf(element);
   const delay=Math.min(Math.max(index,0)*.055,.22);
   const control=animate(element,{opacity:[0,1],y:[18,0]},{duration:.6,delay,ease:[.22,1,.36,1]});
   animations.push(control);
   void control.then(()=>{
    (element as HTMLElement).style.removeProperty('transform');
    (element as HTMLElement).style.removeProperty('opacity');
   });
  },{amount:.12});
  return ()=>{
   stop();
   animations.forEach(control=>control.stop());
   targets.forEach(element=>{element.style.removeProperty('transform');element.style.removeProperty('opacity');});
   window.removeEventListener('scroll',updateHeader);
  };
 },[pathname,reduced]);
 return null;
}
