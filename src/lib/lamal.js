export const PREMIUM_YEAR = 2027;
export const MODEL_LABELS = { BASE:'Standard', PRAXIS:'Cabinet / médecin de famille', TEL_DIG:'Télémédecine / numérique', FLEX:'Modèle combiné', PHARM:'Pharmacie' };
export function ageGroup(birthYear) {
  const age=PREMIUM_YEAR-Number(birthYear);
  if(!Number.isInteger(Number(birthYear))||age<19||age>120)return null;
  return age<=25?'J1':'E1';
}
// Row schema is versioned in the dataset manifest; BFS commune ID is authoritative.
export function comparePremiums(rows,{commune,group,accident,franchise,type='all'}) {
  if(!commune||!['E1','J1'].includes(group))return [];
  return rows.filter(r=>r[1]===Number(commune[3])&&r[2]===group&&r[3]===accident&&r[4]===Number(franchise)&&(type==='all'||r[7]===type)&&(!r[9]||r[9].includes(Number(commune[0])))).slice().sort((a,b)=>a[5]-b[5]||a[0].localeCompare(b[0])||a[6].localeCompare(b[6]));
}
export function findCommunes(rows,query){
 const q=query.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
 if(q.length<2)return [];
 return rows.filter(r=>`${r[4]} ${r[5]} ${r[2]} ${r[1]}`.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(q)).slice(0,40);
}
