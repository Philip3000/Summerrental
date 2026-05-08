import {
  ChefHat,
  Home,
  Shirt,
  Sparkles,
  Trees,
  Waves,
} from "lucide-react";
import type { ComponentType } from "react";

export type GuideLink = {
  title: string;
  eyebrow: string;
  description: string;
  href: string;
};

export type GuideLinkGroup = {
  title: string;
  description: string;
  links: GuideLink[];
};

export type InventoryGroup = {
  title: string;
  description: string;
  items: string[];
};

export type InventoryIcon = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean;
}>;

export const inventoryIcons: InventoryIcon[] = [
  ChefHat,
  Trees,
  Shirt,
  Home,
  Waves,
  Sparkles,
];
