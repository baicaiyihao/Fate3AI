'use client';
import React, { useState } from 'react';
import Lottery from '@/components/lottery';
import { Toaster } from 'react-hot-toast';
import SetRaffleNft from '@/components/setRaffleNft';
export default function LotteryPage(){

  return (
    <main className="w-full min-h-screen bg-purple-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Toaster />
        <div className="space-y-8">
          <Lottery onSuccess={() => {}}/>
          <SetRaffleNft />
        </div>
      </div>
    </main>
    );
};

