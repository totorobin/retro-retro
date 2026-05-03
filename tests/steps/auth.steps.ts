import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import axios from 'axios';
import { mockSession } from '../support/auth-utils';

const API_URL = 'http://localhost:4000';
const WEB_URL = 'http://localhost:3000';

Given("que je n'ai pas de compte sur l'application", async function () {
  await axios.post(`${API_URL}/api/test/clear-db`).catch(() => {});
});

Given("je n'ai pas de compte sur l'application", async function () {
  await axios.post(`${API_URL}/api/test/clear-db`).catch(() => {});
});

Given('que je suis sur la page de connexion', async function () {
  await this.page.goto(`${this.webUrl}/login`);
});

Given('je suis sur la page de connexion', async function () {
  await this.page.goto(`${this.webUrl}/login`);
});

When('je choisis de me connecter avec mon compte Google', async function () {
  await this.page.waitForSelector('.google-btn', { state: 'visible', timeout: 30000 });
  await this.page.click('.google-btn');
});

When("que je m'authentifie avec succès auprès de Google", async function () {
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
  await this.page.goto(`${this.webUrl}/squads`);
});

When("je m'authentifie avec succès auprès de Google", async function () {
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
  await this.page.goto(`${this.webUrl}/squads`);
});

Then('un compte est créé automatiquement avec mon identifiant unique Google', async function () {
});

Then(/^mes informations \(nom, prénom, email\) sont récupérées depuis Google$/, async function () {
    await this.page.click('.menu-burger');
    await expect(this.page.locator('.user-info')).toContainText('John Doe');
});

Then(/^mes informations "([^"]*)" sont récupérées depuis Google$/, async function (info: string) {
});

Then("je suis redirigé vers l'invitation à rejoindre ou créer une Squad", async function () {
  await expect(this.page).toHaveURL(/.*squads/);
});

Given("j'ai déjà un compte lié à mon identifiant Google", async function () {
    await axios.post(`${API_URL}/api/test/seed-users`, {
        users: [{
          id: 'mock_google_id',
          email: 'mock@example.com',
          firstName: 'John',
          lastName: 'Doe',
          picture: 'https://via.placeholder.com/150'
        }]
    });
});

Then('je suis connecté avec succès à mon compte existant', async function () {
  await this.page.click('.menu-burger');
  await expect(this.page.locator('.user-info')).toBeVisible();
});

Then("je suis redirigé vers ma Squad par défaut ou la page d'accueil", async function () {
  await expect(this.page).toHaveURL(/.*squads/);
});

Given("que je suis connecté à l'application", async function () {
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
  await this.page.goto(`${this.webUrl}/squads`);
  await expect(this.page).toHaveURL(/.*squads/);
});

Given("je suis connecté à l'application", async function () {
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
  await this.page.goto(`${this.webUrl}/squads`);
  await expect(this.page).toHaveURL(/.*squads/);
});

When("j'ouvre le menu burger de l'entête", async function () {
  await this.page.waitForSelector('.menu-burger', { state: 'visible', timeout: 30000 });
  await this.page.click('.menu-burger');
});

When('que je sélectionne "Se déconnecter"', async function () {
  await this.page.click('button:has-text("Se déconnecter")');
});

When('je sélectionne {string}', async function (text: string) {
  await this.page.click(`button:has-text("${text}")`);
});

Then('ma session est fermée', async function () {
    await this.page.goto(`${this.webUrl}/squads`);
    await expect(this.page).toHaveURL(/.*login/);
});

Then('je suis redirigé vers la page de connexion', async function () {
  await expect(this.page).toHaveURL(/.*login/);
});
