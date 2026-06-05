const fs = require('fs');
const readline = require('readline');
const path = require('path');

const logPath = 'C:\\Users\\aksha\\.gemini\\antigravity-ide\\brain\\4d17cbe5-6f79-42c1-8fe0-c8598f9dd338\\.system_generated\\logs\\transcript.jsonl';
const outDir = 'c:\\Users\\aksha\\OneDrive\\Documents\\musical\\music-app\\src';

const EXCLUDE_FILES = [
  'MobilePlayer.tsx',
  'MobileBottomNav.tsx',
  'globals.css',
  'layout.tsx',
  'providers.tsx',
  'template.tsx',
  'not-found.tsx',
  'usePlayerStore.ts',
  'useLibraryStore.ts',
  'api.ts',
  'utils.ts',
  'useDebounce.ts'
].map(f => f.toLowerCase());

// Let's specifically target the ones we know were lost and haven't been restored manually.
// e.g. AiMoodMixModal.tsx, Sidebar.tsx, RightPlayer.tsx, AudioEngine.tsx, DesktopBottomPlayer.tsx

async function extractFiles() {
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const fileContentsMap = new Map();

  for await (const line of rl) {
    try {
      const obj = JSON.parse(line);
      if (obj.type === 'VIEW_FILE' && obj.status === 'DONE') {
        const content = obj.content;
        
        const pathMatch = content.match(/File Path: `file:\/\/\/(.+?)`/);
        if (!pathMatch) continue;
        
        const filePath = decodeURIComponent(pathMatch[1]).replace(/\//g, '\\');
        
        if (!filePath.toLowerCase().includes('music-app\\src\\')) {
          continue;
        }

        const fileName = path.basename(filePath).toLowerCase();
        
        // Exclude files I have already restored/rewritten
        if (EXCLUDE_FILES.includes(fileName) || filePath.includes('app\\page.tsx') || filePath.includes('search\\page.tsx')) {
          continue;
        }

        const lines = content.split('\n');
        let isCode = false;
        let extractedCode = [];
        
        for (const l of lines) {
          if (l.startsWith('1: ')) {
            isCode = true;
          }
          if (l === 'The above content shows the entire, complete file contents of the requested file.') {
            isCode = false;
          }
          if (isCode) {
            extractedCode.push(l.replace(/^\d+:\s?/, ''));
          }
        }
        
        if (extractedCode.length > 0) {
          fileContentsMap.set(filePath, extractedCode.join('\n'));
        }
      }
    } catch (e) {
      // ignore
    }
  }

  for (const [filePath, finalCode] of fileContentsMap.entries()) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, finalCode, 'utf8');
    console.log('Restored:', filePath);
  }
}

extractFiles();
