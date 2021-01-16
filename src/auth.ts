import got from "got"

const prefixUrl = "https://auth.tidal.com/v1/oauth2"

type DeviceTokenInput = {
  client_id: string
  scope?: string
}

type DeviceTokenOutput = {
  deviceCode: string
  userCode: string
  verificationUri: string
  verificationUriComplete: string
  expiresIn: number
  interval: number
}

type AccessTokenInput = {
  client_id: string
  client_secret: string
  device_code: string
  grant_type?: string
  scope?: string
}

type AccessTokenOutput = {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

const auth = {
  /**
   * Generate a DeviceCode and UserCode.
   * After that, redirect the User to the verificationUriComplete URI
   */
  getDeviceToken: async ({ client_id, scope = "r_usr+w_usr+w_sub" }: DeviceTokenInput) => {
    const data = await got({
      prefixUrl,
      method: "post",
      url: "device_authorization",
      form: { client_id, scope },
    }).json()

    return data as DeviceTokenOutput
  },
  /**
   * Using the DeviceCode, poll this endpoint with the defined interval until
   * it stops returning the "authorization_pending" error.
   */
  getAccessToken: async ({
    client_id,
    client_secret,
    device_code,
    grant_type = "urn:ietf:params:oauth:grant-type:device_code",
    scope = "r_usr+w_usr",
  }: AccessTokenInput) => {
    const data = await got({
      prefixUrl,
      method: "post",
      url: "token",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      username: client_id,
      password: client_secret,
      form: {
        client_id,
        device_code,
        grant_type,
        scope,
      },
    }).json()

    return data as AccessTokenOutput
  },
}

export default auth
