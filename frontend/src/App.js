import React from "react";
import { Provider } from "react-redux";
import { store } from "./app/store";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import CarTable from "./features/cars/carTable";
import Signup from "./features/auth/Signup";
import Signin from "./features/auth/Signin";
import NavBar from "./components/Navbar";
import "./App.css";
import Heading from "./features/cars/MainHeading";
function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <div className="navbar">
            <NavBar />
          </div>
          
          <Switch>
            <Route exact path="/" component={CarTable} />
            <Route path="/signup" component={Signup} />
            <Route path="/signin" component={Signin} />
            <Redirect to="/" />
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
