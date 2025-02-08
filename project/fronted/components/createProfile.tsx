import React, { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "../config/networkConfig";
import { CategorizedObjects } from "../utils/assetsHelpers";
import { TESTNET_FATE3AI_PACKAGE_ID } from "../config/constants";
import { getUserProfile } from "../utils/getUserObject";

const CreateProfile: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const currentAccount = useCurrentAccount();
    const { mutateAsync: signAndExecute, isError } = useSignAndExecuteTransaction();
    const PackageId = useNetworkVariable("PackageId");
    const [userObjects, setUserObjects] = useState<CategorizedObjects | null>(null);
    const [loading, setLoading] = useState(false);
    const [handle, setHandle] = useState("");


    const create = async () => {
        if (!currentAccount?.address) {
            console.error("No connected account found.");
            return;
        }

        try {
            setLoading(true);
            
            const profile = await getUserProfile(currentAccount?.address);
            setUserObjects(profile);

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
        <div className="flex flex-col items-center justify-center p-6 space-y-6 bg-white rounded-xl shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Your Profile</h2>
            <div className="w-full space-y-4">
                <div className="relative">
                    <input
                        type="text"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                        placeholder="Enter handle"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-white shadow-sm"
                    />
                </div>
                <button
                    onClick={create}
                    disabled={!handle || loading}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${!handle || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transform hover:-translate-y-0.5 hover:shadow-lg'}`}
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating...
                        </div>
                    ) : (
                        'Create Profile'
                    )}
                </button>
            </div>
        </div>
    );
};

export default CreateProfile;
