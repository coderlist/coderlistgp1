const request = require('supertest');
const app = require('../../server');
const {pool} = require('./../db/database');



beforeEach((done) =>{
    pool.connect()
    .then(client => {
    return  client.query(`DELETE FROM users`)
                  .then(() => done())
                  client.release();
    }).catch(e => done(e))
    
})

describe('POST /users' , ()=>{
    test('should create a new user and return single row', (done) => {
          const username = 'testUserName';
          const email = 'text@email.run';

          request(app)
             .post('/users')
             .send({
                 username,
                 email
             })
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
                      }).catch(e => done(e))
                 
                 
             })
    } )
})

