const checkoutNodeJssdk = require('@paypal/checkout-server-sdk')

// PayPal environment setup
function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID || ''
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET || ''
  const mode = process.env.PAYPAL_MODE || 'sandbox'

  if (!clientId || !clientSecret) {
    console.warn('PayPal credentials not configured.')
  }

  // Use live environment if PAYPAL_MODE=live, otherwise use sandbox
  if (mode === 'live') {
    console.log('[PayPal] Using LIVE environment')
    return new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret)
  } else {
    console.log('[PayPal] Using SANDBOX environment')
    return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret)
  }
}

// PayPal HTTP client
function client() {
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment())
}

export { client, checkoutNodeJssdk }
