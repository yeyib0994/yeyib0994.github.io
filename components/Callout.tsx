import type { ReactNode } from "react";

type CalloutType = "info" | "tip" | "warning";

const STYLES: Record<
  CalloutType,
  { border: string; bg: string; label: string; icon: string }
> = {
  info: {
    border: "border-border",
    bg: "bg-card",
    label: "text-muted",
    icon: "ℹ",
  },
  tip: {
    border: "border-border",
    bg: "bg-card",
    label: "text-fg",
    icon: "💡",
  },
  warning: {
    border: "border-border",
    bg: "bg-card",
    label: "text-fg",
    icon: "⚠",
  },
};

function CalloutBox({
  type = "info",
  title,
  children,
}: {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}) {
  const s = STYLES[type];
  return (
    <div
      className={`my-6 rounded-md border ${s.border} ${s.bg} px-4 py-3 text-sm leading-relaxed`}
    >
      {title && (
        <div className={`mb-1.5 flex items-center gap-1.5 font-semibold ${s.label}`}>
          <span aria-hidden>{s.icon}</span>
          <span>{title}</span>
        </div>
      )}
      <div className="text-fg [&>p]:my-0 [&>p+p]:mt-2 [&>pre]:mt-2">
        {children}
      </div>
    </div>
  );
}

export function Callout({
  type,
  title,
  children,
}: {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}) {
  return (
    <CalloutBox type={type ?? "info"} title={title}>
      {children}
    </CalloutBox>
  );
}

export function Tip({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <CalloutBox type="tip" title={title ?? "提示"}>
      {children}
    </CalloutBox>
  );
}

export function Warning({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <CalloutBox type="warning" title={title ?? "注意"}>
      {children}
    </CalloutBox>
  );
}
