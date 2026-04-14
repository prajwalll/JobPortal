import { Kafka, Producer, Admin } from "kafkajs";
import dotenv from "dotenv";

dotenv.config();

let producer: Producer;
let admin: Admin;

export const connectKafka = async () => {
  try {
    const kafka = new Kafka({
      clientId: "auth-service",
      brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
    });

    admin = kafka.admin();
    await admin.connect();

    const topics = await admin.listTopics();

    if (!topics.includes("send-mail")) {
      await admin.createTopics({
        topics: [
          { topic: "send-mail", numPartitions: 1, replicationFactor: 1 },
        ],
      });
      console.log("✅ 'send-mail' topic created");
    }

    await admin.disconnect();

    producer = kafka.producer();
    await producer.connect();
    console.log("✅ Kafka Producer connected successfully");
  } catch (error) {
    console.error("❌ Error connecting to Kafka:", error);
    process.exit(1);
  }
};

export const publishToTopic = async (topic: string, message: any) => {
  if (!producer) {
    console.error("Kafka Producer not initialized");
    return;
  }

  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    console.log(`✅ Message published to topic "${topic}"`);
  } catch (error) {
    console.error("❌ Error publishing to Kafka topic:", error);
  }
};

export const disconnectKafka = async () => {
  if (producer) {
    await producer.disconnect();
    console.log("✅ Kafka Producer disconnected successfully");
  }
};
