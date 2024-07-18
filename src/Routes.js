import React from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import LandingPage from './LandingPage';
import SignUpPage from './SignUpPage';
import LoginPage from './LoginPage';
import NavBar from './NavBar';
import PricingForm from './pricing';
import { AuthProvider} from './AuthContext';



const Routes = () => {
    return (
      <BrowserRouter>
        <AuthProvider>
          <NavBar />
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/signup" component={SignUpPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/pricing" component={PricingForm} />
          </Switch>
        </AuthProvider>
      </BrowserRouter>
    );
  };

export default Routes;
