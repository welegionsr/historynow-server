const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true }, //TODO add regex validation?
  username: {
    type: String,
    required: true,
    validate: {
      async validator(username) {
        const user = await User.find({ username }).exec();
        return user;
      },
      message: props => `${props.value} is already taken!`
    }
  },
  userPassword: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  savedEvents: { type: [String], default: [] } //TODO add validator?
});

const User = mongoose.model("user", userSchema);
module.exports = {
  User
};
