import createError from 'http-errors';
import httpStatus from 'http-status';

function internalError(message, error){

    return createError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal error occured while '+message, {error: error});
}

export default internalError;