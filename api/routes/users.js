const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");

router.put("/:id", async (req, res) => {
  try {
    
    if (!req.body.userId || !req.params.id || req.body.userId !== req.params.id) {
      return res.status(403).json("You are not allowed to update this account!");
    }

   
    const existingUser = await User.findById(req.params.id);

 
    if (!existingUser) {
      return res.status(404).json("User not found");
    }

    
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    
    const updatedFields = {};
    if (req.body.username) {
      updatedFields.username = req.body.username;
    }
    if (req.body.email) {
      updatedFields.email = req.body.email;
    }
    if (req.body.password) {
      updatedFields.password = req.body.password;
    }
    if (req.body.profilePic) { 
      updatedFields.profilePic = req.body.profilePic;
    }

    
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: updatedFields },
      { new: true }
    );

    
    console.log("User updated successfully:", updatedUser);

    
    res.status(200).json(updatedUser);
  } catch (err) {
    
    console.error("Error updating user:", err);
    res.status(500).json(err);
  }
});


//DELETE
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      try {
        await Post.deleteMany({ username: user.username });
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    } catch (err) {
      res.status(404).json("User not found!");
    }
  } else {
    res.status(401).json("You can delete only your account!");
  }
});

//GET USER
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
