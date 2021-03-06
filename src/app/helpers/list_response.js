import createError from 'http-errors';
import httpStatus from 'http-status';
import Pagination from './pagination';
import internalError from './internal_error';


function listResponse({itemCount, errorMessage, getItems}){

   return async function(req, res, next){
        try{
            let page = req.query.page;
            let limit = req.query.limit;
            let pagination = new Pagination(itemCount, page, limit);
            let gottenItems = await getItems(pagination.getOffset(), limit);
            return res.status(httpStatus.OK).send({...pagination.generatePaginationObject(), results: gottenItems});
        }catch(error){
            console.log(error);
            return next(internalError(errorMessage || 'getting items', error));
        }
   }
}

export default listResponse;