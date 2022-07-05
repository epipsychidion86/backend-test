import Album from "../models/album.js";
import createError from "http-errors";

export const albumsPost = async (req, res, next) => {
    // This will help you get started with checking if the same album already exists in the user's "albums" array.
    let existingAlbum;

    // Remember: req.body = the album object the user tried to create in the browser.
    // Example req.body = { band: "Black Sabbath", albumTitle: "KFE", albumYear: 2022 }

    // ? Question 1: Does the album the user just tried to add already exist in the "albums" collection?
    try {
        existingAlbum = await Album.findOne(req.body);
    } catch {
        return next(createError(500, "Query didn't succeed. Please try again"));
    }

    // ? Question 2: Did we find an existing album with the same details in the "albums" collection?
    // If yes, simply send back the id of the existing album in the server's response
    if (existingAlbum) {
        res.json({ id: existingAlbum._id });
    // If no, create a new album document, save it in the "albums" collection, and send back its id in the server's response
    } else {
        let newAlbum;
        
        try {
            // Create a new album document using the "Album" model
            newAlbum = new Album(req.body);
            // Save the new album document in the "albums" collection
            await newAlbum.save();
        } catch {
            return next(createError(500, "Album couldn't be created. Please try again"));
        }
        
        res.json({ id: newAlbum._id });
    }
}