import "dotenv/config"

export const config = {
  LOGGER: process.env.LOGGER,
  RABBITMQ_URI: process.env.RABBITMQ_URI,
  REDIS_URI: process.env.REDIS_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  API_KEY: process.env.API_KEY,
};

Object.entries(config).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
});

export const rabbitMQConfig = {
  queue: "save_log",
};
