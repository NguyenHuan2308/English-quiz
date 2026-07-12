import { Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/Register";
import ManagerUsers from "./pages/admin/managerUsers";
import ManagerQuestions from "./pages/admin/questions";
import Quiz from "./pages/user/quiz";
import History from "./pages/user/history";
import HistoryAdmin from "./pages/admin/historyAdmin";


function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/users" element={<ManagerUsers />} />
            <Route path="/questions" element={<ManagerQuestions />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/history" element={<History />} />
            <Route path="/historyAdmin" element={<HistoryAdmin />} />
        </Routes>
    );
}

export default App;
