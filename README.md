# Task 30 - Part 2

We have now changed our authorization middleware. Now the request from the frontend must contain a valid token inside a **cookie** to go to the next middleware.

So far we updated the our logic in the **frontend** to send the cookie in the request when:
    - Getting the user's relevant data
    - Adding new album
    - Adding the `id` of the new album to the user's list of albums in the database

- Make sure the rest of your functionality also works:
    - Deleting one album
    - Deleting all albums
    - Deleting the user

- Also make sure an **admin** can still click the new button to find the count of users. **Hint**: You will also need to change the `isAdmin` authorization middleware to use cookies, as well as the frontend GET request. :-)

---

# Task 30 - Part 1

When the user **logs in**, they now receive a cookie from the backend containing a token.

- Make it so that the user also receive a token when they **register**
- You will have to make a couple of small changes to `Register.js` (**frontend**) and `registerController.js` (**backend**)
- If you have forgotten anything, you can check out how we did it when the user logs in. :-)
- **Note:** When testing, make sure to delete any cookie already in your browser before you register as a new user!

---

# Task 29 - Part 2

## Step 3: Finally, let's give admins a special ability that normal users don't have!

**Goal:** Allow admins to click the `<UserData />` button and get a count of the number of users in the `users` collection. :-)

## Instructions:

8. You should create a new GET "/admin/:id/count" endpoint in your backend. 
    - **Note:** This will involve creating a new `admin` router in your `routes` directory.

9. The controller function for the new endpoint should simply send a `response` containing the number of users currently in the `users` collection.
    - You can research a **Mongoose method** you can use with your `User` model to find the number of documents in the `users` collection.
    - Also make sure the method you find is up to date, and not **deprecated** (i.e. old and no longer supported!)

10. In the **frontend**, when the admin clicks their `<UserData />` button, it should send a `fetch` request to the new endpoint.

- You should include the user's token with your request as usual.

- If you receive a successful response, an `alert` should be displayed in the browser with the content: "Current number of users: x" (where "x" is the number of documents in the `users` collection).

## Bonus - only do this if you finish early!

11. Finally, create a new authorization middleware called `checkIsAdmin`.
        - This should contain most of the same logic as the `authorizeUser` middleware - first, check if a token exists in the `request`, and if so, check if it is valid.
        - However, after this, you should **also** use the validated token (**remember:** this contains the user's `id`), to query the `users` collection and find the user's document. 
        - If this succeeds, you should check if the user is an admin or not (what part of the user document could help with this?)
        - If the user is **not** an admin, pass an error on to the error handling middleware. Otherwise, call `next()`.
        - You should also register the new authorization middleware in your new router, **before** the new endpoint you made in Part 8. This will ensure we check if the user is an admin **before** we pass the `request` on to the controller function.

---

# Task 29 - Part 1

Let's take the opportunity, before we finish the Backend module, to practice some of the topics we have covered in recent weeks.

Our **goals** are to:

- Add an option to give some users an "admin" status (this afternoon)
- Render a different UI for admins vs. normal users (this afternoon)
- Give admins a special ability that normal users don't have (tomorrow)

## Step 1: Let's update the "User" schema to give all users an "isAdmin" key...

**In your backend...**

1. Add a new key to the `User` model's **schema** called `isAdmin`. This is a `required` key, and should be a `boolean` value (true/false).

2. In `controllers/registerController.js` (called whenever a new user registers), you should add the `isAdmin` key to the new document before it is saved, and give it a value of `false` (by default we want users to **not** have the "admin" status).

---

## Step 2: Now let's render a different UI for admins, compared to normal users...

**Starting in your frontend...**

3. When `Albums.js` **first** renders, there is a **`useEffect`** which makes a `GET` request. This `GET` request should return the logged-in user's data (their `firstName`, and `albums` array).
    - Create a new state variable in `Albums.js` called `isAdmin`. Its default value should be `false`.
    - Make changes in `Albums.js` **and** your backend so that:
        - The server's `response` to the `GET` request also includes the value of the logged-in user's `isAdmin` key (`true` or `false`).
        - The new `isAdmin` state variable in `Albums.js` is updated using the new value received in the server's `response`.

4. Next, in your **frontend** directory, make a new component called `UsersData`. This will render a `<button>` with the content `View Users Data`.

5. Now, in `Albums,js`, try to **conditionally render** the new button next to the `<Deregister />` button:
    - If the user is an admin, they should be able to see the button
    - If the user is not an admin they should not be able to see the button
    - A quick and elegant solution to conditionally render a React component is the logical "&&" operator - more details can be found in the React docs: https://reactjs.org/docs/conditional-rendering.html#inline-if-with-logical--operator

6. Add some quick extra functionality to the button - if the user clicks it, you should display an `alert` with the content "I am an admin!" (we will change this to something better tomorrow :-p)

7. Now register a new user. When you are done, go to their document in the `users` collection (using Atlas in the browser or the MongoDB shell) and **change** their `isAdmin` value to `true`. They are now an admin!
    - Now log in as this user. You should be able to see the `<UsersData />` button.
        - If you click the button, you should see the `alert()` you created in Part 6.
    - Log in as a different user, who isn't an admin. You should not be able to see the `<UsersData />` button.
    - Make sure to fix any bugs if something isn't working correctly. :-)

---

# Task 28

As we just saw, our token expiry works when we want to access a protected route (e.g. create a new album), but we still remain logged into the app, even if our token has expired.

Let's make it so that, if the user **refreshes** the page after their token expires, they are logged out automatically.

1. I just live coded how to give the `data` item in local storage an **"expiry"** key after a user **registers** for the first time. Update your code so that you also add this key when the user **logs in**.

2. Now, whenever the user refreshes the app (i.e. in the `useEffect` made when `<App />` is **rendered** for the first time), we currently check **`if`** (1) the `data` item exists in local storage, (2) it has a `token` key and (3) it has an `id` key.
    - We need to add some more logic to this `if` statement, to check if (4) the `data` item also has an "expiry" key.
    - If all 4 checks are true, we can go into the `if` statement and create **2** new variables.
    - The first new variable should be called `tokenExpiry`. Initialize it by parsing the value of the **token's** "expiry" key as a `new Date()` object.
    - The second new variable should be called `now`, and be initialized like this:

    ```js
    const now = new Date();
    ```

    - This `now` variable will represent the exact date and time that it was created.
    - Finally, you will need to make a **new** `if-else` statement **inside** the original `if` statement, to compare your two new variables - is the token's expiry earlier or later than now?
        - You may wish to research how to compare two **dates** using logical operators, to find if one is earlier or later than another!
        - If the token's expiry is in the future, you should log the user in. **Note:** Make sure this is now the only time you call `login()` in your `useEffect`).
        - If the token's expiry is in the past, you will go to the new `else` statement - here make sure the user is logged out. **Note:** your `useEffect` should now have **2** `logout()` calls - one in each `else` statement.
    - Now you can test your code again to see if your changes have worked:
        - If you refresh the app and the token has not expired, the use should be automatically logged in as usual.
        - If your refresh the app and the token **has** expired, the user should now automatically be logged out!
        - Feel free to check out the gifs I will post in the `exercises` Slack channel to see how things should work. 
        - If you find any bugs, make sure to fix them before continuing. :-) 

## Bonus - only if you finish early!

3. We can also improve our code in another way. Currently our server's secret key (used when creating and validating tokens) is **visible** in our code! Let's keep it secret by making a new environment variable called `SECRET_KEY`.
    - Whenever you need to use the secret key, you should use the environment variable.
    - **Hint:** So far the secret key is used when the user:
        - Registers (to create their token)
        - Logs in (to create their token)
        - Tries to access a protected route (in the authorization middleware, to validate their token).

---

# Task 27

We have implemented the ability to store our token in **local storage**, so that our browser can remember that we have been issued a token. We can then use the token to stay logged in, even if we refresh the browser.

However, we just saw a **problem** - when we click the "Log out" button, the token **remains** in local storage. That means if we refresh the page after logging out, we are simply logged in again!

You can fix this by **removing** the item from local storage which contains your token when you log out of the app. This way the token is also removed, and you only get another one when you successfully log in.

1. Research how to remove an item from local storage. Then update your code so that when a user logs out, the item in local storage containing the user's token is removed. This will mean a user who logs out, stays logged out!

2. Now let's fix another problem - currently a user only gets a "data" item in local storage (containing their token and id) after they  **log in**. When a user registers for the first time, they **do not** get this item in local storage.
    - You can test this in your own code by registering as a new user. Then check your local storage - there will be no "data" item!
    - Then try to log in as an existing user and check your local storage. Now you should have a "data" item.
    - Find the logic from last week in `views/Login.js` (frontend) which adds the item to local storage before the user is logged in. Then update `views/Register.js` so that the same thing happens after the user has registered, and before they are logged in.
    - You can test if your changes have worked by creating another new user. Do you get a "data" item in local storage after registering? 

---

# Task 26

Yesterday, we **protected** the `/albums` route, so only **authenticated** users (those who include a valid token in their request) can access its endpoint successfully.

Now we need to also protect the `/users` route, and its endpoints:

    - GET /users/:id
    - PATCH /users/:id/albums
    - DELETE users/:id/albums
    - DELETE users/:id/albums/:albumId
    - DELETE users/:id

- Try to achieve this. You can also check out your changes from yesterday to see how you did this for the POST /albums endpoint:
    - When the user sends a request to a protected route, their token is included in the request (do you remember how to do this?)
    - In the backend, you can then use authorization middleware to check he validity of the token, so only users who sent a **valid** token can access the route.

- If you succeed, a user who just registered for, or logged into, the app will be able to:

    - See the `Albums` view ("Welcome User!")
    - Add albums
    - Delete one album
    - Delete all their albums
    - Delete their account

- But requests sent to all the above endpoints without a token using **Postman** will **fail** (get a 403 reponse with a "User could not be authorized" message). :-)

---

# Task 25

- Let's revise what we did yesterday by trying adding the following functionality when the user successfully **logs in**: 
    - send a token from the backend to the frontend
    - store it in the `token` state variable in `App.js`.

Don't forget you can check out `controllers/registerController.js` (**backend**) and `views/Register.js` (**frontend**) to check how you did this yesterday.

If your changes are successful, you should also log a token in the browser console after you **log in**, not just after you register. :-)

## Bonus - only if you finish early!

- In your **frontend**, check out what happens after a successful server response when the user has tried to:
    - register
    - login

- Note that in both cases we are going through the **same** steps to log the user into the app. As we want to keep our code DRY, and not repeat ourselves, we can refactor our code a little:
    - Create a function called `login` in `App.js`. This will take two parameters (`token` and `id`), and should contain the same logic to log the user in.
    - You can now pass the new `login` function down to both the `Register` and `Login` components via a prop, and simply call it (passing the correct values as arguments) when you want to log the user into the app.
    - You can now also remove the `setIsLoggedIn`, `setCurrentUserId` and `setToken` props from the `<Register />` and `<Login />` instances in `App.js`, as these props are now no longer needed. :-)

---

# Task 24

We have created our first **JSON Web Token** (JWT) in the backend and sent it to the frontend after **registering** a new user.

Now let's see if we can receive the token in our SPA, and store it in the app's **state**.

**Instructions:**

1. Create a new state variable in `App.js` called `token` (using `useState`). Its default value should be `false`.

2. Pass the `setToken` "setter" function for the new state variable down to the child `Register` component using a prop.

3. Pass the `token` state variable down to the child `Albums` component using a prop.

4. In the `Register` component, when you get back a successful ("ok") `response` from the server after creating a new user... 
    - You should use your new prop to set the value of the `token` state variable in `App.js` to the token received from your backend. 
    - This should be the first thing you do after confirming that the request was successful.

5. Finally, prove you now have the value of your token stored in your app's `state` by creating a `useEffect` in the `Albums` component.
    - This will be for testing purposes only - we will delete it later today!
    - The `useEffect` should run only once, when the `Albums` component first renders.
    - The `useEffect` should log the value of the `token` state variable (in the parent `App` component) to the browser console. 
        - Did you do something earlier that will let you find the value of this state variable in the `Albums` component?

6. Now test your new functionality by creating a new user. If everything is working, you should log a long string to the browser console - this is your token, received from the backend after registration and stored in your app's `state`. :-)

---

# Task 23

Let's update the logic for when a user tries to log in, by comparing the password they entered in the browser with their **hashed** password in the database. :-)

- You should change the logic in `controllers/loginController.js` to get the following functionality: 
    - **Remember:** you can use your `User` model to query the `users` collection in your MongoDB database...
    - If the user has given an **incorrect** username, send a 404 error `response` to the frontend with the message: "No user exists with this username". 
        - The message should then be automatically displayed in an `alert` in the user's browser.
    - If the user has given a **correct** username but an **incorrect** password, send a 401 error `response` to the frontend with the message: "Incorrect password. Please try again".
        - The message should then be automatically displayed in an `alert` in the user's browser.
    - If the user has given a **correct** username and password, log them in as usual.
    - **Note:** For security reasons, I would not usually recommend telling the user exactly what they did wrong if their attempt to log in does not succeed. However, we will do it this way to help your learning. :-)

- When you are done, make sure to test your new functionality and fix any bugs you find. :-)

## Bonus - only if you finish early!

- You can also add some extra logic to `controllers/registerController.js`, to give the user some more helpful error messages if they have a problem registering as a new user...
    - Again, your `User` model should be helpful here. :-)
    - If the username has already been taken, send a 409 error respose to the frontend with a relevant message.
    - If the email address has already been taken, send a 401 error respose to the frontend with a relevant message.

- When you are done, make sure to test your new functionality and fix any bugs you find. :-)

---

# Task 22

Let's start using `bcrypt` so that we can start storing hashed passwords in the database, instead of unsecure, plain text passwords.

- First, you should install `bcryptjs` if you haven't already.

- Next, please delete all existing documents from your MongoDB `users` collection.

- You should now try to update the pre-save hook in your `User` model.
    - When a new user registers for your app, you should create a secure (hashed) password using `bcrypt` and make that the value of the `password` property instead of the original, plain text password.

- When you are done, try to register a new user and make sure their password in the database has been successfully hashed.

---

# Task 21

Now let's **sanitize** our data. :-)

Along with your existing validation, you should research the correct `express-validation` **sanitizers** to make sure:

- In `validators/registerValidator.js`, 
    - the `username`, `password`, `firstName` and `lastName` fields: 
        - do not contain any HTML
        - contain no **whitespace** at the beginning or end (e.g. " ozzy " has whitespace at both the beginning and end, so should be converted to "ozzy")
    - the `emailAddress` field is **normalized**, e.g. all characters in the email address should be converted to lowercase

- In `validators/albumValidator.js`, make sure:
    - the "album" and "artist" fields contain no whitespace at the start/end and do not contain any HTML

- When you are done, try to create a new user and a new album, and make sure all of your sanitization is working. :-)

---

# Task 20

- Let's now create a custom check, in `validators/albumValidator.js`:
    - This should check if the "albumYear" field has a value between 1900 and the current year.
    - The current year should be flexible - e.g., in ten years the current year should be 2032 (without you needing to rewrite any code...)
    - **Hint:** JavaScript's native `Date()` object may be able to help you with this (feel free to research how!)
    - If you finish early, feel free to think of and implement your own custom check somewhere else in your validation logic. :-)

---

# Task 19

As you saw in the earlier version of `requiredValues` (just for the POST /register route), you can `return` an array from a validation middleware containing as many `check`s as you need:

```js
// Old logic for requiredValues - just for the POST /register route
return [
        // Array item 1
        check("username")
        .notEmpty()
        .withMessage("Username empty"),
        // Array item 2
        check("password")
        .notEmpty()
        .withMessage("Password empty"),
        // Array item 3
        check("emailAddress")
        .notEmpty()
        .withMessage("Email address empty")
    ]
```

So far we have only used `express-validator`'s `notEmpty()` method, to `check` if any of the fields in `req.body` are empty. However, `express-validator` has lots of methods, to validate fields in different ways so you don't have to write the logic yourself.

- Create **2** new validation middlewares in the `validators` directory. Each middleware will contain validation for just **one** of your routes:
    - `registerValidator` (for the POST /register route)
    - `albumValidator` (for the POST /album route)

- The new middlewares should `check` requests in the following ways. You will need to research the `express-validator` methods which will help you with each `check`!

    - **`albumValidator`**
        - `albumTitle` should be a minimum 2 characters
        - `band` should be a minimum 2 characters
        - `albumYear` should be a number

    - **`registerValidator`**
        - `username` should be a minimum 6 characters and a maximum of 15 characters
        - `password` should be a strong password. **Note:** when you find the correct validator, the default for a strong password is:
            - Minimum 8 characters
            - Minimum 1 lowercase character
            - Minimum 1 uppercase character
            - Minimum 1 symbol (e.g. @, !, # etc)
            - **Bonus:** If you have time at the end, see if you can research how to set your own definition of a strong password!
        - `emailAddress` should be in a valid email format (i.e. `something@something.something`)

- When you have created the 2 new middlewares, you should add each of them to the correct **route**, after `requiredValues()` and before the `checkValidation` middleware.
    - You do not need to pass an argument to your new middlewares (unlike with `requiredValues`), as you have defined which fields to check inside the middlewares.

- Finally, you should try in the browser to (1) register a new user and (2) create a new album. Make sure all your new validation is working!

- If you have some time at the end, remember the **bonus** step in the `registerValidator` password validation. :-)

---

# Task 18

Now let's start using `express-validator` to help us with validating data received from the frontend.

- First, you should refactor your code in `validators/requiredValues.js` so that it can be used for **all** your routes, not just the "register" route.
    - **Remember**: You did this on Wednesday by passing an array to `requiredValues` when adding it to each route. The array contains all the properties of `req.body` to be checked (to make sure it is not empty).
    - In `validators/requiredValues.js` you can then use a `forEach` loop to `check` each property in the array.
    - **Note:** This time, `requiredValues` does not need access to `req`, `res` or `next`. It only needs to `return` an **array** of `check`s. 
    - **Remember**: Apart from POST /register, the other routes which need validation are
        - POST /login
        - POST /albums
        - PATCH /:id/albums

- Next, you will need to check the **result** of your validation for each route. Only requests with **no** validation errors should be passed to the controller function for that route.
    - You should therefore make sure the `validators/checkValidation.js` middleware we coded together is called in each of your validated routes **after** that route's validation middleware and **before** its controller function.

- Finally, you should test all 4 of your validated routes, to make sure your validation is working. 
    - No request should succeed where a required field in the request `body` is empty.

- **Bonus** - If you have time, try to format the error message so it looks better (e.g. make the first character uppercase).

---

# Task 17

Implement the "requiredValues" validator function in **all** routes where data is included in the request `body`:
 - POST /login
 - POST /albums
 - PATCH /:id/albums

**Remember:** The user will send different data for you to check, depending on what they are doing (e.g. logging in, or creating an album, or updating the user)!

You can test the `POST` routes in the browser - you should see an alert if any of the fields are empty when the user submits the form
You can test the `PATCH` route in Postman - you should see a 401 error and relevant message when the `id` field of the request `body` is empty.
    - In Postman, you will need to give a real user `id` in the request URL
    - In the `body` of the request, you can set the `id` property as an empty string to test your validator function.

**Bonus** - If you have time, try to format the error message so it looks better (e.g. make the first character uppercase).

---

# Task 16

Update your **"requiredValues"** validation middleware to send back an **error response** to the frontend if any of the required fields are missing from the request `body` when the user tries to register.

The status code of your error should be 401 ("Unauthorized"), and it should contain a message about which field was missing (e.g. "username is required").

If this is working, your registration form should work like the GIF I will post in the "exercises" Slack channel (after this Task).

When you are done, make sure to test your new functionality to make sure it works for all fields.

---

# Task 15

We are quite close to getting our app working fully again after the recent changes to our data structure.

Using everything you have learned over recent weeks, try to change your code to get the following functionality working again:

1. Render the user's list of albums (including title, band and year, **not** id) in the browser, immediately after logging in.
2. Render the user's list of albums (including title, band and year, **not** id) in the browser, after adding a new album (including the new album!)
3. Click an "X" span next to each album in the list to delete it from the user document (in the "users" collection).
    - This should also re-render the list of albums in the browser, minus the deleted album!

The following concepts/techniques will help you:

- The request-response cycle
- Routes and controller functions
- Request params
- The request body
- Refs and population
- Models and Mongoose methods
- Try-catch and error handling with `http-errors`

When you are done, you should register a new user, and try to test **all** the different features of your app. Fix any bugs you find.

Good luck, and have fun. :-)

---

# Task 14

Now let's update the **frontend** to work with your changes to the backend from Task 13.

1. To start with, please **delete** all the documents from your "users" and "albums" collections (using Atlas in the browser or the Mongo shell). This will give us a fresh start with our new data structure. :-) 

Now take a look at `/views/Albums.js` in your **frontend**. 
    - Right now, when the user adds an album, the `submitAlbum` function is called.
    - As part of this function a `fetch` `POST` request is sent to the server, to add the new album to the "albums" collection (if it doesn't exist there already!). 
        - If this request is successful ("ok"), the response from the server will contain the `id` of the album the user added (whether it was created or already existed in the collection).
    - Next we will want to add some extra functionality if the request succeeds... 
        - The **new goal** (starting in Step 2!) will be to make a second `fetch` request, to also add the new album's `id` to the user's `albums` array...

2. To start this change, go to `views/Albums.js` in your **frontend** repo and find the `fetch` request in the `submitAlbum` function, made when the user adds a new album. 
    - If that request **succeeds**, you should delete the current `alert` and replace it with a **second** `fetch` request, to the `/users/:id/albums` route you created in Task 13.
        - This second `fetch` request should be a `PATCH` request to your new route. A `PATCH` request means you want to update part of an existing document, and can be created in the same way as a `POST` request 
        - In the `body` of your `PATCH` request, you should include the `id` received from the **first** `fetch` request (in the parsed server response).
        - The server's `response` to your **second** `fetch` request can be stored in a variable called `secondResponse`.

3. Continuing your changes from Step 2: 
    - if the **second** fetch request **succeeds**, you will receive back from the server an array containing the `id`s of all albums the user has added (including the latest one). 
        - You should update the `albums` state variable with this array. 
        - In your JSX, you should also `map` the `albums` state variable to render a JSX list of the user's album `id`s.
        - See the **"success example"** GIF in the `exercises` channel to see how this should look in the browser.
        - (Don't worry - tomorrow we will go back to rendering each album's full details, not just its `id`!)
        - Finally, you should reset the input state variables (this logic was originally part of the first `fetch` request)
    - If the **second** request **does not succeed**, throw an error in the usual way and let the existing `catch` block handle it.
        - See the **"failure example"** GIF for an example of a failed request - in this case, if the user tries to add an album already in their collection.
    - If you have any bugs, one tip is to check what the backend is sending in its response, compared to what you are trying to use in your frontend logic after receiving and parsing that response...

---

# Task 13

Let's start the day by changing our code to work with the new data structure - when a user creates an album:

- If it's the first time anyone has added the album, a new `Album` document is created in the `albums` collection.
- Whether it's the first time or not, the user gets a reference to the `Album` document (its `_id`) in their `albums` array.

1. Find the controller function for when a user adds a new album. This is already working, but you should add some extra logic: 
    - If the album received in the request body **already exists** in the albums collection, there is no need to create it again. Simply send back the id of the **existing** album in the server's `response`.
    - Can you think of a good Mongoose method to use to find whether the same album already exists in the "albums" collection?
    - Don't forget to also include error handling!

2. Next, go to the `postAlbum` controller function (in `usersController.js`). Note that this is not needed any more, as creating an album is now handled by the `albumsPost` controller function (in `albumsController.js`). 
    - Delete (1) the `postAlbum` controller function, and (2) its route in the `users` router!

3. Now create a **new** controller function in `usersController.js` called `updateAlbums`. This function will (1) receive the `id` of an album in the request body, (2) add that `id` to the current user's `albums` array, and (3) send back the updated `albums` array in the server response.
    - Before changing the user's document, you should check whether the `id` received in the request body is already in the user document's `albums` array. 
        - If so, you should send back an error to the frontend with status code 409 ("Conflict") and a message clarifying that the album already exists in the user's list of albums.
        - **Important:** remember, the `id` received in the request body will be a **string**, but any `_id` found by a Mongoose method will be an **`ObjectId`** - a type of object! So be careful when comparing them to see if they are (loosly, not strictly) the same!
    - Don't forget to add error handling!
    - Finally, create a new route in your `users` router. This should handle `PATCH` requests to the URL `http://localhost:3001/users/:id/albums`, and forward any requests received to your new `updateUser` controller function.

4. When you are done, you can use **Postman** to check your changed routes if you have time. After lunch, we will next update the frontend!

---

# Task 12

Now, let's see if we can start inserting `Album` documents into the new `albums` collection. :-)

1. **For now**, this will mean we can no longer display a user's list of albums in the browser. So first, you should go to /`views/Albums.js` in your **frontend** directory, and comment out (not delete!) the `albums.map()` call in your JSX code.
    - Next week, we can talk more about creating a relationship between the `users` collection and the `albums` collection, so we can start displaying the user's albums in the browser again. :-)

2. Next, in your **backend** directory, you should create a new router in your `routes` directory called `albums.js` and export it. You do not need to define any routes yet.
    - You should `import` and register the router in `index.js`. Any request going to the `/albums` path should be redirected to this router.
    - Don't forget that you can look at your `users` router in case you want to check how you did this before!

3. In your new `albums` router, you should create a new `POST` route, which will receive requests to the `/` path. Do not yet assign a controller function to it...

4. Next, create a new file in your `controllers` directory called `albumsController.js`. In this, you should create and `export` a new controller function called `albumsPost`.

5. When the `albumsPost` controller function receives a request, the request `body` should contain the `albumTitle`, `albumYear` and `band` for the new album the logged-in user wants to create. 
    - In the `albumsPost` controller function, declare a variable called `newAlbum`, and initialize it using the request `body`. 
    - Next, import your new `Album` model, and use it to `save` a new document in the `albums` collection of your MongoDB database. Don't forget to add error handling using `http-errors`!
    - When this is done, you should send a response containing the `_id` of the album document you just created.

6. Finally, you should `import` your `albumsPost` controller function into the `albums` router you created in Step 2, and assign it to the route you created in Step 3.

7. Now, in your **frontend** directory, go to `/views/Albums.js`. When you click the button to create an album, you can keep the same logic to define your `POST` request, but now the request should be sent to `http://localhost:3001/albums` instead of the current URL.
    - When you receive back the response from the server: 
        - If the request was **successful** ("ok"), you should **comment out** the `setAlbums` function call (as we are no longer receiving an array of albums in the response). 
        - Instead, you should create an `alert` with the content: "New album created with id: [id_of_album]". You can use the parsed server response to show the new album's real id in place of the square brackets!
        - If the request was **unsuccessful**, you can handle this in the usual way.

8. Finally, you should log in and try to create an album:
    - Did you get the `alert` you expected?
    - If so, check the `albums` collection in your database. Is the album there?
    - If anything isn't working as expected, try to find and fix any bugs and then try again.

---

# Task 11

Let's start bringing relationships between collections into our backend logic! 

First, we will need to create a new `Album` model, so that when a user creates a new album document, it can be inserted into a collection called `albums`.

1. Create a new file in your backend `models` directory called `album.js`. Inside this you should create a new `Album` model.
    - You can check out your `User` model in case you want to remember all the steps to create a Mongoose model.
    - The new `Album` model should link to a new **collection** in your MongoDB database called `albums`.
    - **Remember:** each album document should have **three** properties: `band` (String), `albumTitle` (String) and `albumYear` (Number). All are required.
    - You do not need to add any pre-save hooks or timestamps to your new `Album` schema. :-)
2. See if you can add extra **validators** to the `albumYear` property, so that an album's year cannot be less than 1900 or greater than 2022.
    - Researching Mongoose's "built in" validators for numbers will help you with setting minimum and maximum values!

---

# Task 10

Let's practice updating our "User" schema...

1. Make both the `username` and `emailAddress` address unique.   
    - Once you have done this, you can go to the `registerPost` controller function (in `/controllers/registerController.js`), and remove the functionality to check whether a username has already been taken. The schema can handle this now.
    - Test your changes by trying to create two users with the same username. Also try to create two users with the same email address. In both cases, you should no longer be able to create the second user.
    - In both cases, it is ok to send the same error message to the frontend, e.g. "User could not be created. Please try again". Soon, we will look at how to identify the specific cause of an error. :-)

2. Use a pre-save hook to give some default values to your "User" documents.
    - If no first name is provided during registration, the default should be "John"
    - If no last name is provided during registration, the default should be "Doe"
    - Again, you should test your changes and make sure you get the expected result.

3. Make it so that each of your documents has `createdAt` and `updatedAt` properties.
    - To test this, you can create a new user, give them a new album and delete that album. After each of these steps, check the document in your database and make sure the "createdAt" and "updatedAt" properties look the way you would expect.

---

# Task 9


Lets finally explore how we can use Mongoose to **delete** a document from your collection!
## Part 1: Frontend

- Create a new component called `Deregister`. This should render a simple button with a `className` of `logout-btn`. Don't forget to export the new component. 
- Import your new component into `/views/Albums.js` and render it to the right of the `<Logout />` component.
- Now, in **App.js**, create a new function called `deregister`. When called, this should:
    - Use `fetch` to send a HTTP DELETE request (using `async await` syntax) to `http://localhost:3001/users/[id_of_current_user]` (you will have to replace the part in square brackets yourself!).
    - For now you can just define the fetch request and put the server's response into a variable called `response`. We will deal with the actual server response later!
    - When you are done, you should pass a reference to your function down, using **props**, to the grandchild `Deregister` component. When you click the button rendered by `<Deregister />`, you should call the `deregister` function in `App.js`.
    
## Part 2: Backend

- Now, in the backend, we need to create a route to handle the request you just defined.
- Create the route in `routes/users.js`. Hint: keep an eye on the HTTP method you used in the request!
- Create a controller function called `deleteUser` in `/controllers/usersController.js`. Make sure this is called whenever a request is received by your new route.
- In your `deleteUser` controller function, use the new Mongoose method **`findByIdAndRemove`**. This takes just one argument - the **id** of the document to delete from the collection. It will then find that document and delete it!
    - Can you remember how to get the id of the user who sent the request from the request object?
- In case something goes wrong with your query, make sure to also add error handling using `http-errors`.
- Finally, if the query succeeds, send back a response to the frontend. The response should contain a JSON object with the following structure

```json
{ message: "Your account has been successfully deleted. Come back soon!" }
```

## Part 3: Frontend

- Back in the `deregister` function in `App.js`, we now need to handle the server's response to your `fetch` request.
- If the response shows the request was **successful** ("ok"), display an alert with the message received in the response ("Your account has been successfully deleted. Come back soon!").
- Before you finish, also update the three state variables in App.js (in the following order) to: 
    - "Log out of" the Albums view
    - Render the Login view instead 
    - Set the value of the current user's id to an empty string
- However, if the response indicates the request was **unsuccessful**, simply display an alert with the message received in the response.

## Part 4: Testing

- Finally, test your new functionality by creating a new user. Use the Mongo shell to check the `users` collection - the new user's document should be there. 
- Now try to delete the user!
    - Do you get the correct alert message? Are you then logged out automatically?
    - If so, try logging in as the same user. Does this still work?
    - If you can no longer log in, this is a good sign! Finally, use the Mongo shell to check if the user still exists in your `users` collection. They should not exist any more.
- If any of your testing gives an unexpected result, try to find and fix any bugs.

---

# Task 8

Now you can update the new `deleteAlbum` controller function in your backend to delete a specific album from the logged-in user's MongoDB document.

- In your controller function, you already have access to (1) the user's `id` and (2) the `id` of the album the user wants to delete.
- Next, create a new variable called `updatedUser`. Do not initialize it (give it a value) yet...
- Now, you should use what we have learned about Mongoose's `findByIdAndUpdate` method to try to remove **only** the selected album from the user's MongoDB document. 
    - Make sure that, if this works, the **new** version of the user (minus one album) becomes the value of `updatedUser`.
    - If there is an error, you can, as usual, `catch` it and pass a new error object to the error handling middleware.
- **Some hints about how to remove one album:**
    - Remember how when we wanted to **add** an album using `findByIdAndUpdate`, we used the `$push` operator? There is another operator called `$pull` which may help!
    - However, after writing `$pull`, we do **not** want to find an album **object** equal to the `id` received from the frontend. Instead, we want to find an album object with an **`_id` key** equal to the `id` received from the frontend.
    - See if you can use what you already know about writing MongoDB query syntax to achieve this. If you are stuck, you can also use Google to research how to remove an **object** from an array using Mongoose and the `$pull` operator!
    - If you are still stuck after a while, we can also chat in a breakout room. :-)
- After you have successfully removed the album, you should send back **only** the user's updated `albums` array in the response to the frontend.
- Back in `/views/Albums.js` in the **frontend**, if the response received back from the server is successful ("ok") you should update the `albums` state variable with the parsed response.
- If the response received back from the server is not successful, you should handle this in the usual way (by showing an alert containing the error message received from the server).
    - **Hint** - You can check your other `Albums.js` functions for how to do this if you have forgotten. ;-)
- Finally, test your changes by creating and deleting different albums, and making sure you always get the result you expect. Fix any bugs you find.
    - **Hint:** Remember: both your browser console and VS Code terminals can help you identify any bugs in your code.

---

# Task 7

Let's prepare our project, so that soon we will be able to delete individual albums.

- You should start in `/views/Albums.js` in your **`frontend`** repo. When a user clicks the "X" next to an album, you should already be calling the `deleteOneAlbum` function and making a log of the album's `id`.
- Now update this function to send a DELETE HTTP request to your server, to the URL `http://localhost:3001/users/[user's id]/albums/[album's id]`. You should replace `[user's id]` and `[album's id]` with the correct variables, using template literals (e.g. `${aVariable}`). 
    - When creating your `fetch` request, the `settings` object only needs a `method` property, with the value "DELETE". You will not send any data in your request.
    - Also remember to use your `REACT_APP_SERVER_URL` environment variable instead of `http://localhost:3001`!
- Now go to your **`backend`** repo. Add an extra `delete` **route** to your `/routes/users.js` router which will receive the request from the frontend to delete one album.
    - Remember that the path will have two **parameters** (:) - one for the user's id, and one for the id of the album they want to delete.
- The request will be forwarded on to a **new** controller function in `/controllers/usersController.js` called `deleteAlbum`. Create this function (and remember to `export` it so you can `import` and use it in your router!)
    - For now, the function should simply `console.log`(1) the user's id and (2) the album id using the **parameters** of the request object. 
    - You should also send a response back to the frontend containing the string "Album deleted!".
- Finally, go back to `/views/Albums.js` in your **`frontend`** repo. Now you will need to handle the response from the server:
    - If the response you receive back from the server is successful ("ok"), you can make an `alert` containing the parsed response ("Album deleted!").
    - If the response received back from the server is not successful, you can make an `alert` containing the string "Unsuccessful request!".
- Now test your new functionality by creating two new albums album, clicking the "X" next to one of them, and seeing what happens! Fix any bugs you find.
    - **Hint:** Remember: both your browser console and VS Code terminals can help you identify any bugs in your code.

---

# Task 6

Let's practice using `findByIdAndUpdate` once more, by refactoring our final controller function - the one which deletes all the logged-in user's albums when they click the "Delete all albums!" button in the browser.

- You shouldn't need to change any of your frontend code.
- In the backend, you should go to the `deleteAlbums` controller function in `/controllers/usersController.js`.
- Refactor the function so you are using your `User` model to update the `users` collection of the MongoDB database `albums-project`. There should be no more lowdb code in your controller function.
    - **Hint:** You no longer need to find the index of the user before updating their `albums` array. You only need to know the user's `id` - the clue is in the name `findByIdAndUpdate`!
    - Make sure to return the correct data back to the frontend in your response (note what you are currently sending back after updating `db.json`).
    - Also remember to use `http-errors` to handle any errors in your controller function.
- When you are done, make sure to test your new function by creating some new albums in the browser, and trying to delete them.
- If this is all working, you can now delete any remaining lowdb code from your controller functions! You can also delete the `/data` directory, as we are now only using MongoDB as our database solution. :-)
- Finally, let's update our `backend` repo's dependencies by using `npm uninstall` to uninstall `lowdb` and `uuid`.

---

# Task 5

Now you should try to use your `User` model, and Mongoose's `findByIdAndUpdate` method, to make the `postAlbum` controller function work with your MongoDB database instead of `db.json`:

- You can find the controller function in `/controllers/usersController.js`.
- When you are done, you should be able to create new albums for the logged in user by clicking the "Submit Album" button in your browser.
- Remember that the new albums should be created in the `users` collection of the MongoDB database `albums-project`. There should be no more lowdb code in your controller function!
- Don't forget to also use `http-errors` for your error handling.
- When you are done, make sure to also test to make sure your error handling is working correctly!

---

# Task 4

Let's update our error handling to use the new `http-errors` module. 

**Remember**: so far we have updated:

- The `registerPost()` controller function in `/controllers/registerController.js` (handle a HTTP request sent by a user who is trying to register)
- The `loginPost()` controller function in `/controllers/loginController.js` (handle a HTTP request sent by a user who is trying to log in)
- The `getUserData()` controller function in `/controllers/usersController.js` (handle a HTTP request sent when Albums.js first renders to GET the current user's first name and list of albums)

1. Use npm to install the `http-errors` module.
2. Change your error handling in all your updated controller functions to use the `http-errors` module.
    - I showed you two ways you can do this - feel free to choose your favourite!
    - If you need to research anything (e.g. different "named" errors), you can check out the `http-errors` docs at https://www.npmjs.com/package/http-errors 
    - When you are done, you can test your new error handling by:
        - Trying to register but leaving one or more inputs blank
        - Trying to log in as an unregistered user
    - If you have some time at the end, you can comment out your new error handling and practice the other way of using `http-errors` that I showed you. When you are done, feel free to go back to the way you prefer. :-)

---

---

# Task 3

Now you can register a new user successfully, you should now refactor your code to make sure an existing user can **log in** successfully.

- You can start in `/views/Login.js` (**frontend**) to follow the process for logging in.
- When refactoring your **backend** controller function to handle logging in, remember that we are now using MongoDB and Mongoose to handle your data, not `/data/db.json` and lowdb.
    - In your controller function, also remember to add error handling whenever you use Mongoose to query your MongoDB collection.
- When you are done, use your browser to log in (1) as an existing user and (2) a user who doesn't exist. Make sure you get the expected outcome in both cases.

---

# Task 2

Now your User model is working when you send requests using Postman, make sure you can also register using your **React frontend**.

Remember, to register using your frontend, you need to complete the React form and click "Register an account". Once the button has been clicked, there are **2 stages**:

- **Stage 1**: in `/views/Register.js` (**frontend**), send a HTTP POST request to your server's "/register" path. The `registerPost` controller function for this endpoint (**backend**) should create a new user document in your database and send back a 201 response containing a copy of the new document. **If you completed yesterday's task, this should already work!**
    - You can check this by registering a new user in your browser. Even though you will get an error message, if you check you MongoDB shell / Compass, you will see the user was created. :-)
    - Note that in the `registerPost` controller function (**backend**), when the 201 response is sent you include a copy of the **whole** new document (username, password etc...). 
    - But also note that in `/views/Register.js` (**frontend**), you **only** use the user's unique id from the response. The rest of the data is not needed!
        - Change `/controllers/registerController.js` (**backend**) to send back **only** a unique "id" for the user.
        - Be careful with what you are sending back here! Check out your new document in the MongoDB Shell / Compass if you are unsure...
        - Also make sure in `/views/Register.js` (**frontend**) that you are using **exactly** what you receive in the server response to set the `currentUserId` state variable in `App.js`!

- **Stage 2**: Next, the `Albums` view will be rendered in the browser. As soon as the view is rendered, a `useEffect` will be called to your server's GET /user endpoint to retrieve the necessary details about the user who just registered.
    - You do not need to change the `useEffect` in `/views/Albums.js` (**frontend**). Instead, refactor ("rewrite") your **backend** code to make sure the `fetch` request in the `useEffect` is successful.
    - Remember: your data now lives in MongoDB, not `db.json`!
    - In the controller function (**backend**) for the GET /user route, try to research and implement the new Mongoose method **Model.findById()** to find the correct user document using its id.
    - You can tell if your changes have worked because you will see "Welcome [user's firstname]!" in the top-left corner of the `Albums` view.
    - Make sure you are still also sending back the user's `albums` array from the backend, even though a newly registered user will not have any albums at the moment.
    - Finally, make sure to add error handling (like yesterday) whenever you use Mongoose to query your MongoDB collection.

---

# Task 1

Create and implement a "User" model in the `backend` directory of your new "Albums Project v2" repo!

For now, we will only implement the model when we want to **register** a new user.

## Instructions

1. Install `mongoose` into the `backend` directory of your "albums project v2" repo using npm.
2. Use mongoose in `index.js` to connect to a db called "albums-project" in MongoDB.
3. Inside the `backend` directory, create a `models` directory and add a file called `User.js`.
4. In `User,js`, import `mongoose` and use it to create a **schema** to define how a "User" document should look in your database.
    - What keys do you need to create a "User" document? Also, make sure all the keys are required!
5. Create a **model**, based on the schema, to provide an interface to a collection called `users`.
6. Import your model into `/controllers/registerController.js`.
7. Rewrite the `registerPost` controller function to use your model!
    - New "user" documents should now be saved in the `users` collection of your MongoDB database, instead of the `/data/db.json` file. To do this, you will need to use your **model** to replace all parts of the function currently using LowDB.
    - Remove all parts of the code which are no longer relevant (e.g. imports which are no longer needed, anything we do not need to handle ourselves as MongoDB will automatically handle it...)  
    - Make sure to also add extra **error handling**, in case something goes wrong when using your model to:
        - find your user, or 
        - save your user.
8. Test your changes using **Postman**.
    - Make sure that when you create a user correctly, you receive back a response containing that user's details, **plus**, `albums`, `_id` and `_v` fields.
    - Also try to create a user document without some of the correct fields, and make sure your error handling is working as expected.
    - You can look in the "exercises" Slack channel for examples of how successful and unsuccessful responses should look in Postman. :-)

---

Please copy all tasks into this file! This will create a record of the work you did to complete the project.

Each new task should go to the top of the file. :-)