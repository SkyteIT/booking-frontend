// src/App.tsx
import { BrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout/MainLayout";
import LandingPage from "./pages/public/LandingPage";

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <LandingPage />
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
