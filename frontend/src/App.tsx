import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from './lib/wagmi';
import Header from './components/layout/Header';
import JobCard from './components/job/JobCard';
import type { Job } from './components/job';

const queryClient = new QueryClient();

function App() {
  const MOCK_JOB1: Job = {
    id: 1,
    description: "Développement d'un Smart Contract de traçabilité pour l'industrie du luxe sur Polygon.",
    author: 'jc',
    dailyRate: 550,
    candidate: '',
    isActive: true,
    creationDate: 1704638400000,
    isOwner: true,
    status: 'Open',
  };

  const MOCK_JOB2: Job = {
    id: 101,
    description: 'Audit de sécurité du Smart Contract de traçabilité v1. Recherche de vulnérabilités critiques.',
    author: 'BlockchainSec',
    dailyRate: 800,
    candidate: '0x71C...a2b',
    isActive: true,
    creationDate: 1736155200000,
    isOwner: false,
    status: 'InProgress',
  };
  const MOCK_JOB3: Job = {
    id: 102,
    description: "Design de l'interface utilisateur (UI) pour le module de gestion des vols.",
    author: 'jc',
    dailyRate: 450,
    candidate: 'GraphistePro',
    isActive: false,
    creationDate: 1735651200000,
    isOwner: true,
    status: 'Completed',
  };
  const MOCK_JOB4: Job = {
    id: 103,
    description: 'Migration des données vers un nouveau réseau de test (Testnet).',
    author: 'DevOps_Team',
    dailyRate: 600,
    candidate: '',
    isActive: false,
    creationDate: 1735824000000,
    isOwner: false,
    status: 'Cancelled',
  };
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-slate-900">
          <Header />
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <JobCard job={MOCK_JOB1} />
            <JobCard job={MOCK_JOB2} />
            <JobCard job={MOCK_JOB3} />
            <JobCard job={MOCK_JOB4} />
          </div>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
