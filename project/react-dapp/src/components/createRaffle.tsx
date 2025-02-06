import React, { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "../networkConfig";
import { CategorizedObjects } from "../utils/assetsHelpers";
import { TESTNET_AppTokenCap } from "../config/constants";
import { getUserProfile } from "../utils/getUserObject";

const CreateRaffle: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const currentAccount = useCurrentAccount();
    const { mutateAsync: signAndExecute, isError } = useSignAndExecuteTransaction();
    const PackageId = useNetworkVariable("PackageId");
    const [userObjects, setUserObjects] = useState<CategorizedObjects | null>(null);
    
    // 添加所有必要的状态
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [ticketCost, setTicketCost] = useState("");
    const [refundRate, setRefundRate] = useState("");
    const [grandPrizeDuration, setGrandPrizeDuration] = useState("");
    const [secondPrizeDuration, setSecondPrizeDuration] = useState("");
    const [thirdPrizeDuration, setThirdPrizeDuration] = useState("");
    const [grandPrizeWeight, setGrandPrizeWeight] = useState("");
    const [secondPrizeWeight, setSecondPrizeWeight] = useState("");
    const [thirdPrizeWeight, setThirdPrizeWeight] = useState("");

    const handleCreateRaffle = async () => {
        if (!currentAccount?.address) {
            console.error("No connected account found.");
            return;
        }

        try {
            const profile = await getUserProfile(currentAccount?.address);
            setUserObjects(profile);

            const AdminCap = Object.entries(profile.objects || {}).find(([objectType]) =>
                objectType.includes(`${PackageId}::fate::AdminCap`)
            ) as any;

            const AdminCapid = AdminCap?.[1]?.[0]?.data?.objectId;

            if (!AdminCapid) {
                console.error("Admin Cap not found.");
                return;
            }

            const tx = new Transaction();
            tx.setGasBudget(10000000);

            tx.moveCall({
                target: `${PackageId}::raffle::create_raffle`,
                arguments: [
                    tx.object(AdminCapid),
                    tx.pure.string(name),
                    tx.pure.string(description),
                    tx.pure.u64(ticketCost),
                    tx.pure.u64(refundRate),
                    tx.pure.u64(grandPrizeDuration),
                    tx.pure.u64(secondPrizeDuration),
                    tx.pure.u64(thirdPrizeDuration),
                    tx.pure.u64(grandPrizeWeight),
                    tx.pure.u64(secondPrizeWeight),
                    tx.pure.u64(thirdPrizeWeight),
                ],
            });

            const result = await signAndExecute({ transaction: tx });
            console.log(result);

            if (result && !isError) {
                onSuccess();
            }
        } catch (error) {
            console.error("Error creating raffle:", error);
        }
    };

    return (
        <div className="flex flex-col gap-4 max-w-md mx-auto w-full">
            <div className="flex flex-col gap-2">
                <label>抽奖名称</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="p-2 border rounded w-full"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label>抽奖描述</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="p-2 border rounded w-full min-h-[100px]"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label>票价</label>
                <input
                    type="number"
                    value={ticketCost}
                    onChange={(e) => setTicketCost(e.target.value)}
                    className="p-2 border rounded w-full"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label>退款比例</label>
                <input
                    type="number"
                    value={refundRate}
                    onChange={(e) => setRefundRate(e.target.value)}
                    className="p-2 border rounded w-full"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label>一等奖有效期</label>
                <input
                    type="number"
                    value={grandPrizeDuration}
                    onChange={(e) => setGrandPrizeDuration(e.target.value)}
                    className="p-2 border rounded w-full"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label>二等奖有效期</label>
                <input
                    type="number"
                    value={secondPrizeDuration}
                    onChange={(e) => setSecondPrizeDuration(e.target.value)}
                    className="p-2 border rounded w-full"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label>三等奖有效期</label>
                <input
                    type="number"
                    value={thirdPrizeDuration}
                    onChange={(e) => setThirdPrizeDuration(e.target.value)}
                    className="p-2 border rounded w-full"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label>一等奖权重</label>
                <input
                    type="number"
                    value={grandPrizeWeight}
                    onChange={(e) => setGrandPrizeWeight(e.target.value)}
                    className="p-2 border rounded w-full"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label>二等奖权重</label>
                <input
                    type="number"
                    value={secondPrizeWeight}
                    onChange={(e) => setSecondPrizeWeight(e.target.value)}
                    className="p-2 border rounded w-full"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label>三等奖权重</label>
                <input
                    type="number"
                    value={thirdPrizeWeight}
                    onChange={(e) => setThirdPrizeWeight(e.target.value)}
                    className="p-2 border rounded w-full"
                />
            </div>

            <button
                onClick={handleCreateRaffle}
                className="button-text mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
                创建抽奖
            </button>
        </div>
    );
};

export default CreateRaffle;