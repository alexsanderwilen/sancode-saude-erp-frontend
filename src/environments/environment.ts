export const environment = {
  production: false,
  // REST principal (backend :8080)
  apiUrl: 'http://localhost:8080/api',
  // Chat (backend_chat :8081) - em dev usamos proxy com caminhos relativos
  chatApiUrl: '/api/chat',
  chatWsUrl: '/ws-chat',
  // Config do Firebase (dev) — preencha se for usar SDK no dev
  firebase: {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: ''
  }
};
