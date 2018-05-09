const {pool} = require('./../db/database');

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })


const userControllers = {
    createUser (req,res){
        const createQuery = `INSERT INTO "User" VALUES ('myname','email' \
                             ,null,null,null,null,null,null,10)`;
        pool.connect()
            .then(client => {
               return  client.query(createQuery)
                      .then(result => {
                          client.release();
                          console.log({
                              message: 'User created',
                              result
                          })
                      })
            })
            .catch(e => {
                console.log(e)
            })
    },

    getAllUsers(req,res){
        const getUsersQuery = `SELECT * FROM "User"`;
        pool.connect()
            .then(client => {
               return  client.query(getUsersQuery)
                      .then(result => {
                          client.release();
                          console.log({
                              users: result.rows
                          })
                      })
            })
            .catch(e => {
                console.log(e)
            })
    }
}

//userControllers.createUser();
//userControllers.getAllUsers();

