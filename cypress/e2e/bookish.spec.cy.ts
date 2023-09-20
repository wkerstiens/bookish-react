import axios from 'axios';

const baseApiUrl: string = 'http://localhost:8080';
const baseAppUrl: string = 'http://localhost:3000';


describe('Bookish Application', () => {
    const rebuildDatabase = async () => {
        const books = [
            {'name': 'Refactoring', 'id': 1},
            {'name': 'Domain-driven design', 'id': 2},
            {'name': 'Building Microservices', 'id': 3}
        ];
        return books.map(async item => {
            await axios.post(`${baseApiUrl}/books`, item,
                {headers: {'Content-type': 'application/json'}});
        });
    }

    const deleteDatabaseEntries = async () => {
        try {
            return await axios
                .delete(`${baseApiUrl}/books?_cleanup=true`);
        } catch (err) {
            return err;
        }
    }

    before(async () => {
       await deleteDatabaseEntries();
    });

    afterEach(async () => {
        await deleteDatabaseEntries();
    });

    beforeEach(async () => {
         await rebuildDatabase();
    });

    after (async () => {
        await rebuildDatabase();
    });

    it('visits the bookish', () => {
        cy.visit(`${baseAppUrl}`);
        cy.get('h2[data-test="heading"]').contains('Bookish');
    });

    it('Shows a book list', () => {
        cy.visit(`${baseAppUrl}`);
        cy.get('div[data-test="book-list"]').should('exist');
        cy.get('div.book-item').should((books) => {
            expect(books).to.have.length(3);
            const titles = [...books].map(x => {
                return x.querySelector('h2')?.innerHTML;
            });
            expect(titles).to.deep.equal(['Refactoring', 'Domain-driven design', 'Building Microservices']);
        });
    });

    it('Goes to the detail page', () => {
        cy.visit(`${baseAppUrl}`);
        cy.get('div.book-item').contains('View Details').eq(0).click();
        cy.url().should('include', '/books/1');
        cy.get('h2.book-title').contains('Refactoring');
    });
});

export {};