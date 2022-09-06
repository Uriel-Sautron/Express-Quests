const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const hashPassword = async (req, _, next) => {
  const { password } = req.body;
  const hashingOptions = {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 5,
    parallelism: 1,
  };
  argon2
    .hash(password, hashingOptions)
    .then((hashedPassword) => {
      req.body.hashedPassword = hashedPassword;
      delete req.body.password;
      next();
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const verifyPassword = (req, res, next) => {
  const { password } = req.body;
  const { hashedPassword } = req.user;
  argon2
    .verify(hashedPassword, password)
    .then((isVerified) => {
      if (isVerified) {
        const payload = { sub: req.user.id };
        const token = jwt.sign(payload, JWT_SECRET, {
          expiresIn: "1h",
        });
        res.send("Credentials are valid");
        res.JWT = token;
        console.log("token:", token);
        delete req.user.hashedPassword;
        delete req.body.password;
        next();
      } else {
        res.status(401).send("Wrong password");
      }
    })

    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
};

const verifyToken = (req, res, next) => {
  const authorization = req.get("Authorization");

  try {
    if (!authorization) {
      throw new Error("Authorization header is missing");
    }

    const [type, token] = authorization.split(" ");

    if (type !== "Bearer") {
      throw new Error("Authorization header has not the 'Bearer' type");
    }

    const jwtDecoded = jwt.verify(token, JWT_SECRET);
    req.payload = jwtDecoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(401);
  }
};

const verifyUser = (req, res, next) => {
  const id = parseInt(req.params.id);
  const isCurrentUser = req.payload.sub === id;
  if (isCurrentUser) {
    next();
  } else {
    res.sendStatus(403);
  }
};

module.exports = {
  hashPassword,
  verifyPassword,
  verifyToken,
  verifyUser,
};
