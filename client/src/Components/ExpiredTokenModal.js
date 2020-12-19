import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";

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
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={this.props.handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ExpiredTokenModal;
