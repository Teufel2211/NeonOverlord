import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import { createServer } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
let port = parseInt(process.env.DASHBOARD_PORT) || 3000;
const clientId = process.env.CLIENT_ID || '';
const appName = process.env.APP_NAME || 'NeonOverlord Bot';
const inviteUrl = clientId
  ? `https://discord.com/oauth2/authorize?client_id=${clientId}&scope=bot%20applications.commands&permissions=8`
  : '#';

// GitHub Pages URLs (wird automatisch aus Repository-Info generiert)
const githubUsername = process.env.GITHUB_USERNAME || 'teufel2211'; // Aus den GitHub Pages Einstellungen
const githubRepo = process.env.GITHUB_REPO || 'NeonOverlord';
const githubPagesBase = `https://${githubUsername}.github.io/${githubRepo}`;
const termsUrl = `${githubPagesBase}/terms.html`;
const privacyUrl = `${githubPagesBase}/privacy.html`;

// Globale Variable für den aktuellen Port
let currentPort = port;

// Funktion um einen freien Port zu finden
function findAvailablePort(startPort) {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.listen(startPort, () => {
      server.close(() => resolve(startPort));
    });
    server.on('error', () => {
      // Port ist belegt, versuche nächsten
      findAvailablePort(startPort + 1).then(resolve).catch(reject);
    });
  });
}

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
    .status { background: #238636; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin-bottom: 16px; }
  </style>
</head>
<body>
  <header>
    <h1>${appName} Dashboard</h1>
    <div class="status">🟢 Online auf Port ${currentPort}</div>
  </header>
  <main>
    ${body}
    <div class="footer">Dashboard läuft auf Port ${currentPort}. Nutze diesen Service zur Dokumentation und Verifikation.</div>
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
        <li><a href="/terms">Nutzungsbedingungen (lokal)</a></li>
        <li><a href="/privacy">Datenschutzerklärung (lokal)</a></li>
        <li><a href="/features">Feature Ideen</a></li>
        <li><a href="${inviteUrl}">Bot einladen</a></li>
      </ul>
    </div>
    <div class="card">
      <h2>🔗 GitHub Pages Verifikations-URLs</h2>
      <p>Diese öffentlichen URLs kannst du für die Discord-Bot-Verifikation nutzen:</p>
      <ul>
        <li><strong>Privacy Policy URL:</strong> <a href="${privacyUrl}" target="_blank">${privacyUrl}</a></li>
        <li><strong>Terms of Service URL:</strong> <a href="${termsUrl}" target="_blank">${termsUrl}</a></li>
      </ul>
      <p><em>💡 Diese Links funktionieren erst, nachdem du das Repository zu GitHub gepusht hast und der GitHub Pages Workflow erfolgreich gelaufen ist.</em></p>
      <h3>Discord Developer Portal Eintragung:</h3>
      <ol>
        <li>Gehe zu <a href="https://discord.com/developers/applications" target="_blank">discord.com/developers/applications</a></li>
        <li>Wähle deine Bot-Application aus</li>
        <li>Gehe zum Tab "General Information"</li>
        <li>Trage die oben genannten URLs in die Felder "Privacy Policy URL" und "Terms of Service URL" ein</li>
        <li>Klicke auf "Save Changes"</li>
      </ol>
    </div>
    <div class="card">
      <h2>Bot-Informationen</h2>
      <p><strong>Name:</strong> ${appName}</p>
      <p><strong>Client ID:</strong> ${clientId || 'Nicht gesetzt'}</p>
      <p><strong>GitHub Pages:</strong> ${githubPagesBase}</p>
      <p><strong>Verifikationsstatus:</strong> Nutzungsbedingungen und Datenschutzerklärung verfügbar</p>
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
  currentPort = port;
  console.log(`📊 NeonOverlord Dashboard is running on http://localhost:${port}`);
  console.log(`🌐 Öffne diese URL in deinem Browser: http://localhost:${port}`);
}).on('error', async (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`⚠️  Port ${port} ist bereits belegt. Suche nach freiem Port...`);
    try {
      const availablePort = await findAvailablePort(port + 1);
      console.log(`✅ Gefunden: Port ${availablePort}`);
      currentPort = availablePort;
      app.listen(availablePort, () => {
        console.log(`📊 NeonOverlord Dashboard is running on http://localhost:${availablePort}`);
        console.log(`🌐 Öffne diese URL in deinem Browser: http://localhost:${availablePort}`);
      });
    } catch (error) {
      console.error('❌ Konnte keinen freien Port finden:', error);
      process.exit(1);
    }
  } else {
    console.error('❌ Server Fehler:', err);
    process.exit(1);
  }
});
