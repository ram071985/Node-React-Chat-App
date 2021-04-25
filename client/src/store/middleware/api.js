import axios from "axios";
import * as actions from "../../modules/api";
import io from "socket.io-client";

let socket;

const api = ({ dispatch }) => (next) => async (action) => {
  if (action.type !== actions.apiCallBegan.type) return next(action);
  const {
    url,
    method,
    headers,
    data,
    onStart,
    onSuccess,
    onError,
  } = action.payload;

  socket = io.connect();

  if (onStart) dispatch({ type: onStart });

  next(action);

  try {
    const response = await axios.request({
      baseURL: "http://localhost:3000/api",
      url,
      method,
      headers,
      data,
    });

    if (onSuccess) {
      if (url === "/messages" && method === "get") {
        socket.on("get_messages", (messages) => {
          dispatch(actions.apiCallSuccess(JSON.parse(messages)));
          dispatch({ type: onSuccess, payload: JSON.parse(messages) });
        });
      } if (url === "/messages" && method === "post") {
        socket.on("message", (messages) => {
          dispatch(actions.apiCallSuccess(JSON.parse(messages)));
          dispatch({ type: onSuccess, payload: JSON.parse(messages) });
        });
      } if (url === "/users") {
        socket.on("get_users", (userOnline) => {
          console.log(userOnline);
          dispatch(actions.apiCallSuccess(JSON.parse(userOnline)));
          dispatch({ type: onSuccess, payload: JSON.parse(userOnline) });
        });
      } if (url === "users/inactive") {
        socket.on("get_offline_users", (userOffline) => {
          dispatch(actions.apiCallSuccess(JSON.parse(userOffline)));
          dispatch({ type: onSuccess, payload: JSON.parse(userOffline) });
        });
      }
    }
  } catch (error) {
    dispatch(actions.apiCallFailed(error.message));
    if (onError) dispatch({ type: onError, payload: error.message });
  }
};

export default api;
