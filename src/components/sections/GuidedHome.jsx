import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, MessageCircle, RotateCcw, ShieldCheck } from 'lucide-react';
import { journeys, getQuestions, suggestTopics, getGuidance, buildSummary } from '@/data/guidedJourney';
import './GuidedHome.css';

export default function GuidedHome() {
  const [topic, setTopic] = useState(null);
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState(null);
  const [share, setShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const title = useRef(null);
  const panel = useRef(null);
  const questions = getQuestions(topic, answers);
  const done = !!topic && step >= questions.length;
  const current = questions[step];
  const journey = journeys[topic];
  useEffect(() => { if (topic) title.current?.focus({ preventScroll: true }); }, [topic, step]);
  const start = key => {
    setTopic(key); setAnswers({}); setStep(0); setShare(false); setCopied(false);
    panel.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  };
  const answer = value => { setAnswers(previous => ({ ...Object.fromEntries(questions.slice(0, step).map(q => [q.id, previous[q.id]])), [current.id]: value })); setStep(step + 1); setShare(false); setCopied(false); };
  const back = () => { if (step) setStep(step - 1); else setTopic(null); setShare(false); setCopied(false); };
  const reset = () => { setTopic(null); setAnswers({}); setStep(0); setShare(false); setCopied(false); };
  const summary = topic ? buildSummary(topic, answers) : '';
  const message = `Bonjour Christian, j’aimerais ${topic === 'pillar' ? 'faire mon bilan 3ᵉ pilier' : `être accompagné : ${journey?.subtitle}`}.${share ? `\n\n${summary}` : ''}`;
  const whatsapp = `https://wa.me/41797896193?text=${encodeURIComponent(message)}`;
  const search = e => { e.preventDefault(); setSuggestions(suggestTopics(query)); };
  return (
    <section className="mfc-guide" id="mon-parcours" aria-label="Votre parcours personnalisé">
      <div className="mfc-guide-inner">
        <div className="mfc-guide-intro">
          <span className="mfc-guide-eyebrow"><span /> VOTRE CONSEILLER À GENÈVE & VAUD</span>
          <h1>Votre situation.<br /><span>Votre prochaine étape.</span></h1>
          <p>Assurance maladie, 3ᵉ pilier, impôts ou arrivée en Suisse : partons de vous pour y voir plus clair.</p>
          <div className="mfc-guide-assurance"><ShieldCheck size={18} /> Sans inscription · Vos réponses restent dans cette page</div>
        </div>
        <div className="mfc-guide-panel" ref={panel}>
          {!topic ? <>
            <div className="mfc-guide-panel-heading"><span className="mfc-guide-number">01</span><span>COMMENÇONS PAR VOUS</span></div>
            <h2>De quoi avez-vous besoin aujourd’hui ?</h2>
            <p className="mfc-guide-muted">Choisissez votre priorité. Nous vous guidons, une question à la fois.</p>
            <div className="mfc-guide-topics">{Object.entries(journeys).map(([key, item]) => <button key={key} onClick={() => start(key)} className={`mfc-guide-topic ${key === 'pillar' ? 'mfc-guide-featured' : ''}`}>
              <span className="mfc-guide-icon" aria-hidden="true">{item.icon}</span><span><strong>{item.title}</strong><small>{item.subtitle}</small></span><ArrowRight size={19} aria-hidden="true" />
            </button>)}</div>
            <form onSubmit={search} className="mfc-guide-search">
              <label htmlFor="guide-query">Vous préférez décrire votre besoin ?</label>
              <div><input id="guide-query" value={query} onChange={e => { setQuery(e.target.value); setSuggestions(null); }} placeholder="Ex. : comprendre mon 3ᵉ pilier" maxLength={240} required /><button aria-label="Trouver un parcours" type="submit"><ArrowRight size={20} /></button></div>
              <small>Quelques mots suffisent, sans données personnelles. Orientation par mots-clés.</small>
            </form>
            {suggestions !== null && <div className="mfc-guide-suggestions" role="status"><p>{suggestions.length ? 'Voici les parcours à explorer. Lequel souhaitez-vous ouvrir ?' : 'Je n’ai pas identifié de parcours. Choisissez un thème ci-dessus ou posez votre question à Christian.'}</p>{suggestions.map(key => <button key={key} onClick={() => start(key)}>{journeys[key].subtitle} <ArrowRight size={16} /></button>)}</div>}
            <a className="mfc-guide-direct" href="https://wa.me/41797896193?text=Bonjour%20Christian%2C%20j%27aimerais%20un%20conseil." target="_blank" rel="noopener noreferrer"><MessageCircle size={17} /> Je préfère parler directement à Christian <ArrowRight size={15} /></a>
          </> : <>
            <div className="mfc-guide-stepbar"><button onClick={back}><ArrowLeft size={16} /> Retour</button><span>{done ? 'Votre feuille de route' : `${journey.subtitle} · ${step + 1}/${questions.length}`}</span></div>
            <div className="mfc-guide-progress" role="progressbar" aria-label="Avancement du parcours" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={Math.min(step, questions.length)}><span style={{ width: `${done ? 100 : (step / questions.length) * 100}%` }} /></div>
            {!done ? <div className="mfc-guide-question" key={current.id}>
              <span className="mfc-guide-eyebrow">VOTRE PARCOURS, À VOTRE RYTHME</span>
              <h2 ref={title} tabIndex={-1}>{current.label}</h2>
              {current.hint && <p className="mfc-guide-muted">{current.hint}</p>}
              <div className="mfc-guide-options">{current.options.map(option => <button key={option} onClick={() => answer(option)} aria-pressed={answers[current.id] === option}><span>{option}</span>{answers[current.id] === option ? <Check size={18} /> : <ArrowRight size={18} />}</button>)}</div>
              <button className="mfc-guide-skip" onClick={() => answer(undefined)}>Passer cette question</button>
            </div> : <div className="mfc-guide-result">
              <span className="mfc-guide-eyebrow">VOTRE POINT DE DÉPART</span>
              <h2 ref={title} tabIndex={-1}>{topic === 'pillar' ? 'Votre avenir commence par un bilan.' : 'Voici les prochaines étapes à explorer.'}</h2>
              <p className="mfc-guide-muted">Une première orientation à préciser ensemble, sans engagement.</p>
              <details className="mfc-guide-summary"><summary>Ce que nous avons compris · Voir ou corriger</summary>{questions.map((q, index) => <div key={q.id}><span>{q.label}<strong>{answers[q.id] || 'Non précisé'}</strong></span><button onClick={() => { setStep(index); setShare(false); setCopied(false); }} aria-label={`Modifier : ${q.label}`}>Modifier</button></div>)}</details>
              <ol className="mfc-guide-plan">{getGuidance(topic, answers).map(([heading, text], i) => <li key={heading}><span>{String(i + 1).padStart(2, '0')}</span><div><h3>{heading}</h3><p>{text}</p></div></li>)}</ol>
              <p className="mfc-guide-notice">Ce parcours ne calcule ni tarif, ni économie, ni droit fiscal. Les points proposés sont à examiner avec un conseiller.</p>
              <label className="mfc-guide-share"><input type="checkbox" checked={share} onChange={e => setShare(e.target.checked)} /> Joindre mes réponses au message WhatsApp destiné à Christian</label>
              <a className="mfc-guide-cta" href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={20} /> {journey.cta} <ArrowRight size={18} /></a>
              <div className="mfc-guide-result-links"><Link to={topic === 'health' && answers.goal === 'Me renseigner sur les subsides' ? '/aide-subside' : journey.link}>{topic === 'health' && answers.goal === 'Me renseigner sur les subsides' ? 'Découvrir l’aide aux subsides' : journey.linkLabel} →</Link><button onClick={async () => { try { await navigator.clipboard.writeText(summary); setCopied(true); } catch { setCopied('error'); } }}>{copied === true ? 'Récapitulatif copié' : 'Copier mon récapitulatif'}</button></div>
              {copied === 'error' && <p role="status">La copie n’est pas disponible. Retrouvez vos réponses dans « Ce que nous avons compris ».</p>}
              {topic === 'arrival' && <div className="mfc-guide-suggestions"><p>Vous souhaitez approfondir un sujet ?</p><button onClick={() => start('pillar')}>Mon 3ᵉ pilier <ArrowRight size={16} /></button><button onClick={() => start('taxes')}>Mes impôts <ArrowRight size={16} /></button></div>}
            </div>}
            <button className="mfc-guide-reset" onClick={reset}><RotateCcw size={14} /> Changer de besoin</button>
          </>}
        </div>
        <div className="mfc-guide-bottom"><span>Un parcours clair.</span><span>Des informations qui vous concernent.</span><span>Un conseiller à vos côtés.</span></div>
      </div>
    </section>
  );
}
