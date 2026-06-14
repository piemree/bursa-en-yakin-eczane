import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const TR_MAP = {
  ç: "c",
  Ç: "c",
  ğ: "g",
  Ğ: "g",
  ı: "i",
  İ: "i",
  ö: "o",
  Ö: "o",
  ş: "s",
  Ş: "s",
  ü: "u",
  Ü: "u",
};

function normalizeText(value) {
  return value
    .split("")
    .map((char) => TR_MAP[char] ?? char)
    .join("")
    .toLowerCase()
    .replace(/mahallesi/gi, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value) {
  return normalizeText(value).replace(/\s+/g, "-").replace(/-+/g, "-");
}

function titleCaseDistrict(value) {
  return value
    .toLowerCase()
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function parsePopulation(value) {
  return Number(value.replace(/\./g, "").replace(",", ".")) || 0;
}

function parseArea(value) {
  return Number(value.replace(/\./g, "").replace(",", ".")) || 0;
}

function parseIlceler(html) {
  const $ = cheerio.load(html);
  const ilceler = [];

  $('select[name="ilce"] option').each((_, el) => {
    const beoId = $(el).attr("value");
    const dutyZone = $(el).text().trim();
    if (!beoId || !dutyZone) return;

    const [districtPart] = dutyZone.split(" - ");
    const districtName = titleCaseDistrict(districtPart);
    const slug = `${slugify(districtName)}-nobetci-eczane`;

    ilceler.push({
      id: slugify(districtName),
      name: districtName,
      slug,
      beoId,
      dutyZone,
    });
  });

  return ilceler;
}

function parseMahalleler(html) {
  const $ = cheerio.load(html);
  const mahalleler = [];
  const slugCounts = new Map();

  $("#data-table tbody tr").each((_, row) => {
    const cells = $(row).find("td");
    if (cells.length < 4) return;

    const name = $(cells[0]).text().trim();
    const district = $(cells[1]).text().trim();
    const population = parsePopulation($(cells[2]).text().trim());
    const area = parseArea($(cells[3]).text().trim());

    const baseSlug = slugify(name.replace(/ Mahallesi$/i, ""));
    const count = slugCounts.get(baseSlug) ?? 0;
    slugCounts.set(baseSlug, count + 1);

    const slug =
      count > 0
        ? `${baseSlug}-${slugify(district)}-nobetci-eczane`
        : `${baseSlug}-nobetci-eczane`;

    mahalleler.push({
      name,
      district,
      slug,
      population,
      area,
    });
  });

  return mahalleler;
}

const siteHtml = readFileSync(join(root, "site.html"), "utf8");
const mahalleHtml = readFileSync(join(root, "mahalle.html"), "utf8");

const ilceler = parseIlceler(siteHtml);
const mahalleler = parseMahalleler(mahalleHtml);

const dataDir = join(root, "data");
mkdirSync(dataDir, { recursive: true });

writeFileSync(
  join(dataDir, "ilceler.json"),
  JSON.stringify(ilceler, null, 2),
  "utf8",
);
writeFileSync(
  join(dataDir, "mahalleler.json"),
  JSON.stringify(mahalleler, null, 2),
  "utf8",
);

console.log(`Wrote ${ilceler.length} ilceler and ${mahalleler.length} mahalleler.`);
