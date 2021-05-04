exports.allAccess = (req, res) => {
    res.send("All access");
};

exports.userBoard = (req, res) => {
    res.send("User Content");
};

exports.adminBoard = (req, res) => {
    res.send("Admin Content");
};

exports.moderatorBoard = (req, res) => {
    res.send("Moderator Content");
};