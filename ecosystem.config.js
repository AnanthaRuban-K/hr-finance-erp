module.exports = {
  apps: [
    {
      name: 'frontend',
      script: 'npm',
      args: 'run start:frontend',
      cwd: '/app',
      env: {
        PORT: 3000,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'backend', 
      script: 'npm',
      args: 'run start:backend',
      cwd: '/app',
      env: {
        PORT: 3001,
        NODE_ENV: 'production'
      }
    }
  ]
}