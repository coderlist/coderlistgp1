
const {pool} = require('./../db/database');

module.exports =  {
    createUser (req,res){
        const createQuery = format(`INSERT INTO Users (username) VALUES ('${req.body.username}')`);
        pool.connect()
            .then(client => {
               return  client.query(createQuery)
                      .then(result => {
                          client.release();
                          res.status(200).send({message: 'User created'})
                      })
            })
            .catch(e => {
                res.status(400).send(e)
            })
    },

    getAllUsers(req,res){
        const getUsersQuery = `SELECT * FROM "Users"`;
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



