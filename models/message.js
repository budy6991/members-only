const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

// To add author

const MessageSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date },
});

MessageSchema.virtual("url").get(function () {
  return `${this._id}`;
});

MessageSchema.virtual("timestamp_formatted").get(function () {
  return DateTime.fromJSDate(this.timestamp).toISODate();
});

module.exports = mongoose.model("Message", MessageSchema);
