import { helpRequestService } from '../../../lib/service';

export async function getSolicitud(id: string) {
  return await helpRequestService.getOne(Number(id));
}
