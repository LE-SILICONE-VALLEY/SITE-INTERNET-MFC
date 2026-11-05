import { readAdsConsent, enableAdsMeasurement } from './leadTracking.js';
const EVENTS = new Set(['journey_start','journey_step','journey_complete','results_view','contact_open','contact_success','whatsapp_click']);
// Never send search queries, answers, prices or contact information to advertising platforms.
export function trackFunnel(event, step) {
  if (!EVENTS.has(event) || readAdsConsent() !== 'granted') return;
  enableAdsMeasurement();
  window.gtag?.('event', event, { funnel: 'mfc_2026', ...(Number.isInteger(step) ? { funnel_step: step } : {}) });
}
export function campaignSource() {
  if (readAdsConsent() !== 'granted') { try { sessionStorage.removeItem('mfc_campaign_source'); } catch {} return 'Non mesurée'; }
  const source = new URLSearchParams(window.location.search).get('utm_source');
  const allowed = ['google','bing','facebook','instagram','linkedin','newsletter'];
  try {
    if (allowed.includes(source?.toLowerCase())) sessionStorage.setItem('mfc_campaign_source', source.toLowerCase());
    const stored = sessionStorage.getItem('mfc_campaign_source');
    return allowed.includes(stored) ? stored : 'Direct / autre';
  } catch { return 'Direct / autre'; }
}
