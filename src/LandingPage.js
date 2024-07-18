import React from 'react';


const LandingPage = () => {
    return (
      <div style = {styles.container}>
        <h1 style={styles.heading}>Welcome to Eventual!</h1>
        <p style={styles.paragraph}>At Eventual, we make markets enabling investors of the built world to hedge new climate risks</p>
        <p style={styles.paragraph}>Welcome to Eventual's illustrative derivative pricing tool, see what your annual premiums could be!</p>
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
  paragraph: {
    fontSize: '1.25rem',
    color: '#555',
    margin: '0',
  },
};

export default LandingPage;
