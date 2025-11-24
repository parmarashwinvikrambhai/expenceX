"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const resend_1 = require("resend");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
const sendEmail = async (to, subject, html) => {
    try {
        await resend.emails.send({
            from: "Expense Tracker <noreply@expencex.com>",
            to,
            subject,
            html,
        });
    }
    catch (error) {
        console.error("Email send error:", error);
        throw new Error("Failed to send email");
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=emailService.js.map