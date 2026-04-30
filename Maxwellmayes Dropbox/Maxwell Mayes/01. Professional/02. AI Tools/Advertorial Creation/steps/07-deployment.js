// steps/07-deployment.js
import { writeFileSync, renameSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

export function parseVercelUrl(output) {
  const productionMatch = output.match(/Production:\s+(https:\/\/[^\s\[]+)/);
  if (productionMatch) return productionMatch[1].trim();
  const anyUrlMatch = output.match(/(https:\/\/[a-zA-Z0-9-]+\.vercel\.app)/);
  if (anyUrlMatch) return anyUrlMatch[1];
  throw new Error('Could not parse Vercel URL from output:\n' + output);
}

export async function runDeployment(outputDir, runId, exec = execSync) {
  console.log('  [7] Deployment: preparing Vercel project...');

  writeFileSync(
    join(outputDir, 'vercel.json'),
    JSON.stringify({ name: `advertorial-${runId}` }, null, 2)
  );

  renameSync(join(outputDir, 'advertorial.html'), join(outputDir, 'index.html'));

  console.log('  [7] Deployment: deploying to Vercel (vercel --yes)...');
  const output = exec(`cd "${outputDir}" && vercel --yes --prod 2>&1`, { encoding: 'utf8' });

  const url = parseVercelUrl(output);
  console.log(`  [7] Deployment: live at ${url} ✓`);
  return url;
}
