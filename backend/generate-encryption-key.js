#!/usr/bin/env node

/**
 * Generate a secure 32-character encryption key for chat system
 */

const crypto = require('crypto');

function generateEncryptionKey() {
  // Generate a random 32-byte key and convert to hex (64 chars), then take first 32
  const key = crypto.randomBytes(16).toString('hex');
  return key;
}

function generateSecureKey() {
  // Generate a more secure 32-character alphanumeric key
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

console.log('🔐 Chat Encryption Key Generator\n');

console.log('Option 1 - Hex Key (32 chars):');
const hexKey = generateEncryptionKey();
console.log(`CHAT_ENCRYPTION_KEY=${hexKey}`);

console.log('\nOption 2 - Alphanumeric Key (32 chars):');
const alphaKey = generateSecureKey();
console.log(`CHAT_ENCRYPTION_KEY=${alphaKey}`);

console.log('\nOption 3 - Base64 Key (32 chars):');
const base64Key = crypto.randomBytes(24).toString('base64');
console.log(`CHAT_ENCRYPTION_KEY=${base64Key}`);

console.log('\n📋 Instructions:');
console.log('1. Copy one of the keys above');
console.log('2. Add it to your .env file');
console.log('3. Restart your server');

console.log('\n⚠️  Important:');
console.log('• Keep this key secret and secure');
console.log('• Use the same key across all environments');
console.log('• Changing the key will make existing messages unreadable');

console.log('\n✅ Recommended for production:');
console.log(`CHAT_ENCRYPTION_KEY=${alphaKey}`);
