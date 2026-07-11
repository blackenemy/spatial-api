module.exports = {
  apps: [
    {
      name: 'spatial-api',
      script: 'dist/main.js',
      cwd: '/opt/spatial/api',
      instances: 1,
      autorestart: true,
      env: {
        NODE_ENV: 'production',
        DATABASE_URL: 'postgres://spatial:spatial@10.0.0.5:5432/spatial',
        PORT: 5001,
      },
    },
  ],
};
