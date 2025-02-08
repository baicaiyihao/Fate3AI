import React, { useEffect, useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "../config/networkConfig";
import { TESTNET_AppTokenCap, TESTNET_RaffleInfo } from "../config/constants";
import { suiClient } from "../cli/suiClient";
import { Button } from "./ui/button";

const Lottery: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const currentAccount = useCurrentAccount();
    const { mutateAsync: signAndExecute, isError } = useSignAndExecuteTransaction();
    const PackageId = useNetworkVariable("PackageId");
    const [raffleData, setRaffleData] = useState<any>(null);
    const [lotteryResult, setLotteryResult] = useState<string>("");

    async function refreshLotteryInfo() {
        const raffleInfo = await suiClient.getObject({
            id: TESTNET_RaffleInfo,
            options: {
                showContent: true,
            },
        }) as any;
        setRaffleData(raffleInfo?.data?.content?.fields);
    }

    

    const checkLotteryResult = (randomNumber: number, prizeProb: any) => {
        const grandWeight = parseInt(prizeProb.grand_prize_weight);
        const secondWeight = parseInt(prizeProb.second_prize_weight);
        const thirdWeight = parseInt(prizeProb.third_prize_weight);

        if (randomNumber < grandWeight) {
            return "恭喜获得一等奖！";
        } else if (randomNumber < grandWeight + secondWeight) {
            return "恭喜获得二等奖！";
        } else if (randomNumber < grandWeight + secondWeight + thirdWeight) {
            return "恭喜获得三等奖！";
        } else {
            return `未中奖，退还 ${raffleData?.refund_rate}% 票价`;
        }
    };

    const handleLottery = async () => {
        if (!currentAccount?.address) {
            console.error("No connected account found.");
            return;
        }
    
        try {
    
            const tx = new Transaction();
            tx.setGasBudget(10000000);
    
            tx.moveCall({
                target: `${PackageId}::raffle::lottery`,
                arguments: [
                    tx.object("0x6"),
                    tx.pure.vector('u64', [1, 2, 3]),
                    tx.object(TESTNET_RaffleInfo),
                    tx.object(TESTNET_AppTokenCap),
                ],
            });
    
            const result = await signAndExecute({ transaction: tx });
    
            await new Promise((resolve) => setTimeout(resolve, 2000));

            if (result && !isError) {
                const eventsResult = await suiClient.queryEvents({
                    query: { Transaction: result.digest },
                });
                if (eventsResult.data.length > 0) {
                    const firstEvent = eventsResult.data[0]?.parsedJson as { result?: string };
                    const eventResult = parseInt(firstEvent?.result || "0");
                    const lotteryResultText = checkLotteryResult(eventResult, raffleData?.prize_prob?.fields);
                    console.log(eventResult);
                    console.log("抽奖结果:", lotteryResultText);
                    setLotteryResult(lotteryResultText);
                }
            }
        } catch (error) {
            console.error("Error checking in:", error);
        }
    };

    useEffect(() => {
        refreshLotteryInfo();

    }, [currentAccount]);
    
    return (
        <div className="flex flex-col gap-6 max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-8 border border-purple-100">
                <h2 className="text-3xl font-bold text-purple-800 mb-6">{raffleData?.name || '抽奖活动'}</h2>
                <p className="text-purple-600 mb-6">{raffleData?.description}</p>
                
                <div className="grid gap-4 mb-8">
                    <div className="flex justify-between border-b border-purple-100 pb-3">
                        <span className="font-medium text-purple-700">票价：</span>
                        <span className="text-purple-600">{raffleData?.ticket_cost} Token</span>
                    </div>
                    <div className="flex justify-between border-b border-purple-100 pb-3">
                        <span className="font-medium text-purple-700">退款比例：</span>
                        <span className="text-purple-600">{raffleData?.refund_rate}%</span>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-2xl font-semibold text-purple-800 mb-4">奖品信息</h3>
                    
                    <div className="grid gap-4">
                        {['一等奖', '二等奖', '三等奖'].map((prize, index) => (
                            <div key={index} className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                                <h4 className="font-medium text-lg text-purple-700 mb-3">{prize}</h4>
                                <div className="grid grid-cols-2 gap-3 text-sm text-purple-600">
                                    <div>有效期：{raffleData?.prize?.fields?.[`${['grand', 'second', 'third'][index]}_prize_duration`]} 天</div>
                                    <div>中奖率：{raffleData?.prize_prob?.fields?.[`${['grand', 'second', 'third'][index]}_prize_weight`]}%</div>
                                    <div className="col-span-2">奖品效果：双倍签到奖励</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Button
                onClick={handleLottery}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-medium rounded-xl transition-all duration-200"
            >
                立即抽奖
            </Button>

            {lotteryResult && (
                <div className={`p-6 rounded-xl text-center text-lg font-medium ${
                    lotteryResult.includes('恭喜') 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-purple-50 text-purple-700 border border-purple-200'
                }`}>
                    {lotteryResult}
                </div>
            )}
        </div>
    );
};

export default Lottery;