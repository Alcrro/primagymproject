"use client";

import { useState } from "react";
import { respondPersonalRequestAction } from "@/app/actions/personalRequest";
import { IPersonalRequestWithDetails } from "@/types/booking";
import "./trainer.scss";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "În așteptare", ACCEPTED: "Acceptat", REJECTED: "Refuzat", CANCELLED: "Anulat",
};

interface ITrainerRequestsTableProps {
  requests: IPersonalRequestWithDetails[];
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("ro-RO", {
    weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  }).format(new Date(date));
}

export default function TrainerRequestsTable({ requests }: ITrainerRequestsTableProps) {
  const [respondingId, setRespondingId] = useState<number | null>(null);

  if (requests.length === 0) {
    return <p className="tr-empty">Nu există cereri momentan.</p>;
  }

  return (
    <div className="tr-table-wrap">
      <table className="tr-table">
        <thead>
          <tr>
            <th>Membru</th>
            <th>Ora solicitată</th>
            <th>Mesaj</th>
            <th>Status</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <>
              <tr key={req.id}>
                <td className="tr-name">{req.member.name ?? req.member.email}</td>
                <td>{formatDateTime(req.requestedAt)}</td>
                <td className="tr-message">{req.message ?? <span className="tr-muted">—</span>}</td>
                <td>
                  <span className={`tr-status tr-status--${req.status.toLowerCase()}`}>
                    {STATUS_LABELS[req.status]}
                  </span>
                </td>
                <td>
                  {req.status === "PENDING" && (
                    <div className="tr-row-actions">
                      <button className="tr-btn-accept" onClick={() => setRespondingId(respondingId === req.id ? null : req.id)}>
                        Răspunde
                      </button>
                    </div>
                  )}
                  {req.responseNote && req.status !== "PENDING" && (
                    <span className="tr-muted tr-note">{req.responseNote}</span>
                  )}
                </td>
              </tr>
              {respondingId === req.id && (
                <tr key={`${req.id}-form`} className="tr-respond-row">
                  <td colSpan={5}>
                    <form
                      className="tr-respond-form"
                      action={async (fd) => {
                        await respondPersonalRequestAction(fd);
                        setRespondingId(null);
                      }}
                    >
                      <input type="hidden" name="id" value={req.id} />
                      <textarea className="tr-textarea" name="responseNote" placeholder="Notă opțională..." rows={2} />
                      <div className="tr-respond-actions">
                        <button type="submit" name="status" value="ACCEPTED" className="tr-btn-accept">Acceptă</button>
                        <button type="submit" name="status" value="REJECTED" className="tr-btn-reject">Refuză</button>
                        <button type="button" className="tr-btn-cancel" onClick={() => setRespondingId(null)}>Anulează</button>
                      </div>
                    </form>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
