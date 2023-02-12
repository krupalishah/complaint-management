'use strict';
require('dotenv').config();
const { body, validationResult,buildCheckFunction } = require('express-validator');
const checkBodyAndQuery = buildCheckFunction(['body', 'query']);
const Status = require('../Config/Status')
const GenericModel = require('../Models/generic');
const genericModel = new GenericModel();

/**
 * @name Add Contracts
 * @description To Add Contracts
 * @method POST
 * @author LDP
 */
exports.addContract = async function (req, res) {
    try {
        body('contract_name').isString();
        body('type').isString();
        body('term_length').isNumeric();
        body('payment').isNumeric();
        body('payment_per_month').isNumeric();
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(412).json({ errors: errors.array() });
        } else {
            let reqBody = req.body;
            reqBody.term_length = process.env.TERM_LENGTH;
            let result = await genericModel.create('Contract', reqBody);
            console.log(result);
            if (result.status == Status.CODES.SUCCESS.CODE) {
                // console.log(`${table} ${payload.id} Added successfully`);
               res.status(Status.CODES.SUCCESS.CODE).json(result);
            } else {
                res.status(Status.CODES.CONFLICT.CODE).json(result);
            }
        }
    } catch (err) {
   res.status(Status.CODES.SERVER_ERROR.CODE).json({
    error:err
   })
    }
}

/**
 * @name Get List of Contracts
 * @description To Get List Of Contracts
 * @method GET
 * @author LDP
 */
exports.getContractsList = async function(req,res) {
  try {
    checkBodyAndQuery('pageNumber').isNumeric();
    checkBodyAndQuery('pageSize').isNumeric();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(412).json({ errors: errors.array() });
    } else {
        let result = await genericModel.getList('Contract', req.query.pageNumber,req.query.pageSize);
        res.status(Status.CODES.SUCCESS.CODE).json(result);
    }
  } catch(err) {
    res.status(Status.CODES.SERVER_ERROR.CODE).json({
        error:err
       })
  }
}