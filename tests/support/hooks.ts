import { BeforeAll, AfterAll } from '@cucumber/cucumber';
import { execSync, spawn, ChildProcess } from 'child_process';
import waitOn from 'wait-on';

let apiProcess: ChildProcess;
let webProcess: ChildProcess;

async function killProcess(proc: ChildProcess) {
  if (!proc || !proc.pid) return;
  
  console.log(`Tentative d'arrêt du processus ${proc.pid}...`);
  
  if (process.platform === 'win32') {
    try {
      execSync(`taskkill /pid ${proc.pid} /T /F`, { stdio: 'ignore' });
    } catch (e) {}
  } else {
    proc.kill('SIGKILL');
  }
}

BeforeAll(async function() {
  console.log('Nettoyage des ports 4000 et 3000...');
  if (process.platform === 'win32') {
    try {
      // Tuer les processus qui écoutent sur les ports 4000 et 3000
      execSync('Powershell -Command "Get-NetTCPConnection -LocalPort 4000,3000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }"', { stdio: 'ignore' });
      // Attendre un peu que Windows libère réellement les ports
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (e) {}
  }

  console.log('Démarrage de MongoDB via Docker...');
  try {
    execSync('docker-compose up -d mongodb', { stdio: 'inherit' });
  } catch (error) {
    console.error('Erreur lors du démarrage de Docker:', error);
  }

  console.log('Démarrage de l\'API...');
  apiProcess = spawn('pnpm', ['-F', '@retro/api', 'dev'], {
    shell: true,
    stdio: 'ignore',
    detached: false
  });

  console.log('Démarrage du Web...');
  webProcess = spawn('pnpm', ['-F', '@retro/web', 'dev'], {
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
  await killProcess(apiProcess);
  await killProcess(webProcess);

  console.log('Arrêt de MongoDB...');
  try {
    execSync('docker-compose stop mongodb', { stdio: 'inherit' });
  } catch (error) {
    console.error('Erreur lors de l\'arrêt de Docker:', error);
  }
});
