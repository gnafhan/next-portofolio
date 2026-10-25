"use client";

import type { IconType } from "react-icons";
import { FaSlack } from "react-icons/fa";
import { SiDiscord, SiGmail, SiGooglechat, SiInstagram, SiLine, SiMessenger, SiTelegram, SiWhatsapp } from "react-icons/si";

export const APPS: Record<string, { name: string; Icon: IconType }> = {
  whatsapp: { name: "WhatsApp", Icon: SiWhatsapp },
  gmail: { name: "Email", Icon: SiGmail },
  slack: { name: "Slack", Icon: FaSlack },
  discord: { name: "Discord", Icon: SiDiscord },
  telegram: { name: "Telegram", Icon: SiTelegram },
  instagram: { name: "Instagram", Icon: SiInstagram },
  messenger: { name: "Messenger", Icon: SiMessenger },
  line: { name: "LINE", Icon: SiLine },
  gchat: { name: "Google Chat", Icon: SiGooglechat },
};

export function AppLogo({ app, size = 14, className }: { app: keyof typeof APPS | string; size?: number; className?: string }) {
  const entry = APPS[app];
  if (!entry) return null;
  const { Icon, name } = entry;
  return <Icon size={size} className={className} aria-label={name} />;
}
