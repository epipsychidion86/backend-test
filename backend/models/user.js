import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

/*
* Some common schema types:
- String
- Number
- Array
- Boolean
- Buffer
- Mixed
- ObjectId (24 characters)

... But not Object! Don't try to write "type: Object"
*/

const userSchema = new Schema({
    // Make sure each username in the collection is unique
    // Cause an error if a user tries to register with a username which has already been taken
    //                                          ^
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: String,  // firstName is no longer required
    lastName: String,   // lastName is no longer required
    emailAddress: { type: String, required: true, unique: true },
    isAdmin: { type: Boolean, required: true },
    // * The "ref" attribute allows us to create a connection between the User model and the Album model
    // "These ObjectIds are all references to Album documents"
    // Now we can use this reference to help us with "populating" each item in the array...
    albums: [ { type: mongoose.Types.ObjectId, required: true, ref: "Album" } ]
// Timestamps option
// Adds "createdAt" and "updatedAt" properties to each user document
}, { timestamps: true });

// Use a pre-save hook to do something BEFORE trying to save a new "user" document
// "If the user hasn't been given a first name, give them a *default* value BEFORE trying to save the new document"
userSchema.pre("save", async function(next) {
    if (!this.firstName) {
        this.firstName = "John";
    }

    if (!this.lastName) {
        this.lastName = "Doe";
    }
    //                                       original       salting rounds
    const securePassword = await bcrypt.hash(this.password, 12);

    this.password = securePassword;

    next();
})

const User = mongoose.model("User", userSchema);

export default User;