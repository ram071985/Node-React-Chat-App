import React from "react";
import ChatRoom from "./Components/ChatRoom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import LogIn from "./Components/LogIn";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
        <Switch>
          <Route path="/login" component={LogIn} />
          <Route path="/" component={ChatRoom}></Route>
        </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
