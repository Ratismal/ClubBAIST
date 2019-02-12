'use strict';
module.exports = (sequelize, Sequelize) => {
    const TeeTime = sequelize.define('StandingTeeTime', {
        StandingTeeTimeID: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.INTEGER,
            autoIncrement: true
        },
        Player1ID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        Player2ID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        Player3ID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        Player4ID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        RequestedDay: {
            type: Sequelize.INTEGER,
            validate: {
                min: 0,
                max: 6
            },
            allowNull: false
        },
        RequestedTeeTime: {
            type: Sequelize.TIME,
            allowNull: false
        },
        RequestedStartDate: {
            type: Sequelize.DATE,
            allowNull: false
        },
        RequestedEndDate: {
            type: Sequelize.DATE,
            allowNull: false
        },
        ApprovedTeeTime: {
            type: Sequelize.TIME,
            allowNull: true
        },
        ApprovedDate: {
            type: Sequelize.TIME,
            allowNull: true
        },
        PriorityNumber: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        ApproverID: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });
    TeeTime.associate = function (models) {
        TeeTime.belongsTo(models.Member, { foreignKey: 'Player1ID', targetKey: 'MemberID', as: 'Player1' });
        TeeTime.belongsTo(models.Member, { foreignKey: 'Player2ID', targetKey: 'MemberID', as: 'Player2' });
        TeeTime.belongsTo(models.Member, { foreignKey: 'Player3ID', targetKey: 'MemberID', as: 'Player3' });
        TeeTime.belongsTo(models.Member, { foreignKey: 'Player4ID', targetKey: 'MemberID', as: 'Player4' });
        TeeTime.belongsTo(models.Member, { foreignKey: 'ApproverID', targetKey: 'MemberID', as: 'Approver' });
        // associations can be defined here
    };
    return TeeTime;
};
