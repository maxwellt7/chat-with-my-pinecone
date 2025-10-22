#!/usr/bin/env node

/**
 * Verification script for Rapid Launch Agent
 * Checks that all required files and configuration are in place
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description} - Missing: ${filePath}`, 'red');
    return false;
  }
}

function checkDirectory(dirPath, description) {
  const fullPath = path.join(__dirname, dirPath);
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description} - Missing: ${dirPath}`, 'red');
    return false;
  }
}

function checkEnvFile() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    log('⚠️  .env file not found', 'yellow');
    log('   Create it from .env.claude and add your ANTHROPIC_API_KEY', 'yellow');
    return false;
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const hasApiKey = envContent.includes('ANTHROPIC_API_KEY=') && 
                    !envContent.includes('your_anthropic_api_key_here');
  
  if (hasApiKey) {
    log('✅ .env file exists with API key configured', 'green');
    return true;
  } else {
    log('⚠️  .env file exists but API key not configured', 'yellow');
    log('   Add your ANTHROPIC_API_KEY to .env', 'yellow');
    return false;
  }
}

function checkNodeModules() {
  const nodeModulesPath = path.join(__dirname, 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    log('✅ node_modules installed', 'green');
    return true;
  } else {
    log('❌ node_modules not found', 'red');
    log('   Run: npm install', 'yellow');
    return false;
  }
}

console.log('\n' + '='.repeat(60));
log('🚀 Rapid Launch Agent - Setup Verification', 'blue');
console.log('='.repeat(60) + '\n');

let allGood = true;

// Check core files
log('📁 Checking Core Files...', 'blue');
allGood &= checkFile('package.json', 'package.json');
allGood &= checkFile('vite.config.ts', 'Vite config');
allGood &= checkFile('tailwind.config.js', 'Tailwind config');
allGood &= checkFile('tsconfig.json', 'TypeScript config');
console.log('');

// Check frontend structure
log('⚛️  Checking Frontend Structure...', 'blue');
allGood &= checkDirectory('src', 'src/ directory');
allGood &= checkDirectory('src/pages', 'src/pages/ directory');
allGood &= checkDirectory('src/components', 'src/components/ directory');
allGood &= checkFile('src/App.tsx', 'App.tsx');
allGood &= checkFile('src/pages/Landing.tsx', 'Landing page');
allGood &= checkFile('src/pages/OfferBuilder.tsx', 'Offer Builder page');
allGood &= checkFile('src/pages/AvatarBuilder.tsx', 'Avatar Builder page');
allGood &= checkFile('src/pages/CompetitorIntelligence.tsx', 'Competitor Intelligence page');
allGood &= checkFile('src/pages/Manifold.tsx', 'Manifold page');
allGood &= checkFile('src/pages/LaunchDocument.tsx', 'Launch Document page');
allGood &= checkFile('src/pages/Dashboard.tsx', 'Dashboard page');
console.log('');

// Check backend structure
log('🔧 Checking Backend Structure...', 'blue');
allGood &= checkDirectory('server', 'server/ directory');
allGood &= checkFile('server/index.js', 'Server entry point');
allGood &= checkDirectory('server/routes', 'server/routes/ directory');
allGood &= checkFile('server/routes/offerAnalysis.js', 'Offer analysis route');
allGood &= checkFile('server/routes/avatarAnalysis.js', 'Avatar analysis route');
allGood &= checkFile('server/routes/competitorAnalysis.js', 'Competitor analysis route');
allGood &= checkFile('server/routes/manifoldWorkflow.js', 'Manifold workflow route');
allGood &= checkFile('server/routes/launchDocument.js', 'Launch document route');
allGood &= checkFile('server/routes/query.js', 'Query route');
allGood &= checkFile('server/routes/export.js', 'Export route');
allGood &= checkFile('server/config/anthropic.js', 'Anthropic config');
allGood &= checkFile('server/utils/helpers.js', 'Helper utilities');
console.log('');

// Check documentation
log('📚 Checking Documentation...', 'blue');
allGood &= checkFile('README.md', 'README.md');
allGood &= checkFile('SETUP.md', 'SETUP.md');
allGood &= checkFile('COMPLETION_SUMMARY.md', 'Completion Summary');
console.log('');

// Check environment and dependencies
log('🔐 Checking Environment & Dependencies...', 'blue');
allGood &= checkEnvFile();
allGood &= checkNodeModules();
console.log('');

// Final verdict
console.log('='.repeat(60));
if (allGood) {
  log('✅ All checks passed! Ready to run.', 'green');
  log('\nTo start the application:', 'blue');
  log('  ./start.sh', 'green');
  log('  OR', 'yellow');
  log('  Terminal 1: npm run server', 'green');
  log('  Terminal 2: npm run dev', 'green');
} else {
  log('❌ Some checks failed. Please review the issues above.', 'red');
  log('\nCommon fixes:', 'yellow');
  log('  • Run: npm install', 'blue');
  log('  • Copy .env.claude to .env and add your Anthropic API key', 'blue');
  log('  • Ensure all files are present', 'blue');
}
console.log('='.repeat(60) + '\n');

