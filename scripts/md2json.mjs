// scripts/md2json.mjs
import fs from "fs";
import path from "path";
import { MdJsonParserService } from "md-json-parser";

const cwd = process.cwd();
const docsDir = path.join(cwd, "docs");
const outDir = path.join(cwd, "data");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const parser = new MdJsonParserService();
const files = fs.readdirSync(docsDir).filter(f => f.endsWith(".md") && f !== "index.md");

function toText(node) {
  if (!node) return "";
  if (typeof node.value === "string") return node.value;
  if (Array.isArray(node.children)) return node.children.map(toText).join("");
  return "";
}

function collectListItems(listNode) {
  const out = [];
  for (const item of listNode.children || []) {
    const paragraph = (item.children || []).find(c => c.type === "paragraph");
    const text = toText(paragraph).trim();
    if (text) out.push(text);
  }
  return out;
}

function parseSectionsWithH3(nodes) {
  const sections = {};
  let currentH2 = null;
  let currentH3 = null;

  function ensureH2(title) {
    if (!sections[title]) sections[title] = { items: [], subsections: {} };
  }

  for (const node of nodes) {
    if (node.type === "heading" && node.depth === 2) {
      currentH2 = toText(node).trim();
      currentH3 = null;
      if (currentH2) ensureH2(currentH2);
    } else if (node.type === "heading" && node.depth === 3) {
      if (!currentH2) continue;
      currentH3 = toText(node).trim();
      ensureH2(currentH2);
      if (!sections[currentH2].subsections[currentH3])
        sections[currentH2].subsections[currentH3] = [];
    } else if (node.type === "list") {
      const items = collectListItems(node);
      if (!items.length) continue;
      if (currentH2 && currentH3) {
        sections[currentH2].subsections[currentH3].push(...items);
      } else if (currentH2) {
        sections[currentH2].items.push(...items);
      }
    }
  }

  for (const key of Object.keys(sections)) {
    if (Object.keys(sections[key].subsections).length === 0)
      delete sections[key].subsections;
  }
  return sections;
}

function validateSections(structured, file) {
  const errors = [];
  for (const [h2, block] of Object.entries(structured)) {
    const direct = block.items?.length || 0;
    const sub = block.subsections
      ? Object.values(block.subsections).reduce((a, b) => a + b.length, 0)
      : 0;
    if (direct + sub === 0)
      errors.push(`Section "${h2}" has no items (file: ${file})`);
  }
  if (errors.length)
    throw new Error("Validation failed:\\n" + errors.map(e => " - " + e).join("\\n"));
}

for (const file of files) {
  const filePath = path.join(docsDir, file);
  const md = fs.readFileSync(filePath, "utf-8");
  const parsed = parser.parseMarkdown(md);
  const meta = parsed.data || {};
  const nodes = parsed.body || [];

  const title = meta.title || path.basename(file, ".md");
  let result;

  if (meta.schema === "sections") {
    const structured = parseSectionsWithH3(nodes);
    validateSections(structured, file);
    result = { title, sections: structured };
  } else {
    const structured = parseSectionsWithH3(nodes);
    let items = [];
    for (const block of Object.values(structured)) {
      if (block.items) items.push(...block.items);
      if (block.subsections)
        for (const arr of Object.values(block.subsections)) items.push(...arr);
    }
    if (items.length === 0)
      throw new Error(`Validation failed: flat doc has no bullet items (file: ${file})`);
    result = { title, items };
  }

  const outPath = path.join(outDir, file.replace(/\\.md$/, ".json"));
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
  console.log(`✅ ${path.relative(cwd, outPath)}`);
}