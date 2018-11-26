module.exports = class Members {
  constructor(manager) {
    this.manager = manager;
    this.client = this.manager.client;
    this.db = this.client.db;
  }

  async getMember(memberID) {
    let member = await this.db.Member.findByPk(memberID);

    return member;
  }
};
