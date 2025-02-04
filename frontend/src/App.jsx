import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import "./App.css";
import Layout from "./components/Rent/Layout";
import Dashboard from "./components/Rent/Screens/Dashboard";
import FeaturesWeights from "./components/Rent/Screens/FeaturesWeights";
import CreateTask from "./components/Rent/Screens/CreateTask";
import SelectMachine from "./components/Rent/Screens/SelectMachine";
import Transactions from "./components/Rent/Screens/Transactions";

function App() {
  return (
    <main className="App min-h-[calc(100svh-81px)]" id="app">
      <Router>
        {/* <NavBar /> */}
        <Routes>
          {/* Home Route */}
          <Route path="/" element={<Home />} />
          
          {/* Rent Layout with nested routes */}
          <Route path="/Rent" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="machine" element={<Dashboard />} />
            <Route path="features-weights" element={<FeaturesWeights />} />
            <Route path="create-task" element={<CreateTask />} />
            <Route path="select-machine" element={<SelectMachine />} />
            <Route path="transactions" element={<Transactions />} />
          </Route>
        </Routes>
      </Router>
    </main>
  );
}

export default App;
