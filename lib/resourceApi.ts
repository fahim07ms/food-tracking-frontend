import api from "./api";

export interface Resource {
  _id: string;
  title: string;
  content: string;
  type: "article" | "video";
  tags: string[];
  video_url?: string;
  created_by?: {
    fullName: string;
    email: string;
    image_url?: string;
  };
  createdAt: string;
}

export interface ResourcesResponse {
  resources: Resource[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface RecommendationsResponse {
  recommendations: Resource[];
  basedOnTags: string[];
  count: number;
}

export const resourceApi = {
  // Get all resources with optional filters
  getResources: async (params?: {
    type?: "article" | "video";
    tag?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ResourcesResponse> => {
    const response = await api.get("/resources", { params });
    return response.data;
  },

  // Get a single resource by ID
  getResourceById: async (id: string): Promise<{ resource: Resource }> => {
    const response = await api.get(`/resources/${id}`);
    return response.data;
  },

  // Get personalized recommendations (requires authentication)
  getRecommendations: async (): Promise<RecommendationsResponse> => {
    const response = await api.get("/resources/recommendations");
    return response.data;
  },
};
