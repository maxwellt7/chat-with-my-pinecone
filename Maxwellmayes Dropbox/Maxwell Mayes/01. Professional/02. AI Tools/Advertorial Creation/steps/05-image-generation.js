// steps/05-image-generation.js
import { join } from 'node:path';
import { generateImage } from '../lib/imagen.js';

export async function runImageGeneration(imagePrompts, outputDir) {
  const photoSlots = imagePrompts.slots.filter(s => s.type === 'photo');
  const results = {};

  console.log(`  [5] Image generation: ${photoSlots.length} photo slots to generate...`);

  for (const slot of photoSlots) {
    const outputPath = join(outputDir, slot.outputFile);
    console.log(`    Generating ${slot.id} (${slot.aspectRatio})...`);
    const success = await generateImage(slot.prompt, slot.aspectRatio, outputPath);
    results[slot.id] = success;
    if (!success) console.log(`    ⚠ ${slot.id} failed — placeholder will remain in HTML`);
  }

  const succeeded = Object.values(results).filter(Boolean).length;
  console.log(`  [5] Image generation: ${succeeded}/${photoSlots.length} succeeded ✓`);
  return results;
}
