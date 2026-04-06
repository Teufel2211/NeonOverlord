# 🚀 Discord Bot - Schnellstart Guide

## Installation (in 5 Minuten)

### Schritt 1: Dependencies installieren
```bash
npm install
```

### Schritt 2: Environment konfigurieren
1. Öffne die `.env` Datei
2. Ersetze die Platzhalter:
   - `DISCORD_TOKEN` - Dein Bot Token von discord.com/developers
   - `CLIENT_ID` - Deine Application ID
   - `GUILD_ID` - Optional: Deine Test-Server ID (schnelleres Deployment)

### Schritt 3: Commands deployen
```bash
npm run deploy
```

### Schritt 4: Bot starten
```bash
npm start
```

### Schritt 5: Dashboard starten
```bash
npm run dashboard
```

### Schritt 6: GitHub Pages (Verifikation)
1. Repository zu GitHub hochladen
2. GitHub Pages aktivieren oder die workflow-Datei nutzen
3. Öffentliche Links verwenden:
   - `https://<username>.github.io/<repo>/terms.html`
   - `https://<username>.github.io/<repo>/privacy.html`

> Hinweis: Der Workflow nutzt den eingebauten GitHub Actions Token `github.token`, daher musst du normalerweise keinen eigenen Secret-Namen anlegen.
> Falls du einen eigenen Token einträgst, nutze `Settings -> Secrets and variables -> Actions -> New repository secret` mit einem Namen wie `ACTIONS_DEPLOY_TOKEN`.

---

## 📊 Bot-Commands Übersicht

### 🎯 Auto-Setup (ANFANG!)
```
Wähle dein Theme:
/setup general     # Allgemeiner Community-Server
/setup roblox-rp   # Roblox Roleplay Server
/setup gta-rp      # GTA Roleplay Server
/setup minecraft-rp # Minecraft Roleplay Server
/setup anime-rp    # Anime Roleplay Server
```
→ Erstellt automatisch theme-spezifische Channels, Rollen, Logs + sofortige Community-Aktivierung!

### 🛠️ Channel Management
```
/channel create <name> <type>      # Neuen Channel erstellen
/channel delete <channel>           # Channel löschen
/channel rename <channel> <name>    # Channel umbenennen
/channel slowmode <channel> <sec>   # Slowmode setzen (0 = aus)
/category create <name>             # Kategorie erstellen
/category delete <category>         # Kategorie löschen
```

### 👥 Rollen Management
```
/role create <name> [color]         # Rolle erstellen (z.B. #FF0000)
/role delete <role>                 # Rolle löschen
/role rename <role> <newname>       # Rolle umbenennen
/role color <role> <hex>            # Farbe ändern (z.B. #00FF00)
/role assign <user> <role>          # Rolle geben
/role remove <user> <role>          # Rolle entfernen
/role adminify <user>               # Admin-Rolle geben
```

### 🛡️ Moderation
```
/moderation kick <user> [reason]        # Nutzer kicken
/moderation ban <user> [reason]         # Nutzer bannen
/moderation unban <userid> [reason]     # Nutzer entbannen
/moderation timeout <user> <duration>   # Timeout (10s, 5m, 2h, 1d)
/moderation removetimeout <user>        # Timeout entfernen
```

### 👤 User Management
```
/user nickname <user> <newname>         # Nickname ändern (leer = reset)
/voice move <user> <voicechannel>       # In Voice-Channel verschieben
```

### 🔗 Invite Management
```
/invite create <channel> [maxuses] [expire]  # Invite erstellen
/invite delete <code>                        # Invite löschen
/invite track                                # Alle Invites anzeigen
```

### ⚙️ Server Settings
```
/server rename <name>               # Server umbenennen
/server icon <attachment>           # Icon hochladen (PNG/JPEG/GIF)
/server banner <attachment>         # Banner hochladen
/server setafk <channel>           # AFK-Channel setzen
/server setsystem <channel>        # System-Channel setzen
/server info                        # Server-Info anzeigen
```

### 📚 Hilfe
```
/help                               # Alle Commands anzeigen
```

---

## 🎯 Praktische Beispiele

### Server komplett neu aufsetzen
1. `/setup gta-rp` - Theme wählen (erstellt automatisch alles!)
2. Bot aktiviert sofort die Community mit Memes, Umfragen, Regeln
3. Spezial-Invite wird in DM gesendet (max 1 use, gibt Owner-Rolle)

### Nutzer management
```
/moderation timeout @User 2h Spam      # 2h Timeout
/moderation removetimeout @User        # Timeout weg
/user nickname @User "NewNick"        # Nickname setzen
```

### Rollen management
```
/role create Moderator #0099FF         # Mod-Rolle (blau) erstellen
/role adminify @User                   # Admin-Rechte geben
/role assign @User Moderator           # Rolle zuweisen
```

### Channel-Setup
```
/channel create support text           # Textchannel erstellen
/channel create voicechat voice        # Voicechannel erstellen
/channel slowmode support 5            # 5s Slowmode
```

---

## 📋 Automatische Logs

Der Bot erstellt automatisch einen **#server-logs** Channel mit Logs für:
- ✅ Member Join
- ✅ Member Leave
- ✅ Member Ban
- ✅ Member Unban
- ✅ Member Kick
- ✅ Member Timeout
- ✅ Invite Usage
- ✅ First-Join Events

---

## 🔐 Bot Berechtigungen

Der Bot benötigt **Administrator** Permissions oder minimal:
- Manage Guild
- Manage Channels
- Manage Roles
- Manage Messages
- Ban Members
- Kick Members
- Timeout Members
- Move Members
- Manage Nicknames

---

## 🐛 Häufige Probleme

### "Unknown Command"
→ Warte 1 Stunde oder stelle `GUILD_ID` in .env für sofortige Verfügbarkeit

### "Missing Permissions"
→ Prüfe dass der Bot genug Permissions hat und höhere Rollen als das Ziel

### "First-Join Invite funktioniert nicht"
→ Nur 1x nutzbar! Danach ist er permanent invalid

### Commands erscheinen nicht
→ `npm run deploy` nochmal ausführen

---

## 🚀 Production Tipps

1. **Token sicher speichern** - Nutze gehörte .env (nie in Git!)
2. **Logging Datenbank** - Für großere Server: DB statt In-Memory
3. **Error Handling** - Check console bei Fehlern
4. **Auto-Restart** - Nutze `pm2` für Auto-Restart:
   ```bash
   npm install -g pm2
   pm2 start src/index.js --name discord-bot
   ```

---

## 📝 Notizen

- Bot-Code ist `MIT Lizenz` - frei verwendbar
- Vollständig dokumentiert und kommentiert
- Einfach erweiterbar mit neuen Commands
- discord.js v14 Dokumentation: https://discord.js.org

---

**Viel Spaß mit deinem Discord Management Bot! 🎉**
