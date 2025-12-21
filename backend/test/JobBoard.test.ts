import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { network } from 'hardhat';

const { viem, networkHelpers } = await network.connect();

describe('JobBoard', () => {
  async function deployJobBoardFixture() {
    const jobBoard = await viem.deployContract('JobBoard');
    const wallets = await viem.getWalletClients();
    const [owner, user1, user2] = wallets;
    const publicClient = await viem.getPublicClient();
    
    return { jobBoard, owner, user1, user2, publicClient };
  }

  describe('Deployment', () => {
    it('should set the right owner', async () => {
      // TODO: Test à implémenter
    });
  });
});
