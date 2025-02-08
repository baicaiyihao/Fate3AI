"use client";
import React, { useState ,useCallback, useEffect} from "react";
import Image from "next/image";
import { TAROT_CARDS_EN} from "@/config/constants";
import Divination from "@/components/divination";
const AGENT_ID = process.env.NEXT_PUBLIC_ELIZA_AGENT_ID || '';
const ELIZA_URL = process.env.NEXT_PUBLIC_ELIZA_URL || '';
  

interface CardListProps {
    totalCards?: number;  // 总卡牌数量
    drawCount?: number;   // 可抽取的卡牌数量
    onSuccess?: () => void;
}

export default function CardList({ totalCards = 22, drawCount = 1,onSuccess }: CardListProps){
    const arr = Array.from({ length: totalCards }, (_, index) => index + 1);
    const [selectedCards, setSelectedCards] = useState<number[]>([]);
    const [randomNumbers, setRandomNumbers] = useState<number[]>([]);
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState('');
    const [cardValue, setCardValue] = useState<string[]>([]);

    

    useEffect(() => {
        if (randomNumbers.length > 0) {
            console.log("randomNumbers",randomNumbers)
            const selectedValues = randomNumbers.map(index => TAROT_CARDS_EN[index]?.value || '');
            setCardValue(selectedValues);
        }
    }, [randomNumbers]); 

    
    const onCardClick = (index: number) => {
        setSelectedCards((prev) => {
            const updatedSelection = prev.includes(index)
                ? prev.filter((card) => card !== index) // 取消选中
                : prev.length < drawCount
                ? [...prev, index] // 继续选牌
                : prev;
    
            // 如果牌未选满，直接返回
            if (updatedSelection.length < drawCount) return updatedSelection;
    
            // 如果已经完成占卜，不允许重复操作
            if (randomNumbers.length > drawCount && response.length > 0) {
                alert('You have already completed divination');
                return prev;
            }
    
            // 选中的牌已经够3张了，更新 randomNumbers
            setRandomNumbers(updatedSelection);
    
            // 计算选中的牌值
            const selectedValues = updatedSelection.map(i => TAROT_CARDS_EN[i]?.value || '');
            setCardValue(selectedValues);
    
            return updatedSelection;
        });
    };
    
    const divinationResult = () => {
                return (
                    <div className="flex flex-wrap gap-4 justify-center mt-6">
                    {selectedCards.map((number, index) => (
                        <Image
                            key={index}
                            src={`/cards/${number}.jpg`}
                            alt={`card-${index}`}
                            width={200}
                            height={300}
                            className="object-cover rounded-lg shadow-md"
                        />
                    ))}
                </div>
                );
            };



    return (
        <div className="flex flex-col items-center justify-center w-full h-full overflow-x-auto mt-10">
    {/* 卡牌区域 */}
    <div className="relative flex flex-wrap justify-center w-full max-w-4xl min-w-[800px] h-72 mt-10 gap-2">
        {arr.map((item, index) => (
            <div
                key={index}
                onClick={() => onCardClick(index)}
                className={`absolute transition-transform duration-300 ease-in-out cursor-pointer 
                    hover:-translate-y-4 
                    ${selectedCards.includes(index) ? '-translate-y-6 scale-110' : ''}`}
                style={{
                    left: `${index * 50}px`, // 调整间距
                    zIndex: arr.length - index
                }}
            >
                <Image
                    src="/card.png"
                    alt="cardlist"
                    className="object-cover rounded-lg shadow-lg"
                    width={120}
                    height={200}
                />
            </div>
        ))}
    </div>

    {/* 操作区 */}
    <div className="flex flex-col items-center w-full gap-6 mt-16 z-10">
        {/* 选中状态 */}
        <p className="text-lg font-semibold text-purple-600">
            Selected: {selectedCards.length} / {drawCount} cards
        </p>

        {/* 输入框 */}
        <input
            type="text"
            placeholder="Enter your question"
            className="w-1/3 p-2 border border-gray-300 rounded-md shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-purple-400"
            onChange={(e) => setQuestion(e.target.value)}
        />


        <Divination cardValue={cardValue} question={question} onSuccess={() => {
           
        }} onError={() => {
            alert("Divination failed");
        }} />
       

            {selectedCards.length ==drawCount && (
        <div className="flex flex-wrap gap-4 justify-center mt-6">
         {selectedCards.map((number, index) => (
             <Image
                key={index}
                src={`/cards/${number}.jpg`}
                alt={`card-${index}`}
                width={200}
                height={300}
                className="object-cover rounded-lg shadow-md"
            />
        ))}
    </div>
)}

      
    </div>
</div>

    );
    
}