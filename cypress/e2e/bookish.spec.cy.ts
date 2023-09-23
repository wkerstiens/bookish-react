import axios from 'axios';

const baseApiUrl: string = 'http://localhost:8080';
const baseAppUrl: string = 'http://localhost:3000';
const appTitle: string = "Bookish";
const books = [
    {
        "name": "Refactoring",
        "id": 1,
        "description": "Martin Fowler's Refactoring defined core ideas and techniques ..."
    },
    {
        "name": "Domain-driven design",
        "id": 2,
        "description": "Explains how to incorporate effective domain modeling into software development process."
    },
    {
        "name": "Building Microservices",
        "id": 3,
        "description": "Author Sam Newman provides you with a firm grounding in the concepts while ..."
    },
    {
        "name": "Acceptance Test Driven Development with React",
        "id": 4,
        "description": "This book describes how to apply the Acceptance Test Driven Development ..."
    }
];

describe('Bookish Application', () => {
    const rebuildDatabase = async () => {
        return books.map(async item => {
            await axios.post(`${baseApiUrl}/books`, item,
                {headers: {'Content-type': 'application/json'}});
        });
    };

    const deleteDatabaseEntries = async () => {
        try {
            return await axios.delete(`${baseApiUrl}/books?_cleanup=true`);
        } catch (err) {
            return err;
        }
    };

    before(async () => {
        await deleteDatabaseEntries();
    });

    afterEach(async () => {
        await deleteDatabaseEntries();
    });

    beforeEach(async () => {
        await rebuildDatabase();
        gotoApp();
    });

    after(async () => {
        await rebuildDatabase();
    });

    const gotoApp = () => {
        cy.visit(baseAppUrl);
    };

    const checkAppTitle = () => {
        cy.get('h2[data-test="heading"]').contains(appTitle);
    };

    const checkBookListWith = (expectation: string[] = []) => {
        cy.get('div[data-test="book-list"]').should('exist');
        cy.get('div.book-item').should((books) => {
            expect(books).to.have.length(expectation.length);

            const titles = [...books].map(x => {
                return x.querySelector('h2')?.innerHTML;
            });
            expect(titles).to.deep.equal(expectation);
        });
    };

    const performSearch = (search: string) => {
        cy.get('div.book-item').should('have.length', 4);
        cy.get('[data-test="search"] input').type(search);
        cy.get('div.book-item').should('have.length', 1);
    }

    const gotoNthBookInTheBookList = (index: number) => {
        cy.get('div.book-item').contains('View Details').eq(index).click();
        cy.url().should('include', `/books/${index+1}`);
    }

    const checkBookDetail = (index: number) => {
        cy.get('h2.book-title').contains(books[index].name);
    }

    it('visits the bookish', () => {
        checkAppTitle();
    });

    it('Shows a book list', () => {
        checkBookListWith(['Refactoring', 'Domain-driven design', 'Building Microservices', "Acceptance Test Driven Development with React"]);
    });

    it('Goes to the detail page', () => {
        gotoNthBookInTheBookList(0);
        checkBookDetail(0);
    });

    it('Searches for a title', () => {
        checkBookListWith(['Refactoring', 'Domain-driven design', 'Building Microservices', "Acceptance Test Driven Development with React"]);
        performSearch('design');
        checkBookListWith(['Domain-driven design']);
    });
});

export {};