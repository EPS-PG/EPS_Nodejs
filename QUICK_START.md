# Quick Start Guide - EPS Gateway Node.js SDK

## 🚀 Publishing to NPM

### Prerequisites

1. **NPM Account:** Create account at https://www.npmjs.com
2. **Email Verified:** Verify your NPM email address
3. **Two-Factor Authentication:** Enable 2FA (recommended)

### Step-by-Step Publishing

```bash
# 1. Navigate to project
cd /Users/najim/Desktop/eps-gateway-nodejs

# 2. Login to NPM
npm login
# Enter your NPM username, password, and email

# 3. Test the package locally
npm run build
npm test

# 4. Check what will be published
npm pack --dry-run

# 5. Publish to NPM
npm publish

# Success! Your package is now live at:
# https://www.npmjs.com/package/eps-gateway-nodejs
```

### Version Updates

When making updates:

```bash
# For bug fixes (1.0.0 -> 1.0.1)
npm version patch

# For new features (1.0.0 -> 1.1.0)
npm version minor

# For breaking changes (1.0.0 -> 2.0.0)
npm version major

# Then publish
npm publish
```

## 📦 Publishing to GitHub

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `eps-gateway-nodejs`
3. Description: `Unofficial Node.js SDK for EPS Payment Gateway - Bangladesh`
4. Public repository
5. Don't initialize with README (we already have one)
6. Click "Create repository"

### Step 2: Push to GitHub

```bash
cd /Users/najim/Desktop/eps-gateway-nodejs

# Add GitHub remote
git remote add origin https://github.com/imtiaznajim/eps-gateway-nodejs.git

# Push to GitHub
git push -u origin main

# Push tags (if any)
git push --tags
```

### Step 3: Configure Repository Settings

On GitHub, go to Settings and configure:

1. **About section:**
   - Description: "Unofficial Node.js SDK for EPS Payment Gateway - Bangladesh"
   - Website: https://www.eps.com.bd
   - Topics: `payment-gateway`, `bangladesh`, `eps`, `nodejs`, `typescript`, `payment`, `sdk`

2. **Enable GitHub Actions:**
   - Actions are already configured in `.github/workflows/ci.yml`
   - Will run tests on every push

3. **Add NPM token (for auto-publish):**
   - Settings > Secrets and variables > Actions
   - Add secret: `NPM_TOKEN`
   - Value: Your NPM automation token

## 🧪 Testing the Package

### Test Installation

```bash
# Create test project
mkdir test-eps
cd test-eps
npm init -y

# Install your package
npm install eps-gateway-nodejs

# Create test file
cat > test.js << 'EOF'
const { EPS } = require('eps-gateway-nodejs');

const eps = new EPS({
  username: 'test@example.com',
  password: 'password',
  hashKey: 'test_key',
  merchantId: 'merchant-id',
  storeId: 'store-id',
  sandbox: true
});

console.log('✅ EPS SDK loaded successfully!');
console.log('Config:', eps.getConfig());
EOF

# Run test
node test.js
```

## 📝 Update Package

### After Publishing

Add badges to README:

```markdown
[![npm version](https://img.shields.io/npm/v/eps-gateway-nodejs.svg)](https://www.npmjs.com/package/eps-gateway-nodejs)
[![npm downloads](https://img.shields.io/npm/dm/eps-gateway-nodejs.svg)](https://www.npmjs.com/package/eps-gateway-nodejs)
[![GitHub stars](https://img.shields.io/github/stars/imtiaznajim/eps-gateway-nodejs.svg)](https://github.com/imtiaznajim/eps-gateway-nodejs)
```

## 🔧 Maintenance

### Keeping Dependencies Updated

```bash
# Check for outdated packages
npm outdated

# Update dependencies
npm update

# Run tests after updates
npm test
npm run build
```

### Responding to Issues

Monitor:
- GitHub Issues: https://github.com/imtiaznajim/eps-gateway-nodejs/issues
- NPM page: https://www.npmjs.com/package/eps-gateway-nodejs
- Email: imtiaznajim@gmail.com

## 📊 Package Stats

After publishing, you can track:

1. **NPM Stats:** https://www.npmjs.com/package/eps-gateway-nodejs
   - Download count
   - Dependents
   - Versions

2. **GitHub Stats:**
   - Stars
   - Forks
   - Issues
   - Pull requests

3. **Bundle Size:** https://bundlephobia.com/package/eps-gateway-nodejs

## 🎯 Promotion

### Where to Share

1. **GitHub Topics:**
   - Add topics: `payment-gateway`, `bangladesh`, `eps`, `nodejs`, `typescript`

2. **NPM Keywords:**
   - Already added in package.json

3. **Social Media:**
   - Share on LinkedIn, Twitter, Facebook
   - Bangladesh developer groups

4. **Forums:**
   - dev.to
   - Reddit r/node, r/Bangladesh
   - Stack Overflow (answer EPS-related questions)

5. **Documentation Sites:**
   - Add to your portfolio/website
   - Submit to awesome-nodejs lists

## ⚡ Quick Commands Reference

```bash
# Development
npm install              # Install dependencies
npm run build           # Build TypeScript
npm test                # Run tests
npm run lint            # Lint code
npm run format          # Format code

# Publishing
npm login               # Login to NPM
npm publish             # Publish to NPM
npm version patch       # Bump version (patch)
npm version minor       # Bump version (minor)
npm version major       # Bump version (major)

# Git
git add -A              # Stage all changes
git commit -m "msg"     # Commit changes
git push                # Push to GitHub
git tag v1.0.1          # Create version tag
git push --tags         # Push tags
```

## 🆘 Troubleshooting

### NPM Publish Errors

**Error: You must verify your email**
```bash
# Go to https://www.npmjs.com and verify email
```

**Error: Package name already exists**
```bash
# Choose different name in package.json
# Or use scoped package: @yourusername/eps-gateway-nodejs
```

**Error: You do not have permission to publish**
```bash
npm login  # Make sure you're logged in
npm whoami # Check current user
```

### Build Errors

```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

## 📚 Next Steps

After publishing:

1. ✅ Test installation from NPM
2. ✅ Update ISPBilling project to use the package
3. ✅ Share with Bangladesh developer community
4. ✅ Write blog post about the package
5. ✅ Add to your GitHub profile README
6. ✅ Monitor for issues and feature requests
7. ✅ Keep dependencies updated

---

**Good luck with your package! 🎉**

For questions: imtiaznajim@gmail.com
