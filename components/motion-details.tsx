'use client';

import {useEffect,useRef,useState} from 'react';
import {animate,motion,useInView,useMotionValue,useMotionValueEvent,useReducedMotion,useScroll,useSpring,useTransform} from 'motion/react';
import {ArrowUp} from 'lucide-react';

export function MetricNumber({value}:{value:number}){
 const ref=useRef<HTMLSpanElement>(null);
 const visible=useInView(ref,{once:true});
 const reduced=useReducedMotion();
 const count=useMotionValue(value);
 const formatted=useTransform(count,n=>Math.round(n).toLocaleString('en-US'));
 useEffect(()=>{
  if(!visible||reduced||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const control=animate(count,[0,value],{duration:1.8,ease:[.16,1,.3,1]});
  return ()=>control.stop();
 },[visible,reduced,count,value]);
 return <span className="metric-number" ref={ref} aria-label={value.toLocaleString('en-US')}><motion.span aria-hidden="true">{formatted}</motion.span></span>;
}

export function ScrollDetails(){
 const {scrollYProgress,scrollY}=useScroll();
 const progress=useSpring(scrollYProgress,{stiffness:180,damping:30});
 const reduced=useReducedMotion();
 const [visible,setVisible]=useState(false);
 useMotionValueEvent(scrollY,'change',y=>setVisible(y>650));
 return <><motion.div className="reading-progress" style={{scaleX:progress}} aria-hidden="true"/><button className={`back-to-top ${visible?'visible':''}`} aria-label="Back to top" tabIndex={visible?0:-1} aria-hidden={!visible} onClick={()=>window.scrollTo({top:0,behavior:reduced?'instant':'smooth'})}><ArrowUp size={19}/></button></>;
}
