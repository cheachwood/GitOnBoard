import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet, sepolia, hardhat } from 'wagmi/chains';

const projectId = 'ad38cec08cd7bae3d98d77576f6d5f8b';

// Configuration de l'adaptateur Wagmi pour AppKit
export const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet, sepolia, hardhat],
  projectId,
});

// Création de l'instance AppKit
createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet, sepolia, hardhat],
  projectId,
  metadata: {
    name: 'GitOnJob',
    description: 'Web3 Jobs Board',
    url: 'https://gitonjob.com',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
  },
  features: {
    analytics: true,
  },
});
