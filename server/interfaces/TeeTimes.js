module.exports = class TeeTimes {
  constructor(manager) {
    this.manager = manager;
    this.client = this.manager.client;
    this.db = this.client.db;
  }

  async addTeeTime(MemberID, PlayerCount, CartCount, date, Player2, Player3, Player4) {
    console.log('Adding Tee Time');
    try {
      console.log(date);
      await this.db.TeeTime.create({
        MemberID, PlayerCount, CartCount, Date: date,
        Player2, Player3, Player4
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
};
