'use client';
import React, { useState } from 'react';
import Lottery from '@/components/lottery';
export default function LotteryPage(){
  

  return (
    <main className="w-full bg-mainpage">
      <Lottery onSuccess={() => {}}/>
      </main>
    );
};

