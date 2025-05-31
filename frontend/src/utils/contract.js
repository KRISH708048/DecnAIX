import { ethers } from "ethers";
import abi from "../abi/DecnAIX.js";
import { Interface } from "ethers";

export const iface = new Interface(abi);
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
console.log(CONTRACT_ADDRESS);
export const getContract = async () => {
  if (!window.ethereum) throw new Error("Install MetaMask");

  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner();
  console.log(provider,signer);
  return new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
};
