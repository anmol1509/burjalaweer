import type {MetadataRoute} from 'next';
export default function sitemap():MetadataRoute.Sitemap{const base=process.env.NEXT_PUBLIC_SITE_URL||'https://www.burjalaweer.com';return ['','about','services','workforce','industries','clients','contact'].map(p=>({url:`${base}/${p}`,changeFrequency:'monthly',priority:p?0.7:1}));}
