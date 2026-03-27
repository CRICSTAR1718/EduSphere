const { execSync } = require('child_process');

const port = process.argv[2] || 5001;

try {
    const output = execSync(`netstat -ano | findstr :${port}`).toString();
    const lines = output.trim().split('\n');
    const pids = new Set();
    
    lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        if (parts.length > 4) {
            pids.add(parts[parts.length - 1]);
        }
    });

    if (pids.size > 0) {
        console.log(`Found PIDs on port ${port}: ${Array.from(pids).join(', ')}`);
        pids.forEach(pid => {
            try {
                execSync(`taskkill /F /PID ${pid} /T`);
                console.log(`Killed PID ${pid}`);
            } catch (kErr) {
                console.log(`Failed to kill PID ${pid}: ${kErr.message}`);
            }
        });
    } else {
        console.log(`No processes found on port ${port}`);
    }
} catch (err) {
    if (err.message.includes('findstr')) {
        console.log(`No processes found on port ${port} (netstat returned nothing)`);
    } else {
        console.log(`Error finding process on port ${port}: ${err.message}`);
    }
}
