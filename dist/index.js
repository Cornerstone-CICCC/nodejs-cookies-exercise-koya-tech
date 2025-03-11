"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'views'));
const users = {
    admin: 'admin12345'
};
// Middleware to protect routes
function isAuthenticated(req, res, next) {
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
    }
    else {
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
