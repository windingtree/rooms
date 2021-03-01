import { expect } from 'chai'
import 'mocha'
import { TimeBasedCache } from '../../../_lib/common/cache/timeBasedCache'

describe('Cache', () => {
  it('should correctly add items to cache and return by key', () => {
    const cache = new TimeBasedCache<string,string>(1000)
    expect(cache.size()).to.be.equal(0)


    cache.put('key1','value1');
    expect(cache.size()).to.be.equal(1)
    expect(cache.get('key1')).to.be.equal('value1');

    cache.put('key2','value2');
    expect(cache.size()).to.be.equal(2)
    expect(cache.get('key2')).to.be.equal('value2');
  })

  it('should evict all entries from cache once eviction time expires',  (done) => {
    const evictionTimeInMillis = 500;
    const cache = new TimeBasedCache<string,string>(evictionTimeInMillis)

    cache.put('key1','value1');
    cache.put('key2','value2');
    expect(cache.get('key1')).to.be.equal('value1');
    expect(cache.get('key2')).to.be.equal('value2');

    setTimeout(()=>{
      console.log('check after time')
      expect(cache.get('key1')).to.equal(undefined)
      expect(cache.get('key2')).to.equal(undefined)
      done()
    },2*evictionTimeInMillis)
  })


})
