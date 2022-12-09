import axios from 'axios'
import { useEffect, useState } from 'react'


export const useFetch = (route, method, token, payload) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [loaded, setLoaded] = useState(false);


    useEffect(() => {
        if (method === "post") {
            (async () => {
                try {
                    const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users${route}`, payload ,{
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
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users${route}`, {
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
    }, []);

    return { data, error, loaded };
};