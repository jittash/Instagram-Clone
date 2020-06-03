module.exports = {
    //We will create this mongouri on heroku
    //It is good practice to create environment variables for sensitive data
    MONGOURI:process.env.MONGOURI,
    JWT_SECRET:process.env.JWT_SEC
}