var request = require('supertest'),
   app     = require('../server',)
   expect = require('chai');

describe('Page requests' , function (){
    it('should load home page', function (done){
        request(app)
        .get('/')
        .expect(200)
        .expect(/home/, done)
    })
    it('should load about page', function (done){
        request(app)
        .get('/about')
        .expect(200)
        .expect(/about/, done)
    })
    it('should load admin page', function (done){
        request(app)
        .get('/admin')
        .expect(200)
        .expect(/admin/, done)
    })
    it('should load login page', function (done){
        request(app)
        .get('/login')
        .expect(200)
        .expect(/login/, done)
    })
    it('should load manage-users page', function (done){
        request(app)
        .get('/users/manage-users')
        .expect(200)
        .expect(/create and edit/, done)
    })
    it('should load forgot-password page', function (done){
        request(app)
        .get('/users/forgot-password')
        .expect(200)
        .expect(/forgotten password/, done)
    })
    it('should load manage content page', function (done){
        request(app)
        .get('/content/manage-page')
        .expect(200)
        .expect(/create content/, done)
    })
    it('should load manage all pages', function (done){
        request(app)
        .get('/content/manage-all-pages')
        .expect(200)
        .expect(/manage all content/, done)
    })
})