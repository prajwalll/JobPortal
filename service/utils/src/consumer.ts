import { Kafka } from "kafkajs";
import nodemailer from "nodemailer";

import dotenv from "dotenv";

dotenv.config();

export const startSendMailConsumer = async () => {
  try {
    const kafka = new Kafka({
      clientId: "mail-service",
      brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
    });

    const consumer = kafka.consumer({ groupId: "mail-service-group" });

    await consumer.connect();

    const topicName = "send-mail";

    await consumer.subscribe({ topic: topicName, fromBeginning: false });

    console.log(
      "✅ Mail Service Consumer started, listening for sending mails...",
    );

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const { to, subject, html } = JSON.parse(
            message.value?.toString() || "{}",
          );

          const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: process.env.EMAIL_SMTP_USER,
              pass: process.env.EMAIL_SMTP_PASSWORD,
            },
          });

          await transporter.sendMail({
            from: "HireHeaven <no-reply@hireheaven.com>",
            to,
            subject,
            html,
          });

          console.log(`📧 Email sent to ${to} with subject "${subject}"`);
        } catch (error) {
          console.error("Error in send mail consumer:", error);
        }
      },
    });
  } catch (error) {
    console.error("failed to start kafka consumer:", error);
  }
};
