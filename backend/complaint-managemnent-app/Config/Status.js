exports.CODES = {
    CONFLICT :{
        CODE    : 409 ,
        MESSAGE : 'Provided information already exist!'
    },
    FORBIDDEN : {
        CODE    : 403,
        MESSAGE : 'Forbidden Error !'
    },
    MISSING_AUTHENTICATION_DATA :{
        CODE    : 417,
        MESSAGE : 'Authentication Information Missing'
    },
    NOT_ALLOWED : {
        CODE    : 405,
        MESSAGE : 'Method not allowed !'
    },
    NOT_FOUND : {
        CODE    : 404,
        MESSAGE : 'Requested resource not found !'
    },
    PRE_CONDITION :{
        CODE    : 412 ,
        MESSAGE : 'Please complete other steps first'
    },
    SERVER_ERROR : {
        CODE    : 500,
        MESSAGE : 'Internal Server Error'
    },
    No_Content: {
        CODE    : 204,
        MESSAGE : 'No Content'
    },
    SUCCESS : {
        CODE    : 200,
        MESSAGE : 'Success'
    },
    UNAUTHORIZED : {
        CODE    : 401,
        MESSAGE : 'You are not authorized to access this resource.'
    },
    BAD_REQUEST : {
        CODE : 400,
        MESSAGE:'Please enter valid detail'
    }
}

exports.MESSAGES = {
    LOGIN_SUCCESS                   : "User logged in Successfully",
    EMAIL_EXISTS                    : "Email already exist!",
    EMAIL_IS_REGISTERED             : "Email already registered!",
    EMAIL_IS_NOT_REGISTERED         : "Email is not registered!",
    TOKEN_IS_NOT_VALID              : "Access code is not valid",
    PASSWORD_INCORRECT              : "Sorry, incorrect password. Please try again.",
    PROFILE_UPDATED                 : "Profile details updated",
    RESET_PASSWORD                  : "We have sent email to your account",
    USER_EXISTS                     : "User already exist!",
    USER_STATUS_CHANGE              : "User status changed successfully!",
    INVALID_USER_TYPE               : "Invalid user type",
	SUCCESS 						: "Records fetch successfully.",
    FORGOT_PASSWORD_SUCCESS         : "Forgot password link has been sent to your email id.",
    USER_NOT_EXISTS                 : "User does not exist",
    EMAIL_NOT_EXISTS                : "Email address doesn’t exist",
    USER_INFO_SUCCESS               : "User information loaded successfully.",
    CREATE_SUCCESS                  : "Records has created successfully.",
    CREATE_FAILED                   : "Something went wrong",
    UPDATE_SUCCESS                  : "Records has been updated successfully.",
    GET_INFO_SUCCESS                : "Records fetch successfully.",
    RECORDS_NOT_EXISTS              : "Records does not exist",
    FORGOT_PWD_VALIDATION           : "You have already forgot password requested, Please check your email.",
    DEVICE_NOT_EXISTS               : "Device does not exist",
    INVALID_PASSWORD                : "Invalid password",
    PASSWORD_CHANGE_SUCCESS         : "Your Password has been changed successfully.",
    FORGOT_PASSWORD_SUCCESS         : "Your request has been received, You'll receive an email to reset password.",
    HISTORY_DATA_SUCCESS            : "Sample history data loaded successfully",
    DEVICE_PERMISSION_VALIDATION    : "Devices are invalid or You don't have access for selected devices",
    DATE_DIFFERENCE_VALIDATION      : "Date range should be max 30 days",
    To_DATE_VALIDATION              : "To Date is bigger than From Date",
    PROFILE_UPDATE_SUCCESS          : "Profile has been update successfully",
    FILE_UPLOAD_SUCCESS             : "File uploaded successfully"

}