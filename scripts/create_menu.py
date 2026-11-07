"""Build the printable and WhatsApp menu without changing the website."""
from pathlib import Path

import pymupdf
from pypdf import PdfReader
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf"
OUT.mkdir(parents=True, exist_ok=True)
pdfmetrics.registerFont(TTFont("Garamond", "C:/Windows/Fonts/GARA.TTF"))
pdfmetrics.registerFont(TTFont("GaramondItalic", "C:/Windows/Fonts/GARAIT.TTF"))
pdfmetrics.registerFont(TTFont("Body", "C:/Windows/Fonts/arial.ttf"))
pdfmetrics.registerFont(TTFont("BodyBold", "C:/Windows/Fonts/arialbd.ttf"))

PAPER = HexColor("#FFFCF7")
INK = HexColor("#422719")
GOLD = HexColor("#AC8046")
MUTED = HexColor("#796C60")
RULE = HexColor("#DEC9AE")
pdf_path = OUT / "cardapio-villa-dolce-a4.pdf"
c = canvas.Canvas(str(pdf_path), pagesize=A4)
c.setTitle("Cardápio | Villa Dolce Ateliê")
c.setAuthor("Villa Dolce Ateliê")
W, H = A4
c.setFillColor(PAPER)
c.rect(0, 0, W, H, fill=1, stroke=0)


def text(x, y, value, font="Body", size=10, color=INK):
    c.setFillColor(color)
    c.setFont(font, size)
    c.drawString(x, y, value)


def line(x1, y1, x2, y2, color=RULE, width=0.5):
    c.setStrokeColor(color)
    c.setLineWidth(width)
    c.line(x1, y1, x2, y2)


c.drawImage(str(ROOT / "public/assets/logo-villa-dolce.jpeg"), 39, 675, 110, 110)
text(179, 763, "VILLA DOLCE ATELIÊ", "BodyBold", 10, GOLD)
text(176, 709, "Cardápio", "Garamond", 49)
text(179, 683, "Para consumir, celebrar e presentear.", "GaramondItalic", 13, MUTED)
line(39, 651, W - 39, 651)
text(39, 626, "Delícias feitas com cuidado. Presentes cheios de carinho.", "GaramondItalic", 14)

field_names = []


def section(x, y, title, subtitle, items):
    text(x, y, title, "Garamond", 21)
    text(x, y - 17, subtitle, "Body", 8, MUTED)
    line(x, y - 28, x + 238, y - 28, GOLD)
    y -= 48
    for slug, name in items:
        # Long product names use two lines; the price always keeps its own column.
        size = 10
        available = 172
        words, current, lines = name.split(), "", []
        for word in words:
            candidate = f"{current} {word}".strip()
            if pdfmetrics.stringWidth(candidate, "Body", size) > available:
                lines.append(current)
                current = word
            else:
                current = candidate
        lines.append(current)
        for i, value in enumerate(lines):
            text(x, y - i * 12, value, size=size)
        text(x + 183, y, "R$", size=8, color=MUTED)
        field_names.append(slug)
        c.acroForm.textfield(
            name=slug, tooltip=f"Preço: {name}", x=x + 198, y=y - 4,
            width=40, height=17, fontName="Helvetica", fontSize=10,
            textColor=INK, fillColor=PAPER, borderColor=RULE,
            borderWidth=0.5, borderStyle="underlined", forceBorder=True,
            maxlen=8, value="",
        )
        y -= max(30, len(lines) * 12 + 8)
    return y - 12


left = 39
right = 318
y = section(left, 585, "Doces & chocolates", "Pequenos sabores para grandes momentos.", [
    ("pastelzinho-doce", "Pastelzinho Doce"),
    ("empada-doce", "Empada Doce"),
    ("doces-finos", "Doces Finos"),
    ("trufas", "Trufas"),
    ("capsula-cappuccino", "Cápsula de Cappuccino"),
    ("brownie-bites", "Brownie Bites"),
    ("mega-bombom", "Mega Bombom"),
    ("pipoca-gourmet", "Pipoca Gourmet"),
])
section(left, y, "Biscoitos", "Para acompanhar uma pausa especial.", [
    ("biscoitos-amanteigados", "Biscoitos Amanteigados"),
    ("sequilho-salgado", "Sequilho Salgado"),
])
y = section(right, 585, "Bolos & donuts", "Uma dose de doçura para celebrar.", [
    ("mini-cake-donuts", "Mini Cake Donuts"),
    ("mini-vulcao", "Mini Vulcão"),
    ("mini-bolo-presente", "Mini Bolo para Presente"),
])
y = section(right, y, "Sobremesas", "Clássicos que abraçam o paladar.", [
    ("mousses", "Mousses"),
    ("tortinhas", "Tortinhas"),
    ("pudim", "Pudim"),
])
y = section(right, y, "Salgados", "Sabor para encontros e cafés especiais.", [
    ("empada-salgada", "Empada Salgada"),
])
# Keep gifts compact so all 19 products fit on one A4 sheet.
text(right, y + 4, "Presentes afetivos", "Garamond", 21)
line(right, y - 7, right + 238, y - 7, GOLD)
for offset, (slug, name) in enumerate([
    ("cestas-afetivas", "Cestas Afetivas"),
    ("caixa-presenteavel", "Caixa Presenteável"),
]):
    yy = y - 32 - offset * 35
    text(right, yy, name)
    text(right + 183, yy, "R$", size=8, color=MUTED)
    field_names.append(slug)
    c.acroForm.textfield(name=slug, tooltip=f"Preço: {name}", x=right + 198,
                        y=yy - 4, width=40, height=17, fontName="Helvetica",
                        fontSize=10, textColor=INK, fillColor=PAPER,
                        borderColor=RULE, borderWidth=0.5, borderStyle="underlined",
                        forceBorder=True, maxlen=8, value="")

line(39, 101, W - 39, 101)
text(39, 81, "ENCOMENDAS & INFORMAÇÕES", "BodyBold", 8, GOLD)
text(39, 62, "@villadolceatelie", size=10)
text(318, 81, "Escolha seu carinho. Fale com a gente.", "GaramondItalic", 12)
text(318, 62, "villa-dolce.vercel.app", size=10)
c.linkURL("https://www.instagram.com/villadolceatelie/", (39, 58, 200, 75), relative=0)
c.linkURL("https://villa-dolce.vercel.app/catalogo", (318, 58, 556, 75), relative=0)
text(39, 39, "Consulte sabores, tamanhos, quantidades e disponibilidade para sua encomenda.", size=8, color=MUTED)
c.showPage()
c.save()

reader = PdfReader(pdf_path)
assert len(reader.pages) == 1
fields = reader.get_fields()
assert set(fields) == set(field_names) and len(fields) == 19
assert all(field.get("/V", "") == "" for field in fields.values())
assert all(annot.get_object().get("/AP", {}).get("/N") for annot in reader.pages[0]["/Annots"]
           if annot.get_object().get("/Subtype") == "/Widget")
doc = pymupdf.open(pdf_path)
page = doc[0]
page.get_pixmap(dpi=180).pil_save(str(OUT / "cardapio-villa-dolce-whatsapp.jpg"), quality=95)
page.get_pixmap(dpi=110).save(str(OUT / "cardapio-villa-dolce-preview.png"))
print(f"Created A4 PDF, WhatsApp JPEG and preview; verified {len(fields)} blank price fields.")
