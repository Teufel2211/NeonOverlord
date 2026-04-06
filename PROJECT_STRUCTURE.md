# 📊 Projekt-Struktur Visualisierung

```
📁 Discord-Server-Management-Bot/
│
├── 📄 package.json                    # Projekt-Konfiguration & Dependencies
├── 📄 .env                            # Environment Variables (GEHEIM!)
├── 📄 .env.example                    # Beispiel .env
├── 📄 .gitignore                      # Git Ignores
│
├── 📚 README.md                       # Haupt-Dokumentation
├── 📚 QUICKSTART.md                   # Schnellstart Guide
├── 📚 DEVELOPER.md                    # Entwickler-Dokumentation
├── 📚 PROJECT_STRUCTURE.md            # Diese Datei
│
└── 📁 src/                            # Quellcode
    │
    ├── 🤖 index.js                    # Bot Entry Point
    │   ├── Commands laden
    │   ├── Events laden
    │   └── Discord Login
    │
    ├── 📝 deploy-commands.js          # Slash Command Deployer
    │
    ├── 📁 commands/ (10 Commands)
    │   ├── 🟦 channel.js              # Channel Management (create, delete, rename, slowmode)
    │   ├── 🟦 category.js             # Category Management (create, delete)
    │   ├── 🟦 role.js                 # Role Management (create, delete, color, assign, remove, adminify)
    │   ├── 🟦 moderation.js           # Moderation (kick, ban, unban, timeout)
    │   ├── 🟦 user.js                 # User Management (nickname)
    │   ├── 🟦 voice.js                # Voice Management (move)
    │   ├── 🟦 invite.js               # Invite Management (create, delete, track)
    │   ├── 🟦 server.js               # Server Settings (rename, icon, banner, setafk, setsystem, info)
    │   ├── 🟦 setup.js                # Auto Setup System (komplette Server-Konfiguration)
    │   └── 🟦 help.js                 # Help Command (alle Commands anzeigen)
    │
    ├── 📁 events/ (7 Events)
    │   ├── 🟩 ready.js                # Bot Ready Event
    │   ├── 🟩 interactionCreate.js    # Slash Command Handler
    │   ├── 🟩 guildMemberAdd.js       # Member Join + First-Join Logic
    │   ├── 🟩 guildMemberRemove.js    # Member Leave Logging
    │   ├── 🟩 guildBanAdd.js          # Ban Logging
    │   ├── 🟩 guildBanRemove.js       # Unban Logging
    │   └── 🟩 error.js                # Error Handler
    │
    └── 📁 utils/ (5 Utilities)
        ├── 🟨 logger.js               # Logging System (Success, Error, Info, Warn, Debug)
        ├── 🟨 embeds.js               # Embed Helper Functions
        ├── 🟨 permissions.js          # Permission Checks
        ├── 🟨 validation.js           # Input Validation
        └── 🟨 inviteManager.js        # Invite Tracking System
```

---

## 📋 Commands Übersicht (10 Total)

### 🟦 Channel Command
- `/channel create <name> <type>` - Textkanal oder Voicekanal erstellen
- `/channel delete <channel>` - Kanal löschen
- `/channel rename <channel> <newname>` - Kanal umbenennen
- `/channel slowmode <channel> <seconds>` - Slowmode setzen
- `/category create <name>` - Kategorie erstellen
- `/category delete <category>` - Kategorie löschen

### 🟦 Role Command
- `/role create <name> [color]` - Rolle mit Farbe erstellen
- `/role delete <role>` - Rolle löschen
- `/role rename <role> <newname>` - Rolle umbenennen
- `/role color <role> <hex>` - Farbe ändern
- `/role assign <user> <role>` - Rolle geben
- `/role remove <user> <role>` - Rolle entfernen
- `/role adminify <user>` - Admin-Rolle vergeben

### 🟦 Moderation Command
- `/moderation kick <user> [reason]` - User kicken
- `/moderation ban <user> [reason]` - User bannen
- `/moderation unban <userid> [reason]` - User entbannen
- `/moderation timeout <user> <duration>` - Timeout (10s, 5m, 2h, 1d)
- `/moderation removetimeout <user> [reason]` - Timeout entfernen

### 🟦 User Command
- `/user nickname <user> <newname>` - Nickname ändern

### 🟦 Voice Command
- `/voice move <user> <channel>` - In Voice-Channel verschieben

### 🟦 Invite Command
- `/invite create <channel> [maxuses] [expire]` - Invite erstellen
- `/invite delete <code>` - Invite löschen
- `/invite track` - Invite-Statistiken anzeigen

### 🟦 Server Command
- `/server rename <name>` - Server umbenennen
- `/server icon <attachment>` - Icon hochladen
- `/server banner <attachment>` - Banner hochladen
- `/server setafk <channel>` - AFK-Channel setzen
- `/server setsystem <channel>` - System-Channel setzen
- `/server info` - Server-Informationen

### 🟦 Setup Command ⭐ (WICHTIG!)
- `/setup server` - Komplette automatische Server-Konfiguration:
  - ✅ Erstellt Kategorie "SERVER-SETUP"
  - ✅ Erstellt Channels: #welcome, #rules, #general, #announcements
  - ✅ Erstellt Kategorie "LOGGING" mit #server-logs
  - ✅ Erstellt Rolle "Owner" mit Admin-Permissions
  - ✅ Erstellt Spezial-Invite (maxUses=1)
  - ✅ First-Join Logic: Erste Person erhält Owner-Rolle
  - ✅ Sendet Invite im DM

### 🟦 Help Command
- `/help` - Alle Commands anzeigen

---

## 🟩 Events Übersicht (7 Total)

### 🟩 ready
- Bot hat Discord verbunden
- Status wird gesetzt
- Willkommensmeldung in Console

### 🟩 interactionCreate
- Slash Command wurde ausgeführt
- Fehlerbehandlung
- Logging

### 🟩 guildMemberAdd
- Member joint den Server
- Join-Log im #server-logs
- **First-Join Logic**: Prüft ob spezial Invite verwendet wurde
- Wenn ja: Owner-Rolle wird vergeben
- Welcome-DM wird gesendet

### 🟩 guildMemberRemove
- Member verlässt den Server
- Leave-Log im #server-logs

### 🟩 guildBanAdd
- User wird gebannt
- Ban-Log im #server-logs

### 🟩 guildBanRemove
- User wird entbannt
- Unban-Log im #server-logs

### 🟩 error
- Error-Handling für unerwartete Fehler
- Wird in Console geloggt

---

## 🟨 Utilities Übersicht (5 Total)

### 🟨 logger.js
```
✅ logSuccess()  - Erfolgreiche Aktionen (grün)
❌ logError()    - Fehler (rot)
ℹ️  logInfo()     - Informationen (blau)
⚠️  logWarn()     - Warnungen (gelb)
🐛 logDebug()    - Debug (grau, nur development)
```

### 🟨 embeds.js
```
createSuccessEmbed()  - Grüne Success Embeds
createErrorEmbed()    - Rote Error Embeds
createInfoEmbed()     - Blaue Info Embeds
createWarningEmbed()  - Gelbe Warning Embeds
createLogEmbed()      - Log Embeds mit Timestamp
createSetupEmbed()    - Setup-Complete Embed
```

### 🟨 permissions.js
```
checkBotPermission()      - Prüft Bot-Permissions
checkUserPermission()     - Prüft User-Permissions
getPermissionName()       - Konvertiert Permission IDs zu Namen
isOwnerOrAdmin()          - Prüft ob Owner/Admin
```

### 🟨 validation.js
```
validateChannelName()     - Validiert Channel-Namen
validateRoleName()        - Validiert Rollen-Namen
validateHexColor()        - Validiert Hex-Farben
parseHexColor()          - Konvertiert Hex -> Integer
validateDuration()       - Validiert Zeit-Format (10s, 5m, 2h, 1d)
```

### 🟨 inviteManager.js
```
trackInvite()            - Registriert neuen Invite
recordInviteUse()        - Protokolliert Invite-Nutzung
getInviteInfo()          - Abrufen von Invite-Details
getAllGuildInvites()     - Alle Invites des Servers
deleteInviteRecord()     - Löscht Invite-Track
getServerFirstJoinInfo() - First-Join Invite Infos
setServerFirstJoinInfo() - Setzt First-Join Invite Infos
```

---

## 🔄 Command Ausführungs-Flow

```
1. User schreibt: /command option:value
   ↓
2. Discord.js Event: interactionCreate
   ↓
3. interactionCreate.js prüft ob Command existiert
   ↓
4. Command wird ausgeführt:
   - deferReply() - "Loading..." anzeigen
   - Permissions checken
   - Input validieren
   - Discord API aufrufen
   - Response mit Embed senden
   ↓
5. Logging in Console
   ↓
6. Ggf. Logging im #server-logs Channel
```

---

## 📊 Event Ausführungs-Flow

```
Member joined Discord-Server
   ↓
Events.GuildMemberAdd Event
   ↓
guildMemberAdd.js wird ausgeführt:
   - Log im #server-logs
   - Prüft ob First-Join Invite
   - Wenn ja: Prüft ob schon benutzt
   - Wenn nein UND das ist erste Person: Owner-Rolle geben
   - Welcome-DM senden
   ↓
Logging in Console
```

---

## 🗄️ Datenspeicherung

### In-Memory (während Bot läuft)
- Invite-Tracking
- First-Join Invite Info
- Member Join Times

### Discord (persistent)
- Channel-Struktur
- Rollen-Konfiguration
- Member-Daten
- Ban-Liste
- Logs im #server-logs

---

## 🔐 Sicherheit & Einschränkungen

### Blockierte Aktionen
❌ Server Owner übertragen - Unmöglich per API
❌ Server löschen - Unmöglich per API
❌ Server erstellen - Unmöglich per API
❌ Managed Roles löschen - Software-Blockade

### Permission-Checks
✅ Alle Commands prüfen User-Permissions
✅ Alle Commands prüfen Bot-Permissions
✅ Verhinderung von Server-Owner-Manipulation

---

## 🎯 Verwendungs-Szenario

```
1. Admin startet Bot
   ↓
2. Admin nutzt: /setup server
   ↓
3. Bot erstellt automatisch:
   - Kategorie "SERVER-SETUP"
   - 4 Channels (#welcome, #rules, #general, #announcements)
   - Kategorie "LOGGING" mit #server-logs
   - Rolle "Owner" (mit Admin-Perms)
   - Spezial-Invite (1x nutzbar)
   ↓
4. Admin teilt Invite-Link
   ↓
5. Erste Person joINT über diesen Link
   - Erhält automatisch Owner-Rolle
   - Invite wird ungültig
   ↓
6. Admin kann jetzt alle Rollen, Channels, Berechtigungen verwalten
```

---

## 📈 Performance

- **Commands laden**: ~100ms
- **Events laden**: ~50ms
- **Bot-Start**: ~200-300ms
- **Command-Ausführung**: ~50-200ms (abhängig von API-Calls)

---

## 🚀 Erweiterungs-Möglichkeiten

```javascript
// Datenbank Integration
// - Persistente Einstellungen speichern
// - Invite-Statistiken speichern

// Weitere Events
// - messageCreate - Message handling
// - voiceStateUpdate - Voice channel logging

// Weitere Commands
// - /poll create
// - /giveaway create
// - /ticket create

// Features
// - Auto-Moderation
// - Reaction Roles
// - Welcome Messages mit Buttons
```

---

**Projektstruktur erstellt am: 2026-04-06**
**Discord.js Version: v14**
**Node.js Mindestversion: 16.9.0**

---
