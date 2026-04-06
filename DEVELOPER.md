# 👨‍💻 Entwickler-Dokumentation

Ein umfassender Leitfaden zur Architektur und Erweiterung des Discord Bots.

## 🏗️ Architektur Überblick

```
INDEX.JS (Einstiegspunkt)
├── Commands laden
├── Events laden
└── Mit Discord verbinden

COMMANDS (Slash Commands Handler)
├── Channel Management
├── Role Management
├── Moderation
├── User Management
├── Invite Management
├── Server Settings
├── Setup System
└── Help

EVENTS (Discord Events Handler)
├── Ready - Bot eingeloggt
├── InteractionCreate - Commands ausgeführt
├── GuildMemberAdd - Member joined + First-Join Logic
├── GuildMemberRemove - Member verlässt
├── GuildBanAdd - User gebannt
├── GuildBanRemove - User entbannt
└── Error - Error Handling

UTILS (Hilfsfunktionen)
├── Logger - Logging System
├── Embeds - Embed Helper
├── Permissions - Permission Checks
├── Validation - Input Validierung
└── InviteManager - Invite Tracking
```

## 📚 Command-Struktur

Jeden Command hat diese Struktur:

```javascript
import { SlashCommandBuilder } from 'discord.js';

export default {
  // Command Definition
  data: new SlashCommandBuilder()
    .setName('command-name')
    .setDescription('Description'),

  // Command Execution
  async execute(interaction) {
    // Permissions überprüfen
    // Input validieren
    // Discord API aufrufen
    // Response senden
  }
};
```

## 🔄 Event-Struktur

Jeden Event hat diese Struktur:

```javascript
import { Events } from 'discord.js';

export default {
  name: Events.EventName,
  once: false, // true = nur einmal
  async execute(arg1, arg2, client) {
    // Event Logik
  }
};
```

## 🛠️ Neuen Command hinzufügen

### 1. Command-Datei erstellen

`src/commands/mycommand.js`:
```javascript
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { checkUserPermission } from '../utils/permissions.js';
import { createSuccessEmbed } from '../utils/embeds.js';
import { logInfo } from '../utils/logger.js';

export default {
  data: new SlashCommandBuilder()
    .setName('mycommand')
    .setDescription('My new command')
    .addStringOption(option =>
      option
        .setName('option')
        .setDescription('Option description')
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!await checkUserPermission(interaction, PermissionFlagsBits.ManageGuild)) return;
    
    await interaction.deferReply();
    
    try {
      const option = interaction.options.getString('option');
      
      // Deine Logik hier
      
      logInfo(`Command executed: ${interaction.user.tag}`);
      
      return await interaction.editReply({
        embeds: [createSuccessEmbed('✅ Success', 'Command executed!')]
      });
    } catch (error) {
      console.error('Error:', error);
      return await interaction.editReply({
        embeds: [createErrorEmbed('❌ Error', 'Something went wrong!')]
      });
    }
  }
};
```

### 2. Commands deployen

```bash
npm run deploy
```

Der Bot lädt den Command automatisch!

## 📢 Neuen Event hinzufügen

### 1. Event-Datei erstellen

`src/events/myevent.js`:
```javascript
import { Events } from 'discord.js';
import { logInfo } from '../utils/logger.js';

export default {
  name: Events.EventName,
  async execute(arg1, client) {
    logInfo(`Event triggered: ${arg1}`);
  }
};
```

### 2. Bot neu starten

Der Bot lädt Events beim Start!

## 🔧 Permission-Checks

```javascript
import { checkUserPermission, checkBotPermission } from '../utils/permissions.js';
import { PermissionFlagsBits } from 'discord.js';

// User Permission Check
if (!await checkUserPermission(interaction, PermissionFlagsBits.ManageGuild)) return;

// Bot Permission Check
if (!await checkBotPermission(interaction, PermissionFlagsBits.ManageGuild)) return;
```

## 📊 Embed Helper nutzen

```javascript
import { 
  createSuccessEmbed,
  createErrorEmbed,
  createInfoEmbed,
  createWarningEmbed,
  createLogEmbed
} from '../utils/embeds.js';

// Success
await interaction.reply({
  embeds: [createSuccessEmbed('✅ Title', 'Description')]
});

// Error
await interaction.reply({
  embeds: [createErrorEmbed('❌ Title', 'Description')]
});

// Log
await channel.send({
  embeds: [createLogEmbed('Action Name', 'User Tag', 'Details here')]
});
```

## ✅ Validierung nutzen

```javascript
import {
  validateChannelName,
  validateRoleName,
  validateHexColor,
  parseHexColor,
  validateDuration
} from '../utils/validation.js';

// Channel Name validieren
if (!await validateChannelName(interaction, name)) return;

// Hex Color validieren
if (!await validateHexColor(interaction, color)) return;
const colorInt = parseHexColor(color); // #FF0000 -> 16711680

// Duration validieren
const duration = await validateDuration(interaction, '2h'); // 7200000ms
```

## 🔗 Invite Management

```javascript
import {
  trackInvite,
  recordInviteUse,
  getInviteInfo,
  getAllGuildInvites,
  getServerFirstJoinInfo,
  setServerFirstJoinInfo
} from '../utils/inviteManager.js';

// Invite tracken
trackInvite(guildId, inviteCode, userId);

// First-join info setzen
setServerFirstJoinInfo(guildId, {
  code: inviteCode,
  createdBy: userId,
  roleToGive: roleId
});

// Info abrufen
const info = getServerFirstJoinInfo(guildId);
```

## 📝 Logging System

```javascript
import {
  logSuccess,
  logError,
  logInfo,
  logWarn,
  logDebug
} from '../utils/logger.js';

logSuccess('Bot started'); // ✅ SUCCESS
logError('Error occurred', error); // ❌ ERROR
logInfo('User joined'); // ℹ️ INFO
logWarn('Warning'); // ⚠️ WARN
logDebug('Debug info'); // 🐛 DEBUG (nur in development)
```

## Discord.js v14 Wichtige APIs

### Mitglieder Management
```javascript
// Mitglied abrufen
const member = await guild.members.fetch(userId);

// Rolle geben
await member.roles.add(roleId);

// Rolle entfernen
await member.roles.remove(roleId);

// Nickname ändern
await member.setNickname('New Nick');

// Timeout
await member.timeout(ms, reason);

// Kick
await member.kick(reason);

// Ban
await guild.members.ban(userId, { reason });
```

### Channel Management
```javascript
// Channel erstellen
const channel = await guild.channels.create({
  name: 'channel-name',
  type: ChannelType.GuildText,
  parent: categoryId
});

// Channel löschen
await channel.delete();

// Channel umbenennen
await channel.setName('new-name');

// Slowmode
await channel.setRateLimitPerUser(seconds);
```

### Rollen Management
```javascript
// Rolle erstellen
const role = await guild.roles.create({
  name: 'Role Name',
  color: '#FF0000',
  permissions: [PermissionFlagsBits.Administrator]
});

// Rolle löschen
await role.delete();

// Rolle ändern
await role.setName('New Name');
await role.setColor('#00FF00');
```

### Embeds
```javascript
import { EmbedBuilder } from 'discord.js';

const embed = new EmbedBuilder()
  .setColor('#0099FF')
  .setTitle('Title')
  .setDescription('Description')
  .addFields(
    { name: 'Field 1', value: 'Value 1', inline: true },
    { name: 'Field 2', value: 'Value 2', inline: true }
  )
  .setTimestamp();

await interaction.reply({ embeds: [embed] });
```

## 🚀 Performance Tipps

1. **Caching nutzen**: `guild.channels.cache` statt `guild.channels.fetch()`
2. **Parallel laden**: `Promise.all()` für mehrere API Calls
3. **Rate Limits beachten**: Nicht zu viele Commands hintereinander
4. **Error Handling**: Immer try-catch verwenden
5. **Logging sparsam**: Im production nur wichtige Logs

## 🔐 Sicherheitstipps

1. **Token nie commiten** - `.env` nutzen
2. **Input validieren** - Immer Längenbeschränkungen prüfen
3. **Permissions checken** - Immer Permissions prüfen
4. **Error leise handhaben** - Keine internen Errors exposed
5. **Rate Limits** - Nicht zu aggressiv mit API

## 🐛 Debugging Tipps

```javascript
// Debug Mode in .env
NODE_ENV=development

// Detailliertes Logging
logDebug('Variable:', variable);

// Stack Trace
console.error(error);

// Discord API Debug
client.on('debug', (msg) => console.log(msg));

// Interaction Debug
console.log(interaction.options.data);
```

## 📚 Weitere Ressourcen

- Discord.js Dokumentation: https://discord.js.org
- Discord Developer Portal: https://discord.com/developers
- Discord API Dokumentation: https://discord.com/developers/docs
- Common Event Types: https://discord.js.org/#/docs/main/stable/enum/Events

## 🤝 Beiträge

Neue Commands können so hinzugefügt werden:
1. Command in `/src/commands/` erstellen
2. `npm run deploy` ausführen
3. Bot neu starten

---

**Happy Coding! 🎉**
