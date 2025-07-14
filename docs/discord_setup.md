# 🔔 Discord + Telegram Notification Setup Guide

## 📱 Setup Instructions

### Discord Webhook Setup (2 minutes)
1. **Create Discord Server** (or use existing)
2. **Go to Server Settings** → **Integrations** → **Webhooks**
3. **Click "New Webhook"**
4. **Copy the webhook URL**
5. **Add to GitHub Secrets:**
   - Go to your repository → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `DISCORD_WEBHOOK`
   - Value: Your webhook URL

### Telegram Bot Setup (3 minutes)
1. **Create Bot:**
   - Message @BotFather on Telegram
   - Send `/newbot`
   - Choose a name and username for your bot
   - Copy the bot token

2. **Get Your Chat ID:**
   - Message @userinfobot on Telegram
   - It will reply with your chat ID

3. **Add to GitHub Secrets:**
   - Name: `TELEGRAM_BOT_TOKEN`
   - Value: Your bot token
   - Name: `TELEGRAM_CHAT_ID` 
   - Value: Your chat ID

## 🎯 What You'll Get

### Discord Notifications:
- 🎨 **Rich embeds** with colors (green/red)
- 📦 **Package information** with version
- 🔗 **Direct links** to NPM and GitHub logs
- 📥 **Copy-paste install commands**
- ⏰ **Timestamps** for deployment tracking

### Telegram Notifications:
- 📱 **Instant mobile alerts**
- ✅/❌ **Clear status indicators**
- 🔗 **Clickable links** to NPM and logs
- 📋 **Formatted with Markdown**
- 🚀 **Quick install commands**

## 🧪 Testing

After setup, test with:
```bash
git tag v1.2.3-test
git push origin v1.2.3-test
```

You should get notifications on both Discord and Telegram!

## 🔧 Optional: Notification Preferences

You can customize by:
- Adding `if: success()` to only notify on success
- Adding `if: failure()` to only notify on failures  
- Modifying message content and formatting
- Adding more fields or information

## 🆘 Troubleshooting

**Discord not working?**
- Check webhook URL is correct
- Ensure webhook has permissions to post

**Telegram not working?**
- Verify bot token is correct
- Make sure you've messaged the bot first
- Check chat ID is your personal chat, not a group