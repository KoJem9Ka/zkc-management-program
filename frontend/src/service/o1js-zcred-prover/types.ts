/* eslint-disable @typescript-eslint/no-explicit-any */
import { type JalProgram } from '@jaljs/core';
import { type ZkCredential } from '@zcredjs/core';
import type { Proof } from 'o1js';
import { type ProvingResult } from '../external/verifier/types.ts';

export type WorkerMessage = {
  id: number;
}

export function isWorkerMessage(data: unknown): data is WorkerMessage {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    typeof data.id === 'number'
  );
}

export type WorkerInitReq = WorkerMessage & {
  type: 'init-req'
};

export function isWorkerInitReq(data: unknown): data is WorkerInitReq {
  return (
    isWorkerMessage(data) &&
    'type' in data &&
    data.type === 'init-req'
  );
}

export type WorkerInitResp = WorkerMessage & {
  type: 'init-resp';
  initialized: boolean;
}

export function isWorkerInitResp(data: unknown): data is WorkerInitResp {
  return (
    isWorkerMessage(data) &&
    'type' in data &&
    data.type === 'init-resp' &&
    'initialized' in data &&
    typeof data.initialized === 'boolean'
  );
}

export type WorkerError = WorkerMessage & {
  type: 'error';
  message: string;
}

export function isWorkerError(data: unknown): data is WorkerError {
  return (
    isWorkerMessage(data) &&
    'type' in data &&
    data.type === 'error' &&
    'message' in data &&
    typeof data.message === 'string'
  );
}

export type WorkerProofReq = WorkerMessage & {
  type: 'proof-req';
  jalProgram: JalProgram;
  credential: ZkCredential;
}

export function isWorkerProofReq(data: unknown): data is WorkerProofReq {
  return (
    isWorkerMessage(data) &&
    'type' in data &&
    data.type === 'proof-req' &&
    'jalProgram' in data &&
    typeof data.jalProgram === 'object' && data.jalProgram !== null &&
    'credential' in data &&
    typeof data.credential === 'object' && data.credential !== null
  );
}

export type WorkerProofResp = WorkerMessage & {
  type: 'proof-resp';
  result: Omit<ProvingResult, 'signature'>;
}

export function isWorkerProofResp(data: unknown): data is WorkerProofResp {
  return (
    isWorkerMessage(data) &&
    'type' in data &&
    data.type === 'proof-resp' &&
    'result' in data &&
    typeof data.result === 'object' && data.result !== null &&
    'proof' in data.result &&
    typeof data.result.proof === 'string'
  );
}

export type WorkerReq = WorkerInitReq | WorkerProofReq;

export function isWorkerReq(data: unknown): data is WorkerReq {
  return (
    isWorkerInitReq(data) || isWorkerProofReq(data)
  );
}

export type WorkerResp = WorkerInitResp | WorkerProofResp | WorkerError;

export function isWorkerResp(data: unknown): data is WorkerResp {
  return (
    isWorkerInitResp(data) || isWorkerProofResp(data) || isWorkerError(data)
  );
}

export type O1JSZkProgramModule = {
  initialize(o1js: typeof import('o1js')): {
    zkProgram: {
      compile(): Promise<{ verificationKey: { data: string } }>
      execute(...args: unknown[]): Promise<Proof<unknown, unknown>>
    };
    PublicInput: {
      new(args: Record<string, any>): any
    }
  };
}
