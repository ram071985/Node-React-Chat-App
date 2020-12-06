import React, { Component } from "react";
import { User } from "react-feather";
import { Row, Col, Form, Button } from "react-bootstrap";
import axios from "axios";

class ChatRoom extends Component {
  constructor() {
    super();
    this.state = {
      text: "",
      errorMessage: "",
      setshow: false,
      currentUser: {},
    };
  }

  componentDidMount() {
    const { history } = this.props;
    const isLocalStorage = localStorage.getItem("user");
    if (!isLocalStorage) {
      history.push("/login");
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));

    this.setState({
      currentUser: storedUser,
    });
  }

  handleChange = (e) => {
    this.setState({
      errorMessage: "",
      setShow: false,
    });
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    let newMessage = {
      id: this.state.currentUser.id,
      username: this.state.currentUser.username,
      text: this.state.text,
    };

    this.submitMessage(newMessage);
  };

  submitMessage = async (newMessage) => {
    await axios
      .post("/api/messages", newMessage)
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  };

  render() {
    console.log(this.state.currentUser);
    return (
      <div className="container-fluid chatroom-container">
        <Row className="d-inline-block left-row no-gutters">
          <Col className="user-col"></Col>
        </Row>
        <Row className="mt-5 d-inline-block right-row no-gutters">
          <Col className="d-inline-block message-col">
            <div className="mt-3 chat-bubble">Howdy.</div>
          </Col>
          <Col className="type-col">
            <Form onSubmit={this.handleSubmit} inline>
              <Form.Group>
                <Form.Control
                  name="text"
                  onChange={this.handleChange}
                  className="message-input"
                  size="sm"
                  type="input"
                  placeholder="Small text"
                />
              </Form.Group>
              <Button
                className="d-inline-inline"
                type="submit"
                variant="outline-secondary"
              >
                Secondary
              </Button>{" "}
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ChatRoom;
