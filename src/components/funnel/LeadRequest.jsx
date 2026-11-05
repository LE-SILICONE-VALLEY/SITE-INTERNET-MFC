import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { trackLeadConversion } from '@/lib/leadTracking';
import { campaignSource, trackFunnel } from '@/lib/funnel';

export default function LeadRequest({ service = 'Bilan personnalisé', summary = '', title = 'Avançons ensemble.', compact = false }) {
  const [form, setForm] = useState({firstName:'',lastName:'',email:'',phone:'',channel:'email',timing:'À définir ensemble',consent:false,marketing:false,website:''});
  const [status,setStatus]=useState('idle'); const busy=useRef(false); const opened=useRef(false);
  function update(e){const {name,type,checked,value}=e.target;setForm(f=>({...f,[name]:type==='checkbox'?checked:value}));}
  async function submit(e){
    e.preventDefault();if(busy.current||form.website||!form.consent)return;
    busy.current=true;setStatus('sending');
    try{
      const payload={firstName:form.firstName.trim(),lastName:form.lastName.trim(),email:form.email.trim(),phone:form.phone.trim(),insuranceType:service,service:'premium-journey',consent:true,marketingConsent:form.marketing,consentVersion:'mfc-2026-11-05',website:'',message:[`Demande : ${service}`,`Canal souhaité : ${form.channel==='phone'?'Téléphone':'Email'}`,`Téléphone : ${form.phone.trim()||'Non communiqué'}`,`Échéance : ${form.timing}`,`Origine : ${campaignSource()}`,`Page : ${window.location.pathname}`,`\nRécapitulatif communiqué volontairement :\n${summary||'Échange général'}`,`\nAccord de contact : oui (${new Date().toISOString()})`,`Actualités et offres : ${form.marketing?'OUI, consentement distinct':'NON'}`].join('\n')};
      const {data,error}=await supabase.functions.invoke('send-contact-email',{body:JSON.stringify(payload)});
      if(error||data?.error||data?.success===false||!data)throw new Error('unconfirmed');
      setStatus('sent');trackFunnel('contact_success');
      trackLeadConversion('premium-journey',data.id||crypto.randomUUID());
    }catch{setStatus('error');}finally{busy.current=false;}
  }
  if(status==='sent')return <div className="mfc-lead-success" role="status"><CheckCircle2 size={34}/><h3>Votre demande est transmise.</h3><p>Christian dispose de votre récapitulatif pour préparer votre échange. Vous serez recontacté par le canal souhaité.</p><a href="tel:+41797896193">Besoin d’en parler maintenant ? +41 79 789 61 93</a></div>;
  return <div className={`mfc-lead ${compact?'mfc-lead-compact':''}`}><span className="premium-eyebrow">VOTRE PROCHAINE ÉTAPE</span><h3>{title}</h3><p>Un interlocuteur, votre situation, une prochaine étape concrète. Sans engagement.</p>
    <form onSubmit={submit} onFocus={()=>{if(!opened.current){opened.current=true;trackFunnel('contact_open');}}}><fieldset disabled={status==='sending'}>
      <div className="premium-fields"><label>Prénom<input name="firstName" value={form.firstName} onChange={update} autoComplete="given-name" maxLength={80} required/></label><label>Nom<input name="lastName" value={form.lastName} onChange={update} autoComplete="family-name" maxLength={80} required/></label></div>
      <label>Email<input name="email" type="email" value={form.email} onChange={update} autoComplete="email" maxLength={200} required/></label>
      <div className="premium-fields"><label>Je préfère un échange par<select name="channel" value={form.channel} onChange={update}><option value="email">Email</option><option value="phone">Téléphone</option></select></label><label>Quand souhaitez-vous avancer ?<select name="timing" value={form.timing} onChange={update}><option>À définir ensemble</option><option>Dès que possible</option><option>Ce mois-ci</option><option>Dans les prochains mois</option></select></label></div>
      <label>Téléphone {form.channel==='phone'?'':'(facultatif)'}<input name="phone" type="tel" value={form.phone} onChange={update} autoComplete="tel" minLength={6} maxLength={30} required={form.channel==='phone'}/></label>
      <div className="premium-trap" aria-hidden="true"><label>Site web<input name="website" value={form.website} onChange={update} tabIndex={-1} autoComplete="off"/></label></div>
      <label className="premium-check"><input name="consent" type="checkbox" checked={form.consent} onChange={update} required/><span>Je demande à être recontacté au sujet de ce bilan et à transmettre mes coordonnées et le récapitulatif affiché à Mon Fidèle Conseiller.</span></label>
      <label className="premium-check"><input name="marketing" type="checkbox" checked={form.marketing} onChange={update}/><span>Je souhaite aussi recevoir par email des conseils et des offres de Mon Fidèle Conseiller. Facultatif, retrait possible à tout moment.</span></label>
      <p className="premium-fine">Vos informations servent à traiter votre demande via notre service de contact Supabase. <Link to="/confidentialite">Utilisation de vos données</Link>.</p>
      {status==='error'&&<p className="premium-error" role="alert">L’envoi n’a pas pu être confirmé. Réessayez ou appelez le <a href="tel:+41797896193">+41 79 789 61 93</a>.</p>}
      <button className="premium-button" type="submit">{status==='sending'?<><Loader2 className="animate-spin" size={18}/> Envoi en cours…</>:<>Demander mon bilan <ArrowRight size={18}/></>}</button>
    </fieldset></form>
  </div>;
}
