const fs = require('fs');
const path = require('path');
const deps = new Set();

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const regex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
      let match;
      while ((match = regex.exec(content)) !== null) {
        let pkg = match[1];
        if (!pkg.startsWith('.') && !pkg.startsWith('@/')) {
          const parts = pkg.split('/');
          let mainPkg = parts[0];
          if (mainPkg.startsWith('@')) mainPkg = parts[0] + '/' + parts[1];
          deps.add(mainPkg);
        }
      }
    }
  }
}

walk('./src');
console.log(Array.from(deps).join('\n'));
