"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const DATASET_MAP = {
  safari: "safariPackages",
  kilimanjaro: "kilimanjaroPackages",
  wildebeest: "wildebeestMigrationPackages",
  zanzibar: "zanzibarPackages",
};

function getArg(name) {
  const prefix = `--${name}=`;
  const match = process.argv.find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : undefined;
}

function loadMockData(mockDataPath) {
  const source = fs.readFileSync(mockDataPath, "utf8");

  const transformed = source
    .replace(/export\s+const\s+/g, "const ")
    .replace(/export\s*\{[\s\S]*?\};?/g, "");

  const wrapped = `${transformed}\nmodule.exports = { safariPackages, kilimanjaroPackages, wildebeestMigrationPackages, zanzibarPackages };`;

  const sandbox = {
    module: { exports: {} },
    exports: {},
    console,
    Date,
  };

  vm.createContext(sandbox);
  vm.runInContext(wrapped, sandbox, { filename: "mockData.js" });

  return sandbox.module.exports;
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function toPackagePayload(raw) {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug || slugify(raw.name),
    offeredBy: raw.offeredBy || "Asili Explorer Safaris",
    category: raw.category,
    duration: raw.duration,
    nights: raw.nights,
    travelStyle: raw.travelStyle,
    themes: raw.themes,
    bestFor: raw.bestFor,
    experienceSummary: raw.experienceSummary,
    shortDescription: raw.shortDescription,
    fullDescription: raw.fullDescription,
    destinationsDetailed: raw.destinationsDetailed || [],
    highlights: raw.highlights || [],
    mainImage: raw.mainImage,
    gallery: raw.gallery || [],
    priceType: raw.priceType || "FIXED",
    priceFrom: raw.priceFrom,
    currency: raw.currency || "USD",
    pricingNotes: raw.pricingNotes,
    inclusions: raw.inclusions || { included: [], excluded: [] },
    gettingThere: raw.gettingThere || { description: "" },
    isActive: typeof raw.isActive === "boolean" ? raw.isActive : true,
  };
}

async function main() {
  const mongoUri = process.env.MONGO_URI;
  const datasetArg = (getArg("dataset") || "safari").toLowerCase();
  const selectedKey = DATASET_MAP[datasetArg];

  if (!selectedKey) {
    throw new Error(
      "Invalid dataset. Use one of: safari, kilimanjaro, wildebeest, zanzibar"
    );
  }

  if (!mongoUri) {
    throw new Error("MONGO_URI is not set in safarimade-backend/.env");
  }

  const mockDataPath = path.resolve(__dirname, "../../safarimade-frontend/lib/mockData.js");
  if (!fs.existsSync(mockDataPath)) {
    throw new Error(`mockData.js not found at: ${mockDataPath}`);
  }

  const datasets = loadMockData(mockDataPath);
  const selectedPackages = datasets[selectedKey];

  if (!Array.isArray(selectedPackages) || selectedPackages.length === 0) {
    throw new Error(`No records found for ${selectedKey} in mockData.js`);
  }

  const packageSchemaPath = path.resolve(__dirname, "../dist/modules/package/package.schema.js");
  if (!fs.existsSync(packageSchemaPath)) {
    throw new Error("Backend is not built. Run `npm run build` in safarimade-backend first.");
  }

  const { PackageModel } = require(packageSchemaPath);

  await mongoose.connect(mongoUri);

  let insertedOrUpdated = 0;
  for (const raw of selectedPackages) {
    const payload = toPackagePayload(raw);
    await PackageModel.updateOne(
      { slug: payload.slug },
      { $set: payload },
      { upsert: true, runValidators: true }
    );
    insertedOrUpdated += 1;
  }

  console.log(`Upserted ${insertedOrUpdated} records from ${datasetArg} into database.`);
}

main()
  .catch((error) => {
    console.error("Import failed:", error.message || error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
