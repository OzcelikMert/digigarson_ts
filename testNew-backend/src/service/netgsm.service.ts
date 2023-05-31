const NetGsm = require("netgsm");

interface SendSms{
  gsmno: string;
  message: string;
}

export async function sendSms(sms:SendSms){
  const netgsm = new NetGsm({
  usercode: '8503045590',
  password: 'V3-5W320',
  msgheader: 'DIGIGARSON',
  });

return await netgsm.get("sms/send/get/",sms);
}
