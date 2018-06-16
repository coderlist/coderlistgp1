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

let request2 = require('superagent');

function createAuthenticatedRequest(app, loginDetails, done) {
  var authenticatedRequest = request.agent();
  authenticatedRequest
      .post(server)
      .send(loginDetails)
      .end(function(error, response) {
          if (error) {
              throw error;
          } 
          done(authenticatedRequest)
      });
// Using auxiliary function in test cases.
createAuthenticatedRequest(server, loginDetails, function(request) {
  request
      .get('/admin')
      .expect(200, done);
});