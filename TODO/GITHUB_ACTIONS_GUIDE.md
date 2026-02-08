# GitHub Actions Guide

This guide explains how GitHub Actions works for this MERN Todo App project.

## What is GitHub Actions?

GitHub Actions is a CI/CD (Continuous Integration/Continuous Deployment) platform built into GitHub. It automatically runs workflows when certain events happen in your repository, like pushing code.

**Benefits:**
- Automatically builds and tests your code
- Catches errors before they reach production
- Automates deployment
- Free for public repositories

## Our Workflows

This project has two workflow files in `.github/workflows/`:

### 1. CI Workflow (`ci.yml`)

**Purpose:** Builds and tests the application every time you push code.

**Triggers:**
- Push to `main` or `master` branch
- Pull requests to `main` or `master` branch

**What it does:**

| Job | Description |
|-----|-------------|
| Backend Build | Installs dependencies, checks for errors |
| Frontend Build | Installs dependencies, builds React app |
| Summary | Confirms all builds passed |

### 2. Deploy Workflow (`deploy.yml`)

**Purpose:** Deploys the frontend to GitHub Pages after CI passes.

**Triggers:**
- After CI workflow completes successfully
- Manual trigger from Actions tab

**What it does:**

| Job | Description |
|-----|-------------|
| Build | Creates production build of frontend |
| Deploy | Uploads to GitHub Pages |

## How to View Workflow Runs

### Step 1: Go to Your Repository

1. Open your browser
2. Go to: `https://github.com/YOUR_USERNAME/YOUR_REPO`

### Step 2: Click Actions Tab

1. Click the **"Actions"** tab at the top of your repository
2. You'll see a list of all workflow runs

### Step 3: View a Workflow Run

1. Click on any workflow run to see details
2. You'll see all jobs and their status:
   - ✅ Green checkmark = Passed
   - ❌ Red X = Failed
   - 🟡 Yellow circle = In progress

### Step 4: View Logs

1. Click on a job (e.g., "Frontend Build")
2. Click on any step to expand and see detailed logs
3. Look for error messages if something failed

## Understanding Workflow Status

| Status | Icon | Meaning |
|--------|------|---------|
| Success | ✅ | All jobs completed successfully |
| Failure | ❌ | One or more jobs failed |
| In Progress | 🟡 | Workflow is currently running |
| Cancelled | ⚫ | Workflow was manually cancelled |
| Skipped | ⏭️ | Job was skipped due to conditions |

## Troubleshooting Common Errors

### Error 1: "npm ci" failed

**Cause:** Missing or corrupted `package-lock.json`

**Solution:**
```bash
# In the failing directory (todo_frontend or todo_backend)
rm package-lock.json
npm install
git add package-lock.json
git commit -m "fix: regenerate package-lock.json"
git push
```

### Error 2: Build failed - Module not found

**Cause:** Missing dependency

**Solution:**
```bash
# Check which module is missing from the error log
npm install <missing-module>
git add package.json package-lock.json
git commit -m "fix: add missing dependency"
git push
```

### Error 3: Permission denied (GitHub Pages)

**Cause:** GitHub Pages not enabled or wrong permissions

**Solution:**
1. Go to repository **Settings**
2. Click **Pages** in the sidebar
3. Under "Build and deployment", select:
   - Source: **GitHub Actions**
4. Save and re-run the workflow

### Error 4: CI=true causing warnings to fail build

**Cause:** React treats warnings as errors when CI=true

**Solution:** Already handled in our workflow with `CI: false`

### Error 5: Workflow not triggering

**Cause:** Workflow file has syntax errors or wrong path

**Solution:**
1. Ensure file is at `.github/workflows/ci.yml` (exact path)
2. Validate YAML syntax at: https://www.yamllint.com/
3. Check for indentation errors (YAML uses 2 spaces)

## How to Re-run Failed Workflows

### Method 1: Re-run from GitHub

1. Go to **Actions** tab
2. Click on the failed workflow run
3. Click **"Re-run all jobs"** button (top right)

### Method 2: Push a New Commit

1. Make any small change (or empty commit)
2. Push to trigger the workflow again

```bash
git commit --allow-empty -m "chore: trigger CI"
git push
```

## How to Manually Trigger Deployment

1. Go to **Actions** tab
2. Click on **"Deploy to GitHub Pages"** workflow
3. Click **"Run workflow"** dropdown (right side)
4. Select branch: `main`
5. Click **"Run workflow"** button

## Adding Secrets (If Needed)

Some workflows need secrets (like API URLs). Here's how to add them:

### Step 1: Go to Repository Settings

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions**

### Step 2: Add a Secret

1. Click **"New repository secret"**
2. Enter:
   - **Name:** `REACT_APP_API_URL`
   - **Value:** `https://your-backend-url.com`
3. Click **"Add secret"**

### Secrets Used by This Project

| Secret Name | Description | Required |
|-------------|-------------|----------|
| REACT_APP_API_URL | Backend API URL | Optional (has default) |

## Workflow Files Explained

### ci.yml Structure

```yaml
name: CI - Build and Test    # Workflow name

on:                          # When to run
  push:
    branches: [main]

jobs:                        # Tasks to run
  backend:                   # Job 1
    runs-on: ubuntu-latest   # Virtual machine
    steps:                   # Steps in this job
      - uses: actions/checkout@v4
      - run: npm install
```

### Key Concepts

| Concept | Description |
|---------|-------------|
| `on` | Events that trigger the workflow |
| `jobs` | Independent tasks that run in parallel |
| `steps` | Sequential commands within a job |
| `runs-on` | Operating system for the job |
| `uses` | Pre-built action from GitHub marketplace |
| `run` | Shell command to execute |
| `env` | Environment variables |
| `needs` | Job dependencies (run after) |

## Enable GitHub Pages

To deploy to GitHub Pages:

### Step 1: Enable GitHub Pages

1. Go to repository **Settings**
2. Click **Pages** in sidebar
3. Under "Build and deployment":
   - Source: Select **GitHub Actions**
4. Click **Save**

### Step 2: Verify Deployment

1. After workflow runs, go to **Actions** tab
2. Check "Deploy to GitHub Pages" workflow
3. Once complete, your site is live at:
   ```
   https://YOUR_USERNAME.github.io/YOUR_REPO/
   ```

## Best Practices

1. **Always check Actions tab** after pushing code
2. **Read error logs carefully** - they tell you exactly what's wrong
3. **Don't ignore failed builds** - fix them before merging
4. **Keep workflows simple** - easier to debug
5. **Use caching** - speeds up builds (already configured)

## Quick Reference

### Trigger CI Manually
```bash
git commit --allow-empty -m "chore: trigger CI"
git push
```

### View Workflow Logs
1. GitHub → Actions → Click workflow → Click job → Click step

### Re-run Failed Workflow
1. GitHub → Actions → Click failed run → Re-run all jobs

### Check Deployment URL
1. GitHub → Settings → Pages → "Your site is live at..."

## Need Help?

- GitHub Actions Documentation: https://docs.github.com/en/actions
- Workflow Syntax Reference: https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions
- GitHub Community: https://github.community/
