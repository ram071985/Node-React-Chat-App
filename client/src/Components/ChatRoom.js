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
      messages: [],
      users: [],
      onlineUsers: [],
      offlineUsers: [],
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
    this.getMessages();
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

  getUsers = async () => {
    await axios
      .get("/api/users?active=true")
      .then((res) => {
        this.setState({
          usersOnline: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getOfflineUser = async () => {
    await axios
      .get("/api/users")
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };

  handleLogOut = async () => {
    await axios.post("/api/logout");
    localStorage.removeItem("user");
  };

  getMessages = async () => {
    await axios
      .get("/api/messages")
      .then((res) => {
        const sortMessages = res.data.sort(
          (a, b) => parseFloat(a.id) - parseFloat(b.id)
        );
        this.setState({
          messages: sortMessages,
        });
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const renderMessages = this.state.messages.map((message, index) => (
      <div id="bubble-container" className="container">
        <div
          key={index}
          id="chat-bubble"
          style={{
            float:
              message.user_id !== this.state.currentUser.id ? "left" : "right",
            backgroundColor:
              message.user_id !== this.state.currentUser.id
                ? "rgb(66, 57, 55)"
                : "rgb(177, 47, 30);",
          }}
          className="container d-block mt-3"
        >
          {message.text}
        </div>
      </div>
    ));

    const renderUsers = this.state.usersOnline.map((user, index) => (
      <h6 key={index}>{user.username}</h6>
    ));
    console.log(this.state.messages);
    return (
      <div className="container-fluid chatroom-container">
        <Row className="d-inline-block left-row no-gutters">
          <Col className="user-col">{renderUsers}</Col>
        </Row>
        <Row className="mt-5 d-inline-block right-row no-gutters">
          <Col className="d-block justify-content-right message-col">
            {renderMessages}
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
