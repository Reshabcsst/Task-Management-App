import React, { useState, useContext } from 'react';
import AuthContext from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError('Please enter both username and password.');
            return;
        }

        try {
            await login({ username, password });
            setError('');
        } catch (error) {
            console.error('Login error:', error);
            setError('Invalid username or password');
        }
    };

    return (
        <div className="login-form">
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                {error && <div className="error-popup">{error}</div>} {/* Error popup */}

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <p>Don't have account?<span onClick={() => { navigate('/register') }}> Sign Up</span></p>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
