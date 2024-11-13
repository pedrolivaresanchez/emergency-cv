'use server';

import { helpRequestService } from '../../lib/service';

export async function getOfertasByUser(userId: string) {
  return helpRequestService.getOffersByUser(userId);
}

export async function getOne(id: number) {
  return helpRequestService.getOne(id);
}
