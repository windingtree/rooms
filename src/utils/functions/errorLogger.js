import { isFunction } from './isFunction'

//log error
async function errorLogger(error) {
  let errorData = await extractErrorData(error)
  console.error('Error details:',errorData?errorData:'Unknown error')
  return getHumanReadableErrorMessage(errorData)
}

//try to extract error data from the response or null if it's not possible
async function extractErrorData(error){
  try{
    if (error && error.response && isFunction(error.response.json)) {
      return await error.response.json();
    }
  }catch(err){
    console.error('Failed to parse error response')
  }
  return null;
}

//get human readable message to be displayed in UI
function getHumanReadableErrorMessage(errorData){
  let errorMessage = 'Unknown error occured';
  if(errorData && errorData.err){
    errorMessage = errorData.err;
  }
  return errorMessage;
}


export {
  errorLogger
}
