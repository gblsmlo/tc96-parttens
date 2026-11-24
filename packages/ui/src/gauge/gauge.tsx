"use client";

import { Meter as MeterPrimitive } from "@base-ui/react/meter";
import { cn } from "@tc96/utils";
import { cva } from "class-variance-authority";
import type * as React from "react";

export const gaugeVariantNames = ["bar", "segmented", "ring"] as const;
export type GaugeVariant = (typeof gaugeVariantNames)[number];
export const gaugeSizes = ["sm", "default", "lg"] as const;
export type GaugeSize = (typeof gaugeSizes)[number];
export const gaugeTones = [
  "primary",
  "foreground",
  "success",
  "warning",
  "destructive",
  "info",
] as const;
export type GaugeTone = (typeof gaugeTones)[number];

export const gaugeVariants = cva("", {
  defaultVariants: { variant: "bar" },
  variants: {
    variant: {
      bar: "block w-full",
      segmented: "block w-full",
      ring: "relative inline-flex shrink-0",
    },
  },
});

const gaugeTrackVariants = cva("block w-full overflow-hidden rounded-full", {
  defaultVariants: { size: "default" },
  variants: {
    size: {
      sm: "h-1",
      default: "h-2",
      lg: "h-3",
    },
  },
});

const gaugeRingSizeVariants = cva("", {
  defaultVariants: { size: "default" },
  variants: {
    size: {
      sm: "size-10",
      default: "size-14",
      lg: "size-20",
    },
  },
});

const gaugeFillVariants = cva("", {
  defaultVariants: { tone: "primary" },
  variants: {
    tone: {
      primary: "bg-primary",
      foreground: "bg-foreground",
      success: "bg-success",
      warning: "bg-warning",
      destructive: "bg-destructive",
      info: "bg-info",
    },
  },
});

const gaugeStrokeVariants = cva("", {
  defaultVariants: { tone: "primary" },
  variants: {
    tone: {
      primary: "stroke-primary",
      foreground: "stroke-foreground",
      success: "stroke-success",
      warning: "stroke-warning",
      destructive: "stroke-destructive",
      info: "stroke-info",
    },
  },
});

const RING_RADIUS = 42;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function gaugeRatio(value: number, min: number, max: number): number {
  return max > min ? Math.min(Math.max((value - min) / (max - min), 0), 1) : 0;
}

export function filledSegments(ratio: number, segments: number): number {
  return segments > 0 ? Math.round(Math.min(Math.max(ratio, 0), 1) * segments) : 0;
}

function GaugeRingGraphic({
  children,
  empty,
  ratio,
  strokeWidth,
  tone,
}: {
  children?: React.ReactNode;
  empty: boolean;
  ratio: number;
  strokeWidth: number;
  tone: GaugeTone;
}): React.ReactElement {
  return (
    <>
      <svg
        aria-hidden="true"
        className="-rotate-90 size-full"
        viewBox="0 0 100 100"
      >
        <circle
          className={empty ? "stroke-input" : "stroke-muted"}
          cx="50"
          cy="50"
          fill="none"
          r={RING_RADIUS}
          strokeDasharray={empty ? "6 10" : undefined}
          strokeWidth={strokeWidth}
        />
        {empty ? null : (
          <circle
            className={cn(
              "transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none",
              gaugeStrokeVariants({ tone }),
            )}
            cx="50"
            cy="50"
            data-slot="gauge-indicator"
            fill="none"
            r={RING_RADIUS}
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={RING_CIRCUMFERENCE * (1 - Math.min(Math.max(ratio, 0), 1))}
            strokeLinecap="round"
            strokeWidth={strokeWidth}
          />
        )}
      </svg>
      {children ? (
        <span className="absolute inset-0 flex flex-col items-center justify-center">
          {children}
        </span>
      ) : null}
    </>
  );
}

export interface GaugeRingProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  children?: React.ReactNode;
  empty?: boolean;
  ratio: number;
  size?: GaugeSize;
  strokeWidth?: number;
  tone?: GaugeTone;
}

export function GaugeRing({
  children,
  className,
  empty = false,
  ratio,
  size = "default",
  strokeWidth = 10,
  tone = "primary",
  ...props
}: GaugeRingProps): React.ReactElement {
  return (
    <div
      aria-hidden="true"
      className={cn(
        gaugeVariants({ variant: "ring" }),
        gaugeRingSizeVariants({ size }),
        className,
      )}
      data-empty={empty ? "true" : undefined}
      data-size={size}
      data-slot="gauge-ring"
      data-tone={tone}
      {...props}
    >
      <GaugeRingGraphic
        empty={empty}
        ratio={empty ? 0 : ratio}
        strokeWidth={strokeWidth}
        tone={tone}
      >
        {children}
      </GaugeRingGraphic>
    </div>
  );
}

export interface GaugeProps
  extends Omit<MeterPrimitive.Root.Props, "children" | "className"> {
  children?: React.ReactNode;
  className?: string;
  empty?: boolean;
  segments?: number;
  size?: GaugeSize;
  strokeWidth?: number;
  tone?: GaugeTone;
  variant?: GaugeVariant;
}

export function Gauge({
  children,
  className,
  empty = false,
  max = 100,
  min = 0,
  segments = 10,
  size = "default",
  strokeWidth = 10,
  tone = "primary",
  value,
  variant = "bar",
  ...props
}: GaugeProps): React.ReactElement {
  const ratio = empty ? 0 : gaugeRatio(value, min, max);
  const filled = filledSegments(ratio, segments);

  return (
    <MeterPrimitive.Root
      className={cn(
        gaugeVariants({ variant }),
        variant === "ring" ? gaugeRingSizeVariants({ size }) : undefined,
        className,
      )}
      data-empty={empty ? "true" : undefined}
      data-size={size}
      data-slot="gauge"
      data-tone={tone}
      data-variant={variant}
      max={max}
      min={min}
      value={Math.min(Math.max(value, min), max)}
      {...props}
    >
      {variant === "bar" ? (
        <MeterPrimitive.Track
          className={cn(gaugeTrackVariants({ size }), "bg-muted")}
          data-slot="gauge-track"
        >
          {empty ? null : (
            <MeterPrimitive.Indicator
              className={cn(
                "block h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none",
                gaugeFillVariants({ tone }),
              )}
              data-slot="gauge-indicator"
            />
          )}
        </MeterPrimitive.Track>
      ) : null}
      {variant === "segmented" ? (
        <MeterPrimitive.Track
          className={cn(gaugeTrackVariants({ size }), "flex gap-0.5 rounded-none")}
          data-slot="gauge-track"
        >
          {Array.from({ length: segments }, (_, segment) => (
            <span
              aria-hidden="true"
              className={cn(
                "flex-1 rounded-full",
                segment < filled ? gaugeFillVariants({ tone }) : "bg-muted",
              )}
              data-filled={segment < filled ? "true" : undefined}
              data-slot="gauge-segment"
              key={segment}
            />
          ))}
        </MeterPrimitive.Track>
      ) : null}
      {variant === "ring" ? (
        <GaugeRingGraphic
          empty={empty}
          ratio={ratio}
          strokeWidth={strokeWidth}
          tone={tone}
        >
          {children}
        </GaugeRingGraphic>
      ) : null}
    </MeterPrimitive.Root>
  );
}

export interface GaugeStackPart {
  color?: string;
  id: string;
  label: React.ReactNode;
  value: number;
}

export interface GaugeStackProps
  extends Omit<React.ComponentProps<"ul">, "children"> {
  parts: readonly GaugeStackPart[];
  size?: GaugeSize;
}

export function GaugeStack({
  className,
  parts,
  size = "default",
  ...props
}: GaugeStackProps): React.ReactElement {
  return (
    <ul
      className={cn(gaugeTrackVariants({ size }), "flex gap-0.5", className)}
      data-size={size}
      data-slot="gauge-stack"
      {...props}
    >
      {parts.map((part, index) => (
        <li
          className="h-full min-w-0.5 rounded-full"
          data-slot="gauge-stack-part"
          key={part.id}
          style={{
            backgroundColor: part.color ?? `var(--chart-${(index % 5) + 1})`,
            flexBasis: 0,
            flexGrow: Math.max(part.value, 0),
          }}
        >
          <span className="sr-only">{part.label}</span>
        </li>
      ))}
    </ul>
  );
}
