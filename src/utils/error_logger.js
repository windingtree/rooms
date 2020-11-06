function errorLogger(error) {
  if (error && error.response && error.response.json) {
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
