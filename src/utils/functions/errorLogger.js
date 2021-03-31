import { isFunction } from './isFunction'
import {gaGenericError} from "./analytics";

//log error
async function errorLogger(error) {
  let errorData = await extractErrorData(error)
  let errorMessage = getHumanReadableErrorMessage(errorData)
  gaGenericError(errorMessage,'generic_error')
  return errorMessage;
}

//try to extract error data from the response or null if it's not possible
async function extractErrorData(error){
  try{
    if (error && error.response && isFunction(error.response.json)) {
      return await error.response.json();
    } else if (error && error.message) {
      return error.message;
    }
  }catch(err){
    console.error('Failed to parse error response')
  }
  return null;
}

//get human readable message to be displayed in UI
function getHumanReadableErrorMessage(errorData){
  let errorMessage = 'Unknown error occurred';
  if(errorData && errorData.err){
    errorMessage = errorData.err;
  } else if (typeof errorData === 'string') {
    errorMessage = errorData;
  }
  return errorMessage;
}


export {
  errorLogger
}
