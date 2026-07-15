"use server";

import nodemailer from "nodemailer";

export async function sendCallbackMail(phone) {
  if (!phone) return { success: false };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD, // Gmail App Password
    },
  });

  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: process.env.USER_EMAIL,
    subject: "New Callback Request",
    text: `New mobile number request: ${phone}`,
    html: `<h2>New Callback Request</h2>
           <p>Mobile Number: <b>+91 ${phone}</b></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (err) {
    console.log(err);
    return { success: false };
  }
}
