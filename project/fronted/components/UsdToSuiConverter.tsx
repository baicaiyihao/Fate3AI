import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { SuiPriceServiceConnection, SuiPythClient } from "@pythnetwork/pyth-sui-js";
import { Transaction, TransactionObjectArgument } from "@mysten/sui/transactions";
import { useState } from "react";
import { getUserProfile } from "../utils/getUserObject";
import { useNetworkVariable } from "../config/networkConfig";
import { TESTNET_AppTokenCap, TESTNET_Suipool, TESTNET_TokenRecord } from "../config/constants";
import { Button } from "./ui/button";
import { toast } from "react-hot-toast";


const UsdToSuiConverter = () => {
  const client = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const PackageId = useNetworkVariable("PackageId");
  const connection = new SuiPriceServiceConnection("https://hermes-beta.pyth.network");
  const priceIDs = [
    // You can find the IDs of prices at https://pyth.network/developers/price-feed-ids
    "0x50c67b3fd225db8912a424dd4baed60ffdde625ed2feaaf283724f9608fea266", // SUI/USD price ID
  ];
  const wormholeStateId = "0x31358d198147da50db32eda2562951d53973a0c0ad5ed738e9b17d88b213d790";
  const pythStateId = "0x243759059f4c3111179da5878c12f68d612c21a8d54d85edc86164bb18be1c7c";
  const suipythclient = new SuiPythClient(client, pythStateId, wormholeStateId);

  const [usdAmount, setUsdAmount] = useState<string>("");
  const [suiAmount, setSuiAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [balanceEnough, setBalanceEnough] = useState<boolean>(false);
  
  const calculateSuiAmount = async (usdValue: string) => {
    if (!usdValue) {
      setSuiAmount("");
      setBalanceEnough(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const price = await connection.getLatestPriceFeeds(priceIDs) as any;
      const rawPrice = price[0]?.price?.price;
      const usd = parseFloat(usdValue);
      const suiValue = (usd * Math.pow(10, 8)) / rawPrice;
      setSuiAmount(suiValue.toFixed(9));

      // 检查余额是否充足
      if (currentAccount?.address) {
        const profile = await getUserProfile(currentAccount.address);
        const coins = Object.entries(profile.coins || {}).find(([objectType]) =>
          objectType.includes(`SUI`)
        ) as any;

        const suiObjects = coins[1];
        const totalBalance = suiObjects.reduce((sum: number, obj: any) => {
          return sum + parseInt(obj.data.content.fields.balance) / 1000000000;
        }, 0);

        setBalanceEnough(totalBalance >= suiValue);
      }
    } catch (error) {
      setError("获取价格失败，请稍后重试");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyItem = async () => {
    if (!currentAccount?.address) {
        console.error("No connected account found.");
        return;
    }

    try {
        let coin: TransactionObjectArgument;

        const tx = new Transaction();
        const priceUpdateData = await connection.getPriceFeedsUpdateData(priceIDs);
        const priceInfoObjectIds = await suipythclient.updatePriceFeeds(tx, priceUpdateData, priceIDs);
        const suiPayAmount = (parseFloat(suiAmount) * 1000000000) + 100000000;
        coin = tx.splitCoins(tx.gas, [suiPayAmount]);
        tx.setGasBudget(10000000);

        tx.moveCall({
            target: `${PackageId}::fate::swap_token`,
            arguments: [
                tx.object(coin),
                tx.object(TESTNET_Suipool),
                tx.pure.u64(usdAmount),
                tx.object(TESTNET_AppTokenCap),
                tx.pure.string("usd"),
                tx.object(TESTNET_TokenRecord),
                tx.object("0x6"),
                tx.object(priceInfoObjectIds[0]),
            ],
        });
        tx.transferObjects([coin], currentAccount.address);

        const result = await signAndExecute({ transaction: tx });

        if(result){
            toast.success(`Swap Success! You get ${parseFloat(usdAmount) * 150} FATE!`);
        }else{
            toast.error("Swap Failed!");
        }

    } catch (error) {
        console.error("Error checking in:", error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-nav">
          Swap USDC to FATE
        </h1>
        <p className="text-lg text-gray-600">
          Current Price: 1 USDC = 150 FATE
        </p>
      </div>

      <div className="w-full space-y-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">USDC Amount</label>
          <div className="relative">
            <input
              type="number"
              value={usdAmount}
              onChange={(e) => {
                setUsdAmount(e.target.value);
                calculateSuiAmount(e.target.value);
              }}
              placeholder="Enter USDT amount"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              USDC
            </span>
          </div>
        </div>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-2 text-sm text-gray-500">You will pay</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Required SUI</label>
          <div className="relative">
            <input
              type="text"
              value={suiAmount}
              disabled
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              SUI
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {!balanceEnough && suiAmount && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-600">余额不足</p>
          </div>
        )}

        <Button
          onClick={handleBuyItem}
          disabled={!balanceEnough || loading}
          variant="default"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 
          text-white font-bold py-3 px-6 rounded-xl shadow-lg transition duration-300 
          ease-in-out transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
              <span>处理中...</span>
            </div>
          ) : (
            "Swap Now"
          )}
        </Button>
      </div>
    </div>
  );
};

export default UsdToSuiConverter;