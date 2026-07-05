const axios = require("axios");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.join(__dirname, "..", "public", "images");
const MAX_WIDTH = 1200;
const QUALITY = 75;

const imageMap = {
  // "https://i.ibb.co/xyz123/abc.png": "hero-image",
};

async function downloadImage(url) {
  const response = await axios({
    method: "GET",
    url,
    responseType: "arraybuffer",
  });
  return response.data;
}

async function processImage(url, name) {
  const ext = path.extname(url).split("?")[0] || ".png";
  const outputFile = path.join(OUTPUT_DIR, `${name}.webp`);

  try {
    console.log(`Downloading: ${url}`);
    const buffer = await downloadImage(url);

    console.log(`Converting: ${name}.webp`);
    await sharp(buffer)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(outputFile);

    console.log(`Saved: public/images/${name}.webp`);
  } catch (err) {
    console.error(`Failed: ${name} (${url}) — ${err.message}`);
  }
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const entries = Object.entries(imageMap);
  if (entries.length === 0) {
    console.log("No images in imageMap. Add your URLs and filenames, then re-run.");
    return;
  }

  console.log(`Processing ${entries.length} image(s)...\n`);

  for (const [url, name] of entries) {
    await processImage(url, name);
  }

  console.log("\nDone.");
}

main();
