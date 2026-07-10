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
            navigate('/');
        } else if (currentUser.role === 'admin') {
            navigate('/questions');
        } else if (currentUser.role === 'user') {
            navigate('/quiz');
        } else {
            navigate('/');
        }
    }

    return (
        <Navbar className="bg-light" expand="md">
            <Container >
                <Navbar.Brand
                    onClick={handleBrandClick}
                    style={{ fontSize: '35px', color: '#e66465', cursor: 'pointer' }}
                >
                    <i className="fa-brands fa-quinscape" style={{ fontSize: '45px' }}></i>
                    English Quiz
                </Navbar.Brand>
                <Navbar.Collapse id="basic-navbar-nav" >
                    <Nav className="d-flex mx-auto px-5 justify-content-center align-items-center" style={{ gap: '30px' }}>
                        {currentUser && currentUser.role === 'admin' && (<>
                            <Nav.Link as={Link} to="/questions"> Quản lý Câu hỏi</Nav.Link>
                            <Nav.Link as={Link} to="/users"> Quản lý User</Nav.Link>
                            <Nav.Link as={Link} to="/historyAdmin">Lịch sử nộp bài</Nav.Link>
                        </>)}

                        {currentUser && currentUser.role === 'user' && (
                            <>
                                <Nav.Link as={Link} to="/quiz"> Làm bài thi</Nav.Link>
                                <Nav.Link as={Link} to="/history"> Lịch sử làm bài</Nav.Link>
                            </>
                        )}
                    </Nav>
                    <Nav className="me-auto">
                        {currentUser && (
                            <NavDropdown title={`Xin chào, ${currentUser.fullname}`} id="user-dropdown" align="end">
                                <NavDropdown.Item onClick={() => handleLogout()} className="fw-bold">
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