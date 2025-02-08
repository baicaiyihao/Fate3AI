'use client';
import React, { useState } from 'react';
import UsdToSuiConverter from '@/components/UsdToSuiConverter';
import { Toaster } from 'react-hot-toast';
export default function SwapPage(){

  return (
    <main className="w-full min-h-screen bg-purple-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Toaster />
        <div className="space-y-8">
          <UsdToSuiConverter />
        </div>
      </div>
    </main>
    );
};

