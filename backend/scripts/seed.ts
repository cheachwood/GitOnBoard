import hre from 'hardhat';
import { createWalletClient, createPublicClient, http, getContract } from 'viem';
import { hardhat } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

/**
 * Script de seed pour alimenter le contrat JobBoard avec des données de test
 * Usage: npx hardhat run scripts/seed.ts --network localhost
 */

// Clés privées des comptes de test Hardhat
const PRIVATE_KEY_0 = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const PRIVATE_KEY_1 = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d';
const PRIVATE_KEY_2 = '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a';

// Données de test
const jobDescriptions = [
  'Développeur React Senior - Projet e-commerce',
  'Développeur Solidity - Smart contracts DeFi',
  'Designer UI/UX - Application mobile',
  'Chef de projet Web3 - Plateforme NFT',
  'Développeur Full-Stack - Marketplace décentralisée',
  'Consultant Blockchain - Audit smart contracts',
  'Développeur Frontend Vue.js - Dashboard analytics',
  'Développeur Backend Node.js - API REST',
  'DevOps Engineer - Infrastructure cloud',
  'Développeur React Native - Application fintech',
  'Data Scientist - Machine Learning',
  'Développeur Python - Automatisation',
  'Architecte Logiciel - Microservices',
  'Ingénieur Sécurité - Pentest applications',
  'Développeur Angular - Portail client',
  'Tech Lead - Équipe blockchain',
  'Développeur Rust - Smart contracts Solana',
  'Product Owner - Produits Web3',
  'Scrum Master - Équipe agile',
  'QA Engineer - Tests automatisés',
];

const candidateNames = ['Alice Martin', 'Bob Dupont', 'Charlie Bernard', 'Diana Laurent', 'Ethan Moreau', 'Fiona Petit'];

const candidateEmails = ['alice.martin@mail.com', 'bob.dupont@mail.com', 'charlie.bernard@mail.com', 'diana.laurent@mail.com', 'ethan.moreau@mail.com', 'fiona.petit@mail.com'];

async function main() {
  console.log('🌱 Début du seed du contrat JobBoard...\n');

  // Adresse du contrat
  const jobBoardAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3' as `0x${string}`;

  console.log(`📍 Adresse du contrat: ${jobBoardAddress}\n`);

  // Récupérer l'ABI du contrat
  const jobBoardArtifact = await hre.artifacts.readArtifact('JobBoard');
  const jobBoardABI = jobBoardArtifact.abi;

  // Créer le client public
  const publicClient = createPublicClient({
    chain: hardhat,
    transport: http('http://127.0.0.1:8545'),
  });

  // Créer les comptes
  const account0 = privateKeyToAccount(PRIVATE_KEY_0);
  const account1 = privateKeyToAccount(PRIVATE_KEY_1);
  const account2 = privateKeyToAccount(PRIVATE_KEY_2);

  // Créer les wallet clients
  const walletClient0 = createWalletClient({
    account: account0,
    chain: hardhat,
    transport: http('http://127.0.0.1:8545'),
  });

  const walletClient1 = createWalletClient({
    account: account1,
    chain: hardhat,
    transport: http('http://127.0.0.1:8545'),
  });

  const walletClient2 = createWalletClient({
    account: account2,
    chain: hardhat,
    transport: http('http://127.0.0.1:8545'),
  });

  // Créer les instances du contrat
  const jobBoardAsAccount0 = getContract({
    address: jobBoardAddress,
    abi: jobBoardABI,
    client: { public: publicClient, wallet: walletClient0 },
  });

  const jobBoardAsAccount1 = getContract({
    address: jobBoardAddress,
    abi: jobBoardABI,
    client: { public: publicClient, wallet: walletClient1 },
  });

  const jobBoardAsAccount2 = getContract({
    address: jobBoardAddress,
    abi: jobBoardABI,
    client: { public: publicClient, wallet: walletClient2 },
  });

  console.log('👥 Comptes utilisés:');
  console.log(`   Account 0 (toi): ${account0.address}`);
  console.log(`   Account 1 (autre auteur): ${account1.address}`);
  console.log(`   Account 2 (candidat): ${account2.address}\n`);

  let jobCounter = 0;

  // ========== Jobs créés par Account 0 (TOI) ==========
  console.log('📝 Création de jobs par Account 0 (TOI)...\n');

  // Job 1: Open sans candidat
  console.log('   → Job 1: Open, sans candidat');
  let hash = await jobBoardAsAccount0.write.createJob([500, jobDescriptions[jobCounter++]]);
  await publicClient.waitForTransactionReceipt({ hash });

  // Job 2: Open avec candidat
  console.log('   → Job 2: Open, avec candidat');
  hash = await jobBoardAsAccount0.write.createJob([600, jobDescriptions[jobCounter++]]);
  await publicClient.waitForTransactionReceipt({ hash });
  hash = await jobBoardAsAccount2.write.assigneCandidate([2, candidateNames[0], candidateEmails[0]]);
  await publicClient.waitForTransactionReceipt({ hash });

  // Job 3: InProgress avec candidat
  console.log('   → Job 3: InProgress, avec candidat');
  hash = await jobBoardAsAccount0.write.createJob([550, jobDescriptions[jobCounter++]]);
  await publicClient.waitForTransactionReceipt({ hash });
  hash = await jobBoardAsAccount2.write.assigneCandidate([3, candidateNames[1], candidateEmails[1]]);
  await publicClient.waitForTransactionReceipt({ hash });
  hash = await jobBoardAsAccount0.write.changeJobStatus([3, 1]); // InProgress
  await publicClient.waitForTransactionReceipt({ hash });

  // Job 4: Completed
  console.log('   → Job 4: Completed');
  hash = await jobBoardAsAccount0.write.createJob([700, jobDescriptions[jobCounter++]]);
  await publicClient.waitForTransactionReceipt({ hash });
  hash = await jobBoardAsAccount2.write.assigneCandidate([4, candidateNames[2], candidateEmails[2]]);
  await publicClient.waitForTransactionReceipt({ hash });
  hash = await jobBoardAsAccount0.write.changeJobStatus([4, 1]); // InProgress
  await publicClient.waitForTransactionReceipt({ hash });
  hash = await jobBoardAsAccount0.write.changeJobStatus([4, 2]); // Completed
  await publicClient.waitForTransactionReceipt({ hash });

  // Job 5: Open sans candidat
  console.log('   → Job 5: Open, sans candidat');
  hash = await jobBoardAsAccount0.write.createJob([450, jobDescriptions[jobCounter++]]);
  await publicClient.waitForTransactionReceipt({ hash });

  // Job 6: InProgress
  console.log('   → Job 6: InProgress');
  hash = await jobBoardAsAccount0.write.createJob([800, jobDescriptions[jobCounter++]]);
  await publicClient.waitForTransactionReceipt({ hash });
  hash = await jobBoardAsAccount2.write.assigneCandidate([6, candidateNames[3], candidateEmails[3]]);
  await publicClient.waitForTransactionReceipt({ hash });
  hash = await jobBoardAsAccount0.write.changeJobStatus([6, 1]);
  await publicClient.waitForTransactionReceipt({ hash });

  // Job 7: Inactive (désactivé)
  console.log('   → Job 7: Open, INACTIF (désactivé)');
  hash = await jobBoardAsAccount0.write.createJob([520, jobDescriptions[jobCounter++]]);
  await publicClient.waitForTransactionReceipt({ hash });
  hash = await jobBoardAsAccount0.write.toggleJobActive([7]);
  await publicClient.waitForTransactionReceipt({ hash });

  // Job 8: Open sans candidat
  console.log('   → Job 8: Open, sans candidat');
  hash = await jobBoardAsAccount0.write.createJob([480, jobDescriptions[jobCounter++]]);
  await publicClient.waitForTransactionReceipt({ hash });

  // ========== Jobs créés par Account 1 (AUTRE AUTEUR) ==========
  console.log('\n📝 Création de jobs par Account 1 (autre auteur)...\n');

  // Job 9: Open sans candidat
  console.log('   → Job 9: Open, sans candidat');
  hash = await jobBoardAsAccount1.write.createJob([650, jobDescriptions[jobCounter++]]);
  await publicClient.waitForTransactionReceipt({ hash });

  // Job 10: Open avec candidat
  console.log('   → Job 10: Open, avec candidat');
  hash = await jobBoardAsAccount1.write.createJob([720, jobDescriptions[jobCounter++]]);
  await publicClient.waitForTransactionReceipt({ hash });
  hash = await jobBoardAsAccount2.write.assigneCandidate([10, candidateNames[4], candidateEmails[4]]);
  await publicClient.waitForTransactionReceipt({ hash });

  // Job 11: InProgress
  console.log('   → Job 11: InProgress');
  hash = await jobBoardAsAccount1.write.createJob([590, jobDescriptions[jobCounter++]]);
  await publicClient.waitForTransactionReceipt({ hash });
  hash = await jobBoardAsAccount2.write.assigneCandidate([11, candidateNames[5], candidateEmails[5]]);
  await publicClient.waitForTransactionReceipt({ hash });
  hash = await jobBoardAsAccount1.write.changeJobStatus([11, 1]);
  await publicClient.waitForTransactionReceipt({ hash });

  // Job 12: Completed
  console.log('   → Job 12: Completed');
  hash = await jobBoardAsAccount1.write.createJob([850, jobDescriptions[jobCounter++]]);
  await publicClient.waitForTransactionReceipt({ hash });
  hash = await jobBoardAsAccount2.write.assigneCandidate([12, candidateNames[0], candidateEmails[0]]);
  await publicClient.waitForTransactionReceipt({ hash });
  hash = await jobBoardAsAccount1.write.changeJobStatus([12, 1]);
  await publicClient.waitForTransactionReceipt({ hash });
  hash = await jobBoardAsAccount1.write.changeJobStatus([12, 2]);
  await publicClient.waitForTransactionReceipt({ hash });

  // Job 13: Open sans candidat
  console.log('   → Job 13: Open, sans candidat');
  hash = await jobBoardAsAccount1.write.createJob([500, jobDescriptions[jobCounter++]]);
  await publicClient.waitForTransactionReceipt({ hash });

  // Job 14: InProgress
  console.log('   → Job 14: InProgress');
  hash = await jobBoardAsAccount1.write.createJob([670, jobDescriptions[jobCounter++]]);
  await publicClient.waitForTransactionReceipt({ hash });
  hash = await jobBoardAsAccount2.write.assigneCandidate([14, candidateNames[1], candidateEmails[1]]);
  await publicClient.waitForTransactionReceipt({ hash });
  hash = await jobBoardAsAccount1.write.changeJobStatus([14, 1]);
  await publicClient.waitForTransactionReceipt({ hash });

  // Job 15: Open sans candidat
  console.log('   → Job 15: Open, sans candidat');
  hash = await jobBoardAsAccount1.write.createJob([530, jobDescriptions[jobCounter++]]);
  await publicClient.waitForTransactionReceipt({ hash });

  // Job 16: Inactive
  console.log('   → Job 16: Open, INACTIF');
  hash = await jobBoardAsAccount1.write.createJob([610, jobDescriptions[jobCounter++]]);
  await publicClient.waitForTransactionReceipt({ hash });
  hash = await jobBoardAsAccount1.write.toggleJobActive([16]);
  await publicClient.waitForTransactionReceipt({ hash });

  // Job 17: Open avec candidat
  console.log('   → Job 17: Open, avec candidat');
  hash = await jobBoardAsAccount1.write.createJob([580, jobDescriptions[jobCounter++]]);
  await publicClient.waitForTransactionReceipt({ hash });
  hash = await jobBoardAsAccount2.write.assigneCandidate([17, candidateNames[2], candidateEmails[2]]);
  await publicClient.waitForTransactionReceipt({ hash });

  // Job 18: Open sans candidat
  console.log('   → Job 18: Open, sans candidat');
  hash = await jobBoardAsAccount1.write.createJob([490, jobDescriptions[jobCounter++]]);
  await publicClient.waitForTransactionReceipt({ hash });

  // Job 19: InProgress
  console.log('   → Job 19: InProgress');
  hash = await jobBoardAsAccount1.write.createJob([740, jobDescriptions[jobCounter++]]);
  await publicClient.waitForTransactionReceipt({ hash });
  hash = await jobBoardAsAccount2.write.assigneCandidate([19, candidateNames[3], candidateEmails[3]]);
  await publicClient.waitForTransactionReceipt({ hash });
  hash = await jobBoardAsAccount1.write.changeJobStatus([19, 1]);
  await publicClient.waitForTransactionReceipt({ hash });

  // Job 20: Completed
  console.log('   → Job 20: Completed');
  hash = await jobBoardAsAccount1.write.createJob([900, jobDescriptions[jobCounter++]]);
  await publicClient.waitForTransactionReceipt({ hash });
  hash = await jobBoardAsAccount2.write.assigneCandidate([20, candidateNames[4], candidateEmails[4]]);
  await publicClient.waitForTransactionReceipt({ hash });
  hash = await jobBoardAsAccount1.write.changeJobStatus([20, 1]);
  await publicClient.waitForTransactionReceipt({ hash });
  hash = await jobBoardAsAccount1.write.changeJobStatus([20, 2]);
  await publicClient.waitForTransactionReceipt({ hash });

  console.log('\n✅ Seed terminé avec succès !\n');

  // Afficher un résumé
  console.log('📊 Résumé des jobs créés:');
  console.log('   • Total: 20 jobs');
  console.log('   • Par Account 0 (TOI): 8 jobs');
  console.log('   • Par Account 1 (autre): 12 jobs');
  console.log('   • Status Open: ~8 jobs');
  console.log('   • Status InProgress: ~6 jobs');
  console.log('   • Status Completed: ~4 jobs');
  console.log('   • Inactifs: 2 jobs');
  console.log('   • Avec candidats: ~14 jobs');
  console.log('   • Sans candidats: ~6 jobs\n');
}

// Exécution
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Erreur lors du seed:', error);
    process.exit(1);
  });
