const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    jwt.verify(req.cookies.auth_token, process.env.SECRET, (err, decoded) => {
        if (err) {
            res.status(401).send({success: false, message: "token expired"});
        } else {
            req.userEmail = decoded.email;
            req.userId = decoded._id;
            next();
        }
    });
};

module.exports = { auth };