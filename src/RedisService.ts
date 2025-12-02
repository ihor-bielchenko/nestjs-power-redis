import { RedisService as IoRedisService } from '@nestjs-labs/nestjs-ioredis';
import { 
	Injectable,
	Logger,
} from '@nestjs/common';
import type { IORedisLike } from 'power-redis';
import { PowerRedis } from 'power-redis';
import { isFunc } from 'full-utils';

@Injectable()
export class RedisService extends PowerRedis {
	public readonly logger = new Logger('RedisService');
	public redis!: IORedisLike;

	constructor(private readonly redisService: IoRedisService) {
		super();
	}

	private pickConnection(name: string) {
		const clients: Map<string, any> = (this.redisService as any).clients;
		
		return clients.get(name);
	}

	createScopedService(name: string): RedisService {
		const instance = new RedisService(this.redisService);
		const redis = this.pickConnection(name);

		if (!redis) {
			throw new Error(`Redis client "${name}" not found.`);
		}
		(instance as any).redis = redis;
		
		instance.logger.log(`Using Redis client: ${name}`);

		return instance;
	}
}
