const servers: RTCConfiguration = {
  iceServers: [
    {
      urls: ['turn:numb.viagenie.ca', 'stun:stun.l.google.com:19302'],
      username: import.meta.env.VITE_TURN_USERNAME as string,
      credential: import.meta.env.VITE_TURN_PASSWORD as string,
      credentialType: 'password'
    },
  ],
  iceCandidatePoolSize: 10,
};

export { servers };