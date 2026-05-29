import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/main.css';
import * as Sentry from "@sentry/vue";

const app = createApp(App);

Sentry.init({
  app,
  dsn: "https://22e1aef9c2231698182a0541ef8069e4@o4511302587187200.ingest.de.sentry.io/4511471842426960",
  sendDefaultPii: true
});

app.use(createPinia());
app.use(router);

app.mount('#app');
