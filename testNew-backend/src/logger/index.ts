import logger from "pino";
import dayjs from "dayjs";

const log = logger({
  prettyPrint: true,
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
});

export const logdb = (message:string)=>`${dayjs().format()};${message}`

export default log;
