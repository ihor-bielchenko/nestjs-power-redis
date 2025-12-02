import { 
	DynamicModule, 
	Module, 
} from '@nestjs/common';
import { redisRoot } from './root';
import { RedisService } from './RedisService';
import { getRedisToken } from './InjectRedis';

@Module({})
export class RedisModule {
	static forRoot(names: string[]): DynamicModule {
		const providers = names.map((name) => ({
			provide: getRedisToken(name),
			useFactory: (service: RedisService) => {
				return service.createScopedService(name);
			},
			inject: [ RedisService ],
		}));

		return {
			module: RedisModule,
			imports: [ ...redisRoot(names) ],
			providers: [
				RedisService,
				...providers,
			],
			exports: [
				...providers,
			],
		};
	}
}
