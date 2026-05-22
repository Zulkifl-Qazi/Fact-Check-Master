const fs = require('fs');
const path = require('path');

const dir = 'src';
const replacements = [
    { from: /from-purple-600/g, to: 'from-blue-600' },
    { from: /from-purple-950/g, to: 'from-blue-950' },
    { from: /to-pink-600/g, to: 'to-cyan-500' },
    { from: /via-pink-500/g, to: 'via-cyan-500' },
    { from: /via-pink-400/g, to: 'via-cyan-400' },
    { from: /to-pink-500/g, to: 'to-cyan-500' },
    { from: /to-pink-400/g, to: 'to-cyan-400' },
    { from: /from-purple-500/g, to: 'from-blue-500' },
    { from: /from-purple-400/g, to: 'from-blue-400' },
    { from: /via-purple-950/g, to: 'via-blue-950' },
    { from: /via-purple-900/g, to: 'via-blue-900' },
    { from: /via-purple-500/g, to: 'via-blue-500' },
    { from: /via-purple-400/g, to: 'via-blue-400' },
    { from: /to-purple-950/g, to: 'to-blue-950' },
    { from: /to-purple-900/g, to: 'to-blue-900' },
    { from: /to-purple-500/g, to: 'to-blue-500' },
    { from: /to-purple-400/g, to: 'to-blue-400' },
    { from: /bg-purple-600/g, to: 'bg-blue-600' },
    { from: /bg-purple-700/g, to: 'bg-blue-700' },
    { from: /bg-purple-500/g, to: 'bg-blue-500' },
    { from: /bg-purple-400/g, to: 'bg-blue-400' },
    { from: /bg-purple-300/g, to: 'bg-blue-300' },
    { from: /bg-purple-50/g, to: 'bg-blue-50' },
    { from: /bg-purple-900/g, to: 'bg-blue-900' },
    { from: /bg-purple-950/g, to: 'bg-blue-950' },
    { from: /text-purple-600/g, to: 'text-blue-600' },
    { from: /text-purple-500/g, to: 'text-blue-500' },
    { from: /text-purple-400/g, to: 'text-blue-400' },
    { from: /text-purple-300/g, to: 'text-blue-300' },
    { from: /text-purple-200/g, to: 'text-blue-200' },
    { from: /border-purple-600/g, to: 'border-blue-600' },
    { from: /border-purple-500/g, to: 'border-blue-500' },
    { from: /border-purple-400/g, to: 'border-blue-400' },
    { from: /border-purple-300/g, to: 'border-blue-300' },
    { from: /border-purple-200/g, to: 'border-blue-200' },
    { from: /ring-purple-400/g, to: 'ring-blue-400' },
    { from: /shadow-purple-500/g, to: 'shadow-blue-500' },
    { from: /rgb\(168,\s*85,\s*247\)/g, to: '#2563eb' },
    { from: /rgb\(147,\s*51,\s*234\)/g, to: '#1d4ed8' },
    { from: /rgb\(236,\s*72,\s*153\)/g, to: '#06b6d4' },
    { from: /rgba\(168,\s*85,\s*247/g, to: 'rgba(37, 99, 235' },
    { from: /rgba\(147,\s*51,\s*234/g, to: 'rgba(29, 78, 216' },
    { from: /rgba\(236,\s*72,\s*153/g, to: 'rgba(6, 182, 212' },
    { from: /purple/g, to: 'blue' } // catch remaining purple if any
];

function walkDir(currentPath) {
    const files = fs.readdirSync(currentPath);
    for (const file of files) {
        const fullPath = path.join(currentPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.css')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            for (const rep of replacements) {
                if (rep.from.test(content)) {
                    content = content.replace(rep.from, rep.to);
                    modified = true;
                }
            }
            if (modified) {
                fs.writeFileSync(fullPath, content);
                console.log('Updated', fullPath);
            }
        }
    }
}

walkDir(dir);
console.log('Done!');
