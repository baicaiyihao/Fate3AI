'use client';

import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { networkConfig } from '@/config/networkConfig';
import { TopNav } from "@/app/components/TopNav";
import { useState, useEffect } from 'react';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
          setIsLoading(false);
        }, 100);
    
        return () => clearTimeout(timer);
      }, []);
    
      if (isLoading) {
        return null;
      }
    
      return (
        <QueryClientProvider client={queryClient}>
          <SuiClientProvider networks={networkConfig} defaultNetwork='testnet'>
            <WalletProvider autoConnect={true}>
              <div className="fade-in">
                <TopNav />
                {children}
              </div>
            </WalletProvider>
          </SuiClientProvider>
        </QueryClientProvider>
      );
}