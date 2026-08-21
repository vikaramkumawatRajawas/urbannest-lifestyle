import { Testimonial } from "../models/Testimonial.js";
import { successResponse } from "../utils/apiResponse.js";

const DEFAULT_TESTIMONIALS = [
  {
    name: "Ananya Sharma",
    role: "Interior Enthusiast",
    location: "Bangalore, India",
    rating: 5,
    comment: "UrbanNest has become my favorite place for small home décor pieces. The ceramic vase arrived impeccably packaged!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    approved: true
  },
  {
    name: "Rohan Mehta",
    role: "Architect & Designer",
    location: "Mumbai, India",
    rating: 5,
    comment: "The wooden desk organizer is top-tier quality. Natural grain finish, solid wood, and very functional.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    approved: true
  },
  {
    name: "Priya Nair",
    role: "HR Executive",
    location: "Pune, India",
    rating: 5,
    comment: "Ordered 5 celebration gift hampers for my team. Everyone loved the handwritten cards and curated treats.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    approved: true
  },
  {
    name: "Vikramaditya Verma",
    role: "Verified Buyer",
    location: "Delhi NCR, India",
    rating: 5,
    comment: "Submitted a query through their online form regarding gift packaging and got a response within minutes thanks to their N8N query system.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    approved: true
  }
];

// GET /api/testimonials
export const getApprovedTestimonials = async (req, res, next) => {
  try {
    let testimonials = [];
    try {
      testimonials = await Testimonial.find({ approved: true }).lean();
    } catch {
      testimonials = DEFAULT_TESTIMONIALS;
    }
    if (testimonials.length === 0) {
      testimonials = DEFAULT_TESTIMONIALS;
    }
    return successResponse(res, testimonials, "Testimonials fetched successfully");
  } catch (error) {
    next(error);
  }
};
