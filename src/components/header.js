import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/');
    }

    const handleBrandClick = (e) => {
        e.preventDefault();
        if (!currentUser) {
            navigate('/login');
        } else if (currentUser.role === 'admin') {
            navigate('/questions');
        } else if (currentUser.role === 'user') {
            navigate('/quiz');
        } else {
            navigate('/');
        }
    }

    return (
        // Thêm shadow-sm để đổ bóng nhẹ, cố định header nếu cần bằng sticky-top
        <Navbar className="bg-light shadow-sm" expand="md" fixed="top">
            <Container>
                <Navbar.Brand
                    onClick={handleBrandClick}
                    style={{ fontSize: '32px', color: '#e66465', cursor: 'pointer' }}
                    className="fw-bold"
                >
                    <i className="fa-brands fa-quinscape me-2" style={{ fontSize: '40px' }}></i>
                    English Quiz
                </Navbar.Brand>

                {/* Nút Hamburger menu trên mobile */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-md-center text-center">
                        {currentUser && currentUser.role === 'admin' && (
                            <>
                                <Nav.Link as={Link} to="/questions" className="mx-2">Quản lý Câu hỏi</Nav.Link>
                                <Nav.Link as={Link} to="/users" className="mx-2">Quản lý User</Nav.Link>
                                <Nav.Link as={Link} to="/historyAdmin" className="mx-2">Lịch sử nộp bài</Nav.Link>
                            </>
                        )}

                        {currentUser && currentUser.role === 'user' && (
                            <>
                                <Nav.Link as={Link} to="/quiz" className="mx-2">Làm bài thi</Nav.Link>
                                <Nav.Link as={Link} to="/history" className="mx-2">Lịch sử làm bài</Nav.Link>
                            </>
                        )}

                        {/* Gộp chung Dropdown tài khoản vào cùng 1 hàng Nav để quản lý Responsive tốt hơn */}
                        {currentUser && (
                            <NavDropdown
                                title={`Xin chào, ${currentUser.fullname}`}
                                id="user-dropdown"
                                align="end"
                                className="ms-md-3 mt-2 mt-md-0 fw-semibold text-primary"
                            >
                                <NavDropdown.Item onClick={handleLogout} className="text-danger fw-bold text-center">
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