import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 아티스트 정보를 가져옵니다.
 * @param name - 아티스트 이름
 * @returns 아티스트 정보
 */
export const getArtist = async (name: string) => {
  const response = await api.get("/artist", {
    params: { name },
  });
  return response.data;
};
