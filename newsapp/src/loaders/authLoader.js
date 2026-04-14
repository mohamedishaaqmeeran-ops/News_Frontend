import { clearUser, setUser } from '../redux/authSlice';
import store from '../redux/store';
import { getMe } from '../services/authServices';

const authLoader = async () => {
    try {
        const response = await getMe();

        store.dispatch(setUser(response.user));
        return response;

    } catch (error) {
        console.log('User not logged in');

        store.dispatch(clearUser());

        return null; // ✅ DON'T redirect
    }
};

export default authLoader;