const express = require('express');
const logger = require('./util/logger');
const path = require('path');

logger.log('CDN', 'Booting up CDN...');

const cdn = express();
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');

//Express Security Configuration
cdn.use(cors({ origin: '*', methods: 'GET,POST' }));
cdn.use(compression());
cdn.use(helmet());
cdn.use(helmet.referrerPolicy({
  policy: 'no-referrer-when-downgrade'
}));
cdn.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"]
  }
}))

const port = 7071;
const ip = '0.0.0.0';

cdn.use((req, res, next) => {
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

// cdn.use('/images', express.static('./content/images'));

cdn.use('/images/:data_type/:id', (req, res, next) => {
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

cdn.use('/images/:data_type', (req, res, next) => {
  const ext = path.extname(req.params.data_type);
  if(ext) req.params.data_type = req.params.data_type.slice(0, req.params.data_type.length - ext.length);

  req.params.data_type = data_type_map[req.params.data_type] || req.params.data_type;

  res.sendFile(path.join(__dirname, '..', 'default_content', 'images', req.params.data_type + '.png'));
});

cdn.listen(port, ip);
logger.log('CDN', 'API started on ' + ip + ':' + port);
