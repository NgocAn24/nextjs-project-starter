const express = require('express');
const path = require('path');
const app = express();

// Serve static files
app.use(express.static('./'));

// Serve index.html for all routes (SPA style)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
