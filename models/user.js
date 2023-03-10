const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-type-email");

const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: mongoose.SchemaTypes.Email, required: true },
  membership: {
    type: String,
    required: true,
    enum: ["member", "admin", "user"],
  },
});

UserSchema.virtual("fullname").get(function () {
  return `${this.first_name} ${this.last_name}`;
});

module.exports = mongoose.model("User", UserSchema);
