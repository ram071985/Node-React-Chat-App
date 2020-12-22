import React, { Component } from "react";
import Alert from "react-bootstrap/Alert";
import { Row } from "react-bootstrap"

class AlertComponent extends Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return (
      <div className="d-inline-block container">
          <Row className="justify-content-center">
          <Alert
            style={{
              display: this.props.errorMessage !== "" ? "block" : "none",
            }}
            show={this.props.setShow}
            className="d-block auth-alert"
            variant="danger"
          >
            <p>{this.props.errorMessage}</p>
          </Alert>
          </Row>
      </div>
    );
  }
}

export default AlertComponent;
