import { BrowserProvider, Contract, ethers, Signer } from "ethers";

export const contractAddress = "0xfcDb6c44a73068237E13063a629f969E72450Cfc";

export const abi = [
  "function enter() external payable",
  "function getBalanceL() public view returns (uint256)",
  "function getPlayersCount() public view returns (uint)",
  "function pickwinner() external",
  "function owner() public view returns (address)"
];

declare global {
  interface Window { ethereum?: any; }
}

export const getProvider = (): BrowserProvider | null => {
  if (!window.ethereum) {
    alert("Install MetaMask!");
    return null;
  }
  return new ethers.BrowserProvider(window.ethereum);
};

export const getSigner = async (): Promise<Signer | null> => {
  const provider = getProvider();
  if (!provider) return null;
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
};

export const getContract = async (): Promise<Contract | null> => {
  const signer = await getSigner();
  return signer ? new Contract(contractAddress, abi, signer) : null;
};

export const withContract = async (action: (contract: Contract) => any) => {
  const contract = await getContract();
  if (!contract) return;
  try { return await action(contract); }
  catch (err) { console.error("Contract error:", err); }
};

// export const adopt = async (petId: number): Promise<void> => {
//   await withContract(async (contract) => {
//     const tx = await contract.adopt(petId);
//     await tx.wait();
//   });
// };

// export const getPets = async () => {
//   return withContract(async (contract) => {
//     const result: bigint[] = await contract.getPets(); // Fetch data
//     const ids = result.map((num) => Number(num)); // Convert from BigInt to number
//     return ids;
//   });
// };



export const enterLottery = async (): Promise<void> => {
  await withContract(async (contract) => {
    const tx = await contract.enter({ value: ethers.parseEther("2") });
    await tx.wait();
  });
};

export const pickWinner = async (): Promise<void> => {
  await withContract(async (contract) => {
    const tx = await contract.pickwinner();
    await tx.wait();
  });
};

export const getBalance = async (): Promise<string> => {
  return await withContract(async (contract) => {
    const bal = await contract.getBalanceL();
    return ethers.formatEther(bal);
  }) || "0";
};

export const getPlayersCount = async (): Promise<number> => {
  return await withContract(async (contract) => {
    const count = await contract.getPlayersCount();
    return Number(count);
  }) || 0;
};

export const getOwner = async (): Promise<string> => {
  return await withContract(async (contract) => {
    return await contract.owner();
  }) || "";
};
