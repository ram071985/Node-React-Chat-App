import React, { Component } from "react";
import { User } from "react-feather";
import { Container, Row, Col } from "react-bootstrap";

class ChatRoom extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    const { history } = this.props;
    const isLocalStorage = localStorage.getItem("username");

    if (!isLocalStorage) {
      history.push("/login");
    }
  }

  render() {
    return (
      <div className="container-fluid chatroom-container">
        <Row className="h-100 mt-5 d-inline-block left-row">
          <Col className="user-col"></Col>
        </Row>
        <Row className="h-100 mt-5 d-inline-block right-row">
          <Col className="d-inline-block message-col">
            <div className="mt-3 chat-bubble">Howdy.</div>
          </Col>
        </Row>
        <Row className="h-100 type-row">
          <Col className="d-inline-block type-col">Doo</Col>
        </Row>
      </div>
    );
  }
}

export default ChatRoom;
