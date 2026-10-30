import type {Metadata} from 'next';
import localFont from 'next/font/local';
import {Header,Footer} from '@/components/site';
import './globals.css';
const heading=localFont({src:'../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2',variable:'--font-heading',display:'swap'});
const body=localFont({src:'../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',variable:'--font-body',display:'swap'});
export const metadata:Metadata={metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||'https://www.burjalaweer.com'),title:{default:'Burj Al Aweer | Manpower Solutions UAE',template:'%s | Burj Al Aweer'},description:'Dependable manpower solutions for construction, infrastructure and industrial projects across the UAE.',openGraph:{type:'website',siteName:'Burj Al Aweer Group of Companies',locale:'en_AE',images:[{url:'/images/hero.jpg',width:1600,height:1067,alt:'Construction workforce'}]}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" className={`${heading.variable} ${body.variable}`}><body><a className="skip-link" href="#main">Skip to content</a><Header/><main id="main">{children}</main><Footer/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'Organization',name:'Burj Al Aweer Group of Companies',url:'https://www.burjalaweer.com',logo:'https://www.burjalaweer.com/images/burj-al-aweer-logo.png',email:'info@burjalaweer.com',telephone:'065686510',areaServed:'United Arab Emirates'})}}/></body></html>}
