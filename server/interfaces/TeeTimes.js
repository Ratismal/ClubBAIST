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
    let teetimes = await this.db.TeeTime.findAll({
      where: {
        MemberID: memberID
      },
      include: ['P1', 'P2', 'P3', 'P4']
    });
    teetimes.forEach(element => {
      if (teetimes.P1)
        teetimes.P1 = teetimes.P1.dataValues;
      if (teetimes.P2)
        teetimes.P2 = teetimes.P2.dataValues;
      if (teetimes.P3)
        teetimes.P3 = teetimes.P3.dataValues;
      if (teetimes.P4)
        teetimes.P4 = teetimes.P4.dataValues;
    });
    return teetimes;
  }

  async addStandingTeeTime(standingTeetime) {
    await this.db.StandingTeeTime.create(standingTeetime);
    return true;
  }
};
