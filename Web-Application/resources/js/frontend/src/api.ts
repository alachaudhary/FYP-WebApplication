import axios from "axios";

const fastApiImage = axios.create({
  baseURL: "https://168d780dd5d1.ngrok-free.app", // <-- update with your image API URL
});

const fastApiVideo = axios.create({
  baseURL: "https://ad8ae8946d69.ngrok-free.app", // <-- update with your video API URL
});

// Laravel backend for storage + saving results
const laravelApi = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    Accept: "application/json",
  },
});

laravelApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && !config.url?.includes("/login") && !config.url?.includes("/register")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Automatically send to the correct FastAPI endpoint based on media type
 */



/**
 * Upload to image or video FastAPI server based on file type
 */
export const uploadToLimeAPI = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const isImage = file.type.startsWith("image/");
  const apiClient = isImage ? fastApiImage : fastApiVideo;

  console.log("File type:", file.type);
  console.log("Routing to:", isImage ? "IMAGE API" : "VIDEO API");

  const response = await apiClient.post("/explain", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};



export const uploadMedia = async (file: File, username: string) => {
  const formData = new FormData();
  formData.append("video", file); // or "file" if backend expects that
  formData.append("username", username);

  const response = await laravelApi.post("/videos/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const saveResults = async (data: {
  filename: string;
  prediction: string;
  confidence: number;
  frames: number;
  processing_time: number;
  lime_image?: string;
}) => {
  return laravelApi.post("/videos/save-results", data);
};

export default laravelApi;
