const {queryHelper} = require('../../helperFunctions/queryHelper')

/**
 * exports all pages database query functions
 * using queryHelper function
 */

module.exports = {
    /** create a new user */
    createUser(req, res) {
        console.log('making user')
        const query = `INSERT INTO users (email,password,first_name, \
                       last_name) VALUES ('${req.body.email}', \
                       '${req.body.password}','${req.body.first_name}',\
                       '${req.body.last_name}')`;

        queryHelper(query).then((data) => {
            res.status(200).send({
                message: 'User Created',
                response: data.rows
            })
        }).catch(e => res.status(400).send(e))
    },
    
    /** send a list of all users */
    getAllUsers(req, res) {
        const query = `SELECT * FROM "users"`;
        queryHelper(query).then((data) => {
            res.status(200).send({
                response: data.rows
            })
        }).catch(e => res.status(400).send(e.message))
    }
}