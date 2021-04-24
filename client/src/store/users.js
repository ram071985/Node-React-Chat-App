import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import moment from "moment";
import { apiCallBegan } from "../modules/api";

const slice = createSlice({
  name: "users",
  initialState: {
    list: [{ onlineUsers: [], offlineUsers: [] }],
    loading: false,
    lastFetch: null,
  },
  reducers: {
    usersRequested: (users, action) => {
      users.loading = true;
    },

    usersReceived: (users, action) => {
      users.list.onlineUsers = action.payload;
      users.loading = false;
      users.lastFetch = Date.now();
    },

    usersRequestFailed: (users, action) => {
      users.loading = false;
    },

    usersOfflineRequested: (users, action) => {
      users.loading = true;
    },

    usersOfflineReceived: (users, action) => {
      users.list.offlineUsers = action.payload;
      users.loading = false;
      users.lastFetch = Date.now();
    },

    usersOfflineRequestFailed: (users, action) => {
      users.loading = false;
    },
  },
});

export const {
  usersRequested,
  usersReceived,
  usersRequestFailed,
  usersOfflineRequested,
  usersOfflineReceived,
  usersOfflineRequestFailed,
} = slice.actions;
export default slice.reducer;

const url = "/users";

export const loadOnlineUsers = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.users;

  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  if (diffInMinutes < 10) return;

  return dispatch(
    apiCallBegan({
      url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "get",
      onStart: usersRequested.type,
      onSuccess: usersReceived.type,
      onError: usersRequestFailed.type,
    })
  );
};

export const loadOfflineUsers = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.users;
    console.log(getState().entities.users)
  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  if (diffInMinutes < 10) return;

  return dispatch(
    apiCallBegan({
      url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "get",
      onStart: usersOfflineRequested.type,
      onSuccess: usersOfflineReceived.type,
      onError: usersOfflineRequestFailed.type,
    })
  );
};

// Selectors

export const getOnlineUsers = createSelector(
  (state) => state.entities.users,
  (users) => users.list.onlineUsers
);

export const getOfflineUsers = createSelector(
  (state) => state.entities.users,
  (users) => users.list.offlineUsers
);
