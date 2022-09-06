const login = (req, res) => {
  const { email, password } = req.body;

  if (email === "dwight@theoffice.com" && password === "123456") {
    res.status(200).send("Credentials are valid");
  } else {
    res.sendStatus(401);
  }
};

module.exports = {
  login,
};
