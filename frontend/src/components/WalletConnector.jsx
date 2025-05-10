// // src/components/WalletConnector.js
// import { useWallet } from '../context/WalletContext';

// const WalletConnector = () => {
//   const {
//     currentAccount,
//     isConnected,
//     error,
//     connectWallet,
//     disconnectWallet,
//   } = useWallet();

//   const shortenAddress = (address) => {
//     return `${address.slice(0, 6)}...${address.slice(-4)}`;
//   };

//   return (
//     <div className="wallet-connector">
//       {error && <p className="error">{error}</p>}
      
//       {isConnected ? (
//         <div className="wallet-connected">
//           <span>Connected: {shortenAddress(currentAccount)}</span>
//           <button onClick={disconnectWallet}>Disconnect</button>
//         </div>
//       ) : (
//         <button onClick={connectWallet} className="connect-wallet-btn">
//           Connect MetaMask
//         </button>
//       )}
//     </div>
//   );
// };

// export default WalletConnector;