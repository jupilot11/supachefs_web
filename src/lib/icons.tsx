import {
  BadgeCheck,
  Bike,
  Calendar,
  ChefHat,
  Clock,
  HandCoins,
  Heart,
  MapPin,
  MessageCircle,
  Pause,
  ShieldCheck,
  Star,
  Utensils,
  Wallet,
  type LucideIcon,
} from "lucide-react";

// Contract icon names -> lucide. Unknown names render nothing.
const icons: Record<string, LucideIcon> = {
  heart: Heart,
  wallet: Wallet,
  "chef-hat": ChefHat,
  "shield-check": ShieldCheck,
  star: Star,
  clock: Clock,
  "map-pin": MapPin,
  bike: Bike,
  "message-circle": MessageCircle,
  calendar: Calendar,
  utensils: Utensils,
  "badge-check": BadgeCheck,
  "hand-coins": HandCoins,
  pause: Pause,
};

export function CmsIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = icons[name];
  return Icon ? <Icon className={className} aria-hidden="true" /> : null;
}
