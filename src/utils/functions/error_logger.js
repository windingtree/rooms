import { isFunction } from './isFunction'

function errorLogger(error) {
  if (error && error.response && isFunction(error.response.json)) {
    error.response.json().then((errorData) => {
      console.error('errorData', errorData)
    })
  } else {
    console.error(error)
  }
}

export {
  errorLogger,
}
