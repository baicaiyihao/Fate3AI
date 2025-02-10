import React, { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "../config/networkConfig";
import { CategorizedObjects } from "../utils/assetsHelpers";
import { TESTNET_PriceRecord, TESTNET_TokenPolicy } from "../config/constants";
import { getUserProfile } from "../utils/getUserObject";
import { Button } from "./ui/button";
import { base_prompt_en,  } from '../app/utils/fateprompt';
import toast from "react-hot-toast";


const AGENT_ID = process.env.NEXT_PUBLIC_ELIZA_AGENT_ID || '';
const ELIZA_URL = process.env.NEXT_PUBLIC_ELIZA_URL || '';

const Divination: React.FC<{ cardValue: string[], question: string, onSuccess: () => void, onError: (error: any) => void }> = ({ cardValue, question, onSuccess, onError }) => {
    const currentAccount = useCurrentAccount();
    const { mutateAsync: signAndExecute, isError } = useSignAndExecuteTransaction();
    const PackageId = useNetworkVariable("PackageId");
    const [userObjects, setUserObjects] = useState<CategorizedObjects | null>(null);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState("");

    const handleDivination = async () => {
        if (!currentAccount?.address) {
            onError("No connected account found.");
            return;
        }

        setLoading(true);

        try {
            const profile = await getUserProfile(currentAccount?.address);
            setUserObjects(profile);

            const allTokens = Object.entries(profile.objects || {}).filter(([objectType]) =>
                objectType.includes(`0x2::token::Token<${PackageId}::fate::FATE>`)
            ) as any;

            if (!allTokens.length || !allTokens[0][1]?.length) {
                toast.error("Token Not Found!Please check in get FATE token!");
            }

            const tx = new Transaction();
            tx.setGasBudget(10000000);

            const primaryTokenId = allTokens[0][1][0].data.objectId;

            tx.moveCall({
                target: `${PackageId}::fate::buyItem`,
                arguments: [
                    tx.object(primaryTokenId),
                    tx.object(TESTNET_PriceRecord),
                    tx.pure.string("taro"),
                    tx.object(TESTNET_TokenPolicy),
                ],
            });

            const result = await signAndExecute({ transaction: tx });

            await new Promise((resolve) => setTimeout(resolve, 5000));


            if (!result || isError) {
                toast.error("Payment failed");
            }

            // 2️⃣ **支付成功后，发送占卜请求**
            const formDataToSend = new FormData();
            formDataToSend.append('user', '');
            formDataToSend.append('text', base_prompt_en + `Cards: ${cardValue.join(", ")}\n${question} Use English reply`);
            formDataToSend.append('action', "NONE");

            const response = await fetch(ELIZA_URL + AGENT_ID + '/message', {
                method: 'POST',
                body: formDataToSend,
                headers: {
                    'Accept': 'application/json',
                    'Accept-Language': 'zh-CN,zh;q=0.9',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Divination response:", data);

            setResponse(data.map((item: any) => item.text).join("\n"));
            // setResponse("test");
            onSuccess();
        }finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Button
                onClick={handleDivination}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-medium rounded-xl transition-all duration-200">
                Start Divination
            </Button>

            {loading && <p className="text-blue-500 text-sm animate-pulse">Processing...</p>}
            {response && <div className="text-purple-600 text-center mt-4">{response}</div>}
        </div>
    );
};

export default Divination;
