import { useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from '../config';

const queryClient = new QueryClient();

function App() {
  const [count, setCount] = useState(0);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <>Hello</>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
