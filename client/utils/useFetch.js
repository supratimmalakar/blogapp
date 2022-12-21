import axios from 'axios'
import { useEffect, useState } from 'react'
import { errorToast } from '../redux/toastReducer';
import { useDispatch } from 'react-redux';


export const useFetch = (route, method, token, payload) => {
    const dispatch = useDispatch()
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [loaded, setLoaded] = useState(false);


    useEffect(() => {
        if (method === "post") {
            (async () => {
                try {
                    const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api${route}`, payload ,{
                        headers: {
                            Authorization: 'Bearer ' + token
                        }
                    });

                    setData(response.data);
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoaded(true);
                }
            })();
        }
        else if (method === "get") {

            (async () => {
                try {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api${route}`, {
                        headers: {
                            Authorization: 'Bearer ' + token
                        }
                    });

                    setData(response.data);
                } catch (error) {
                    dispatch(errorToast())
                    setError(error.message);
                } finally {
                    setLoaded(true);
                }
            })();
        }
    }, []);

    return { data, error, loaded };
};