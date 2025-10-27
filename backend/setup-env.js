const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

function generateEncryptionKey() {
  return crypto.randomBytes(32).toString('hex');
}

function setupEnvironment() {
  const envPath = path.join(__dirname, '.env');
  const envExamplePath = path.join(__dirname, 'env-example.txt');
  
  console.log('🔧 Setting up environment variables...');
  
  // Check if .env exists
  if (fs.existsSync(envPath)) {
    console.log('✅ .env file exists');
    
    // Check if it has CHAT_ENCRYPTION_KEY
    const envContent = fs.readFileSync(envPath, 'utf8');
    if (!envContent.includes('CHAT_ENCRYPTION_KEY')) {
      console.log('⚠️  CHAT_ENCRYPTION_KEY missing from .env');
      const encryptionKey = generateEncryptionKey();
      fs.appendFileSync(envPath, `\n# Chat Encryption Key\nCHAT_ENCRYPTION_KEY=${encryptionKey}\n`);
      console.log('✅ Added CHAT_ENCRYPTION_KEY to .env');
    } else {
      console.log('✅ CHAT_ENCRYPTION_KEY already configured');
    }
  } else {
    console.log('❌ .env file not found');
    
    if (fs.existsSync(envExamplePath)) {
      console.log('📋 Creating .env from env-example.txt...');
      let envContent = fs.readFileSync(envExamplePath, 'utf8');
      
      // Replace the example encryption key with a real one
      const encryptionKey = generateEncryptionKey();
      envContent = envContent.replace(
        'CHAT_ENCRYPTION_KEY=your_super_secret_chat_encryption_key_32_chars_minimum',
        `CHAT_ENCRYPTION_KEY=${encryptionKey}`
      );
      
      fs.writeFileSync(envPath, envContent);
      console.log('✅ Created .env file with encryption key');
      console.log('⚠️  Please update other environment variables in .env file');
    } else {
      console.log('❌ env-example.txt not found');
    }
  }
  
  console.log('\n🔍 Environment check complete!');
}

setupEnvironment();
