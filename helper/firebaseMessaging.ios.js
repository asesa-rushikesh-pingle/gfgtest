// Firebase is disabled on iOS to avoid native crashes.
const noopUnsubscribe = () => {};

const messagingStub = () => ({
  getToken: async () => '',
  onMessage: () => noopUnsubscribe,
  onNotificationOpenedApp: () => noopUnsubscribe,
  getInitialNotification: async () => null,
  requestPermission: async () => 1,
  hasPermission: async () => 1,
});

export default messagingStub;
