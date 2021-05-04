const { verifySignUp } = require('../middlewares');
const AuthController = require('../controllers/auth.controller');
module.exports = function (app) {
    app.post("/api/auth/signup", [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
        AuthController.signup);
    app.post("/api/auth/signin", AuthController.signin);
}