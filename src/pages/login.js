import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import '../styles/custom.css'
import Header from "../components/header";
import Footer from "../components/footer,";

function Login() {
    const [dataUsers, setDataUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const response = await axios.get('http://localhost:9999/users');
                setDataUsers(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách users: ", error);
            }
        };
        fetchAllUsers();
    }, [])

    const handleLogin = (e) => {
        e.preventDefault();
        const current = JSON.parse(localStorage.getItem('currentUser'));
        if (current) {
            if (current.role === 'user') navigate('/quiz')
            else navigate('/questions')
        } else {
            const userExist = dataUsers.find(user => user.username === username && user.password === password);
            if (userExist) {
                localStorage.setItem('currentUser', JSON.stringify(userExist));
                if (userExist.role === 'admin') {
                    navigate('/questions');
                } else {
                    navigate('/quiz');
                }
            } else {
                alert("Tài khoản hoặc mật khẩu không chính xác!")
            }
        }
    }

    return (
        <>
            <Header />
            <div className="bgImg d-flex align-items-center">
                <Container>
                    <Row className="align-items-center">
                        <Col md={7}>
                            <Card>
                                <Card.Img src="https://media.quizizz.com/_mdserver/main/media/resource/gs/quizizz-media/quizzes/14cb612b-7108-4c45-99ef-f38662a83224-v2" />
                                {/* <Card.Title className="text-center mt-3" style={{ color: '#e66465', fontWeight: 'bold', fontSize: '48px' }}>
                            </Card.Title> */}
                            </Card>
                        </Col>
                        <Col md={5}>
                            <Card className="formLogin">
                                <Card.Body>
                                    <h3 className="text-center mb-4" style={{ color: '#e66465' }}>Đăng Nhập</h3>
                                    <Form className="formLogin" onSubmit={(e) => handleLogin(e)}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Tài khoản</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Nhập tài khoản của bạn"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                required
                                                autoComplete="off"
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Mật Khẩu</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Nhập mật khẩu của bạn"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                autoComplete="off"
                                            />
                                        </Form.Group>
                                        <div className="text-center">
                                            <Button type="submit">Đăng Nhập</Button>
                                        </div>
                                    </Form>
                                    <div className="mt-3 text-center" style={{ borderTop: '1px solid #ccc' }}>
                                        <p className="mt-3">
                                            Chưa có tài khoản? Đăng kí <Link to={'/register'} style={{ textDecoration: 'none' }}>tại đây</Link>
                                        </p>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Footer />
        </>

    );
}

export default Login;