import {NextRequest,NextResponse} from 'next/server';
import {enquirySchema} from '@/lib/enquiry';
export const runtime='nodejs';
const requests=new Map<string,{count:number,reset:number}>();
export async function POST(req:NextRequest){
 const origin=req.headers.get('origin');if(origin&&new URL(origin).host!==req.headers.get('host'))return NextResponse.json({message:'Request origin not allowed.'},{status:403});
 if(Number(req.headers.get('content-length')||0)>16000)return NextResponse.json({message:'Request too large.'},{status:413});
 const ip=req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown';const now=Date.now();for(const [k,v] of requests)if(v.reset<now)requests.delete(k);
 const limit=requests.get(ip)||{count:0,reset:now+600000};if(limit.count>=5)return NextResponse.json({message:'Too many enquiries. Please try again later or call +971 6 568 6510.'},{status:429,headers:{'Retry-After':'600'}});limit.count++;requests.set(ip,limit);
 let data;try{const raw=await req.text();if(raw.length>16000)return NextResponse.json({message:'Request too large.'},{status:413});data=JSON.parse(raw);}catch{return NextResponse.json({message:'Invalid request.'},{status:400});}
 const parsed=enquirySchema.safeParse(data);if(!parsed.success)return NextResponse.json({message:'Please check your details and try again.'},{status:400});
 if(!process.env.RESEND_API_KEY||!process.env.ENQUIRY_FROM_EMAIL)return NextResponse.json({message:'Online delivery is not configured yet. Please email info@burjalaweer.com or call +971 6 568 6510 to send your requirement.'},{status:503});
 const d=parsed.data;try{const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:process.env.ENQUIRY_FROM_EMAIL,to:['info@burjalaweer.com'],reply_to:d.email,subject:'New manpower enquiry — Burj Al Aweer',text:Object.entries(d).filter(([k])=>k!=='website').map(([k,v])=>`${k}: ${v}`).join('\n') }),signal:AbortSignal.timeout(15000)});if(!response.ok)throw new Error('Provider rejected request');return NextResponse.json({message:'Your enquiry has been sent. Our team will be in touch to discuss your requirements.'});}catch{return NextResponse.json({message:'Your enquiry could not be delivered. Please email info@burjalaweer.com or call +971 6 568 6510.'},{status:502});}
}
