const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const cors = require('cors');

server.use(
    cors({
        origin: true,
        credentials: true,
        preflightContinue: false,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
    })
);
server.options('*', cors());

const bodyParser = require('body-parser');

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));

server.use(middlewares);

server.get('/books', async (req, res, next) => {
    const db = router.db;
    res.json((await db.get('books', null))
        .sort((book1, book2) => book1.id < book2.id ? -1 : 1));
});


server.delete('/books', async (req, res, next) => {
    if (req.query['_cleanup']) {
        console.log('Database has been wiped out!!!!');
        const db = router.db;
        db.set('books', []).write();
    }
    res.sendStatus(204);
});

// server.post('/books', async (req, res, next) => {
//     const db = router.db;
//     db.books.push(req.body);
//     console.log(db);
//     db.write();
//     res.sendStatus(204);
// });
//
// server.delete('/books/:id/reviews', (req, res) => {
//     const {id} = req.params;
//
//     const book = router.db.get('books').find({id: parseInt(id)}).value();
//     book.reviews = [];
//     router.db.write();
//
//     res.sendStatus(204);
// });
//
// server.post('/books/:id/reviews', (req, res) => {
//     const {id} = req.params;
//     const {name, content} = req.body;
//
//     const book = router.db.get('books').find({id: parseInt(id)}).value();
//     if (book) {
//         if (!book.reviews) {
//             book.reviews = [];
//         }
//
//         const review = {id: book.reviews.length + 1, bookId: Number(id), name, content};
//
//         book.reviews.push(review);
//         router.db.write();
//
//         res.status(201).json(review);
//     } else {
//         res.status(404).json({error: 'Book not found'});
//     }
// });
//
// server.put('/books/:bookId/reviews/:reviewId', (req, res) => {
//     const {bookId, reviewId} = req.params;
//     const {name, content} = req.body;
//
//     const book = router.db.get('books').find({id: parseInt(bookId)}).value();
//     if (book) {
//         const review = book.reviews.find((r) => r.id === parseInt(reviewId));
//         if (review) {
//             review.name = name;
//             review.content = content;
//             router.db.write();
//
//             res.status(200).json(review);
//         } else {
//             res.status(404).json({error: 'Review not found'});
//         }
//     } else {
//         res.status(404).json({error: 'Book not found'});
//     }
// });

server.use(router);
server.listen(8080, () => {
    console.log('JSON Server is running');
});