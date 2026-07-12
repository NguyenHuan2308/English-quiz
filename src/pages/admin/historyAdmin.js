import { Alert, Container, Spinner, Table } from "react-bootstrap";
import Header from "../../components/header";
import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../../components/footer,";

function HistoryAdmin() {
    const [history, setHistory] = useState([]);
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const parseCustomDate = (dateStr) => {
        if (!dateStr) return new Date(0);

        const [timePart, datePart] = dateStr.split(" ");
        if (!timePart || !datePart) return new Date(0);

        const [hours, minutes, seconds] = timePart.split(":").map(Number);
        const [day, month, year] = datePart.split("/").map(Number);
        return new Date(year, month - 1, day, hours, minutes, seconds);
    };

    useEffect(() => {
        const fetchHis = async () => {
            setLoading(true);
            try {
                const [resHistory, resUsers] = await Promise.all([
                    axios.get('http://localhost:9999/history'),
                    axios.get('http://localhost:9999/users')
                ]);

                setUsers(resUsers.data);

                // Sắp xếp lịch sử theo thời gian mới nhất lên đầu
                const sortedHistory = resHistory.data.sort((a, b) => parseCustomDate(b.time) - parseCustomDate(a.time));

                setHistory(sortedHistory);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu lịch sử:", err);
                setError("Không thể tải lịch sử nộp bài từ hệ thống.");
            } finally {
                setLoading(false);
            }
        };
        fetchHis();
    }, []);

    const getUser = (id) => {
        const user = users.find((user) => user.id === id);
        return user;
    }

    if (loading) {
        return (
            <>
                <Header />
                <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                    <Spinner animation="border" variant="primary" size="lg" className="mb-3" />
                    <h5 className="text-secondary fw-semibold">Đang tải lịch sử thi, vui lòng đợi...</h5>
                </div>
                <Footer />
            </>
        );
    }

    const getScoreClass = (scoreStr) => {
    if (!scoreStr) return "text-dark";
    // Tách chuỗi "3/10" -> lấy số 3
    const correctCount = parseInt(scoreStr.split('/')[0]) || 0;
    
    // Nếu đúng từ 5 câu trở lên thì trả về class màu xanh, ngược lại màu đỏ
    return correctCount >= 5 ? "text-success fw-bold" : "";
};

    return (
        <>
            <Header />
            <div className='bgImg p-md-5'>
                <Container className='mt-5 p-md-5'>
                    <h3 className="text-center mb-4 text-secondary">Lịch sử nộp bài của người dùng</h3>
                    {error && <Alert variant="danger" className="text-center">{error}</Alert>}
                    <Table bordered hover responsive className="shadow-sm text-center align-middle mt-4 custom-table">
                        <thead>
                            <tr className='heading'>
                                <th style={{ width: '7%' }}>No.</th>
                                <th style={{ width: '30%' }}>Họ tên</th>
                                <th style={{ width: '30%' }}>Tài khoản</th>
                                <th style={{ width: '16.5%' }}>Điểm</th>
                                <th style={{ width: '16.5%' }}>Ngày nộp bài</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((his, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{getUser(his.userId).fullname}</td>
                                    <td>{getUser(his.userId).username}</td>
                                    <td className={getScoreClass(his.score)}>{his.score}</td>
                                    <td>{his.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Container>
            </div>
            <Footer />
        </>
    );
}

export default HistoryAdmin;