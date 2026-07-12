import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from 'react-router-dom';
import * as axios from 'axios';
import Footer from "../components/footer,";
import Header from "../components/header";



function Register() {
    const [dataUsers, setDataUsers] = useState([]);

    const [fullName, setFullName] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [alertInfo, setAlertInfo] = useState({ show: false, message: '', variant: '' });

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

    const createUser = async (e) => {

        e.preventDefault();

        const exist = dataUsers.find(user => user.username === userName);
        if (exist) {
            setAlertInfo({
                show: true,
                message: "Tài khoản đã tồn tại!",
                variant: "danger"
            })
            return;
        }

        if (password !== password2) {
            setAlertInfo({
                show: true,
                message: "Mật khẩu nhập lại không khớp",
                variant: "warning"
            })
            return;
        }

        const nextId = dataUsers.length > 0 ? Number(dataUsers[dataUsers.length - 1].id) + 1 : 1;

        const data = {
            id: String(nextId),
            fullname: fullName,
            username: userName,
            password: password,
            role: "user"
        }

        try {
            // Gửi dữ liệu lên json-server
            const response = await axios.post('http://localhost:9999/users', data);
            setDataUsers([...dataUsers, response.data]);
            setFullName("");
            setUserName('');
            setPassword('');
            setPassword2('');

            setAlertInfo({
                show: true,
                message: "Đăng kí tài khoản thành công!",
                variant: "success"
            })
        } catch (error) {
            console.error("Error: ", error);
        }
    }

    useEffect(() => {
        if (alertInfo.show) {
            const timer = setTimeout(() => {
                setAlertInfo(prev => ({ ...prev, show: false }));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [alertInfo.show]);

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
                                Website luyện tập Tiếng Anh hàng đâu Việt Nam
                            </Card.Title> */}
                            </Card>
                        </Col>
                        <Col md={5}>
                            <Card className="formLogin" >
                                <Card.Body>
                                    {alertInfo.show && (
                                        <Alert variant={alertInfo.variant} dismissible onClose={() => setAlertInfo({ ...alertInfo, show: false })}>
                                            {alertInfo.message}
                                        </Alert>
                                    )}
                                    <h3 className="text-center mb-4" style={{ color: '#e66465' }}>Đăng kí tài khoản</h3>
                                    <Form className="formLogin" onSubmit={(e) => createUser(e)}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Họ tên</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Nhập họ tên của bạn"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                required
                                                autoComplete="off"
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Tài khoản</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Nhập tài khoản của bạn"
                                                value={userName}
                                                onChange={(e) => setUserName(e.target.value)}
                                                required
                                                autoComplete="off"
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Mật khẩu</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Nhập mật khẩu của bạn"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                autoComplete="off"
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Xác nhận mật khẩu</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Xác nhận mật khẩu của bạn"
                                                value={password2}
                                                onChange={(e) => setPassword2(e.target.value)}
                                                required
                                                autoComplete="off"
                                            />
                                        </Form.Group>
                                        <div className="text-center">
                                            <Button type="submit">Đăng kí</Button>
                                        </div>
                                    </Form>
                                    <div className="mt-3 text-center" style={{ borderTop: '1px solid #ccc' }}>
                                        <p className="mt-3">
                                            Đã có tài khoản? Đăng nhập <Link to={'/'} style={{ textDecoration: 'none' }}>tại đây</Link>
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

export default Register;