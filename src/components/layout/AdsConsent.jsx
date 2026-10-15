import React, { useEffect, useState } from 'react';
import { enableAdsMeasurement, readAdsConsent, setAdsConsent } from '@/lib/leadTracking';

export default function AdsConsent() {
  const [open, setOpen] = useState(() => readAdsConsent() === null);
  useEffect(() => { enableAdsMeasurement(); }, []);
  function choose(granted) { setAdsConsent(granted); setOpen(false); }
  return <>
    {open && <section role="region" aria-label="Choix de mesure publicitaire" className="mfc-consent">
      <div><strong>Mesure des annonces Google</strong><p>Avec votre accord, nous utilisons une balise Google Ads pour mesurer les visites et les demandes issues de nos annonces. Vos nom, email, téléphone et commentaire ne sont pas envoyés à Google par ce formulaire. Vous pouvez refuser et utiliser le formulaire.</p></div>
      <div className="mfc-consent-actions"><button type="button" onClick={() => choose(false)}>Refuser</button><button type="button" onClick={() => choose(true)}>Accepter</button></div>
    </section>}
    {!open && <button type="button" className="mfc-consent-settings" onClick={() => setOpen(true)}>Mesure publicitaire</button>}
  </>;
}
