import React, { useEffect, useState } from 'react';
import { getUsers, toggleAdmin  } from '../api/userApi';
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,Button  } from '@mui/material';

const AdminPrivileges = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            const fetchedUsers = await getUsers();
            setUsers(fetchedUsers);
            setLoading(false);
        };

        fetchUsers();
    }, []);

    const handleToggleAdmin = async (id, currentType) => {
        const newType = currentType === 1 ? 2 : 1; 
        const response = await toggleAdmin(id);
        if (response) {
            setUsers((prevUsers) => 
                prevUsers.map(user => 
                    user.id === id ? { ...user, tip_uporabnika_id: newType } : user
                )
            );
        } else {
            console.error("Error toggling user type");
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <TableContainer component={Paper}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>First Name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>User Type</TableCell>
                    <TableCell>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.ime}</TableCell>
                        <TableCell>{user.priimek}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.tip_uporabnika_id === 1 ? 'Regular User' : 'Admin'}</TableCell>
                        <TableCell>
                            <Button
                                variant="contained"
                                color={user.tip_uporabnika_id === 1 ? 'primary' : 'secondary'}
                                onClick={() => handleToggleAdmin(user.id, user.tip_uporabnika_id)}
                            >
                                {user.tip_uporabnika_id === 1 ? 'Make Admin' : 'Remove Admin'}
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
    );
};

export default AdminPrivileges;