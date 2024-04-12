import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/signup/Signup";
import "tailwindcss/tailwind.css";
import Login from "./pages/login/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* 404 */}
        <Route path="*" element={<div>Nothing here 404</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
