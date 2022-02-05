const servers = {
  iceServers: [
    {
      urls: 'turn:172.31.92.8:443',
      username: 'tic-tac-toe',
      credential: import.meta.env.VITE_TURN_PASSWORD,
      credentialType: 'password'
    },
  ],
  iceCandidatePoolSize: 10,
};

export { servers };