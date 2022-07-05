import React, { useState } from "react";

const Login = props => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Function to update the value of an input
  const updateData = event => {
    switch (event.target.name) {
      case "username":
        setUsername(event.target.value);
        break;
      case "password":
        setPassword(event.target.value);
        break;
      default:
        break;
    }
  }

  // Function to attempt to log the current user in
  const attemptLogin = async event => {
    event.preventDefault();

    const loginData = {
      username: username,
      password: password
    }

    const settings = {
      method: "POST",
      body: JSON.stringify(loginData),
      headers: {
        "Content-Type": "application/json"
      },
      // "credentials" - controls what the browser does with cookies
      // "include" - means cookies will be included with requests
      credentials: "include"
    }

    // * New Task 25 functionality:
    // 1. In Login.js, send request to login to the BACKEND
    // 2. In the BACKEND, if username/password are correct...
    //  - generate a JWT
    //  - send the JWT back to the frontend in the response
    // 3. Back in Login.js, take the token and store it in the "token" state variable of App.js
    // 4. Log the user in so they can see the <Albums /> view.


    // Make a POST request to the "/login" endpoint in our server...
    // ... and then handle the response from the server
    // ? If we're in the local environment, the request goes to: "http://localhost:3001/login"
    // ? If we're in the production environment, the request goes to "https://herokuapp..../login"
    const response = await fetch(process.env.REACT_APP_SERVER_URL + "/login", settings);
    const parsedRes = await response.json();

    try {
      // If the request was successful
      if (response.ok) {
        // * Task 30
        // ! Don't store the token in local storage any more!
        // ! The token will now live in a cookie received from the backend

        // const now = new Date();
        // const tokenExpiry = new Date(now.getTime() + 1000 * 60 * 60); // 1000ms * 60 * 60 = 1hr

        // Before logging the user in, add an item to local storage (key = "data")
        // localStorage.setItem("data", JSON.stringify({ token: parsedRes.token, id: parsedRes.id, expiry: tokenExpiry.toISOString() }));
        
        props.login(parsedRes.token, parsedRes.id);
      // If the request was unsuccessful
      } else {
        throw new Error(parsedRes.message);
      }
    } catch (err) {
      alert(err.message)
      setUsername("");
      setPassword("");
    }
  }

  // Function to update the "showLogin" state variable in App.js
  const updateShowLogin = () => {
    props.setShowLogin(false);
  }

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={attemptLogin}>
        <div>
          <label>Username</label>
          <input name="username" onChange={updateData} value={username} />
        </div>
        <div>
          <label>Password</label>
          <input name="password" onChange={updateData} value={password} />
        </div>

        <button>Sign In</button>
      </form>

      <button onClick={updateShowLogin}>Not registered yet? Register for an account!</button>
    </div>
  )
}

export default Login;