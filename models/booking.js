const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  listing: {
    type: Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
  },
  guest: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  host: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  guests: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
    default: 1,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "confirmed",
  },
  cancellationReason: {
    type: String,
  },
  cancelledAt: {
    type: Date,
  },
  cancelledBy: {
    type: String,
    enum: ["guest", "host"],
  },
  lateCancellation: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Virtual: compute number of nights
bookingSchema.virtual("nights").get(function () {
  if (!this.checkIn || !this.checkOut) return 0;
  const diffTime = Math.abs(this.checkOut - this.checkIn);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Ensure virtuals are included in JSON/Object output
bookingSchema.set("toJSON", { virtuals: true });
bookingSchema.set("toObject", { virtuals: true });

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
