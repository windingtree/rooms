
class CacheEntryWrapper<V>{
    private readonly key:V;
    private readonly creationTime:number;
    constructor(key:V) {
        this.key = key;
        this.creationTime = Date.now();
    }
    public getKey():V{
        return this.key;
    }
    public getCreationTime():number{
        return this.creationTime;
    }
}
export class TimeBasedCache<K,V>{
    private cacheTTLInMillis:number
    private cache = new Map<K,CacheEntryWrapper<V>>()
    constructor(cacheTTLInMillis:number) {
        this.cacheTTLInMillis = cacheTTLInMillis;
    }
    public put(key:K,value:V):void{
        this.evictOldEntries();
        this.cache.set(key,new CacheEntryWrapper(value));
    }
    public get(key:K):V|undefined{
        this.evictOldEntries();
        const value:CacheEntryWrapper<V>|undefined = this.cache.get(key);
        if(value) {
            return value.getKey();
        }
        return undefined;
    }
    public size():number{
        return this.cache.size;
    }

    private isEntryStale(entry:CacheEntryWrapper<V>):boolean{
        const creationTime = entry.getCreationTime();
        const now = Date.now();
        return (now-creationTime)>this.cacheTTLInMillis;
    }
    private evictOldEntries(){
        const keysIterator = this.cache.keys();
        let key:K;
        let value:CacheEntryWrapper<V>|undefined;
        let result = keysIterator.next();
        while (!result.done) {
            key =  result.value;
            value = this.cache.get(key);
            if(value && this.isEntryStale(value)){
                this.cache.delete(key)
            }
            result = keysIterator.next();
        }
    }
}

