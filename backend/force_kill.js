const { execSync } = require('child_process');

try {
    console.log('Attempting to kill node processes...');
    // Use taskkill via cmd to avoid bash path translation issues
    execSync('taskkill /F /IM node.exe /T', { stdio: 'inherit' });
    console.log('✅ Node processes killed.');
} catch (e) {
    console.log('ℹ️ No node processes to kill or access denied:', e.message);
}
