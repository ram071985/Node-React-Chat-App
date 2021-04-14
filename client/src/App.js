import React from "react";
import ChatRoom from "./Components/ChatRoom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import LogIn from "./Components/LogIn";
import Register from "./Components/Register";
import configureStore from './store/configureStore';

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <BrowserRouter>
          <Switch>
            <Route path="/register" component={Register} />
            <Route path="/login" component={LogIn} />
            <Route path="/" component={ChatRoom} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
