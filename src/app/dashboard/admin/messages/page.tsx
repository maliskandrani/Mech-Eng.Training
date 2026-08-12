import { getContactMessages } from "@/lib/queries";
import { markMessageRead, deleteMessage } from "@/lib/actions/contact-actions";
import MessageActions from "@/components/dashboard/MessageActions";

const TYPE_LABELS: Record<string, string> = {
  COMPLAINT: "شكوى",
  SUGGESTION: "اقتراح",
  INQUIRY: "استفسار",
};

const TYPE_COLORS: Record<string, string> = {
  COMPLAINT: "border-red-400/30 text-red-300",
  SUGGESTION: "border-green-400/30 text-green-300",
  INQUIRY: "border-accent/30 text-accent-soft",
};

export default async function AdminMessagesPage() {
  const messages = await getContactMessages();

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-foreground">الرسائل</h1>
      <p className="mt-1 text-muted">الرسائل الواردة من صفحة "تواصل معنا" في الموقع.</p>

      {messages.length === 0 ? (
        <p className="mt-8 text-muted">لا توجد رسائل حتى الآن.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-2xl border p-5 ${
                m.read ? "border-border bg-background-card" : "border-accent/30 bg-accent/5"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    {!m.read && <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />}
                    <h3 className="font-bold text-foreground">{m.name}</h3>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[m.type]}`}
                    >
                      {TYPE_LABELS[m.type]}
                    </span>
                  </div>
                  <p dir="ltr" className="mt-1 text-end text-sm text-muted">{m.contactInfo}</p>
                </div>
                <MessageActions
                  messageId={m.id}
                  read={m.read}
                  onMarkRead={markMessageRead}
                  onDelete={deleteMessage}
                />
              </div>
              <p className="mt-3 whitespace-pre-line text-sm text-foreground">{m.message}</p>
              <p className="mt-3 text-xs text-muted">
                {new Intl.DateTimeFormat("ar", { dateStyle: "medium", timeStyle: "short" }).format(m.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
