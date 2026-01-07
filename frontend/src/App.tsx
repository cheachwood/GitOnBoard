import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from './lib/wagmi';
import Header from './components/layout/Header';
import { jobs } from './lib/mockData';
import JobList from './components/job/JobList';
import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem } from './components/ui/select';
import { JOB_TYPE_OPTIONS } from './components/job';

const queryClient = new QueryClient();

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [jobType, setJobType] = useState('All Jobs');

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
          <Select value={jobType} onValueChange={(value) => setJobType(value)}>
            <SelectContent className="w-48 mt-4 ml-4">
              <SelectItem value="All Jobs">All Jobs</SelectItem>
              {JOB_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <JobList jobs={jobs} connectedAddress="{conn}" isLoading={isLoading} />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
