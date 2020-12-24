import React, { Component } from "react";
import { Form, Button, Image } from "react-bootstrap";
import axios from "axios";
import io from "socket.io-client";
import DefaultAvatar from "../Images/rahmadiyono-widodo-rFMonBYsDqE-unsplash.jpg";
import decode from "jwt-decode";
import ExpiredModal from "./ExpiredTokenModal";

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
      confirm: null,
      loaded: false,
      endpoint: "",
      setModalShow: false,
      loading: false,
    };
    socket = io.connect();
  }

  componentDidMount() {
    console.log(this.getToken());
    console.log("yo");
    const { history } = this.props;
    if (localStorage.getItem("id_token") === null) {
      history.push("/login");
    } else {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      this.setState({
        currentUser: storedUser,
      });

      this.getUsers();
      window.setInterval(this.getUsers, 60000);
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

      socket.on("users_online", (userOnline) => {
        const parsedUser = JSON.parse(userOnline);

        this.setState({
          onlineUsers: [...this.state.onlineUsers, parsedUser],
        });
      });

      socket.on("users_offline", (userOffline) => {
        const parsedOffline = JSON.parse(userOffline);

        this.setState((prevState) => ({
          onlineUsers: prevState.usersOnline.filter((user) => {
            return user.id !== parsedOffline;
          }),
        }));
      });

      this.checkToken();
    }
  }

  componentDidUpdate() {
    const columnScroll = document.querySelector(".message-col");
    columnScroll.scrollTop = columnScroll.scrollHeight;
  }

  checkToken = async () => {
    let returnInterval;
    const token = localStorage.getItem("id_token");
    const decoded = decode(token);

    returnInterval = setInterval(() => {
      if (decoded.exp < Date.now() / 1000) {
        this.setState({
          setModalShow: true,
        });
      }
      return returnInterval;
    }, 300000);
    console.log("decoded dates", decoded);
  };

  loggedIn = async () => {
    const token = localStorage.getItem("id_token");
    return !!token && !this.isTokenExpired(token);
  };

  getConfirm = async () => {
    let token = localStorage.getItem("id_token");
    let answer = decode(token);
    try {
      return answer;
    } catch (err) {
      console.log(err);
    }
  };

  handleChange = (e) => {
    this.setState({
      errorMessage: "",
      setShow: false,
      text: e.target.value,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      id: this.state.currentUser.id,
      username: this.state.currentUser.username,
      text: this.state.text,
    };
    this.submitMessage(data);
    this.setState({
      text: "",
    });
  };

  handleClose = async (e) => {
    localStorage.clear();
    const { history } = this.props;
    this.setState({
      setModalShow: false,
    });
  };

  submitMessage = async (message) => {
    const token = JSON.parse(localStorage.getItem("id_token"));
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    await axios
      .post("/api/messages", message, { headers })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  getUsers = async () => {
    this.setState({
      loading: true,
    });
    const token = JSON.parse(localStorage.getItem("id_token"));
    await axios
      .get("/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
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
    this.setState({
      loading: false,
    });
  };

  getOfflineUsers = async () => {
    const token = JSON.parse(localStorage.getItem("id_token"));
    await axios
      .get("/api/users/inactive", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        this.setState({
          offlineUsers: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleLogOutSubmit = async (e) => {
    e.preventDefault();

    const offlineUser = {
      username: this.state.currentUser.username,
    };

    this.logOutUser(offlineUser);
  };

  logOutUser = async (user) => {
    const { history } = this.props;
    await axios
      .put("/api/authorize/logout", user)
      .then((res) => {
        localStorage.clear();
        history.push("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getMessages = async () => {
    const token = JSON.parse(localStorage.getItem("id_token"));
    await axios
      .get("/api/messages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
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

  getToken = async () => {
    return JSON.parse(localStorage.getItem("id_token"));
  };

  render() {
    console.log(this.state.text);

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
            <p className="text-center username-avatar">
              {message.username} <span id="time">12:32 PM</span>
            </p>
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
                : "rgb(170, 77, 84)",
          }}
          className="container d-block mt-3"
        >
          {message.text}
        </div>
      </div>
    ));

    const renderUsers = this.state.onlineUsers.map((user, index) => (
      <div>
        <h5 className="username-text" key={index}>
          <Image id="main-avatar" src={DefaultAvatar} roundedCircle />
          {user.username}
        </h5>
      </div>
    ));

    const renderOfflineUsers = this.state.offlineUsers.map((user, index) => (
      <div>
        <h5 style={{ color: "grey" }} className="username-text" key={index}>
          <Image id="main-avatar" src={DefaultAvatar} roundedCircle />
          {user.username}
        </h5>
      </div>
    ));

    console.log(this.state.currentUser);
    console.log(this.state.messages);
    return (
      <div className="container-fluid chatroom-container">
        <ExpiredModal
          show={this.state.setModalShow}
          onHide={this.handleLogOutSubmit}
        />
        <div className="container d-inline-block left-container">
          <div className="d-inline-block user-col">
            <h5 className="d-inline-block user-heading">Member List</h5>
            <Form
              className="logout-form"
              onSubmit={this.handleLogOutSubmit}
              inline
            >
              <Button
                type="submit"
                className="d-inline logout-button"
                variant="outline-dark"
              >
                Log Out
              </Button>{" "}
            </Form>
            <h6 className="online-text">
              Online ({this.state.onlineUsers.length} Members)
            </h6>
            <div className="container d-block users-list-container">
              <h6 className="users-list">renderUsers</h6>
              <hr className="onoff-hr" />
              <h6 className="offline-text">
                Offline ({this.state.offlineUsers.length} Members)
              </h6>
              <h6 className="users-list">{renderOfflineUsers}</h6>
            </div>
          </div>
        </div>
        <div className="container d-inline-block right-container">
          <h5 className="chatroom-name">#General</h5>
          <div className="d-inline-block message-col">
            <p className="message-text">{renderMessages}</p>
          </div>
          <div className="container d-inline-block type-col">
            {" "}
            <Form
              className="justify-content-center message-form"
              onSubmit={this.handleSubmit}
              inline
            >
              <Form.Group>
                <Form.Control
                  autoComplete="off"
                  name="text"
                  onChange={this.handleChange}
                  className="message-input"
                  value={this.state.text}
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
