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

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleClick = () => {
    const { history } = this.props;
    history.push("/login");
  };

  handleSubmit = (e) => {
    console.log("click");
    e.preventDefault();
    const { username, password } = this.state;
    //if (username || password === "") {
    //}

    const newUser = {
      username: username,
      password: password,
    };

    this.registerUser(newUser);
  };

  registerUser = async user => {
    await axios
      .post("/api/register", user)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    console.log(this.state.username);
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
          <Form onSubmit={(e) => this.handleSubmit(e)}>
            <Form.Group>
              <Form.Label className="mt-2 login-label">Username</Form.Label>
              <Form.Control
                name="username"
                className="login-form-control"
                type="input"
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="login-label">Password</Form.Label>
              <Form.Control
                name="password"
                className="login-form-control"
                type="input"
                onChange={this.handleChange}
              />
            </Form.Group>
            <Button type="submit" className="mt-2 d-inline-block" variant="light">
            Submit
          </Button>
          </Form>
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
