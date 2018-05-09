const {pool} = require('./../db/database');

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })


module.exports =  {
    createUser (req,res){
        const createQuery = `INSERT INTO "Users" VALUES ('myname','email' \
                             ,null,null,null,null,null,null,10)`;
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



