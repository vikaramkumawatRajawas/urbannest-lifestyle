import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { PRODUCTS as LOCAL_PRODUCTS } from "../data/productsData";
import { apiClient } from "../services/apiClient";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(LOCAL_PRODUCTS);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(3000);
  const [sortBy, setSortBy] = useState("featured"); // 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest'
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchBackendProducts = async () => {
      setIsLoading(true);
      const res = await apiClient.get("/products");
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setProducts(res.data);
      } else {
        console.log("[ProductContext] Using local products data fallback");
      }
      setIsLoading(false);
    };

    fetchBackendProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category Filter
      const matchesCategory =
        selectedCategory === "All" ||
        product.category.toLowerCase() === selectedCategory.toLowerCase();

      // Search Query Filter
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        (product.tags && product.tags.some((tag) => tag.toLowerCase().includes(query)));

      // Price Filter
      const matchesPrice = product.price <= maxPrice;

      return matchesCategory && matchesSearch && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "newest") return String(b.id).localeCompare(String(a.id));
      // Default: featured or natural order
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, searchQuery, selectedCategory, maxPrice, sortBy]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setMaxPrice(3000);
    setSortBy("featured");
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        filteredProducts,
        isLoading,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        maxPrice,
        setMaxPrice,
        sortBy,
        setSortBy,
        selectedProduct,
        setSelectedProduct,
        resetFilters
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
