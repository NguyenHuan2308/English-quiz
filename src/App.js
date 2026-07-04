import { Route, Routes } from "react-router-dom";
import Footer from "./components/footer,";
import Login from "./pages/login";
import Register from "./pages/Register";
import ManagerUsers from "./pages/admin/managerUsers";
import ManagerQuestions from "./pages/admin/questions";


function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/users" element={<ManagerUsers />} />
            <Route path="/questions" element={<ManagerQuestions/>}/>
        </Routes>
    );
}

export default App;
