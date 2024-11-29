import React, { useState, useContext } from 'react';
import AuthContext from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError('Please enter both username and password.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await login({ username, password });
            setLoading(false);
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
            setError('Invalid username or password');
            setLoading(false);
        }
    };

    return (
        <div className='into'>
            <div className="login-form">
                <form onSubmit={handleSubmit}>
                    <h2>Login</h2>
                    {error && <div className="error-popup">{error}</div>}

                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={loading}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />
                    <p>Don't have an account?<span onClick={() => navigate('/register')}> Sign Up</span></p>
                    <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
