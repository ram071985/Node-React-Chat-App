import React, { Component } from "react";
import { User } from "react-feather";
import { Form, Button, Image } from "react-bootstrap";
import axios from "axios";
import io from "socket.io-client";
import DefaultAvatar from "../Images/rahmadiyono-widodo-rFMonBYsDqE-unsplash.jpg";

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
    window.setInterval(this.getUsers, 100000);
    this.getMessages();

    socket.on("new_message", (message) => {
      console.log("connection to message socket:" + message);
    });

    socket.on("message", (chatMessage) => {
      console.log("message sent back");
      const parsedMessage = JSON.parse(chatMessage);

      this.setState({
        messages: [...this.state.messages, parsedMessage],
      });
    });
  }

  componentDidUpdate() {
    const columnScroll = document.querySelector(".message-col");
    columnScroll.scrollTop = columnScroll.scrollHeight;
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
    this.setState({
      text: "",
    });
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
    this.getOfflineUsers();
  };

  getOfflineUsers = async () => {
    await axios
      .get("/api/users")
      .then((res) => {
        this.setState({
          offlineUsers: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleLogOut = async () => {
    const { history } = this.props;
    const { currentUser } = this.state;

    await axios
      .post("/api/logout")
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

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

  avatarCondition = async () => {
    const messageBackground = document.getElementById("chat-bubble");
    if (messageBackground) {
      return messageBackground.style.backgroundColor;
    }
  };

  render() {
    const messageBackground = document.getElementById("chat-bubble");
    const renderMessages = this.state.messages.map((message, index) => (
      <div id="bubble-container" className="container">
        <div className="container avatar-container">
          <div
            style={{
              float:
                this.avatarCondition === "rgb(177, 47, 30)" ||
                message.user_id !== this.state.currentUser.id
                  ? "left"
                  : "right",
            }}
          >
            <Image id="avatar" src={DefaultAvatar} roundedCircle />
            <p className="text-center username-avatar">Yo <span id="time">12:32 PM</span></p>
          </div>
        </div>
        <div
          key={index}
          id="chat-bubble"
          style={{
            float:
              message.user_id !== this.state.currentUser.id ? "left" : "right",
            background:
              message.user_id !== this.state.currentUser.id
                ? "rgb(48, 48, 48)"
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

    const renderOfflineUsers = this.state.offlineUsers.map((user, index) => (
      <h3 className="username-text" key={index}>
        {user.username}
      </h3>
    ));

    console.log(this.avatarCondition === "rgb(177, 47, 30)");
    return (
      <div className="container-fluid chatroom-container">
        <div className="container d-inline-block left-container">
          <div className="d-inline-block user-col">
            <h5 className="d-inline-block user-heading">Member List</h5>
            <Form inline>
              <Button
                onClick={this.handleLogOut}
                className="d-inline logout-button mr-2"
                variant="outline-dark"
              >
                Log Out
              </Button>{" "}
            </Form>
            <h6 className="online-text">Online (4 Members)</h6>
            <div className="container d-block users-list-container">
              <h6 className="users-list">{renderUsers}</h6>
              <hr className="onoff-hr"/>
              <h6 className="offline-text">Offline (4 Members)</h6>
            </div>
          </div>
        </div>
        <div className="container d-inline-block right-container">
          <div className="d-inline-block message-col">
            <h5 className="chatroom-name">#General</h5>
            <p className="message-text">{renderMessages}</p>
          </div>
          <div className="d-inline-block type-col">
            {" "}
            <Form
              className="justify-content-center message-form"
              onSubmit={this.handleSubmit}
              inline
            >
              <Form.Group>
                <Form.Control
                  name="text"
                  onChange={this.handleChange}
                  className="message-input"
                  size="sm"
                  type="input"
                  placeholder="Say something"
                />
              </Form.Group>
              <Button
                id="message-button"
                className="d-inline-inline"
                type="submit"
                variant="outline-secondary"
              >
                Send
              </Button>{" "}
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default ChatRoom;
