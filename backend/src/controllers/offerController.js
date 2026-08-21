import { Offer } from "../models/Offer.js";
import { successResponse } from "../utils/apiResponse.js";

const DEFAULT_OFFERS = [
  {
    title: "Weekend Special Offer",
    discount: "Up to 20% OFF",
    subtitle: "On all Home Décor & Ceramic Vases",
    code: "WEEKEND20",
    description: "Upgrade your living space with handcrafted ceramic pieces and aromatic candles at an exclusive discount.",
    bgGradient: "from-amber-500 to-orange-600",
    expiresIn: "Ends Sunday 11:59 PM",
    active: true
  },
  {
    title: "Gift Collection Pack",
    discount: "Buy 2 → Get 10% OFF",
    subtitle: "On all Curated Hampers & Gift Sets",
    code: "GIFTNEST10",
    description: "Surprise loved ones with curated gift boxes. Bundle any 2 hampers and enjoy instant savings.",
    bgGradient: "from-emerald-600 to-teal-700",
    expiresIn: "Limited Time Offer",
    active: true
  },
  {
    title: "New Arrivals Delight",
    discount: "Flat ₹150 OFF",
    subtitle: "On orders above ₹1,499",
    code: "URBANNEST150",
    description: "Discover our freshly arrived Scandinavian desk accessories, planners, and linen room sprays.",
    bgGradient: "from-rose-500 to-amber-600",
    expiresIn: "Valid for New & Existing Customers",
    active: true
  }
];

// GET /api/offers
export const getActiveOffers = async (req, res, next) => {
  try {
    let offers = [];
    try {
      offers = await Offer.find({ active: true }).lean();
    } catch {
      offers = DEFAULT_OFFERS;
    }
    if (offers.length === 0) {
      offers = DEFAULT_OFFERS;
    }
    return successResponse(res, offers, "Active offers fetched successfully");
  } catch (error) {
    next(error);
  }
};
