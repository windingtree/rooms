function objClone(_obj) {
  const obj = JSON.parse(JSON.stringify(_obj))

  return obj
}

export {
  objClone,
}
