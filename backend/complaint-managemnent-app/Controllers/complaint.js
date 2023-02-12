
const connection = require('../Database/config/database-config');

exports.complaintAdd = async function (req, res) {
    try {
         connection.query(`INSERT INTO complaint VALUES('${req.body.complaint_name},'${req.body.complaint_detail}',${req.body.complaint_status})`, (err, rows, fields) => {
            if (!err)
                res.send(rows);
            else
                console.log(err);
        })
    }catch(error) {

    }
}