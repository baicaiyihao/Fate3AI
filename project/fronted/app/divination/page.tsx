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
        <main className="w-full min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
    {/* 背景粒子效果 */}
    <ParticlesBg 
        type="cobweb" 
        color="#4150B5"
        bg={{
            position: "absolute",
            zIndex: 0,
            width: '100%',
            height: '100%'
        } as any}
    />

    {/* 主容器 */}
    <div className="relative w-full max-w-5xl flex flex-col items-center justify-center text-center px-4 z-10">
        <Toaster />
        
        {/* 标题 */}
        <p className="text-4xl text-white font-bold mb-8">
            Please select a card
        </p>

        {/* 卡牌区域 */}
        <div className="w-full flex flex-col items-center justify-center">
            <CardList  
                totalCards={22} 
                drawCount={3} 
                onSuccess={() => {
                    toast.success('Divination successful');
                }}
            />                      
        </div>
    </div>
</main>

    );
}
