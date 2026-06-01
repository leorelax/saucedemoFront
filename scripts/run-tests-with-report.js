const { execSync } = require('child_process');

/**
 * Run tests and then generate report regardless of test result
 * This ensures the report is always generated even when tests fail
 */
function runTestsWithReport() {
  console.log('========================================');
  console.log('Running Tests...');
  console.log('========================================\n');
  
  let testsExitCode = 0;
  
  // Run tests - capture exit code but don't fail
  try {
    execSync('npm test', { stdio: 'inherit' });
  } catch (error) {
    testsExitCode = error.status || 1;
    console.log('\n⚠ Tests completed with failures');
  }
  
  console.log('\n========================================');
  console.log('Generating Report...');
  console.log('========================================\n');
  
  // Always generate and open report
  try {
    execSync('npm run report', { stdio: 'inherit' });
  } catch (error) {
    console.error('\n❌ Failed to generate report');
    process.exit(1);
  }
  
  // Exit with the original test exit code
  if (testsExitCode !== 0) {
    console.log('\n⚠ Tests failed. Check the report for details.');
    process.exit(testsExitCode);
  }
}

runTestsWithReport();
