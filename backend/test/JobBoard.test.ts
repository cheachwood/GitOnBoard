import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { network } from 'hardhat';
import { getAddress } from 'viem';
const { viem, networkHelpers } = await network.connect();

/// Enum representing the status of a job
enum Status {
  Open = 0,
  InProgress = 1,
  Completed = 2,
  Cancelled = 3,
}

/// ---------------------------- JobBoard Tests ---------------------------- ///
/// Test suite for the JobBoard smart contract
describe('JobBoard', () => {
  /// ---------------------------- Fixture Deployment ---------------------------- ///
  /// Fixture to deploy the JobBoard contract and set up test accounts
  /// Returns the deployed contract instance and test accounts
  /// Used in beforeEach hooks to ensure a fresh contract state for each test
  async function deployJobBoardFixture() {
    const jobBoard = await viem.deployContract('JobBoard');
    const wallets = await viem.getWalletClients();
    const [owner, user1, user2, user3] = wallets;
    const publicClient = await viem.getPublicClient();

    return { jobBoard, owner, user1, user2, user3, publicClient };
  }

  /// ---------------------------- Deployment ---------------------------- ///
  /// Tests for the deployment of the JobBoard contract
  describe('Deployment', () => {
    it('should set the right owner', async () => {
      const { jobBoard, owner } = await networkHelpers.loadFixture(deployJobBoardFixture);
      const contractOwner = (await jobBoard.read.owner()) as string;
      assert.strictEqual(getAddress(contractOwner), getAddress(owner.account.address));
    });

    it('should start with zero jobs', async () => {
      // ARRANGE
      const { jobBoard } = await networkHelpers.loadFixture(deployJobBoardFixture);
      // ACT: Get all jobs
      const allJobs = (await jobBoard.read.getAllJobs()) as any[];
      // ASSERT: Verify that no jobs exist initially
      assert.strictEqual(Number(allJobs.length), 0);
    });
  });

  /// ---------------------------- CreateJob ---------------------------- ///
  /// Tests for the createJob function which creates a new job posting
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
      assert.strictEqual(job.status, 0); // Status.Open = 0
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

      // ACT : Create the job
      const hash = await jobBoard.write.createJob([dailyRate, description]);

      // ACT : Wait for transaction confirmation
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      // ACT : Check that logs are present in the receipt
      assert.ok(receipt.logs.length > 0, 'Aucun événement émis');

      // ASSERT : Vérifier que l'événement NewJob a été émis avec les bons arguments
      const job = (await jobBoard.read.getJob([1])) as any;
      assert.strictEqual(getAddress(job.author), getAddress(owner.account.address));
      assert.strictEqual(Number(job.dailyRate), dailyRate);
      assert.strictEqual(job.description, description);
    });

    // Verifies that creating multiple jobs correctly increments the internal job counter by checking the total count
    it('should increment job counter', async () => {
      // ARRANGE
      const { jobBoard } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // ACT : Creater 3 jobs
      await jobBoard.write.createJob([500, 'Job 1']);
      await jobBoard.write.createJob([600, 'Job 2']);
      await jobBoard.write.createJob([700, 'Job 3']);

      // ACT : Retrieve all jobs
      const allJobs = (await jobBoard.read.getAllJobs()) as any[];

      // ASSERT : Verify that 3 jobs exist
      assert.strictEqual(allJobs.length, 3);
    });

    // Verifies that job IDs are correctly incremented sequentially (1, 2, 3) when creating multiple jobs
    it('should assign sequential IDs to jobs', async () => {
      // ARRANGE
      const { jobBoard } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // ACT : Creater 3 jobs
      await jobBoard.write.createJob([500, 'Job 1']);
      await jobBoard.write.createJob([600, 'Job 2']);
      await jobBoard.write.createJob([700, 'Job 3']);

      // ACT : Retrieve all jobs
      const allJobs = (await jobBoard.read.getAllJobs()) as any[];

      // ASSERT : Verify that 3 jobs exist
      assert.strictEqual(allJobs.length, 3);

      // ASSERT: Verify that job IDs are 1, 2, 3
      assert.strictEqual(Number(allJobs[0].id), 1);
      assert.strictEqual(Number(allJobs[1].id), 2);
      assert.strictEqual(Number(allJobs[2].id), 3);
    });

    it('should allow different users to create jobs', async () => {
      // ARRANGE
      const { jobBoard, owner, user1 } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // ACT: Owner is creating a job
      await jobBoard.write.createJob([500, 'Job 1']);

      // ACT: user1 creates a job
      await jobBoard.write.createJob([600, 'Job 2'], { account: user1.account });

      // ACT: Retrieve both jobs
      const job1 = (await jobBoard.read.getJob([1])) as any;
      const job2 = (await jobBoard.read.getJob([2])) as any;

      // ASSERT: Verify that authors are correct
      assert.strictEqual(getAddress(job1.author), getAddress(owner.account.address));
      assert.strictEqual(getAddress(job2.author), getAddress(user1.account.address));
    });
  });

  /// ---------------------------- AssignedCandidate ---------------------------- ///
  /// Tests for the assigneCandidate function which assigns a candidate to a job
  describe('AssignedCandidate', () => {
    it('should assigned a candidate to a job', async () => {
      // ARRANGE
      const { jobBoard, user1 } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // ACT: Owner is creating a job
      await jobBoard.write.createJob([500, 'Job 1']);
      await jobBoard.write.assigneCandidate([1, 'Jean', 'Jean@gmail.com'], { account: user1.account });

      // ACT: Retrieve the job
      const job1 = (await jobBoard.read.getJob([1])) as any;

      // ASSERT : Verify if job is assigned to user1
      assert.strictEqual(getAddress(job1.candidate), getAddress(user1.account.address));
    });

    it('should allow multiple users to apply to different jobs', async () => {
      // ARRANGE
      const { jobBoard, user1, user2, user3 } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // ACT: Owner is creating jobs
      await jobBoard.write.createJob([500, 'Job 1']);
      await jobBoard.write.createJob([800, 'Job 2']);
      await jobBoard.write.createJob([1000, 'Job 3']);

      // Users assigned to jobs
      await jobBoard.write.assigneCandidate([1, 'Jean', 'Jean@gmail.com'], { account: user1.account });
      await jobBoard.write.assigneCandidate([2, 'Alice', 'alice@gmail.com'], { account: user2.account });
      await jobBoard.write.assigneCandidate([3, 'Pierre', 'Pierre@gmail.com'], { account: user3.account });

      const job1 = (await jobBoard.read.getJob([1])) as any;
      const job2 = (await jobBoard.read.getJob([2])) as any;
      const job3 = (await jobBoard.read.getJob([3])) as any;

      // ASSERT : Verify if jobs are assigned to jobs
      assert.strictEqual(getAddress(job1.candidate), getAddress(user1.account.address));
      assert.strictEqual(getAddress(job2.candidate), getAddress(user2.account.address));
      assert.strictEqual(getAddress(job3.candidate), getAddress(user3.account.address));
    });

    it('should emit CandidateAssigned event', async () => {
      // ARRANGE
      const { jobBoard, user1 } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // ACT: Owner is creating a job
      await jobBoard.write.createJob([500, 'Job 1']);

      // ASSERT: user1 assigned himself as a candidate, his informations are emited
      await viem.assertions.emitWithArgs(jobBoard.write.assigneCandidate([1, 'Jean', 'Jean@gmail.com'], { account: user1.account }), jobBoard, 'CandidateAssigned', [1, getAddress(user1.account.address), 'Jean', 'Jean@gmail.com']);
    });

    it('should revert when candidate name is empty', async () => {
      // ARRANGE
      const { jobBoard, user1 } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // ACT: Owner is creating a job
      await jobBoard.write.createJob([500, 'Job 1']);

      //  ASSERT: Calling assigneCandidate with an empty name
      await viem.assertions.revertWithCustomError(jobBoard.write.assigneCandidate([1, '', 'Jean@gmail.com'], { account: user1.account }), jobBoard, 'CandidateNameEmpty');
    });

    it('should revert when candidate email is empty', async () => {
      // ARRANGE
      const { jobBoard, user1 } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // ACT: Owner is creating a job
      await jobBoard.write.createJob([500, 'Job 1']);

      //  ASSERT: Calling assigneCandidate with an empty email
      await viem.assertions.revertWithCustomError(jobBoard.write.assigneCandidate([1, 'Jean', ''], { account: user1.account }), jobBoard, 'CandidateEmailEmpty');
    });

    it('should revert when job does not exist with id 999', async () => {
      // ARRANGE
      const { jobBoard, user1 } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // Calling assigneCandidate to a job with id 999
      await viem.assertions.revertWithCustomError(jobBoard.read.getJob([999]), jobBoard, 'JobDoesNotExist');
    });

    it('should revert when job is not open', async () => {
      // ARRANGE
      const { jobBoard, user1 } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // ACT:
      await jobBoard.write.createJob([500, 'Job 1']);
      jobBoard.write.changeJobStatus([1, Status.Cancelled]);

      //  ASSERT: Calling assigneCandidate when Status is InProgress
      await viem.assertions.revertWithCustomError(jobBoard.write.assigneCandidate([1, 'Jean', 'Jean@gmail.com'], { account: user1.account }), jobBoard, 'JobNotOpenForAssignment');
    });

    it('should revert when candidate already assigned', async () => {
      // ARRANGE
      const { jobBoard, user1 } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // ACT: create job and assign candidate
      await jobBoard.write.createJob([500, 'Job 1']);
      await jobBoard.write.assigneCandidate([1, 'Jean', 'Jean@gmail.com'], { account: user1.account });

      //  ASSERT: Calling assigneCandidate when Status is InProgress
      await viem.assertions.revertWithCustomError(jobBoard.write.assigneCandidate([1, 'Jean', 'Jean@gmail.com'], { account: user1.account }), jobBoard, 'CandidateAlreadyAssigned');
    });

    it('should revert when trying to apply to own job', async () => {
      // ARRANGE
      const { jobBoard, user1 } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // ACT: user1 is creating a job
      await jobBoard.write.createJob([500, 'Job 1'], { account: user1.account });

      //  ASSERT: Calling assigneCandidate when trying to apply to own job
      await viem.assertions.revertWithCustomError(jobBoard.write.assigneCandidate([1, 'Jean', 'Jean@gmail.com'], { account: user1.account }), jobBoard, 'CannotApplyToOwnJob');
    });
  });

  /// ---------------------------- getJob ---------------------------- ///
  /// Tests for the getJob function which retrieves a job by its ID
  describe('getJob', () => {
    it('should revert when job does not exist', async () => {
      // ARRANGE
      const { jobBoard, user1 } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // ASSERT: Calling getJob with a non-existing job ID
      await viem.assertions.revertWithCustomError(jobBoard.write.assigneCandidate([1, 'Jean', 'Jean@gmail.com'], { account: user1.account }), jobBoard, 'JobDoesNotExist');
    });
  });

  /// ---------------------------- getActiveJobs ---------------------------- ///
  /// Tests for the getActiveJobs function which returns only active jobs
  describe('getActiveJobs ', () => {
    it('should return only isActive jobs', async () => {
      // ARRANGE
      const { jobBoard, user1 } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // ACT: Create 3 jobs, deactivate the 2nd one
      await jobBoard.write.createJob([500, 'Job 1']);
      await jobBoard.write.createJob([500, 'Job 2']);
      await jobBoard.write.createJob([500, 'Job 3']);
      await jobBoard.write.toggleJobActive([2]);

      // ACT: Get active jobs
      const activeJobs = (await jobBoard.read.getActiveJobs()) as any[];

      // ASSERT: Verify that only active jobs are returned
      assert.strictEqual(activeJobs.length, 2);
    });

    it('should not return inactive jobs', async () => {
      // ARRANGE
      const { jobBoard, user1 } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // ACT: Create 3 jobs, deactivate the 2nd and 3rd one
      await jobBoard.write.createJob([500, 'Job 1']);
      await jobBoard.write.createJob([500, 'Job 2']);
      await jobBoard.write.createJob([500, 'Job 3']);
      await jobBoard.write.toggleJobActive([2]);
      await jobBoard.write.toggleJobActive([3]);

      // ACT: Get active jobs
      const activeJobs = (await jobBoard.read.getActiveJobs()) as any[];

      // ASSERT: Verify that only active jobs are returned
      assert.strictEqual(activeJobs.length, 1);
      assert.strictEqual(Number(activeJobs[0].id), 1);
    });

    it('should return empty array when no active jobs', async () => {
      // ARRANGE
      const { jobBoard, user1 } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // ACT: Create 3 jobs, deactivate the 1st, 2nd and 3rd one
      await jobBoard.write.createJob([500, 'Job 1']);
      await jobBoard.write.createJob([500, 'Job 2']);
      await jobBoard.write.createJob([500, 'Job 3']);
      await jobBoard.write.toggleJobActive([1]);
      await jobBoard.write.toggleJobActive([2]);
      await jobBoard.write.toggleJobActive([3]);

      // ACT: Get active jobs
      const activeJobs = (await jobBoard.read.getActiveJobs()) as any[];

      // ASSERT: Verify that only active jobs are returned
      assert.strictEqual(activeJobs.length, 0);
    });

    it('should return only active jobs when mix of active and inactive', async () => {
      // ARRANGE
      const { jobBoard, user1 } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // ACT: Create 3 jobs, deactivate the 1st, 2nd and 3rd one
      await jobBoard.write.createJob([500, 'Job 1']);
      await jobBoard.write.createJob([500, 'Job 2']);
      await jobBoard.write.createJob([500, 'Job 3']);
      await jobBoard.write.createJob([500, 'Job 4']);
      await jobBoard.write.createJob([500, 'Job 5']);
      await jobBoard.write.toggleJobActive([2]);
      await jobBoard.write.toggleJobActive([4]);

      // ACT: Get active jobs
      const activeJobs = (await jobBoard.read.getActiveJobs()) as any[];

      // ASSERT: Verify that only active jobs are returned
      assert.strictEqual(activeJobs.length, 3);
      // Verify that all returned jobs are active
      assert.strictEqual(
        activeJobs.every((job) => job.isActive),
        true
      );
    });

    it('should return all active jobs when all jobs are active', async () => {
      // ARRANGE
      const { jobBoard, user1 } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // ACT: Create 3 jobs, deactivate the 1st, 2nd and 3rd one
      await jobBoard.write.createJob([500, 'Job 1']);
      await jobBoard.write.createJob([500, 'Job 2']);
      await jobBoard.write.createJob([500, 'Job 3']);
      await jobBoard.write.createJob([500, 'Job 4']);
      await jobBoard.write.createJob([500, 'Job 5']);

      // ACT: Get active jobs
      const activeJobs = (await jobBoard.read.getActiveJobs()) as any[];

      // ASSERT: Verify that only active jobs are returned
      assert.strictEqual(activeJobs.length, 5);
      // Verify that all returned jobs are active
      assert.strictEqual(
        activeJobs.every((job) => job.isActive),
        true
      );
    });
  });

  /// ---------------------------- getAllJobs ---------------------------- ///
  /// Tests for the getAllJobs function which returns all jobs regardless of their active status
  describe('getAllJobs ', () => {
    it('should return all created jobs', async () => {
      // ARRANGE
      const { jobBoard, user1 } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // ACT: Create 3 jobs
      await jobBoard.write.createJob([500, 'Job 1']);
      await jobBoard.write.createJob([500, 'Job 2']);
      await jobBoard.write.createJob([500, 'Job 3']);

      // ACT: deactivate the 2nd and 3rd one
      await jobBoard.write.toggleJobActive([2]);
      await jobBoard.write.toggleJobActive([3]);

      // ACT: Get all jobs
      const allJobs = (await jobBoard.read.getAllJobs()) as any[];

      // ASSERT: Verify that all jobs are returned
      assert.strictEqual(allJobs.length, 3);

      // ASSERT: Verify that job IDs are 1, 2, 3
      const ids = allJobs.map((job) => Number(job.id));
      assert.deepStrictEqual(ids, [1, 2, 3]);
    });

    it('should return empty array when no jobs exist', async () => {
      // ARRANGE
      const { jobBoard, user1 } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // ACT: Get all jobs
      const allJobs = (await jobBoard.read.getAllJobs()) as any[];

      // ASSERT: Verify that all jobs are returned
      assert.strictEqual(allJobs.length, 0);
    });

    it('should return jobs regardless of active status', async () => {
      // ARRANGE
      const { jobBoard, user1 } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // ACT: Create 3 jobs
      await jobBoard.write.createJob([500, 'Job 1']);
      await jobBoard.write.createJob([500, 'Job 2']);
      await jobBoard.write.createJob([500, 'Job 3']);
      await jobBoard.write.createJob([500, 'Job 4']);
      await jobBoard.write.createJob([500, 'Job 5']);

      // ACT: deactivate the 2nd and 3rd one
      await jobBoard.write.toggleJobActive([1]);
      await jobBoard.write.toggleJobActive([3]);
      await jobBoard.write.toggleJobActive([5]);

      // ACT: Get all jobs
      const allJobs = (await jobBoard.read.getAllJobs()) as any[];

      // ASSERT: Verify that all jobs are returned
      assert.strictEqual(allJobs.length, 5);

      // ACT: Check for active and inactive jobs
      const hasActiveJobs = allJobs.some((job) => job.isActive === true);
      const hasInactiveJobs = allJobs.some((job) => job.isActive === false);

      // ASSERT: Verify presence of both active and inactive jobs
      assert.strictEqual(hasActiveJobs, true);
      assert.strictEqual(hasInactiveJobs, true);

      // ASSERT: Verify counts of active and inactive jobs
      assert.strictEqual(allJobs.filter((job) => job.isActive === true).length, 2);
      assert.strictEqual(allJobs.filter((job) => job.isActive === false).length, 3);
    });

    it('should return jobs in correct order', async () => {
      // ARRANGE
      const { jobBoard, user1 } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // ACT: Create 3 jobs
      await jobBoard.write.createJob([500, 'Job 1']);
      await jobBoard.write.createJob([500, 'Job 2']);
      await jobBoard.write.createJob([500, 'Job 3']);
      await jobBoard.write.createJob([500, 'Job 4']);
      await jobBoard.write.createJob([500, 'Job 5']);

      // ACT: Get all jobs
      const allJobs = (await jobBoard.read.getAllJobs()) as any[];

      // ASSERT: Verify that all jobs are returned
      assert.strictEqual(allJobs.length, 5);

      // ACT: Check for active and inactive jobs
      const ids = allJobs.map((job) => Number(job.id));

      // ASSERT: Verify that job IDs are 1, 2, 3, 4, 5
      assert.deepStrictEqual(ids, [1, 2, 3, 4, 5]);
    });
  });

  describe('toggleJobActive ', () => {
    it('should toggle job from active to inactive', async () => {
      // ARRANGE
      const { jobBoard } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // ACT: Create 1 inactive job
      await jobBoard.write.createJob([500, 'Job 1']);
      await jobBoard.write.toggleJobActive([1]);
      const allJobs1 = (await jobBoard.read.getAllJobs()) as any[];

      // ASSERT: Verify that a job is inactive jobs are returned
      assert.strictEqual(allJobs1.length, 1);
      assert.strictEqual(allJobs1[0].isActive, false);
    });

    it('should toggle job from inactive to active', async () => {
      // ARRANGE
      const { jobBoard } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // ACT: Create 1 inactive the active job
      await jobBoard.write.createJob([500, 'Job 1']);
      await jobBoard.write.toggleJobActive([1]);
      await jobBoard.write.toggleJobActive([1]);
      const allJobs1 = (await jobBoard.read.getAllJobs()) as any[];

      // ASSERT: Verify that a job is active jobs are returned
      assert.strictEqual(allJobs1.length, 1);
      assert.strictEqual(allJobs1[0].isActive, true);
    });

    it('should emit JobToggled event', async () => {
      // ARRANGE
      const { jobBoard, owner } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // ACT: Create 1 inactive the active job
      await jobBoard.write.createJob([500, 'Job 1']);

      // ASSERT: Verify that a job is active jobs are returned
      await viem.assertions.emitWithArgs(jobBoard.write.toggleJobActive([1], { account: owner.account }), jobBoard, 'JobToggled', [1, false, getAddress(owner.account.address)]);
    });

    it('should revert when job does not exist', async () => {
      // ARRANGE
      const { jobBoard, owner } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // ASSERT: Verify tthat a job is not existing
      await viem.assertions.revertWithCustomError(jobBoard.write.toggleJobActive([999], { account: owner.account }), jobBoard, 'JobDoesNotExist');
    });

    it('should allow owner to toggle any job', async () => {
      // ARRANGE
      const { jobBoard, owner, user1 } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // ACT: user1 is creating a job
      await jobBoard.write.createJob([500, 'Job 1'], { account: user1.account });
      // ACT: owner is toggling user1's job
      await jobBoard.write.toggleJobActive([1], { account: owner.account });

      const allJobs1 = (await jobBoard.read.getAllJobs()) as any[];
      // ASSERT: Verify that a job is inactive jobs are returned
      assert.strictEqual(allJobs1.length, 1);
      assert.strictEqual(allJobs1[0].isActive, false);
    });

    it('should allow author to toggle their own job', async () => {
      // ARRANGE
      const { jobBoard, user1 } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // ACT: user1 is creating a job
      await jobBoard.write.createJob([500, 'Job 1'], { account: user1.account });
      // ACT: user1 is toggling their own job
      await jobBoard.write.toggleJobActive([1], { account: user1.account });

      const allJobs1 = (await jobBoard.read.getAllJobs()) as any[];
      // ASSERT: Verify that a job is inactive jobs are returned
      assert.strictEqual(allJobs1.length, 1);
      assert.strictEqual(allJobs1[0].isActive, false);
    });

    it('should revert when neither author nor owner', async () => {
      // ARRANGE
      const { jobBoard, user1, user2 } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // ACT: user1 is creating a job
      await jobBoard.write.createJob([500, 'Job 1'], { account: user1.account });
      // ASSERT: user2 is trying to toggle user1's job (should fail)
      await viem.assertions.revertWithCustomError(jobBoard.write.toggleJobActive([1], { account: user2.account }), jobBoard, 'OnlyAuthorOrOwnerCanToggle');

      // ACT: owner is creating a job
      await jobBoard.write.createJob([500, 'Job 2']);
      // ASSERT: user2 is trying to toggle user1's job (should fail)
      await viem.assertions.revertWithCustomError(jobBoard.write.toggleJobActive([2], { account: user2.account }), jobBoard, 'OnlyAuthorOrOwnerCanToggle');
    });

    it('should allow multiple toggles', async () => {
      // ARRANGE
      const { jobBoard, user1 } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // ACT: user1 is creating a job
      await jobBoard.write.createJob([500, 'Job 1'], { account: user1.account });
      await jobBoard.write.toggleJobActive([1], { account: user1.account });
      await jobBoard.write.toggleJobActive([1], { account: user1.account });
      await jobBoard.write.toggleJobActive([1], { account: user1.account });
      const allJobs1 = (await jobBoard.read.getAllJobs()) as any[];

      // ASSERT: Verify that a job is inactive jobs are returned
      assert.strictEqual(allJobs1.length, 1);
      assert.strictEqual(allJobs1[0].isActive, false);
    });
  });

  describe('changeJobStatus ', () => {
    it('should change status from Open to InProgress', async () => {
      // ARRANGE
      const { jobBoard, user1 } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // ACT: Create 1 inactive job
      await jobBoard.write.createJob([500, 'Job 1']);
      await jobBoard.write.assigneCandidate([1, 'Jean', 'jean@example.com'], { account: user1.account });
      await jobBoard.write.changeJobStatus([1, Status.InProgress]);

      // ACT: Retrieve the job
      const job = (await jobBoard.read.getJob([1])) as any;
      // ASSERT: Verify that job status is InProgress
      assert.strictEqual(job.status, Status.InProgress);
    });

    it('should change status from Open to Cancelled', async () => {
      // ARRANGE
      const { jobBoard, user1 } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // ACT: Create 1 inactive job
      await jobBoard.write.createJob([500, 'Job 1']);
      await jobBoard.write.assigneCandidate([1, 'Jean', 'jean@example.com'], { account: user1.account });
      await jobBoard.write.changeJobStatus([1, Status.Cancelled]);

      // ACT: Retrieve the job
      const job = (await jobBoard.read.getJob([1])) as any;
      // ASSERT: Verify that job status is Cancelled
      assert.strictEqual(job.status, Status.Cancelled);
    });

    it('should change status from InProgress to Completed', async () => {
      // ARRANGE
      const { jobBoard, user1 } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // ACT: Create 1 inactive job
      await jobBoard.write.createJob([500, 'Job 1']);
      await jobBoard.write.assigneCandidate([1, 'Jean', 'jean@example.com'], { account: user1.account });
      await jobBoard.write.changeJobStatus([1, Status.InProgress]);
      await jobBoard.write.changeJobStatus([1, Status.Completed]);

      // ACT: Retrieve the job
      const job = (await jobBoard.read.getJob([1])) as any;
      // ASSERT: Verify that job status is Completed
      assert.strictEqual(job.status, Status.Completed);
    });

    it('should change status from InProgress to Open', async () => {
      // ARRANGE
      const { jobBoard, user1 } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // ACT: Create 1 inactive job
      await jobBoard.write.createJob([500, 'Job 1']);
      await jobBoard.write.assigneCandidate([1, 'Jean', 'jean@example.com'], { account: user1.account });
      await jobBoard.write.changeJobStatus([1, Status.InProgress]);
      await jobBoard.write.changeJobStatus([1, Status.Open]);

      // ACT: Retrieve the job
      const job = (await jobBoard.read.getJob([1])) as any;
      // ASSERT: Verify that job status is Open
      assert.strictEqual(job.status, Status.Open);
    });

    it('should emit JobUpdated event', async () => {
      // ARRANGE
      const { jobBoard, owner, user1 } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // ACT: Create 1 inactive job
      await jobBoard.write.createJob([500, 'Job 1']);
      await jobBoard.write.assigneCandidate([1, 'Jean', 'jean@example.com'], { account: user1.account });

      // ASSERT: emit JobUpdated event when changing status
      await viem.assertions.emitWithArgs(jobBoard.write.changeJobStatus([1, Status.InProgress]), jobBoard, 'JobUpdated', [1, Status.InProgress, getAddress(owner.account.address)]);
    });

    it('should revert when job does not exist', async () => {
      // ARRANGE
      const { jobBoard, owner } = await networkHelpers.loadFixture(deployJobBoardFixture);

      // ASSERT:  revert that job with id 999 does not exist
      await viem.assertions.revertWithCustomError(jobBoard.write.changeJobStatus([999, Status.InProgress], { account: owner.account }), jobBoard, 'JobDoesNotExist');
    });

    it('should revert when not job author', async () => {
      // ARRANGE
      const { jobBoard, user1 } = await networkHelpers.loadFixture(deployJobBoardFixture);

      await jobBoard.write.createJob([500, 'Job 1']);

      // ASSERT:  revert when a user is not the author of the job
      await viem.assertions.revertWithCustomError(jobBoard.write.changeJobStatus([1, Status.InProgress], { account: user1.account }), jobBoard, 'OnlyAuthorCanPerformAction');
    });

    it('should revert when trying to change status of a Completed job', async () => {
      // ARRANGE
      const { jobBoard, user1 } = await networkHelpers.loadFixture(deployJobBoardFixture);

      await jobBoard.write.createJob([500, 'Job 1']);
      await jobBoard.write.assigneCandidate([1, 'Jean', 'jean@example.com'], { account: user1.account });
      await jobBoard.write.changeJobStatus([1, Status.InProgress]);
      await jobBoard.write.changeJobStatus([1, Status.Completed]);

      // ASSERT:  revert when trying to change status of a Completed job
      await viem.assertions.revertWithCustomError(jobBoard.write.changeJobStatus([1, Status.InProgress]), jobBoard, 'CannotChangeCompletedOrCancelledJob');
    });

    it('should revert when trying to change status of a Cancelled job', async () => {
      // ARRANGE
      const { jobBoard, user1 } = await networkHelpers.loadFixture(deployJobBoardFixture);

      await jobBoard.write.createJob([500, 'Job 1']);
      await jobBoard.write.assigneCandidate([1, 'Jean', 'jean@example.com'], { account: user1.account });
      await jobBoard.write.changeJobStatus([1, Status.InProgress]);
      await jobBoard.write.changeJobStatus([1, Status.Cancelled]);

      // ASSERT:  revert when trying to change status of a Cancelled job
      await viem.assertions.revertWithCustomError(jobBoard.write.changeJobStatus([1, Status.InProgress]), jobBoard, 'CannotChangeCompletedOrCancelledJob');
    });

    it('should revert when setting same status', async () => {
      // ARRANGE
      const { jobBoard, user1 } = await networkHelpers.loadFixture(deployJobBoardFixture);

      await jobBoard.write.createJob([500, 'Job 1']);
      await jobBoard.write.assigneCandidate([1, 'Jean', 'jean@example.com'], { account: user1.account });
      await jobBoard.write.changeJobStatus([1, Status.InProgress]);

      // ASSERT:  revert when trying to change to the same status
      await viem.assertions.revertWithCustomError(jobBoard.write.changeJobStatus([1, Status.InProgress]), jobBoard, 'StatusAlreadySet');
    });

    it('should revert when changing Open to InProgress without candidate', async () => {
      // ARRANGE
      const { jobBoard } = await networkHelpers.loadFixture(deployJobBoardFixture);

      await jobBoard.write.createJob([500, 'Job 1']);

      // ASSERT:  revert when trying to change to the same status
      await viem.assertions.revertWithCustomError(jobBoard.write.changeJobStatus([1, Status.InProgress]), jobBoard, 'CannotSetInProgressWithoutCandidate');
    });

    it('should revert when changing Open to Completed', async () => {
      // ARRANGE
      const { jobBoard, user1 } = await networkHelpers.loadFixture(deployJobBoardFixture);

      await jobBoard.write.createJob([500, 'Job 1']);
      await jobBoard.write.assigneCandidate([1, 'Jean', 'jean@example.com'], { account: user1.account });

      // ASSERT:  revert when trying to change to the same status
      await viem.assertions.revertWithCustomError(jobBoard.write.changeJobStatus([1, Status.Completed]), jobBoard, 'InvalidTransitionFromOpen');
    });
  });
});
