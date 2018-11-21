const Members = require('./Members');
const TeeTimes = require('./TeeTimes');

module.exports = class CBManager {
  constructor(client) {
    this.client = client;

    this.Members = new Members(this);
    this.TeeTimes = new TeeTimes(this);
  }

  async getMember(id) {
    return await this.Members.getMember(id);
  }

  async reserveTeeTime(...args) {
    console.log('Reserving Tee Time');
    return await this.TeeTimes.addTeeTime(...args);
  }

  async listMemberTeeTimes(memberId) {
    return await this.TeeTimes.getMemberTeeTimes(memberId);
  }

  async cancelTeeTime(teeTimeID) {
    return await this.TeeTimes.deleteTeeTime(teeTimeID);
  }
};
