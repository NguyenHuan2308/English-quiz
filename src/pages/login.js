import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from 'react-router-dom';
import '../styles/custom.css'

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="bgLogin d-flex align-items-center">
            <Container>
                <Row className="align-items-center">
                    <Col md={7}>
                        <Card>
                            <Card.Img src="https://media.quizizz.com/_mdserver/main/media/resource/gs/quizizz-media/quizzes/14cb612b-7108-4c45-99ef-f38662a83224-v2" />
                            <Card.Title className="text-center mt-3" style={{ color: '#e66465', fontWeight: 'bold', fontSize: '48px' }}>
                                Website luyện tập Tiếng Anh hàng đâu Việt Nam
                            </Card.Title>
                        </Card>
                    </Col>
                    <Col md={5}>
                        <Card className="formLogin">
                            <Card.Body>
                                <h3 className="text-center mb-4" style={{ color: '#e66465' }}>Đăng Nhập</h3>
                                <Form className="formLogin">
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Tài khoản</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập tài khoản của bạn"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
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
                                        />
                                    </Form.Group>
                                    <div className="text-center">
                                        <Button>Đăng Nhập</Button>
                                    </div>
                                </Form>
                                <div className="mt-3 text-center" style={{ borderTop: '1px solid #ccc' }}>
                                    <p className="mt-3" style={{textDecoration:'none'}}>
                                        Chưa có tài khoản? Đăng kí <Link to={'/register'} style={{textDecoration:'none'}}>tại đây</Link>
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>

    );
}

export default Login;