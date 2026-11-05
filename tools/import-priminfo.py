"""Import the verified OFSP 2027 snapshot. Usage: python tools/import-priminfo.py SOURCE_DIR.
Requires openpyxl; input filenames and official source URLs are recorded in manifest.json.
Adult/young adult resident premiums only. No estimated premiums or family discounts.
"""
import csv, json, sys, hashlib, re, gzip
from pathlib import Path
import openpyxl
src=Path(sys.argv[1]); out=Path('public/data/lamal-2027');out.mkdir(parents=True,exist_ok=True)
def rows(n):
 with (src/n).open(encoding='utf-8-sig',newline='') as f:return list(csv.DictReader(f))
def write(n,d):
 data=json.dumps(d,ensure_ascii=False,separators=(',',':')).encode('utf-8')
 if n=='manifest.json': (out/n).write_bytes(data)
 else: (out/(n+'.gz')).write_bytes(gzip.compress(data,mtime=0))
names={str(r[1]):str(r[3]).strip() for r in openpyxl.load_workbook(src/'insurers.xlsx',data_only=True).worksheets[1].values if isinstance(r[1],int) and r[3]}
models={r['Versicherer']+'|'+r['Tarif']:r['Name_FR'] or r['Name_DE'] for r in rows('tariffs.csv') if r['Kategorie']=='MOD'}
areas={}
for r in rows('areas.csv'):
 key='|'.join(r[k] for k in ['Versicherer','Kanton','Region','Tarif'])
 areas[key]=None if r['Eingeschränkt']=='N' else [int(x) for x in re.findall(r'\d+',r['Gemeinden-BFS'])]
# Some small funds have restricted areas even for BASE. Exclude rather than assume availability.
lines=(src/'restricted.csv').read_text(encoding='utf-8-sig').splitlines();header=next(i for i,x in enumerate(lines) if x.startswith('G_ID;'))
restricted=set()
for r in csv.DictReader(lines[header:],delimiter=';'):
 if not r.get('G_ID','').isdigit():continue
 for c in ['AG','AI','AR','BE','BL','BS','FR','GE','GL','GR','JU','LU','NE','NW','OW','SG','SH','SO','SZ','TG','TI','UR','VD','VS','ZG','ZH']:
  if r.get(c)=='1.1': restricted.add((str(int(r['G_ID'])),c))
communes=[]
sheet=openpyxl.load_workbook(src/'regions.xlsx',read_only=True,data_only=True)['A_COM']
for r in sheet.values:
 if isinstance(r[0],int) and isinstance(r[5],int):communes.append([r[0],r[1],r[2],r[3],r[5],r[6]])
write('communes.json',communes)
by_canton={};excluded=0;swiss_cantons={c[1] for c in communes}
for r in rows('premiums.csv'):
 if r['Kanton'] not in swiss_cantons or r['Geschäftsjahr']!='2027' or r['Hoheitsgebiet']!='P_OKPCH' or r['Altersuntergruppe'] not in ['E1','J1']:continue
 insurer,canton=r['Versicherer'],r['Kanton'];key='|'.join(r[k] for k in ['Versicherer','Kanton','Region','Tarif'])
 if insurer not in names:raise ValueError('Missing insurer '+insurer)
 if (insurer,canton) in restricted or (r['Tariftyp']!='BASE' and key not in areas):excluded+=1;continue
 row=[insurer,int(r['Region'][-1]),r['Altersuntergruppe'],r['Unfalleinschluss']=='MIT_UNF',int(r['Franchise'].split('_')[-1]),float(r['Prämie']),r['Tarif'],r['Tariftyp'],models.get(insurer+'|'+r['Tarif'],r['Tarifbezeichnung']),areas.get(key)]
 by_canton.setdefault(canton,[]).append(row)
for c,data in by_canton.items():write(c+'.json',data)
write('manifest.json',{'year':2027,'imported':'2026-11-05','sourceUpdated':'2026-09-29','source':'https://opendata.swiss/fr/dataset/health-insurance-premiums','regionsSource':'https://www.priminfo.admin.ch/downloads/praemienregionen-2027.xlsx','insurersSource':'https://www.priminfo.admin.ch/downloads/assureurs-maladie-admis-2026-10.xlsx','insurers':names,'cantons':sorted(by_canton),'excludedRestrictedRows':excluded,'rows':sum(map(len,by_canton.values())),'columns':['insurer','region','ageGroup','accident','franchise','premium','tariff','type','name','communesOrNull'],'scope':'Résidents suisses de 19 ans et plus. Hors assureurs à rayon d’activité limité. Sans subsides, redistribution environnementale ni rabais famille.','sha256':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in src.iterdir() if p.is_file()}})
print('Imported',sum(map(len,by_canton.values())),'premiums;',len(communes),'localities;',excluded,'restricted rows excluded')
