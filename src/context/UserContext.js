import React from "react";
import axios from 'axios'
var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true };
    case "SIGN_OUT_SUCCESS":
      return { ...state, isAuthenticated: false };
    case "LOGIN_FAILURE":
      return { ...state, isAuthenticated: false };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!localStorage.getItem("token"),
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  var context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

export { UserProvider, useUserState, useUserDispatch, loginUser, signOut };

// ###########################################################

function loginUser(dispatch, login, password, history, setIsLoading, setError, action_type = "login", username = "") {
  setError(false);
  setIsLoading(true);
  let data = {}
  let url = ""
  if (action_type == "login") {
    data = {
      "Password": password,
      "Email": login
    }
    url = 'http://178.63.147.27:8001/api/v1/login/'
  } else {
    data = {
      "Username": username,
      "Password": password,
      "Email": login
    }
    url = 'http://178.63.147.27:8001/api/v1/register/'

  }


  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: url,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data
  };

  axios.request(config)
    .then((response) => {
      console.log(response.data)
      if (response.data.status == 201) {
        localStorage.setItem('token', response.data.data.token)
        localStorage.setItem('permission', response.data.data.userInfo.Permissions.Access)
        localStorage.setItem('username', response.data.data.userInfo.Username)
        setError(null)
        setIsLoading(false)
        dispatch({ type: 'LOGIN_SUCCESS' })
        history.push('/app/dashboard')

      } else if (response.data.status == 200) {
        localStorage.setItem('token', response.data.data.token)
        localStorage.setItem('permission', response.data.data.userInfo.Permissions.Access)
        localStorage.setItem('username', response.data.data.userInfo.Username)

        setError(null)
        setIsLoading(false)
        dispatch({ type: 'LOGIN_SUCCESS' })

        history.push('/app/dashboard')

      } else {
        dispatch({ type: "LOGIN_FAILURE" });
        setError(true);
        setIsLoading(false);
      }

    })
    .catch((error) => {
      dispatch({ type: "LOGIN_FAILURE" });
      setError(true);
      setIsLoading(false);
    });


}

function signOut(dispatch, history) {
  localStorage.removeItem("token");
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/login");
}
