const express = require('express');
const { engine } = require('express-handlebars'); // Cara impor terbaru
const { Pool } = require('pg');
const session = require('express-session');
const bcrypt = require('bcrypt');
const app = express();
const hbs = require('hbs'); // Import hbs for helper registration

// Setup Handlebars dengan cara terbaru
app.set('view engine', 'hbs');
app.engine('hbs', engine({ extname: '.hbs', defaultLayout: 'main',
    helpers: {
        eq: (a, b) => a === b}  // Registering the eq helper directly here
}));

// Register the eq helper
hbs.registerHelper('eq', (a, b) => a === b);

// PostgreSQL Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'wiki_games',
    password: 'topal123',
    port: 5432,
});

// Test connection to PostgreSQL
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Database connected successfully');
    release(); // Release the client back to the pool
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

// Halaman Home
app.get('/', (req, res) => {
    res.render('index', { user: req.session.user });
});

// Halaman Login
app.get('/login', (req, res) => {
    res.render('login');
});

// Halaman Register
app.get('/register', (req, res) => {
    res.render('register');
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Hashing function for passwords
function hashPassword(password) {
    return bcrypt.hashSync(password, 10);
}

// Check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
}

// Register User
app.post('/register', async (req, res) => {
    const { email, username, password } = req.body;
    const hashedPassword = hashPassword(password);
    await pool.query('INSERT INTO users_tb (email, username, password) VALUES ($1, $2, $3)', [email, username, hashedPassword]);
    res.redirect('/login');
});

// Login User
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await pool.query('SELECT * FROM users_tb WHERE email = $1', [email]);
    if (user.rows.length > 0 && bcrypt.compareSync(password, user.rows[0].password)) {
        req.session.user = user.rows[0]; // Menyimpan data user di session
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

// Route untuk menampilkan form tambah type
app.get('/add-type', isAuthenticated, (req, res) => {
    res.render('add-type', { user: req.session.user });
});

// Add Type
app.post('/add-type', isAuthenticated, async (req, res) => {
    const { name } = req.body;
    await pool.query('INSERT INTO type_tb (name) VALUES ($1)', [name]);
    res.redirect('/types');
});

// List Types
app.get('/types', isAuthenticated, async (req, res) => {
    const types = await pool.query('SELECT * FROM type_tb');
    res.render('types', { types: types.rows, user: req.session.user });
});

// Route untuk menampilkan form edit type
app.get('/edit-type/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const typeQuery = await pool.query('SELECT * FROM type_tb WHERE id = $1', [id]);

    if (typeQuery.rows.length === 0) {
        return res.status(404).send('Type not found');
    }

    res.render('edit-type', { type: typeQuery.rows[0], user: req.session.user });
});

// Update Type
app.post('/edit-type/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    await pool.query('UPDATE type_tb SET name = $1 WHERE id = $2', [name, id]);
    res.redirect('/types');
});

// Delete Type
app.post('/delete-type/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM type_tb WHERE id = $1', [id]);
    res.redirect('/types');
});

// Route untuk menampilkan form tambah hero
app.get('/add-hero', isAuthenticated, async (req, res) => {
    const typesQuery = await pool.query('SELECT * FROM type_tb'); // Fetch all types
    res.render('add-hero', { user: req.session.user, types: typesQuery.rows });
});

// Add Hero
app.post('/add-hero', isAuthenticated, async (req, res) => {
    const { name, type_id, photo } = req.body;
    const user_id = req.session.user.id;
    await pool.query('INSERT INTO heroes_tb (name, type_id, photo, user_id) VALUES ($1, $2, $3, $4)', [name, type_id, photo, user_id]);
    res.redirect('/heroes');
});

app.get('/edit-hero/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const heroQuery = await pool.query('SELECT * FROM heroes_tb WHERE id = $1', [id]);
    const typesQuery = await pool.query('SELECT * FROM type_tb'); // Ambil semua tipe

    if (heroQuery.rows.length === 0) {
        return res.status(404).send('Hero not found');
    }

    res.render('edit-hero', { hero: heroQuery.rows[0], types: typesQuery.rows, user: req.session.user });
});

// Update Hero
app.post('/edit-hero/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { name, type_id, photo } = req.body;
    await pool.query('UPDATE heroes_tb SET name = $1, type_id = $2, photo = $3 WHERE id = $4', [name, type_id, photo, id]);
    res.redirect('/heroes');
});

// List Heroes
app.get('/heroes', isAuthenticated, async (req, res) => {
    const heroes = await pool.query('SELECT heroes_tb.*, type_tb.name AS type_name FROM heroes_tb JOIN type_tb ON heroes_tb.type_id = type_tb.id');
    res.render('heroes', { heroes: heroes.rows, user: req.session.user });
});

// Show Hero Details
app.get('/hero/:id', async (req, res) => {
    const { id } = req.params;
    const hero = await pool.query('SELECT heroes_tb.*, type_tb.name AS type_name FROM heroes_tb JOIN type_tb ON heroes_tb.type_id = type_tb.id WHERE heroes_tb.id = $1', [id]);
    res.render('hero-detail', { hero: hero.rows[0], user: req.session.user });
});

// Delete Hero
app.post('/delete-hero/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM heroes_tb WHERE id = $1', [id]);
    res.redirect('/heroes');
});


// Start server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});