import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {ageGroup,comparePremiums,findCommunes} from '../src/lib/lamal.js';
const read=n=>{const p=new URL(`../public/data/lamal-2027/${n}.json${n==='manifest'?'':'.gz'}`,import.meta.url);const data=fs.readFileSync(p);return JSON.parse(n==='manifest'?data:gunzipSync(data));};
const communes=read('communes');const manifest=read('manifest');
test('Premium-year age boundaries are explicit; minors never receive adult rates',()=>{assert.equal(ageGroup(2008),'J1');assert.equal(ageGroup(2002),'J1');assert.equal(ageGroup(2001),'E1');assert.equal(ageGroup(2009),null);assert.equal(ageGroup(''),null);assert.equal(ageGroup('abc'),null);});
test('NPA search preserves multiple political communes, requiring explicit selection',()=>{const matches=findCommunes(communes,'6340');assert(matches.length>1);assert(new Set(matches.map(r=>r[0])).size>1);assert(findCommunes(communes,'Geneve').some(r=>r[2]==='Genève'));});
test('Geneva official standard CSS premium is selected only for matching criteria',()=>{
 const commune=communes.find(r=>r[2]==='Genève');const results=comparePremiums(read('GE'),{commune,group:'E1',accident:true,franchise:300,type:'BASE'});
 assert(results.length>10);assert(results.every(r=>r[1]===0&&r[2]==='E1'&&r[3]&&r[4]===300&&r[7]==='BASE'));
 assert(results.every((r,i)=>!i||results[i-1][5]<=r[5]));assert(results.some(r=>r[0]==='8'));
});
test('Restricted models never leak to another BFS commune',()=>{const rows=[['8',1,'E1',true,300,200,'A','PRAXIS','A',[5586]],['8',1,'E1',true,300,250,'BASE','BASE','Standard',null]];
 assert.equal(comparePremiums(rows,{commune:[5586,'VD','Lausanne',1],group:'E1',accident:true,franchise:300}).length,2);
 assert.equal(comparePremiums(rows,{commune:[999,'VD','Other',1],group:'E1',accident:true,franchise:300}).length,1);
 assert.equal(comparePremiums(rows,{commune:[5586,'VD','Lausanne',2],group:'E1',accident:true,franchise:300}).length,0);
});
test('Dataset complete across declared cantons, valid prices, insurer names and no duplicated options',()=>{
 let total=0;
 for(const c of manifest.cantons){const rows=read(c);total+=rows.length;const keys=new Set();
 for(const r of rows){assert(manifest.insurers[r[0]]);assert(r[5]>0&&Number.isFinite(r[5]));assert(['E1','J1'].includes(r[2]));assert([300,500,1000,1500,2000,2500].includes(r[4]));assert(r[9]===null||Array.isArray(r[9]));const k=[r[0],r[1],r[2],r[3],r[4],r[6]].join('|');assert(!keys.has(k),`${c}: duplicate ${k}`);keys.add(k);}}
 assert.equal(total,manifest.rows);assert.equal(manifest.cantons.length,26);
});
