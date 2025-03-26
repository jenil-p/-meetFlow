import mongoose from "mongoose";

import "./User.js";       // Ensure User model is registered
import "./Conference.js"; // Ensure Conference model is registered
import "./Room.js";       // Ensure Room model is registered
import "./Session.js";    // Ensure Session model is registered
import "./Resource.js";   // If you have a Resource model
import "./Registration.js"; // If you have a Registration model
import "./Review.js";     // If you have a Review model
import "./Paper.js";      // If you have a Paper model

export const User = mongoose.models.User;
export const Conference = mongoose.models.Conference;
export const Room = mongoose.models.Room;
export const Session = mongoose.models.Session;
export const Resource = mongoose.models.Resource;
export const Registration = mongoose.models.Registration;
export const Review = mongoose.models.Review;
export const Paper = mongoose.models.Paper;
