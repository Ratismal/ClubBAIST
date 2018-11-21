module.exports = class TeeTimes {
  constructor(manager) {
    this.manager = manager;
    this.client = this.manager.client;
    this.db = this.client.db;
  }

  async addTeeTime(MemberID, PlayerCount, CartCount, date) {
    console.log('Adding Tee Time');
    try {
      console.log(date);
      await this.db.TeeTime.create({
        MemberID, PlayerCount, CartCount, Date: date
      });

      return true;
    } catch (err) {
      console.error(err);
      return {
        error: true,
        err
      };
    }
  }

  async deleteTeeTime(teeTimeId) {
    try {
      let teetime = await this.db.TeeTime.findByPk(teeTimeId);
      await teetime.destroy();
      return true;
    } catch (err) {
      console.error(err);
      return {
        error: true,
        err
      };
    }
  }

  async getMemberTeeTimes(memberId) {
    let teetimes = await this.db.TeeTime.findAll({
      where: {
        MemberID: memberId
      }
    });
    return teetimes;
  }
};
