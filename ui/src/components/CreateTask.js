import React, { useState } from 'react';
import axios from 'axios';
import Host from '../Utils/Utils';

const CreateTask = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Pending');
    const [dueDate, setDueDate] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !description || !dueDate) {
            setError('All fields are required!');
            return;
        }

        setError('');

        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found, please log in');
            return;
        }

        try {
            await axios.post(
                `${Host}/api/tasks`,
                { title, description, status, dueDate },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccess('Task created successfully!');
            setTimeout(() => {
                window.location = '/';
            }, 2000);

        } catch (error) {
            setError('Error creating task, please try again!');
            console.error('Error creating task:', error);
        }
    };

    return (
        <div className="create-task-container">
            <form onSubmit={handleSubmit} className="create-task-form">
                <h2>Create Task</h2>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
                <button type="submit">Create</button>
            </form>
        </div>
    );
};

export default CreateTask;
