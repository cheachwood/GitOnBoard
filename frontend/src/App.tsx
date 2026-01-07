import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from './lib/wagmi';
import Header from './components/layout/Header';

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-slate-900">
          <Header />
          {/* Le reste du contenu */}
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
