const Redis = require("ioredis");
const { Store } = require("koa-session2");
const config = require('./default');
 
class RedisStore extends Store {
    constructor() {
        super();
        this.redis = new Redis(config.Redis);
    }
 
    async get(sid, ctx) {
        let data = await this.redis.get(`${sid}`);
        return JSON.parse(data);
    }
 
    async set(session, { sid =  this.getID(24), maxAge = 60*60*60*24*30 } = {}, ctx) {
        try {
            await this.redis.set(`${sid}`, JSON.stringify(session), 'EX', maxAge );
        } catch (e) {
            console.log('set session error !!!!!!!!'+e)
        }
        return sid;
    }
 
    async destroy(sid, ctx) {
        return await this.redis.del(`${sid}`);
    }
}
 
module.exports = RedisStore;