const jwt = require('jsonwebtoken');

const issueToken = (dataObject, lifeSpan = "1d") => {
    const token = jwt.sign(dataObject, process.env.SECRET, { expiresIn: lifeSpan });
    return token;
};

const updateTokens = ({auth_token, refresh_token}) => {
    const t1 = _verifyToken(auth_token);
    const t2 = _verifyToken(refresh_token);

    return [t1, t2];
};

const _verifyToken = (token) => {
    return jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            return null;
        } else {
            const {_id, nickname, email, lifeSpan} = decoded;
            return issueToken({_id, nickname, email}, lifeSpan);
        }
    });
};

module.exports = {issueToken, updateTokens};