# Cardapio em livrinho

## WhatsApp

Enviar `villa-dolce-cardapio-whatsapp.pdf` como documento. Sao 12 paginas A5 em ordem normal, com capa, dez paginas de produtos e contracapa. Nao usar o arquivo de impressao para enviar aos clientes.

## Impressao

`villa-dolce-cardapio-impressao-livreto.pdf` tem seis faces A4 em paisagem, para tres folhas frente e verso. As paginas ja estao organizadas para dobrar ao meio e formar um livreto A5.

- Papel A4, paisagem, tamanho real / 100%.
- Uma pagina do PDF por face da folha.
- Frente e verso com virada na borda curta.
- NAO ativar novamente o modo livreto da impressora.
- Testar primeiro a folha externa (faces 1 e 2 do PDF) antes de imprimir tudo.
- Dobrar as tres folhas ao meio e encaixar: folha externa 12/1, intermediaria 10/3 e interna 8/5. As outras faces sao 2/11, 4/9 e 6/7.
- Impressoras sem impressao sem bordas podem deixar margem branca. Para acabamento profissional com sangria, pedir uma versao especifica para a grafica.

## Conteudo

Produtos, sabores, quantidades e valores transcritos das dez referencias fornecidas (3.png a 12.png). Valores padronizados como R$ 0,00. O material nao inclui automaticamente os outros produtos do site que nao constam dessas referencias. Nenhum preco do site foi alterado.

`conteudo-cardapio.json` registra o conteudo exportado. Para alterar e regenerar, editar PAGES em `scripts/create_menu_booklet.py` e executar `python scripts/create_menu_booklet.py` na raiz do projeto. O JSON e uma saida, nao a entrada do gerador.

Dependencias: reportlab, pymupdf, pypdf (gerador anterior), Pillow; fontes Garamond e Arial do Windows. A logo PNG transparente e compartilhada com o cardapio anterior em output/pdf.
