import fs from 'fs';
import { dirname } from 'path';
import { env } from 'process';
import { fileURLToPath } from 'url';

const baseDirName = dirname(dirname(fileURLToPath(import.meta.url)));
const nodeEnv = env.NODE_ENV || 'development';

function getEnvironment() {
  const path = `${baseDirName}/env/${nodeEnv}.json`;
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

const environment = getEnvironment();

export { baseDirName, environment, nodeEnv };
export default environment;
