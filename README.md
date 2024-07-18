# EventualFinalRound

# Setup and Run The Project: 

Node version: 18.17.0 

In the base directory: 

```npm install react react-router-dom axios chart.js```

Install the necessary packages to run the backend server:   
  
```cd pricingtool/backend```  

Install babel then the other dependencies to run the express server and Sequelize database  
```npm install --save-dev @babel/core @babel/preset-env @babel/register```  
  
```npm install express mysql cors nodemon bcrypt csv-parser axios```  
  
```npm i sequelize```  



# Run the project: 

Backend- make sure you are in the backend folder and have the above packages installed
```npm start```


Frontend-Open a new terminal window and run the following:
```cd pricingtool```  

```npm start```



# Time Blocking:

When working on this I think I spent a couple hours in the evening of 7/17- I am on PST- Created all components, API endpoints, input validation and linking the front-end to the backend

Finished it the morning of 7/18- this was mainly fixing routing, session state, and documentation 

# Major Roadblocks and How I Addressed Them

The first blocker I faced was setting up babel so I could use ES6 features such as import statements.These are not automatically available within express.js APIs

Solution: Installing babel, creating a .babelrc file, and modifying package.json so the start script was correct

The second largest blocker that I faced was react routing, which took the majority of time

Solution: Literally just removing the React.StrictMode tags (This took a while to find the right github issue that had a fix, kind of hacky but got the job done)


 # How I Implemented the Solution: 



# API Documentation

## Endpoints

### 1. Register User
- **URL**: `/register`
- **Method**: POST
- **Parameters**:
  - `firstName` (string, required): User's first name
  - `lastName` (string, required): User's last name
  - `email` (string, required): User's email address
  - `password` (string, required): User's password
  - `organization` (string, optional): User's organization
- **Response Codes**:
  - 201: User registered successfully
  - 400: User with this email already exists
  - 500: Server error

### 2. Login User
- **URL**: `/login`
- **Method**: POST
- **Parameters**:
  - `email` (string, required): User's email address
  - `password` (string, required): User's password
- **Response Codes**:
  - 200: Login successful
  - 401: Invalid credentials
  - 404: User not found
  - 500: Server error

### 3. Get Sea Levels
- **URL**: `/getSeaLevels/:scenarioName`
- **Method**: GET
- **Parameters**:
  - `scenarioName` (string, required): Name of the sea level rise scenario
- **Response Codes**:
  - 200: Returns JSON array of sea level data
  - 500: Error reading CSV file

### 4. Calculate Expected Total Payout
- **URL**: `/calculateExpectedTotalPayout`
- **Method**: GET
- **Query Parameters**:
  - `scenarioName` (string, required): Name of the sea level rise scenario
  - `notional` (number, required): Notional amount
  - `originDate` (string, required): Origin date in format "MM/DD/YY"
  - `termLength` (number, required): Term length in years
  - `strikePercentage` (number, required): Strike percentage
- **Response Codes**:
  - 200: Returns JSON object with calculated premium, total payout, and scenario data
  - 500: Error calculating expected total payout

## Calculate Premium Function

The `calculatePremium` function is used to compute the annual premium and total payout based on sea level rise scenarios.

1. It filters the scenario data to include only the relevant period based on the start date and term length.
2. For each month in the relevant period, it calculates a payout if the sea level exceeds the strike percentage using the maximum of 0 and the amount that sea level exceeds strike.
3. The total payout is the sum of all monthly payouts, I used the map reduce function to aggregate these amounts.
4. The annual premium is calculated by dividing the total payout by the term length and applying a 3% annual increase.

The function returns an object containing the annual premium, total payout, and the scenario data used in the calculation.
