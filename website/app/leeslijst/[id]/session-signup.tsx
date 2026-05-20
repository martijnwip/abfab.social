import { createClient } from "@/lib/supabase/server";
import SessionSignupClient from "./session-signup-client";

type Props = {
  sessionId: string;
  workId: string;
};

export default async function SessionSignup({ sessionId, workId }: Props) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const loginUrl = `/login?next=/leeslijst/${workId}`;

  if (!user) {
    return (
      <SessionSignupClient
        sessionId={sessionId}
        memberId={null}
        memberStatus={null}
        alreadySignedUp={false}
        loginUrl={loginUrl}
      />
    );
  }

  // Haal member op
  const { data: member } = await supabase
    .from("members")
    .select("id, status")
    .eq("user_id", user.id)
    .single();

  if (!member) {
    return (
      <SessionSignupClient
        sessionId={sessionId}
        memberId={null}
        memberStatus={null}
        alreadySignedUp={false}
        loginUrl={loginUrl}
      />
    );
  }

  // Controleer of al aangemeld
  const { data: existing } = await supabase
    .from("session_signups")
    .select("id")
    .eq("session_id", sessionId)
    .eq("member_id", member.id)
    .single();

  return (
    <SessionSignupClient
      sessionId={sessionId}
      memberId={member.id}
      memberStatus={member.status as "pending" | "approved" | "rejected"}
      alreadySignedUp={!!existing}
      loginUrl={loginUrl}
    />
  );
}
