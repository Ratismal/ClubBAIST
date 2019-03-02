const Members = require('./MemberManager');
const TeeTimes = require('./TeeTimeManager');

module.exports = class CBManager {
  constructor(client) {
    this.client = client;

    this.Members = new Members(this);
    this.TeeTimes = new TeeTimes(this);
  }

  async reserveTeeTime(teetime) {
    return await this.TeeTimes.addTeeTime(teetime);
  }

  async cancelTeeTime(teetimeID) {
    return await this.TeeTimes.deleteTeeTime(teetimeID);
  }

  async reserveStandingTeeTime(standingTeetime) {
    return await this.TeeTimes.addStandingTeeTime(standingTeetime);
  }

  async getMember(memberID) {
    return await this.Members.getMember(memberID);
  }

  async listMemberTeeTimes(memberID) {
    return await this.TeeTimes.getMemberTeeTimes(memberID);
  }

  async getTeeSheet(date) {
    return await this.TeeTimes.getTeeSheet(date);
  }

  async getStandingTeeTimes() {
    return await this.TeeTimes.getStandingTeeTimes();
  }

  async approveStandingTeeTimes(id, body) {
    return await this.TeeTimes.approveStandingTeeTime(id, body);
  }
};
