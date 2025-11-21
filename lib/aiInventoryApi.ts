import api from "./api";

export interface AIInventoryUploadResponse {
  message: string;
  imageLog: {
    _id: string;
    url: string;
  };
  ai_generated_inventory_logs: any[];
  ocrText?: string;
  foodItem?: any;
}

export const aiInventoryApi = {
  // Upload image for AI inventory processing
  uploadAIInventoryImage: async (
    imageFile: File
  ): Promise<AIInventoryUploadResponse> => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await api.post("/user/ai-inventory-log", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },
};
