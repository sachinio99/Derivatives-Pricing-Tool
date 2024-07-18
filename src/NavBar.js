import React, { useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const NavBar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  console.log('NavBar - isAuthenticated:', isAuthenticated);

  return (
    <nav style={styles.nav}>
      <ul style={styles.navList}>
        <li style={styles.navItem}><Link to="/" style={styles.navLink}>Home</Link></li>
        {isAuthenticated ? (
          <>
            <li style={styles.navItem}><Link to="/pricing" style={styles.navLink}>Pricing</Link></li>
            <li style={styles.navItem}><button onClick={logout} style={styles.navLinkButton}>Sign Out</button></li>
          </>
        ) : (
          <>
            <li style={styles.navItem}><Link to="/signup" style={styles.navLink}>Sign Up</Link></li>
            <li style={styles.navItem}><Link to="/login" style={styles.navLink}>Login</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

const styles = {
  nav: {
    width: '100%',
    padding: '10px 20px',
    backgroundColor: '#333',
    color: '#fff',
  },
  navList: {
    display: 'flex',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  navItem: {
    marginRight: '20px',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
  },
  navLinkButton: {
    color: '#fff',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
};

export default NavBar;
