const express = require('express');
const cors = require('cors');
const logger = require('./util/logger');
const path = require('path');

logger.log('CDN', 'Booting up CDN...');

const app = express();

app.use(cors({ origin: '*', methods: 'GET' }));

const port = 7071;
const ip = '0.0.0.0';

app.use((req, res, next) => {
  const host = req.headers.origin || req.headers.host || req.ip;
  logger.log('HTTP', `${req.method} ${req.hostname}${req.originalUrl} from ${host}`);
  next();
});


const data_type_map = {
  'race': 'races',
  'class': 'classes',
  'discipline': 'disciplines',
  'power': 'powers'
};

// app.use('/images', express.static('./content/images'));

app.use('/images/:data_type/:id', (req, res, next) => {
  const ext = path.extname(req.params.id);
  if(ext) req.params.id = req.params.id.slice(0, req.params.id.length - ext.length);

  req.params.data_type = data_type_map[req.params.data_type] || req.params.data_type;

  res.sendFile(path.join(__dirname, '..', 'content', 'images', req.params.data_type, req.params.id + '.png'), null, (err) => {
    if(err) {
      logger.error('images', err);
      if(Object.keys(req.query).find(a => a === "noDefault"))
        res.sendStatus(404)
      else
        res.sendFile(path.join(__dirname, '..', 'default_content', 'images', req.params.data_type + '.png'));
    }
  });
});

app.use('/images/:data_type', (req, res, next) => {
  const ext = path.extname(req.params.data_type);
  if(ext) req.params.data_type = req.params.data_type.slice(0, req.params.data_type.length - ext.length);

  req.params.data_type = data_type_map[req.params.data_type] || req.params.data_type;

  res.sendFile(path.join(__dirname, '..', 'default_content', 'images', req.params.data_type + '.png'));
});

app.listen(port, ip);
logger.log('CDN', 'API started on ' + ip + ':' + port);