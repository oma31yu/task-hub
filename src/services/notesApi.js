import { apiClient } from './apiClient';

export const fetchPosts = () => apiClient.get('/posts');

export const createPost = (postData) => apiClient.post('/posts', postData);

export const deletePost = (id) => apiClient.delete(`/posts/${id}`);