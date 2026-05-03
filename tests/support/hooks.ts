import { BeforeAll, AfterAll } from '@cucumber/cucumber';
import { execSync, spawn, ChildProcess } from 'child_process';
import waitOn from 'wait-on';

let apiProcess: ChildProcess;
let webProcess: ChildProcess;

async function killProcess(proc: ChildProcess) {
  if (!proc || !proc.pid) return;
  
  if (process.platform === 'win32') {
    try {
      execSync(`taskkill /pid ${proc.pid} /T /F`, { stdio: 'ignore' });
    } catch (e) {}
  } else {
    proc.kill('SIGKILL');
  }
}

BeforeAll({ timeout: 120000 }, async function() {
  console.log('Nettoyage des ports 4000 et 3000...');
  if (process.platform === 'win32') {
    try {
      execSync('Powershell -Command "Get-NetTCPConnection -LocalPort 4000,3000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }"', { stdio: 'ignore' });
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (e) {}
  }

  console.log('Démarrage de MongoDB via Docker...');
  try {
    execSync('docker-compose up -d mongodb', { stdio: 'inherit' });
  } catch (error) {
    console.error('Erreur lors du démarrage de Docker:', error);
  }

  console.log('Build des packages...');
  execSync('pnpm -F @retro/api build', { stdio: 'inherit' });
  execSync('pnpm -F @retro/web build', { stdio: 'inherit' });

  console.log('Démarrage de l\'API (Production mode)...');
  apiProcess = spawn('pnpm', ['-F', '@retro/api', 'start'], {
    shell: true,
    stdio: 'ignore',
    detached: false
  });

  console.log('Démarrage du Web (Preview mode)...');
  webProcess = spawn('pnpm', ['-F', '@retro/web', 'preview', '--', '--port', '3000', '--strictPort'], {
    shell: true,
    stdio: 'ignore',
    detached: false
  });

  console.log('Attente du démarrage des services...');
  try {
    await waitOn({
      resources: [
        'http://localhost:4000/api/health',
        'http://localhost:3000'
      ],
      timeout: 60000,
      interval: 1000
    });
    console.log('Services prêts !');
  } catch (err) {
    console.error('Erreur lors de l\'attente des services:', err);
  }
});

AfterAll(async function() {
  console.log('Arrêt des applications...');
  await killProcess(webProcess);
  await killProcess(apiProcess);

  console.log('Arrêt de MongoDB...');
  try {
    execSync('docker-compose stop mongodb', { stdio: 'ignore' });
  } catch (error) {
    console.error('Erreur lors de l\'arrêt de Docker:', error);
  }
});
