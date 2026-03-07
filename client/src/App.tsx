import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthForm } from "./components/AuthForm";
import { Dashboard } from "./components/dashboard";

function App() {
  return (
    // BrowserRouter to silnik naszej "zwrotnicy"
    <BrowserRouter>
      <Routes>
        {/* Gdy ktoś wchodzi na główny adres (np. localhost:5173/) -> widzi Dashboard */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Gdy ktoś wchodzi na adres logowania (np. localhost:5173/login) -> widzi Formularz */}
        <Route path="/login" element={<AuthForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;