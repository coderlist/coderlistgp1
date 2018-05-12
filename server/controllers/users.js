
const {pool} = require('./../db/database');

module.exports =  {
    createUser (req,res){
        const createQuery = `INSERT INTO users (username,email) VALUES \
                             ('${req.body.username}','${req.body.email}')`;
        pool.connect()
            .then(client => {
               return  client.query(createQuery)
                             .then(result => {
                                client.release();
                                res.status(200).send({message: 'User created',response:result.rows})
                        })
            })
            .catch(e => {
                res.status(400).send(e.stack)
            })
    },

    getAllUsers(req,res){
        const getUsersQuery = `SELECT * FROM "users"`;
        pool.connect()
            .then(client => {
               return  client.query(getUsersQuery)
                      .then(result => {
                          client.release();
                          res.status(200).send({
                              response: result.rows
                          })
                      })
            })
            .catch(e => {
                res.status(400).send(e);
            })
    }
}



