import React, {useState} from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "../networkConfig";

const CreateProfile: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const currentAccount = useCurrentAccount();
    const { mutateAsync: signAndExecute, isError } = useSignAndExecuteTransaction();
    const PackageId = useNetworkVariable("PackageId");
    const [loading, setLoading] = useState(false);
    const [handle, setHandle] = useState("");


    const create = async () => {
        if (!currentAccount?.address) {
            console.error("No connected account found.");
            return;
        }

        try {
            setLoading(true); // 设置加载状态

            const tx = new Transaction();
            tx.setGasBudget(10000000);

            tx.moveCall({
                arguments: [
                    tx.pure.string(handle),
                ],
                target: `${PackageId}::profile::mint`,
            });

            // 执行交易并等待结果
            const result = await signAndExecute({ transaction: tx });

            // 如果交易成功，调用回调函数
            if (result && !isError) {
                onSuccess(); // 调用成功的回调函数
            }
        } catch (error) {
            console.error("Error creating Profile:", error);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="Enter handle"
                className="p-2 border rounded"
            />
            <button
                onClick={create}
                className="button-text"
                disabled={!handle || loading}
            >
                {loading ? "Creating..." : "Create Profile"}
            </button>
        </div>
    );
};

export default CreateProfile;
