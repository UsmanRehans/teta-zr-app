import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return Response.json({ error: "Email service not configured" }, { status: 500 });
    }
    const resend = new Resend(process.env.RESEND_API_KEY);
    const body = await request.json();
    const { name, phone, email, university, role, why, social, heardFrom } = body;

    await resend.emails.send({
      from: "Our Teta Careers <onboarding@resend.dev>",
      to: "usman.rehan.95@gmail.com",
      subject: `New Our Teta Application — ${role} — ${name}`,
      html: `
        <h2>New Application for Our Teta</h2>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">Role</td><td style="padding:8px;border-bottom:1px solid #eee">${role}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">Name</td><td style="padding:8px;border-bottom:1px solid #eee">${name}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">Phone</td><td style="padding:8px;border-bottom:1px solid #eee">${phone}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">Email</td><td style="padding:8px;border-bottom:1px solid #eee">${email}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">University</td><td style="padding:8px;border-bottom:1px solid #eee">${university || "N/A"}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">Instagram/TikTok</td><td style="padding:8px;border-bottom:1px solid #eee">${social || "N/A"}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee">How they heard about us</td><td style="padding:8px;border-bottom:1px solid #eee">${heardFrom}</td></tr>
        </table>
        <h3 style="margin-top:20px">Why they want this role:</h3>
        <p style="background:#f9f9f9;padding:16px;border-radius:8px">${why}</p>
      `,
    });

    return Response.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
