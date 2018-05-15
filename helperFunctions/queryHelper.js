const {pool} = require('../server/db/database');

/** takes sql query and returns a promise */

const queryHelper = (query) => {
    return new Promise((resolve, reject) => {
        pool.connect()
            .then(client => {
                return client.query(query)
                    .then(response => {
                        resolve(response);
                        client.release();
                    })
            })
            .catch(e => {
                client.release();
                reject(e);
            })
    })
}

module.exports = {queryHelper};