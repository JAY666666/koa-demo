const mysql = require("mysql");
const config = require("../config/index");

const connection = mysql.createConnection({
    host: config.database.HOST,
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
})

class Mysql {
    constructor() {

    }

    login(data) {
        return new Promise((resolve,reject) => {
            connection.query('SELECT * from login where phone=? and password=?', [data.phone,data.password], (error,results,fields) => {
                if(error) {
                    reject(error)
                }
                resolve(results)
            })
        })
    }
    getUserInfo() {
        return new Promise((resolve,reject) => {
            connection.query('SELECT * from user', (error,results,fields) => {
                if(error) {
                    reject(error)
                }
                resolve(results)
            })
        })
    }

    getList() {
        return new Promise((resolve,reject) => {
            connection.query('SELECT * from list', (error,results,fields) => {
                if(error) {
                    reject(error)
                }
                resolve(results)
            })
        })
    }
}

module.exports = new Mysql()