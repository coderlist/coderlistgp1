const request = require('supertest');
const app = require('../server');
const {pool} = require('../server/db/database');



beforeEach((done) =>{
     pool.connect()
     .then(client => {
     return  client.query(`DELETE FROM users`)
                   .then(() => {
                    client.release();
                    done();
                   })              
     }).catch(e => done(e))
 })
 



describe('test all /users POST request' , ()=>{
  
    it('should create a new user and return single row', (done) => {
          const entry = {
              email: 'me@me1.com',
              password: 'pass',
              first_Name : 'first',
              last_Name : 'last'
          }

          request(app)
             .post('/users')
             .send(entry)
             .expect(200)
             .expect(res => {
                 console.log(res.body)
                 expect(res.body.message).toBe('User created')
             })
             .end((err, res) =>{
                 if(err) {
                     return done(err) }
                     pool.connect()
                         .then(client => {
                         return  client.query(`SELECT COUNT(*) FROM users`)
                        .then((res) => {
                            expect(res.rows[0].count).toBe('1');
                            client.release();
                            done();
                        })
                      }).catch(e => {
                         console.log(e.message,e.stack);
                         done(e)
                      })
                 
                 
             })
    } )
})

