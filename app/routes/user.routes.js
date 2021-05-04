const {authJwt} = require('../middlewares');
const UserController = require('../controllers/user.controller');

module.exports = function(app) {
    
    app.get('/api/test/all', UserController.allAccess);
    app.get('/api/test/user', [authJwt.verifyToken], UserController.userBoard);
    app.get('/api/test/mod', [authJwt.verifyToken, authJwt.isModerator], UserController.moderatorBoard);
    app.get('/api/test/admin', [authJwt.verifyToken, authJwt.isAdmin], UserController.adminBoard);
}