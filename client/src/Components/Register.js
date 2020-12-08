import axios from "axios";
import React, { Component } from "react";
import { Container, Row, Form, Button } from "react-bootstrap";
import AlertComponent from "./AlertComponent";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      errorMessage: "",
      setShow: false,
    };
  }

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

  handleClick = () => {
    const { history } = this.props;
    history.push("/login");
  };

  handleSubmit = (e) => {
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

  registerUser = async (user) => {
    await axios
      .post("/api/users", user)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        if (err.response.data.message === "username exists") {
          this.setState({
            errorMessage: "Yo dawg, this username exists.",
            setShow: true,
          });
        }
        console.log(err.response.data.message)
      });
  };

  renderAlert = () => {
    if (this.state.logInErrorMessage !== "") {
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
            <Button
              type="submit"
              className="mt-2 d-inline-block"
              variant="light"
            >
              Submit
            </Button>
          </Form>
        </Row>
        <Row className="justify-content-center">
          <Button
            onClick={this.handleClick}
            className="mt-4 mb-3 d-inline-block"
            variant="light"
          >
            I Have An Account
          </Button>
        </Row>
        <Row className="justify-content-center">{this.renderAlert()}</Row>
      </Container>
    );
  }
}

export default Register;
