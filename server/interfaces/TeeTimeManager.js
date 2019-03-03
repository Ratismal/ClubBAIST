const moment = require('moment');

module.exports = class TeeTimes {
  constructor(manager) {
    this.manager = manager;
    this.client = this.manager.client;
    this.db = this.client.db;
  }

  async addTeeTime(teetime) {
    console.log('Adding Tee Time');
    try {
      let existing = await this.getTeeSheet(teetime.Timeslot);
      let t = moment(teetime.Timeslot).valueOf();
      if (existing.find(tt => tt.dataValues.Timeslot.valueOf() === t)) {
        return {
          error: true,
          message: 'A TeeTime already exists in this timeslot.'
        };
      }
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

  async getTeeSheet(date) {
    let d = date || Date.now();
    let m = moment(d);
    let start = m.clone().startOf('day');
    let end = m.clone().endOf('day');
    let dayOfWeek = start.day();
    const teetimes = await this.db.TeeTime.findAll({
      where: {
        Timeslot: {
          [this.db.Sequelize.Op.between]: [start.toDate(), end.toDate()]
        }
      },
      include: ['Player1', 'Player2', 'Player3', 'Player4']
    });
    console.log('day of week', dayOfWeek);
    const standingTeetimes = await this.db.StandingTeeTime.findAll({
      where: {
        RequestedDay: dayOfWeek,
        RequestedStartDate: {
          [this.db.Sequelize.Op.lte]: start.toDate()
        },
        RequestedEndDate: {
          [this.db.Sequelize.Op.gte]: start.toDate()
        },
        ApprovedDate: {
          [this.db.Sequelize.Op.not]: null
        }
      },
      include: ['Player1', 'Player2', 'Player3', 'Player4']
    });
    for (const stt of standingTeetimes) {
      let values = stt.dataValues;
      let comps = values.ApprovedTeeTime.split(':');
      let time = start.clone().add(comps[0], 'hours').add(comps[1], 'minutes');
      values.Timeslot = time.toDate();
      if (!teetimes.find(tt => tt.dataValues.Timeslot.valueOf() === values.Timeslot.valueOf()))
        teetimes.push({dataValues: values});
    }
    return teetimes;
  }

  async getStandingTeeTimes() {
    try {
      const existing = await this.db.StandingTeeTime.findAll({
        where: {
          ApprovedDate: null
        },
        include: ['Player1', 'Player2', 'Player3', 'Player4']
      });

      return existing;
    } catch (err) {
      console.error(err);
      return {
        error: true,
        err
      };
    }
  }

  async addStandingTeeTime(standingTeetime) {
    console.log('Adding Standing Tee Time');
    try {
      const existing = await this.db.StandingTeeTime.findAll({
        where: {
          Player1ID: standingTeetime.Player1ID
        }
      });
      if (existing.length > 0) {
        return {
          error: true,
          message: 'You already have a standing teetime request.'
        };
      }

      await this.db.StandingTeeTime.create(standingTeetime);

      return true;
    } catch (err) {
      console.error(err);
      return {
        error: true,
        err
      };
    }
  }

  async approveStandingTeeTime(id, body) {
    console.log('Approving Standing Tee Time');
    try {
      const existing = await this.db.StandingTeeTime.findByPk(id);
      if (existing) {
        existing.set('ApproverID', body.ApproverID);
        existing.set('ApprovedDate', body.ApprovedDate);
        existing.set('ApprovedTeeTime', body.ApprovedTeeTime);
        existing.set('PriorityNumber', body.PriorityNumber);

        await existing.save();
      } else return {
        error: true,
        message: 'No standing teetime found.'
      };
      return true;
    } catch (err) {
      console.error(err);
      return {
        error: true,
        err
      };
    }
  }
};
