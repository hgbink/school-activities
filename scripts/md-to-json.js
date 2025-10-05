// scripts/md-to-json.js
// Extract structured JSON from docs/*.md using a fenced ```meta JSON block
// schemas:
// - "flat": collects bullet items (prefers those under H2; falls back to top-level lists)
// - "sections": each H2 (##) is a section; bullets beneath become that section's items

const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');
const outDir  = path.join(__dirname, '..', 'data');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function parseMeta(md) {
  const m = md.match(/```meta\s*\n([\s\S]*?)\n```/);
  if (!m) return null;
  try {
    return JSON.parse(m[1]);
  } catch (e) {
    throw new Error('Invalid JSON in ```meta block: ' + e.message);
  }
}

function splitByH2(md) {
  const lines = md.split('\n');
  const sections = [];
  let current = null;

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)/);
    if (h2) {
      if (current) sections.push(current);
      current = { title: h2[1].trim(), content: '' };
    } else if (current) {
      current.content += line + '\n';
    }
  }
  if (current) sections.push(current);
  return sections;
}

function extractBullets(textBlock) {
  return textBlock
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.startsWith('- '))
    .map(l => l.replace(/^-+\s*/, ''))
    .filter(Boolean);
}

function processFlat(md, meta) {
  const h2s = splitByH2(md);
  let items = [];
  if (h2s.length) {
    for (const sec of h2s) items = items.concat(extractBullets(sec.content));
  } else {
    items = extractBullets(md);
  }
  if (items.length === 0) {
    throw new Error(`Flat doc has no bullet items (title: ${meta.title || 'Untitled'})`);
  }
  return { title: meta.title || 'Untitled', items };
}

function processSections(md, meta) {
  const h2s = splitByH2(md);
  const sections = {};
  for (const sec of h2s) {
    const items = extractBullets(sec.content);
    sections[sec.title] = items;
  }
  return { title: meta.title || 'Untitled', sections };
}

function main() {
  const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.md') && f !== 'index.md');

  for (const file of files) {
    const full = path.join(docsDir, file);
    const md = fs.readFileSync(full, 'utf-8');

    const meta = parseMeta(md);
    if (!meta) {
      console.warn(`Skipping (no \`\`\`meta block): ${file}`);
      continue;
    }

    let output;
    if (meta.schema === 'sections') {
      output = processSections(md, meta);
    } else {
      output = processFlat(md, meta); // default to flat
    }

    const outPath = path.join(outDir, file.replace(/\.md$/, '.json'));
    fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
    console.log(`✅ ${path.relative(process.cwd(), outPath)}`);
  }
}

main();