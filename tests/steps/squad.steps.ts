import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import axios from 'axios';
import { mockSession } from '../support/auth-utils';

const API_URL = 'http://localhost:4000';
const WEB_URL = 'http://localhost:3000';

Given('je suis sur la page de création de Squad', async function () {
  await this.page.goto(`${this.webUrl}/squads`);
});

When('je saisis le nom {string}', async function (name: string) {
  await this.page.fill('input[placeholder*="Nom de la Squad"]', name);
});

When('je valide la création', async function () {
  await this.page.click('button[type="submit"]');
});

Then('une nouvelle Squad nommée {string} est créée', async function (name: string) {
  // On retourne sur la page des squads pour vérifier la liste
  await this.page.goto(`${WEB_URL}/squads`);
  await expect(this.page.locator('.squad-item').filter({ hasText: name })).toBeVisible();
});

Then('je suis l\'administrateur de cette Squad', async function () {
  await expect(this.page.locator('.squad-role')).toContainText('Admin');
});

Then('je suis redirigé vers la page d\'accueil de la Squad {string}', async function (name: string) {
  await expect(this.page).toHaveURL(/.*(squads|board).*/);
});

When('je navigue sur l\'URL d\'invitation contenant l\'ID d\'une Squad {string}', async function (id: string) {
  // On doit être connecté pour rejoindre
  await axios.post(`${API_URL}/api/test/seed-users`, {
    users: [{
      id: 'mock_google_id',
      email: 'mock@example.com',
      firstName: 'John',
      lastName: 'Doe',
      picture: 'https://via.placeholder.com/150'
    }]
  });
  await mockSession(this.page, 'mock_google_id', this.webUrl);
  
  // Créer la squad à rejoindre d'abord via l'API de test
  await axios.post(`${API_URL}/api/test/seed-squads`, {
      squads: [
          { id, name: 'Squad to Join', adminId: 'other_id', memberIds: ['other_id'] }
      ]
  });
  await this.page.goto(`${this.webUrl}/squads/join/${id}`);
});

Then('je rejoins automatiquement la Squad {string} en tant que membre', async function (id: string) {
  await expect(this.page.locator('.squad-item').filter({ hasText: id }).locator('.squad-id')).toContainText(id);
});

Given('je suis connecté et membre de {string} et {string}', async function (squadA: string, squadB: string) {
    // 1. Seed users
    await axios.post(`${API_URL}/api/test/seed-users`, {
      users: [{
        id: 'mock_google_id',
        email: 'mock@example.com',
        firstName: 'John',
        lastName: 'Doe',
        picture: 'https://via.placeholder.com/150'
      }]
    });
    
    // 2. Seed squads
    await axios.post(`${API_URL}/api/test/seed-squads`, {
        squads: [
            { id: 'squad-a-id', name: squadA, adminId: 'mock_google_id', memberIds: ['mock_google_id'] },
            { id: 'squad-b-id', name: squadB, adminId: 'mock_google_id', memberIds: ['mock_google_id'] }
        ]
    });

    // 3. Authenticate and go to app
    await mockSession(this.page, 'mock_google_id');
    await this.page.goto(`${WEB_URL}/squads`);
});

Given('je suis sur la page d\'accueil de la {string}', async function (name: string) {
    await this.page.goto(`${WEB_URL}/squads`);
    await expect(this.page.locator('.squad-item').filter({ hasText: name })).toBeVisible();
});

Then('je suis redirigé vers la page d\'accueil de la {string}', async function (name: string) {
    await expect(this.page).toHaveURL(/.*(squads|board).*/);
});

When('je sélectionne {string} dans la liste des squads', async function (name: string) {
    await this.page.click(`.squad-link:has-text("${name}")`);
});
