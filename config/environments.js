export default {
  // ======================================================
  // Overrides when NODE_ENV === 'development'
  // ======================================================
  // NOTE: In development, we use an explicit public path when the assets
  // are served webpack by to fix this issue:
  // http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts/34133809#34133809
  development: (config) => ({
    compiler_public_path: `http://${config.server_host}:${config.server_port}/`,
    proxy: {
      enabled: false,
      options: {
        host: 'http://localhost:8000',
        match: /^\/api\/.*/
      }
    },
    globals: {
      ...config.globals,
      __PYTHON_API_URL__: JSON.stringify('http://ec2-54-85-109-102.compute-1.amazonaws.com:9999/api'),
      __NODE_API_URL__: JSON.stringify(`http://${config.server_host}:${config.server_port}/api`),
      __JAVA_API_URL__: JSON.stringify(`http://${config.server_host}:9010/api/v1`)
    }
  }),

  // ======================================================
  // Overrides when NODE_ENV === 'production'
  // ======================================================
  production: (config) => ({
    server_host : 'wolferx.com',
    compiler_public_path: '/',
    compiler_fail_on_warning: false,
    compiler_hash_type: 'chunkhash',
    compiler_devtool: null,
    compiler_stats: {
      chunks: true,
      chunkModules: true,
      colors: true
    },
    proxy: {
      enabled: false,
      options: {
        // koa-proxy options
        host: 'http://localhost:8000',
        match: /^\/api\/.*/
      }
    },
    globals: {
      ...config.globals,
      __PYTHON_API_URL__: JSON.stringify('http://ec2-54-85-109-102.compute-1.amazonaws.com:9999/api'),
      __NODE_API_URL__: JSON.stringify(`http://wolferx.com/api`),
      __JAVA_API_URL__: JSON.stringify(`http://${config.server_host}:9010/api/v1`)
    }
  })
}

