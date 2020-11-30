import axios from "axios";
import React, { Component } from "react";
import { Container, Row, Form, Button } from "react-bootstrap";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
    };
  }

  handleClick = () => {
    const { history } = this.props;
    history.push("/login");
  };

  handleSubmit = () => {
    const { username, password } = this.state;
    //if (username || password === "") {
    //}

    const newUser = {
      username: username,
      password: password,
    };

    this.logInUser(newUser);
  };

  logInUser = async (user) => {
    await axios
      .post("/api/authorize", user)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <Container
        id="login-container"
        className="container justify-content-center"
      >
        <Row id="login-title-row" className="justify-content-center">
          <h3 className="mt-3 login-title">Register</h3>
        </Row>
        <Row className="justify-content-center">
          {" "}
          <Form>
            <Form.Group>
              <Form.Label className="mt-2 login-label">Username</Form.Label>
              <Form.Control className="login-form-control" type="username" />
            </Form.Group>
            <Form.Group>
              <Form.Label className="login-label">Password</Form.Label>
              <Form.Control className="login-form-control" type="username" />
            </Form.Group>
          </Form>
        </Row>
        <Row className="justify-content-center">
          <Button className="mt-2 d-inline-block" variant="light">
            Submit
          </Button>
        </Row>
        <Row className="justify-content-center">
          <Button
            onClick={this.handleClick}
            className="mt-4 d-inline-block"
            variant="light"
          >
            I Have An Account
          </Button>
        </Row>
      </Container>
    );
  }
}

export default Register;
