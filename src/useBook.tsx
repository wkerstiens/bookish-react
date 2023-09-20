import {useEffect, useState} from 'react';
import {Book} from './types';

import axios from 'axios';
import {useParams} from 'react-router';

const useBook = () => {
    const {id} = useParams<string>();
    const [book, setBook] = useState<Book>({id: 0, name: ''});
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            setError(false);
            setLoading(true);
            try {
                const res = await axios.get(`http://localhost:8080/books/${id}`);
                setBook(res.data);
            } catch (e) {
                setError(true);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);
    return {loading, error, book};
};

export default useBook;