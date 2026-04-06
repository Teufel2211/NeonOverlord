/**
 * Invite Manager Utility
 * Tracks invites and their usage
 */

// In-memory invite storage (consider using a database in production)
const inviteTracking = new Map();

export function trackInvite(guildId, inviteCode, createdBy) {
  if (!inviteTracking.has(guildId)) {
    inviteTracking.set(guildId, {});
  }
  
  const guildInvites = inviteTracking.get(guildId);
  guildInvites[inviteCode] = {
    code: inviteCode,
    createdBy: createdBy,
    createdAt: new Date(),
    usedBy: []
  };
}

export function recordInviteUse(guildId, inviteCode, userId) {
  if (!inviteTracking.has(guildId)) {
    return false;
  }
  
  const guildInvites = inviteTracking.get(guildId);
  if (guildInvites[inviteCode]) {
    guildInvites[inviteCode].usedBy.push({
      userId: userId,
      joinedAt: new Date()
    });
    return true;
  }
  
  return false;
}

export function getInviteInfo(guildId, inviteCode) {
  if (!inviteTracking.has(guildId)) {
    return null;
  }
  
  return inviteTracking.get(guildId)[inviteCode] || null;
}

export function getAllGuildInvites(guildId) {
  if (!inviteTracking.has(guildId)) {
    return {};
  }
  
  return inviteTracking.get(guildId);
}

export function deleteInviteRecord(guildId, inviteCode) {
  if (!inviteTracking.has(guildId)) {
    return false;
  }
  
  const guildInvites = inviteTracking.get(guildId);
  if (guildInvites[inviteCode]) {
    delete guildInvites[inviteCode];
    return true;
  }
  
  return false;
}

export function getServerFirstJoinInfo(guildId) {
  if (!inviteTracking.has(guildId)) {
    return null;
  }
  
  // Store special first-join invite info
  return inviteTracking.get(guildId)['__first_join__'] || null;
}

export function setServerFirstJoinInfo(guildId, inviteInfo) {
  if (!inviteTracking.has(guildId)) {
    inviteTracking.set(guildId, {});
  }
  
  inviteTracking.get(guildId)['__first_join__'] = inviteInfo;
}
