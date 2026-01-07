import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from './lib/wagmi';
import Header from './components/layout/Header';
import { jobs } from './lib/mockData';
import JobList from './components/job/JobList';
import { useEffect, useState } from 'react';

const queryClient = new QueryClient();

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-slate-900">
          <Header />
          <JobList jobs={jobs} connectedAddress="{conn}" isLoading={isLoading} />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
