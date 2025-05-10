import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { userAtom } from "@/store/authAtom";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./components/Home/Home";
import "./App.css";
import Layout from "./components/Rent/RentLayout";
import Dashboard from "./components/Rent/Screens/Dashboard";
import FeaturesWeights from "./components/Rent/Screens/FeaturesWeights";
import CreateTask from "./components/Rent/Screens/CreateTask";
import SelectMachine from "./components/Rent/Screens/SelectMachine";
import Transactions from "./components/Rent/Screens/Transactions";
import ProviderLayout from "./components/provider/ProviderLayout";
import ProviderDashboard from "./components/provider/Screens/ProviderDashboard";
import ProviderTransactions from "./components/provider/Screens/ProviderTransactions";
import Machine from "./components/provider/Screens/Machine";
import Computation from "./components/provider/Screens/Computation";
import AuthPage from "./components/Home/AuthPage";
import AddMachine from "./components/provider/Features/AddMachine";

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useRecoilState(userAtom);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiry = parseInt(localStorage.getItem("tokenExpiry"), 10);
    const userData = JSON.parse(localStorage.getItem("user"));

    if (token && expiry > Date.now() && userData) {
      setUser({
        userId: userData.id,
        name: userData.name,
        role: userData.role,
        validTill: expiry.toString(),
      });

      switch (userData.role) {
        case "Both":
          navigate("/");
          break;
        case "Tenant":
          navigate("/Rent");
          break;
        case "Provider":
          navigate("/Provider");
          break;
        default:
          navigate("/");
      }
    }
  }, []);
  return (
    <main className="App min-h-[calc(100svh-81px)]" id="app">

        {/* <NavBar /> */}
        <Routes>
          {/* Home Route */}
          <Route path="/" element={<Home />} />
          <Route path="/auth"element={<AuthPage />} />
          {/* Rent Layout with nested routes */}
          <Route path="/Rent" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="machine" element={<Dashboard />} />
            <Route path="features-weights" element={<FeaturesWeights />} />
            <Route path="create-task" element={<CreateTask />} />
            <Route path="select-machine" element={<SelectMachine />} />
            <Route path="transactions" element={<Transactions />} />
          </Route>
          <Route path="/Provider" element={<ProviderLayout />}>
            <Route index element={<ProviderDashboard />} />
            <Route path="transactions" element={<ProviderTransactions />} />
            <Route path="add-machines" element={<AddMachine />} />
            <Route path="machines" element={<Machine />} />
            <Route path="computation" element={<Computation />} />
          </Route>
        </Routes>
    </main>
  );
}

export default App;
