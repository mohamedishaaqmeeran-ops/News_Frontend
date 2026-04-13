import protectedInstance from "../instances/protectedInstance";
import instance from "../instances/instance";


export const getAllNews = async (params = {}) => {
    const searchParams = new URLSearchParams(params).toString();
    const response = await protectedInstance.get(`/news?${searchParams}`);
    return response.data;
};


export const getNewsById = async (id) => {
    const response = await protectedInstance.get(`/news/${id}`);
    return response.data;
};


export const createNews = async (newsData) => {
    const response = await protectedInstance.post('/news', newsData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
};

export const updateNews = async (id, newsData) => {
    const response = await protectedInstance.put(`/news/${id}`, newsData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    return response.data;
};


export const deleteNews = async (id) => {
    const response = await protectedInstance.delete(`/news/${id}`);
    return response.data;
};

export const getMyNews = async () => {
    const response = await protectedInstance.get('/news/journalist/news');
    return response.data;
};


export const getBreakingNews = async () => {
    const response = await protectedInstance.get('/news/breaking');
    return response.data;
};


export const getNewsByChannel = async (channelId) => {
    const response = await protectedInstance.get(`/news/channel/${channelId}`);
    return response.data;
};


export const getNewsByCategory = async (category) => {
    const response = await protectedInstance.get(`/news/category/${category}`);
    return response.data;
};


export const getNewsByType = async (type) => {
    const response = await protectedInstance.get(`/news/type/${type}`);
    return response.data;
};

export const getJournalistChannels = async () => {  
    const response = await protectedInstance.get('/channels/journalist');
    return response.data;
};


export const getAllChannels = async () => {
    const response = await instance.get('/channels');
    return response.data;
};


export const getJournalistBreakingNews = async () => {
    const response = await protectedInstance.get('/news/journalist/breaking');
    return response.data;
};