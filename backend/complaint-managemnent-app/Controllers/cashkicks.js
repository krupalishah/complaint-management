`use strict`
require('dotenv').config();
const { body, validationResult, buildCheckFunction } = require('express-validator');
const checkBodyAndQuery = buildCheckFunction(['body', 'query']);
const Status = require('../Config/Status')
const GenericModel = require('../Models/generic');
const genericModel = new GenericModel();
var schema = require('../Database/schema');
const { sequelize } = require("../Database/schema/index");
const _ = require("lodash");
const { Op } = require("sequelize");
/**
 * @name Add Cashkicks
 * @description To Add Cashkicks
 * @method POST
 * @author LDP
 */
exports.addCashkicks = async function (req, res) {
    try {
        await sequelize.transaction(async function (transaction) {
            body('name').isString();
            body('maturity').isNumeric();
            body('total_received').isNumeric();
            body('contract_detail').isObject();
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(Status.CODES.PRE_CONDITION.CODE).json({ errors: errors.array() });
            } else {
                let reqBody = req.body;
                if (!!reqBody.contract_detail) {
                    const cashkicksName = reqBody.name;
                    let cashkicksDetail = await genericModel.getByWhere('cash_kicks', {
                        name: cashkicksName
                    });
                    if (cashkicksDetail.success === false) {
                        reqBody.term_length = process.env.TERM_LENGTH;
                        const months = process.env.TERM_LENGTH
                        const interest = process.env.INTEREST;
                        const totalReceived = parseInt(reqBody.total_received, 10);
                        const totalFinanced = totalReceived * Math.pow((1 + (interest / 100)), months);
                        let monthlyPayment = totalFinanced / 12;
                        var outstandingAmount = totalFinanced;
                        reqBody.total_financed = totalFinanced;
                    reqBody.status =0;
                    reqBody.status_name='Pending';
                        let contractCashkicks = [];
                        let contractCashkicksDetailStatus = await getContractCashkicksDetail(reqBody.contract_detail);
                        if (contractCashkicksDetailStatus === true) {
                            
                            let result = await schema['cash_kicks'].create(reqBody, { transaction });

                            if (!!result) {
                                console.log(result.cashkicks_id)
                                let contractDetails = appendCashkicksId(reqBody.contract_detail,result.cashkicks_id);
                                console.log(contractDetails);
                                let contractCashkicksResult;
                                if(contractDetails.isArray) {
                                    contractCashkicksResult = await schema['Contract_cash_kics'].bulkCreate(contractDetails, { transaction })
                                }else {
                                    contractCashkicksResult = await schema['Contract_cash_kics'].create(contractDetails, { transaction })
                                }
                               
                                if (!!contractCashkicksResult) {
                                    let paymentDueArr = paymentDateRange(outstandingAmount, monthlyPayment);
                                    paymentDueArr = appendCashkicksId(paymentDueArr,result.cashkicks_id);
                                    await schema['payment_due'].bulkCreate(paymentDueArr, { transaction })
                                    res.status(Status.CODES.SUCCESS.CODE).json({ message: "Cashkicks inserted successfully." });
                                } else {
                                    res.status(Status.CODES.CONFLICT.CODE).json({ message: "Something went wrong." });
                                }
                            } else {
                                res.status(Status.CODES.CONFLICT.CODE).json({ message: "Something went wrong." });
                            }
                        } else {
                            return res.status(Status.CODES.BAD_REQUEST.CODE).json({
                                message: 'Invalid contract details or amount.'
                            })
                        }
                    } else {
                        return res.status(Status.CODES.BAD_REQUEST.CODE).json({ message: "Please enter different cashkicks name" });
                    }
                } else {
                    return res.status(Status.CODES.PRE_CONDITION.CODE).json({ message: "Please enter valid contract detail" });
                }
            }
        });
    } catch (err) {
        console.log(err);
        res.status(Status.CODES.SERVER_ERROR.CODE).json({
            error: err
        })
    }
}


/**
 * @name Get contract cashkicks detail
 * @description Get contract cashkicks detail
 * @author LDP
 */

 async function getContractCashkicksDetail(contractDetail) {
    try {
        let status = false;
        if (contractDetail.isArray) {
            _.map(contractDetail, async function (contract) {
                let contractResult = await genericModel.getByWhere('Contract', {
                    contract_id: contract.contract_id,
                    payment: {
                        [Op.gte]: contract.amount
                    }
                });
                if (contractResult.success === false) {
                    return {
                        status: Status.CODES.BAD_REQUEST.CODE,
                        message: 'Invalid Contractid or payment amount'
                    }
                } else {
                    status = true;
                }
            })
        } else {
            let contractResult = await genericModel.getByWhere('Contract', {
                contract_id: contractDetail.contract_id,
                payment: {
                    [Op.gte]: contractDetail.amount
                }
            });
            if (contractResult.success === false) {
                return {
                    status: Status.CODES.BAD_REQUEST.CODE,
                    message: 'Invalid Contractid or payment amount'
                }
            } else {
                status = true;
            }
        }
        return status;
    } catch (err) {
        console.log(err);
    }
 
}

/**
 * @name Append cashkicks id to contract and cashkicks
 * @description To append cashkicks id to contract and cashkicks
 * @author LDP
 */
 function appendCashkicksId(details,cashkicks_id) {
    if (details.isArray) {
        _.map(details,function(element){
            element.cashkicks_id = cashkicks_id,
            element.payment_amount=element.amount;
        })
       
    } else {
        details.cashkicks_id=  cashkicks_id;
        details.payment_amount=details.amount;
    }
    return details;
    }

/**
 * @name Set payment due range
 * @description To set and get payment due range
 * @author LDP
 */
 function paymentDateRange(outstandingAmount, monthlyPayment) {
    let startDate = new Date();
    let endDate = new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000);
    let array = [];
    for (d = new Date(startDate); d < new Date(endDate); d.setMonth(d.getMonth() + 1)) {
        if ((outstandingAmount - monthlyPayment) < monthlyPayment) {
            monthlyPayment += (outstandingAmount - monthlyPayment)
        }
        array.push({ due_date: new Date(d), expected_amount: monthlyPayment, outstanding_amount: outstandingAmount -= monthlyPayment, status: 0, status_name: 'Pending' });
    }
    return array;
}




/**
 * @name Get List of Cashkicks
 * @description To Get List Of Cashkicks
 * @method GET
 * @author LDP
 */
exports.getCashkicksList = async function (req, res) {
    try {
        checkBodyAndQuery('pageNumber').isNumeric();
        checkBodyAndQuery('pageSize').isNumeric();
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(412).json({ errors: errors.array() });
        } else {
            let result = await genericModel.getList('cash_kicks', req.query.pageNumber, req.query.pageSize);
            res.status(Status.CODES.SUCCESS.CODE).json(result);
        }
    } catch (err) {
        res.status(Status.CODES.SERVER_ERROR.CODE).json({
            error: err
        })
    }
}
