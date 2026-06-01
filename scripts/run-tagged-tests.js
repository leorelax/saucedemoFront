#!/usr/bin/env node

/**
 * Script to run Cucumber tests with custom tags
 * Usage: npm run test:any @tag1 @tag2
 * 
 * PowerShell: Use quotes around tags: npm run test:any '@tag'
 * Bash/CMD: Can use without quotes: npm run test:any @tag
 */

const { spawn } = require('child_process');
const path = require('path');

// Register ts-node to load TypeScript config files
require('ts-node/register');

// Import testConfig from TypeScript file
const testConfig = require('../src/config/test.config.ts');

// Get tag arguments from command line (skip first 2: node and script path)
const tags = process.argv.slice(2);

if (tags.length === 0) {
  console.error('❌ Error: Please provide at least one tag');
  console.log('');
  console.log('Usage:');
  console.log('  PowerShell: npm run test:any \'@tag\'');
  console.log('  Bash/CMD:   npm run test:any @tag');
  console.log('');
  console.log('Examples:');
  console.log('  npm run test:any \'@smoke\'');
  console.log('  npm run test:any \'@C45075-oaklawn\'');
  console.log('  npm run test:any \'@critical\' \'@positive\'');
  console.log('');
  process.exit(1);
}

// Build the tags expression
// If multiple tags provided, join them with 'or'
const tagsExpression = tags.length === 1 
  ? tags[0] 
  : '(' + tags.join(' or ') + ')';

const envInfo = testConfig.getEnvironmentInfo();

console.log(`🏃 Running tests with tags: ${tagsExpression}`);
console.log(`🌍 Environment: ${envInfo.name}`);
console.log(`⚙️  Workers: ${envInfo.workers}`);
console.log('');

// Run cucumber with the tags
const cucumberBin = path.join(__dirname, '..', 'node_modules', '.bin', 'cucumber-js');
const args = ['--parallel', String(testConfig.parallel.workers), '--tags', tagsExpression];

const cucumber = spawn(cucumberBin, args, {
  stdio: 'inherit',
  shell: true,
  cwd: path.join(__dirname, '..')
});

cucumber.on('close', (code) => {
  process.exit(code);
});

cucumber.on('error', (err) => {
  console.error('❌ Failed to start cucumber:', err);
  process.exit(1);
});
