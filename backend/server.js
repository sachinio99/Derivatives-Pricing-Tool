const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const csv = require('csv-parser');
const path = require('path');
const csvFilePath = '../public/csvs';
const fs = require('fs');
const axios = require('axios');
var cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

// Define User model
const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  organization: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

// Sync the model with the database
sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Error syncing database:', err));

// Registration endpoint
app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, organization } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      organization
    });

    res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // If passwords match, send success response
    res.status(200).json({ message: 'Login successful' });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/getSeaLevels/:scenarioName', (req, res) => {
    const scenarioName = req.params.scenarioName;
    //console.log(scenarioName);
    let results = [];

    fs.createReadStream(path.join(csvFilePath, `${scenarioName}.csv`))
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        res.json(results);
      
    })
    .on('error', (error) => {
      console.error('Error reading CSV:', error);
      res.status(500).json({ error: 'Error reading CSV file' });
    });

});

app.get('/calculateExpectedTotalPayout', (req, res) => {
    let scenarioName = req.query.scenarioName;
    let notional = req.query.notional;
    let originDate = req.query.originDate;
    let termLength = req.query.termLength;  
    let strikePercentage = req.query.strikePercentage;


    // Make a GET request to the /getSeaLevels/:scenarioName endpoint
    axios.get(`http://localhost:4000/getSeaLevels/${scenarioName}`)
        .then(response => {
            let sea_level_data = response.data;
            //console.log(sea_level_data);

            // Assuming calculatePremium can handle being called asynchronously. If not, you might need to adjust.
            const result = calculatePremium(sea_level_data, strikePercentage, notional, termLength, originDate);

            // Send the calculated premium as a response
            // If calculatePremium is asynchronous, you might need to handle it differently.
            res.json(result);
        })
        .catch(error => {
            console.error('Error calling /getSeaLevels/:scenarioName:', error);
            res.status(500).json({error: 'Error calculating expected total payout'});
        });
});



function calculatePremium(scenarioData, strikePercentage, notional, termYears, startDateString) {
    // Helper function to parse date strings
    let parseDate = (dateString) => {
      let [month, day, year] = dateString.split('/');
      return new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day));
    };
  
    // Parse the start date
    console.log(startDateString);
    let startDate = parseDate(startDateString);
    
    // Calculate the end date based on the start date and term length
    const endDate = new Date(startDate.getTime());
    endDate.setFullYear(endDate.getFullYear() + termYears);
  
    // Filter scenarioData to only include data within the specified term
    const relevantData = scenarioData.filter(row => {
      const rowDate = parseDate(row.Date);
      return rowDate >= startDate && rowDate <= endDate;
    });
  
    // Ensure we have data for the specified period
    if (relevantData.length === 0) {
      throw new Error("No data available for the specified term and start date");
    }
  
    // Convert strike percentage to decimal
    const strikeDecimal = strikePercentage / 100;
  
    const monthlyPayouts = relevantData.map(row => {
      const seaLevel = parseFloat(row['2060 rf Index (in)']);
      // Calculate payout only if sea level exceeds strike percentage
      return Math.max(0, (seaLevel / 100 - strikeDecimal) / strikeDecimal) * notional / 12;
    });
  
    const totalPayout = monthlyPayouts.reduce((sum, payout) => sum + payout, 0);
    const annualPremium = (totalPayout / termYears) * Math.pow(1.03, termYears);
  
    return {
      annualPremium,
      totalPayout,
      scenarioData,
    };
  }

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/*

Sample curl request to test payout

curl -X GET http://localhost:3000/calculateExpectedTotalPayout \
    -H "Content-Type: application/json" \
    -d '{
        "notional": 100000,
        "originDate": "6/1/22",    
        "termLength": 5,
        "strikePercentage": 0.05,
        "scenarioName": "High"
    }'

*/