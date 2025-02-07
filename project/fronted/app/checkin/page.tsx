'use client';
// import useContract from '../hooks/useContract';
import { Toaster } from 'react-hot-toast';
import MyButton from '../components/ui/button';
import CreateProfile  from "../../components/createProfile";
import Getuserinfo from '@/components/getUserProfile';
import CheckIn from '@/components/checkIn';
import { useCurrentAccount } from '@mysten/dapp-kit';
export default function More() {
  // const {syncResult,claimResult} = useContract();
  return (
    <main className="w-full bg-mainpage">

      <div className="w-full flex flex-col justify-center items-center h-screen z-0">
        <Toaster />
        <div className='-mt-20 w-2/3 h-2/3 
        flex flex-col p-2 
        border-2 border-[#dcdee9] rounded-3xl flex-col items-center justify-center'>
          <div className='w-full h-48 flex flex-col items-center justify-center'>
          <p className='text-5xl text-nav'>Consecutive Check-in: 1 Day</p>
          <p className='text-5xl text-nav'>Points Reward: 100</p>
          </div>

          <div className='w-2/3 h-10 flex flex-row justify-center items-center'>
            <MyButton text="Check in" />
            <CheckIn onSuccess={() => {}}/>
            <Getuserinfo/>
          </div>
          <div className='w-full flex flex-col items-center justify-center mt-10'>
            <p className='text-5xl'>Check-in Rules</p>
            <p className='text-3xl'>1. Get points reward for daily check-in</p>
            <p className='text-3xl'>2. Get extra rewards for consecutive check-ins</p>
            <p className='text-3xl'>3. Can only check in once per day</p>
            <p className='text-3xl'>4. Missing a check-in will reset consecutive days</p>
          </div>
        
        </div>
      </div>

    </main>
  );
}

