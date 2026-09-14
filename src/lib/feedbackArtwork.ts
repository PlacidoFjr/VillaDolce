import type { FeedbackEntry } from "@/lib/feedbackStore";

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
  context.fill();
}

function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (context.measureText(candidate).width <= maxWidth || !currentLine) {
      currentLine = candidate;
      return;
    }
    lines.push(currentLine);
    currentLine = word;
  });

  if (currentLine) lines.push(currentLine);
  return lines;
}

async function loadLogo(): Promise<HTMLImageElement> {
  const image = new Image();
  image.src = "/assets/logo-villa-dolce.jpeg";
  await image.decode();
  return image;
}

function canvasToPng(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }

      reject(new Error("Não foi possível preparar a imagem do Story."));
    }, "image/png");
  });
}

function feedbackFilename(name: string) {
  const safeName = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `feedback-villa-dolce-${safeName || "cliente"}.png`;
}

export async function downloadFeedbackStory(feedback: FeedbackEntry) {
  await document.fonts.ready;

  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;
  const context = canvas.getContext("2d");
  if (!context) return;

  context.fillStyle = "#fbf5ec";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = "rgba(184, 138, 67, 0.42)";
  context.lineWidth = 2;
  context.strokeRect(54, 54, 972, 1812);
  context.strokeRect(72, 72, 936, 1776);

  const logo = await loadLogo();
  context.save();
  context.beginPath();
  context.arc(540, 230, 112, 0, Math.PI * 2);
  context.clip();
  context.drawImage(logo, 428, 118, 224, 224);
  context.restore();

  context.textAlign = "center";
  context.fillStyle = "#b88a43";
  context.font = "600 28px Inter, Arial";
  context.fillText("MURAL DE CARINHO", 540, 410);

  context.fillStyle = "#3b2114";
  context.font = "700 84px 'Cormorant Garamond', Georgia";
  context.fillText("Feedback que amamos", 540, 505);

  context.fillStyle = "#fffaf3";
  context.shadowColor = "rgba(59, 33, 20, 0.12)";
  context.shadowBlur = 44;
  context.shadowOffsetY = 20;
  roundedRect(context, 125, 610, 830, 810, 28);
  context.shadowColor = "transparent";

  context.fillStyle = "#b88a43";
  context.font = "700 52px Inter, Arial";
  context.fillText("★".repeat(feedback.rating), 540, 735);

  context.fillStyle = "#3b2114";
  context.font = "600 48px 'Cormorant Garamond', Georgia";
  const lines = wrapText(context, `“${feedback.message}”`, 650).slice(0, 9);
  const lineHeight = 62;
  const messageStart = 845 - Math.max(0, lines.length - 4) * 18;
  lines.forEach((line, index) => context.fillText(line, 540, messageStart + index * lineHeight));

  context.fillStyle = "#3b2114";
  context.font = "700 34px Inter, Arial";
  context.fillText(feedback.name, 540, 1290);
  context.fillStyle = "#7b675d";
  context.font = "500 26px Inter, Arial";
  context.fillText(feedback.product, 540, 1340);

  context.fillStyle = "#3b2114";
  context.font = "700 34px 'Cormorant Garamond', Georgia";
  context.fillText("Villa Dolce Ateliê", 540, 1605);
  context.fillStyle = "#b88a43";
  context.font = "600 24px Inter, Arial";
  context.fillText("@villadolceatelie", 540, 1652);
  context.fillStyle = "#7b675d";
  context.font = "500 22px Inter, Arial";
  context.fillText("Cestas afetivas & delícias artesanais", 540, 1740);

  const blob = await canvasToPng(canvas);
  const filename = feedbackFilename(feedback.name);
  const file = new File([blob], filename, { type: "image/png", lastModified: Date.now() });
  const shareData = { files: [file], title: "Feedback Villa Dolce" };

  if (typeof navigator.share === "function" && navigator.canShare?.(shareData)) {
    try {
      await navigator.share(shareData);
      return;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
    }
  }

  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = filename;
  link.href = objectUrl;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
}
