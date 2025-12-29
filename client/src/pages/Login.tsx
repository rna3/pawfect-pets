import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginStyles } from '../styles/Login.styles';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={loginStyles.container}>
      <div className={loginStyles.card}>
        <h2 className={loginStyles.title}>Login</h2>
        <form onSubmit={handleSubmit} className={loginStyles.form}>
          <div>
            <label className={loginStyles.formField}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={loginStyles.input}
              required
            />
          </div>
          <div>
            <label className={loginStyles.formField}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={loginStyles.input}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={loginStyles.submitButton}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className={loginStyles.footer}>
          Don't have an account?{' '}
          <Link to="/register" className={loginStyles.link}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

