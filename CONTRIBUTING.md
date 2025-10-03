# How to Contribute to getBlobs Token List

We welcome contributions to expand our token list. This document provides all the necessary information for you to get started.

## How to Add a New Token

To add a new token, please follow these steps:

1.  **Fork the repository.**
2.  **Add the token file:**
    -   Navigate to the `tokens/<chainId>` directory for the appropriate chain. For example, for Binance Smart Chain, use `tokens/56`. If the directory for the chain doesn't exist, feel free to create it.
    -   Create a new JSON file named after the token's contract address (e.g., `0x<address>.json`). The filename must be checksummed.
    -   The content of the file should be a JSON object with the following structure:
        ```json
        {
            "chainId": 56,
            "address": "TOKEN_CONTRACT_ADDRESS",
            "name": "Token Name",
            "symbol": "TKN",
            "decimals": 18,
            "logoURI": "URL_TO_TOKEN_LOGO_IMAGE",
            "cmcLinkKey": "coinmarketcap_slug"
        }
        ```
3.  **Submit a Pull Request:**
    -   Commit your changes and push them to your fork.
    -   Open a pull request to the `main` branch of this repository.
    -   Please ensure your PR includes only the addition of the new token file.

Our team will review your submission, and once approved, it will be merged. The main token list files are updated automatically.

## How to Use This List

The token list is available as an npm package. To use it in your project, install it via npm:

```bash
npm install @getblobs/token-list
```

Then you can import the JSON file in your application:

```javascript
import tokenList from '@getblobs/token-list';
// or
const tokenList = require('@getblobs/token-list');

console.log(tokenList.tokens);
```
