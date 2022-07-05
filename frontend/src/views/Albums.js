import React, { useEffect, useState } from "react";
import Logout from "../components/Logout";
import Deregister from "../components/Deregister";
import UsersData from "../components/UsersData";

const Albums = props => {
    const [firstName, setFirstName] = useState("");
    const [band, setBand] = useState("");
    const [albumTitle, setAlbumTitle] = useState("");
    const [albumYear, setAlbumYear] = useState("");
    const [albums, setAlbums] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);

    // When the <Albums /> component first renders...
    // GET relevant data about the user who logged in, and update state...
    // So the user can see their name and current list of albums immediately after they log in/register
    useEffect(() => {
        const fetchUserData = async () => {
            // Make a GET request to the "/users/:id" endpoint in our server...
            // ... and then handle the response from the server
            const settings = {
                // headers: {
                //     "Authorization": "Bearer " + props.token
                // }
                credentials: "include"
            }
            
            const response = await fetch(process.env.REACT_APP_SERVER_URL + `/users/${props.currentUserId}`, settings);

            const parsedRes = await response.json();

            try {
                // If the request was successful...
                if (response.ok) {
                    console.log("Server response", parsedRes);
                    setFirstName(parsedRes.firstName);
                    setAlbums(parsedRes.albums);
                    setIsAdmin(parsedRes.isAdmin);
                    // If the request was unsuccessful...
                } else {
                    throw new Error(parsedRes.message);
                }
            } catch (err) {
                alert(err.message);
            }
        }

        fetchUserData();
    }, [props.currentUserId])

    // Function to update the value of an input
    const updateData = event => {
        switch (event.target.name) {
            case "band":
                setBand(event.target.value);
                break;
            case "title":
                setAlbumTitle(event.target.value);
                break;
            case "year":
                setAlbumYear(event.target.value);
                break;
            default:
                break;
        }
    }

    // Function to create a new album in the current user's "albums" array in the db
    // Make a POST request to the "/users/:id/albums" endpoint in our server...
    // ... and then handle the response from the server
    const submitAlbum = async event => {
        event.preventDefault();

        const newAlbum = {
            band: band,
            albumTitle: albumTitle,
            albumYear: albumYear
        }

        const settings = {
            method: "POST",
            body: JSON.stringify(newAlbum),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + props.token
            },
            credentials: "include"
        }

        // Make a request to create the new album in the "albums" collection (if needed)...
        // And get the album's id back in the server's response
        const response = await fetch(process.env.REACT_APP_SERVER_URL + `/albums`, settings);
        const parsedRes = await response.json();

        try {
            // * Task 14 solution begins here!
            // If the first fetch request was successful...
            if (response.ok) {
                const settings = {
                    method: "PATCH",
                    body: JSON.stringify({ id: parsedRes.id }),
                    headers: {
                        "Content-Type": "application/json",
                        // "Authorization": "Bearer " + props.token
                    },
                    credentials: "include"
                }

                // Make a second fetch request to add the new album id to the user's "albums" array
                const secondResponse = await fetch(process.env.REACT_APP_SERVER_URL + `/users/${props.currentUserId}/albums`, settings);
                const secondParsedRes = await secondResponse.json();

                // If the second request was successful...
                // Update the "albums" state variable with the user's up-to-date "albums" array (containing album ids)
                // This will re-render the app, and the new array will be mapped in the JSX below
                if (secondResponse.ok) {
                    console.log("Add album server response", secondParsedRes.albums);
                    setAlbums(secondParsedRes.albums);
                    setBand("");
                    setAlbumTitle("");
                    setAlbumYear("");
                
                // If the second fetch request was unsuccessful...
                } else {
                    throw new Error(secondParsedRes.message);    
                }
            // If the first fetch request was unsuccessful...
            } else {
                throw new Error(parsedRes.message);
            }
        } catch (err) {
            alert(err.message);
        }
    }

    // Function to delete all the current user's albums from the db
    // Make a DELETE request to the "/users/:id/albums" endpoint in our server...
    // ... and then handle the response from the server
    const deleteAllAlbums = async event => {
        const settings = {
            method: "DELETE",
            // headers: {
            //     "Authorization": "Bearer " + props.token
            // }
            credentials: "include"
        }

        const response = await fetch(process.env.REACT_APP_SERVER_URL + `/users/${props.currentUserId}/albums`, settings);
        const parsedRes = await response.json();

        try {
            // If the request was successful...
            if (response.ok) {
                setAlbums(parsedRes);
                // If the request was unsuccessful...
            } else {
                throw new Error(parsedRes.message);
            }
        } catch (err) {
            alert(err.message);
        }
    }

    const deleteOneAlbum = async event => {
        const albumId = event.target.parentElement.id;

        const settings = {
            method: "DELETE",
            // headers: {
            //     "Authorization": "Bearer " + props.token
            // }
            credentials: "include"
        }

        //                             userid      albumid
        // http://localhost:3001/users/1234/albums/5678
        const response = await fetch(process.env.REACT_APP_SERVER_URL + `/users/${props.currentUserId}/albums/${albumId}`, settings);
        const parsedRes = await response.json();

        try {
            if (response.ok) {
                console.log("Delete album response:", parsedRes.albums);
                setAlbums(parsedRes.albums);
            } else {
                throw new Error(parsedRes.message);
            }
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <div>
            <h2 id="greeting">Welcome {firstName}!</h2>
            <Logout logout={props.logout} />
            <Deregister deregister={props.deregister} />
            { isAdmin && <UsersData currentUserId={props.currentUserId} token={props.token}/> }
            <h1>Add an Album to the Collection!</h1>

            <form onSubmit={submitAlbum}>
                <div>
                    <label>Band</label>
                    <input name="band" onChange={updateData} value={band} />
                </div>
                <div>
                    <label>Title</label>
                    <input name="title" onChange={updateData} value={albumTitle} />
                </div>
                <div>
                    <label>Year</label>
                    <input name="year" onChange={updateData} value={albumYear} />
                </div>
                <button>Submit Album</button>
            </form>
            <button onClick={deleteAllAlbums}>Delete all albums!</button>

            <div>
                <h2>Current Albums</h2>
                <ul>
                    {
                        albums.map(album => {
                            return <li key={album._id} id={album._id}>{album.albumTitle} by {album.band} ({album.albumYear})
                            <span onClick={deleteOneAlbum}>X</span>
                            </li>
                        })
                    }
                </ul>
            </div>
        </div>
    )
}

export default Albums;