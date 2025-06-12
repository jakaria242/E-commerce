import nodemailer from "nodemailer";

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "jakaria.dev242@gmail.com",
    pass: "pxvz vuca txkq mrpk",
  },
});

// Wrap in an async IIFE so we can use await.
export async function mail(to, subject, text ="", html){
  const info = await transporter.sendMail({
    from: '"Jakaria" <ecommerce@mail.com>',
    to ,
    subject,
    text, // plain‑text body
    html, // HTML body
  });

  console.log("Message sent:", info.messageId);
}