import type { HttpCredential, Identifier } from '@zcredjs/core';
import { omit } from 'lodash-es';
import sortKeys from 'sort-keys';
import * as u8a from 'uint8arrays';
import type { Proposal } from '@/service/external/verifier/types.ts';
import { DidStore } from '@/stores/did.store.ts';
import type { Nillable } from '@/types';
import { WalletTypeEnum } from '@/types/wallet-type.enum.ts';

const didKeyBegin = 'did:key:';
const hexAddressBegin = '0x';

export const addressShort = (address: string) => {
  // 0x0000000000000000000000000000000000000000
  // did:key:000000000000000000000000000000000000000000000000
  const from = address.startsWith(didKeyBegin) ? didKeyBegin.length : 0;
  const to = address.startsWith(hexAddressBegin) ? hexAddressBegin.length + 4 : 4;
  return `${address.slice(from, to)}...${address.slice(-4)}`;
};

export function toJWTPayload(obj: object): string {
  return u8a.toString(u8a.fromString(JSON.stringify(obj)), 'base64url');
}

export const base64UrlDecode = (base64string: string) => {
  return u8a.toString(u8a.fromString(base64string, 'base64url'), 'utf-8');
};

export const subjectTypeToWalletEnum = (subjectType: string): WalletTypeEnum => {
  if (subjectType === 'ethereum:address') {
    return WalletTypeEnum.Ethereum;
  }
  if (subjectType === 'mina:publickey') {
    return WalletTypeEnum.Auro;
  }
  throw new Error(`Unknown subject type: ${subjectType}`);
};

export const checkProposalValidity = (proposal: Proposal) => {
  const recipientDomain = /(?<=recipient url: ).*?(?=\n)/i.exec(proposal?.challenge.message ?? '')?.[0];
  if (proposal && (!recipientDomain || !proposal.verifierURL.startsWith(recipientDomain)))
    throw new Error('Invalid Proposal');
};

export const verifyCredentialJWS = async (credential: HttpCredential, issuerKid: string) => {
  const { 0: jwsHeader, 2: jwsSignature } = credential.protection.jws.split('.');
  if ((JSON.parse(base64UrlDecode(jwsHeader || '')) as Record<string, string>).kid !== issuerKid) {
    throw new Error('JWS kid does not match');
  }
  const jwsPayload = toJWTPayload(sortKeys(omit(credential, ['protection']), { deep: true }));
  const did = DidStore.$did.peek();
  if (!did) throw new Error('Cannot verify JWS without a DID');
  await did.verifyJWS(`${jwsHeader}.${jwsPayload}.${jwsSignature}`);
};

export const isSubjectIdsEqual = (a: Nillable<Identifier>, b: Nillable<Identifier>): boolean => {
  return !!a && !!b && a.type === b.type && a.key === b.key;
};
