const question = (id, label, options, hint) => ({ id, label, options, hint });
export const journeys = {
  pillar: { title: 'Préparer mon avenir', subtitle: '3ᵉ pilier & prévoyance', icon: '🌱', cta: 'Faire mon bilan 3ᵉ pilier', link: '/assurances/particulier/3eme-pilier', linkLabel: 'Comprendre le 3ᵉ pilier', goals: ['Commencer à épargner', 'Préparer ma retraite', 'Comprendre les avantages fiscaux', 'Vérifier mon contrat actuel'] },
  health: { title: 'Faire le point sur ma LAMal', subtitle: 'Assurance maladie', icon: '♡', cta: 'Faire le point sur ma LAMal', link: '/comparaison-lamal', linkLabel: 'Accéder au parcours LAMal', goals: ['Comparer mes primes', 'Revoir mes couvertures', 'Première assurance en Suisse', 'Vérifier mon contrat actuel'] },
  taxes: { title: 'M’occuper de mes impôts', subtitle: 'Déclaration & accompagnement', icon: '▤', cta: 'Parler de mes impôts', link: '/declaration-impots', linkLabel: 'Voir l’accompagnement fiscal', goals: ['Préparer ma déclaration', 'Comprendre ma situation', 'Faire le point sur mes déductions', 'Être accompagné dans mes démarches'] },
  arrival: { title: 'Je commence à travailler en Suisse', subtitle: 'Résident ou frontalier', icon: '🇨🇭', cta: 'Préparer mon arrivée avec Christian', link: '/assurances/particulier/assurance-maladie', linkLabel: 'Découvrir l’assurance maladie', goals: ['Avoir une vue d’ensemble', 'Comprendre mon assurance maladie', 'Comprendre mes impôts', 'Préparer mon épargne'] },
};
export const residence = question('residence', 'Où habitez-vous ?', ['En Suisse', 'En France', 'Dans un autre pays', 'Je prépare mon déménagement']);
export function getQuestions(topic, answers = {}) {
  const journey = journeys[topic];
  if (!journey) return [];
  const questions = [question('goal', 'Quelle est votre priorité ?', journey.goals), residence,
    question('canton', 'Quel canton est concerné ?', ['Genève', 'Vaud', 'Un autre canton', 'Je ne sais pas encore'], 'Votre canton de résidence ou, si vous vivez à l’étranger, celui où vous travaillez.')];
  if (topic === 'pillar') {
    questions.push(question('status', 'Quelle est votre situation professionnelle ?', ['Salarié', 'Indépendant', 'Autre situation']));
    if (answers.goal !== 'Vérifier mon contrat actuel') questions.push(question('contract', 'Avez-vous déjà un 3ᵉ pilier ?', ['Oui', 'Non', 'Je ne sais pas']));
    if (answers.goal === 'Commencer à épargner' || answers.goal === 'Préparer ma retraite') questions.push(question('budget', 'Quel budget mensuel souhaitez-vous envisager ?', ['Moins de 100 CHF', '100 à 250 CHF', '250 à 500 CHF', 'Plus de 500 CHF', 'À définir ensemble'], 'Une simple indication, sans engagement.'));
  } else if (topic === 'health') {
    questions.push(question('coverage', 'Avez-vous déjà une assurance maladie suisse ?', ['Oui', 'Non', 'Je ne sais pas']));
  } else if (topic === 'taxes') {
    questions.push(question('status', 'Quelle est votre situation professionnelle ?', ['Salarié', 'Indépendant', 'Retraité', 'Autre situation']));
    questions.push(question('stage', 'Où en êtes-vous ?', ['Je prépare ma première déclaration', 'J’ai déjà fait une déclaration', 'J’ai reçu un courrier à comprendre', 'Je ne sais pas par où commencer']));
  } else {
    questions.push(question('stage', 'Où en est votre projet ?', ['Je cherche un emploi', 'Je commence prochainement', 'Je travaille déjà en Suisse']));
  }
  return questions;
}
export function suggestTopics(text) {
  const value = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const topics = [];
  if (/pilier|retraite|epargn|prevoyance/.test(value)) topics.push('pillar');
  if (/lamal|maladie|prime|sante|subside/.test(value)) topics.push('health');
  if (/impot|fisc|declaration|deduction/.test(value)) topics.push('taxes');
  if (/arriv|commenc|frontalier|demenag|emploi|travaill/.test(value)) topics.push('arrival');
  return [...new Set(topics)];
}
export function getGuidance(topic, a) {
  const items = [];
  if (topic === 'pillar') {
    if (a.goal === 'Vérifier mon contrat actuel' || a.contract === 'Oui') items.push(['Examiner votre contrat existant', 'Faire le point sur les frais, les garanties, la souplesse des versements et les conditions de sortie avant d’envisager un changement.']);
    else items.push(['Poser les bases de votre projet', 'Clarifier votre horizon, votre besoin de disponibilité de l’épargne et le niveau de risque que vous êtes prêt à accepter.']);
    items.push(['Vérifier votre situation fiscale', a.residence === 'En France' ? 'Votre résidence en France demande une analyse de votre situation de frontalier avant de conclure à un avantage fiscal.' : 'Votre statut professionnel et le canton concerné permettront de préciser les points fiscaux à vérifier avec un conseiller.']);
    items.push(['Définir un effort d’épargne adapté', a.budget && a.budget !== 'À définir ensemble' ? `Vous avez indiqué « ${a.budget} ». Ce repère servira à discuter d’un budget compatible avec vos autres projets.` : 'Définir ensemble un budget régulier, compatible avec vos charges et vos autres projets.']);
  } else if (topic === 'health') {
    items.push([a.coverage === 'Non' ? 'Clarifier votre première couverture' : 'Faire le point sur votre couverture', 'Examiner votre situation de résidence et d’activité, puis les démarches qui vous concernent.']);
    items.push(['Préparer la comparaison', 'Rassembler votre police actuelle et préciser vos attentes avant de comparer les primes et les modèles disponibles.']);
    items.push(['Choisir votre prochaine démarche', 'Accéder au parcours LAMal ou échanger avec Christian pour clarifier les points qui restent ouverts.']);
  } else if (topic === 'taxes') {
    items.push(['Clarifier votre dossier fiscal', `Faire le point sur votre situation${a.canton ? ` et le canton indiqué : ${a.canton}` : ''}, avant de déterminer les démarches adaptées.`]);
    items.push([a.stage === 'J’ai reçu un courrier à comprendre' ? 'Examiner le courrier reçu' : 'Préparer les pièces utiles', a.stage === 'J’ai reçu un courrier à comprendre' ? 'Préparer le courrier et les éventuelles échéances pour en parler directement avec Christian.' : 'Préparer votre certificat de salaire et, si vous en avez, votre précédente déclaration et vos attestations de prévoyance.']);
    items.push(['Examiner les points à vérifier', a.residence === 'En France' ? 'Votre résidence en France nécessite de préciser les démarches applicables de chaque côté de la frontière.' : 'Lister avec un conseiller les justificatifs et les déductions à examiner selon votre situation.']);
  } else {
    items.push(['Faire le point sur l’assurance maladie', 'Clarifier vos démarches à partir de votre lieu de résidence, de votre emploi et de votre date de début d’activité.']);
    items.push(['Comprendre votre situation fiscale', 'Identifier les questions à poser selon votre résidence et votre canton de travail.']);
    items.push(['Préparer la suite, à votre rythme', a.goal === 'Préparer mon épargne' ? 'Commencer par un bilan 3ᵉ pilier pour définir vos objectifs et les points à vérifier.' : 'Faire le point sur votre prévoyance et votre épargne une fois vos premières démarches clarifiées.']);
  }
  return items;
}
export function buildSummary(topic, answers) {
  return [`Mon parcours : ${journeys[topic].subtitle}`, ...getQuestions(topic, answers).map(q => `${q.label} ${answers[q.id] || 'Non précisé'}`)].join('\n');
}
