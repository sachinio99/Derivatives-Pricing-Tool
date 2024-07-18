import React, { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Chart from 'chart.js/auto';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PricingForm = () => {
  const [formData, setFormData] = useState({
    notional: '',
    originationDate: '',
    term: '',
    strike: '',
    seaLevelRiseScenario: ''
  });

  const [errors, setErrors] = useState({});
  const [premium, setPremium] = useState(null);
  const [totalPayout, setTotalPayout] = useState(null);
  const [scenarioData, setScenarioData] = useState(null);
  const [strikeData, setStrikeData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [seaLevelData, setSeaLevelData] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    const errors = {};
    if (!formData.notional) {
      errors.notional = 'Notional is required';
    } else if (formData.notional < 1000000 || formData.notional > 500000000) {
      errors.notional = 'Notional must be between $1.0mm and $500.0mm';
    }

    const originationDate = new Date(formData.originationDate);
    const minDate = new Date('2024-08-01');
    const maxDate = new Date('2024-12-31');
    if (!formData.originationDate) {
      errors.originationDate = 'Origination Date is required';
    } else if (originationDate < minDate || originationDate > maxDate) {
      errors.originationDate = 'Origination Date must be between August 2024 and December 2024';
    }

    if (!formData.term) {
      errors.term = 'Term is required';
    } else if (formData.term < 5 || formData.term > 15) {
      errors.term = 'Term must be between 5 and 15 years';
    }

    if (!formData.strike) {
      errors.strike = 'Strike is required';
    } else if (formData.strike < 0 || formData.strike > 100) {
      errors.strike = 'Strike must be between 0% and 100%';
    }

    if (!formData.seaLevelRiseScenario) {
      errors.seaLevelRiseScenario = 'Sea Level Rise Scenario is required';
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      let originationDate = new Date(formData.originationDate);
      let formattedDate = originationDate.toLocaleDateString('en-US', { year: '2-digit', month: 'numeric', day: 'numeric' });
      axios.get('http://localhost:4000/calculateExpectedTotalPayout', {
        params: {
          notional: formData.notional,
          originDate: formattedDate,
          termLength: formData.term,
          strikePercentage: formData.strike,
          scenarioName: formData.seaLevelRiseScenario
        }
      })
      .then(response => {
        setPremium(response.data.annualPremium);
        setScenarioData(response.data.scenarioData);
        setTotalPayout(response.data.totalPayout);
        setSeaLevelData(response.data.scenarioData.map(item => parseFloat(item['2060 rf Index (in)'])));
        setLabels(response.data.scenarioData.map(item => item.Date));
        console.log(seaLevelData);
        console.log(labels);
        const strikeData = new Array(scenarioData.length).fill(formData.strike);
        setStrikeData(strikeData);
        setErrors({});
      })
      .catch(error => {
        setErrors({ server: error.response?.data?.error || 'Server error' });
      });
    } else {
      setErrors(validationErrors);
    }
  };

  
  const data = {
    labels: labels, // Example labels array
    datasets: [
      {
        label: 'Sea Level Rise',
        data: seaLevelData, // Example data array
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time Period'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Inches of Rain'
        }
      }
    }
  };



  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Calculate Your Premium and Payout</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label>Notional (in dollars)</label>
          <input
            type="number"
            name="notional"
            value={formData.notional}
            onChange={handleChange}
            style={styles.input}
          />
          {errors.notional && <p style={styles.error}>{errors.notional}</p>}
        </div>
        <div style={styles.formGroup}>
          <label>Origination Date</label>
          <input
            type="date"
            name="originationDate"
            value={formData.originationDate}
            onChange={handleChange}
            style={styles.input}
          />
          {errors.originationDate && <p style={styles.error}>{errors.originationDate}</p>}
        </div>
        <div style={styles.formGroup}>
          <label>Term (in years)</label>
          <input
            type="number"
            name="term"
            value={formData.term}
            onChange={handleChange}
            style={styles.input}
          />
          {errors.term && <p style={styles.error}>{errors.term}</p>}
        </div>
        <div style={styles.formGroup}>
          <label>Strike (%)</label>
          <input
            type="number"
            name="strike"
            value={formData.strike}
            onChange={handleChange}
            style={styles.input}
          />
          {errors.strike && <p style={styles.error}>{errors.strike}</p>}
        </div>
        <div style={styles.formGroup}>
          <label>Sea Level Rise Scenario</label>
          <select
            name="seaLevelRiseScenario"
            value={formData.seaLevelRiseScenario}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select a scenario</option>
            <option value="Extreme High">Extreme High</option>
            <option value="High">High</option>
            <option value="Moderate">Moderate</option>
            <option value="Low">Low</option>
            <option value="Extreme Low">Extreme Low</option>
          </select>
          {errors.seaLevelRiseScenario && <p style={styles.error}>{errors.seaLevelRiseScenario}</p>}
        </div>
        <button type="submit" style={styles.button}>Submit</button>
        {errors.server && <p style={styles.error}>{errors.server}</p>}
      </form>
      {premium !== null && totalPayout !== null && (
        <div style={styles.resultsContainer}>
          <div style={styles.results}>
            <h2>Calculated Premium</h2>
            <p>${premium}</p>
          </div>
            <div style={styles.results}>
            <h2>Total Payout</h2>
            <p>${totalPayout}</p>
            </div>
        </div>
      )}
        {scenarioData && (
            <div style={styles.chartContainer}>
            <Line data={data}/>
            </div>
        )}

    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
    textAlign: 'center',
    padding: '40px',
    boxSizing: 'border-box',
  },
  heading: {
    fontSize: '2.5rem',
    color: '#333',
    margin: '0 0 20px',
    alignItems: 'left'
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
  results: {
    marginTop: '20px',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  success: {
    color: 'green',
    fontSize: '0.875rem',
  },
};

export default PricingForm;
