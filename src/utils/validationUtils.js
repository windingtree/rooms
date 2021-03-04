

export const isEmpty = (param) => {
    return (param === undefined || param === null || param === '')
}


export const isValidNumber = (param) => {
    return (!isNaN(param))
}
