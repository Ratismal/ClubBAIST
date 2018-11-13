const CBManager = require('./interfaces/CBManager');
const db = require('../models');

module.exports = class Client {
  constructor() {
    this.manager = new CBManager(this);
    this.db = db;
  }
};
