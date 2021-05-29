const jwt = require("jsonwebtoken");
const { jwtSecrets } = require("../../config/settings");

// this function will generate an access token based on the username param and access token secret key
const signAccessToken = async (username, rememberMe) => {
    try {
        let accessToken = await jwt.sign(
            { username },
            jwtSecrets.accessTokenSecretKey,
            {
                expiresIn: rememberMe ? "144h" : "24h",
            }
        );
        return accessToken;
    } catch (err) {
        console.error(err);
    }
};
const verifyAccessToken = async (accessToken) => {
    try {
        let payload = await jwt.verify(
            accessToken,
            jwtSecrets.accessTokenSecretKey
        );
        return payload;
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            err.code = 1072;
            err.status = 401;
            err.message = "Invalid token or expired !";
        } else if (err.name === "JsonWebTokenError") {
            err.code = 1079;
            err.status = 401;
            err.message = "Invalid token or expired !";
        }
        throw err;
    }
};

module.exports = {
    signAccessToken,
    verifyAccessToken,
};
