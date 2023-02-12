const connection = require('../Database/config/database-config');
const jwt = require('jsonwebtoken');
exports.login = async function (req, res) {
    try {
        console.log(req.body);
         connection.query(`SELECT user_id,user_name,first_name,last_name,role_id FROM user WHERE user_name='${req.body.user_name}' and password = '${req.body.password}'`, (err, rows, fields) => {
            console.log(rows);
            if (!err && rows.length>0){
                let jwtSecretKey = process.env.JWT_SECRET_KEY;
                let data = {
                    time: Date(),
                    userId: 12,
                }
                const token = jwt.sign(data, jwtSecretKey);
                const userrow ={
                    ...rows[0],
                    token:token
                }
                res.status(200).send(userrow);
            }
            else
            res.status(400).send({message:'username or password is invalid'});
        })
    }catch(error) {

    }
}
