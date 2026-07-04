import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import Footer from "../../components/footer,";
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

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const res = await axios.get('http://localhost:9999/questions');
                const his = await axios.get('http://localhost:9999/history');
                setHistory(his.data)
                const allQues = res.data;
                const ques5 = [...allQues].sort(() => 0.5 - Math.random());
                setQuestions(ques5.slice(0, 10));
            } catch (error) {
                console.log("Error: ", error);
            }

        }
        fetchQuestion();
    }, []);

    const handleSelectAnswer = (answer) => {
        if (isFinished) return;
        setSelectedAnswers({
            ...selectedAnswers,
            [currentIndex]: answer
        });
    }

    const handleQuizSubmit = async () => {
        const answeredCount = Object.values(selectedAnswers).length;
        if (answeredCount < questions.length) {
            alert(`⚠️ Bạn chưa hoàn thành bài thi! Bạn mới làm ${answeredCount}/${questions.length} câu. Vui lòng chọn đầy đủ đáp án trước khi nộp.`);
            return;
        }

        if (window.confirm("Bạn có chắc chắn muốn nộp bài thi này không?")) {
            let correctCount = 0;
            questions.forEach((q, index) => {
                if (selectedAnswers[index] === q.correctAnswer) {
                    correctCount++;
                }
            });

            setScore(`${correctCount}/${questions.length}`)
            const submissionTime = new Date().toLocaleString('vi-VN');

            const id = history.length > 0 ? Number(history[history.length - 1].id) + 1 : 1;

            const payload = {
                id: String(id),
                userId: JSON.parse(localStorage.getItem('currentUser')).id,
                score: `${correctCount}/${questions.length}`,
                time: submissionTime
            };

            try {
                const response = await axios.post('http://localhost:9999/history', payload);
                setHistory(prevHistory => [...prevHistory, response.data]);
                alert(`🎉 Nộp bài thành công!`);
                setIsFinished(true);
            } catch (error) {
                console.error("Lỗi khi lưu kết quả thi:", error);
                alert("❌ Nộp bài thất bại! Không thể kết nối hoặc lưu vào cơ sở dữ liệu.");
            }
        }
    }

    const handleResetQuiz = () => {
        setIsFinished(false);
        setSelectedAnswers({}); 
        setCurrentIndex(0);
        setScore("");
    };
    const currentQuestion = questions[currentIndex];

    if (!currentQuestion) {
        return <div className="text-center mt-5">Đang tải câu hỏi, vui lòng đợi...</div>;
    }

    return (
        <>
            <Header />
            <div className="bgImg">
                <Container >
                    <fieldset disabled={isFinished} style={{ opacity: isFinished ? 0.8 : 1 }}>
                        <Row className="mt-5" >
                            <Col md={8}>
                                <Card className="shadow-sm border-0 p-4 mb-3">
                                    <Card.Title className="text-secondary fw-bold">
                                        Câu hỏi: {currentIndex + 1} / {questions.length}
                                    </Card.Title>
                                    <Card.Body className="px-0" disabled={isFinished}>
                                        <h4 className="mb-4 fw-semibold">{currentQuestion.text}</h4>
                                        <Form className="mb-4">
                                            {['A', 'B', 'C', 'D'].map((letter, idx) => (
                                                <div
                                                    key={letter}
                                                    onClick={() => handleSelectAnswer(currentQuestion.options?.[idx])}
                                                    className={`p-3 mb-2 border rounded-3 d-flex align-items-center ${selectedAnswers[currentIndex] === currentQuestion.options?.[idx] ? 'bg-light border-primary' : ''
                                                        }`}
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
                                    <Card.Title className="fw-bold mb-3">Tiến độ làm bài</Card.Title>
                                    <Card.Body className="d-flex flex-wrap justify-content-start gap-3 mb-4">
                                        {questions.map((_, index) => (
                                            <Button
                                                key={index}
                                                variant={selectedAnswers[index] ? "success" : "outline-secondary"}
                                                style={{ width: '50px', height: '45px' }}
                                                className={`p-0 fw-bold ${currentIndex === index ? 'border-dark border-2 shadow-sm' : ''}`}
                                                onClick={() => setCurrentIndex(index)}
                                            >
                                                {index + 1}
                                            </Button>
                                        ))}
                                    </Card.Body>
                                    <Button variant="danger" size="lg" className="w-100 fw-bold py-2 shadow-sm" onClick={handleQuizSubmit}>
                                        📤 NỘP BÀI THI
                                    </Button>

                                </Card>
                            </Col>
                        </Row>
                    </fieldset>
                    <Row className="mt-5">
                        {isFinished && (<Col md={12}>
                            <h3 className="mb-4 text-center text-primary fw-bold">Kết quả: <span className="text-danger">{score}</span></h3>
                            <div className="text-end mb-2 opacity-80 p-2"><Button onClick={() => handleResetQuiz()}>Làm lại bài</Button></div>
                            {questions.map((q, index) => {
                                return (
                                    <>
                                        <Card
                                            key={index}
                                            className={`shadow-sm border-2 p-4 mb-4`}
                                        >
                                            <Card.Title className={`fw-bold `}>
                                                Câu {index + 1}: <span className="fw-semibold">{q.text}</span>
                                            </Card.Title>
                                            <Card.Body className="px-0">

                                                {/* Danh sách các option câu trả lời */}
                                                <div className="d-flex flex-column gap-2">
                                                    {['A', 'B', 'C', 'D'].map((letter, idx) => {
                                                        const optionText = q.options?.[idx];

                                                        // 1. Kiểm tra xem người dùng có chọn ô này không
                                                        const isSelected = selectedAnswers[index] === optionText;

                                                        // 2. Kiểm tra xem ô này có phải đáp án đúng của hệ thống không
                                                        const isActualCorrect = q.correctAnswer === optionText;

                                                        // Thiết lập class màu sắc mặc định (nền trắng viền xám)
                                                        let alertClass = "bg-white border text-dark";

                                                        if (isActualCorrect) {
                                                            // Nếu là đáp án đúng của hệ thống -> Bắt buộc hiện màu XANH
                                                            alertClass = "bg-success bg-opacity-25 border-success text-success fw-bold";
                                                        } else if (isSelected) {
                                                            // Nếu người dùng chọn ô này nhưng KHÔNG BẰNG đáp án đúng (tức là chọn sai) -> Hiện màu ĐỎ
                                                            alertClass = "bg-danger bg-opacity-25 border-danger text-danger fw-bold";
                                                        }

                                                        return (
                                                            <div key={letter} className={`p-3 rounded-3 border ${alertClass}`}>
                                                                {letter}. {optionText}

                                                                {/* Hiển thị văn bản chỉ dẫn bổ sung */}
                                                                {isSelected && (
                                                                    <span className="ms-2">
                                                                        {isActualCorrect ? "(Đúng)" : "(Bạn chọn)"}
                                                                    </span>
                                                                )}
                                                                {!isSelected && isActualCorrect && (
                                                                    <span className="ms-2">(Đáp án đúng)</span>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </>
                                );
                            })}
                        </Col>)}
                    </Row>
                </Container>
            </div>
            <Footer />
        </>
    );
}

export default Quiz;