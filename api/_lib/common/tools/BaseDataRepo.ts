// common imports
import { CONSTANTS } from '../../common/constants'
import { CError } from '../../common/tools'

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = CONSTANTS.HTTP_STATUS

class BaseDataRepo {
  protected ENTITY_NAME
  protected COLLECTION_NAME

  constructor() {
    this.ENTITY_NAME = ''
    this.COLLECTION_NAME = ''
  }

  protected errorInternalEntityCreate(err?: unknown): CError {
    const statusCode = INTERNAL_SERVER_ERROR
    const msg = `An error occurred while creating a new '${this.ENTITY_NAME}'.`

    return new CError(statusCode, msg, err)
  }

  protected errorInternalEntityCollectionCreate(err?: unknown): CError {
    const statusCode = INTERNAL_SERVER_ERROR
    const msg = `An error occurred while creating a new '${this.ENTITY_NAME}' collection.`

    return new CError(statusCode, msg, err)
  }

  protected errorInternalEntityRead(err?: unknown): CError {
    const statusCode = INTERNAL_SERVER_ERROR
    const msg = `An error occurred while retrieving a '${this.ENTITY_NAME}'.`

    return new CError(statusCode, msg, err)
  }

  protected errorInternalEntityCollectionRead(err?: unknown): CError {
    const statusCode = INTERNAL_SERVER_ERROR
    const msg = `An error occurred while retrieving a '${this.ENTITY_NAME}' collection.`

    return new CError(statusCode, msg, err)
  }

  protected errorInternalEntityUpdate(err: unknown|null = null): CError {
    const statusCode = INTERNAL_SERVER_ERROR
    const msg = `An error occurred while updating a '${this.ENTITY_NAME}'.`

    return new CError(statusCode, msg, err)
  }

  protected errorInternalEntityDelete(err: unknown|null = null): CError {
    const statusCode = INTERNAL_SERVER_ERROR
    const msg = `An error occurred while deleting a '${this.ENTITY_NAME}'.`

    return new CError(statusCode, msg, err)
  }

  protected errorEntityNotFound(err: unknown|null = null): CError {
    const statusCode = NOT_FOUND
    const msg = `A '${this.ENTITY_NAME}' was not found.`

    return new CError(statusCode, msg, err)
  }
}

export {
  BaseDataRepo,
}
