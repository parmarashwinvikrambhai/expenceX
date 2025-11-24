import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        await resend.emails.send({
            from: "Expense Tracker <onboard@resend.dev>",
            to,
            subject,
            html,
        });
    } catch (error) {
        console.error("Email send error:", error);
        throw new Error("Failed to send email");
    }
};
