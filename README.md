# Discord Server Management Bot - NeonOverlord

Ein vollständiger, automatisierter Discord-Bot für Server-Management und Community-Aktivierung mit discord.js v14.

## ✨ Hauptfeatures

### 🏗️ Automatisches Server-Setup mit Themes
**Wähle dein Theme:**
- `/setup general` - Allgemeiner Community-Server
- `/setup roblox-rp` - Roblox Roleplay Server
- `/setup gta-rp` - GTA Roleplay Server  
- `/setup minecraft-rp` - Minecraft Roleplay Server
- `/setup anime-rp` - Anime Roleplay Server

**Jedes Theme erstellt automatisch:**
- Theme-spezifische Kategorien und Channels
- Passende Rollen mit Berechtigungen
- Server-Name und -Einstellungen
- Spezial-Invite (maxUses=1) für First-Join
- **Sofortige Community-Aktivierung** mit Willkommensnachrichten, Memes, Umfragen und Regeln

### 👑 First-Join & Community-Aktivierung
- Erster Member erhält automatisch Owner-Rolle
- Invite per DM an Initiator senden
- Community-Message in #welcome: "@everyone Hey, unser erster Member ist da!"
- Logging in #server-logs

### 🎭 Community-Features
- `/community poll` - Umfragen mit Reaktionen erstellen
- `/community reactionrole` - Reaktionsrollen für automatische Rollen-Zuweisung
- `/community event` - Event-Reminders in #announcements posten
- `/community announcement` - Ankündigungen in #announcements senden
- `/community support` - Support-Ticket anfordern
- `/community ticket create` - Ticket-Kanal erstellen
- `/community ticket close` - Ticket-Kanal schließen
- `/community meme` - Zufällige Memes posten
- `/community quiz` - Einfache Quiz starten
- Automatische Rollen-Zuweisung nach Aktivität (Active Member)
- Reaktionszähler für Community-Belohnungen

### 🛡️ Moderation & Sicherheit
- Vollständige Moderation: Kick, Ban, Timeout, Nickname-Änderung
- Auto-Moderation: Spam-Erkennung (wiederholte Zeichen, Discord-Invites, Short-URLs)
- Rollen-Management: Zuweisen/Entfernen von Rollen
- Logging aller Moderations-Aktionen

### 📊 Log-System
- #server-logs: Join/Leave, Ban/Kick, Role-Changes, Invite-Tracking
- #voice-chat-logs: Voice-Channel-Aktivitäten
- Automatische Pings bei Voice-Channel-Betritt

### 🎵 Voice-Channel-Management
- Voice-Channels mit Emojis im Namen
- Automatische Pings bei Aktivität
- Logging von Voice-Bewegungen

### 🛠️ Erweiterte Verwaltung
- Mehrere Kanäle/Rollen gleichzeitig erstellen
- Kategorie-Positionierung automatisch setzen
- Rollen mit Farben, Berechtigungen und Emojis
- Channel-Namen dynamisch anpassen

## 🚀 Schnellstart

1. **Repository klonen**
   ```bash
   git clone <repository-url>
   cd NeonOverlord
   ```

2. **Dependencies installieren**
   ```bash
   npm install
   ```

3. **Environment-Variablen konfigurieren**
   ```bash
   # .env Datei erstellen
   DISCORD_TOKEN=your_bot_token
   CLIENT_ID=your_client_id
   GUILD_ID=your_guild_id
   ```

4. **Commands deployen**
   ```bash
   npm run deploy
   ```

### Schritt 5: Dashboard starten
```bash
npm run dashboard
```
→ Öffne `http://localhost:3000` im Browser für lokale Dokumentation und Verifikations-URLs.

### Schritt 6: GitHub Pages veröffentlichen
   - Erstelle ein Repository bei GitHub
   - Push dein Projekt
   - GitHub Pages veröffentlicht automatisch den Ordner `docs/`
   - Die öffentlichen URLs sind dann z. B. `https://<username>.github.io/<repo>/terms.html` und `https://<username>.github.io/<repo>/privacy.html`

> Hinweis: Der Workflow nutzt den eingebauten GitHub Actions Token `github.token`, daher musst du normalerweise keinen eigenen Secret-Namen anlegen.
> Falls du einen eigenen Token einträgst, nutze `Settings -> Secrets and variables -> Actions -> New repository secret` mit einem Namen wie `ACTIONS_DEPLOY_TOKEN`.
>
> Wenn du nach dem ersten Push eine 404-Seite siehst, überprüfe:
> 1. Ob deine Dateien auf GitHub im Branch `main` / `master` sind.
> 2. Ob der Workflow `.github/workflows/pages.yml` erfolgreich ausgeführt wurde.
> 3. Ob in den Repository-Einstellungen unter GitHub Pages als Quelle `gh-pages` oder `deployment branch` ausgewählt ist.
> 4. Warte ein paar Minuten, bis GitHub Pages die Seite veröffentlicht.

## Discord-Verifizierung: Was du eintragen musst
- **Privacy Policy URL**: `https://<username>.github.io/<repo>/privacy.html`
- **Terms of Service URL**: `https://<username>.github.io/<repo>/terms.html`

Trage diese Links im Discord Developer Portal unter deiner Anwendung beim Abschnitt **Privacy Policy URL** und **Terms of Service URL** ein.

Falls du keine eigene Seite willst, kannst du alternativ einen öffentlichen GitHub Pages Link nutzen, der auf dieselben Dateien zeigt.

### Schritt 7: Repository zu GitHub pushen
```bash
git init
git add .
git commit -m "Initial commit: NeonOverlord Discord Bot"
git remote add origin https://github.com/teufel2211/NeonOverlord.git
git branch -M main
git push -u origin main
```

8. **Server setup**
   ```
   /setup general    # oder roblox-rp, gta-rp, minecraft-rp, anime-rp
   ```

> Für die Discord-Verifizierung kannst du dann diese öffentlichen URLs nutzen:
> - Nutzungsbedingungen: `docs/terms.html`
> - Datenschutzerklärung: `docs/privacy.html`

## 📋 Command-Übersicht

### Setup & Verwaltung
- `/setup general/roblox-rp/gta-rp/minecraft-rp/anime-rp` - Theme-basiertes Server-Setup
- `/category create/delete` - Kategorien verwalten
- `/channel create/delete/rename` - Kanäle verwalten
- `/role create/delete/rename/assign` - Rollen verwalten

### Moderation
- `/moderation kick/ban/unban/timeout` - Moderations-Aktionen
- `/user nickname` - Nickname ändern
- `/voice move` - Voice-Management

### Community
- `/community poll` - Umfragen erstellen
- `/community reactionrole` - Reaktionsrollen
- `/community event` - Events posten
- `/community meme` - Memes posten
- `/community quiz` - Quiz starten

### Invites & Tracking
- `/invite create/delete/track` - Invite-Management

## 🔒 Sicherheit & Einschränkungen

- **Owner-Transfer**: Nicht möglich (Sicherheitsfeature)
- **Server-Erstellung/Löschung**: Nur bestehende Server modifizieren
- **Bot-Rolle**: Muss hoch genug sein für Admin-Rechte
- **Auto-Mod**: Erkennt Spam und verbotene Inhalte
- **Logging**: Alle Aktionen werden protokolliert

## 🎯 Ziel

Ein komplett automatisierter, community-aktiver Discord-Bot, der:
- Server automatisch aufbaut und strukturiert
- Kanäle, Rollen & Emojis erstellt
- Community aktiviert und interaktiv gestaltet
- Moderation und Sicherheit gewährleistet
- Alles loggt und organisiert

## 📝 Technische Details

- **Framework**: discord.js v14
- **Node.js**: ES6 Modules
- **Intents**: Guilds, Members, Bans, Invites, Voice, DMs, Messages
- **Commands**: Slash-Commands
- **Events**: Automatische Event-Handler
- **Logging**: Strukturiertes Logging-System

## 🤝 Beitrag

Issues und Pull-Requests sind willkommen! Bitte beschreibe Änderungen detailliert.

## 📄 Lizenz

MIT License - siehe LICENSE Datei für Details.
- `/server banner` - Banner hochladen
- `/server setafk` - AFK-Channel setzen
- `/server setsystem` - System-Channel setzen
- `/server info` - Server-Informationen

### 📊 Log-System
Auto-erstellter #server-logs Channel mit Logging für:
- ✅ Join-Logs
- ✅ Leave-Logs
- ✅ Ban-Logs
- ✅ Unban-Logs
- ✅ Kick-Logs
- ✅ Timeout-Logs
- ✅ Invite-Usage-Logs
- ✅ First-Join-Owner-Logs

## 🚀 Installation

### 1. Projekt-Setup
```bash
# Repository klonen oder entpacken
cd "neuer discord bot"

# Dependencies installieren
npm install
```

### 2. Environment konfigurieren

Erstelle eine `.env` Datei oder bearbeite die vorhandene:

```env
# Discord Bot Token - von https://discord.com/developers/applications
DISCORD_TOKEN=your_bot_token_here

# Bot Client ID - von https://discord.com/developers/applications
CLIENT_ID=your_client_id_here

# Guild ID für schnelleres Testen (optional)
GUILD_ID=your_guild_id_here

# Umgebung
NODE_ENV=development
```

### 3. Discord Bot erstellen

1. Gehe zu https://discord.com/developers/applications
2. Klick auf "New Application"
3. Gib einen Namen ein (z.B. "Server Management Bot")
4. Gehe zu "Bot" → "Add Bot"
5. Kopiere den Token unter "TOKEN"
6. Gehe zu OAuth2 → URL Generator
7. Wähle diese Scopes:
   - `bot`
   - `applications.commands`
8. Wähle diese Permissions:
   - `Administrator` (oder spezifische Permissions)
9. Generiere die URL und öffne sie, um den Bot zu Servern hinzuzufügen

### 4. Slash Commands deployen

```bash
npm run deploy
```

Dieser Befehl registriert alle Slash Commands. Wenn `GUILD_ID` gesetzt ist, werden sie nur auf dem Test-Server registriert ⚡. Ohne `GUILD_ID` werden sie global registriert (dauert bis zu 1 Stunde).

### 5. Bot starten

```bash
# Produktions-Modus
npm start

# Entwicklungs-Modus (mit Auto-Reload)
npm run dev
```

## 📋 Berechtigungen

Der Bot benötigt folgende Discord-Permissions:

- ✅ Administrator (empfohlen) ODER:
- Manage Guild
- Manage Channels
- Manage Roles
- Manage Messages
- Kick Members
- Ban Members
- Timeout Members
- Move Members
- Manage Nicknames

## 📁 Projektstruktur

```
discord-bot/
├── src/
│   ├── commands/          # Slash Commands
│   │   ├── channel.js
│   │   ├── category.js
│   │   ├── role.js
│   │   ├── moderation.js
│   │   ├── user.js
│   │   ├── voice.js
│   │   ├── invite.js
│   │   ├── server.js
│   │   └── setup.js
│   ├── events/            # Discord Events
│   │   ├── ready.js
│   │   ├── interactionCreate.js
│   │   ├── guildMemberAdd.js
│   │   ├── guildMemberRemove.js
│   │   ├── guildBanAdd.js
│   │   └── guildBanRemove.js
│   ├── utils/             # Hilfsfunktionen
│   │   ├── logger.js      # Logging
│   │   ├── embeds.js      # Embed Helper
│   │   ├── permissions.js # Permission Checks
│   │   ├── validation.js  # Input Validation
│   │   └── inviteManager.js # Invite Tracking
│   ├── index.js           # Bot Entry Point
│   └── deploy-commands.js # Command Deployer
├── .env                   # Environment Variables
├── .env.example           # Example .env
├── package.json
├── .gitignore
└── README.md
```

## 🔧 Konfiguration

### Logging
Das Logger-System nutzt Emojis und Timestamps automatisch:
- ✅ Success (grün)
- ❌ Errors (rot)
- ℹ️ Info (blau)
- ⚠️ Warnings (gelb)
- 🐛 Debug (grau, nur in development)

### Invites
Invites werden in-memory gespeichert. Für Produktions-Einsatz sollte eine Datenbank used werden.

## 🛡️ Sicherheit & Einschränkungen

Der Bot ist so programmiert, dass er folgende Aktionen **blockiert**:
- ❌ Server Owner übertragen
- ❌ Server löschen
- ❌ Server erstellen
- ❌ Managed Roles (Bot-Rollen) löschen

## 📝 Anwendungsbeispiele

### Setup durchführen
```
/setup server
```
Der Bot erstellt automatisch alle nötigen Channels, Rollen und Invites.

### Nutzer kicken mit Grund
```
/moderation kick @user Spam
```

### Timeout für 2 Stunden
```
/moderation timeout @user 2h Spam
```

### Invite mit Limit erstellen
```
/invite create #general 1 0
```
(1 max Use, kein Ablauf)

### Server umbenennen
```
/server rename Neuer Name
```

## 🐛 Fehlerbehebung

### Commands werden nicht angezeigt
1. Stelle sicher, dass die Commands deployed wurden: `npm run deploy`
2. Warte bis zu 1 Stunde für globale Commands
3. Bot muss `applications.commands` Scope haben
4. Teste mit GUILD_ID für sofortige Verfügbarkeit

### Permissions Error
- Sicher, dass der Bot höhere Rollen als das Ziel hat
- Bot braucht die nötigen Permissions
- Server Owner kann nicht verwaltet werden

### First-Join Invite funktioniert nicht
- Sicher, dass der Bot das GuildInvites Intent hat (✅ ist gesetzt)
- First-Join Invite kann nur einmal genutzt werden
- Danach ist der Code invalid

## 📖 Discord.js v14 Dokumentation
https://discord.js.org

## 📄 Lizenz
MIT License

## 👨‍💻 Support

Für Fragen oder Probleme:
1. Prüfe ob alle Dependencies installiert sind: `npm install`
2. Verändere die DISCORD_TOKEN und CLIENT_ID in der .env Datei
3. Stelle sicher, dass die .env im root-Verzeichnis liegt
4. Nutze `npm run dev` für Debugging

---

**Viel Erfolg mit deinem Discord Bot! 🎉**
