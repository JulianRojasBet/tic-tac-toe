const servers = {
  iceServers: [
    {
      urls: [
        "stun:stun.services.mozilla.com",
        "stun:stun.l.google.com:19302",
      ],
    },
  ],
  iceCandidatePoolSize: 10,
};

export { servers };