const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");

module.exports.createBooking = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // Prevent booking own listing
  if (listing.owner._id.equals(req.user._id)) {
    req.flash("error", "You cannot book your own listing.");
    return res.redirect(`/listings/${id}`);
  }

  const { checkIn, checkOut, guests } = req.body;
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Validate dates
  if (checkInDate < today) {
    req.flash("error", "Check-in date cannot be in the past.");
    return res.redirect(`/listings/${id}`);
  }
  if (checkOutDate <= checkInDate) {
    req.flash("error", "Check-out date must be after check-in date.");
    return res.redirect(`/listings/${id}`);
  }

  // Validate guest count
  const guestCount = parseInt(guests) || 1;
  if (guestCount > (listing.maxGuests || 10)) {
    req.flash(
      "error",
      `Maximum ${listing.maxGuests || 10} guests allowed for this listing.`
    );
    return res.redirect(`/listings/${id}`);
  }

  // Check for overlapping bookings
  const overlapping = await Booking.findOne({
    listing: id,
    status: { $in: ["pending", "confirmed"] },
    $or: [
      { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } },
    ],
  });

  if (overlapping) {
    req.flash(
      "error",
      "This listing is already booked for the selected dates. Please choose different dates."
    );
    return res.redirect(`/listings/${id}`);
  }

  // Calculate total price
  const nights = Math.ceil(
    (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
  );
  const basePrice = listing.price * nights;
  const cleaningFee = Math.round(listing.price * 0.1);
  const serviceFee = Math.round(basePrice * 0.05);
  const totalPrice = basePrice + cleaningFee + serviceFee;

  const newBooking = new Booking({
    listing: listing._id,
    guest: req.user._id,
    host: listing.owner._id,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    guests: guestCount,
    totalPrice: totalPrice,
    status: "confirmed",
  });

  await newBooking.save();
  req.flash("success", "Booking confirmed! 🎉");
  res.redirect(`/bookings/${newBooking._id}`);
};

module.exports.getUserBookings = async (req, res, next) => {
  const bookings = await Booking.find({ guest: req.user._id })
    .populate({
      path: "listing",
      populate: { path: "owner" },
    })
    .populate("host")
    .sort({ createdAt: -1 });

  // Separate upcoming, past, and cancelled
  const now = new Date();
  const upcoming = bookings.filter(
    (b) => b.status === "confirmed" && new Date(b.checkIn) >= now
  );
  const active = bookings.filter(
    (b) =>
      b.status === "confirmed" &&
      new Date(b.checkIn) <= now &&
      new Date(b.checkOut) >= now
  );
  const past = bookings.filter(
    (b) =>
      (b.status === "confirmed" && new Date(b.checkOut) < now) ||
      b.status === "completed"
  );
  const cancelled = bookings.filter((b) => b.status === "cancelled");

  res.render("bookings/myBookings.ejs", {
    upcoming,
    active,
    past,
    cancelled,
    allBookings: bookings,
  });
};

module.exports.getHostBookings = async (req, res, next) => {
  // Find all listings owned by current user
  const myListings = await Listing.find({ owner: req.user._id });
  const listingIds = myListings.map((l) => l._id);

  const bookings = await Booking.find({ listing: { $in: listingIds } })
    .populate("listing")
    .populate("guest")
    .sort({ createdAt: -1 });

  // Calculate stats
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  const totalEarnings = confirmedBookings.reduce(
    (sum, b) => sum + b.totalPrice,
    0
  );
  const now = new Date();
  const upcomingGuests = confirmedBookings.filter(
    (b) => new Date(b.checkIn) >= now
  );

  res.render("bookings/hostDashboard.ejs", {
    bookings,
    totalBookings: confirmedBookings.length,
    totalEarnings,
    upcomingGuests: upcomingGuests.length,
    myListings,
  });
};

module.exports.showBooking = async (req, res, next) => {
  const { bookingId } = req.params;
  const booking = await Booking.findById(bookingId)
    .populate({
      path: "listing",
      populate: { path: "owner" },
    })
    .populate("guest")
    .populate("host");

  if (!booking) {
    req.flash("error", "Booking not found!");
    return res.redirect("/bookings");
  }

  // Only guest or host can view
  if (
    !booking.guest._id.equals(req.user._id) &&
    !booking.host._id.equals(req.user._id)
  ) {
    req.flash("error", "You are not authorized to view this booking.");
    return res.redirect("/bookings");
  }

  // Calculate price breakdown
  const nights = Math.ceil(
    (booking.checkOut - booking.checkIn) / (1000 * 60 * 60 * 24)
  );
  const basePrice = booking.listing.price * nights;
  const cleaningFee = Math.round(booking.listing.price * 0.1);
  const serviceFee = Math.round(basePrice * 0.05);

  res.render("bookings/bookingDetail.ejs", {
    booking,
    nights,
    basePrice,
    cleaningFee,
    serviceFee,
  });
};

module.exports.cancelBooking = async (req, res, next) => {
  const { bookingId } = req.params;
  const booking = await Booking.findById(bookingId)
    .populate("listing")
    .populate("guest");

  if (!booking) {
    req.flash("error", "Booking not found!");
    return res.redirect("/bookings");
  }

  // Only guest or host can cancel
  const isGuest = booking.guest._id.equals(req.user._id);
  const isHost = booking.host.equals(req.user._id);

  if (!isGuest && !isHost) {
    req.flash("error", "You are not authorized to cancel this booking.");
    return res.redirect("/bookings");
  }

  if (booking.status === "cancelled") {
    req.flash("error", "This booking is already cancelled.");
    return res.redirect(`/bookings/${bookingId}`);
  }

  if (booking.status === "completed") {
    req.flash("error", "Cannot cancel a completed booking.");
    return res.redirect(`/bookings/${bookingId}`);
  }

  // Check if late cancellation (less than 48 hours before check-in)
  const hoursUntilCheckIn =
    (new Date(booking.checkIn) - new Date()) / (1000 * 60 * 60);
  const isLateCancellation = hoursUntilCheckIn < 48 && hoursUntilCheckIn > 0;

  booking.status = "cancelled";
  booking.cancelledAt = new Date();
  booking.cancelledBy = isGuest ? "guest" : "host";
  booking.cancellationReason = req.body.reason || "No reason provided";
  booking.lateCancellation = isLateCancellation;

  await booking.save();

  if (isLateCancellation) {
    req.flash(
      "success",
      "Booking cancelled. Note: This was a late cancellation (less than 48 hours before check-in)."
    );
  } else {
    req.flash("success", "Booking has been cancelled successfully.");
  }

  res.redirect("/bookings");
};
