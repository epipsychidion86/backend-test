import createError from "http-errors";
import jwt from "jsonwebtoken";

const authorizeUser = (req, res, next) => {
    // Here we want to check whether, as part of the request, the user provided a VALID token
    // If they did, call next() to allow the request to go forward to the next middleware
    // If they did not, immediately send a 403 error response back to the frontend
    // ... So they will not be able to access the protected route

    let token;

   //console.log("authorization header", req.headers.authorization);

    try {
        // When we get the "authorization" header, its value will be: "Bearer [long token]"
        // token = req.headers.authorization.split(" ")[1];  // split string index 0 = "Bearer", split string index 1 = token
    
        console.log("Cookie", req.cookies.dataCookie);

        // Try to find the token inside the "dataCookie" cookie
        token = req.cookies.dataCookie;

        if (!token) {
           throw new Error("User unauthorized"); 
        }

        // Next step: if we got a token from the header, try to VERIFY it - is it a real, valid token?
        // jwt.verify --> 2 arguments:
        //  1. the token we want to decode
        //  2. the secret key known only by your server
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

        console.log("Decoded token", decodedToken);

        // If the token is valid, go on to the next middleware
        next();
    } catch {
        next(createError(403, "User could not be authorized. Please try again"));
    }
}

export default authorizeUser;