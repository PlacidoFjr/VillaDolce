"""Create sequential A5 menu and imposed A4 booklet from client references 3-12."""
from pathlib import Path
import json

import pymupdf
from PIL import Image, ImageOps, ImageDraw
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4, A5, landscape
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "cardapio-livrinho"
OUT.mkdir(parents=True, exist_ok=True)
for name, filename in [("Display", "GARA.TTF"), ("DisplayBold", "GARABD.TTF"),
                       ("Italic", "GARAIT.TTF"), ("Body", "arial.ttf"),
                       ("Bold", "arialbd.ttf"), ("Calligraphy", "FRSCRIPT.TTF"),
                       ("Handwriting", "FREESCPT.TTF")]:
    pdfmetrics.registerFont(TTFont(name, f"C:/Windows/Fonts/{filename}"))

# Values, flavors and pack sizes transcribed from the supplied artwork, not the website.
PAGES = [
    {"title": "Empadas", "items": [
        {"name": "Empada salgada", "price": "10,00", "flavor": "Camarão ou sertaneja"},
        {"name": "Empada salgada", "price": "8,00", "flavor": "Frango ou calabresa"},
        {"name": "Empada doce", "price": "7,00", "flavor": "Leite condensado"}]},
    {"title": "Para acompanhar", "items": [
        {"name": "Sequilho salgado", "price": "8,00", "flavor": "Cebola ou queijo"},
        {"name": "Pastel doce", "price": "10,00", "flavor": "Goiabada", "detail": "Contém 6 unidades"}]},
    {"title": "Mini cake donuts", "dark": True, "items": [
        {"name": "Mini cake donuts", "price": "10,00", "detail": "Contém 4 unidades"},
        {"name": "Mini cake donuts recheado", "price": "14,00", "detail": "Contém 4 unidades"}]},
    {"title": "Delícias no potinho", "dark": True, "items": [
        {"name": "Potinho de amanteigados", "price": "18,00", "detail": "Contém 12 unidades"},
        {"name": "Potinho de recheados", "price": "24,00", "detail": "Contém 6 unidades"}]},
    {"title": "Pipoca gourmet", "items": [
        {"name": "Pipoca gourmet", "price": "14,00", "flavor": "Ninho ou Ovomaltine", "detail": "Pacote ziplock"}]},
    {"title": "Biscoitos", "items": [
        {"name": "Biscoito amanteigado", "price": "14,00", "flavor": "Tradicional ou chocolate", "detail": "Pacote ziplock · Contém 12 unidades"},
        {"name": "Biscoito recheado", "price": "20,00", "flavor": "Brigadeiro, Ninho ou doce de leite", "detail": "Pacote ziplock · Contém 6 unidades"}]},
    {"title": "Empadão", "subtitle": "Marmita de 220 ml", "note": "Encomendas em tamanhos variados: consulte valores.", "items": [
        {"name": "Frango com requeijão", "price": "15,00"},
        {"name": "Costela com requeijão", "price": "18,00"},
        {"name": "Camarão com requeijão", "price": "20,00"}]},
    {"title": "Empadão", "subtitle": "Marmita de 500 ml", "note": "Encomendas em tamanhos variados: consulte valores.", "items": [
        {"name": "Frango com requeijão", "price": "32,00"},
        {"name": "Costela com requeijão", "price": "38,00"},
        {"name": "Camarão com requeijão", "price": "45,00"}]},
    {"title": "Bolo caseirinho", "subtitle": "Com cobertura", "flavor": "Tradicional, chocolate, limão, laranja ou maracujá", "items": [
        {"name": "Pequeno", "price": "35,00", "detail": "6 a 8 fatias"},
        {"name": "Médio", "price": "55,00", "detail": "10 a 12 fatias"},
        {"name": "Grande", "price": "70,00", "detail": "15 a 20 fatias"}],
     "extras": [("Morangos frescos", "7,00"), ("Geleia de morango", "5,00"), ("Nutella", "7,00")]},
    {"title": "Cápsulas de cappuccino", "dark": True, "items": [
        {"name": "2 unidades", "price": "10,00"},
        {"name": "4 unidades", "price": "18,00"}]},
]

W, H = A5
M = 36
LIGHT = "#FAE9D7"
DARK = "#857564"
INK = "#554032"
GOLD = "#A17B50"
pdf_path = OUT / "villa-dolce-cardapio-whatsapp.pdf"
c = canvas.Canvas(str(pdf_path), pagesize=A5)
c.setTitle("Cardápio | Villa Dolce Ateliê")
c.setAuthor("Villa Dolce Ateliê")


def text(x, y, value, font="Body", size=11, color=None, align="left"):
    c.setFillColor(HexColor(color or fg))
    c.setFont(font, size)
    {"left": c.drawString, "right": c.drawRightString, "center": c.drawCentredString}[align](x, y, value)


def wrap(value, font, size, width):
    lines, current = [], ""
    for word in value.split():
        candidate = f"{current} {word}".strip()
        if current and pdfmetrics.stringWidth(candidate, font, size) > width:
            lines.append(current)
            current = word
        else:
            current = candidate
    return lines + [current]


def rule(y):
    c.setStrokeColor(HexColor(fg))
    c.setLineWidth(0.45)
    c.line(M, y, W-M, y)


def base(page, dark=False):
    global fg
    fg = LIGHT if dark else INK
    c.setFillColor(HexColor(DARK if dark else LIGHT))
    c.rect(0, 0, W, H, stroke=0, fill=1)
    text(M, H-35, "VILLA DOLCE ATELIÊ", "Display", 11)
    text(W-M, H-35, "CARDÁPIO", "Body", 8, align="right")
    rule(H-48)
    text(M, 28, "@villadolceatelie", size=8)
    text(W-M, 28, f"{page:02d} / 12", size=8, align="right")
    c.linkURL("https://www.instagram.com/villadolceatelie/", (M, 22, M+130, 40))


base(1)
c.drawImage(str(ROOT / "output/pdf/logo-villa-dolce-transparente.png"),
            (W-214)/2, 303, 214, 214, mask="auto")
text(W/2, 250, "Cardápio", "Calligraphy", 65, align="center")
text(W/2, 222, "Para consumir, celebrar", "Italic", 18, align="center")
text(W/2, 200, "e presentear.", "Italic", 18, align="center")
text(W/2, 115, "Delícias feitas com cuidado.", size=11, align="center")
text(W/2, 96, "Momentos cheios de carinho.", size=11, align="center")
c.showPage()

for index, page in enumerate(PAGES, start=2):
    base(index, page.get("dark", False))
    title_lines = wrap(page["title"], "Calligraphy", 44, W-2*M)
    y = H-103
    for value in title_lines:
        text(M, y, value, "Calligraphy", 44)
        y -= 46
    if page.get("subtitle"):
        text(M, y+2, page["subtitle"], "Body", 12)
        y -= 25
    if page.get("flavor"):
        for value in wrap(page["flavor"], "Handwriting", 21, W-2*M):
            text(M, y+1, value, "Handwriting", 21)
            y -= 24
    y -= 22
    count = len(page["items"])
    step = 99 if count == 3 else 153
    if page.get("extras"):
        step = 70
    for item in page["items"]:
        item_font = "Handwriting" if page["title"] == "Empadão" else "Display"
        item_size = 25 if page["title"] == "Empadão" else 21
        lines = wrap(item["name"], item_font, item_size, W-2*M-88)
        for i, value in enumerate(lines):
            text(M, y-i*24, value, item_font, item_size)
        text(W-M, y, f"R$ {item['price']}", "Body", 15, align="right")
        bottom = y-(len(lines)-1)*24-15
        rule(bottom)
        detail_y = bottom-23
        if item.get("flavor"):
            for value in wrap(item["flavor"], "Handwriting", 23, W-2*M):
                text(M, detail_y, value, "Handwriting", 23)
                detail_y -= 26
        if item.get("detail"):
            for value in wrap(item["detail"], "Body", 10, W-2*M):
                text(M, detail_y, value, size=10)
                detail_y -= 15
        assert detail_y > 70, (index, item["name"], detail_y)
        y -= max(step, (len(lines)-1)*24 + (bottom-detail_y) + 30)
    if page.get("extras"):
        y -= 1
        text(M, y, "Adicionais", "Calligraphy", 26)
        y -= 23
        for name, price in page["extras"]:
            text(M, y, name, size=10)
            text(W-M, y, f"R$ {price}", size=10, align="right")
            y -= 19
        assert y > 65, ("extras", y)
    note = page.get("note", "Aceitamos encomendas. Consulte valores.")
    text(W/2, 58, note, size=8.2, align="center")
    c.showPage()

base(12)
c.drawImage(str(ROOT / "output/pdf/logo-villa-dolce-transparente.png"),
            (W-155)/2, 365, 155, 155, mask="auto")
text(W/2, 326, "Seu próximo momento", "Calligraphy", 37, align="center")
text(W/2, 287, "pode ser mais doce.", "Calligraphy", 37, align="center")
for i, value in enumerate(["Para encomendas e tamanhos especiais,",
                           "consulte opções e disponibilidade."]):
    text(W/2, 245-i*19, value, size=11, align="center")
text(W/2, 160, "@villadolceatelie", "Bold", 13, align="center")
text(W/2, 135, "villa-dolce.vercel.app", size=11, align="center")
c.linkURL("https://villa-dolce.vercel.app/catalogo", (80, 122, W-80, 150))
text(W/2, 81, "Feito com carinho, do primeiro ao último detalhe.", "Italic", 12, align="center")
c.showPage()
c.save()

# Imposition: outer sheets first, two upright A5 pages on each landscape A4 side.
source = pymupdf.open(pdf_path)
assert len(source) == 12
imposed = pymupdf.open()
PW, PH = landscape(A4)
pairs = []
for sheet in range(3):
    pairs.extend([(11-2*sheet, 2*sheet), (2*sheet+1, 10-2*sheet)])
for left, right in pairs:
    dest = imposed.new_page(width=PW, height=PH)
    dest.draw_rect(dest.rect, color=None, fill=pymupdf.sRGB_to_pdf(int(LIGHT[1:], 16)))
    for slot, pno in enumerate((left, right)):
        dest.show_pdf_page(pymupdf.Rect(slot*PW/2, 0, (slot+1)*PW/2, PH), source, pno)
imposed.save(OUT / "villa-dolce-cardapio-impressao-livreto.pdf", deflate=True)
imposed[0].get_pixmap(dpi=70).save(OUT / "previa-impressao.png")

# Validate every extracted text span is inside its page and all supplied prices survived export.
for page in source:
    for block in page.get_text("dict")["blocks"]:
        for ln in block.get("lines", []):
            for span in ln["spans"]:
                assert page.rect.contains(pymupdf.Rect(span["bbox"])), span["text"]
for index, page in enumerate(PAGES, start=1):
    extracted = source[index].get_text()
    for item in page["items"]:
        assert f"R$ {item['price']}" in extracted

thumbs = []
for index, page in enumerate(source):
    preview = page.get_pixmap(dpi=90).pil_image().convert("RGB")
    if index in (0, 1, 6, 9):
        preview.save(OUT / f"previa-pagina-{index+1:02d}.jpg", quality=90)
    thumb = ImageOps.contain(preview, (280, 396))
    thumbs.append(thumb)
sheet = Image.new("RGB", (4*300, 3*430), "#FFFFFF")
draw = ImageDraw.Draw(sheet)
for i, thumb in enumerate(thumbs):
    x, y = (i % 4)*300+10, (i//4)*430+10
    sheet.paste(thumb, (x, y))
    draw.text((x, y+400), f"{i+1:02d}", fill="#554032")
sheet.save(OUT / "visao-geral.jpg", quality=90)
(OUT / "conteudo-cardapio.json").write_text(json.dumps(PAGES, ensure_ascii=False, indent=2), encoding="utf-8")
print("Verified: 12 sequential A5 pages, 6 imposed A4 sides (3 sheets), 26 priced variations.")
print("Imposition:", [(a+1, b+1) for a, b in pairs])
