
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const GOOGLE_CALLBACK_URL =
  process.env.GOOGLE_CALLBACK_URL || "http://localhost:5500/api/auth/google/callback";


export function GetGoogleAuthUrl() {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: GOOGLE_CALLBACK_URL,
    client_id: GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" ")
  };
  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
}

export async function getGoogleUser(code: string) {
  const url = "https://oauth2.googleapis.com/token";
  const values = {
    code,
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri: GOOGLE_CALLBACK_URL,
    grant_type: "authorization_code",
  };
  const tokenres = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(values),
  })
  const tokenData = (await tokenres.json()) as any;

  if (!tokenres.ok || !tokenData.access_token) {
    throw new Error("Failed to get access token from google");
  }
  const userRes = await fetch(
    `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenData.access_token}`,
    {
      headers: { Authorization: `Bearer ${tokenData.id_token}` },
    }
  );
  const googleUser = (await userRes.json()) as any;
  return googleUser; // Returns { id, email, name, picture }


}
