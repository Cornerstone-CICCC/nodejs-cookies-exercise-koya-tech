import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// In-memory user "database"
type Users = {
    [key: string]: string;
};

const users:Users = {
    admin: 'admin12345'
};

// Middleware to protect routes
function isAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.cookies && req.cookies.username && users[req.cookies.username]) {
        return next();
    }
    res.redirect('/login');
}

// Home page (dummy text)
app.get('/', (req, res) => {
    res.render('home', { username: req.cookies.username });
});

// Login page (GET)
app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// Login form submission (POST)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username] === password) {
        // Set cookie on valid login
        res.cookie('username', username, { httpOnly: true });
        res.redirect('/profile');
    } else {
        res.render('login', { error: 'Invalid credentials. Please try again.' });
    }
});

// Protected profile page
app.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', { username: req.cookies.username });
});

// Logout route
app.get('/logout', (req, res) => {
    res.clearCookie('username');
    res.redirect('/login');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});