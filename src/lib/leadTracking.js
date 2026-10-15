export const ADS_TAG_ID = 'AW-16776236685';
export const ADS_CONVERSION = 'AW-16776236685/O--ECL_TpvIZEI2dxL8-';
export const CONSENT_KEY = 'mfc_ads_consent_v1';
let initialized = false;

export function readAdsConsent() {
  try { return localStorage.getItem(CONSENT_KEY); } catch { return null; }
}

function consent(value) {
  return { ad_storage: value, analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' };
}

export function enableAdsMeasurement() {
  if (readAdsConsent() !== 'granted') return;
  if (!initialized) {
    initialized = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', consent('denied'));
    window.gtag('consent', 'update', consent('granted'));
    window.gtag('js', new Date());
    window.gtag('config', ADS_TAG_ID, { allow_ad_personalization_signals: false });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ADS_TAG_ID}`;
    script.dataset.mfcAds = 'true';
    document.head.appendChild(script);
  } else {
    window.gtag('consent', 'update', consent('granted'));
  }
}

export function setAdsConsent(granted) {
  const value = granted ? 'granted' : 'denied';
  try { localStorage.setItem(CONSENT_KEY, value); } catch { return; }
  if (granted) enableAdsMeasurement();
  else if (window.gtag) window.gtag('consent', 'update', consent('denied'));
}

export function trackLeadConversion(service, submissionId) {
  if (readAdsConsent() !== 'granted' || !submissionId) return false;
  enableAdsMeasurement();
  window.gtag('event', 'conversion', {
    send_to: ADS_CONVERSION,
    transaction_id: submissionId,
    lead_service: service,
  });
  return true;
}
