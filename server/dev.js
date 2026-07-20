import { spawn } from 'node:child_process';

const run = (command, args, label) => {
  const child = spawn(command, args, {
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true,
    env: { ...process.env },
  });

  child.stdout.on('data', (data) => process.stdout.write(`[${label}] ${data}`));
  child.stderr.on('data', (data) => process.stderr.write(`[${label}] ${data}`));
  child.on('exit', (code) => {
    if (code && code !== 0) process.exitCode = code;
  });
  return child;
};

const api = run('node', ['server/index.js'], 'api');
const web = run('vite', ['--host', '127.0.0.1', '--port', '5173'], 'web');

const stop = () => {
  api.kill();
  web.kill();
};

process.on('SIGINT', stop);
process.on('SIGTERM', stop);
