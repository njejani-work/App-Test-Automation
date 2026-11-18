// device_status: which phones adb sees, and the eGenome app on one of them (read-only adb).
import { z } from 'zod';
import { READ_ONLY } from '../shared/types.mjs';
import { device, egenomeRun } from '../adapters/project.mjs';
import { adbDevices, ADB_MISSING } from '../services/devices.mjs';
import { table, list } from '../format/md.mjs';

export default {
  name: 'device_status',
  title: 'Connected phone and app',
  description: 'Which emulators / phones adb sees, and on the first ready one (or the udid given): the eGenome app version, APK fingerprint and Android build. Read-only.',
  input: { udid: z.string().regex(/^[\w.:-]{1,64}$/).optional().describe('Device id from adb, e.g. emulator-5554') },
  annotations: { ...READ_ONLY, idempotentHint: false },

  async run({ udid }) {
    const devices = await adbDevices();
    if (!devices) return { text: ADB_MISSING, data: { adbFound: false, devices: [] } };
    const pick = udid || devices.find((d) => d.state === 'device')?.id;
    const list1 = `## Devices adb sees\n\n${devices.length ? table(['Device', 'State'], devices.map((d) => [d.id, d.state])) : '_none_'}`;
    if (!pick) {
      const note = devices.length ? 'No device is ready (state must be "device"; "unauthorized" = accept the USB debugging prompt on the phone).' : 'No emulator or phone connected.';
      return { text: `${list1}\n\n${note}`, data: { adbFound: true, devices, note } };
    }
    const { appInfo, deviceDetails } = await device();
    const { APP_PACKAGE } = await egenomeRun();
    const app = await appInfo(pick, APP_PACKAGE);
    const android = await deviceDetails(pick);
    const text = `${list1}\n\n## ${pick}\n\n${list([
      `**eGenome app:** ${app?.version_name ? `${app.version_name} (code ${app.version_code}), installed ${app.installed_at}` : app?.reason || 'not installed'}`,
      app?.build_id ? `**APK fingerprint:** ${app.build_id}` : null,
      android?.buildFingerprint ? `**Android build:** ${android.buildFingerprint}` : null,
      android ? `**Emulator:** ${android.emulator ? 'yes' : 'no (a real phone)'}` : null,
    ])}`;
    return { text, data: { adbFound: true, devices, device: pick, app, android } };
  },
};
