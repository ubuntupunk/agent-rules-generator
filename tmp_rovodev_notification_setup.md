# Desktop Notification Setup Guide

## Option 1: Discord Webhook (Recommended - Free & Easy)

### Setup Steps:
1. Create a Discord server (or use existing)
2. Go to Server Settings > Integrations > Webhooks
3. Click "New Webhook"
4. Copy the webhook URL
5. Add to GitHub Secrets as `DISCORD_WEBHOOK`

### Workflow Addition:
```yaml
- name: Discord Notification
  if: always()
  run: |
    STATUS_COLOR=${{ job.status == 'success' && '65280' || '16711680' }}
    STATUS_EMOJI=${{ job.status == 'success' && '🎉' || '❌' }}
    curl -H "Content-Type: application/json" \
         -d "{
           \"embeds\": [{
             \"title\": \"${STATUS_EMOJI} Deployment ${{ job.status }}\",
             \"description\": \"Agent Rules Generator v$(node -p \\\"require('./package.json').version\\\")\",
             \"color\": ${STATUS_COLOR},
             \"fields\": [
               {\"name\": \"NPM\", \"value\": \"https://www.npmjs.com/package/agent-rules-generator\"},
               {\"name\": \"Install\", \"value\": \"\`npm install -g agent-rules-generator\`\"}
             ]
           }]
         }" \
         "${{ secrets.DISCORD_WEBHOOK }}" || echo "Discord not configured"
```

## Option 2: Pushover (Best for Desktop Notifications)

### Setup Steps:
1. Sign up at https://pushover.net
2. Install Pushover app on desktop/mobile
3. Get User Key and create Application
4. Add `PUSHOVER_TOKEN` and `PUSHOVER_USER` to GitHub Secrets

### Workflow Addition:
```yaml
- name: Pushover Desktop Notification
  if: always()
  run: |
    curl -s \
      --form-string "token=${{ secrets.PUSHOVER_TOKEN }}" \
      --form-string "user=${{ secrets.PUSHOVER_USER }}" \
      --form-string "title=Deployment ${{ job.status }}" \
      --form-string "message=Agent Rules Generator v$(node -p \"require('./package.json').version\") - ${{ job.status }}" \
      --form-string "url=https://www.npmjs.com/package/agent-rules-generator" \
      --form-string "url_title=View on NPM" \
      https://api.pushover.net/1/messages.json
```

## Option 3: Telegram Bot (Free Mobile Notifications)

### Setup Steps:
1. Message @BotFather on Telegram
2. Create new bot with `/newbot`
3. Get bot token
4. Get your chat ID by messaging @userinfobot
5. Add `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` to GitHub Secrets

### Workflow Addition:
```yaml
- name: Telegram Notification
  if: always()
  run: |
    STATUS_ICON=${{ job.status == 'success' && '✅' || '❌' }}
    curl -s -X POST "https://api.telegram.org/bot${{ secrets.TELEGRAM_BOT_TOKEN }}/sendMessage" \
      -d chat_id="${{ secrets.TELEGRAM_CHAT_ID }}" \
      -d text="${STATUS_ICON} *Agent Rules Generator*%0A%0AStatus: ${{ job.status }}%0AVersion: v$(node -p \"require('./package.json').version\")%0ANPM: https://www.npmjs.com/package/agent-rules-generator" \
      -d parse_mode="Markdown"
```

## Option 4: Email Notification (Universal)

### Setup Steps:
1. Use Gmail App Password or SMTP service
2. Add `EMAIL_USERNAME` and `EMAIL_PASSWORD` to GitHub Secrets
3. Set your notification email

### Workflow Addition:
```yaml
- name: Email Notification
  if: always()
  run: |
    python3 -c "
    import smtplib
    from email.mime.text import MIMEText
    import os
    
    status = '${{ job.status }}'
    version = '$(node -p \"require('./package.json').version\")'
    
    msg = MIMEText(f'''
    Deployment Status: {status}
    Package: agent-rules-generator@{version}
    NPM: https://www.npmjs.com/package/agent-rules-generator
    Install: npm install -g agent-rules-generator
    ''')
    
    msg['Subject'] = f'🚀 Agent Rules Generator v{version} - {status}'
    msg['From'] = '${{ secrets.EMAIL_USERNAME }}'
    msg['To'] = 'your-email@example.com'
    
    with smtplib.SMTP('smtp.gmail.com', 587) as server:
        server.starttls()
        server.login('${{ secrets.EMAIL_USERNAME }}', '${{ secrets.EMAIL_PASSWORD }}')
        server.send_message(msg)
    "
```

## Quick Setup Recommendation:

**For immediate setup, I recommend Discord:**
1. Takes 2 minutes to setup
2. Free forever
3. Great desktop notifications
4. Rich formatting with embeds
5. Works on all platforms

Would you like me to implement one of these options in your workflow?