const jwt = require("jsonwebtoken") //require jsonwebtoken

//<-------------------------------Authentication------------------------------------------------------//
const authentication = function (req, res, next) {
  try {
    let token = req.headers["X-Api-Key"];
    if (!token) token = req.headers["x-api-key"];
    if (!token) return res.status(400).send({ status: false, msg: "token must be present" });

    const decoded = jwt.decode(token);
    if (!decoded) {
      return res.status(401).send({ status: false, message: "Invalid authentication token in request headers ⚠️" })
    }

    jwt.verify(token, "project1-group10", function (err, decoded) {
      if (err) {
        return res.status(401).send({ status: false, message: "invalid token" })
      } else {
        req.body.tokenId = decoded.authorId
        return next();
      }
    });
  }catch (error) {
    res.status(500).send({ status: false, msg: error.message })
  }
}


module.exports = { authentication }


