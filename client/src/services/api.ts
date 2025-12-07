import { VideoListResponse } from '../types/video';

const API_BASE_URL = 'http://localhost:3000'; // 服务器地址

export const fetchVideoList = async (
  baseUrl: string,
  page: number = 1,
  typeId?: number,
  keyword?: string
): Promise<VideoListResponse> => {
  const params = new URLSearchParams({
    baseUrl,
    ac: 'videolist',
    pg: page.toString()
  });

  if (typeId) {
    params.append('t', typeId.toString());
  }

  if (keyword) {
    params.append('wd', keyword);
  }

  const response = await fetch(`${API_BASE_URL}/api/proxy/vod?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const fetchVideoDetail = async (baseUrl: string, id: number): Promise<VideoListResponse> => {
  const params = new URLSearchParams({
    baseUrl,
    ac: 'videolist',
    ids: id.toString()
  });

  const response = await fetch(`${API_BASE_URL}/api/proxy/vod?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
