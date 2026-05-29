import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://d1271ded720458c379ea325575e21c43@o4511302587187200.ingest.de.sentry.io/4511471770206288",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});