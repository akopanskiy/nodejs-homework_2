const jwt = require("jsonwebtoken");
const { Unauthorized } = require("http-errors");

const { User } = require("../model");

const { S_KEY } = process.env;

const authenticate = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        console.log(req.user)
        if (!authorization) {
            throw new Unauthorized("Not authorized");
        }
        const [bearer, token] = authorization.split(" ");
        if (bearer !== "Bearer") {
            throw new Unauthorized("Not authorized");
        }
        jwt.verify(token, S_KEY);
        const user = await User.findOne({ token });
        if (!user) {
            throw new Unauthorized("Not authorized");
        }
        req.user = user;
        next();
        
    } catch (error) {
        if (!error.status) {
            error.status = 401;
            error.message = "Not authorizes";
        }
        next(error);
    }
    
}

module.exports = authenticate;