module.exports = class TeeTimes {
  constructor(manager) {
    this.manager = manager;
    this.client = this.manager.client;
    this.db = this.client.db;
  }

  async addTeeTime(MemberID, PlayerCount, CartCount, date) {
    console.log('Adding Tee Time');
    try {
      await this.db.TeeTime.create({
        MemberID, PlayerCount, CartCount, Date
      });

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
};
