'use client';
// import useContract from '../hooks/useContract';
import { Toaster } from 'react-hot-toast';
import MyButton from '../components/ui/button';
import CreateProfile from "../../components/createProfile";
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
        rounded-3xl flex-col items-center justify-center'>
          <div className='w-full gap-4 h-full flex flex-row justify-center items-center'>
            <div className='w-full h-full flex flex-col justify-center items-center border-2 border-[#dcdee9] rounded-lg p-4'>
              <CheckIn onSuccess={() => { }} />
            </div>
            <div className='w-full h-full flex flex-col justify-center items-center border-2 border-[#dcdee9] rounded-lg p-4'>
                <Getuserinfo />
            </div>
          </div>

        </div>
      </div>

    </main>
  );
}

