import React, { useState, useEffect } from 'react';
import { Table, Container } from 'react-bootstrap';
import * as axios from 'axios';
import Header from '../../components/header';
import '../../styles/custom.css'
import Footer from '../../components/footer,';

function ManagerUsers() {
    const [users, setUsers] = useState([]);
    const [sort, setSort] = useState('des');

    const handleSort = () => {
        setSort(pre => pre === 'asc' ? 'des' : 'asc');
    }

    const getSortedUsers = () => {
        const usersCoppy = [...users];
        if (sort === 'asc') {
            return usersCoppy.sort((a, b) => a.submitCount - b.submitCount);
        } else {
            return usersCoppy.sort((a, b) => b.submitCount - a.submitCount);
        }
    }

    const sortedUser = getSortedUsers();
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const [resUsers, resHistory] = await Promise.all([
                    axios.get('http://localhost:9999/users'),
                    axios.get('http://localhost:9999/history')
                ]);

                const allUsers = resUsers.data;
                const allHistory = resHistory.data;

                const filteredUsers = allUsers.filter(user => user.role === 'user');

                const finalUsers = filteredUsers.map(user => {
                    const submitCount = allHistory.filter(his => his.username === user.username);
                    return {
                        ...user,
                        submitCount: submitCount.length
                    }
                })
                setUsers(finalUsers);
            } catch (error) {
                console.log("Error: ", error);

            }
        }
        fetchUserData();
    }, []);

    return (
        <>
            <Header />
            <div className='bgImg p-5'>
                <Container className='mt-5 p-5'>
                    <h3 className="text-center mb-4 text-secondary">Danh Sách Người Dùng</h3>
                    <Table bordered hover responsive className="shadow-sm text-center align-middle mt-4 custom-table">
                        <thead>
                            <tr className='heading'>
                                <th>No.</th>
                                <th>Họ tên</th>
                                <th>Tài khoản</th>
                                <th onClick={() => handleSort()} style={{ cursor: 'pointer', userSelect: 'none' }}>Số lần nộp bài</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedUser.map((user, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{user.fullname}</td>
                                    <td>{user.username}</td>
                                    <td>{user.submitCount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Container>
            </div>
            <Footer />
        </>
    );
}

export default ManagerUsers;