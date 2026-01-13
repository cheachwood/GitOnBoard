import { http, createConfig } from 'wagmi';
import { mainnet, sepolia, hardhat } from 'wagmi/chains';
import { walletConnect, injected } from '@wagmi/connectors';

export const config = createConfig({
  chains: [mainnet, sepolia, hardhat],
  connectors: [
    injected(),
    walletConnect({
      projectId: 'ad38cec08cd7bae3d98d77576f6d5f8b',
      showQrModal: false, // AppKit gère le modal
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [hardhat.id]: http('http://127.0.0.1:8545'),

  },
});
