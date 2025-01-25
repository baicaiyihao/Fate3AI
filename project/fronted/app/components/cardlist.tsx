"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import MyButton from "./ui/button";
import MyDialog from "./ui/dialog";

export default function CardList() {
    const arr = Array.from({ length: 22 }, (_, index) => index + 1);
    const [selectedCard, setSelectedCard] = useState<number | null>(null);
    const [randomNumber, setRandomNumber] = useState<number | null>(null);

    const handleCardClick = () => {
       if(selectedCard && randomNumber === null){
        const random = Math.floor(Math.random() * 22); // 生成0-21之间的随机数
        setRandomNumber(random);
       }else{
        alert('you have already divination');
       }
    };
    const onCardClick = (index: number) => {
        setSelectedCard(index);
    };

    const divinationResult = () => {
        return (
            <Image src={`/cards/${randomNumber}.jpg`} alt="card" width={400} height={400} className="w-full h-full" />
        )
    }
    return (
        <div
            className="flex w-full h-full flex-col items-center justify-center overflow-x-auto mt-10"
        >
            {/* {randomNumber !== null && (
                <div className="text-xl mb-4 text-white">
                    抽到的数字是: {randomNumber}
                </div>
            )} */}
            <div className="w-5/6 h-72 relative min-w-[800px] mt-10">
                {arr.map((item, index) => (
                    <div
                        key={index}
                        onClick={() =>  onCardClick(index)}
                        className={`ml-10
                            absolute transition-all duration-300 ease-in-out 
                            hover:-translate-y-6
                            ${selectedCard === index ? '-translate-y-6' : ''}
                        `}
                        style={{
                            left: `${index * 40}px`,
                            zIndex: arr.length - index
                        }}
                    >
                        <Image
                            src="/card.png"
                            alt="cardlist"
                            className="object-cover"
                            width={120}
                            height={200}
                        />
                    </div>
                ))}
            </div>
            <div className='w-full flex flex-row justify-center h-12 mt-20 z-10' onClick={() => handleCardClick()}>
                <div className='w-1/4' >
                <MyDialog text='Start Divination' children={divinationResult()}/>
                </div>
            </div>

        </div>
    );
}