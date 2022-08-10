const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;
const fs = require("fs");
const filesDestination = `${__dirname}/../../frontend/client/public/uploads`;

// all users
exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.status(200).json(users);
};

// one user
// grâce à auth on va créer req.token qui est en fait l'id
  // auth va aussi créer req.admin
  // if(req.token === req.params.id || req.admin === true ) { logique d'administration}

  // if (!ObjectID.isValid(req.params.id))
  //   return res.status(400).send("ID unknown : " + req.params.id);
exports.getOneUser = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  UserModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("ID unknown : " + err);
  }).select("-password");
};
exports.uploadProfil = async (req, res) => {
  const fileName = req.body.name + ".jpg";
  try {
    if (fs.existsSync(filesDestination)) {
      fs.unlink(fileName, (err) => {
        if(err) console.log(err);
      });}
      await UserModel.findByIdAndUpdate(
      req.body.userId,
      { $set: { picture: req.file !== undefined ? `./uploads/` + req.file.filename : "" } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
    
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

// update user
exports.updateUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          bio: req.body.bio,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true })
      .then((data) => res.send(data))
      .catch((err) => res.status(500).send({ message: err }));
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

// delete user
exports.deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await UserModel.remove({ _id: req.params.id }).exec();
    res.status(200).json({ message: "Successfully deleted. " });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};