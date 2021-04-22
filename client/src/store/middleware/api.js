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
    if (method === "get" && onSuccess)
      socket.on("get_messages", (messages) => {
        dispatch(actions.apiCallSuccess(JSON.parse(messages.updateMessages)));
        dispatch({ type: onSuccess, payload: JSON.parse(messages.updateMessages) });
      });

    if (onSuccess) dispatch(actions.apiCallSuccess(response.data));
    dispatch({ type: onSuccess, payload: response.data });
  } catch (error) {
    dispatch(actions.apiCallFailed(error.message));
    if (onError) dispatch({ type: onError, payload: error.message });
  }
};

export default api;
