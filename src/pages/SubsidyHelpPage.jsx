import React, { useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import './SubsidyHelpPage.css';

const PHONE = '+41797896193';
const initialForm = { firstName: '', lastName: '', email: '', phone: '', canton: '', need: '', consent: false, website: '' };

export default function SubsidyHelpPage() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle');
  const submitting = useRef(false);
  const update = (event) => {
    const { name, value, checked, type } = event.target;
    setForm((previous) => ({ ...previous, [name]: type === 'checkbox' ? checked : value }));
  };

  async function submit(event) {
    event.preventDefault();
    if (submitting.current || form.website || !form.consent) return;
    submitting.current = true;
    setStatus('sending');
    try {
      // Preserve the existing contact function's payload contract.
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          insuranceType: 'Accompagnement gratuit aux subsides',
          message: [
            'Demande d’accompagnement gratuit aux subsides — /aide-subside',
            `Téléphone : ${form.phone.trim()}`,
            `Canton : ${form.canton}`,
            `Besoin : ${form.need}`,
            'La personne demande à être recontactée pour cet accompagnement.',
          ].join('\n'),
        }),
      });
      if (error || data?.error || data?.success === false) throw new Error('Delivery failed');
      setStatus('sent');
      setForm(initialForm);
      // No advertising conversion is fired until its tag and consent are configured.
    } catch {
      setStatus('error');
    } finally {
      submitting.current = false;
    }
  }

  return (
    <div className="subsidy-page">
      <Helmet>
        <title>Aide gratuite aux subsides Genève & Vaud | Mon Fidèle Conseiller</title>
        <meta name="description" content="Accompagnement administratif gratuit pour préparer votre demande de subside à Genève et Vaud. Plus de 300 personnes accompagnées en 2026." />
        <link rel="canonical" href="https://www.monfideleconseiller.ch/aide-subside" />
        <meta property="og:title" content="Votre demande de subside, avec un accompagnement gratuit" />
        <meta property="og:description" content="Genève & Vaud : nous vous aidons à préparer votre dossier. La décision appartient à l’autorité cantonale." />
        <meta property="og:url" content="https://www.monfideleconseiller.ch/aide-subside" />
      </Helmet>
      <div className="subsidy-wrap">
        <section className="subsidy-hero" aria-labelledby="subsidy-title">
          <div>
            <p className="subsidy-eyebrow">Genève & Vaud · Accompagnement gratuit</p>
            <h1 id="subsidy-title">Votre demande de subside,<br /><span>avec de l’aide à chaque étape.</span></h1>
            <p className="subsidy-intro">Les démarches vous semblent compliquées ? Nous vous aidons gratuitement à préparer votre dossier de subside d’assurance maladie.</p>
            <div className="subsidy-proof"><strong>Plus de 300 personnes</strong><span>accompagnées pour obtenir leur subside en 2026.</span></div>
            <div className="subsidy-actions"><a className="subsidy-button" href="#demande-subside">Être aidé gratuitement</a><a className="subsidy-button subsidy-secondary" href={`tel:${PHONE}`}>Appeler un conseiller</a></div>
            <p className="subsidy-fine">Service privé d’accompagnement, distinct de l’administration. Seule l’autorité cantonale décide de l’octroi et du montant du subside.</p>
          </div>
          <div className="subsidy-form-panel" id="demande-subside">
            {status === 'sent' ? <div role="status" className="subsidy-confirmation"><span className="subsidy-eyebrow">Demande envoyée</span><h2>Merci pour votre confiance.</h2><p>Votre demande d’accompagnement a été transmise. Un conseiller vous recontactera au sujet de vos démarches.</p><p className="subsidy-fine">Cette demande de contact ne constitue pas un dépôt de dossier auprès du canton.</p><a className="subsidy-button subsidy-secondary" href={`tel:${PHONE}`}>Nous appeler</a></div> : <>
              <p className="subsidy-eyebrow">Faisons le premier pas ensemble</p><h2>Demandez votre aide gratuite.</h2><p className="subsidy-form-intro">Sans compte à créer. Aucun justificatif à joindre.</p>
              <form onSubmit={submit}>
                <fieldset disabled={status === 'sending'}>
                  <div className="subsidy-field-row"><label>Prénom<input name="firstName" value={form.firstName} onChange={update} autoComplete="given-name" required maxLength={80} /></label><label>Nom<input name="lastName" value={form.lastName} onChange={update} autoComplete="family-name" required maxLength={80} /></label></div>
                  <label>Email<input name="email" type="email" value={form.email} onChange={update} autoComplete="email" required maxLength={200} /></label>
                  <label>Téléphone<input name="phone" type="tel" value={form.phone} onChange={update} autoComplete="tel" required minLength={6} maxLength={30} /></label>
                  <div className="subsidy-field-row"><label>Canton<select name="canton" value={form.canton} onChange={update} required><option value="">Choisir</option><option>Genève</option><option>Vaud</option></select></label><label>Votre besoin<select name="need" value={form.need} onChange={update} required><option value="">Choisir</option><option>Première demande</option><option>Renouvellement</option><option>Dossier en cours</option><option>Comprendre les démarches</option></select></label></div>
                  <div className="subsidy-trap" aria-hidden="true"><label>Site internet<input name="website" value={form.website} onChange={update} tabIndex={-1} autoComplete="off" /></label></div>
                  <label className="subsidy-consent"><input name="consent" type="checkbox" checked={form.consent} onChange={update} required /><span>Je souhaite être recontacté par Mon Fidèle Conseiller pour mon accompagnement gratuit aux subsides.</span></label>
                  <p className="subsidy-fine">Vos coordonnées et votre demande sont transmises à Mon Fidèle Conseiller via son service de contact Supabase pour traiter votre demande de rappel. N’indiquez aucune donnée fiscale, médicale ou pièce d’identité. Pour vos questions sur vos données : <a href="mailto:contact@monfideleconseiller.ch">contact@monfideleconseiller.ch</a>.</p>
                  {status === 'error' && <p role="alert" className="subsidy-error">L’envoi n’a pas pu être confirmé. Vous pouvez réessayer ou nous appeler au <a href={`tel:${PHONE}`}>+41 79 789 61 93</a>.</p>}
                  <button className="subsidy-button" type="submit">{status === 'sending' ? 'Envoi en cours…' : 'Demander mon accompagnement gratuit'}</button>
                </fieldset>
              </form>
            </>}
          </div>
        </section>
        <section className="subsidy-section"><p className="subsidy-eyebrow">Comment ça se passe ?</p><h2>Un dossier préparé, un parcours plus clair.</h2><div className="subsidy-steps"><div><span>01 — Échanger</span><h3>Nous faisons le point</h3><p>Vous nous expliquez où vous en êtes et les démarches pour lesquelles vous souhaitez être aidé.</p></div><div><span>02 — Préparer</span><h3>Nous vous guidons</h3><p>Nous vous aidons à comprendre les démarches et à préparer les pièces utiles à votre dossier.</p></div><div><span>03 — Faire examiner</span><h3>Le canton décide</h3><p>L’autorité compétente examine votre dossier selon ses critères et ses délais.</p></div></div></section>
        <section className="subsidy-authority"><h2>Une aide gratuite. Un rôle clair.</h2><p>Notre accompagnement administratif aux subsides est gratuit. Nous sommes un service privé, distinct de l’administration cantonale. Nous ne décidons ni de votre droit au subside, ni de son montant, et ne garantissons pas son attribution.</p></section>
        <section className="subsidy-section subsidy-faq"><h2>Vos questions, simplement.</h2><details><summary>L’accompagnement est-il vraiment gratuit ?</summary><p>Oui, notre accompagnement administratif pour votre demande de subside est gratuit.</p></details><details><summary>Est-ce vous qui accordez le subside ?</summary><p>Non. Seule l’autorité cantonale compétente décide de l’octroi et du montant après examen de votre dossier.</p></details><details><summary>Faut-il créer un compte ?</summary><p>Non. Le formulaire de contact est accessible sans compte. Vous pouvez aussi nous appeler directement.</p></details><details><summary>Le formulaire dépose-t-il ma demande au canton ?</summary><p>Non. Il permet de demander à être recontacté pour un accompagnement. Il ne remplace pas les démarches officielles auprès de l’autorité compétente.</p></details><details><summary>Pouvez-vous garantir l’obtention d’un subside ?</summary><p>Non. L’issue dépend de l’examen de votre situation par l’autorité cantonale.</p></details></section>
      </div>
      <div className="subsidy-mobile-cta"><a className="subsidy-button" href="#demande-subside">Être aidé gratuitement</a></div>
    </div>
  );
}
