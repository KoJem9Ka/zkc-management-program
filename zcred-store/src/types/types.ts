// import type { JWT } from '@fastify/jwt';
import type { JwtPayload } from './jwt-payload.js';

declare module 'fastify' {
  // interface FastifyRequest {
  //   jwt: JWT
  // }
  export interface FastifyInstance {
    authenticate: any
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: JwtPayload;
  }
}
