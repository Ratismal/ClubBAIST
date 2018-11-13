const CBManager = require('./interfaces/CBManager');
const db = require('../models');

module.exports = class Client {
  constructor() {
    this.db = db;
    this.manager = new CBManager(this);
  }
};
