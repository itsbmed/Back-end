"use strict";
module.exports = (err, req, res, next) => {
    const env = req.app.get("env");
    const is_dev_or_test = env === "development" || env === "testing";
    const error = {
        message: err.message,
    };
    error.stack = is_dev_or_test ? err.stack : undefined;
    res.status(err.status || 500);
    res.json(error);
};
