const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:120/api';

export interface Game {
  id: number;
  steamId: string;
  title: string;
  description: string;
  shortDescription: string | null;
  headerImage: string;
  backgroundImage: string | null;
  releaseDate: string | null;
  developer: string;
  publisher: string;
  metacriticScore: number | null;
  metacriticUrl: string | null;
  isFree: boolean;
  price: string;
  originalPrice: string;
  discountPercent: number;
  categories: string[] | null;
  languages: string[] | null;
  systemRequirements: any | null;
  platforms: string[] | null;
  lastUpdated: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  prices: Price[];
}

export interface Price {
  id: number;
  gameId: number;
  price: string;
  originalPrice: string;
  discountPercent: number;
  currency: string;
  region: string;
  isOnSale: boolean;
  saleEndDate: string | null;
  recordedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface GamesResponse {
  games: Game[];
  total: number;
  limit: number;
  offset: number;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class GameService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new ApiError(
          `HTTP error! status: ${response.status}`,
          response.status,
          response.statusText
        );
      }

      return await response.json();
    } catch (error: unknown) {
      console.error(`API request failed for ${endpoint}:`, error);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError('Request timeout. Please try again.', 408, 'TIMEOUT');
        }

        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          throw new ApiError(
            'Network error. Please check your internet connection and try again.',
            0,
            'NETWORK_ERROR'
          );
        }
      }

      throw new ApiError(
        'An unexpected error occurred. Please try again later.',
        500,
        'UNKNOWN_ERROR'
      );
    }
  }

  async getGames(params?: PaginationParams): Promise<GamesResponse> {
    const queryParams = new URLSearchParams();

    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    if (params?.offset) {
      queryParams.append('offset', params.offset.toString());
    }

    const queryString = queryParams.toString();
    const endpoint = `/games${queryString ? `?${queryString}` : ''}`;

    return this.makeRequest<GamesResponse>(endpoint);
  }

  async getGame(id: string | number): Promise<Game> {
    return this.makeRequest<Game>(`/games/${id}`);
  }

  async searchGames(query: string, params?: PaginationParams): Promise<GamesResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('q', query);

    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    if (params?.offset) {
      queryParams.append('offset', params.offset.toString());
    }

    const endpoint = `/games/search?${queryParams.toString()}`;
    return this.makeRequest<GamesResponse>(endpoint);
  }

  async getGamesByCategory(category: string, params?: PaginationParams): Promise<GamesResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('category', category);

    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    if (params?.offset) {
      queryParams.append('offset', params.offset.toString());
    }

    const endpoint = `/games/category?${queryParams.toString()}`;
    return this.makeRequest<GamesResponse>(endpoint);
  }

  async getFreeGames(params?: PaginationParams): Promise<GamesResponse> {
    const queryParams = new URLSearchParams();

    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    if (params?.offset) {
      queryParams.append('offset', params.offset.toString());
    }

    const queryString = queryParams.toString();
    const endpoint = `/games/free${queryString ? `?${queryString}` : ''}`;

    return this.makeRequest<GamesResponse>(endpoint);
  }

  async getOnSaleGames(params?: PaginationParams): Promise<GamesResponse> {
    const queryParams = new URLSearchParams();

    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    if (params?.offset) {
      queryParams.append('offset', params.offset.toString());
    }

    const queryString = queryParams.toString();
    const endpoint = `/games/sale${queryString ? `?${queryString}` : ''}`;

    return this.makeRequest<GamesResponse>(endpoint);
  }
}

export const gameService = new GameService();
export default gameService;
