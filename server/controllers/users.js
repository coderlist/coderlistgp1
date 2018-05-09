const {pool} = require('./../db/database');

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })


const userControllers = {
    createUser (req,res){
        const createQuery = `INSERT INTO "User" VALUES ('myname','email' \
                             ,null,null,null,null,null,null,7)`;
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
    }
}

userControllers.createUser();

