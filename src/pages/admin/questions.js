import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import Header from "../../components/header";
import Footer from "../../components/footer,";

function ManagerQuestions() {
    const [questions, setQuestions] = useState([]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [addFormData, setAddFormData] = useState({});

    const [showEditModal, setShowEditModal] = useState(false);
    const [editFormData, setEditFormData] = useState({});

    const fetchQuestions = async () => {
        try {
            const res = await axios.get('http://localhost:9999/questions');
            setQuestions(res.data);
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    useEffect(() => {
        fetchQuestions();
    }, [])

    const handleOpenAdd = () => {
        setAddFormData({
            text: '',
            answerA: '',
            answerB: '',
            answerC: '',
            answerD: '',
            correctAnswer: ''
        });
        setShowAddModal(true);
    };

    const handleOpenEdit = (question) => {
        setEditFormData({
            id: question.id,
            text: question.text,
            answerA: question.options?.[0],
            answerB: question.options?.[1],
            answerC: question.options?.[2],
            answerD: question.options?.[3],
            correctAnswer: question.correctAnswer
        });
        setShowEditModal(true);
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        const id = questions.length > 0 ? Number(questions[questions.length - 1].id) + 1 : 1;

        const newQuestion = {
            id: String(id),
            text: addFormData.text,
            options: [addFormData.answerA, addFormData.answerB, addFormData.answerC, addFormData.answerD],
            correctAnswer: addFormData.correctAnswer
        }

        try {
            const res = await axios.post('http://localhost:9999/questions', newQuestion)
            if (res.status === 201) {
                setShowAddModal(false);
                fetchQuestions();
            }
        } catch (error) {
            console.log("Error: ", error);

        }
    };

    // Xử lý submit FORM CHỈNH SỬA (EDIT)
    const handleEditSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            text: editFormData.text,
            options: [editFormData.answerA, editFormData.answerB, editFormData.answerC, editFormData.answerD],
            correctAnswer: editFormData.correctAnswer
        }

        try {
            await axios.put(`http://localhost:9999/questions/${editFormData.id}`, payload);
            alert("Sửa thành công!");
            setShowEditModal(false);
            fetchQuestions();
        } catch (error) {
            console.log("Error: ", error);

        }

    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này không?")) {
            try {
                await axios.delete(`http://localhost:9999/questions/${id}`);
                alert("Xóa thành công!");
                fetchQuestions();
            } catch (err) {
                alert("Xóa thất bại!");
            }
        }
    };

    return (
        <>
            <Header />
            <div className="bgImg p-5">
                <Container className="mt-5 p-5">
                    <h3 className="text-center text-secondary fs-2">Danh sách câu hỏi</h3>
                    <div className="text-end px-4 mt-2"><Button variant="info" size="sm" className="fw-bold mt-3 text-light" onClick={() => handleOpenAdd()}>
                        Thêm câu hỏi mới
                    </Button></div>
                    <Table bordered hover responsive className="shadow-sm text-center align-middle mt-4 custom-table">
                        <thead>
                            <tr className='heading'>
                                <th style={{ width: '7%' }}>No.</th>
                                <th style={{ width: '35%' }}>Nội dung câu hỏi</th>
                                <th style={{ width: '30%' }}>Các đáp án tuyển chọn</th>
                                <th style={{ width: '13%' }}>Đáp án đúng</th>
                                <th style={{ width: '15%' }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map((ques, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{ques.text}</td>
                                    <td className="text-start px-3">
                                        <medium>
                                            <b>A:</b> {ques.options?.[0]} <br />
                                            <b>B:</b> {ques.options?.[1]} <br />
                                            <b>C:</b> {ques.options?.[2]} <br />
                                            <b>D:</b> {ques.options?.[3]}
                                        </medium>
                                    </td>
                                    <td>
                                        <span className="badge bg-success fs-6 px-3">{ques.correctAnswer}</span>
                                    </td>
                                    <td >
                                        <div className="d-flex flex-column align-items-center" style={{ gap: '10px' }}>
                                            <Button variant="warning" size="sm" className="fw-bold px-3" onClick={() => handleOpenEdit(ques)}>
                                                Sửa
                                            </Button>
                                            <Button variant="secondary" size="sm" className="fw-bold px-3" onClick={() => handleDelete(ques.id)}>
                                                Xóa
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {/*===================== Modal Add ==========================  */}
                    <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg" centered dialogClassName="custom-modal">
                        <Modal.Header closeButton>
                            <Modal.Title> <i class="fa-solid fa-square-plus"></i>Thêm câu hỏi</Modal.Title>
                        </Modal.Header>
                        <Form onSubmit={(e) => handleAddSubmit(e)}>
                            <Modal.Body>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold text-secondary">Nội dung câu hỏi</Form.Label>
                                    <Form.Control
                                        as="textarea" rows={2} required placeholder="Nhập câu hỏi ..."
                                        value={addFormData.text}
                                        onChange={(e) => setAddFormData({ ...addFormData, text: e.target.value })}
                                    />
                                </Form.Group>
                                <Row className="mb-3">
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold text-secondary">Đáp án A: </Form.Label>
                                            <Form.Control type="text" required placeholder="Nhập đáp án"
                                                value={addFormData.answerA}
                                                onChange={(e) => setAddFormData({ ...addFormData, answerA: e.target.value })}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold text-secondary">Đáp án B: </Form.Label>
                                            <Form.Control type="text" required placeholder="Nhập đáp án"
                                                value={addFormData.answerB}
                                                onChange={(e) => setAddFormData({ ...addFormData, answerB: e.target.value })}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold text-secondary">Đáp án C: </Form.Label>
                                            <Form.Control type="text" required placeholder="Nhập đáp án"
                                                value={addFormData.answerC}
                                                onChange={(e) => setAddFormData({ ...addFormData, answerC: e.target.value })}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold text-secondary">Đáp án D: </Form.Label>
                                            <Form.Control type="text" required placeholder="Nhập đáp án"
                                                value={addFormData.answerD}
                                                onChange={(e) => setAddFormData({ ...addFormData, answerD: e.target.value })}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    {/* <Form.Group>
                                        <Form.Label>Đáp án đúng</Form.Label>
                                        <Form.Control type="text" required placeholder="Nhập đáp án đúng"
                                            value={addFormData.correctAnswer}
                                            onChange={(e) => setAddFormData({ ...addFormData, correctAnswer: e.target.value })}
                                        />
                                    </Form.Group> */}
                                    <Form.Group className="mb-2">
                                        <Form.Label className="fw-bold text-success">Đáp án chính xác</Form.Label>
                                        <Form.Select
                                            required
                                            value={addFormData.correctAnswer}
                                            onChange={(e) => setAddFormData({ ...addFormData, correctAnswer: e.target.value })}
                                        >
                                            <option value="">-- Chọn đáp án đúng --</option>
                                            <option value={addFormData.answerA}>Đáp án A</option>
                                            <option value={addFormData.answerB}>Đáp án B</option>
                                            <option value={addFormData.answerC}>Đáp án C</option>
                                            <option value={addFormData.answerD}>Đáp án D</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                                    Hủy bỏ
                                </Button>
                                <Button type="submit">
                                    Thêm
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal>

                    {/* =========================Modal Edit ========================= */}
                    <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" centered dialogClassName="custom-modal">
                        <Modal.Header closeButton >
                            <Modal.Title> <i class="fa-solid fa-pen-to-square"></i>Sửa câu hỏi</Modal.Title>
                        </Modal.Header>
                        <Form onSubmit={(e) => handleEditSubmit(e)}>
                            <Modal.Body>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold text-secondary">Nội dung câu hỏi</Form.Label>
                                    <Form.Control
                                        as="textarea" rows={2} required placeholder="Nhập câu hỏi ..."
                                        value={editFormData.text}
                                        onChange={(e) => setEditFormData({ ...editFormData, text: e.target.value })}
                                    />
                                </Form.Group>
                                <Row className="mb-2">
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold text-secondary">Đáp án A: </Form.Label>
                                            <Form.Control type="text" required placeholder="Nhập đáp án"
                                                value={editFormData.answerA}
                                                onChange={(e) => setEditFormData({ ...editFormData, answerA: e.target.value })}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold text-secondary">Đáp án B: </Form.Label>
                                            <Form.Control type="text" required placeholder="Nhập đáp án"
                                                value={editFormData.answerB}
                                                onChange={(e) => setEditFormData({ ...editFormData, answerB: e.target.value })}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold text-secondary">Đáp án C: </Form.Label>
                                            <Form.Control type="text" required placeholder="Nhập đáp án"
                                                value={editFormData.answerC}
                                                onChange={(e) => setEditFormData({ ...editFormData, answerC: e.target.value })}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className="fw-bold text-secondary">Đáp án D: </Form.Label>
                                            <Form.Control type="text" required placeholder="Nhập đáp án"
                                                value={editFormData.answerD}
                                                onChange={(e) => setEditFormData({ ...editFormData, answerD: e.target.value })}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Form.Group className="mb-2">
                                        <Form.Label className="fw-bold text-success">Đáp án chính xác</Form.Label>
                                        <Form.Select
                                            required
                                            value={editFormData.correctAnswer}
                                            onChange={(e) => setEditFormData({ ...editFormData, correctAnswer: e.target.value })}
                                        >
                                            <option value="">-- Chọn đáp án đúng --</option>
                                            <option value={editFormData.answerA}>Đáp án A</option>
                                            <option value={editFormData.answerB}>Đáp án B</option>
                                            <option value={editFormData.answerC}>Đáp án C</option>
                                            <option value={editFormData.answerD}>Đáp án D</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                                    Hủy bỏ
                                </Button>
                                <Button type="submit">
                                    Cập nhật
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal>
                </Container>
            </div>
            <Footer />
        </>
    );
}

export default ManagerQuestions;