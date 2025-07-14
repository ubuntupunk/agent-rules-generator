# Enhanced Deployment Notifications Examples

# Option 1: Discord Webhook Notification
- name: Notify Discord on Success
  if: success()
  uses: Ilshidur/action-discord@master
  with:
    args: |
      🎉 **Deployment Successful!**
      📦 Package: agent-rules-generator@${{ steps.version.outputs.new_version }}
      🔗 NPM: https://www.npmjs.com/package/agent-rules-generator
      📥 Install: `npm install -g agent-rules-generator`
  env:
    DISCORD_WEBHOOK: ${{ secrets.DISCORD_WEBHOOK }}

# Option 2: Slack Notification
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: |
      Deployment ${{ job.status }}!
      Package: agent-rules-generator@${{ steps.version.outputs.new_version }}
      NPM: https://www.npmjs.com/package/agent-rules-generator
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}

# Option 3: Email Notification
- name: Send Email Notification
  if: always()
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 587
    username: ${{ secrets.EMAIL_USERNAME }}
    password: ${{ secrets.EMAIL_PASSWORD }}
    subject: "🚀 Agent Rules Generator v${{ steps.version.outputs.new_version }} Deployed"
    to: your-email@example.com
    from: github-actions@yourproject.com
    body: |
      Deployment Status: ${{ job.status }}
      
      📦 Package: agent-rules-generator@${{ steps.version.outputs.new_version }}
      🔗 NPM: https://www.npmjs.com/package/agent-rules-generator
      📥 Install: npm install -g agent-rules-generator
      
      View logs: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}

# Option 4: Telegram Notification
- name: Telegram Notification
  if: always()
  uses: appleboy/telegram-action@master
  with:
    to: ${{ secrets.TELEGRAM_CHAT_ID }}
    token: ${{ secrets.TELEGRAM_BOT_TOKEN }}
    message: |
      🚀 *Agent Rules Generator Deployment*
      
      Status: ${{ job.status == 'success' && '✅ SUCCESS' || '❌ FAILED' }}
      Version: `v${{ steps.version.outputs.new_version }}`
      NPM: https://www.npmjs.com/package/agent-rules-generator
      
      ${{ job.status == 'success' && 'Ready for installation!' || 'Check logs for details.' }}

# Option 5: Microsoft Teams
- name: Microsoft Teams Notification
  if: always()
  uses: skitionek/notify-microsoft-teams@master
  with:
    webhook_url: ${{ secrets.TEAMS_WEBHOOK }}
    overwrite: "{title: `Deployment ${{ job.status }}`, themeColor: `${{ job.status == 'success' && '00FF00' || 'FF0000' }}`, text: `Agent Rules Generator v${{ steps.version.outputs.new_version }} deployment ${{ job.status }}`}"

# Option 6: Desktop Notification via Pushover
- name: Pushover Desktop Notification
  if: always()
  uses: urkle/action-pushover@master
  with:
    token: ${{ secrets.PUSHOVER_TOKEN }}
    user: ${{ secrets.PUSHOVER_USER }}
    title: "🚀 Deployment ${{ job.status }}"
    message: |
      Agent Rules Generator v${{ steps.version.outputs.new_version }}
      Status: ${{ job.status }}
      NPM: https://www.npmjs.com/package/agent-rules-generator

# Option 7: Custom Webhook (for any service)
- name: Custom Webhook Notification
  if: always()
  run: |
    curl -X POST "${{ secrets.CUSTOM_WEBHOOK_URL }}" \
      -H "Content-Type: application/json" \
      -d '{
        "status": "${{ job.status }}",
        "package": "agent-rules-generator",
        "version": "${{ steps.version.outputs.new_version }}",
        "npm_url": "https://www.npmjs.com/package/agent-rules-generator",
        "github_url": "${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}",
        "timestamp": "'$(date -Iseconds)'"
      }'