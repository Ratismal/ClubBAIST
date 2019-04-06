module.exports = class Scores {
    constructor(manager) {
        this.manager = manager;
        this.client = this.manager.client;
        this.db = this.client.db;
    }

    async getScores(startDate, endDate, memberID) {
        let where = {};
        if (startDate || endDate) where.Date = {};
        if (startDate) {
            where.Date[this.db.Sequelize.Op.gte] = startDate;
        }
        if (endDate) {
            where.Date[this.db.Sequelize.Op.lte] = endDate;
        }
        if (memberID) where.MemberID = memberID;
        let scores = await this.db.PlayerScore.findAll({
            where,
            include: ['Member'],
            order: [['Date', 'DESC']]
        });

        return scores.map(s => s.dataValues);
    }

    async submitScore(score) {
        await this.db.PlayerScore.create(score);
    }
};
