import { Route, Routes } from "react-router-dom";
import Footer from "./components/footer,";
import Login from "./pages/login";
import Register from "./pages/Register";


function App() {
  return (
    <Routes>

      <Route path="/login" element={<Login />} />
      
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
