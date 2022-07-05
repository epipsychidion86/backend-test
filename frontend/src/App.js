import React, { useEffect, useState } from "react";
import Register from "./views/Register";
import Login from "./views/Login";
import Albums from "./views/Albums";
import "./App.css";

const App = () => {
    // When the app first renders, no user is logged in
    const [ isLoggedIn, setIsLoggedIn ] = useState(false);
    const [ currentUserId, setCurrentUserId ] = useState("");
    const [ showLogin, setShowLogin ] = useState(true);
    const [ token, setToken ] = useState(false);

    useEffect(() => {
        // When <App /> first renders
        // Try to find an item in local storage with the key "data"
        const data = JSON.parse(localStorage.getItem("data"));

        // If we found an item with the key "data", log the user in again instead of rendering the "Login" view
        if (data && data.token && data.id && data.expiry) {
            // ? Check whether "now" is earlier than or later than to the "expiry" key of "data"
            // ? If now is earlier than the expiry --> we can log the user in. :-)
            // ? Else (if now is later than the expiry) --> we want to log the user out!     
            const tokenExpiry = new Date(data.expiry);
            const now = new Date();

            // Token expires in the future - log the user in!
            if (tokenExpiry > now) {
                login(data.token, data.id);
            // Token expired in the past - log the user out!
            } else {
                logout();
            }           
        } else {
            logout();
        }
    }, [])

    const login = (token, id) => {
        setToken(token);
        setCurrentUserId(id);
        setIsLoggedIn(true);
    }

    const logout = () => {
        localStorage.removeItem("data");
        setToken(false);
        setCurrentUserId("");
        setIsLoggedIn(false);
        setShowLogin(true);
    }

    const deregister = async () => {
        const settings = {
            method: "DELETE",
            // headers: {
            //     "Authorization": "Bearer " + token
            // }
            credentials: "include"
        }

        // Let's pretend the current user has an id of 1234abcd
        // The DELETE request will be sent to:
        // http://localhost:3001/users/1234abcd
        const response = await fetch(process.env.REACT_APP_SERVER_URL + `/users/${currentUserId}`, settings);
        const parsedRes = await response.json();

        try {
            if (response.ok) {
                alert(parsedRes.message);
                setIsLoggedIn(false);
                setShowLogin(true);
                setCurrentUserId("");
            } else {
                throw new Error(parsedRes.message);
            }
        } catch (err) {
            alert(err.message);
        }   
    }

    // If no user is currently logged in
    if (!isLoggedIn) {
        // Display the login view
        if (showLogin) {
            return <Login setShowLogin={setShowLogin} login={login} />
        // Display the register view
        } else {
            return <Register setShowLogin={setShowLogin} login={login} />
        }
    // Else, if a user is logged in, display the "albums" page for that user
    } else {
        return <Albums currentUserId={currentUserId} token={token} logout={logout} deregister={deregister} />
    }
}

export default App;