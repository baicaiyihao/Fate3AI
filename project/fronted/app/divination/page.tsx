'use client';
import { Toaster } from 'react-hot-toast';
import MyButton from '../components/ui/button';
import CardList from '../components/cardlist';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';
const ParticlesBg = dynamic(() => import("particles-bg"), { ssr: false })

export default function Divination() {
    //   const {syncResult,claimResult} = useContract();
    return (
        <main className="w-full bg-black">
            <ParticlesBg type="cobweb" color="#4150B5"
                bg={{
                    position: "absolute",
                    zIndex: 1,
                    width: '100%'
                } as any}
            />
            <div className="w-full flex flex-col justify-center items-center h-screen z-0">
                <Toaster />
                <div className='-mt-20 w-2/3 h-2/3 flex flex-col p-2'>
                    <div className='w-full flex flex-row justify-center'>
                        <p className='text-4xl text-white'>Please select a card</p>
                    </div>
                    <div className='w-full h-3/4 flex flex-col justify-center'>
                    // 自定义配置（22张卡牌，抽3张）
                    <CardList  totalCards={22} drawCount={3} onSuccess={() => {
                        toast.success('Divination successful');
                    }}/>                      
                    </div>

                </div>


            </div>

        </main>
    );
}
