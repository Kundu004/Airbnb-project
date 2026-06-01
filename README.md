# Airbnb Clone — Next-Level Upgrade 🚀

A premium, full-stack Airbnb clone redesigned from a basic listing/review CRUD app into a state-of-the-art booking platform. This upgrade implements a complete reservation lifecycle, interactive guest details, dynamic pricing engines, resilient map views, robust database seeding, and a highly polished UI.

---

## 🌟 Premium Features

### 1. Complete Booking Lifecycle
- **Dynamic Price Engine**: Client-side dynamic pricing computes base rate per night, automatically adds a 10% cleaning fee, applies a 5% service fee, and updates the total instantly as dates are changed.
- **Strict Reservation Guard**: 
  - Prevents hosts from booking their own listings.
  - Validates dates (prevents past bookings or check-out dates before check-in).
  - Enforces database level checks to prevent overlapping reservations on the same property.
- **My Trips Dashboard (`/bookings`)**: A guest-focused grid displaying upcoming active, past, and cancelled reservations.
- **Host Dashboard (`/bookings/hosting`)**: A unified panel for hosts to manage bookings received on their listings, view total earnings summaries, monitor guest details, and track active bookings.
- **Booking Invoice View (`/bookings/:id`)**: Beautiful confirmation timeline invoice showing price breakdown, check-in dates, guest count, and Google Maps redirect links.
- **Flexible Cancellations**: Interactive cancellation form with reason inputs. Implements a 48-hour policy alerting users when a cancellation is "late".

### 2. Expanded Property Listings
- **Advanced Listing Attributes**: Support for `maxGuests`, `propertyType` (Entire place, Private room, Shared room, Hotel room), `bedrooms`, `beds`, and `bathrooms`.
- **Dynamic Amenities Checklist**: Fully styled grid checklist for 22 premium amenities (e.g. WiFi, Pool, Gym, EV Charger, Beach Access) when creating or editing a listing.
- **Cascade Deletion**: Robust pre- and post-hook middlewares automatically delete associated reviews and bookings when a listing is removed, preventing database leaks.

### 3. Graceful Map Fallback
- **Mapbox Resiliency**: Map loading and location geocoding processes run under safe try-catch validations.
- **Google Maps Failover**: If the Mapbox public token is missing or invalid, the app cleanly renders a premium Map Fallback Card containing geocoded location names, coordinates, and a click-to-redirect button to open the location on Google Maps.

### 4. Cohesive Premium UI/UX
- **Modern Styling System**: Elegant HSL-based color tokens, backdrop-filter blurs, drop-shadow elevations, and hover-triggered micro-animations.
- **Responsive Layout**: Airbnb-inspired double-column layout on Listing Details pages, optimized for both desktop and mobile viewports.
- **Active Notifications**: Live notification badges in the navigation menu indicating the user's upcoming active trips.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
|-----------|------------|-------------|
| **Backend** | Node.js + Express.js | Robust, asynchronous backend architecture |
| **Database** | MongoDB + Mongoose | NoSQL database with strict schema definitions and post/pre hooks |
| **Authentication** | Passport.js + Local Mongoose | Secure session management, password hashing, and local strategy |
| **Oauth** | Google & Facebook | Multi-provider social authentication (Passport strategies) |
| **Validation** | Joi | Full API request schema validation (Listing, Reviews, Bookings) |
| **File Storage** | Multer + Cloudinary | Dynamic image upload handling and cloud file storage |
| **Maps** | Mapbox GL JS | Custom map rendering and geocoding failovers |
| **Template Engine** | EJS + EJS-Mate | Dynamic serverside HTML parsing and standard boilerplate styling |

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js** (v20.x or higher recommended)
- **MongoDB** running locally on port `27017`

### 1. Clone the repository and install dependencies
```bash
git clone https://github.com/Kundu004/Airbnb-project.git
cd Airbnb-project
npm install
```

### 2. Configure Environment Variables
Create a file named `.env` in the root folder and add your credentials:
```env
ATLASDB_URL=mongodb://127.0.0.1:27017/Airbnb
SECRET=mysupersecretcode
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_key
CLOUD_API_SECRET=your_cloudinary_secret
MAP_TOKEN=pk.your_mapbox_token_here
```

### 3. Seed the Database
Our enhanced database initialization script automatically registers a default host user, seeds the listings with comprehensive property attributes, and maps valid ownership:
```bash
node init/index.js
```

### 4. Boot the Server
```bash
npm start
```
Open **`http://localhost:8080`** in your browser to view the application!

---

## 🔑 Pre-Registered Test Host Credentials

To easily test both host and guest workflows without signing up multiple times:
- **Username**: `demohost`
- **Password**: `password123`
- **Email**: `host@example.com`

*Log in as `demohost` to access the Host Dashboard, create new listings, edit listings, and manage incoming guest reservations. Register new accounts to act as guests.*

---

## 👥 Special Thanks
A heartfelt thank you to **Shradha Khapra didi** and **Aman Dhattarwal bhaiya** at `#ApnaCollege` for their invaluable guidance, training, and support.

---

### Author
- **Sourav Kundu**
- **Email**: sourav.kundu0409@gmail.com

