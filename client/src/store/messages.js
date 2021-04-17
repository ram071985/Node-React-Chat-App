import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import moment from "moment";
import { apiCallBegan } from "./api";

const slice = createSlice({
  name: "messages",
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
  },

  reducers: {
    messagesRequested: (messages, action) => {
      messages.loading = true;
    },

    messagesReceived: (messages, action) => {
      messages.list = action.payload;
      messages.loading = false;
      messages.lastFetch = Date.now();
    },

    messagesRequestFailed: (messages, action) => {
      messages.loading = false;
    },
  },
});

export const {
  messagesRequested,
  messagesReceived,
  messagesRequestFailed,
} = slice.actions;
export default slice.reducer;

// Action Creators
const url = "/messages";

const token = JSON.parse(localStorage.getItem("id_token"));

export const loadMessages = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.messages;

  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  if (diffInMinutes < 10) return;

  return dispatch(
    apiCallBegan({
      url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      onStart: messagesRequested.type,
      onSuccess: messagesReceived.type,
      onError: messagesRequestFailed.type,
    })
  );
};

// Selectors

export const getMessages = createSelector(
  (state) => state.entities.messages,
  (messages) => messages.list
);
