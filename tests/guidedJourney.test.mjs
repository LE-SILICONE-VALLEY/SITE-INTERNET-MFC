import test from 'node:test';
import assert from 'node:assert/strict';
import { getQuestions, getGuidance, suggestTopics, buildSummary, journeys } from '../src/data/guidedJourney.js';
test('A contract review skips savings budget and duplicate contract question', () => {
 const qs = getQuestions('pillar', { goal: 'Vérifier mon contrat actuel' });
 assert(!qs.some(q => q.id === 'budget' || q.id === 'contract'));
 assert(getGuidance('pillar', {goal:'Vérifier mon contrat actuel'})[0][0].includes('contrat'));
});
test('Savings journey asks for an indicative budget; fiscal journey does not', () => {
 assert(getQuestions('pillar', {goal:'Commencer à épargner'}).some(q=>q.id==='budget'));
 assert(!getQuestions('pillar', {goal:'Comprendre les avantages fiscaux'}).some(q=>q.id==='budget'));
});
test('French residents receive cross-border points to check, no presumed deduction', () => {
 assert(getGuidance('pillar', {residence:'En France'})[1][1].includes('frontalier'));
 assert(getGuidance('taxes', {residence:'En France'})[2][1].includes('frontière'));
});
test('Free text can suggest several topics; unknown words do not force a match', () => {
 assert.deepEqual(suggestTopics('Préparer ma retraite et mes impôts'), ['pillar', 'taxes']);
 assert.deepEqual(suggestTopics('Je commence à travailler en Suisse'), ['arrival']);
 assert.deepEqual(suggestTopics('bonjour'), []);
});
test('Every goal yields readable guidance and a complete summary even with skipped answers', () => {
 for (const [topic, journey] of Object.entries(journeys)) for(const goal of journey.goals) {
  assert.equal(getGuidance(topic, {goal}).length,3);
  assert(buildSummary(topic, {goal}).includes('Non précisé'));
  const qs=getQuestions(topic,{goal});
  assert.equal(new Set(qs.map(q=>q.id)).size,qs.length);
 }
});
