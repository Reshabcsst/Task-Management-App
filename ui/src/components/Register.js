import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Host from '../Utils/Utils';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password || !confirmPassword) {
      setError('Please fill all the fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post(`${Host}/api/register`, { username, password });

      if (data && data.message === 'User registered successfully') {
        setError('');
        setSuccessMessage('Registration successful! Redirecting to login...');

        setTimeout(() => {
          setSuccessMessage('');
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.error('Registration error:', error);

      if (error.response) {
        setError(error.response.data.message || 'An error occurred. Please try again.');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='into'>
      <div className="register-form">
        <form onSubmit={handleSubmit}>
          <h2>Register</h2>
          {error && <div className="error-popup">{error}</div>}
          {successMessage && <div className="success-popup">{successMessage}</div>}

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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
          <p>Already have an account?<span onClick={() => navigate('/')}> Sign In</span></p>
          <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
