# EventualFinalRound
Pricing tool mockup for eventual final round interview

Something to keep in mind as you try and run this. If you run into permission issues when running npm start, use 

sudo npm start for a quick workaround so you dont have to change any permissions in you system files 


Setup: 

Ensure that express is installed- this is what allows the React app to interface with the SQL db

npm install express mysql cors nodemon



Time Blocking:

When working on this I think I spent a couple hours in the evening of 7/17- I am on PST so I started around 7 PM PST 

Finished it the morning of 7/18- this was mainly fixing routing, session state, and documentation 

Major Roadblocks and How I Addressed Them

The first blocker I faced was setting up babel so I could use ES6 features such as import statements.These are not automatically available within express.js APIs

Solution: Installing babel, creating a .babelrc file, and modifying package.json so the start script was correct

The second largest blocker that I faced was react routing, which took the majority of time

Technical Decision Making

Database Layer: Sequelize

I wanted to use a quick in-memory solution to store user info. Sequelize is a great solution because it automaticaly creates tables based on Object Models that I defined in the backend/server.js file

We have one table that we need to use for authentication so this allows us to spin up the db at the same time as our server

Server Layer: Express.js 

I used express to create the backend for this application because its really easy and quick to link with databases and it also allows me to read in the appropriate csv file to generate the chart and calculations

Front-End: React.js

React allows for responsive frontends and its component based approach allowed me to keep the various pages separated 


How I Implemented the Solution: 

I approached this project with the following steps

I knew I wanted to build out the server and database layers first, because these would be responsible for all the 'work' this application would need to do. 

I Set up the API layer using express. There are endpoints for login, signup, getting the correct time series data for sea levels, and calculating the premiums and payouts

Having routes for each of these ensured that debugging and scaling would be seamless

Because I used sequelize, the db was taken care of and I didnt need to run any more scripts or install anything additonal to run 

To maintain the users logged in status, I used AuthContext to keep track of it, and used ProtectedRoutes to make sure that only users who are logged in can access the pricing tool page
