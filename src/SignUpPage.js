import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { useHistory } from 'react-router-dom';

const SignUpPage = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', organization: '' });
  const [errors, setErrors] = useState({});
  const { login } = useContext(AuthContext);
  const history = useHistory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:4000/register', formData)
      .then(response => {
        if (response.status === 201) {
          login();
          history.push('/pricing');
        }
      })
      .catch(error => {
        setErrors({ server: error.response?.data?.error || 'Server error' });
      });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Sign Up</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Organization</label>
          <input
            type="text"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>Sign Up</button>
        {errors.server && <p style={styles.error}>{errors.server}</p>}
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
    textAlign: 'center',
    padding: '20px',
    boxSizing: 'border-box',
  },
  heading: {
    fontSize: '2.5rem',
    color: '#333',
    margin: '0 0 20px',
  },
  form: {
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '15px',
    textAlign: 'left',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '5px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#333',
    color: '#fff',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    fontSize: '0.875rem',
  },
};

export default SignUpPage;
