# nestjs-power-redis - Secure, Scalable & Production‑Ready power-redis Integration for NestJS

This module is a **dedicated, production-ready NestJS wrapper around `power-redis`** - a high‑performance Redis abstraction layer for Node.js.

It is a **structured, type-safe, and feature-rich integration** designed specifically to bring all the power of `power-redis` into the NestJS ecosystem with zero friction.

<p align="center">
  <img src="https://img.shields.io/badge/redis-streams-red?logo=redis" />
  <img src="https://img.shields.io/badge/nodejs-queue-green?logo=node.js" />
  <img src="https://img.shields.io/badge/typescript-ready-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/license-MIT-lightgrey" />
  <img src="https://img.shields.io/badge/nestjs-support-ea2845?logo=nestjs" />
  <img src="https://img.shields.io/badge/status-production-success" />
</p>

---

## 📚 Documentation

Full documentation is available here:  
👉 **https://nestjs-power-redis.docs.ihor.bielchenko.com**

---

# 📦 Installation

``` bash
npm install nestjs-power-redis
```
OR
```bash
yarn add nestjs-power-redis
```
---

## 🚀 What This Library Does

### ✔ Multi‑Redis support  
Use any number of Redis connections (e.g., `queues`, `cache`, `sessions`) with simple DI injection.

### ✔ Full TLS support  
Secure your Redis connections using certificates without needing custom code.

### ✔ Zero configuration boilerplate  
All Redis connection settings are loaded from environment variables automatically.

### ✔ Built on top of `power-redis`  
You get:
- Safer key/value helpers  
- JSON handling  
- Consistent key formatting  
- List operations + stream helpers  
- Automatic reconnection strategies

# 🧪 Quick Start Example

## For example, you need to specify 2 connections: `queues` and `cache`

### 1. 🔐 Environment Variables (power-redis -Friendly)

Everything is configured using environment variables:

```env
REDIS_<NAME>_HOST=127.0.0.1
REDIS_<NAME>_PORT=6379
REDIS_<NAME>_PASSWORD=pass
REDIS_<NAME>_DATABASE=0

# TLS
REDIS_<NAME>_TLS_CRT=/etc/ssl/client.crt
REDIS_<NAME>_TLS_KEY=/etc/ssl/client.key
REDIS_<NAME>_TLS_CA_CRT=/etc/ssl/ca.crt
```

Instead of `<NAME>` you need to specify a custom connection name and then specify these names in `RedisModule.forRoot` (allowed in lowercase).
For example:

```env
REDIS_QUEUES_HOST=127.0.0.1
REDIS_QUEUES_PORT=6379
REDIS_QUEUES_PASSWORD=
REDIS_QUEUES_DATABASE=0

REDIS_CACHE_HOST=127.0.0.1
REDIS_CACHE_PORT=6379
REDIS_CACHE_PASSWORD=
REDIS_CACHE_DATABASE=0
```

TLS fields are optional.

---

### 2. Register module with multiple Redis clients

```ts
import { RedisModule } from 'nestjs-power-redis';

@Module({
  imports: [
    RedisModule.forRoot([ 'queues', 'cache' ]),
  ],
})
export class AppModule {}
```

---

### 3. Inject Redis in a service

```ts
import { Injectable } from '@nestjs/common';
import { 
	InjectRedis,
	RedisService, 
} from 'nestjs-power-redis';

@Injectable()
export class MyService {
  constructor(
    @InjectRedis('queues') private readonly queuesRedis: RedisService,
    @InjectRedis('cache') private readonly cacheRedis: RedisService,
  ) {}

  async test() {
    await this.queuesRedis.setOne('hello', 'world');
   
    const value = await this.cacheRedis.getOne('user:1');
    
    return value;
  }
}
```

---

## 🏗️ How It Works Internally

### redisRoot()
Loads all Redis configurations based on environment variables, applies TLS if present, and sets reconnection strategies.

### RedisModule.forRoot()
Creates dynamic providers for each Redis connection:
```
RedisService_queues  
RedisService_cache
```

These providers are available through:
```ts
@InjectRedis('queues')
@InjectRedis('cache')
```

---

## 📜 License

MIT - free for commercial and private use.