import React, { useEffect, useContext } from 'react';
import { BrowserRouter, Router, Route, Switch, Redirect, useHistory } from 'react-router-dom';
import LandingPage from './LandingPage';
import SignUpPage from './SignUpPage';
import LoginPage from './LoginPage';
import NavBar from './NavBar';
import PricingForm from './pricing';
import { AuthProvider, AuthContext } from './AuthContext';


const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    if (!isAuthenticated) {
      history.push('/login');
    }
  }, [isAuthenticated, history]);

  console.log('PrivateRoute - isAuthenticated:', isAuthenticated);

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};


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
