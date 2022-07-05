import { check } from "express-validator";

const albumValidator = () => {
    const currentYear = new Date().getFullYear();   // 2022

    return [
        // Array item 1
        check("albumTitle")
            .isLength({ min: 2 })
            .withMessage("Album title should be greater than 2 characters"),
        // Array item 2
        check("band")
            .isLength({ min: 2 })
            .withMessage("Band should be greater than 2 characters"),
        // Array item 3
        check("albumYear")
            .isNumeric()
            .withMessage("Album year should be a number")
            // Check if the album year is greater than or equal to 1900 AND less than or equal to the current year
            // Return a boolean - true or false
            // True = "no problem"
            // False = "problem!"
            .custom(value => {
                console.log("Current year", currentYear);

                // 1899 returns false
                // 1950 returns true
                // 2300 returns false
                return value >= 1900 && value <= currentYear;                
            })
            .withMessage(`Album year must be between 1900 and ${currentYear}`)
    ]
}

export default albumValidator;