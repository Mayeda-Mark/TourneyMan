const Sequelize = require('sequelize');
const db = new Sequelize('postgres://tdtcovdqovegae:dbcf60e41c7a89ea58e988a1c12c5d00f571cffa511c266022c4dbe0e7509109@ec2-54-221-214-183.compute-1.amazonaws.com:5432/d2m340flohpr2g?ssl=true' /*{
    database: 'd2m340flohpr2g',
    username: 'tdtcovdqovegae',
    password: 'dbcf60e41c7a89ea58e988a1c12c5d00f571cffa511c266022c4dbe0e7509109',
    host: 'ec2-54-221-214-183.compute-1.amazonaws.com',
    port: '5432',
    dialect: 'postgres'
}*/);
const UserInfo = db.define('userInfo', {
    userId: {
        field: 'user_id',
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    UserName: {
        field: 'user_name',
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        field: 'password',
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = {
    UserInfo,
    db
}