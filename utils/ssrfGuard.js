const dns = require('dns').promises
const { URL } = require('url')

const PRIVATE_RANGES = [
  { start: '10.0.0.0', end: '10.255.255.255' },
  { start: '127.0.0.0', end: '127.255.255.255' },
  { start: '169.254.0.0', end: '169.254.255.255' },
  { start: '172.16.0.0', end: '172.31.255.255' },
  { start: '192.168.0.0', end: '192.168.255.255' },
  { start: '0.0.0.0', end: '0.255.255.255' },
]

function ipToNum(ip) {
  return ip.split('.').reduce((acc, oct) => (acc << 8) + parseInt(oct, 10), 0) >>> 0
}

function isPrivateIP(ip) {
  const num = ipToNum(ip)
  return PRIVATE_RANGES.some(({ start, end }) => {
    return num >= ipToNum(start) && num <= ipToNum(end)
  })
}

function isLinkLocalIPv6(ip) {
  return ip === '::1' || ip.startsWith('fe80:') || ip.startsWith('fc') || ip.startsWith('fd')
}

function isLoopbackIPv6(ip) {
  return ip === '::1'
}

const DEFAULT_WHITELIST = [
  'e-hentai.org',
  'exhentai.org',
  '*.ehgt.org',
  '*.hentai-cdn.com',
  'hstorage.xyz',
  'sfmcompile.club',
  'watchhentai.net',
  'watchhentai-api.vercel.app',
  'nsfw-api-p302.onrender.com',
  'api.mymemory.translated.net',
]

function matchWhitelist(hostname, whitelist) {
  const h = hostname.toLowerCase()
  return whitelist.some((pattern) => {
    if (pattern.startsWith('*.')) {
      const suffix = pattern.slice(1).toLowerCase()
      return h === suffix.slice(1) || h.endsWith(suffix)
    }
    return h === pattern.toLowerCase()
  })
}

async function validateUrl(inputUrl, options = {}) {
  const { whitelist = DEFAULT_WHITELIST, timeout = 10000 } = options

  let parsed
  try {
    parsed = new URL(inputUrl)
  } catch {
    throw new Error('Invalid URL')
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('URL protocol must be http or https')
  }

  if (!matchWhitelist(parsed.hostname, whitelist)) {
    throw new Error('URL host not in whitelist: ' + parsed.hostname)
  }

  try {
    const ips = await dns.resolve4(parsed.hostname)
    for (const ip of ips) {
      if (isPrivateIP(ip) || isLinkLocalIPv6(ip)) {
        throw new Error('URL resolves to a private or loopback IP address')
      }
    }
  } catch (err) {
    if (err.code === 'ENOTFOUND' || err.code === 'ENODATA') {
      return parsed.href
    }
    throw err
  }

  return parsed.href
}

module.exports = { validateUrl, DEFAULT_WHITELIST, matchWhitelist, isPrivateIP }
