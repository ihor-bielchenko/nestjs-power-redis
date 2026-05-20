import fs from 'fs';
import { RedisModule } from '@nestjs-labs/nestjs-ioredis';

export function redisRoot(names: string[]) {
	return [
		RedisModule.forRoot({
			config: names.map((name) => {
				const optionKey = `REDIS_${name.toUpperCase()}`;
				const host = process.env[`${optionKey}_HOST`] ?? '127.0.0.1';
				const port = Number(process.env[`${optionKey}_PORT`] ?? 6379);
				const password = process.env[`${optionKey}_PASSWORD`];
				const database = Number(process.env[`${optionKey}_DATABASE`] ?? 0);
				const tlsCrt = process.env[`${optionKey}_TLS_CRT`];
				const tlsCaCrt = process.env[`${optionKey}_TLS_CA_CRT`];
				const tlsKey = process.env[`${optionKey}_TLS_KEY`];
				const tls = ((typeof tlsCrt === 'string' && tlsCrt.length > 0)
					&& (typeof tlsCaCrt === 'string' && tlsCaCrt.length > 0)
					&& (typeof tlsKey === 'string' && tlsKey.length > 0))
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
					...tls,
					
					lazyConnect: true,
					enableOfflineQueue: false,
					maxRetriesPerRequest: 1,
					connectTimeout: 3000,
					commandTimeout: 3000,
					socketTimeout: 10000,
					
					retryStrategy(times: number) {
						return Math.min(times * 5000, 5000);
					},
					reconnectOnError(err: Error) {
						const msg = err?.message || '';

						return msg.includes('READONLY') 
							|| msg.includes('ECONNRESET') 
							|| msg.includes('ETIMEDOUT') 
							|| msg.includes('EPIPE') 
							|| msg.includes('NR_CLOSED') 
							|| msg.includes('CONNECTION_BROKEN');
					},
				};
			}),
		}),
	];
}
