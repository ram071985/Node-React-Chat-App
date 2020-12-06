import React, { Component } from "react";
import { User } from "react-feather";
import { Row, Col, Form } from "react-bootstrap";

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
        <Row className="d-inline-block left-row no-gutters">
          <Col className="user-col"></Col>
        </Row>
        <Row className="mt-5 d-inline-block right-row no-gutters">
          <Col className="d-inline-block message-col">
            <div className="mt-3 chat-bubble">Howdy.</div>
          </Col>
          <Col className="type-col">
            <Form.Group>
              <Form.Control className="message-input" size="sm" type="input" placeholder="Small text" />
            </Form.Group>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ChatRoom;
