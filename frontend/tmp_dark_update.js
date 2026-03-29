const fs = require('fs');
const path = require('path');

function processDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = false;

            const replacements = [
                { regex: /bg-white(?!\s+dark:bg-)/g, target: 'bg-white dark:bg-slate-800' },
                { regex: /text-slate-800(?!\s+dark:text-)/g, target: 'text-slate-800 dark:text-white' },
                { regex: /text-slate-700(?!\s+dark:text-)/g, target: 'text-slate-700 dark:text-slate-100' },
                { regex: /text-slate-600(?!\s+dark:text-)/g, target: 'text-slate-600 dark:text-slate-300' },
                { regex: /text-slate-500(?!\s+dark:text-)/g, target: 'text-slate-500 dark:text-slate-400' },
                { regex: /border-slate-200(?!\s+dark:border-)/g, target: 'border-slate-200 dark:border-slate-700' },
                { regex: /border-slate-100(?!\s+dark:border-)/g, target: 'border-slate-100 dark:border-slate-800' },
                { regex: /bg-slate-50(?!\s+dark:bg-|\/)/g, target: 'bg-slate-50 dark:bg-slate-900/50' }
            ];

            replacements.forEach(r => {
                if (content.match(r.regex)) {
                    content = content.replace(r.regex, r.target);
                    updated = true;
                }
            });

            if (updated) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    });
}

console.log("Starting bulk dark mode update...");
processDir('c:/IMP/Career/EduSphere Project/EduSphere/frontend/src/pages');
processDir('c:/IMP/Career/EduSphere Project/EduSphere/frontend/src/components');
console.log("Done!");
