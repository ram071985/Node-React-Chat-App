import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import io from "socket.io-client";
import DefaultAvatar from "../Images/rahmadiyono-widodo-rFMonBYsDqE-unsplash.jpg";
import decode from "jwt-decode";
import ExpiredModal from "./ExpiredTokenModal";
import moment from "moment";
import { PlayCircle, PauseCircle } from "react-feather";
import { loadMessages, getMessages, addMessage } from "../store/messages";
import {
  loadOnlineUsers,
  loadOfflineUsers,
  getOnlineUsers,
  getOfflineUsers,
} from "../store/users";

let socket;

const ChatRoom = (props) => {
  const dispatch = useDispatch();
  let scrollRef = useRef();
  const messages = useSelector(getMessages, []);
  const usersOnline = useSelector(getOnlineUsers, []);
  const usersOffline = useSelector(getOfflineUsers, []);

  // constructor() {
  //   super();
  //   state = {
  //     text: "",
  //     errorMessage: "",
  //     setshow: false,
  //     confirm: null,
  //     loaded: false,
  //     endpoint: "",
  //     setModalShow: false,
  //     loading: false,
  //   };
  const [text, setText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [setShow, changeShow] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [confirm, setConfirm] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [endpoint, setEndpoint] = useState("");
  const [setModalShow, changeModalShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [play, setPlay] = useState(false);
  const [pause, setPause] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  socket = io.connect();
  // url = "../Audio/serene_audio.m4a";
  // audio = new Audio(url);

  useEffect(() => {
    if (scrollRef) {
      scrollRef.current.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }
  }, []);

  useEffect(() => {
    const { history } = props;
    if (localStorage.getItem("id_token") === null) {
      history.push("/login");
    } else {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      setCurrentUser(storedUser);
      dispatch(loadMessages());
      dispatch(loadOnlineUsers());
      dispatch(loadOfflineUsers());
      // window.setInterval(getUsers, 60000);

      socket.on("new_message", (message) => {
        console.log("connection to message socket:" + message);
      });

      checkToken();
    }
  }, []);

  // play = async () => {
  //   setState({
  //     play: true,
  //     pause: false,
  //   });
  //   audio.play();
  // };

  // pause = async () => {
  //   setState({
  //     play: false,
  //     pause: true,
  //   });
  //   audio.pause();
  // };

  const checkToken = async () => {
    const token = localStorage.getItem("id_token");
    const decoded = decode(token);
    if (decoded.exp < Date.now() / 1000) {
      changeModalShow(true);
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
    setErrorMessage("");
    changeShow(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      id: currentUser.id,
      username: currentUser.username,
      text: text,
    };
    dispatch(addMessage(data));
    // dispatch(loadMessages);
    setText("");
  };

  const handleClose = async (e) => {
    localStorage.clear();
    const { history } = props;
    setState({
      setModalShow: false,
    });
  };

  const handleLogOutSubmit = async (e) => {
    e.preventDefault();

    const offlineUser = {
      username: currentUser.username,
    };

    logOutUser(offlineUser);
  };

  const logOutUser = async (user) => {
    const { history } = props;
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

  const avatarCondition = async () => {
    const messageBackground = document.getElementById("chat-bubble");
    if (messageBackground) {
      return messageBackground.style.backgroundColor;
    }
  };

  const getToken = async () => {
    return JSON.parse(localStorage.getItem("id_token"));
  };
  const callRenderMessages = () => {
    return messages.map((message, index) => (
      <div key={index} id="bubble-container" className="container">
        <div className="container avatar-container">
          <div
            style={{
              float:
                avatarCondition === "rgb(177, 47, 30)" ||
                message.user_id !== currentUser.id
                  ? "left"
                  : "right",
            }}
          >
            <Image id="avatar" src={DefaultAvatar} roundedCircle />
            <p className="text-center username-avatar">
              {message.username}{" "}
              <span id="time">
                {moment(message.created_date).format("l").toString()}
              </span>
            </p>
            <h6 className="time">
              {moment(message.created_date).format("LT").toString()}
            </h6>
          </div>
        </div>
        <div
          id="chat-bubble"
          style={{
            float: message.user_id !== currentUser.id ? "left" : "right",
            background:
              message.user_id !== currentUser.id
                ? "rgb(48, 48, 48)"
                : "rgb(170, 77, 84)",
          }}
          className="container d-block mt-3"
        >
          {message.text}
        </div>
      </div>
    ));
  };

  const renderUsers = () => {
    return usersOnline.map((user, index) => (
      <div key={index}>
        <h5 className="username-text" key={index}>
          <Image id="main-avatar" src={DefaultAvatar} roundedCircle />
          {user.username}
        </h5>
      </div>
    ));
  };

  const renderOfflineUsers = () => {
    return usersOffline.map((user, index) => (
      <div key={index}>
        <h5 style={{ color: "grey" }} className="username-text" key={index}>
          <Image id="main-avatar" src={DefaultAvatar} roundedCircle />
          {user.username}
        </h5>
      </div>
    ));
  };
  console.log("before return", setModalShow);
  return (
    <div className="container-fluid chatroom-container">
      <ExpiredModal show={setModalShow} onHide={handleLogOutSubmit} />
      <div className="container d-inline-block left-container">
        <div className="d-inline-block user-col">
          <h5 className="d-inline-block user-heading">Member List</h5>
          <Form className="logout-form" onSubmit={handleLogOutSubmit} inline>
            <Button
              type="submit"
              className="d-inline logout-button"
              variant="outline-dark"
            >
              Log Out
            </Button>{" "}
          </Form>
          <h6 className="online-text">Online ({usersOnline.length} Members)</h6>
          <div className="container d-block users-list-container">
            <h6 className="users-list">{renderUsers()}</h6>
            <hr className="onoff-hr" />
            <h6 className="offline-text">
              Offline ({usersOffline.length} Members)
            </h6>
            <h6 className="users-list">{renderOfflineUsers()}</h6>
          </div>
        </div>
      </div>
      <div className="container d-inline-block right-container">
        <h5 className="chatroom-name">#General</h5>
        <div ref={scrollRef} className="d-inline-block message-col">
          <div>{callRenderMessages()}</div>
        </div>
        <div className="container d-inline-block type-col">
          {" "}
          <Form
            className="justify-content-center message-form"
            onSubmit={handleSubmit}
            inline
          >
            <Form.Group>
              <Form.Control
                autoComplete="off"
                name="text"
                onChange={handleChange}
                className="message-input"
                value={text}
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
            <h6 style={{ color: "white" }} className="text-center audio-text">
              Audio
            </h6>
            <PlayCircle id="play" />
            <PauseCircle id="pause" />
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
