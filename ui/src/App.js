import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import TaskDashboard from './components/TaskDashboard';
import CreateTask from './components/CreateTask';
import EditTask from './components/EditTask';
import Register from './components/Register';
import ServerStatus from './ServerStatus';

function App() {
  const isLogin = JSON.parse(localStorage.getItem('isToken'));
  return (
    <ServerStatus>
      <Routes>
        <Route path="/" element={isLogin ? <TaskDashboard /> : <Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-task" element={isLogin ? <CreateTask /> : <Navigate to='/' />} />
        <Route path="/edit-task/:id" element={isLogin ? <EditTask /> : <Navigate to='/' />} />
      </Routes>
    </ServerStatus>
  );
}

export default App;
