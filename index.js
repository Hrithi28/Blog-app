const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up EJS templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// In-memory data store for blog posts
// Each post: { id: string, title: string, content: string, c reatedAt: Date }
let posts = [];

// Routes

// 1. Home page: view all posts
app.get('/', (req, res) => {
    res.render('index', { posts });
});

// 2. New post form
app.get('/posts/new', (req, res) => {
    res.render('new');
});

// 3. Create a new post
app.post('/posts/new', (req, res) => {
    const { title, content } = req.body;
    const newPost = {
        id: Date.now().toString(),
        title,
        content,
        createdAt: new Date()
    };
    posts.push(newPost);
    res.redirect('/');
});

// 4. Edit post form
app.get('/posts/edit/:id', (req, res) => {
    const post = posts.find(p => p.id === req.params.id);
    if (!post) {
        return res.status(404).send('Post not found');
    }
    res.render('edit', { post });
});

// 5. Update post
app.post('/posts/edit/:id', (req, res) => {
    const { title, content } = req.body;
    const postIndex = posts.findIndex(p => p.id === req.params.id);
    if (postIndex !== -1) {
        posts[postIndex].title = title;
        posts[postIndex].content = content;
        res.redirect('/');
    } else {
        res.status(404).send('Post not found');
    }
});

// 6. Delete post
app.post('/posts/delete/:id', (req, res) => {
    posts = posts.filter(p => p.id !== req.params.id);
    res.redirect('/');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
