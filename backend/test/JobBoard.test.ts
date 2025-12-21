import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { network } from 'hardhat';
import { getAddress } from 'viem';
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
      const { jobBoard, owner } = await networkHelpers.loadFixture(deployJobBoardFixture);
      const contractOwner = (await jobBoard.read.owner()) as string;
      assert.strictEqual(contractOwner.toLowerCase(), owner.account.address.toLowerCase());
    });
  });

  describe('CreateJob', () => {
    it('should create a job with correct properties', async () => {
      const { jobBoard, owner, publicClient } = await networkHelpers.loadFixture(deployJobBoardFixture);
      const dailyRate = 500;
      const description = 'Développeur Solidity senior';

      // ACT : Créer le job
      const hash = await jobBoard.write.createJob([dailyRate, description]);

      // Attendre la confirmation de la transaction
      await publicClient.waitForTransactionReceipt({ hash });

      // ASSERT : Vérifier que le job existe avec les bonnes propriétés
      const job = (await jobBoard.read.getJob([1])) as any;

      assert.strictEqual(job.id, 1);
      assert.strictEqual(job.dailyRate, dailyRate);
      assert.strictEqual(job.description, description);
      assert.strictEqual(job.author.toLowerCase(), owner.account.address.toLowerCase());
      assert.strictEqual(job.isActive, true);
      assert.strictEqual(job.statut, 0); // Status.Open = 0
    });

    // Test case to verify that the NewJob event is emitted when a job is created
    it('should emit NewJob event #1', async () => {
      const { jobBoard, owner } = await networkHelpers.loadFixture(deployJobBoardFixture);

      const dailyRate = 500;
      const description = 'Développeur Solidity senior';

      await viem.assertions.emitWithArgs(
        jobBoard.write.createJob([dailyRate, description]), // La transaction directement
        jobBoard, // Le contrat
        'NewJob',
        [1, getAddress(owner.account.address), dailyRate, description]
      );
    });

    // Alternative test case to verify NewJob event emission by checking transaction logs
    it('should emit NewJob event #2', async () => {
      const { jobBoard, owner, publicClient } = await networkHelpers.loadFixture(deployJobBoardFixture);

      const dailyRate = 500;
      const description = 'Développeur Solidity senior';

      // Créer le job et récupérer le hash
      const hash = await jobBoard.write.createJob([dailyRate, description]);

      // Attendre la transaction
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      // Vérifier qu'au moins 1 événement a été émis
      assert.ok(receipt.logs.length > 0, 'Aucun événement émis');

      // Vérifier que le job a bien été créé avec les bonnes valeurs
      const job = (await jobBoard.read.getJob([1])) as any;
      assert.strictEqual(job.author.toLowerCase(), owner.account.address.toLowerCase());
      assert.strictEqual(Number(job.dailyRate), dailyRate);
      assert.strictEqual(job.description, description);
    });

    // Verifies that creating multiple jobs correctly increments the internal job counter by checking the total count
    it('should increment job counter compare length of jobs', async () => {
      // ARRANGE
      const { jobBoard } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // ACT : Créer 3 jobs
      await jobBoard.write.createJob([500, 'Job 1']);
      await jobBoard.write.createJob([600, 'Job 2']);
      await jobBoard.write.createJob([700, 'Job 3']);

      // ASSERT : Vérifier qu'il y a bien 3 jobs
      const allJobs = (await jobBoard.read.getAllJobs()) as any[];
      assert.strictEqual(allJobs.length, 3);
    });

    // Verifies that job IDs are correctly incremented sequentially (1, 2, 3) when creating multiple jobs
    it('should increment job counter compare the id of each job', async () => {
      const { jobBoard } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // Créer 3 jobs
      await jobBoard.write.createJob([500, 'Job 1']);
      await jobBoard.write.createJob([600, 'Job 2']);
      await jobBoard.write.createJob([700, 'Job 3']);

      // Récupérer tous les jobs
      const allJobs = (await jobBoard.read.getAllJobs()) as any[];

      // Vérifier qu'il y a bien 3 jobs
      assert.strictEqual(allJobs.length, 3);

      // Bonus : vérifier que les IDs sont bien 1, 2, 3
      assert.strictEqual(Number(allJobs[0].id), 1);
      assert.strictEqual(Number(allJobs[1].id), 2);
      assert.strictEqual(Number(allJobs[2].id), 3);
    });
  });
});
