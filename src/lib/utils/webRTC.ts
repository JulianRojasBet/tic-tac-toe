const servers: RTCConfiguration = {
  iceServers: [
    {
      urls: ['stun:stun.l.google.com:19302'],
    },
    {
      urls: ['turn:numb.viagenie.ca'],
      username: import.meta.env.VITE_TURN_USERNAME as string,
      credential: import.meta.env.VITE_TURN_PASSWORD as string,
      credentialType: 'password'
    },
  ],
  iceCandidatePoolSize: 10,
};

export { servers };