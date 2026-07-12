import axios from "axios";
import { useEffect, useState } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer,";
import { Alert, Card, Col, Container, Form, Row, Spinner, Table } from "react-bootstrap";

function History() {
    const [userHistory, setUserHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [sortType, setSortType] = useState("date-desc"); // Các giá trị: 'date-desc', 'score-desc', 'score-asc'
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('currentUser'));
                if (!user) {
                    setError("Bạn cần đăng nhập để xem lịch sử làm bài!");
                    setLoading(false);
                    return;
                } else {
                    const res = await axios.get('http://localhost:9999/history');
                    const filteredHistory = res.data.filter(item => item.userId === user.id);
                    const hisDes = filteredHistory.sort((a, b) => (new Date(a.time)) - new Date(b.time))
                    setUserHistory(hisDes);
                    setLoading(false);
                }
            } catch (error) {
                console.log("Error: ", error);
                setError("Không thể tải danh mục lịch sử. Vui lòng thử lại sau!");
                setLoading(false);
            }
        }
        fetchHistory();
    }, []);

    const getScore = (scoreStr) => {
        const correct = scoreStr.split("/");
        return Number(correct[0]);
    };

    const parseCustomDate = (dateStr) => {
        if (!dateStr) return new Date(0);

        const [timePart, datePart] = dateStr.split(" ");
        if (!timePart || !datePart) return new Date(0);

        const [hours, minutes, seconds] = timePart.split(":").map(Number);
        const [day, month, year] = datePart.split("/").map(Number);
        return new Date(year, month - 1, day, hours, minutes, seconds);
    };

    const handleSortAndFilter = () => {
        let data = [...userHistory];

        if (statusFilter !== 'all') {
            data = data.filter(item => {
                const score = getScore(item.score);
                return statusFilter === 'pass' ? score >= 5 : score < 5;
            })
        }

        data.sort((a, b) => {
            if (sortType === 'date-desc') {
                return parseCustomDate(b.time) - parseCustomDate(a.time);
            }
            if (sortType === "score-desc") {
                return getScore(b.score) - getScore(a.score);
            }
            if (sortType === "score-asc") {
                return getScore(a.score) - getScore(b.score);
            }
            if (sortType === "date-asc") {
                return parseCustomDate(a.time) - parseCustomDate(b.time)
            }
            return 0;
        })
        return data;
    }

    const data = handleSortAndFilter();

    return (
        <>
            <Header />
            <div className="bgImg">
                <Container className="mt-5 p-md-5">
                    <Card className="shadow-sm border-0 p-md-4">
                        <Card.Title className="text-secondary fw-bold fs-3 mb-4 text-center">
                            📊 LỊCH SỬ LÀM BÀI THI
                        </Card.Title>
                        {loading && (
                            <div className="text-center my-5">
                                <Spinner animation="border" variant="primary" className="me-2" />
                                <span>Đang tải lịch sử, vui lòng đợi...</span>
                            </div>
                        )}
                        {error && <div className="d-flex justify-content-center"><Alert variant="danger" className="text-center fw-bold">{error}</Alert></div>}
                        {!loading && !error && userHistory.length === 0 && (
                            <Alert variant="info" className="text-center fs-5 py-4">
                                📭 Bạn chưa tham gia lượt thi nào. Hãy vào trang làm bài để thử sức nhé!
                            </Alert>
                        )}
                        {!loading && !error && data.length === 0 && userHistory.length > 0 && (
                            <Alert variant="info" className="text-center fs-5 py-4">
                                📭 Không tìm thấy lịch sử phù hợp với bộ lọc.
                            </Alert>
                        )}
                        <Row>
                            <Col md={9}>
                                <Card.Body>
                                    {!loading && !error && data.length > 0 && (
                                        <Table striped bordered hover responsive className="align-middle text-center m-0">
                                            <thead className="table-primary text-primary">
                                                <tr>
                                                    <th>No.</th>
                                                    <th>Ngày nộp</th>
                                                    <th>Điểm</th>
                                                    <th>Trạng thái</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.map((item, index) => {
                                                    const [correct, total] = item.score.split("/").map(Number);
                                                    const percentage = (correct / total) * 100;

                                                    let statusVariant = "text-danger fw-bold";
                                                    if (percentage >= 50) statusVariant = "text-success fw-bold";
                                                    return (
                                                        <tr key={item.id}>
                                                            <td>{index + 1}</td>
                                                            <td className="text-muted p-3">{item.time}</td>
                                                            <td className={statusVariant}>{item.score}</td>
                                                            <td>
                                                                <span className={statusVariant}>
                                                                    {percentage >= 50 ? "Đạt" : "Chưa Đạt"}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </Table>

                                    )}
                                </Card.Body>
                            </Col>
                            <Col md={3} className="mt-3">
                                <Card.Body className="bg-light rounded p-3 border">
                                    <h5 className="text-dark fw-bold mb-3">🛠️ Bộ lọc & Sắp xếp</h5>

                                    {/* PHẦN SẮP XẾP (sử dụng Radio để đảm bảo tại 1 thời điểm chỉ sort theo 1 kiểu) */}
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold text-secondary">Sắp xếp theo:</Form.Label>
                                        <Form.Check
                                            type="radio"
                                            id="sort-date-desc"
                                            label="Ngày giảm dần"
                                            name="sortGroup"
                                            checked={sortType === "date-desc"}
                                            onChange={() => setSortType("date-desc")}
                                            className="mb-2"
                                        />
                                        <Form.Check
                                            type="radio"
                                            id="sort-date-asc"
                                            label="Ngày tăng dần"
                                            name="sortGroup"
                                            checked={sortType === "date-asc"}
                                            onChange={() => setSortType("date-asc")}
                                            className="mb-2"
                                        />
                                        <Form.Check
                                            type="radio"
                                            id="sort-score-desc"
                                            label="Điểm giảm dần"
                                            name="sortGroup"
                                            checked={sortType === "score-desc"}
                                            onChange={() => setSortType("score-desc")}
                                            className="mb-2"
                                        />
                                        <Form.Check
                                            type="radio"
                                            id="sort-score-asc"
                                            label="Điểm tăng dần"
                                            name="sortGroup"
                                            checked={sortType === "score-asc"}
                                            onChange={() => setSortType("score-asc")}
                                        />
                                    </Form.Group>

                                    <hr />

                                    {/* PHẦN LỌC TRẠNG THÁI */}
                                    <Form.Group>
                                        <Form.Label className="fw-semibold text-secondary">Trạng thái kết quả:</Form.Label>
                                        <Form.Check
                                            type="radio"
                                            id="filter-all"
                                            label="Tất cả"
                                            name="statusGroup"
                                            checked={statusFilter === "all"}
                                            onChange={() => setStatusFilter("all")}
                                            className="mb-2"
                                        />
                                        <Form.Check
                                            type="radio"
                                            id="filter-pass"
                                            label="Đạt"
                                            name="statusGroup"
                                            checked={statusFilter === "pass"}
                                            onChange={() => setStatusFilter("pass")}
                                            className="mb-2 text-success fw-medium"
                                        />
                                        <Form.Check
                                            type="radio"
                                            id="filter-fail"
                                            label="Chưa đạt"
                                            name="statusGroup"
                                            id="filter-fail"
                                            checked={statusFilter === "fail"}
                                            onChange={() => setStatusFilter("fail")}
                                            className="text-danger fw-medium"
                                        />
                                    </Form.Group>
                                </Card.Body>
                            </Col>
                        </Row>
                    </Card>
                </Container>
            </div>
            <Footer />
        </>
    );
}

export default History;