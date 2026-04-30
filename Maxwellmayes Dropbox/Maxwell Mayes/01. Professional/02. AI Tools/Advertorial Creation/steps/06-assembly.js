// steps/06-assembly.js
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

export async function runAssembly(html, imagePrompts, outputDir) {
  console.log('  [6] Assembly: replacing image placeholders...');
  let assembled = html;

  for (const slot of imagePrompts.slots) {
    if (!/^[a-z0-9-]+$/.test(slot.id)) {
      throw new Error(`Assembly: slot ID "${slot.id}" is not valid kebab-case`);
    }
    if (slot.type === 'svg') {
      const svgPattern = new RegExp(`<!--\\s*GENERATE_SVG:${slot.id}\\s*-->`, 'g');
      assembled = assembled.replace(svgPattern, slot.svgContent);
    } else {
      const imgPattern = new RegExp(`src="GENERATE:${slot.id}"`, 'g');
      assembled = assembled.replace(imgPattern, `src="${slot.outputFile}"`);
    }
  }

  const htmlPath = join(outputDir, 'advertorial.html');
  writeFileSync(htmlPath, assembled);
  console.log('  [6] Assembly: done ✓');
  return assembled;
}
