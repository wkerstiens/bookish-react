import {useEffect, useState} from 'react';
import {Book} from './types';

import axios from 'axios';

const useBooks = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            setError(false);
            setLoading(true);
            try {
                const res = await axios.get('http://localhost:8080/books');
                setBooks(res.data);
            } catch (e) {
                setError(true);
            } finally {
                setLoading(false);
            }

        })();
    }, []);
    return {loading, error, books};
};

export default useBooks;