module.exports = class Members {
  constructor(manager) {
    this.manager = manager;
    this.client = this.manager.client;
    this.db = this.client.db;
  }

  async getMember(id) {
    let member = await this.db.Member.findByPk(id);

    return member;
  }
};
