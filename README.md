# 🖨️ ZYNOR 3D — Calculadora de Custos, Catálogo Inteligente e Orçamentos

Sistema web completo desenvolvido em **Google Apps Script**, **HTML5**, **CSS3** e **JavaScript** puro, integrado de forma nativa ao **Google Drive** e **Google Sheets** para gestão de precificação, catálogo técnico e orçamentos de impressão 3D.

---

## 🚀 Funcionalidades Principais

* **Calculadora de Custos 3D em Tempo Real:**
  * Cálculo automático de filamento (`R$/kg` e peso em gramas) e peças por bandeja.
  * Consumo de energia elétrica com botões rápidos de impressoras (`Ender 3 · 120W`, `Bambu A1 · 200W`, `Bambu X1C · 350W`), tarifa por estado e bandeiras tarifárias (`Verde`, `Amarela`, `Vermelha 1`, `Vermelha 2`).
  * Depreciação/desgaste de máquina (`Preço da impressora ÷ Vida útil em horas`).
  * Mão de obra, custos fixos, taxa de falhas (`%`), embalagem/frete (com opção de repasse ou inclusão no custo), margem de lucro e taxas de marketplace/impostos, com gráfico visual *"Para onde vai o preço"*.
* **Cadastro Inteligente (Auto-NCM & SKU):**
  * Seleção de múltiplas cores simultâneas com atualização dinâmica do código SKU.
  * Classificação automática de **Categoria** e **NCM** (otimizado para filamento **PLA**) a partir do nome do produto.
* **Integração Automática com Google Sheets (`Zynor.gs`):**
  * Cria e vincula automaticamente a planilha `ZYNOR 3D - Catálogo` (aba `Catalogo`) no Google Drive sem necessidade de configuração manual de ID.
* **Produtos Cadastrados com Edição Interativa:**
  * Tabela pesquisável por Produto, Cor, Categoria, NCM ou SKU.
  * Exibição do tempo de impressão no formato fiel de **horas e minutos** (`Xh YYmin`).
  * **Edição em 1 clique:** Ao clicar no nome de qualquer produto cadastrado na lista, os dados são carregados de volta para a calculadora e para o formulário, permitindo atualizar a linha exata na planilha Google.
* **Gerador de Orçamento em PDF:**
  * Emissão instantânea de orçamento profissional pronto para impressão ou salvamento em PDF, com cálculo automático de descontos por condição de pagamento.

---

## 📂 Arquitetura dos Arquivos

| Arquivo | Camada | Responsabilidade |
| :--- | :--- | :--- |
| `Zynor.gs` | Back-end (Google Apps Script) | Conecta-se ao Google Drive, cria a planilha `ZYNOR 3D - Catálogo` e gerencia leitura (`obterProdutos`), inserção (`salvarProdutoCompleto`) e edição (`atualizarProdutoCompleto`). |
| `Index.html` | Front-end (HTML/CSS/JS) | Interface responsiva com a Calculadora 3D, formulário de cadastro/edição, inteligência de NCM/SKU, gerador de PDF e tabela de **Produtos Cadastrados**. |
| `README.md` | Documentação | Manual técnico de arquitetura, estrutura de dados e implantação do projeto. |

---

## 🗄️ Estrutura das 10 Colunas (Aba `Catalogo`)

A planilha conectada no Google Drive organiza os registros automaticamente nas seguintes colunas (`A` até `J`):

1. `Produto`
2. `Cor`
3. `Categoria`
4. `NCM`
5. `SKU`
6. `Unidade Prato`
7. `Peso Total (g)`
8. `Tempo Impressão` *(formato `Xh YYmin`)*
9. `Preço (Bandeja)`
10. `Preço (Unidade)`

---

## ⚙️ Parâmetros Configuráveis (`Zynor.gs`)

No topo do arquivo `Zynor.gs`, você pode personalizar o comportamento da conexão com o Google Drive:

```javascript
const ID_PLANILHA = ""; // Deixe vazio "" para criar automaticamente no Drive ou cole o ID de uma planilha existente
const NOME_PLANILHA_AUTO = "ZYNOR 3D - Catálogo"; // Nome do arquivo criado no Google Drive
const NOME_ABA = "Catalogo"; // Nome da aba utilizada para armazenar os produtos
```
