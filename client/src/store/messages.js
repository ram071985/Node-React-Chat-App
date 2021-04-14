import { createSelector, createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const slice = createSlice({
  name: "stocks",
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
  },

  reducers: {
    stocksRequested: (stocks, action) => {
      bugs.loading = true;
    },

    stocksReceived: (stocks, action) => {
      stocks.list = action.payload;
      stocks.loading = false;
      stocks.lastFetch = Date.now();
    },

    stocksRequestfailed: (stocks, action) => {
      stocks.loading = false;
    },
  },
});

export const {
  stocksRequested,
  stocksReceived,
  stocksRequestFailed,
} = slice.actions;
export default slice.reducer;

const url = "/messages";

export const loadMessages = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.messages;

  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  if (diffInMinutes < 10) return;

  return dispatch(
    apiCallBegan({
      url,
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
