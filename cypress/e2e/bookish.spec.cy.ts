import axios from 'axios';


describe('Bookish Application', () => {
    before(async () => {
        try {
            return await axios
                .delete('http://localhost:8080/books?_cleanup=true');
        } catch (err) {
            return err;
        }
    });

    afterEach(async () => {
        try {
            return await axios
                .delete('http://localhost:8080/books?_cleanup=true');
        } catch (err) {
            return err;
        }
    });

    beforeEach(async () => {
        const books = [
            {'name': 'Refactoring', 'id': 1},
            {'name': 'Domain-driven design', 'id': 2},
            {'name': 'Building Microservices', 'id': 3}
        ];
        return books.map(async item => {
            await axios.post('http://localhost:8080/books', item,
                {headers: {'Content-type': 'application/json'}});
        });
    });

    it('visits the bookish', () => {
        cy.visit('http://localhost:3000');
        cy.get('h2[data-test="heading"]').contains('Bookish');
    });

    it('Shows a book list', () => {
        cy.visit('http://localhost:3000');
        cy.get('div[data-test="book-list"]').should('exist');
        cy.get('div.book-item').should((books) => {
            expect(books).to.have.length(3);
            const titles = [...books].map(x => {
                return x.querySelector('h2')?.innerHTML;
            });
            expect(titles).to.deep.equal(['Refactoring', 'Domain-driven design', 'Building Microservices']);
        });
    });
});

export {};