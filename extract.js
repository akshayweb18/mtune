const fs = require('fs');
const readline = require('readline');
const path = require('path');

const logPath = 'C:\\Users\\aksha\\.gemini\\antigravity-ide\\brain\\4d17cbe5-6f79-42c1-8fe0-c8598f9dd338\\.system_generated\\logs\\transcript.jsonl';
const outDir = 'c:\\Users\\aksha\\OneDrive\\Documents\\musical\\music-app\\src';

async function extractFiles() {
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    try {
      const obj = JSON.parse(line);
      if (obj.type === 'VIEW_FILE' && obj.status === 'DONE') {
        const content = obj.content;
        
        // Find the file path
        const pathMatch = content.match(/File Path: `file:\/\/\/(.+?)`/);
        if (!pathMatch) continue;
        
        // Decode URI component (for spaces, etc) and replace forward slashes with backslashes
        const filePath = decodeURIComponent(pathMatch[1]).replace(/\//g, '\\');
        
        if (!filePath.includes('music-app\\src\\components\\layout\\Sidebar.tsx') &&
            !filePath.includes('music-app\\src\\components\\layout\\RightPlayer.tsx') &&
            !filePath.includes('music-app\\src\\components\\player\\AudioEngine.tsx') &&
            !filePath.includes('music-app\\src\\components\\player\\DesktopBottomPlayer.tsx')) {
          continue;
        }

        console.log('Found:', filePath);
        
        // Extract the code block
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
            // Remove line numbers (e.g. "12: ")
            extractedCode.push(l.replace(/^\d+:\s?/, ''));
          }
        }
        
        const finalCode = extractedCode.join('\n');
        
        // Make sure directory exists
        const dir = path.dirname(filePath);
        fs.mkdirSync(dir, { recursive: true });
        
        // Write the file
        fs.writeFileSync(filePath, finalCode, 'utf8');
        console.log('Restored:', filePath);
      }
    } catch (e) {
      // ignore JSON parse error
    }
  }
}

extractFiles();
