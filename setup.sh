#!/bin/bash

# Specify the Node version you want to install
NODE_VERSION=18.17.0

# Function to check the installed version of Node.js
check_node_version() {
  if command -v node &> /dev/null; then
    INSTALLED_NODE_VERSION=$(node -v)
    echo "Installed Node version: $INSTALLED_NODE_VERSION"
  else
    echo "Node is not installed."
    INSTALLED_NODE_VERSION=""
  fi
}

# Function to install the specified version of Node.js using nvm
install_node() {
  if command -v nvm &> /dev/null; then
    nvm install $NODE_VERSION
    nvm use $NODE_VERSION
  else
    echo "nvm is not installed. Installing nvm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
    source ~/.nvm/nvm.sh
    nvm install $NODE_VERSION
    nvm use $NODE_VERSION
  fi
}

# Function to run the setup commands
setup_project() {
  echo "Cloning the repository and setting up the project..."

  # Navigate to the project directory
  cd EventualFinalRound

  # Install frontend dependencies
  echo "Installing frontend dependencies..."
  npm install react react-router-dom axios chart.js

  # Navigate to the backend directory
  cd backend

  # Install Babel and other backend dependencies
  echo "Installing backend dependencies..."
  npm install --save-dev @babel/core @babel/preset-env @babel/register
  npm install express mysql cors nodemon bcrypt csv-parser axios
  npm install sequelize

  echo "Setup complete. To run the project:"
  echo "1. Backend: In the 'backend' directory, run 'npm start'."
  echo "2. Frontend: In the 'EventualFinalRound' directory, run 'npm start'."
}

# Main script execution
check_node_version
if [[ $INSTALLED_NODE_VERSION != "v$NODE_VERSION" ]]; then
  echo "Installing Node.js version $NODE_VERSION..."
  install_node
else
  echo "Node.js version $NODE_VERSION is already installed."
fi

setup_project
