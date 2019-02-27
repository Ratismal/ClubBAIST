module.exports = class TeeTimes {
  constructor(manager) {
    this.manager = manager;
    this.client = this.manager.client;
    this.db = this.client.db;
  }

  async addTeeTime(teetime) {
    console.log('Adding Tee Time');
    try {
      console.log(teetime.Date);
      await this.db.TeeTime.create(teetime);

      return true;
    } catch (err) {
      console.error(err);
      return {
        error: true,
        err
      };
    }
  }

  async deleteTeeTime(teetimeID) {
    try {
      let teetime = await this.db.TeeTime.findByPk(teetimeID);
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

  async getMemberTeeTimes(memberID) {
    let where = {};
    if (memberID) where.Player1ID = memberID;
    let teetimes = await this.db.TeeTime.findAll({
      where,
      include: ['Player1', 'Player2', 'Player3', 'Player4']
    });
    teetimes.forEach(element => {
      if (teetimes.Player1)
        teetimes.Player1 = teetimes.Player1.dataValues;
      if (teetimes.Player2)
        teetimes.Player2 = teetimes.Player2.dataValues;
      if (teetimes.Player3)
        teetimes.Player3 = teetimes.Player3.dataValues;
      if (teetimes.Player4)
        teetimes.Player4 = teetimes.Player4.dataValues;
    });
    return teetimes;
  }

  async addStandingTeeTime(standingTeetime) {
    await this.db.StandingTeeTime.create(standingTeetime);
    return true;
  }
};
