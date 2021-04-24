import { combineReducers } from "redux";
import messagesReducer from "./messages";
import usersReducer from "./users";

export default combineReducers({
  messages: messagesReducer,
  users: usersReducer,
});
