const fs = require('fs');
const path = require('path');

const TOKENS_DIR = path.join(__dirname, '../tokens');
const OUTPUT_PATH = path.join(__dirname, '../token-list.json');

function buildTokenList() {
  const tokenList = {
    name: 'getBlobs Token List',
    timestamp: new Date().toISOString(),
    version: {
      major: 1,
      minor: 0,
      patch: 0,
    },
    tokens: [],
  };

  const chainDirs = fs.readdirSync(TOKENS_DIR);

  for (const chainDir of chainDirs) {
    const chainPath = path.join(TOKENS_DIR, chainDir);
    if (fs.statSync(chainPath).isDirectory()) {
      const tokenFiles = fs.readdirSync(chainPath);

      for (const tokenFile of tokenFiles) {
        if (tokenFile.endsWith('.json')) {
          const tokenPath = path.join(chainPath, tokenFile);
          const tokenData = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
          tokenList.tokens.push(tokenData);
        }
      }
    }
  }

  // Sort tokens by symbol
  tokenList.tokens.sort((a, b) => a.symbol.localeCompare(b.symbol));

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(tokenList, null, 2));
  console.log(`✅ Token list built successfully with ${tokenList.tokens.length} tokens.`);
}

buildTokenList();
