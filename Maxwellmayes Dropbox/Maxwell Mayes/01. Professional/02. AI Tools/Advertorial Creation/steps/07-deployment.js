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
  if (process.env.VERCEL_TOKEN && !/^[A-Za-z0-9_-]+$/.test(process.env.VERCEL_TOKEN)) {
    throw new Error('[7] VERCEL_TOKEN contains invalid characters');
  }
  const tokenFlag = process.env.VERCEL_TOKEN ? ` --token=${process.env.VERCEL_TOKEN}` : '';

  console.log('  [7] Deployment: preparing Vercel project...');

  writeFileSync(
    join(outputDir, 'vercel.json'),
    JSON.stringify({ name: `advertorial-${runId}` }, null, 2)
  );

  try {
    renameSync(join(outputDir, 'advertorial.html'), join(outputDir, 'index.html'));
  } catch (err) {
    throw new Error(`[7] advertorial.html not found in ${outputDir} — did step 6 complete? (${err.message})`);
  }

  console.log('  [7] Deployment: deploying to Vercel (vercel --yes)...');
  const output = exec(`vercel --yes --prod${tokenFlag} 2>&1`, { encoding: 'utf8', cwd: outputDir, shell: true });

  const url = parseVercelUrl(output);
  console.log(`  [7] Deployment: live at ${url} ✓`);
  return url;
}
