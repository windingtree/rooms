type TSimpleFunc = () => string|number|null|undefined

interface IRequestBody {
  [key: string]: Record<string, unknown>|TSimpleFunc|string|number|Array<string>|null|undefined
}

export { IRequestBody }
