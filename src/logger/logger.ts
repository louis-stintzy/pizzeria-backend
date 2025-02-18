import { addColors, createLogger, format, transports } from 'winston';

// Niveaux de logs personnalisés
const customLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

// couleur des niveaux de logs
const customColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  verbose: 'blue',
  debug: 'cyan',
  silly: 'white',
};
addColors(customColors);

const logger = createLogger({
  levels: customLevels,
  level: 'http', // niveau minimum (ou maximum) pour logger (info, warn, error, etc.)
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
      if (level.includes('http')) return `${lvl} ${time}${msg}`;
      if (level.includes('error')) return `${lvl} ${time}${msg}  \n${pld}\n${stck} \n${end}`;
      return `${lvl} ${time}${msg}  \n${pld}\n${stck} \n${end}`; // default
    })
  ),
  transports: [new transports.Console()],
});

export default logger;
