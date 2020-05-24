import fs from 'fs';
import path from 'path';
import { env } from 'process';
import { fileURLToPath } from 'url';

const baseDirName = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const nodeEnv = env.NODE_ENV || 'development';

function getEnvironment() {
  const envPath = path.join(baseDirName, 'env', `${nodeEnv}.json`);
  return JSON.parse(fs.readFileSync(envPath, 'utf8'));
}

const environment = getEnvironment();

export { baseDirName, environment, nodeEnv };
export default environment;
