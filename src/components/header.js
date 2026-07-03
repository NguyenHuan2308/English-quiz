import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/');
    }

    return (
        <Navbar className="bg-light" expand="md">
            <Container>
                <Navbar.Brand as={Link} to="/" style={{ fontSize: '35px', color: '#e66465' }}> <i class="fa-brands fa-quinscape" style={{ fontSize: '45px' }}></i>English Quiz</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto">
                        {currentUser && currentUser.role === 'admin' && (<span className="d-flex" style={{gap:'30px'}}>
                            <Nav.Link as={Link} to="/admin/users"> Quản lý User</Nav.Link>
                            <Nav.Link as={Link} to="/admin/questions"> Quản lý Câu hỏi</Nav.Link>
                            <Nav.Link as={Link} to="/admin/history">Lịch sử nộp bài</Nav.Link>
                        </span>)}

                        {currentUser && currentUser.role === 'user' && (
                            <span className="d-flex" style={{gap:'30px'}}>
                                <Nav.Link as={Link} to="/quiz"> Làm bài thi</Nav.Link>
                                <Nav.Link as={Link} to="/history"> Lịch sử làm bài</Nav.Link>
                            </span>
                        )}
                    </Nav>
                    <Nav>
                        {currentUser && (
                            <NavDropdown title={`Xin chào, ${currentUser.fullname}`} id="user-dropdown" align="end">
                                <NavDropdown.Item onClick={handleLogout} className="fw-bold">
                                 Đăng xuất
                                </NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;