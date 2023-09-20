import {useParams} from 'react-router';
import useBook from './useBook';
import BookDetail from './BookDetail';

const BookDetailContainer = () => {
    const {id} = useParams<string>();
    const {book} = useBook();

    return (
        <BookDetail book={book}/>
    );
};

export default BookDetailContainer;