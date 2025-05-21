import { cn } from "@/lib/utils"

type ColorSwatch = {
  name: string
  variable: string
  hex?: string
  className?: string
}

type ColorGroup = {
  title: string
  description?: string
  colors: ColorSwatch[]
}

const colorGroups: ColorGroup[] = [
  {
    title: "Primary (Amber/Gold)",
    description: "Our primary brand color, representing the bumblebee's yellow coloring",
    colors: [
      { name: "Primary", variable: "--primary" },
      { name: "Primary Light", variable: "--primary-light" },
      { name: "Primary Dark", variable: "--primary-dark" },
    ],
  },
  {
    title: "Secondary (Black/Dark Gray)",
    description: "Our secondary color, representing the bumblebee's stripes",
    colors: [
      { name: "Secondary", variable: "--secondary" },
      { name: "Secondary Light", variable: "--secondary-light" },
      { name: "Secondary Dark", variable: "--secondary-dark" },
    ],
  },
  {
    title: "Accent (Honey-Amber)",
    description: "Our accent color, representing honey and adding warmth to our palette",
    colors: [
      { name: "Accent", variable: "--accent" },
      { name: "Accent Light", variable: "--accent-light" },
      { name: "Accent Dark", variable: "--accent-dark" },
    ],
  },
  {
    title: "UI Colors",
    description: "Colors used for various UI elements and states",
    colors: [
      { name: "Background", variable: "--background" },
      { name: "Foreground", variable: "--foreground" },
      { name: "Card", variable: "--card" },
      { name: "Card Foreground", variable: "--card-foreground" },
      { name: "Muted", variable: "--muted" },
      { name: "Muted Foreground", variable: "--muted-foreground" },
      { name: "Border", variable: "--border" },
    ],
  },
  {
    title: "Semantic Colors",
    description: "Colors that convey specific meanings",
    colors: [
      { name: "Success", variable: "--success" },
      { name: "Warning", variable: "--warning" },
      { name: "Destructive", variable: "--destructive" },
      { name: "Info", variable: "--info" },
    ],
  },
]

function ColorSwatch({ color }: { color: ColorSwatch }) {
  return (
    <div className="flex flex-col">
      <div
        className={cn(
          "h-16 rounded-md mb-2 shadow-sm border border-border/50",
          color.className || `bg-[hsl(var(${color.variable}))]`,
        )}
      />
      <div className="text-sm font-medium">{color.name}</div>
      <div className="text-xs text-muted-foreground font-mono">var({color.variable})</div>
      {color.hex && <div className="text-xs text-muted-foreground font-mono">{color.hex}</div>}
    </div>
  )
}

function ColorGroup({ group }: { group: ColorGroup }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{group.title}</h3>
        {group.description && <p className="text-sm text-muted-foreground">{group.description}</p>}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {group.colors.map((color) => (
          <ColorSwatch key={color.variable} color={color} />
        ))}
      </div>
    </div>
  )
}

export function ColorPalette() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Bumblebee Color Palette</h2>
        <p className="text-muted-foreground">
          Our color system is designed to reflect the bumblebee theme with amber/gold, black, and honey tones while
          maintaining accessibility across light and dark modes.
        </p>
      </div>

      <div className="space-y-8">
        {colorGroups.map((group) => (
          <ColorGroup key={group.title} group={group} />
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Gradient Examples</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="h-24 rounded-md bg-gradient-to-r from-primary to-primary-dark flex items-center justify-center text-primary-foreground font-medium">
            Primary Gradient
          </div>
          <div className="h-24 rounded-md bg-gradient-to-r from-secondary to-secondary-dark flex items-center justify-center text-secondary-foreground font-medium">
            Secondary Gradient
          </div>
          <div className="h-24 rounded-md bg-gradient-to-r from-accent to-accent-dark flex items-center justify-center text-accent-foreground font-medium">
            Accent Gradient
          </div>
          <div className="h-24 rounded-md bg-gradient-bumblebee flex items-center justify-center text-white font-medium">
            Bumblebee Gradient
          </div>
          <div className="h-24 rounded-md bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400 flex items-center justify-center text-white font-medium">
            Gold Gradient
          </div>
          <div className="h-24 rounded-md bg-gradient-bee-stripes flex items-center justify-center text-white font-medium">
            Bee Stripes
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Theme Application Examples</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg border border-border p-6 space-y-4">
            <h4 className="text-xl font-semibold">Button Examples</h4>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary-dark">
                Primary Button
              </button>
              <button className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary-dark">
                Secondary Button
              </button>
              <button className="px-4 py-2 rounded-md bg-accent text-accent-foreground hover:bg-accent-dark">
                Accent Button
              </button>
              <button className="px-4 py-2 rounded-md border border-primary text-primary hover:bg-primary-light">
                Outline Button
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-border p-6 space-y-4">
            <h4 className="text-xl font-semibold">Card Examples</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-md bg-primary-light text-primary-light-foreground">Primary Light Card</div>
              <div className="p-4 rounded-md bg-secondary text-secondary-foreground">Secondary Card</div>
              <div className="p-4 rounded-md bg-accent-light text-accent-light-foreground">Accent Light Card</div>
              <div className="p-4 rounded-md bg-gradient-bumblebee text-white">Gradient Card</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ColorDemo() {
  return <ColorPalette />
}
