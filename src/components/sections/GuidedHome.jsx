import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, MessageCircle, RotateCcw, ShieldCheck, Sprout, HeartPulse, FileText, Compass, LockKeyhole, Pencil, Download, ChevronRight, CheckCircle2 } from 'lucide-react';
import { journeys, getQuestions, suggestTopics, getGuidance, buildSummary } from '@/data/guidedJourney';
import './GuidedHome.css';

const icons = { pillar: Sprout, health: HeartPulse, taxes: FileText, arrival: Compass };
const descriptions = {
  pillar: 'Construire votre épargne, préparer votre retraite ou faire le point sur un contrat.',
  health: 'Comparer, comprendre vos garanties et faire le point sur votre couverture.',
  taxes: 'Préparer votre dossier et identifier les questions à examiner ensemble.',
  arrival: 'Y voir clair dans vos premières démarches de résident ou de frontalier.',
};
const hints = {
  goal: 'Un seul objectif pour commencer. Vous pourrez explorer les autres sujets ensuite.',
  residence: 'Votre lieu de résidence nous aide à vous orienter vers les démarches à examiner.',
  canton: 'Votre canton de résidence ou, si vous vivez à l’étranger, votre canton de travail.',
  status: 'Votre activité permet de préparer un échange adapté à votre situation.',
  contract: 'Si vous avez déjà un contrat, nous commencerons par faire le point sur l’existant.',
  coverage: 'Cela nous permet de distinguer une première démarche d’un bilan de votre couverture.',
  stage: 'Nous partons de votre avancement pour vous proposer une prochaine étape utile.',
  budget: 'Une fourchette indicative, sans engagement. Vous pouvez aussi la définir avec Christian.',
};
const goalDetails = {
  'Commencer à épargner': 'Définir un objectif et un rythme qui vous conviennent.',
  'Préparer ma retraite': 'Faire le point sur vos projets pour la suite.',
  'Comprendre les avantages fiscaux': 'Identifier les points à vérifier selon votre situation.',
  'Vérifier mon contrat actuel': 'Comprendre votre contrat avant d’envisager un changement.',
  'Comparer mes primes': 'Préparer les informations utiles à une comparaison.',
  'Revoir mes couvertures': 'Faire le point sur vos garanties et vos besoins.',
  'Première assurance en Suisse': 'Clarifier vos premières démarches.',
  'Préparer ma déclaration': 'Organiser votre dossier et les pièces utiles.',
  'Comprendre ma situation': 'Savoir par où commencer.',
  'Faire le point sur mes déductions': 'Préparer les justificatifs à examiner.',
  'Être accompagné dans mes démarches': 'Avancer avec un interlocuteur.',
};
const directContact = 'https://wa.me/41797896193?text=Bonjour%20Christian%2C%20j%27aimerais%20un%20conseil.';

export default function GuidedHome() {
  const [searchParams] = useSearchParams();
  const [topic, setTopic] = useState(() => journeys[searchParams.get('parcours')] ? searchParams.get('parcours') : null);
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const [pending, setPending] = useState('');
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState(null);
  const [share, setShare] = useState(false);
  const [downloadState, setDownloadState] = useState('');
  const section = useRef(null);
  const title = useRef(null);
  const questions = getQuestions(topic, answers);
  const done = Boolean(topic) && step >= questions.length;
  const current = questions[step];
  const journey = journeys[topic];
  const Icon = icons[topic] || Compass;
  const answered = questions.filter(q => answers[q.id]);
  const summary = topic ? buildSummary(topic, answers) : '';
  const message = `Bonjour Christian, j’aimerais ${topic === 'pillar' ? 'faire mon bilan 3ᵉ pilier' : `être accompagné : ${journey?.subtitle}`}.${share ? `\n\n${summary}` : ''}`;
  const whatsapp = `https://wa.me/41797896193?text=${encodeURIComponent(message)}`;

  useEffect(() => {
    setPending(current ? answers[current.id] || '' : '');
    if (topic) {
      title.current?.focus({ preventScroll: true });
      section.current?.scrollIntoView({ block: 'start', behavior: 'auto' });
    }
  }, [topic, step, current?.id, answers]);

  function start(key) {
    setTopic(key); setAnswers({}); setStep(0); setShare(false); setDownloadState('');
  }
  function reset() {
    setTopic(null); setAnswers({}); setStep(0); setPending(''); setShare(false); setDownloadState('');
    section.current?.scrollIntoView({ block: 'start', behavior: 'auto' });
  }
  function advance(value) {
    const prefix = Object.fromEntries(questions.slice(0, step).map(q => [q.id, answers[q.id]]));
    setAnswers({ ...prefix, [current.id]: value });
    setStep(step + 1); setShare(false); setDownloadState('');
  }
  function goTo(index) { setStep(index); setShare(false); setDownloadState(''); }
  async function downloadSummary() {
    setDownloadState('loading');
    try {
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF();
      const plain = value => value.replace(/ᵉ/g, 'e').replace(/[’‘]/g, "'").replace(/[–—]/g, '-').replace(/œ/g, 'oe');
      let y = 24;
      function add(text, size = 11) {
        pdf.setFontSize(size);
        const lines = pdf.splitTextToSize(plain(text), 170);
        for (const line of lines) {
          if (y > 275) { pdf.addPage(); y = 24; }
          pdf.text(line, 20, y); y += size * .5 + 2;
        }
        y += 4;
      }
      pdf.setTextColor(23, 43, 56);
      add('MON FIDELE CONSEILLER', 16); add('Votre feuille de route', 22);
      add(summary);
      getGuidance(topic, answers).forEach(([heading, text], index) => { add(`${index + 1}. ${heading}`, 13); add(text); });
      add('Premiere orientation a preciser avec un conseiller. Aucun tarif, economie ou droit fiscal n’est calcule.', 9);
      add('Christian : +41 79 789 61 93 | www.monfideleconseiller.ch', 10);
      pdf.save(`mon-fidele-conseiller-${topic}.pdf`);
      setDownloadState('done');
    } catch { setDownloadState('error'); }
  }
  const renderAnswers = () => <dl className="guide-answer-list">
    {questions.filter(q => answers[q.id]).map(q => <div key={q.id}>
      <dt>{q.label}</dt><dd><span>{answers[q.id]}</span><button type="button" onClick={() => goTo(questions.findIndex(item => item.id === q.id))} aria-label={`Modifier : ${q.label}`}><Pencil size={13} /></button></dd>
    </div>)}
  </dl>;

  return <section ref={section} className={`mfc-guide ${topic ? 'mfc-guide-active' : ''}`} id="mon-parcours" aria-label="Votre parcours personnalisé">
    <div className="guide-container">
      {!topic ? <>
        <div className="guide-welcome">
          <span className="guide-kicker"><span /> UN CONSEIL QUI PART DE VOUS</span>
          <h1>Votre situation.<br /><em>Votre prochaine étape.</em></h1>
          <p>Assurance maladie, 3ᵉ pilier, impôts ou arrivée en Suisse.<br className="guide-desktop-break" /> Faites le point, simplement, à votre rythme.</p>
          <div className="guide-trust"><span><Check size={14} /> Sans inscription</span><span><LockKeyhole size={14} /> Réponses non envoyées</span><span><MessageCircle size={14} /> Christian à vos côtés</span></div>
        </div>
        <div className="guide-start-heading"><h2>Qu’est-ce qui vous amène ?</h2><span>Choisissez votre point de départ</span></div>
        <div className="guide-topic-grid">{Object.entries(journeys).map(([key, item], index) => {
          const TopicIcon = icons[key];
          return <button type="button" key={key} onClick={() => start(key)} className={`guide-topic-card ${key === 'pillar' ? 'guide-topic-pillar' : ''}`}>
            <div className="guide-topic-top"><span className="guide-topic-icon"><TopicIcon size={25} strokeWidth={1.6} /></span><span className="guide-topic-index">0{index + 1}</span></div>
            <span className="guide-topic-label">{item.subtitle}</span><h3>{item.title}</h3><p>{descriptions[key]}</p>
            <span className="guide-topic-enter">Commencer mon parcours <ArrowRight size={17} /></span>
          </button>;
        })}</div>
        <form className="guide-search" onSubmit={e => { e.preventDefault(); setSuggestions(suggestTopics(query)); }}>
          <label htmlFor="guide-query">Vous préférez nous le dire avec vos mots ?</label>
          <div><input id="guide-query" value={query} onChange={e => { setQuery(e.target.value); setSuggestions(null); }} placeholder="Ex. : je voudrais préparer ma retraite…" maxLength={240} required /><button type="submit" aria-label="Trouver mon parcours"><ArrowRight size={20} /></button></div>
          <small>Quelques mots, sans données personnelles. Orientation par mots-clés.</small>
          {suggestions !== null && <div className="guide-suggestions" role="status"><p>{suggestions.length ? 'Choisissez le parcours que vous souhaitez explorer :' : 'Choisissez un thème ci-dessus, ou échangez directement avec Christian.'}</p>{suggestions.map(key => <button type="button" key={key} onClick={() => start(key)}>{journeys[key].subtitle} <ArrowRight size={14} /></button>)}</div>}
        </form>
        <a className="guide-direct" href={directContact} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} /> Je préfère parler directement à Christian <ArrowRight size={15} /></a>
      </> : <>
        <div className="guide-toolbar"><button type="button" onClick={reset}><ArrowLeft size={15} /> Tous les parcours</button><span><ShieldCheck size={15} /> Vos réponses restent dans cette page</span></div>
        <div className="guide-workspace">
          <aside className="guide-sidebar" aria-label="Récapitulatif de votre parcours">
            <span className="guide-sidebar-icon"><Icon size={28} strokeWidth={1.5} /></span>
            <span className="guide-kicker">VOTRE PARCOURS</span><h1>{journey.subtitle}</h1><p>{descriptions[topic]}</p>
            <ol className="guide-stages"><li className="is-complete"><Check size={13} /><span>Votre besoin</span></li><li className={done ? 'is-complete' : 'is-current'}>{done ? <Check size={13} /> : <span className="guide-stage-dot" />}<span>Votre situation</span></li><li className={done ? 'is-current' : ''}><span className="guide-stage-dot" /><span>Vos prochaines étapes</span></li></ol>
            <div className="guide-sidebar-summary"><span className="guide-kicker">VOTRE POINT DE DÉPART</span>{answered.length ? renderAnswers() : <p>Votre récapitulatif se construit au fil de vos réponses.</p>}</div>
            <a href={directContact} target="_blank" rel="noopener noreferrer" className="guide-adviser"><span className="guide-adviser-avatar">CK</span><span><strong>Christian, votre conseiller</strong><small>Une question ? Parlons-en.</small></span><ArrowRight size={15} /></a>
          </aside>
          <div className="guide-main">
            {!done ? <>
              <div className="guide-question-top"><button type="button" onClick={() => step ? goTo(step - 1) : reset()}><ArrowLeft size={16} /> Retour</button><span>{step === 0 ? 'Commençons par votre priorité' : `Question ${step + 1} sur ${questions.length}`}</span></div>
              <div className="guide-progress" role="progressbar" aria-label="Avancement du parcours" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={step}><span style={{ width: `${step / questions.length * 100}%` }} /></div>
              <form onSubmit={e => { e.preventDefault(); if (pending) advance(pending); }} key={`${topic}-${current.id}`} className="guide-question-form">
                <div className="guide-question-content">
                  <span className="guide-kicker">{current.id === 'goal' ? 'CE QUI COMPTE POUR VOUS' : 'APPRENONS À VOUS CONNAÎTRE'}</span>
                  <h2 ref={title} tabIndex={-1}>{current.label}</h2><p className="guide-question-hint" id="guide-question-hint">{hints[current.id]}</p>
                  <fieldset className={`guide-choices ${current.options.length <= 4 ? 'guide-choices-grid' : ''}`} aria-describedby="guide-question-hint"><legend className="sr-only">{current.label}</legend>
                    {current.options.map((option, index) => <label className={`guide-choice ${pending === option ? 'is-selected' : ''}`} key={option}>
                      <input type="radio" name={`guide-${current.id}`} value={option} checked={pending === option} onChange={() => setPending(option)} />
                      <span className="guide-choice-check">{pending === option && <Check size={13} strokeWidth={3} />}</span><span className="guide-choice-text"><strong>{option}</strong>{current.id === 'goal' && goalDetails[option] && <small>{goalDetails[option]}</small>}</span><span className="guide-choice-number">{String(index + 1).padStart(2, '0')}</span>
                    </label>)}
                  </fieldset>
                  <details className="guide-mobile-recap"><summary>Voir mes réponses {answered.length > 0 && `(${answered.length})`}</summary>{answered.length ? renderAnswers() : <p>Votre récapitulatif se construit au fil de vos réponses.</p>}</details>
                </div>
                <div className="guide-question-footer"><button className="guide-skip" type="button" onClick={() => advance(undefined)}>Je préfère en parler avec Christian</button><button className="guide-primary" type="submit" disabled={!pending}>{step === questions.length - 1 ? 'Voir mes prochaines étapes' : 'Continuer'} <ArrowRight size={18} /></button></div>
              </form>
            </> : <div className="guide-result">
              <span className="guide-result-check"><CheckCircle2 size={30} strokeWidth={1.6} /></span><span className="guide-kicker">VOUS AVEZ FAIT LE PREMIER PAS</span>
              <h2 ref={title} tabIndex={-1}>{topic === 'pillar' ? 'Donnons une direction à votre avenir.' : 'Votre prochaine étape se précise.'}</h2><p className="guide-question-hint">Voici votre feuille de route, à partir de vos réponses. Nous pourrons la préciser ensemble.</p>
              <details className="guide-result-summary"><summary>Votre situation en un coup d’œil <span>Voir / modifier</span></summary>{renderAnswers()}{!answered.length && <p>Vous avez choisi de préciser votre situation directement avec Christian.</p>}</details>
              <ol className="guide-roadmap">{getGuidance(topic, answers).map(([heading, text], index) => <li key={heading}><span>0{index + 1}</span><div><h3>{heading}</h3><p>{text}</p></div></li>)}</ol>
              <div className="guide-next-action"><span className="guide-kicker">ET MAINTENANT ?</span><h3>Faisons le point ensemble.</h3><p>Vos objectifs, vos questions, votre rythme. Christian reprend le fil avec vous.</p><label className="guide-share"><input type="checkbox" checked={share} onChange={e => setShare(e.target.checked)} /><span>Joindre mes réponses au message WhatsApp destiné à Christian</span></label><a className="guide-primary" href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /> {journey.cta} <ArrowRight size={17} /></a></div>
              <div className="guide-result-actions"><button type="button" onClick={downloadSummary} disabled={downloadState === 'loading'}><Download size={15} /> {downloadState === 'loading' ? 'Préparation…' : 'Garder ma feuille de route (PDF)'}</button><Link to={journey.link}>{journey.linkLabel} <ChevronRight size={15} /></Link></div>
              <p className="guide-download-status" role="status">{downloadState === 'error' ? 'Le téléchargement n’a pas abouti. Vous pouvez consulter votre récapitulatif ci-dessus.' : downloadState === 'done' ? 'Votre feuille de route est prête dans vos téléchargements.' : ''}</p>
              <p className="guide-notice">Première orientation à préciser avec un conseiller. Aucun tarif, économie ou droit fiscal n’est calculé par ce parcours.</p>
              {topic === 'arrival' && <div className="guide-suggestions"><p>Un sujet à approfondir ?</p><button type="button" onClick={() => start('pillar')}>Mon 3ᵉ pilier <ArrowRight size={14} /></button><button type="button" onClick={() => start('taxes')}>Mes impôts <ArrowRight size={14} /></button></div>}
              <button type="button" className="guide-restart" onClick={reset}><RotateCcw size={14} /> Explorer un autre besoin</button>
            </div>}
          </div>
        </div>
      </>}
    </div>
  </section>;
}
