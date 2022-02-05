const servers: RTCConfiguration = {
  iceServers: [
    {
      urls: ['turn:172.31.92.8:443', 'stun:stun.l.google.com:19302'],
      username: 'tic-tac-toe',
      credential: import.meta.env.VITE_TURN_PASSWORD as string,
      credentialType: 'password'
    },
  ],
  iceCandidatePoolSize: 10,
};

export { servers };