module.exports = {
  apps: [{
    name: 'markr',
    script: 'server/index.js',
    node_args: '--env-file=.env',
    instances: 1,
    exec_mode: 'fork',
    kill_timeout: 5000,
    restart_delay: 500,
    env: {
      NODE_ENV: 'production',
    },
  }],
};
