import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info', // niveau minimum pour logger (info, warn, error, etc.)
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.colorize(),
    format.printf((info) => {
      const { timestamp, level, message, payload, stack } = info;
      const lvl = level;
      const time = `\u001b[34m[${String(timestamp)}] - \x1b[0m`;
      const msg = `\u001b[34m${String(message)}\x1b[0m`;
      const pld = `\u001b[38;2;253;182;0m Payload: \x1b[0m  ${JSON.stringify(payload, null, 2)}`;
      const stck = `\u001b[38;2;253;182;0m Stack: \x1b[0m ${String(stack)}`;
      const end = `------------------------------------------------------------------------------------------------------------------------`;
      return `${lvl} ${time}${msg}  \n${pld}\n${stck} \n${end}`;
    })
  ),
  transports: [new transports.Console()],
});

export default logger;
