import Transactions from "./Screens/Transactions";
import FeaturesExplorer from "./Screens/FeaturesWeights";
// import CreateTask from "./Screens/CreateTask";
import CreateTaskD from "./Screens/CreateTaskD";
import SearchWrapper from "./Screens/SelectMachine";

const tabs = [
  <Transactions key={0} />,
  <FeaturesExplorer key={1} />,
  <SearchWrapper key={2} />,
  // <CreateTask key={3} />,
  <CreateTaskD key={3}/>,
];

export default tabs;
