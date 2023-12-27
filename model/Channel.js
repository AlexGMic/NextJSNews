import mongoose, { Schema } from "mongoose";

const channelSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  code_name: {
    type: String,
    required: true,
  },
  logo: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  subscribers: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
});

const Channel =
  mongoose.models.Channel || mongoose.model("Channel", channelSchema);
export default Channel;
