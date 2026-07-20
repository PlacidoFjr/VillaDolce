export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function whatsappUrl(message: string) {
  return `https://wa.me/557193875356?text=${encodeURIComponent(message)}`;
}
