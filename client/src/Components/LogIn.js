import React, { Component } from "react";
import { Container, Row } from "react-bootstrap";

class LogIn extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <Container id="login-container" className="container justify-content-center">
          <Row id="login-title-row" className="justify-content-center">
            <h3 className="mt-2 login-title">Log In</h3>
          </Row>
          <hr className="login-hr"/>
          
      </Container>
    );
  }
}

export default LogIn;
