const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, validateBooking } = require("../middleware.js");
const bookingController = require("../controllers/bookings.js");

// Create a booking for a listing
router.post(
  "/listings/:id/book",
  isLoggedIn,
  validateBooking,
  wrapAsync(bookingController.createBooking)
);

// View all user bookings (My Trips)
router.get("/bookings", isLoggedIn, wrapAsync(bookingController.getUserBookings));

// Host dashboard
router.get(
  "/bookings/hosting",
  isLoggedIn,
  wrapAsync(bookingController.getHostBookings)
);

// View single booking detail
router.get(
  "/bookings/:bookingId",
  isLoggedIn,
  wrapAsync(bookingController.showBooking)
);

// Cancel a booking
router.post(
  "/bookings/:bookingId/cancel",
  isLoggedIn,
  wrapAsync(bookingController.cancelBooking)
);

module.exports = router;
