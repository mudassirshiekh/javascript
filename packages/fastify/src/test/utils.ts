import type { FastifyInstance } from 'fastify';

// expose decorated reply methods as methods in fastify instance
export function createFastifyInstanceMock() {
  const fastify = {
    decorateReply: jest.fn((name: string, fn) => {
      fastify[name] = fn;
    }),
    addHook: jest.fn((name: string, fn) => {
      fastify[name] = fastify[name] || [];
      fastify[name].push(fn);
    }),
    decorateRequest: jest.fn((name: string, fn) => {
      fastify[name] = fn;
    }),
  } as any as FastifyInstance;

  return fastify;
}
