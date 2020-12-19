import React, { Component } from "react";
import { Modal, Button, Form } from "react-bootstrap";

class ExpiredTokenModal extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <Modal
        className="expired-modal"
        show={this.props.show}
        onHide={this.props.onHide}
      >
        <Modal.Header>
          <Modal.Title>Your session has expired!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Please log back in.</Modal.Body>
        <Modal.Footer>
          <Form onSubmit={this.props.onHide}>
            {" "}
            <Button
              type="submit"
              variant="secondary"
            >
              Back to log in
            </Button>
          </Form>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ExpiredTokenModal;
