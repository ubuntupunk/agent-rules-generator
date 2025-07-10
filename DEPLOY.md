# Deployment Guide

## Quick Deployment Process

### Method 1: Version Update + Deploy (Recommended)
```bash
# 1. Update version manually
npm version patch  # or minor/major

# 2. Push changes
git push origin main

# 3. Push tags (triggers deployment)
git push origin --tags
```

### Method 2: Direct Tag Creation
```bash
# Create tag directly (if version is already correct)
git tag v1.2.4
git push origin v1.2.4
```

## What Happens After Tagging

1. **GitHub Actions triggers** automatically
2. **Tests run** with Bun (181 tests)
3. **NPM package publishes** automatically
4. **Discord notification** sent (if configured)
5. **Telegram notification** sent (if configured)

## Pre-Deployment Checklist

- [ ] All tests passing locally (`bun test`)
- [ ] Changes committed and pushed to main
- [ ] Version number updated in package.json
- [ ] CHANGELOG.md updated (if needed)
- [ ] Discord/Telegram webhooks configured

## Troubleshooting

### If deployment fails:
1. Check GitHub Actions logs
2. Verify NPM_TOKEN is valid
3. Ensure package.json version is correct
4. Check for test failures

### If notifications don't work:
1. Verify DISCORD_WEBHOOK secret
2. Check TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID
3. Test webhooks manually

## Related Documentation

- [Notifications Setup](docs/NOTIFICATIONS.md)
- [Testing Guide](docs/testing.md)
- [GitHub Actions Workflow](.github/workflows/deploy.yml)

## Quick Commands

```bash
# Check current version
npm version

# Run tests locally
bun test

# Check git status
git status

# View recent tags
git tag --sort=-version:refname | head -5
```