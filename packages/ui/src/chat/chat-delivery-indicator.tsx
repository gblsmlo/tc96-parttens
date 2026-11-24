"use client";

import { ChecksIcon, CheckIcon, WarningCircleIcon, ClockIcon } from "@phosphor-icons/react";
import type { ReactElement } from "react";
import { cn } from "@tc96/utils";

export type ChatDeliveryIndicatorProps = {
  status: "sending" | "sent" | "delivered" | "read" | "failed";
  label: string;
};

export function ChatDeliveryIndicator({
  status,
  label,
}: ChatDeliveryIndicatorProps): ReactElement {
  const Icon = {
    sending: ClockIcon,
    sent: CheckIcon,
    delivered: ChecksIcon,
    read: ChecksIcon,
    failed: WarningCircleIcon,
  }[status];

  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      data-slot="chat-delivery-indicator"
    >
      <Icon
        aria-hidden="true"
        className={cn(
          "size-3",
          status === "read" && "text-sky-600 dark:text-sky-400",
          status === "failed" && "text-destructive",
        )}
      />
    </span>
  );
}
