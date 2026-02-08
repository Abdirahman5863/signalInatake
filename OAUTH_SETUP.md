# OAuth Setup Guide for SignalIntake

## OAuth Flow Explanation

The OAuth flow works in two steps:

1. **Google → Supabase**: Google redirects to Supabase's callback URL
2. **Supabase → Your App**: Supabase redirects to your app's callback URL

## Configuration Steps

### 1. Google Cloud Console (Already Done ✅)

**Authorized redirect URIs:**
```
https://flwsppivkfgzjwzlbssh.supabase.co/auth/v1/callback
```

This is correct and should stay as is.

### 2. Supabase Dashboard Configuration (REQUIRED ⚠️)

Go to: **Supabase Dashboard → Authentication → URL Configuration**

**Site URL:**
```
http://localhost:3001
```
(or `http://localhost:3000` if that's your dev port)

**Redirect URLs** (add these):
```
http://localhost:3001/auth/callback
http://localhost:3000/auth/callback
```

For production, also add:
```
https://yourdomain.com/auth/callback
```

### 3. Your App Code (Already Configured ✅)

The app is using:
```javascript
redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`
```

This will be:
- Development: `http://localhost:3001/auth/callback?next=/dashboard`
- Production: `https://yourdomain.com/auth/callback?next=/dashboard`

## How It Works

1. User clicks "Continue with Google" on your app
2. App redirects to Supabase OAuth endpoint
3. Supabase redirects to Google OAuth
4. User authorizes on Google
5. Google redirects to: `https://flwsppivkfgzjwzlbssh.supabase.co/auth/v1/callback` ✅
6. Supabase processes OAuth and creates session
7. Supabase redirects to: `http://localhost:3001/auth/callback?next=/dashboard` ⚠️ (Must be in Supabase Redirect URLs)
8. Your callback page exchanges code for session and redirects to dashboard

## Troubleshooting

If authentication fails:
- ✅ Check Google Console has Supabase callback URL
- ⚠️ **Check Supabase has your app callback URL in Redirect URLs**
- Check your app is using the correct port (3001 or 3000)
- Clear browser cookies and try again

