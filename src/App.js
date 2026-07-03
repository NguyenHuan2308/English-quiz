import { Route, Routes } from "react-router-dom";
import Footer from "./components/footer,";
import Login from "./pages/login";
import Register from "./pages/Register";
import ManagerUsers from "./pages/admin/managerUsers";


function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/users" element={<ManagerUsers />} />
        </Routes>
    );
}

export default App;
