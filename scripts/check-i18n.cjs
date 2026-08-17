const fs = require('fs');
const path = require('path');

const en = JSON.parse(fs.readFileSync('public/locales/en/translation.json', 'utf8'));
const ar = JSON.parse(fs.readFileSync('public/locales/ar/translation.json', 'utf8'));

function getNested(obj, keyPath) {
  const parts = keyPath.split('.');
  let curr = obj;
  for (const p of parts) {
    if (curr === undefined || curr === null) return undefined;
    curr = curr[p];
  }
  return curr;
}

function getAllFiles(dir, exts = ['.ts', '.tsx']) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath, exts));
    } else {
      if (exts.some(ext => file.endsWith(ext))) {
        results.push(filePath);
      }
    }
  }
  return results;
}

const files = getAllFiles('src');
// Match t('key') or t("key") only where t is from useTranslation
const keyRegex = /\bt\(\s*['"]([a-zA-Z0-9_.-]+)['"]/g;
const missingEn = [];
const missingAr = [];
const foundKeys = new Set();

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  if (!content.includes('useTranslation') && !content.includes('i18n')) {
    continue;
  }
  let match;
  while ((match = keyRegex.exec(content)) !== null) {
    const key = match[1];
    if (key === '_' || key.includes('${') || key.endsWith('.')) continue;
    foundKeys.add(key);
    if (getNested(en, key) === undefined) missingEn.push({ key, file });
    if (getNested(ar, key) === undefined) missingAr.push({ key, file });
  }
}

console.log('Total unique static keys found in code with useTranslation/i18n:', foundKeys.size);
console.log('\nMissing in EN (' + missingEn.length + '):');
missingEn.forEach(m => console.log(`  ${m.key} -> ${m.file}`));

console.log('\nMissing in AR (' + missingAr.length + '):');
missingAr.forEach(m => console.log(`  ${m.key} -> ${m.file}`));

function checkSymmetry(obj1, obj2, prefix = '') {
  let diffs = [];
  for (const k of Object.keys(obj1)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (obj2[k] === undefined) {
      diffs.push(`Key "${fullKey}" exists in first but missing in second`);
    } else if (typeof obj1[k] === 'object' && obj1[k] !== null && !Array.isArray(obj1[k])) {
      diffs = diffs.concat(checkSymmetry(obj1[k], obj2[k], fullKey));
    }
  }
  return diffs;
}

const enNotInAr = checkSymmetry(en, ar);
const arNotInEn = checkSymmetry(ar, en);

console.log('\nKeys in EN but not in AR:', enNotInAr.length);
enNotInAr.forEach(d => console.log('  ' + d));

console.log('\nKeys in AR but not in EN:', arNotInEn.length);
arNotInEn.forEach(d => console.log('  ' + d));