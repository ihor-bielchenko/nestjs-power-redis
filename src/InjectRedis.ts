import { Inject } from '@nestjs/common';

export const getRedisToken = (name: string) => `RedisService_${name}`;
export const InjectRedis = (name: string) => Inject(getRedisToken(name));
