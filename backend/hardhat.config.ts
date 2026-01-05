import { HardhatUserConfig } from 'hardhat/config';
import hardhatViem from '@nomicfoundation/hardhat-viem';
import hardhatViemAssertions from '@nomicfoundation/hardhat-viem-assertions';
import hardhatNodeTestRunner from '@nomicfoundation/hardhat-node-test-runner';
import hardhatNetworkHelpers from '@nomicfoundation/hardhat-network-helpers';
import '@nomicfoundation/hardhat-toolbox-viem';
import '@nomicfoundation/hardhat-ignition-viem';

const config: HardhatUserConfig = {
  plugins: [hardhatViem, hardhatViemAssertions, hardhatNodeTestRunner, hardhatNetworkHelpers],
  solidity: {
    version: '0.8.28',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
      type: 'http',
    },
    // Sepolia (pour plus tard)
    // sepolia: {
    //   url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
    //   accounts: [PRIVATE_KEY],
    // },
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
};

export default config;
