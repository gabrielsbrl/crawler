const mysql = require('mysql');

module.exports = app => {
    return {
        connection: mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'admin',
            database: 'c-produtos',
            charset: 'utf8'
        }),
        query: function(query) {
            return new Promise((resolve, reject) => {

                this.connection.query(query, function(error, results, fields) {
                    if(error) reject(error);
                    resolve(results);
                })

            })
        },
        select: async function(table) {
            return await this.query(`select * from ${table}`);            
        },
        insert: async function(table, data) {

            let fieldsOfData = Object.keys(data);

            let fields = fieldsOfData.map(f => `${f}, `).join(``);
            fields = `(${fields})`;

            let values = fieldsOfData.map(f => `'${data[f]}', `).join('');
            values = `(${values})`;

            let sqlQuery = `insert into ${table} ${fields.replace(/ /g, '').replace(',)', ')')} values ${values.replace(', )', ')')}`;

            let response = await this.query(sqlQuery); 

            return response;
        },
        delete: async function(table, id) {
            return await this.query(`delete from ${table} where id = ${id}`);
        }
    };
}