import React, { Component } from "react";
import { Container, Row, Form, Button } from "react-bootstrap";
import axios from "axios";
import AlertComponent from "./AlertComponent";

class LogIn extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      setShow: false,
      errorMessage: ""
    };
  }

  handleClick = () => {
    const { history } = this.props;
    history.push("/register");
  };

  handleChange = (event) => {
    this.setState({
      errorMessage: "",
      setShow: false,
    });
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = (e) => {
    console.log("click");
    e.preventDefault();
    const { username, password } = this.state;

    const newUser = {
      username: username,
      password: password,
    };

    this.logInUser(newUser);
  };

  logInUser = async (user) => {
    await axios
      .post("api/authorize", user)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err.response.data);
        if (err.response.data.message === "incorrect password") {
          this.setState({
            errorMessage: "You've entered an incorrect password.",
            setShow: true,
          });
        }
      });
  };

  renderAlert = () => {
    if (this.state.errorMessage !== "") {
      return (
        <AlertComponent
          setShow={this.state.setShow}
          errorMessage={this.state.errorMessage}
        />
      );
    }
  };

  render() {
    return (
      <Container
        id="login-container"
        className="container justify-content-center"
      >
        <Row id="login-title-row" className="justify-content-center">
          <h3 className="mt-3 login-title">Log In</h3>
        </Row>
        <Row className="justify-content-center">
          {" "}
          <Form onSubmit={(e) => this.handleSubmit(e)}>
            <Form.Group>
              <Form.Label className="mt-2 login-label">Username</Form.Label>
              <Form.Control
                name="username"
                onChange={this.handleChange}
                className="login-form-control"
                type="input"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="login-label">Password</Form.Label>
              <Form.Control
                name="password"
                onChange={this.handleChange}
                className="login-form-control"
                type="input"
              />
            </Form.Group>
            <Button
              type="submit"
              className="mt-2 d-inline-block"
              variant="light"
            >
              Submit
            </Button>
          </Form>
        </Row>
        <Row className="justify-content-center"></Row>
        <Row className="justify-content-center">
          <Button
            onClick={this.handleClick}
            className="mt-4 d-inline-block"
            variant="light"
          >
            Register An Account
          </Button>
        </Row>
        <Row className="justify-content-center">{this.renderAlert()}</Row>
      </Container>
    );
  }
}

export default LogIn;
