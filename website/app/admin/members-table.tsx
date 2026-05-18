"use client";

import { useState, useTransition } from "react";
import { updateMemberStatus } from "./actions";

type Member = {
  id: string;
  user_id: string;
  email: string;
  role: "member" | "admin";
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

const statusColors: Record<Member["status"], string> = {
  pending:  "bg-mustard/20 text-mustard",
  approved: "bg-seafoam/30 text-ink",
  rejected: "bg-terracotta/20 text-terracotta",
};

export default function MembersTable({ members }: { members: Member[] }) {
  const [pending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  function handleStatus(memberId: string, status: Member["status"]) {
    setLoadingId(memberId);
    startTransition(async () => {
      await updateMemberStatus(memberId, status);
      setLoadingId(null);
    });
  }

  if (members.length === 0) {
    return (
      <p className="text-sm text-ink/50 py-12 text-center">
        Nog geen leden geregistreerd.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-ink/10">
            <th className="text-left text-[10px] font-black uppercase tracking-[0.18em] text-ink/40 pb-3 pr-6">
              E-mail
            </th>
            <th className="text-left text-[10px] font-black uppercase tracking-[0.18em] text-ink/40 pb-3 pr-6">
              Rol
            </th>
            <th className="text-left text-[10px] font-black uppercase tracking-[0.18em] text-ink/40 pb-3 pr-6">
              Status
            </th>
            <th className="text-left text-[10px] font-black uppercase tracking-[0.18em] text-ink/40 pb-3 pr-6">
              Aangemeld op
            </th>
            <th className="text-left text-[10px] font-black uppercase tracking-[0.18em] text-ink/40 pb-3">
              Acties
            </th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id} className="border-b border-ink/5 hover:bg-krant/30 transition-colors">
              <td className="py-4 pr-6 text-sm text-ink">
                {member.email || <span className="text-ink/30 italic">onbekend</span>}
              </td>
              <td className="py-4 pr-6">
                <span className="text-xs font-medium capitalize">{member.role}</span>
              </td>
              <td className="py-4 pr-6">
                <span className={`inline-block text-[10px] font-black uppercase tracking-[0.12em] px-2.5 py-1 ${statusColors[member.status]}`}>
                  {member.status}
                </span>
              </td>
              <td className="py-4 pr-6 text-ink/50">
                {new Date(member.created_at).toLocaleDateString("nl-NL")}
              </td>
              <td className="py-4">
                <div className="flex gap-2">
                  {member.status !== "approved" && (
                    <button
                      onClick={() => handleStatus(member.id, "approved")}
                      disabled={pending && loadingId === member.id}
                      className="text-[10px] font-black uppercase tracking-[0.1em] px-3 py-1.5 bg-seafoam/30 text-ink hover:bg-seafoam/50 transition-colors disabled:opacity-40"
                    >
                      Goedkeuren
                    </button>
                  )}
                  {member.status !== "rejected" && (
                    <button
                      onClick={() => handleStatus(member.id, "rejected")}
                      disabled={pending && loadingId === member.id}
                      className="text-[10px] font-black uppercase tracking-[0.1em] px-3 py-1.5 bg-terracotta/15 text-terracotta hover:bg-terracotta/25 transition-colors disabled:opacity-40"
                    >
                      Afwijzen
                    </button>
                  )}
                  {member.status !== "pending" && (
                    <button
                      onClick={() => handleStatus(member.id, "pending")}
                      disabled={pending && loadingId === member.id}
                      className="text-[10px] font-black uppercase tracking-[0.1em] px-3 py-1.5 bg-mustard/15 text-ink/60 hover:bg-mustard/25 transition-colors disabled:opacity-40"
                    >
                      Pending
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
