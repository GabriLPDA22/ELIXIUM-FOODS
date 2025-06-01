import axios from 'axios';

const API_BASE_URL = 'http://localhost:5290/api';

export interface SearchRestaurant {
  id: number;
  name: string;
  description: string;
  logoUrl: string;
  coverImageUrl: string;
  averageRating: number;
  isOpen: boolean;
  isCurrentlyOpen?: boolean;
  statusMessage?: string;
  deliveryFee: number;
  estimatedDeliveryTime: number;
  tipo: number;
  businessId?: number;
  addressId: number;
  address?: {
    id: number;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SearchProduct {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  imageUrl: string;
  isAvailable: boolean;
  categoryId: number;
  category?: {
    id: number;
    name: string;
    businessId: number;
  };
  businessId: number;
  restaurantId?: number;
  restaurantName?: string;
  restaurantPrice?: number;
  restaurantProductIsAvailable?: boolean;
  stockQuantity?: number;
}

export interface RestaurantProductOfferingDto {
  restaurantId: number;
  restaurantName?: string;
  restaurantLogoUrl?: string;
  price: number;
  isAvailable: boolean;
  stockQuantity?: number;
  productId: number;
  productName?: string;
}

export interface SearchResults {
  restaurants: SearchRestaurant[];
  products: SearchProduct[];
  totalResults: number;
  query: string;
}

export interface SearchFilters {
  query?: string;
  category?: number;
  sortBy?: 'relevance' | 'rating' | 'delivery' | 'price';
  location?: string;
  priceRange?: {
    min: number;
    max: number;
  };
}

class SearchService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  async search(filters: SearchFilters): Promise<SearchResults> {
    try {
      const params = new URLSearchParams();
      if (filters.query) params.append('query', filters.query);
      if (filters.category) params.append('category', filters.category.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.location) params.append('location', filters.location);
      if (filters.priceRange) {
        params.append('minPrice', filters.priceRange.min.toString());
        params.append('maxPrice', filters.priceRange.max.toString());
      }
      const response = await this.axiosInstance.get<SearchResults>(`/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error in general search:', error);
      return { restaurants: [], products: [], totalResults: 0, query: filters.query || '' };
    }
  }

  async searchRestaurants(query: string, filters?: Partial<Pick<SearchFilters, 'category' | 'sortBy'>>): Promise<SearchRestaurant[]> {
    try {
      const params = new URLSearchParams();
      params.append('query', query);
      if (filters?.category) params.append('category', filters.category.toString());
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);
      const response = await this.axiosInstance.get<SearchRestaurant[]>(`/restaurants/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error in restaurant search:', error);
      return [];
    }
  }

  async searchProducts(query: string, filters?: Partial<Pick<SearchFilters, 'category'>>): Promise<SearchProduct[]> {
    try {
      const params = new URLSearchParams();
      params.append('query', query);
      if (filters?.category) params.append('category', filters.category.toString());
      const response = await this.axiosInstance.get<SearchProduct[]>(`/products/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error in product search:', error);
      return [];
    }
  }

  async getSuggestions(query: string): Promise<string[]> {
    try {
      const response = await this.axiosInstance.get<string[]>(`/search/suggestions?query=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }
  }

  async getPopularSearches(): Promise<string[]> {
    try {
      const response = await this.axiosInstance.get<string[]>('/search/popular');
      return response.data;
    } catch (error) {
      console.error('Error fetching popular searches:', error);
      return [];
    }
  }

  async getRestaurantsForProduct(productId: number): Promise<RestaurantProductOfferingDto[]> {
    try {
      const response = await this.axiosInstance.get<RestaurantProductOfferingDto[]>(`/products/${productId}/restaurants`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching restaurants for product ${productId}:`, error);
      return [];
    }
  }
}

export const searchService = new SearchService();
export default searchService;
