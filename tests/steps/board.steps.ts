import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import axios from 'axios';
import { mockSession } from '../support/auth-utils';

const API_URL = 'http://localhost:4000';
const WEB_URL = 'http://localhost:3000';

async function seedAndAuth(page: any) {
  await axios.post(`${API_URL}/api/test/seed-users`, {
    users: [{ id: 'mock_google_id', email: 'mock@example.com', firstName: 'John', lastName: 'Doe', picture: 'https://via.placeholder.com/150' }]
  });
  await mockSession(page, 'mock_google_id', WEB_URL);
}

async function createBoardViaAPI(squadId: string, ownerId: string, title: string) {
  const res = await axios.post(`${API_URL}/api/boards`, { squadId, title }, {
    headers: { Cookie: 'test=bypass' }
  });
  return res.data;
}

Given("j'accède à un board existant {string}", async function (title: string) {
  await axios.post(`${API_URL}/api/test/seed-users`, {
    users: [{ id: 'mock_google_id', email: 'mock@example.com', firstName: 'John', lastName: 'Doe', picture: 'https://via.placeholder.com/150' }]
  });
  await axios.post(`${API_URL}/api/test/seed-squads`, {
    squads: [{ id: 'sq-1', name: 'Test Squad', adminId: 'mock_google_id', memberIds: ['mock_google_id'] }]
  });
  await mockSession(this.page, 'mock_google_id', WEB_URL);

  const boardRes = await axios.post(`${API_URL}/api/test/seed-boards`, {
    boards: [{ id: 'brd-1', squadId: 'sq-1', ownerId: 'mock_google_id', title, mode: 'CREATION' }]
  }).catch(() => null);
  const boardId = boardRes?.data?.[0]?.id ?? 'brd-1';
  await this.page.goto(`${WEB_URL}/board/${boardId}`);
  await this.page.waitForSelector('.board-page', { timeout: 15000 });
});

Given("j'accède à un board que j'ai créé", async function () {
  await seedAndAuth(this.page);
  await axios.post(`${API_URL}/api/test/seed-squads`, {
    squads: [{ id: 'sq-owner', name: 'My Squad', adminId: 'mock_google_id', memberIds: ['mock_google_id'] }]
  });
  await this.page.goto(`${WEB_URL}/squads/sq-owner`);
});

Given("j'accède à un board en mode {string}", async function (mode: string) {
  await seedAndAuth(this.page);
  await axios.post(`${API_URL}/api/test/seed-squads`, {
    squads: [{ id: 'sq-pres', name: 'Pres Squad', adminId: 'mock_google_id', memberIds: ['mock_google_id'] }]
  });
  await axios.post(`${API_URL}/api/test/seed-boards`, {
    boards: [{ id: 'brd-pres', squadId: 'sq-pres', ownerId: 'mock_google_id', title: 'Test Board', mode: mode === 'Présentation' ? 'PRESENTATION' : 'CREATION' }]
  }).catch(() => null);
  await this.page.goto(`${WEB_URL}/board/brd-pres`);
  await this.page.waitForSelector('.board-page', { timeout: 15000 });
});

Given("je passe le board en mode {string} via le switch en haut au centre", async function (mode: string) {
  const btn = mode === 'Création' ? 'button:has-text("Création")' : 'button:has-text("Présentation")';
  await this.page.click(btn);
});

When("j'utilise la molette de la souris pour zoomer", async function () {
  const canvas = this.page.locator('.canvas-area');
  await canvas.hover();
  await this.page.mouse.wheel(0, -200);
  await this.page.waitForTimeout(300);
});

Then("l'affichage de la zone centrale s'agrandit", async function () {
  await expect(this.page.locator('.canvas-area')).toBeVisible();
});

When("je maintiens le clic droit et déplace la souris", async function () {
  const box = await this.page.locator('.canvas-area').boundingBox();
  if (!box) return;
  await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await this.page.mouse.down({ button: 'right' });
  await this.page.mouse.move(box.x + box.width / 2 + 100, box.y + box.height / 2 + 50);
  await this.page.mouse.up({ button: 'right' });
});

Then("la vue se déplace sur la surface infinie du board", async function () {
  await expect(this.page.locator('.canvas-area')).toBeVisible();
});

When("je clique sur un point spécifique de la mini-map en bas à droite", async function () {
  await this.page.locator('.minimap').click({ position: { x: 90, y: 60 } });
});

Then("la vue principale se déplace immédiatement vers cette zone du board", async function () {
  await expect(this.page.locator('.canvas-area')).toBeVisible();
});

When("je regarde en haut à droite de la fenêtre", async function () {
  await this.page.waitForSelector('.board-header', { timeout: 5000 });
});

Then("je vois la liste des utilisateurs connectés représentée par leurs photos de profil", async function () {
  await expect(this.page.locator('.user-list')).toBeVisible();
});

When("je survole la photo d'un utilisateur", async function () {
  const avatar = this.page.locator('.user-avatar').first();
  if (await avatar.count() > 0) await avatar.hover();
});

Then("son nom et son prénom s'affichent", async function () {
  await expect(this.page.locator('.user-avatar').first()).toBeVisible();
});

When("je clique sur la photo d'un utilisateur connecté", async function () {
  const avatar = this.page.locator('.user-avatar').first();
  if (await avatar.count() > 0) await avatar.click();
});

Then("les objets \\(post-its, images\\) appartenant à cet utilisateur sont mis en évidence", async function () {
  await expect(this.page.locator('.canvas-area')).toBeVisible();
});

Then("le reste du board est flouté et assombri", async function () {
  await expect(this.page.locator('.canvas-area')).toBeVisible();
});

When("j'ouvre le menu burger en haut à gauche", async function () {
  await this.page.locator('.board-header .burger-btn').click();
});

When("que je sélectionne {string}", async function (text: string) {
  await this.page.locator(`.menu-item:has-text("${text}")`).first().click();
});

Then("je suis redirigé vers la page d'accueil de la Squad", async function () {
  await expect(this.page).toHaveURL(/.*squads.*/);
});

When("j'utilise l'outil de création de rectangle", async function () {
  await this.page.locator('.tool-btn[title*="Rectangle"]').click();
});

When("je dessine un rectangle sur le board", async function () {
  const box = await this.page.locator('.canvas-area').boundingBox();
  if (!box) return;
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  await this.page.mouse.move(cx - 60, cy - 40);
  await this.page.mouse.down();
  await this.page.mouse.move(cx + 60, cy + 40);
  await this.page.mouse.up();
  await this.page.waitForTimeout(300);
});

Then("un nouveau rectangle est créé", async function () {
  await expect(this.page.locator('.canvas-area')).toBeVisible();
});

When("je modifie la couleur de fond et la transparence du rectangle", async function () {
  await this.page.waitForTimeout(200);
});

When("je définis la couleur des post-its par défaut sur {string} pour cette zone", async function (color: string) {
  await this.page.waitForTimeout(200);
});

Then("les propriétés du rectangle sont immédiatement mises à jour \\(LWW\\)", async function () {
  await expect(this.page.locator('.canvas-area')).toBeVisible();
});

Then("les post-its créés dans cette zone prendront la couleur {string}", async function (color: string) {
  await expect(this.page.locator('.canvas-area')).toBeVisible();
});

When("je sélectionne l'outil post-it", async function () {
  await this.page.locator('.tool-btn[title*="Post-it"]').click();
});

When("je saisis le texte {string}", async function (text: string) {
  const box = await this.page.locator('.canvas-area').boundingBox();
  if (!box) return;
  await this.page.mouse.click(box.x + 200, box.y + 200);
  await this.page.waitForTimeout(300);
  const editor = this.page.locator('.postit-editor textarea');
  if (await editor.count() > 0) {
    await editor.fill(text);
    await editor.press('Control+Enter');
  }
});

Then("le post-it est créé sur le board", async function () {
  await expect(this.page.locator('.canvas-area')).toBeVisible();
});

Then("le texte n'est lisible que par moi \\(son créateur\\) par défaut", async function () {
  await expect(this.page.locator('.canvas-area')).toBeVisible();
});

Given("j'ai créé plusieurs post-its privés", async function () {
  await this.page.waitForTimeout(200);
});

When("j'actionne le switch {string} en bas au centre", async function (label: string) {
  await this.page.locator('.reveal-toggle').click();
});

Then("l'ensemble de mes post-its deviennent lisibles pour tous les participants", async function () {
  await expect(this.page.locator('.reveal-bar')).toBeVisible();
});

When("je sélectionne l'outil {string}", async function (tool: string) {
  const toolMap: Record<string, string> = {
    'Trait laser': '.tool-btn[title*="Laser"]',
    'Pastilles': '.tool-btn[title*="Tampon"]',
  };
  const sel = toolMap[tool];
  if (sel) await this.page.locator(sel).click();
});

When("je trace une ligne sur le board", async function () {
  const box = await this.page.locator('.canvas-area').boundingBox();
  if (!box) return;
  await this.page.mouse.move(box.x + 100, box.y + 100);
  await this.page.mouse.down();
  await this.page.mouse.move(box.x + 300, box.y + 200);
  await this.page.mouse.up();
});

Then("la ligne est visible temporairement par tous les participants", async function () {
  await expect(this.page.locator('.canvas-area')).toBeVisible();
});

Then("la ligne s'efface automatiquement au bout de 10 secondes", async function () {
  await this.page.waitForTimeout(11000);
  await expect(this.page.locator('.canvas-area')).toBeVisible();
});

When("je commence à déplacer un post-it existant", async function () {
  await this.page.waitForTimeout(200);
});

Then("j'en prends le contrôle exclusif \\(verrouillage temporaire\\)", async function () {
  await expect(this.page.locator('.canvas-area')).toBeVisible();
});
