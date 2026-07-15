import { Alert, Button, Card, Col, Container, Form, Modal, ProgressBar, Row, Spinner } from "react-bootstrap";
import Footer from "../../components/footer,"; // Lưu ý: Bạn nên sửa dấu phẩy ở cuối tên file component này nếu nó bị lỗi import
import Header from "../../components/header";
import { useEffect, useState } from "react";
import axios from "axios";

function Quiz() {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isFinished, setIsFinished] = useState(false);
    const [history, setHistory] = useState([]);
    const [score, setScore] = useState("");
    const [loading, setLoading] = useState(true);
    const [alertInfo, setAlertInfo] = useState({ show: false, message: "", variant: "danger" });
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // 1. Dùng State để lưu danh sách các index câu hỏi đã được đánh dấu
    const [markedQuestions, setMarkedQuestions] = useState({});

    const [timeLeft, setTimeLeft] = useState(60);

    // === THÊM EFFECT CHẠY ĐỒNG HỒ ĐẾM NGƯỢC ===
    useEffect(() => {
        if (loading || isFinished) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [loading, isFinished]);

    // === THÊM EFFECT TỰ ĐỘNG NỘP BÀI KHI HẾT GIỜ ===
    useEffect(() => {
        if (timeLeft === 0) {
            showAlert("⏰ Hết giờ làm bài! Hệ thống đang tự động nộp bài...", "warning");
            handleExecuteSubmit();
        }
    }, [timeLeft]);

    // === HÀM FORMAT THỜI GIAN THÀNH mm:ss ===
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const showAlert = (message, variant = "danger") => {
        setAlertInfo({ show: true, message, variant });
        setTimeout(() => {
            setAlertInfo({ show: false, message: "", variant: "danger" });
        }, 4000);
    };

    const fetchQuestion = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:9999/questions');
            const his = await axios.get('http://localhost:9999/history');
            setHistory(his.data);
            const allQues = res.data;
            const ques5 = [...allQues].sort(() => 0.5 - Math.random());
            setQuestions(ques5.slice(0, 10));
        } catch (error) {
            console.log("Error: ", error);
            showAlert("❌ Không thể tải câu hỏi từ hệ thống!", "danger");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestion();
    }, []);

    const handleSelectAnswer = (answer) => {
        if (isFinished) return;
        setSelectedAnswers({
            ...selectedAnswers,
            [currentIndex]: answer,
        });
    };

    const handlePreSubmitCheck = () => {
        setShowConfirmModal(true);
    };

    const handleExecuteSubmit = async () => {
        setShowConfirmModal(false);

        let correctCount = 0;
        questions.forEach((q, index) => {
            if (selectedAnswers[index] === q.correctAnswer) {
                correctCount++;
            }
        });

        setScore(`${correctCount}/${questions.length}`);
        const submissionTime = new Date().toLocaleString('vi-VN');
        const id = history.length > 0 ? Number(history[history.length - 1].id) + 1 : 1;

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const payload = {
            id: String(id),
            userId: currentUser ? currentUser.id : "GUEST",
            score: `${correctCount}/${questions.length}`,
            time: submissionTime
        };

        try {
            const response = await axios.post('http://localhost:9999/history', payload);
            setHistory(prevHistory => [...prevHistory, response.data]);
            showAlert(`🎉 Nộp bài thành công!`, "success");
            setIsFinished(true);
        } catch (error) {
            console.error("Lỗi khi lưu kết quả thi:", error);
            showAlert("❌ Nộp bài thất bại! Không thể kết nối hoặc lưu vào cơ sở dữ liệu.", "danger");
        }
    };

    const handleResetQuiz = () => {
        setIsFinished(false);
        setSelectedAnswers({});
        setMarkedQuestions({}); // Reset lại danh sách đánh dấu khi làm lại bài
        setCurrentIndex(0);
        setTimeLeft(300);
        setScore("");
        fetchQuestion();
    };

    // 2. Hàm xử lý bật/tắt Đánh dấu (Bookmark) câu hỏi hiện tại
    const toggleMarkQuestion = () => {
        setMarkedQuestions(prev => ({
            ...prev,
            [currentIndex]: !prev[currentIndex]
        }));
    };

    const currentQuestion = questions[currentIndex];

    if (loading) {
        return (
            <>
                <Header />
                <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                    <Spinner animation="border" variant="primary" size="lg" className="mb-3" />
                    <h5 className="text-secondary fw-semibold">Đang tải câu hỏi, vui lòng đợi...</h5>
                </div>
                <Footer />
            </>
        );
    }

    if (!currentQuestion) {
        return (
            <>
                <Header />
                <Container className="text-center mt-5 p-5">
                    <Alert variant="warning">Không tìm thấy dữ liệu câu hỏi.</Alert>
                </Container>
                <Footer />
            </>
        );
    }

    const answeredCount = Object.keys(selectedAnswers).length;
    const progressPercent = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

    return (
        <>
            <Header />
            <div className="bgImg">
                <Container className="p-md-5">
                    <h1 className="text-secondary fw-bold fs-3 mt-5 text-center shadow-sm border-0 p-4">📝 BÀI THI</h1>
                    {alertInfo.show && (
                        <Alert
                            variant={alertInfo.variant}
                            onClose={() => setAlertInfo({ ...alertInfo, show: false })}
                            dismissible
                            className="mt-3 sticky-top shadow-sm"
                            style={{ top: "20px", zIndex: 1050 }}
                        >
                            {alertInfo.message}
                        </Alert>
                    )}

                    <fieldset disabled={isFinished} style={{ opacity: isFinished ? 0.8 : 1 }}>
                        <Row className="mt-5" >
                            <Col md={8}>
                                <Card className="shadow-sm border-0 p-4 mb-3">
                                    <Card.Title className="text-secondary fw-bold d-flex justify-content-between align-items-center">
                                        <span>Câu hỏi: {currentIndex + 1} / {questions.length}</span>

                                        {/* 3. Nút bấm Bookmark: Đổi màu và chữ tùy theo trạng thái */}
                                        <Button
                                            variant={markedQuestions[currentIndex] ? "warning" : "secondary"}
                                            onClick={toggleMarkQuestion}
                                            size="md"
                                        >
                                            Mark
                                        </Button>
                                    </Card.Title>
                                    <Card.Body className="px-0">
                                        <h4 className="mb-4 fw-semibold">{currentQuestion.text}</h4>
                                        <Form className="mb-4">
                                            {['A', 'B', 'C', 'D'].map((letter, idx) => (
                                                <div
                                                    key={letter}
                                                    onClick={() => handleSelectAnswer(currentQuestion.options?.[idx])}
                                                    className={`p-3 mb-2 border rounded-3 d-flex align-items-center ${selectedAnswers[currentIndex] === currentQuestion.options?.[idx] ? 'bg-light border-primary' : ''}`}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <Form.Check
                                                        type="radio"
                                                        label={`${letter}. ${currentQuestion.options?.[idx]}`}
                                                        checked={selectedAnswers[currentIndex] === currentQuestion.options?.[idx]}
                                                        onChange={() => handleSelectAnswer(currentQuestion.options?.[idx])}
                                                        className="w-100 fs-5"
                                                    />
                                                </div>
                                            ))}
                                        </Form>
                                        <div className="d-flex justify-content-between">
                                            <Button
                                                variant="secondary"
                                                disabled={currentIndex === 0}
                                                onClick={() => setCurrentIndex(currentIndex - 1)}
                                            >
                                                ⬅️ Câu trước
                                            </Button>
                                            <Button
                                                variant="primary"
                                                disabled={currentIndex === questions.length - 1}
                                                onClick={() => setCurrentIndex(currentIndex + 1)}
                                            >
                                                Câu sau ➡
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card className="shadow-sm border-0 p-3 text-center" >
                                    <Card.Title className="fw-bold mb-3"><span>Tiến độ làm bài</span>
                                        <span className={`fs-5 fw-bold px-2 py-1 rounded ${timeLeft < 60 ? 'text-danger border border-danger' : 'text-primary'}`}>
                                            ⏱️ {formatTime(timeLeft)}
                                        </span></Card.Title>
                                    <div className="mb-3">
                                        <ProgressBar
                                            animated
                                            now={progressPercent}
                                            variant={progressPercent === 100 ? "success" : "info"}
                                            style={{ height: "12px" }}
                                        />
                                    </div>
                                    <Card.Body className="d-flex flex-wrap justify-content-start gap-3 mb-4">
                                        {questions.map((_, index) => {
                                            // 4. Thiết lập màu sắc hiển thị cho danh sách số câu bên phải dựa vào trạng thái làm bài và trạng thái bookmark
                                            let btnVariant = "outline-secondary";
                                            if (selectedAnswers[index]) {
                                                btnVariant = "success";
                                            }

                                            return (
                                                <Button
                                                    key={index}
                                                    variant={btnVariant}
                                                    style={{ width: '50px', height: '45px', position: 'relative' }}
                                                    className={`p-0 fw-bold ${currentIndex === index ? 'border-dark border-2 shadow-sm' : ''}`}
                                                    onClick={() => setCurrentIndex(index)}
                                                >
                                                    {index + 1}
                                                    {/* Thêm một dấu chấm nhỏ màu vàng góc trên nếu câu này có bookmark */}
                                                    {/* {markedQuestions[index] && (
                                                        <span style={{
                                                            position: 'absolute',
                                                            top: '2px',
                                                            right: '4px',
                                                            color: '#ffc107',
                                                            fontSize: '12px'
                                                        }}>★</span>
                                                    )} */}
                                                </Button>
                                            );
                                        })}
                                    </Card.Body>
                                    <Button variant="danger" size="lg" className="w-100 fw-bold py-2 shadow-sm" onClick={handlePreSubmitCheck}>
                                        📤 NỘP BÀI THI
                                    </Button>
                                </Card>
                            </Col>
                        </Row>
                    </fieldset>

                    {/* Phần hiển thị kết quả (giữ nguyên logic của bạn) */}
                    <Row className="mt-5">
                        {isFinished && (<Col md={12}>
                            <h3 className="mb-4 text-center text-primary fw-bold">Kết quả: <span className="text-danger">{score}</span></h3>
                            <div className="text-end mb-2 opacity-80 p-2"><Button onClick={() => handleResetQuiz()}>Làm lại bài</Button></div>
                            {questions.map((q, index) => (
                                <Card key={index} className="shadow-sm border-2 p-4 mb-4">
                                    <Card.Title className="fw-bold">
                                        Câu {index + 1}: <span className="fw-semibold">{q.text}</span>
                                    </Card.Title>
                                    <Card.Body className="px-0">
                                        <div className="d-flex flex-column gap-2">
                                            {['A', 'B', 'C', 'D'].map((letter, idx) => {
                                                const optionText = q.options?.[idx];
                                                const isSelected = selectedAnswers[index] === optionText;
                                                const isActualCorrect = q.correctAnswer === optionText;
                                                let alertClass = "bg-white border text-dark";

                                                if (isActualCorrect) {
                                                    alertClass = "bg-success bg-opacity-25 border-success text-success fw-bold";
                                                } else if (isSelected) {
                                                    alertClass = "bg-danger bg-opacity-25 border-danger text-danger fw-bold";
                                                }

                                                return (
                                                    <div key={letter} className={`p-3 rounded-3 border ${alertClass}`}>
                                                        {letter}. {optionText}
                                                        {isSelected && <span className="ms-2">{isActualCorrect ? "(Đúng)" : "(Bạn chọn)"}</span>}
                                                        {!isSelected && isActualCorrect && <span className="ms-2">(Đáp án đúng)</span>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </Card.Body>
                                </Card>
                            ))}
                        </Col>)}
                    </Row>
                </Container>
            </div>
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold text-secondary">🔔 Xác nhận nộp bài</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="fs-5 mb-0">Bạn có chắc chắn muốn nộp bài thi này không? Hệ thống sẽ ghi nhận kết quả ngay sau khi xác nhận.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Hủy bỏ</Button>
                    <Button variant="danger" className="fw-bold" onClick={handleExecuteSubmit}>Xác nhận nộp bài</Button>
                </Modal.Footer>
            </Modal>
            <Footer />
        </>
    );
}

export default Quiz;