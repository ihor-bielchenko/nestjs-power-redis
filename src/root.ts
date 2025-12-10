import fs from 'fs';
import { RedisModule } from '@nestjs-labs/nestjs-ioredis';
import { Logger } from '@nestjs/common';
import {
	isStrFilled,
	numNormalize,
} from 'full-utils';

const env = (k: string) => process.env[k];

export function redisRoot(names: string[]) {
	const logger = new Logger('redisRoot');

	return [
		RedisModule.forRoot({
			config: names.map((name) => {
				const optionKey = `REDIS_${name.toUpperCase()}`;
				const host = env(`${optionKey}_HOST`) ?? '127.0.0.1';
				const port = numNormalize(env(`${optionKey}_PORT`) ?? 6379);
				const password = env(`${optionKey}_PASSWORD`);
				const database = numNormalize(env(`${optionKey}_DATABASE`) ?? 0);
				const tlsCrt = env(`${optionKey}_TLS_CRT`);
				const tlsCaCrt = env(`${optionKey}_TLS_CA_CRT`);
				const tlsKey = env(`${optionKey}_TLS_KEY`);
				const hasTls = isStrFilled(tlsCrt) && isStrFilled(tlsCaCrt) && isStrFilled(tlsKey);
				const tls = hasTls
					? {
						tls: {
							cert: fs.readFileSync(tlsCrt!, 'utf8'),
							key: fs.readFileSync(tlsKey!, 'utf8'),
							ca: [ 
								fs.readFileSync(tlsCaCrt!, 'utf8'), 
							],
						},
					}
					: {};

				return {
					namespace: name,
					host,
					port,
					db: database,
					...password
						? { password }
						: {},
					retryStrategy(times: number) {
						const delay = Math.min(times * 100, 5000);
						
						logger.error(`[${optionKey}] Повторная попытка #${times}, переподключение через ${delay}ms.`);
						return delay;
					},
					reconnectOnError(err: Error) {
						const msg = err?.message || '';
						const shouldReconnect = msg.includes('READONLY') 
							|| msg.includes('ECONNRESET') 
							|| msg.includes('ETIMEDOUT') 
							|| msg.includes('EPIPE') 
							|| msg.includes('NR_CLOSED') 
							|| msg.includes('CONNECTION_BROKEN');
						
						if (shouldReconnect) {
							logger.error(`[${optionKey}] reconnectOnError: ${msg}`);
						}
						return shouldReconnect;
					},
					...tls,
				};
			}),
		}),
	];
}
