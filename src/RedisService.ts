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
	public readonly logger: Logger = new Logger('RedisService');
	public redis!: IORedisLike;
	public readonly redisClientName: string = 'queues';

	constructor(
		private readonly redisService: IoRedisService,
	) {
		super();
		this.provideRedisConnection();
	}

	private provideRedisConnection() {
		const redisClientName = process.env.REDIS_CLIENT_NAME ?? 'queues';
		const map: Map<string, any> | undefined = (this.redisService as any).clients;

		if (!map?.size) {
			throw new Error('No Redis clients available in RedisService.');
		}
		const redis = this.selectRedisConnection(map, redisClientName) ?? this.selectRedisConnection(map);

		if (!redis) {
			throw new Error(`Invalid Redis client "${redisClientName}".`);
		}
		this.redis = redis;
		this.logger.log?.(`Using Redis client: ${redisClientName in (map as any) ? redisClientName : '[first available]'}`);
	}

	private selectRedisConnection(map: Map<string, any>, name?: string): IORedisLike | undefined {
		const definedClient = name ? map.get?.(name) : map.values?.().next?.().value;

		return (definedClient && isFunc((definedClient as any).defineCommand) && isFunc((definedClient as any).xgroup)) ? definedClient as IORedisLike : undefined;
	}
}