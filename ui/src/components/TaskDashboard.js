import React, { useState, useEffect, useContext } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Host from '../Utils/Utils';
import AuthContext from '../Context/AuthContext';

const TaskDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState('');
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await axios.get(`${Host}/api/tasks`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTasks(response.data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchTasks();
    }, []);

    const handleDelete = async (taskId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found, please log in');
            return;
        }

        try {
            await axios.delete(`${Host}/api/tasks/${taskId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTasks(tasks.filter((task) => task._id !== taskId));
        } catch (error) {
            console.error('Delete request failed:', error);
        }
    };

    return (
        <div className="task-dashboard">
            <h2 className="h">Tasks</h2>
            <button className="tb" onClick={() => { navigate('/create-task') }}>Create Task</button>
            <button className="td" onClick={() => { logout(); }}>Logout</button>
            <div className="tabs">
                <Link onClick={() => { setFilter('') }} className="tab">All Tasks</Link>
                <Link onClick={() => { setFilter('Pending') }} className="tab">Pending</Link>
                <Link onClick={() => { setFilter('In Progress') }} className="tab">In Progress</Link>
                <Link onClick={() => { setFilter('Completed') }} className="tab">Completed</Link>
            </div>

            <Routes>
                <Route path="/" element={<TaskList tasks={tasks} filter={filter} handleDelete={handleDelete} />} />
                <Route path="/tasks/pending" element={<TaskList tasks={tasks} filter={filter || "Pending"} handleDelete={handleDelete} />} />
                <Route path="/tasks/completed" element={<TaskList tasks={tasks} filter={filter || "Completed"} handleDelete={handleDelete} />} />
            </Routes>
        </div>
    );
};

const TaskList = ({ tasks, filter, handleDelete }) => {
    const calculateTimeLeft = (dueDate) => {
        const currentDate = new Date();
        const dueDateObj = new Date(dueDate);
        const timeDifference = dueDateObj - currentDate;

        if (timeDifference <= 0) {
            return 'You are late';
        } else {
            const daysLeft = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            const hoursLeft = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutesLeft = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            const secondsLeft = Math.floor((timeDifference % (1000 * 60)) / 1000);
            return `${daysLeft}d ${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`;
        }
    };

    const formatDueDate = (dueDate) => {
        const dateObj = new Date(dueDate);
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        };
        return dateObj.toLocaleString('en-US', options).replace(',', '');
    };

    const [timeLefts, setTimeLefts] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLefts((prevTimeLefts) => {
                return tasks.map(task => {
                    const timeLeft = calculateTimeLeft(task.dueDate);
                    return { ...task, timeLeft };
                });
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [tasks]);

    const filteredTasks = tasks.filter(task => !filter || task.status === filter);
    return (
        <ul className="task-list">
            {filteredTasks.length === 0 ? (
                <p className='no'>No task available</p>
            ) : (
                filteredTasks.map(task => {
                    const timeLeft = timeLefts.find(t => t._id === task._id)?.timeLeft || calculateTimeLeft(task.dueDate);
                    const dueDateFormatted = formatDueDate(task.dueDate);
                    const showTimeRemaining = task.status !== 'Completed' && timeLeft !== 'You are late';

                    return (
                        <li key={task._id} className="task-item">
                            <h3>{task.title}</h3>
                            <p>{task.description}</p>
                            <p>Status: {task.status}</p>
                            <p>Due Date: {dueDateFormatted}</p>
                            {showTimeRemaining && <p>Time Remaining: {timeLeft}</p>}
                            <div className="in">
                                <button onClick={() => window.location = `/edit-task/${task._id}`} className="btn">Edit</button>
                                <button onClick={() => handleDelete(task._id)} className="btn btn-delete">Delete</button>
                            </div>
                        </li>
                    );
                })
            )}
        </ul>
    );
};


export default TaskDashboard;
