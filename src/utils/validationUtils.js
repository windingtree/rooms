

export const isEmpty = (param) => {
    return (param === undefined || param === null || param === '')
}


export const isValidFloatNumber = (param) => {
    return (!isNaN(parseFloat(param)))
}

export const isValidInt = (param) => {
    return (!isNaN(parseInt(param)))
}
