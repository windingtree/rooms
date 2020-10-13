class CError {
  code: number
  msg: string

  constructor(code: number, msg: string) {
    this.code = code
    this.msg = msg
  }
}

export {
  CError,
}
