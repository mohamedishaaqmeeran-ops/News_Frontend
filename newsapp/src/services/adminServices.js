import protectedInstance from "../instances/protectedInstance";


export const getAllChannel = async () => {
    const response = await protectedInstance.get('/channels');
    return response.data;
};

export const createChannel = async (formData) => {
    const response = await protectedInstance.post('/channels', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const updateChannel = async (id, formData) => {
    const response = await protectedInstance.put(`/channels/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const deleteChannel = async (id) => {
    const response = await protectedInstance.delete(`/channels/${id}`);
    return response.data;
};



export const createJournalists = async (journalistData) => {
    const response = await protectedInstance.post('/channels/journalists', journalistData);
    return response.data;
};

export const getAllJournalists = async () => {
    const response = await protectedInstance.get('/channels/journalists');
    return response.data;
};

export const deleteJournalist = async (id) => {
    const response = await protectedInstance.delete(`/channels/journalists/${id}`);
    return response.data;
};

export const updateJournalist = async (id, journalistData) => {
    const response = await protectedInstance.put(`/channels/journalists/${id}`, journalistData);
    return response.data;
};