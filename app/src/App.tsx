import { useEffect, useState } from "react";
import "./App.css";
import { getSigner, enterLottery, pickWinner, getBalance, getPlayersCount, getOwner } from "./blockchainUtils";


// function App() {
//   const [pets, setPets] = useState<Pet[]>([]);
//   const [petIds, setPetIds] = useState<number[]>([]);

//   useEffect(() => {
//     fetch("./assets/pets.json").then(res => res.json()).then(data => {
//       setPets(data);
//     });
//     init();
//   }, []);

//   const init = async () => {
//     setPetIds(await getPets());
//   }

//   return (
//     <>
//       <div className="container">
//         <div className="row">
//           <div className="col-xs-12 col-sm-8 col-sm-push-2">
//             <h1 className="text-center">Pete's Pet Shop</h1>
//             <hr />
//             <br />
//           </div>
//         </div>

//         <div className="row">
//           {pets.map(i =>
//             <Card
//               key={i.id}
//               item={i}
//               adopted={petIds.includes(i.id)}
//               afterAdopt={init}
//             />)}
//         </div>
//       </div>
//     </>
//   )
// }

function App() {
  const [account, setAccount] = useState<string>("");
  const [balance, setBalance] = useState<string>("0");
  const [playersCount, setPlayersCount] = useState<number>(0);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => { init(); }, []);

  const init = async () => {
    const signer = await getSigner();
    if (!signer) return;

    const addr = await signer.getAddress();
    setAccount(addr);

    const ownerAddr = await getOwner();
    setIsOwner(ownerAddr.toLowerCase() === addr.toLowerCase());

    await loadData();
  };

  const loadData = async () => {
    setBalance(await getBalance());
    setPlayersCount(await getPlayersCount());
  };

  const handleEnter = async () => {
    setLoading(true);
    await enterLottery();
    await loadData();
    setLoading(false);
  };

  const handlePickWinner = async () => {
    setLoading(true);
    await pickWinner();
    await loadData();
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🎰 Lottery DApp</h1>

      {!account ? (
        <button onClick={init}>Connect MetaMask</button>
      ) : (
        <>
          <p><strong>Connected:</strong> {account}</p>
          <p><strong>Contract Balance:</strong> {balance} ETH</p>
          <p><strong>Players:</strong> {playersCount}</p>

          <button onClick={handleEnter} disabled={loading}>
            {loading ? "Processing..." : "Enter (2 ETH)"}
          </button>

          {isOwner && (
            <button onClick={handlePickWinner} disabled={loading}>
              {loading ? "Processing..." : "Pick Winner"}
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default App;