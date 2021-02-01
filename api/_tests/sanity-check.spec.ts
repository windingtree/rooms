import { hello } from './sanity-check'
import { expect } from 'chai'
import 'mocha'

describe('Sanity Check', () => {
  it('should return hello world', () => {
    const result = hello()
    expect(result).to.equal('Hello world!')
  })
})
