# 🔔 Discord + Telegram Deployment Notifications

This guide explains how to set up instant desktop and mobile notifications for your Agent Rules Generator deployments using Discord webhooks and Telegram bots.

## 📱 Overview

Your GitHub Actions workflow now supports dual notification channels:
- **Discord**: Rich desktop notifications with embeds, colors, and links
- **Telegram**: Instant mobile notifications with markdown formatting

Both services will notify you immediately when deployments succeed or fail, with detailed information about the package version, NPM links, and deployment logs.

## 🚀 Quick Setup (5 minutes total)

### 1. Discord Webhook Setup (2 minutes)

#### Step 1: Create Discord Webhook
1. **Open Discord** and go to your server (or create a new one)
2. **Right-click on a channel** → **Edit Channel**
3. **Go to Integrations** → **Webhooks**
4. **Click "New Webhook"**
5. **Give it a name** (e.g., "Agent Rules Deployments")
6. **Copy the Webhook URL**

#### Step 2: Add to GitHub Secrets
1. **Go to your repository** on GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. **Click "New repository secret"**
4. **Name**: `DISCORD_WEBHOOK`
5. **Value**: Your webhook URL
6. **Click "Add secret"**

### 2. Telegram Bot Setup (3 minutes)

#### Step 1: Create Telegram Bot
1. **Open Telegram** and search for `@BotFather`
2. **Send `/newbot`** command
3. **Choose a name** for your bot (e.g., "Agent Rules Bot")
4. **Choose a username** (must end with 'bot', e.g., "agentrules_bot")
5. **Copy the bot token** (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

#### Step 2: Get Your Chat ID
1. **Search for `@userinfobot`** on Telegram
2. **Send any message** to the bot
3. **Copy your chat ID** (looks like: `123456789`)

#### Step 3: Add to GitHub Secrets
1. **Go to your repository** on GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. **Add two secrets:**
   - **Name**: `TELEGRAM_BOT_TOKEN`, **Value**: Your bot token
   - **Name**: `TELEGRAM_CHAT_ID`, **Value**: Your chat ID

## 🧪 Testing Your Setup

After configuring both services, test with a deployment:

```bash
# Create a test tag
git tag v1.2.3-test
git push origin v1.2.3-test
```

You should receive notifications on both Discord and Telegram!

## 🎨 Notification Examples

### Discord Notification (Success)
```
🎉 Deployment Successful!
Agent Rules Generator has been deployed successfully

📦 Package: agent-rules-generator
🏷️ Version: v1.2.3
📥 Install: npm install -g agent-rules-generator
🔗 NPM: [View Package](https://www.npmjs.com/package/agent-rules-generator)
📋 Logs: [View Deployment](https://github.com/...)
```

### Telegram Notification (Success)
```
✅ Agent Rules Generator Deployment

Status: SUCCESS
Version: v1.2.3
Package: agent-rules-generator

🔗 NPM Package
📥 Install: npm install -g agent-rules-generator
🎉 Ready for use!
```

### Discord Notification (Failure)
```
❌ Deployment Failed!
Agent Rules Generator deployment encountered an error

📦 Package: agent-rules-generator
🏷️ Version: v1.2.3
📋 Check Logs: [View Deployment](https://github.com/...)
🔧 Action Required: Check NPM_TOKEN and workflow configuration
```

### Telegram Notification (Failure)
```
❌ Agent Rules Generator Deployment

Status: FAILED
Version: v1.2.3
Package: agent-rules-generator

📋 Check Logs
🔧 Action required - check workflow logs
```

## 🔧 Customization Options

### Notification Preferences
You can customize the notifications by modifying the workflow:

- **Success only**: Change `if: always()` to `if: success()`
- **Failure only**: Change `if: always()` to `if: failure()`
- **Custom messages**: Modify the message content in the workflow
- **Additional fields**: Add more information to the Discord embeds

### Discord Customization
- **Colors**: Green (65280) for success, Red (16711680) for failure
- **Emojis**: 🎉 for success, ❌ for failure
- **Fields**: Package, Version, Install command, NPM link, Logs link

### Telegram Customization
- **Formatting**: Uses Markdown for bold text and code blocks
- **Links**: Clickable links to NPM package and GitHub logs
- **Status icons**: ✅ for success, ❌ for failure

## 🆘 Troubleshooting

### Discord Issues
- **Webhook not working?**
  - Verify the webhook URL is correct
  - Check the webhook has permissions to post in the channel
  - Test the webhook manually with a curl command

- **No notifications appearing?**
  - Check Discord notification settings
  - Ensure the channel is not muted
  - Verify the webhook is active in Discord settings

### Telegram Issues
- **Bot not responding?**
  - Make sure you've sent at least one message to the bot first
  - Verify the bot token is correct
  - Check that the chat ID is your personal chat, not a group

- **Messages not arriving?**
  - Confirm the chat ID is correct (should be a number)
  - Test the bot manually by sending a message
  - Check Telegram notification settings

### GitHub Secrets
- **Secrets not working?**
  - Ensure secret names match exactly: `DISCORD_WEBHOOK`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
  - Check for extra spaces or characters in secret values
  - Verify secrets are added to the correct repository

## 🔒 Security Notes

- **Keep tokens private**: Never commit webhook URLs or bot tokens to your repository
- **Use GitHub Secrets**: Always store sensitive information in GitHub repository secrets
- **Rotate tokens**: Consider rotating bot tokens periodically for security
- **Webhook permissions**: Limit Discord webhook permissions to only the necessary channels

## 📚 Additional Resources

- [Discord Webhooks Documentation](https://discord.com/developers/docs/resources/webhook)
- [Telegram Bot API Documentation](https://core.telegram.org/bots/api)
- [GitHub Actions Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

## 🎯 Benefits

With this notification system, you'll get:
- ✅ **Instant feedback** on deployment status
- ✅ **Rich information** about package versions and links
- ✅ **Multiple channels** for reliability
- ✅ **Desktop and mobile** coverage
- ✅ **Zero maintenance** once configured
- ✅ **Professional appearance** with formatted messages

Your deployment workflow is now enterprise-grade with comprehensive notification coverage!