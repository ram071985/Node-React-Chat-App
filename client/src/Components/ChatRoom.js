import React, { Component } from "react";
import { User } from "react-feather";
import { Row, Col, Form, Button } from "react-bootstrap";
import axios from "axios";
import io from "socket.io-client";

let socket;

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
      endpoint: "http://localhost:3000",
    };
    socket = io(this.state.endpoint);
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
    this.getUsers();
    this.getMessages();

    socket.on("new_message", (message) => {
      console.log("connection to message socket:" + message);
    });

    socket.on("user_online", (userOnline) => {
      const parsedUsers = JSON.parse(userOnline);

      this.setState({
        usersOnline: [...this.state.usersOnline, parsedUsers],
      });
    });

    socket.on("message", (chatMessage) => {
      console.log("message sent back")
      const parsedMessage = JSON.parse(chatMessage);

      this.setState({
        messages: [...this.state.messages, parsedMessage],
      });
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

  getUsers = async () => {
    await axios
      .get("/api/users")
      .then((res) => {
        this.setState({
          onlineUsers: res.data,
        });
        console.log(res);
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
    const { history } = this.props;
    
    await axios.post("/api/logout");

    localStorage.removeItem("user");
    history.push("/login");
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
            background:
              message.user_id !== this.state.currentUser.id
                ? "rgb(255, 255, 255)"
                : "rgb(177, 47, 30)",
          }}
          className="container d-block mt-3"
        >
          {message.text}
        </div>
      </div>
    ));

    const renderUsers = this.state.onlineUsers.map((user, index) => (
      <h3 className="username-text" key={index}>
        {user.username}
      </h3>
    ));

    console.log(this.state.onlineUsers);
    return (
      <div className="container-fluid chatroom-container">
        <div className="container d-inline-block left-container">
          <div className="d-inline-block user-col">
            <h2 className="mt-1 user-heading">Users</h2>
            {renderUsers}
          </div>
        </div>
        <div className="container d-inline-block right-container">
          <div className="d-inline-block message-col">{renderMessages}</div>
          <div className="d-inline-block type-col">
            {" "}
            <Form className="message-form" onSubmit={this.handleSubmit} inline>
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
                id="message-button"
                className="d-inline-inline"
                type="submit"
                variant="outline-secondary"
              >
                Secondary
              </Button>{" "}
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default ChatRoom;
