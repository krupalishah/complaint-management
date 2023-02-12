
const complaintController = require('../Controllers/complaint');

module.exports = function(app) {
    app.post('/api/complaint', complaintController.complaintAdd);
}