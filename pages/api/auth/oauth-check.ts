import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * Returns the exact OAuth configuration NextAuth expects.
 * Use this to verify Google Console settings match character-for-character.
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.NEXTAUTH_URL || ''
  const redirectUri = `${base}/api/auth/callback/google`
  const jsOrigin = base.replace(/\/$/, '') // no trailing slash

  res.status(200).json({
    message: 'Copy these values into Google Cloud Console → Credentials → OAuth 2.0 Client',
    authorizedRedirectUris: [redirectUri],
    authorizedJavaScriptOrigins: [jsOrigin],
    copyPaste: {
      redirectUri: 'Paste exactly into "Authorized redirect URIs":',
      redirectValue: redirectUri,
      jsOrigin: 'Paste exactly into "Authorized JavaScript origins":',
      jsValue: jsOrigin,
    },
  })
}
