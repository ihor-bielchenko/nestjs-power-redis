# nestjs-power-redis

## power-redis integration for NestJS

<p align="center">
	<img src="https://img.shields.io/badge/redis-streams-red?logo=redis" />
	<img src="https://img.shields.io/badge/nodejs-queue-green?logo=node.js" />
	<img src="https://img.shields.io/badge/typescript-ready-blue?logo=typescript" />
	<img src="https://img.shields.io/badge/license-MIT-lightgrey" />
	<img src="https://img.shields.io/badge/nestjs-support-ea2845?logo=nestjs" />
	<img src="https://img.shields.io/badge/status-production-success" />
</p>

## 📚 Documentation
Full documentation is available here:  
👉 **https://nestjs-power-redis.docs.ihor.bielchenko.com**

## 📦 Installation
``` bash
npm install nestjs-power-redis
```
OR
```bash
yarn add nestjs-power-redis
```

## 🧪 Basic usage
For example, you may need to create two Redis connections in a NestJS application. Let's say these connection names are `queues` and `cache`.
The number of connections can be arbitrary, and the names must use Latin characters without special symbols (hyphens and underscores are allowed).

### 1. Connection settings are specified in the .env file:
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

### 2. Register module with multiple Redis clients:
```ts
import { RedisModule } from 'nestjs-power-redis';

@Module({
	imports: [
		RedisModule.forRoot([ 'queues', 'cache' ]),
	],
})
export class AppModule {}
```

### 3. Inject Redis in a service:
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

## 🔐 Environment Variables

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

TLS fields are optional.

## 📜 License  
MIT - free for commercial and private use.