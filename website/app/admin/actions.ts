"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

type MemberStatus = "approved" | "rejected" | "pending";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function rejectNomination(nominationId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("nominations")
    .update({ status: "rejected" })
    .eq("id", nominationId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/nominations");
}

export async function updateMemberStatus(memberId: string, status: MemberStatus) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("members")
    .update({ status })
    .eq("id", memberId);

  if (error) throw new Error(error.message);

  if (status === "approved") {
    await sendApprovalEmail(memberId);
  }

  revalidatePath("/admin");
}

async function sendApprovalEmail(memberId: string) {
  const service = createServiceClient();

  const { data: member } = await service
    .from("members")
    .select("user_id")
    .eq("id", memberId)
    .single();

  if (!member) return;

  const { data: { users } } = await service.auth.admin.listUsers({ perPage: 1000 });
  const user = users.find((u) => u.id === member.user_id);
  if (!user?.email) return;

  await resend.emails.send({
    from: "Tijdgeest <noreply@tijdgeestleest.nl>",
    to: user.email,
    subject: "Je bent lid van Tijdgeest",
    html: approvalEmailHtml(user.email),
  });
}

function approvalEmailHtml(email: string): string {
  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Je bent lid van Tijdgeest</title>
</head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#f5f0e8;">

          <!-- Header -->
          <tr>
            <td style="padding:0 0 32px 0;border-bottom:1px solid rgba(26,22,15,0.15);">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:13px;font-weight:900;color:#1a160f;">▲</td>
                  <td style="padding-left:10px;font-size:9px;font-weight:900;letter-spacing:0.2em;text-transform:uppercase;color:rgba(26,22,15,0.55);">Tijdgeest · Modern Leesgenootschap</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 0;">
              <p style="margin:0 0 6px 0;font-size:9px;font-weight:900;letter-spacing:0.2em;text-transform:uppercase;color:#c1440e;">Welkom</p>
              <h1 style="margin:0 0 24px 0;font-size:42px;font-weight:900;line-height:1;letter-spacing:-0.02em;color:#1a160f;">
                Je bent lid<br />van <em style="font-style:italic;color:#c1440e;">Tijdgeest.</em>
              </h1>
              <p style="margin:0 0 16px 0;font-size:15px;line-height:1.7;color:rgba(26,22,15,0.65);">
                Je aanvraag is goedgekeurd. Je kunt je nu aanmelden voor avonden via de agenda.
              </p>
              <p style="margin:0 0 32px 0;font-size:15px;line-height:1.7;color:rgba(26,22,15,0.65);">
                Één boek per maand, samen gelezen — we kijken ernaar uit je te ontmoeten.
              </p>
              <a href="https://www.tijdgeestleest.nl/agenda"
                 style="display:inline-block;background:#1a160f;color:#f5f0e8;font-size:10px;font-weight:900;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;padding:14px 28px;">
                Bekijk de agenda →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 0 0;border-top:1px solid rgba(26,22,15,0.10);">
              <p style="margin:0;font-size:9px;font-weight:900;letter-spacing:0.2em;text-transform:uppercase;color:rgba(26,22,15,0.25);">
                ▲ Tijdgeest · tijdgeestleest.nl
              </p>
              <p style="margin:6px 0 0 0;font-size:9px;color:rgba(26,22,15,0.25);">
                Dit bericht is verstuurd naar ${email}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
