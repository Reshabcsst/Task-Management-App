import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Host from '../Utils/Utils';

const EditTask = () => {
    const { id } = useParams();
    const [task, setTask] = useState({ title: '', description: '', status: 'Pending', dueDate: '' });
    const [status, setStatus] = useState('Pending');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTask = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const { data } = await axios.get(`${Host}/api/tasks/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTask(data);
                setStatus(data.status);
            } catch (error) {
                console.error('Error fetching task:', error);
            }
        };

        fetchTask();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask((prevTask) => ({
            ...prevTask,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!task.title || !task.description || !task.dueDate) {
            setError('All fields are required!');
            return;
        }
        setError('');

        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const updatedTask = {
                title: task.title,
                description: task.description,
                status,
                dueDate: task.dueDate,
            };

            const response = await axios.put(
                `${Host}/api/tasks/${id}`,
                updatedTask,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccess('Task updated successfully!');
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error) {
            console.error('Error updating task:', error);
            setError('Error updating task, please try again!');
        }
    };

    return (
        <div className="edit-task-container">
            <form onSubmit={handleSubmit} className="edit-task-form">
                <h2>Edit Task</h2>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <input
                    type="text"
                    name="title"
                    value={task.title}
                    onChange={handleChange}
                    placeholder="Task Title"
                />
                <textarea
                    name="description"
                    value={task.description}
                    onChange={handleChange}
                    placeholder="Task Description"
                />
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
                <input
                    type="date"
                    name="dueDate"
                    value={task.dueDate}
                    onChange={handleChange}
                />
                <button type="submit">Update</button>
            </form>
        </div>
    );
};

export default EditTask;
