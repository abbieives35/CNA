const jwt = require("jsonwebtoken");

const token = jwt.sign({ id: "1" }, "default_secret");
console.log("JWT:", token);
