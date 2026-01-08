const express = require('express');
const authRoutes = require('./routes/auth.routes');
const eventRoutes = require('./routes/event.routes');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Virtual Event Management is running');
  });
  

app.use('/api', authRoutes);
app.use('/api/events', eventRoutes);

module.exports = app;
