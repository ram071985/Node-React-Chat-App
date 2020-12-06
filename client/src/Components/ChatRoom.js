import React, { Component } from "react";
import { User } from "react-feather";

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
      <div className="container-fluid justify-content-center main-container">
        <div className="container-fluid outline-container">
          <div className="container-fluid inner-container">
            <div className="row user-row">
              <div className="col-6 user-column">
                <h6 className="text-left inline-block username-text">
                  <User
                    width="25"
                    color="rgb(177, 149, 127)"
                    className="mb-2 user-icon"
                  />{" "}
                  Reid Muchow
                </h6>
              </div>
            </div>
            <div className="container-fluid chat-container">            
              <div className="container-fluid channel-name-container">
                <h4 className="text-center channel-text">Main Channel</h4>
              </div>
              <div className="container-fluid messages-container">
              </div>
              <div className="container-fluid">
              </div>              
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ChatRoom;
