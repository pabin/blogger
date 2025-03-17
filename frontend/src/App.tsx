import "./App.css";
import AppProviders from "./contexts/AppProviders";
import MainRoutes from "./routes/Routes";

function App() {
  return (
    <AppProviders>
      <MainRoutes />
    </AppProviders>
  );
}

export default App;
