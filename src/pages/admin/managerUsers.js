import React, { useState, useEffect } from 'react';
import { Table, Container } from 'react-bootstrap';
import * as axios from 'axios';
import Header from '../../components/header';
import '../../styles/custom.css'
import Footer from '../../components/footer,';

function ManagerUsers() {
    const [users, setUsers] = useState([]);
    const [sortField, setSortField] = useState('submitCount'); // Cột sắp xếp mặc định
    const [sortOrder, setSortOrder] = useState('des');

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(pre => pre === 'asc' ? 'des' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc'); // Sang cột mới thì luôn chạy tăng dần trước
        }
    };

    // Hàm thực hiện sắp xếp dữ liệu dựa trên field và order
    const getSortedUsers = () => {
        const usersCopy = [...users];
        return usersCopy.sort((a, b) => {
            let valueA = a[sortField];
            let valueB = b[sortField];

            if (sortOrder === 'asc') {
                return valueA - valueB;
            } else {
                return valueB - valueA;
            }
        });
    };

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
                    const userSubmissions = allHistory.filter(his => his.userId === user.id);
                    const submitCount = userSubmissions.length
                    let averageScore = 0;
                    if (submitCount > 0) {
                        const total = userSubmissions.reduce((sum, his) => {
                            const correct = Number(his.score.split('/')[0] || 0);
                            return sum += correct;
                        }, 0)
                        averageScore = total / submitCount;
                    }
                    return {
                        ...user,
                        submitCount: submitCount,
                        averageScore: averageScore.toFixed(2),
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
            <div className='bgImg p-md-5'>
                <Container className='mt-5 p-md-5'>
                    <h3 className="text-center mb-4 text-secondary">Danh Sách Người Dùng</h3>
                    <Table bordered hover responsive className="shadow-sm text-center align-middle mt-4 custom-table">
                        <thead>
                            <tr className='heading'>
                                <th style={{ width: '7%' }}>No.</th>
                                <th style={{ width: '30%' }}>Họ tên</th>
                                <th style={{ width: '30%' }}>Tài khoản</th>
                                <th onClick={() => handleSort('submitCount')} style={{ cursor: 'pointer', userSelect: 'none', width: '16.5%' }}>Số lần nộp bài</th>
                                <th onClick={() => handleSort('averageScore')} style={{ cursor: 'pointer', userSelect: 'none', width: '16.5%' }}>Điểm trung bình</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedUser.map((user, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{user.fullname}</td>
                                    <td>{user.username}</td>
                                    <td>{user.submitCount}</td>
                                    <td>{user.averageScore}</td>
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