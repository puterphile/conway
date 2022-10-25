import { percentage } from "./percentage";

export default function offset(width: number) {
  const isMobile = window.matchMedia("(max-width: 480px)").matches;

  return percentage(width, isMobile ? 4 : 2);
}
