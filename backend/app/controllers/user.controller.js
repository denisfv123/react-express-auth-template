exports.allAccess = (req, res) => {
  console.log("allAccess");
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  console.log("userBoard");
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};
