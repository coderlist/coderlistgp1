let request = require('supertest'),
   app     = require('../server',)
   expect = require('chai');
   

describe('Page requests' , function (){
    it('should load home page', function (done){
        request(app)
        .get('/')
        .expect(200, done)
    });
    it('should load about page', function (done){
        request(app)
        .get('/about')
        .expect(200, done)
    });
    it('should load login page', function (done){
      request(app)
      .get('/login')
      .expect(200, done)
    });
    it('should load reset-password page', function (done){
      request(app)
      .get('/reset-password')
      .expect(200, done)
    });
    it('should not load create-user page', function (done){
      request(app)
      .get('/users/create-user')
      .expect(302, done)
    });
    it('should not load admin page', function (done){
        request(app)
        .get('/users/admin', )
        .expect(302, done)
    });
    it('should not load edit-user page', function (done){
        request(app)
        .get('/users/edit-user')
        .expect(302, done)
    });
    it('should not load change email page', function (done){
        request(app)
        .get('/users/change email')
        .expect(302, done)
    });
    it('should not load dashboard page', function (done){
        request(app)
        .get('/users/edit-user')
        .expect(302, done)
    });
    it.skip('should load manage content page', function (done){
        request(app, done)
        .get('/content/edit-page')
        .expect(200)
    });
    it.skip('should load manage all pages', function (done){
        request(app, done)
        .get('/content/manage-all-pages')
        .expect(200)
    });
})
// let Cookies;

// describe('Functional Test <Sessions>:', function () {
//   it('should create user session for valid user', function (done) {
//     request(app)
//       .post('/login')
//       .set('Accept','application/json')
//       .send({"email": "kristiansigston@gmail.com", "password": "frefrefre"})
//       .expect('Content-Type', /html/)
//       .expect(200)
//       .end(function (err, res) {
//         done();
//       });
//   });
//   it('should get user session for current user', function (done) {
//     var req = request(app).get('/login');
//     // Set cookie to get saved user session
//     req.cookies = Cookies;
//     req.set('Accept','html')
//       .expect('Content-Type', /html/)
//       .expect(200)
//       .end(function (err, res) {
//         res.body.id.should.equal('1');
//         res.body.short_name.should.equal('kristiansigston@gmail.com');
//         res.body.email.should.equal('kristiansigston@gmail.com');
//         done();
//       });
//   });
// });