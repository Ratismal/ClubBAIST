module.exports = class Scores {
    constructor(manager) {
        this.manager = manager;
        this.client = this.manager.client;
        this.db = this.client.db;
    }

    async getScores() {
        let scores = await this.db.PlayerScore.findAll({
            where: {},
            include: ['Member'],
            order: [['Date', 'DESC']]
        });

        return scores.map(s => s.dataValues);
    }

    async submitScore(score) {
        await this.db.PlayerScore.create(score);
    }
};
