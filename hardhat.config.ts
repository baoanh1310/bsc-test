import "@nomicfoundation/hardhat-toolbox";
import { config as dotenvConfig } from "dotenv";
import type { HardhatUserConfig } from "hardhat/config";
import type { NetworkUserConfig } from "hardhat/types";
import { resolve } from "path";

require("@nomicfoundation/hardhat-chai-matchers");

const dotenvConfigPath: string = process.env.DOTENV_CONFIG_PATH || "./.env";
dotenvConfig({ path: resolve(__dirname, dotenvConfigPath) });

// Ensure that we have all the environment variables we need.
const mnemonic: string | undefined = process.env.MNEMONIC;
if (!mnemonic) {
  throw new Error("Please set your MNEMONIC in a .env file");
}

const chainIds = {
  "arbitrum-mainnet": 42161,
  avalanche: 43114,
  goerli: 5,
  hardhat: 31337,
  mainnet: 1,
  "optimism-mainnet": 10,
  polygonMumbai: 80001,
  "bsc-testnet": 97,
  klaytnBaobab: 1001,
  bsc: 56,
  ethereum: 1,
  polygon: 137,
  klaytn: 8217,
};

function getChainConfig(chain: keyof typeof chainIds): NetworkUserConfig {
  let jsonRpcUrl: string;
  // let accounts: any;
  switch (chain) {
    case "avalanche":
      jsonRpcUrl = "https://api.avax.network/ext/bc/C/rpc";
      break;
    case "bsc-testnet":
      jsonRpcUrl = "https://data-seed-prebsc-1-s1.binance.org:8545/";
      break;
    case "goerli":
      jsonRpcUrl = "https://ethereum-goerli-rpc.allthatnode.com";
      break;
    case "polygonMumbai":
      jsonRpcUrl =
        "https://polygon-mumbai.g.alchemy.com/v2/";
      break;
    case "klaytnBaobab":
      jsonRpcUrl = "https://api.baobab.klaytn.net:8651";
      break;
    case "bsc":
      jsonRpcUrl = "https://bsc-dataseed.binance.org/";
      break;
    case "ethereum":
      jsonRpcUrl = "https://eth.llamarpc.com";
      break;
    case "polygon":
      jsonRpcUrl = "https://rpc.ankr.com/polygon";
      break;
    case "klaytn":
      jsonRpcUrl = "https://public-node-api.klaytnapi.com/v1/cypress";
      break;
    default:
      jsonRpcUrl = "";
  }
  return {
    accounts: [process.env.ADMIN_PRIVATE_KEY || ""],
    chainId: chainIds[chain],
    url: jsonRpcUrl,
  };
}

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey: {
      arbitrumOne: process.env.ARBISCAN_API_KEY || "",
      avalanche: process.env.SNOWTRACE_API_KEY || "",
      bscTestnet: process.env.BSCSCAN_API_KEY || "",
      goerli: process.env.ETHERSCAN_API_KEY || "",
      mainnet: process.env.ETHERSCAN_API_KEY || "",
      optimisticEthereum: process.env.OPTIMISM_API_KEY || "",
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || "",
      bsc: process.env.BSCSCAN_API_KEY || "",
      ethereum: process.env.ETHERSCAN_API_KEY || "",
      polygon: process.env.POLYGONSCAN_API_KEY || "",
    },
  },
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
    src: "./contracts",
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic,
      },
      chainId: chainIds.hardhat,
    },
    arbitrum: getChainConfig("arbitrum-mainnet"),
    avalanche: getChainConfig("avalanche"),
    bscTestnet: getChainConfig("bsc-testnet"),
    goerli: getChainConfig("goerli"),
    mainnet: getChainConfig("mainnet"),
    optimism: getChainConfig("optimism-mainnet"),
    polygonMumbai: getChainConfig("polygonMumbai"),
    klaytnBaobab: getChainConfig("klaytnBaobab"),
    bsc: getChainConfig("bsc"),
    ethereum: getChainConfig("ethereum"),
    polygon: getChainConfig("polygon"),
    klaytn: getChainConfig("klaytn"),
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    version: "0.8.6",
    settings: {
      // metadata: {
      //   // Not including the metadata hash
      //   // https://github.com/paulrberg/hardhat-template/issues/31
      //   bytecodeHash: "none",
      // },
      // Disable the optimizer when debugging
      // https://hardhat.org/hardhat-network/#solidity-optimizer-support
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  typechain: {
    outDir: "types",
    target: "ethers-v5",
  },
};

export default config;