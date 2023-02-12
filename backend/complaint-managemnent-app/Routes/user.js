
var userController = require('../Controllers/user');

module.exports = function(app) {
     app.post('/user/authenticate', userController.login);
}
