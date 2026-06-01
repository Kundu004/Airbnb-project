const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    country: Joi.string().required(),
    location: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().allow("", null),
    category: Joi.allow(""),
    maxGuests: Joi.number().min(1).max(16).allow("", null),
    propertyType: Joi.string()
      .valid("Entire place", "Private room", "Shared room", "Hotel room")
      .allow("", null),
    bedrooms: Joi.number().min(0).allow("", null),
    beds: Joi.number().min(1).allow("", null),
    bathrooms: Joi.number().min(0).allow("", null),
    amenities: Joi.alternatives().try(
      Joi.array().items(Joi.string()),
      Joi.string().allow("")
    ),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});

module.exports.userSchema = Joi.object({
  fName: Joi.string().required().trim(),
  lName: Joi.string().allow("", null),
  username: Joi.string().required(),
  email: Joi.string().required().email(),
  password: Joi.string().min(8),
});

module.exports.bookingSchema = Joi.object({
  checkIn: Joi.date().required(),
  checkOut: Joi.date().required(),
  guests: Joi.number().required().min(1).max(10),
  reason: Joi.string().allow("", null),
});
