import { 
	DynamicModule, 
	Module, 
} from '@nestjs/common';
import { redisRoot } from './root';
import { RedisService } from './RedisService';

@Module({})
export class RedisModule {
	static forRoot(names: string[]): DynamicModule {
		return {
			module: RedisModule,
			imports: [
				...redisRoot(names),
			],
			providers: [
				RedisService,
			],
			exports: [
				RedisService,
			],
		};
	}
}
