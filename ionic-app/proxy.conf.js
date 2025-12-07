const PROXY_CONFIG = {
  '/api': {
    target: 'http://localhost:8080',
    secure: false,
    logLevel: 'debug',
    changeOrigin: true,
    onProxyReq: function(proxyReq, req, res) {
      console.log('[PROXY] Request:', req.method, req.url);
    },
    onProxyRes: function(proxyRes, req, res) {
      console.log('[PROXY] Response:', proxyRes.statusCode, req.url);
    },
    onError: function(err, req, res) {
      console.log('[PROXY] Error:', err.message);
    }
  },
  '/services': {
    target: 'http://localhost:8080',
    secure: false,
    logLevel: 'debug',
    changeOrigin: true
  },
  '/management': {
    target: 'http://localhost:8080',
    secure: false,
    logLevel: 'debug',
    changeOrigin: true
  }
};

module.exports = PROXY_CONFIG;
