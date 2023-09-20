import {screen} from '@testing-library/react';
import BookList from './BookList';
import type {Book} from './types';
import renderWithRouter from './renderWithRouter';


describe('BookList', () => {
    it('renders books', async () => {
        const props: { books: Book[] } = {
            books: [
                {'name': 'Refactoring', 'id': 1},
                {'name': 'Domain-driven design', 'id': 2}
            ]
        };
        renderWithRouter(<BookList {...props} />);

        const headings = await screen.findAllByRole('heading');
        headings.forEach((heading, index) => {
            expect(heading)
                .toHaveTextContent(props.books[index].name);
        });
    });
});