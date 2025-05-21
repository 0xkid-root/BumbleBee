import type React from "react"
import { cn } from "@/lib/utils"

// Heading components
export function H1({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h1 className={cn("text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight", className)} {...props} />
}

export function H2({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight", className)} {...props} />
}

export function H3({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-2xl md:text-3xl font-bold tracking-tight", className)} {...props} />
}

export function H4({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h4 className={cn("text-xl md:text-2xl font-semibold tracking-tight", className)} {...props} />
}

export function H5({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h5 className={cn("text-lg md:text-xl font-semibold tracking-tight", className)} {...props} />
}

export function H6({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h6 className={cn("text-base md:text-lg font-semibold tracking-tight", className)} {...props} />
}

// Paragraph components
export function P({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("leading-7", className)} {...props} />
}

export function Lead({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-xl md:text-2xl text-muted-foreground", className)} {...props} />
}

export function Large({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-lg font-semibold", className)} {...props} />
}

export function Small({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <small className={cn("text-sm font-medium leading-none", className)} {...props} />
}

export function Subtle({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />
}

export function Muted({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />
}

// Gradient text components
export function GradientText({
  className,
  variant = "primary",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "primary" | "secondary" | "accent" | "gold" | "custom"
}) {
  const gradientClass = variant === "custom" ? "" : `text-gradient-${variant}`

  return <span className={cn("bg-clip-text text-transparent", gradientClass, className)} {...props} />
}

// Blockquote component
export function Blockquote({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className={cn("mt-6 border-l-4 border-primary pl-6 italic text-muted-foreground", className)}
      {...props}
    />
  )
}

// Code component
export function Code({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <code className={cn("relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm", className)} {...props} />
  )
}

// Section title component with optional badge
export function SectionTitle({
  title,
  subtitle,
  badge,
  className,
  titleClassName,
  subtitleClassName,
  badgeClassName,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  title: React.ReactNode
  subtitle?: React.ReactNode
  badge?: React.ReactNode
  titleClassName?: string
  subtitleClassName?: string
  badgeClassName?: string
}) {
  return (
    <div className={cn("space-y-4 text-center", className)} {...props}>
      {badge && <div className={cn("inline-block mb-2", badgeClassName)}>{badge}</div>}
      <H2 className={cn("", titleClassName)}>{title}</H2>
      {subtitle && <Lead className={cn("mx-auto max-w-[800px]", subtitleClassName)}>{subtitle}</Lead>}
    </div>
  )
}

// Typography demo component
export function TypographyDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <H1>Heading 1</H1>
        <H2>Heading 2</H2>
        <H3>Heading 3</H3>
        <H4>Heading 4</H4>
        <H5>Heading 5</H5>
        <H6>Heading 6</H6>
      </div>

      <div className="space-y-4">
        <P>
          This is a paragraph of text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua.
        </P>
        <Lead>This is a lead paragraph, used for introductions or important text that needs to stand out.</Lead>
        <Large>This is large text, useful for emphasizing important information.</Large>
        <Small>This is small text, useful for captions or secondary information.</Small>
        <Subtle>This is subtle text, useful for less important information.</Subtle>
        <Muted>This is muted text, useful for metadata or helper text.</Muted>
      </div>

      <div className="space-y-4">
        <GradientText variant="primary">Primary gradient text</GradientText>
        <GradientText variant="secondary">Secondary gradient text</GradientText>
        <GradientText variant="accent">Accent gradient text</GradientText>
        <GradientText variant="gold">Gold gradient text</GradientText>
        <GradientText variant="custom" className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
          Custom gradient text
        </GradientText>
      </div>

      <Blockquote>
        This is a blockquote. It's useful for quoting text from other sources or highlighting important statements.
      </Blockquote>

      <div>
        This is a sentence with <Code>inline code</Code> in it.
      </div>

      <SectionTitle
        badge={<span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">New</span>}
        title="Section Title Example"
        subtitle="This is a subtitle that provides more context about this section."
      />
    </div>
  )
}
