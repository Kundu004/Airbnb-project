if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");
const User = require("../models/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/Airbnb";
const DB_URL = process.env.ATLASDB_URL;
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  // await mongoose.connect(MONGO_URL);
  await mongoose.connect(DB_URL);
}

let categoryAll = [
  "Beachfront",
  "Cabins",
  "Omg",
  "Lake",
  "Design",
  "Amazing Pools",
  "Farms",
  "Amazing Views",
  "Rooms",
  "Lakefront",
  "Tiny Homes",
  "Countryside",
  "Treehouse",
  "Trending",
  "Tropical",
  "National Parks",
  "Casties",
  "Camping",
  "Top Of The World",
  "Luxe",
  "Iconic Cities",
  "Earth Homes",
];

const allAmenities = [
  "WiFi",
  "Kitchen",
  "Pool",
  "Free Parking",
  "AC",
  "Washer",
  "TV",
  "Workspace",
  "Hot Tub",
  "BBQ Grill",
  "Gym",
  "Beach Access",
  "Fire Pit",
  "Indoor Fireplace",
  "EV Charger",
  "Mountain View",
  "Lake View",
  "Garden",
  "Security Cameras",
  "First Aid Kit",
  "Smoke Alarm",
  "Pets Allowed",
];

const propertyTypes = [
  "Entire place",
  "Private room",
  "Shared room",
  "Hotel room",
];

function getRandomSubset(arr, min, max) {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const initDB = async () => {
  await Listing.deleteMany({});
  await Booking.deleteMany({});
  await User.deleteMany({});
  console.log("Cleared existing listings, bookings, and users");

  // Create and register a default demohost user
  const hostUser = new User({
    email: "host@example.com",
    username: "demohost",
    fName: "Demo",
    lName: "Host",
    image: {
      url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80",
      filename: "demohost_avatar"
    }
  });
  await User.register(hostUser, "password123");
  console.log("Registered default demohost user (Username: demohost, Password: password123)");

  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: hostUser._id,
    category: [
      `${categoryAll[Math.floor(Math.random() * categoryAll.length)]}`,
      `${categoryAll[Math.floor(Math.random() * categoryAll.length)]}`,
    ],
    // New fields
    amenities: getRandomSubset(allAmenities, 4, 10),
    propertyType: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
    maxGuests: Math.floor(Math.random() * 8) + 1,
    bedrooms: Math.floor(Math.random() * 5) + 1,
    beds: Math.floor(Math.random() * 6) + 1,
    bathrooms: Math.floor(Math.random() * 3) + 1,
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized with amenities, property types, and details");
};
initDB();
