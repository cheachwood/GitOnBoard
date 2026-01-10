import type { Job } from '@/components/job';

export const MOCK_JOBS: Job[] = [
  {
    id: 100,
    description: "Développement d'un Smart Contract de traçabilité pour l'industrie du luxe sur Polygon.",
    author: 'jc',
    dailyRate: 550,
    candidat: {
      candidateName: '',
      candidateMail: '',
      candidateWallet: '',
    },
    isActive: true,
    creationDate: 1704638400000,
    isOwner: true,
    status: 'Open',
  },
  {
    id: 101,
    description: 'Audit de sécurité du Smart Contract de traçabilité v1. Recherche de vulnérabilités critiques.',
    author: 'BlockchainSec',
    dailyRate: 800,
    candidat: {
      candidateName: '0x71C...a2b',
      candidateMail: 'dev@blockchain.com',
      candidateWallet: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    },
    isActive: true,
    creationDate: 1736155200000,
    isOwner: false,
    status: 'InProgress',
  },
  {
    id: 102,
    description: "Design de l'interface utilisateur (UI) pour le module de gestion des vols.",
    author: 'jc',
    dailyRate: 450,
    candidat: {
      candidateName: '',
      candidateMail: '',
      candidateWallet: '',
    },
    isActive: false,
    creationDate: 1735651200000,
    isOwner: true,
    status: 'Completed',
  },
  {
    id: 103,
    description: 'Migration des données vers un nouveau réseau de test (Testnet).',
    author: 'DevOps_Team',
    dailyRate: 600,
    candidat: {
      candidateName: '',
      candidateMail: '',
      candidateWallet: '',
    },
    isActive: false,
    creationDate: 1735824000000,
    isOwner: false,
    status: 'Cancelled',
  },
  {
    id: 104,
    description: 'Hop on fait un test.',
    author: 'jc',
    dailyRate: 600,
    candidat: {
      candidateName: '',
      candidateMail: '',
      candidateWallet: '',
    },
    isActive: false,
    creationDate: 1735824000000,
    isOwner: false,
    status: 'Cancelled',
  },
];

export const connectedAddress = '1234567890';
