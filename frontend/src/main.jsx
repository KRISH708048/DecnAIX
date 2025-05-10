import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RecoilRoot } from "recoil";
import { BrowserRouter as Router } from "react-router-dom";
// import { WalletProvider } from "./context/WalletContext";

createRoot(document.getElementById("root")).render(
  <RecoilRoot>
    <Router>
      {/* <WalletProvider> */}
        <App />
      {/* </WalletProvider> */}
    </Router>
  </RecoilRoot>
);
