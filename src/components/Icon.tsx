import {
  AudioLines,
  Award,
  BookMarked,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Flame,
  Footprints,
  Headphones,
  LayoutDashboard,
  ListChecks,
  Mic,
  RefreshCw,
  RotateCcw,
  Sparkles,
  SpellCheck,
  Star,
  Timer,
  Trophy,
  User,
  Users,
  type LucideProps,
} from "lucide-react";

export const ICONS = {
  Headphones,
  BookOpen,
  RotateCcw,
  SpellCheck,
  RefreshCw,
  BookMarked,
  Mic,
  Sparkles,
  AudioLines,
  Footprints,
  CheckCircle2,
  Flame,
  Star,
  Trophy,
  Timer,
  CalendarCheck,
  LayoutDashboard,
  ListChecks,
  CalendarDays,
  Users,
  Award,
  User,
} as const;

export type IconName = keyof typeof ICONS;

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Component = ICONS[name];
  return <Component {...props} />;
}
