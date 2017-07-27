const moment = require('moment');

module.exports = {

  logFormat: 'hh:mm:ss YYYY-MM-DD',

  /**
   * @param {string} subject
   * @param {string} message
   * @param {any[]} optionalParams
   * @return void
   */
  log: function(subject, message, ...optionalParams) {
    console.log(`[${moment().format(this.logFormat)}][LOG][${subject}]:`, message, ...optionalParams);
  },

  /**
   * @param {string} subject
   * @param {string} message
   * @param {any[]} optionalParams
   * @return void
   */
  warn: function(subject, message, ...optionalParams) {
    console.warn(`[${moment().format(this.logFormat)}][WARN][${subject}]:`, message, ...optionalParams);
  },

  /**
   * @param {string} subject
   * @param {string} message
   * @param {any[]} optionalParams
   * @return void
   */
  error: function(subject, message, ...optionalParams) {
    console.error(`[${moment().format(this.logFormat)}][ERROR][${subject}]:`, message, ...optionalParams);
  }
};
