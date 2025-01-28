import { getFullnodeUrl } from "@mysten/sui/client";
import {
  TESTNET_FATE3AI_PACKAGE_ID,
  MAINNET_FATE3AI_PACKAGE_ID,
} from "./config/constants";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        PackageId: TESTNET_FATE3AI_PACKAGE_ID,
      },
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
      variables: {
        PackageId: MAINNET_FATE3AI_PACKAGE_ID,
      },
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };
