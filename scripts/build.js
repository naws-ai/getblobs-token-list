const fs = require('fs');
const path = require('path');

const TOKENS_DIR = path.join(__dirname, '../tokens');
const OUTPUT_JSON_PATH = path.join(__dirname, '../token-list.json');
const README_PATH = path.join(__dirname, '../README.md');
// SUPPORTED_TOKENS.md is now the README
// const SUPPORTED_TOKENS_MD_PATH = path.join(__dirname, '../SUPPORTED_TOKENS.md'); 

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

  // Sort tokens by symbol, but keep NAWS at the top
  const nawsToken = tokenList.tokens.find(t => t.symbol === 'NAWS');
  const otherTokens = tokenList.tokens.filter(t => t.symbol !== 'NAWS');
  otherTokens.sort((a, b) => a.symbol.localeCompare(b.symbol));
  if (nawsToken) {
    tokenList.tokens = [nawsToken, ...otherTokens];
  } else {
    tokenList.tokens = otherTokens;
  }

  // Write JSON file
  fs.writeFileSync(OUTPUT_JSON_PATH, JSON.stringify(tokenList, null, 2));
  console.log(`✅ Token list JSON built successfully with ${tokenList.tokens.length} tokens.`);

  // Generate and write Markdown file for README
  const markdownTable = generateMarkdownTable(tokenList.tokens);
  fs.writeFileSync(README_PATH, markdownTable);
  console.log(`✅ README.md built successfully with token list.`);
}

function generateMarkdownTable(tokens) {
  let markdown = `### Supported Token List on GetBlobs\n\n`;
  markdown += `Below is a list of tokens currently supported on Binance Smart Chain (Chain ID: 56).\n\n`;
  markdown += `> **Note**: Tokens without DEX liquidity may be removed from the supported list.\n\n`;
  markdown += `| Logo | Symbol | Name | Token Contract | CMC Link |\n`;
  markdown += `| :--- | :--- | :--- | :--- | :--- |\n`;

  for (const token of tokens) {
    const isNative = token.address === '0x0000000000000000000000000000000000000000';
    const contractLink = isNative
      ? 'Native Token'
      : `[BSC Scan ↗](https://bscscan.com/token/${token.address})`;
    const cmcLink = `[View on CMC ↗](https://coinmarketcap.com/currencies/${token.cmcLinkKey})`;

    markdown += `| <img src="${token.logoURI}" width="24"> | ${token.symbol} | ${token.name} | ${contractLink} | ${cmcLink} |\n`;
  }

  markdown += `\n---\n\n`;
  markdown += `To request the addition of a new token, please contact [official@naws.ai](mailto:official@naws.ai) or [submit a request on GitHub](https://github.com/naws-ai/getblobs-token-list/blob/main/CONTRIBUTING.md).\n`;

  return markdown;
}

buildTokenList();
