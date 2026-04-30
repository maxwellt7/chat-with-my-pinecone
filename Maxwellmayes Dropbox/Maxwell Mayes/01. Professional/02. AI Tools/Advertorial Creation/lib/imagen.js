// lib/imagen.js
import { writeFileSync, existsSync } from 'node:fs';

const BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function imagen4(prompt, aspectRatio) {
  const url = `${BASE}/imagen-4.0-generate-001:predict?key=${process.env.GEMINI_API_KEY}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: { aspectRatio, sampleCount: 1 }
    })
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Imagen4 ${response.status}: ${err.error?.message}`);
  }
  const data = await response.json();
  if (!data.predictions?.[0]?.bytesBase64Encoded) {
    throw new Error('Imagen4: empty predictions in response');
  }
  return data.predictions[0].bytesBase64Encoded;
}

async function nanoBananaPro(prompt) {
  const url = `${BASE}/nano-banana-pro-preview:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['IMAGE'] }
    })
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(`NanoBanana ${response.status}: ${err.error?.message}`);
  }
  const data = await response.json();
  const parts = data.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find(p => p.inlineData?.data);
  if (!imagePart) throw new Error('NanoBanana: no image in response');
  return imagePart.inlineData.data;
}

export async function generateImage(prompt, aspectRatio, outputPath) {
  if (existsSync(outputPath)) return true;

  let b64 = null;

  try {
    b64 = await imagen4(prompt, aspectRatio);
  } catch (err) {
    console.log(`    Imagen4 failed (${err.message}), trying fallback...`);
    await delay(2000);
    try {
      b64 = await nanoBananaPro(prompt);
    } catch (err2) {
      console.log(`    Fallback also failed: ${err2.message}`);
      return false;
    }
  }

  writeFileSync(outputPath, Buffer.from(b64, 'base64'));
  await delay(2000);
  return true;
}
