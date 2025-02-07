"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import MyButton from "./ui/button";
import MyDialog from "./ui/dialog";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "@/config/networkConfig";
import { CategorizedObjects } from "@/utils/assetsHelpers";
import { TESTNET_PriceRecord, TESTNET_TokenPolicy } from "@/config/constants";
import { getUserProfile } from "@/utils/getUserObject";


interface CardListProps {
    totalCards?: number;  // 总卡牌数量
    drawCount?: number;   // 可抽取的卡牌数量
}

export default function CardList({ totalCards = 22, drawCount = 1 }: CardListProps,onSuccess: () => void){
    const arr = Array.from({ length: totalCards }, (_, index) => index + 1);
    const [selectedCards, setSelectedCards] = useState<number[]>([]);
    const [randomNumbers, setRandomNumbers] = useState<number[]>([]);


    const handleCardClick = () => {
        if (selectedCards.length === drawCount && randomNumbers.length === 0) {
            const numbers: number[] = [];
            for (let i = 0; i < drawCount; i++) {
                const random = Math.floor(Math.random() * totalCards);
                numbers.push(random);
            }
            setRandomNumbers(numbers);
        } else if (randomNumbers.length > 0) {
            alert('You have already completed divination');
        } else {
            alert(`Please select ${drawCount} cards first`);
        }
    };

    
    const onCardClick = (index: number) => {
        if (selectedCards.includes(index)) {
            setSelectedCards(selectedCards.filter(cardIndex => cardIndex !== index));
        } else if (selectedCards.length < drawCount) {
            setSelectedCards([...selectedCards, index]);
        } else {
            alert(`You can only select ${drawCount} cards`);
        }
    };


    const divinationResult = () => {
        return (
            <div className="flex flex-wrap gap-4 justify-center">
                {randomNumbers.map((number, index) => (
                    <Image 
                        key={index}
                        src={`/cards/${number}.jpg`} 
                        alt={`card-${index}`} 
                        width={400} 
                        height={400} 
                        className="w-full max-w-[300px] h-auto"
                    />
                ))}
            </div>
        );
    };

    const currentAccount = useCurrentAccount();
    const { mutateAsync: signAndExecute, isError } = useSignAndExecuteTransaction();
    const PackageId = useNetworkVariable("PackageId");
    const [userObjects, setUserObjects] = useState<CategorizedObjects | null>(null);

    const handleBuyItem = async () => {
        if (!currentAccount?.address) {
            console.error("No connected account found.");
            return;
        }
    
        try {
            const profile = await getUserProfile(currentAccount?.address);
            setUserObjects(profile);
    
            const allTokens = Object.entries(profile.objects || {}).filter(([objectType]) =>
                objectType.includes(`0x2::token::Token<${PackageId}::fate::FATE>`)
            ) as any;
            console.log("All Tokens:", allTokens);

            if (!allTokens || !allTokens[0] || !allTokens[0][1] || allTokens[0][1].length === 0) {
                console.error("No tokens found");
                return;
            }

            const tx = new Transaction();
            tx.setGasBudget(10000000);

            // 如果有多个 token，先合并
            if (allTokens[0][1].length > 1) {
                // 找出余额最大的 token 作为主 token
                const primaryToken = allTokens[0][1].reduce((max: any, current: any) => {
                    const maxBalance = parseInt(max.data.content.fields.balance);
                    const currentBalance = parseInt(current.data.content.fields.balance);
                    return maxBalance >= currentBalance ? max : current;
                }, allTokens[0][1][0]);

                const primaryTokenId = primaryToken.data.objectId;
                const mergeTokens = allTokens[0][1]
                    .filter((token: any) => token.data.objectId !== primaryTokenId)
                    .map((token: any) => token.data.objectId);
                
                console.log("Primary Token:", primaryTokenId);
                console.log("Merge Tokens:", mergeTokens);

                // 合并所有 token
                for (const tokenId of mergeTokens) {
                    tx.moveCall({
                        target: `0x2::token::join`,
                        typeArguments: [`${PackageId}::fate::FATE`],
                        arguments: [
                            tx.object(primaryTokenId),
                            tx.object(tokenId),
                        ],
                    });
                }
                console.log(primaryTokenId);

                tx.moveCall({
                    target: `${PackageId}::fate::buyItem`,
                    arguments: [
                        tx.object(primaryTokenId),
                        tx.object(TESTNET_PriceRecord),
                        tx.pure.string("taro"),
                        tx.object(TESTNET_TokenPolicy),
                    ],
                });
            } else {
                // 只有一个 token 的情况
                const Tokenid = allTokens[0][1][0].data.objectId;
                console.log("Single Token ID:", Tokenid);
                
                tx.moveCall({
                    target: `${PackageId}::fate::buyItem`,
                    arguments: [
                        tx.object(Tokenid),
                        tx.object(TESTNET_PriceRecord),
                        tx.pure.string("taro"),
                        tx.object(TESTNET_TokenPolicy),
                    ],
                });
            }
    
            const result = await signAndExecute({ transaction: tx });
            console.log(result);
    
            if (result && !isError) {
                onSuccess();
            }
        } catch (error) {
            console.error("Error buying item:", error);
        }
    };

    return (
        <div className="flex w-full h-full flex-col items-center justify-center overflow-x-auto mt-10">
            <div className="w-5/6 h-72 relative min-w-[800px] mt-10">
                {arr.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => onCardClick(index)}
                        className={`ml-10
                            absolute transition-all duration-300 ease-in-out 
                            hover:-translate-y-6
                            ${selectedCards.includes(index) ? '-translate-y-6' : ''}
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
            <div className='w-full flex flex-col items-center gap-4 mt-20 z-10'>
                <p className="text-purple-600">
                    Selected: {selectedCards.length} / {drawCount} cards
                </p>
                <div className='w-1/4'>
                    <MyDialog 
                        text='Start Divination' 
                        children={divinationResult()}
                    />
                </div>
            </div>
        </div>
    );
}