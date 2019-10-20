const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');

const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/app.js', (req, res, next) => res.sendFile(path.join(__dirname, '../public', 'main.js')));

app.get('/', (req, res, next) => res.sendFile(path.join(__dirname, '../public', 'index.html')));
// another way to serve TOKEN from server to client (Jason suggested) 
// output same content as index.html
// also process browser.js and inject <script> with token attached to window object (window.TOKEN)

app.get('/token', (req, res, next) => {
  res.send(process.env.REACT_MAP_MAPBOX_TOKEN);
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`app listening on port ${PORT}`);
});
