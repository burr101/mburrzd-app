# MBURRZD Fashion App — Full Documentation

> A luxury iOS mobile shopping app for Mburrzd (mburrzd.com), connected live to your Shopify store.
> Built with React Native / Expo. Sells big-and-tall menswear with a premium dark-gold aesthetic.

---

## Table of Contents

1. [What This App Does](#1-what-this-app-does)
2. [How the App Is Organised](#2-how-the-app-is-organised)
3. [Credentials & Secret Keys](#3-credentials--secret-keys)
4. [Setting Up Your Computer to Work on the App](#4-setting-up-your-computer-to-work-on-the-app)
5. [Running the App Locally (for Preview)](#5-running-the-app-locally-for-preview)
6. [Building the App for Real Devices](#6-building-the-app-for-real-devices)
7. [Uploading to GitHub (Version Control)](#7-uploading-to-github-version-control)
8. [Submitting to the Apple App Store](#8-submitting-to-the-apple-app-store)
9. [Deploying to Android / Google Play](#9-deploying-to-android--google-play)
10. [Updating the App After Launch](#10-updating-the-app-after-launch)
11. [Common Tasks (How To…)](#11-common-tasks-how-to)
12. [Troubleshooting](#12-troubleshooting)
13. [Third-Party Services & Accounts](#13-third-party-services--accounts)

---

## 1. What This App Does

The Mburrzd app is a fully custom iOS shopping app that connects directly to your Shopify store. Customers can:

| Feature | Description |
|---|---|
| **Browse** | Scroll a premium home screen with hero image, lifestyle blocks, and featured products |
| **Shop** | Filter and search all products, browse by collection |
| **Product Detail** | View photos, select colour and size, read descriptions |
| **Find Your Fit** | 4-step quiz that recommends a size based on height, weight, and body type |
| **Bag** | Add items, update quantities, proceed to Shopify checkout (payment handled by Shopify) |
| **Wishlist** | Save products with a heart tap |
| **Account** | Sign up / sign in with email or Sign In with Apple; view saved fit, wishlist, orders |
| **Privacy Policy** | In-app privacy policy screen (required for App Store) |

### Design Language
- Black background, gold (`#C9A96E`) accents
- Georgia serif for headings
- Inspired by Loro Piana, Fear of God, Amiri

---

## 2. How the App Is Organised

```
AppBuild/
│
├── app.json              ← App name, icon, splash screen, Apple settings
├── eas.json              ← Build profiles (preview = test device, production = App Store)
├── package.json          ← List of all code libraries the app uses
│
├── assets/               ← Images used in the app
│   ├── logoo.png         ← MBURRZD logo (used as app icon + splash screen)
│   ├── hero.png          ← Hero image on the home screen
│   └── wornby1.jpg       ← "Worn By" section photo
│
└── src/                  ← All the app's code
    ├── api/
    │   └── shopify.ts    ← Talks to your Shopify store (fetches products, manages cart)
    ├── components/
    │   └── ProductCard.tsx ← The card shown in product grids
    ├── lib/
    │   └── supabase.ts   ← Connects to Supabase (user accounts database)
    ├── navigation/
    │   └── AppNavigator.tsx ← Controls which screen shows when
    ├── screens/
    │   ├── HomeScreen.tsx        ← The main home/landing screen
    │   ├── ShopScreen.tsx        ← Browse all products
    │   ├── ProductDetailScreen.tsx ← Individual product page
    │   ├── CollectionScreen.tsx  ← Products filtered by collection
    │   ├── CartScreen.tsx        ← Shopping bag
    │   ├── CheckoutScreen.tsx    ← Shopify checkout (web view)
    │   ├── WishlistScreen.tsx    ← Saved items
    │   ├── FitQuizScreen.tsx     ← Find Your Fit quiz
    │   ├── AccountScreen.tsx     ← Sign in / register / account dashboard
    │   └── PrivacyPolicyScreen.tsx ← Privacy policy
    ├── store/
    │   ├── authStore.ts    ← Manages who is logged in
    │   ├── cartStore.ts    ← Manages items in the bag
    │   └── wishlistStore.ts ← Manages saved/wishlisted products
    └── theme/
        └── index.ts        ← All colours and design tokens (gold, black, etc.)
```

**What "store" means here:** Think of each store file as a live memory bank the app keeps while it's open — e.g. the cart store remembers what's in the bag across all screens.

---

## 3. Credentials & Secret Keys

These are the keys that connect the app to external services. Keep them private — never share them publicly.

### Where they live in the code

| What | File | Variable Name |
|---|---|---|
| Shopify store URL | `src/api/shopify.ts` line 1 | `STORE_DOMAIN` |
| Shopify storefront token | `src/api/shopify.ts` line 2 | `STOREFRONT_TOKEN` |
| Supabase project URL | `src/lib/supabase.ts` line 5 | `SUPABASE_URL` |
| Supabase anon key | `src/lib/supabase.ts` line 6 | `SUPABASE_ANON_KEY` |

### Current values

| Service | Value |
|---|---|
| Shopify store | `553999-12.myshopify.com` |
| Shopify token | `e847b5bc549850de42cfc97f3c28d80d` |
| Supabase URL | `https://nkmeeqpymvwqfsjeqwgy.supabase.co` |
| Supabase anon key | `sb_publishable_TAyU_bEne0fW2z6-wnRgqg_0vugAa-8` |

### Apple Developer details

| Item | Value |
|---|---|
| Apple Team | Mista Burr Individual |
| Team ID | `A32PJN4364` |
| Bundle ID | `com.mburrzd.fashion` |
| EAS Project ID | `b7b2c393-5690-4da0-a61a-17b9380948d1` |

### Registered test devices

| Device | UDID |
|---|---|
| iPhone | `00008150-000260113638401C` |
| iPad | `00008112-001E18E926F9401E` |

---

## 4. Setting Up Your Computer to Work on the App

You only need to do this once on a new computer.

### Step 1 — Install Node.js

Node.js is the engine that runs the app's build tools.

1. Go to [nodejs.org](https://nodejs.org)
2. Download the **LTS** version (the button on the left)
3. Run the installer, click through all the defaults
4. To verify it worked, open **PowerShell** and type:
   ```
   node --version
   ```
   You should see something like `v20.x.x`

### Step 2 — Install Git

Git saves every version of your code so nothing is ever lost.

1. Go to [git-scm.com/download/win](https://git-scm.com/download/win)
2. Download and install — accept all defaults
3. To verify, open PowerShell and type:
   ```
   git --version
   ```

### Step 3 — Install the EAS command-line tool

EAS is Expo's build service — it compiles the app for you in the cloud.

Open PowerShell and run:
```powershell
npm install -g eas-cli
```

### Step 4 — Install project dependencies

Navigate to the app folder and install all the code libraries:

```powershell
cd "C:\Users\Royston_Nnamdi\OneDrive - Dell Technologies\Documents\Windsurf_Projects\AppBuild"
npm install
```

You only need to do this once (or again whenever you add a new library).

### Step 5 — Log in to Expo

```powershell
$env:NODE_TLS_REJECT_UNAUTHORIZED=0; eas login
```

Use your Expo account credentials (the same account linked to the EAS project).

> **Why `NODE_TLS_REJECT_UNAUTHORIZED=0`?** Your Dell corporate laptop uses an SSL proxy that blocks certain external connections. This setting tells the tool to work around it. You need this prefix on all `eas` commands.

---

## 5. Running the App Locally (for Preview)

This lets you see the app on your phone instantly while you make changes — no build required.

### Install Expo Go

On your iPhone or iPad, download **Expo Go** from the App Store (free).

### Start the development server

```powershell
cd "C:\Users\Royston_Nnamdi\OneDrive - Dell Technologies\Documents\Windsurf_Projects\AppBuild"
npm start
```

A QR code will appear in PowerShell. Scan it with your iPhone camera. The app will open in Expo Go.

> **Note:** Some features (like Sign In with Apple) only work in real builds, not in Expo Go.

### Stopping the server

Press `Ctrl + C` in the PowerShell window.

---

## 6. Building the App for Real Devices

A "build" compiles the app into an installable `.ipa` file for iOS. This is what you install on your iPhone/iPad.

### Preview build (installs on your test devices)

```powershell
$env:NODE_TLS_REJECT_UNAUTHORIZED=0; eas build --platform ios --profile preview
```

When prompted:
- **Select both devices** using the spacebar (iPhone and iPad should already be listed)
- Press **Enter** to confirm

The build takes 10–20 minutes (you're in the free tier queue). When it's done, a QR code appears in PowerShell — scan it on your iPhone to install.

### What the build profiles mean

| Profile | Purpose | How to install |
|---|---|---|
| `preview` | Test on your personal devices | Scan QR code from PowerShell |
| `production` | Submit to App Store | Upload via Transporter app |

### Checking build status

While a build is running, you can check its progress at:
```
https://expo.dev/accounts/mburrzd/projects/mburrzd-fashion/builds
```

---

## 7. Uploading to GitHub (Version Control)

GitHub is like a save system for your code. Every time you push to GitHub, you have a complete backup you can restore from anywhere.

### Step 1 — Create a GitHub account

Go to [github.com](https://github.com) and sign up if you don't have an account.

### Step 2 — Create a new repository

1. Once logged in, click the **+** button (top right) → **New repository**
2. Name it: `mburrzd-app`
3. Set it to **Private** (so only you can see it)
4. Do NOT tick "Add a README" (we already have one)
5. Click **Create repository**

GitHub will show you a page with setup instructions. Note your repository URL — it will look like:
```
https://github.com/YOUR-USERNAME/mburrzd-app.git
```

### Step 3 — Create a .gitignore file

This tells Git which files NOT to save (like the huge `node_modules` folder). Create a file called `.gitignore` in the AppBuild folder with this content:

```
node_modules/
.expo/
dist/
android/
ios/
*.orig.*
web-build/
.DS_Store
```

### Step 4 — Initialise Git and push your code

Open PowerShell, navigate to the app folder, and run these commands one at a time:

```powershell
cd "C:\Users\Royston_Nnamdi\OneDrive - Dell Technologies\Documents\Windsurf_Projects\AppBuild"

# Initialise a new git repository
git init

# Tell git your name and email (one-time setup)
git config user.email "rstonokafor@gmail.com"
git config user.name "Royston"

# Stage all your files for saving
git add .

# Save a snapshot with a message
git commit -m "Initial commit: full MBURRZD app"

# Connect to your GitHub repository (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/mburrzd-app.git

# Push everything to GitHub
git push -u origin main
```

When prompted, enter your GitHub username and password (or a Personal Access Token if GitHub asks — see below).

> **GitHub now requires a Personal Access Token instead of a password.**
> To create one: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token → tick "repo" → copy the token and use it as your password.

### Step 5 — Saving future changes

Any time you make changes to the app and want to save them to GitHub:

```powershell
git add .
git commit -m "Describe what you changed"
git push
```

### Downloading the code on a new computer

```powershell
git clone https://github.com/YOUR-USERNAME/mburrzd-app.git
cd mburrzd-app
npm install
```

---

## 8. Submitting to the Apple App Store

Before submitting, make sure you have:
- [x] Apple Developer Program membership ($99/year) — at developer.apple.com
- [x] A Supabase project with Email and Apple auth providers enabled
- [x] A production build ready (see below)
- [x] App Store screenshots prepared (see below)

### Step 1 — Enable Sign In with Apple in Supabase

1. Go to [supabase.com](https://supabase.com) → your project
2. Click **Authentication** in the left sidebar → **Providers**
3. Turn on **Apple**
4. You'll need your Apple Team ID (`A32PJN4364`) and a Services ID from Apple Developer Portal
5. Also make sure **Email** provider is turned on

### Step 2 — Create a production build

```powershell
$env:NODE_TLS_REJECT_UNAUTHORIZED=0; eas build --platform ios --profile production
```

This build is configured for the App Store. When it finishes, download the `.ipa` file from expo.dev.

### Step 3 — Prepare App Store screenshots

Apple requires screenshots at specific sizes:

| Device | Size Required |
|---|---|
| iPhone 6.7" (iPhone 15 Pro Max) | 1290 × 2796 px |
| iPad 12.9" | 2048 × 2732 px |

Take screenshots using the iOS Simulator in Xcode, or use a service like [AppLaunchpad](https://theapplaunchpad.com) or [Shotbot](https://shotbot.io) to create polished marketing screenshots.

### Step 4 — Upload to App Store Connect

1. Download **Transporter** from the Mac App Store (free, Mac only)
2. Open Transporter → sign in with your Apple ID
3. Drag your `.ipa` file into Transporter → click **Deliver**

### Step 5 — Fill in your App Store listing

Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com):

1. Click **My Apps** → **+** → **New App**
2. Fill in:
   - **Name:** MBURRZD
   - **Bundle ID:** `com.mburrzd.fashion`
   - **SKU:** `mburrzd-fashion-001` (any unique code)
   - **Primary Language:** English
3. Upload screenshots
4. Write a description (e.g., "Shop the Mburrzd luxury big-and-tall menswear collection…")
5. Set **Category:** Shopping
6. Add your **Privacy Policy URL** (you can host the text from the in-app policy at a URL like `https://mburrzd.com/privacy`)
7. Under **Sign In with Apple** — confirm you have it enabled
8. Submit for review

Apple's review usually takes 24–72 hours.

### App Store checklist

- [ ] Privacy Policy URL entered (required)
- [ ] Sign In with Apple enabled (required if any third-party sign-in is offered)
- [ ] Account deletion flow works (required since 2022)
- [ ] App icon is 1024×1024 PNG, no alpha channel
- [ ] At least one set of iPhone screenshots uploaded
- [ ] Encryption declaration: select "No" (the app uses standard HTTPS only)

---

## 9. Deploying to Android / Google Play

The app has Android configuration in `app.json` and `eas.json`. Android deployment requires a Google Play Developer account ($25 one-time fee).

### Build for Android

```powershell
$env:NODE_TLS_REJECT_UNAUTHORIZED=0; eas build --platform android --profile production
```

This produces an `.aab` (Android App Bundle) file.

### Upload to Google Play

1. Go to [play.google.com/console](https://play.google.com/console)
2. Create a new app → fill in the store listing
3. Under **Production** → **Create new release** → upload your `.aab` file
4. Fill in the required content rating questionnaire
5. Submit for review (usually 3–7 days for first submission)

---

## 10. Updating the App After Launch

### For content changes (no rebuild needed)

Because the app connects live to Shopify, these update automatically without any code change:
- Product names, descriptions, prices
- Product photos
- Stock availability (sold out status)
- Adding/removing products and collections

### For app changes (rebuild required)

Any change to the code, images, or configuration requires a new build and App Store update.

**Workflow:**
1. Make your changes in VS Code / Windsurf
2. Test locally with `npm start`
3. Build: `eas build --platform ios --profile preview` (test first)
4. If all good: `eas build --platform ios --profile production`
5. Upload to App Store Connect via Transporter
6. Submit the new version for review

### Version number

Before each App Store submission, increment the version number in `app.json`:
```json
"version": "1.0.1"
```
Change the last number for small fixes, the middle number for new features, the first number for major overhauls.

---

## 11. Common Tasks (How To…)

### Change the hero image on the home screen

1. Place your new image file in the `assets/` folder (must be a `.png` file)
2. Open `src/screens/HomeScreen.tsx`
3. Find the line that says `require('../../assets/hero.png')`
4. Change `hero.png` to your new filename

### Change the app icon or splash screen

1. Place a new PNG file in `assets/` — it should be **1024×1024 pixels**, square, no rounded corners (Apple handles rounding)
2. Open `app.json`
3. Change `"icon": "./assets/logoo.png"` and `"splash": { "image": "./assets/logoo.png" }` to your new filename
4. Rebuild the app

### Change the gold accent colour

Open `src/theme/index.ts` and change the value of `accent`:
```typescript
accent: '#C9A96E',  // ← change this hex code
```

### Add a new product category

Products and collections are pulled automatically from Shopify. Just create a new collection in your Shopify admin and it will appear in the app.

### Update the privacy policy

Open `src/screens/PrivacyPolicyScreen.tsx` and edit the text inside the `SECTIONS` array. Each section has a `title` and `body`.

### Change the "Worn By" section

Open `src/screens/HomeScreen.tsx` and find the `WORN_BY` array near the top:
```typescript
const WORN_BY = [
  { handle: '@mburrzd_', label: 'Signature Polo', localImage: require('../../assets/wornby1.jpg') },
];
```
- To add a person: add a new line with their Instagram handle, the product label, and their photo (placed in `assets/`)
- To change the photo: replace `wornby1.jpg` with your new image filename

### Add a new screen

1. Create a new file in `src/screens/` (e.g., `LookbookScreen.tsx`)
2. Add it to `src/navigation/AppNavigator.tsx` inside the appropriate Stack

---

## 12. Troubleshooting

### "SSL error" or "certificate" error when running EAS commands

This is caused by your Dell corporate SSL proxy. Prefix every `eas` command with:
```powershell
$env:NODE_TLS_REJECT_UNAUTHORIZED=0; eas build ...
```

### Build fails with "expo doctor" errors about icon/splash

The icon and splash image must be `.png` files. If you see:
> `field 'icon' should point to .png image`

Make sure `app.json` points to `logoo.png` (not `logoo.jpg`) and that the file actually exists in the `assets/` folder.

### QR code from expo.dev doesn't open on my device

This is a known issue with this setup. Use the QR code that appears **directly in your PowerShell terminal** after running the build command — that one always works.

### "page not found" on expo.dev build links

Same issue — use the terminal QR code instead.

### "Session expired" when running EAS

```powershell
$env:NODE_TLS_REJECT_UNAUTHORIZED=0; eas login
```

### The app shows old products / doesn't reflect Shopify changes

The app fetches live data every time a screen loads. If something looks out of date, close the app fully and reopen it.

### Users can't sign in (auth errors)

Check:
1. **Supabase dashboard** → Authentication → Users — can you see the user's email?
2. **Supabase dashboard** → Authentication → Providers — is Email enabled?
3. Is the Supabase URL and anon key in `src/lib/supabase.ts` still correct?

### Build takes too long or gets stuck

You're on the free tier which has a queue. Builds typically take 15–30 minutes when the queue is busy. You can track progress at expo.dev.

---

## 13. Third-Party Services & Accounts

Here is every external service this app uses, what it does, and where to manage it.

| Service | What It Does | Where to Manage |
|---|---|---|
| **Shopify** | Your store — products, orders, checkout, payments | shopify.com → your store admin |
| **Expo / EAS** | Builds and distributes the app | expo.dev (account: mburrzd) |
| **Apple Developer** | Required to build iOS apps and submit to App Store | developer.apple.com |
| **App Store Connect** | Where you submit and manage your App Store listing | appstoreconnect.apple.com |
| **Supabase** | Stores user accounts, handles sign in / sign up | supabase.com → your project |
| **GitHub** | Stores your code safely, version history | github.com → your repository |

### Monthly/Annual costs

| Service | Cost |
|---|---|
| Shopify | Your existing plan |
| Expo EAS | Free (legacy tier) — builds are slower but free |
| Apple Developer Program | $99 / year (required for App Store) |
| Supabase | Free tier (up to 50,000 monthly active users) |
| GitHub | Free for private repositories |

---

## Quick Reference — Most Used Commands

Open PowerShell, navigate to the project folder first:
```powershell
cd "C:\Users\Royston_Nnamdi\OneDrive - Dell Technologies\Documents\Windsurf_Projects\AppBuild"
```

| Task | Command |
|---|---|
| Start local development | `npm start` |
| Install / update dependencies | `npm install` |
| Build for test devices | `$env:NODE_TLS_REJECT_UNAUTHORIZED=0; eas build --platform ios --profile preview` |
| Build for App Store | `$env:NODE_TLS_REJECT_UNAUTHORIZED=0; eas build --platform ios --profile production` |
| Save code to GitHub | `git add . && git commit -m "your message" && git push` |
| Log in to EAS | `$env:NODE_TLS_REJECT_UNAUTHORIZED=0; eas login` |
| Check TypeScript for errors | `npx tsc --noEmit` |

---

*Documentation last updated: April 2025*
*App version: 1.0.0*
*Bundle ID: com.mburrzd.fashion*
