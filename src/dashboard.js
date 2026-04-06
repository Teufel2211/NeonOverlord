import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = process.env.DASHBOARD_PORT || 3000;
const clientId = process.env.CLIENT_ID || '';
const appName = process.env.APP_NAME || 'NeonOverlord Bot';
const inviteUrl = clientId
  ? `https://discord.com/oauth2/authorize?client_id=${clientId}&scope=bot%20applications.commands&permissions=8`
  : '#';

function renderPage(title, body) {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body { background: #0d1117; color: #c9d1d9; font-family: Inter, sans-serif; margin: 0; padding: 0; }
    header { background: #161b22; padding: 24px 32px; border-bottom: 1px solid #30363d; }
    main { padding: 32px; max-width: 980px; margin: auto; }
    a { color: #58a6ff; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .card { background: #161b22; border: 1px solid #30363d; border-radius: 16px; padding: 24px; margin-bottom: 20px; }
    h1, h2 { margin: 0 0 16px; }
    pre { background: #010409; color: #c9d1d9; padding: 16px; border-radius: 12px; overflow-x: auto; }
    .footer { margin-top: 40px; color: #8b949e; }
  </style>
</head>
<body>
  <header>
    <h1>${appName} Dashboard</h1>
  </header>
  <main>
    ${body}
    <div class="footer">Dashboard läuft auf Port ${port}. Nutze diesen Service zur Dokumentation und Verifikation.</div>
  </main>
</body>
</html>`;
}

function loadMarkdown(filename) {
  const filePath = join(__dirname, '..', filename);
  try {
    return readFileSync(filePath, 'utf-8');
  } catch (error) {
    return 'Dokument nicht gefunden.';
  }
}

app.get('/', (req, res) => {
  const body = `
    <div class="card">
      <h2>Willkommen im NeonOverlord Dashboard</h2>
      <p>Dieses Dashboard bietet schnelle Informationen, Verifikationslinks und die Rechtsdokumente für deinen Bot.</p>
      <ul>
        <li><a href="/terms">Nutzungsbedingungen</a></li>
        <li><a href="/privacy">Datenschutzerklärung</a></li>
        <li><a href="/features">Feature Ideen</a></li>
        <li><a href="${inviteUrl}">Bot einladen</a></li>
      </ul>
    </div>
    <div class="card">
      <h2>Bot-Informationen</h2>
      <p><strong>Name:</strong> ${appName}</p>
      <p><strong>Client ID:</strong> ${clientId || 'Nicht gesetzt'}</p>
      <p><strong>Verifikationsdokumente:</strong> Nutzungsbedingungen und Datenschutzerklärung</p>
    </div>
  `;
  res.send(renderPage('NeonOverlord Dashboard', body));
});

app.get('/terms', (req, res) => {
  const content = loadMarkdown('TERMS_OF_SERVICE.md');
  res.send(renderPage('Nutzungsbedingungen', `<pre>${content}</pre>`));
});

app.get('/privacy', (req, res) => {
  const content = loadMarkdown('PRIVACY_POLICY.md');
  res.send(renderPage('Datenschutzerklärung', `<pre>${content}</pre>`));
});

app.get('/features', (req, res) => {
  const content = loadMarkdown('FEATURE_IDEEN.md');
  res.send(renderPage('Feature Ideen', `<pre>${content}</pre>`));
});

app.listen(port, () => {
  console.log(`📊 NeonOverlord Dashboard is running on http://localhost:${port}`);
});
