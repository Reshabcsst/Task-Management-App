import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import TaskDashboard from './components/TaskDashboard';
import CreateTask from './components/CreateTask';
import EditTask from './components/EditTask';
import AuthContext from './Context/AuthContext';
import { useContext } from 'react';
import Register from './components/Register';

function App() {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <TaskDashboard /> : <Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/create-task" element={isAuthenticated ? <CreateTask /> : <Navigate to='/' />} />
      <Route path="/edit-task/:id" element={isAuthenticated ? <EditTask /> : <Navigate to='/' />} />
    </Routes>
  );
}

export default App;
