import si from 'systeminformation';
import os from 'os';
import crypto from 'crypto';

const getDeviceIds = async () => {
  const system = await si.system();
  const bios = await si.bios();
  const osInfo = await si.osInfo();
  const uuid = (system?.uuid) || (bios?.serial) || '';
  const hostname = os.hostname();

  const osIdRaw = uuid || `${osInfo.platform}|${osInfo.distro}|${osInfo.release}|${hostname}`;
  const biosIdRaw = bios?.serial || `${bios?.vendor || ''}|${bios?.version || ''}|${bios?.releaseDate || ''}`;

  return {
    osIdRaw,
    biosIdRaw,
    system,
    bios,
    osInfo
  };
}

const createDeviceHash = async () => {
  const { osIdRaw, biosIdRaw } = await getDeviceIds();

  const combined = `${osIdRaw}||${biosIdRaw}`;
  const hash = crypto.createHash('sha256').update(combined).digest('hex');

  return hash;
}


export const SystemUtil = {
    getDeviceIds,
    createDeviceHash
}