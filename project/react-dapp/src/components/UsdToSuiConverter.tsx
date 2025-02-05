import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { SuiPriceServiceConnection, SuiPythClient } from "@pythnetwork/pyth-sui-js";
import { Transaction, TransactionObjectArgument } from "@mysten/sui/transactions";
import { useState } from "react";
import { getUserProfile } from "../utils/getUserObject";
import { useNetworkVariable } from "../networkConfig";
import { TESTNET_AppTokenCap, TESTNET_Suipool, TESTNET_TokenRecord } from "../config/constants";


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

        console.log(result);

    } catch (error) {
        console.error("Error checking in:", error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px' }}>输入 USD 金额：</label>
        <input
          type="number"
          value={usdAmount}
          onChange={(e) => {
            setUsdAmount(e.target.value);
            calculateSuiAmount(e.target.value);
          }}
          placeholder="输入 USD 金额"
          style={{ padding: '8px', width: '200px' }}
        />
      </div>

      {loading && <p>计算中...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {suiAmount && !loading && (
        <div>
          <p>等值 SUI: {suiAmount} SUI</p>
          {!balanceEnough && <p style={{ color: 'red' }}>余额不足</p>}
        </div>
      )}
      <button onClick={handleBuyItem} disabled={!balanceEnough || loading}>兑换</button>
    </div>
  );
};

export default UsdToSuiConverter;