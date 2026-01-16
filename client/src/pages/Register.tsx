import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerStyles } from '../styles/Register.styles';
import { validatePasswordMatch } from '../utils/validation';
import { toast } from 'react-toastify';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordMatch(password, confirmPassword)) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register(username, email, password);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={registerStyles.container}>
      <div className={registerStyles.card}>
        <h2 className={registerStyles.title}>Sign Up</h2>
        <form onSubmit={handleSubmit} className={registerStyles.form}>
          <div>
            <label className={registerStyles.formField}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={registerStyles.input}
              required
            />
          </div>
          <div>
            <label className={registerStyles.formField}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={registerStyles.input}
              required
            />
          </div>
          <div>
            <label className={registerStyles.formField}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={registerStyles.input}
              required
            />
          </div>
          <div>
            <label className={registerStyles.formField}>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={registerStyles.input}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={registerStyles.submitButton}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <p className={registerStyles.footer}>
          Already have an account?{' '}
          <Link to="/login" className={registerStyles.link}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

