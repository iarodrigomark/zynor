/**
 * ============================================================================
 * SISTEMA ZYNOR 3D - ARQUIVO 1: BACK-END COMPLETO (Zynor.gs / Código.gs)
 * Funcionalidades:
 *  - Conecta automaticamente à Planilha Google no Drive ("ZYNOR 3D - Catálogo")
 *  - Lê produtos com o índice exato da linha (rowIndex) para permitir edição
 *  - Grava novos produtos e atualiza produtos existentes nas 10 colunas
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// PARÂMETROS CONFIGURÁVEIS
// ----------------------------------------------------------------------------
const ID_PLANILHA = ""; // Deixe vazio "" para usar/criar automaticamente no Drive
const NOME_PLANILHA_AUTO = "ZYNOR 3D - Catálogo";
const NOME_ABA = "Catalogo";

// Estrutura exata das 10 colunas (Linha 1: Colunas A até J)
const CABECALHOS = [
  "Produto",              // Coluna A (índice 0)
  "Cor",                  // Coluna B (índice 1)
  "Categoria",            // Coluna C (índice 2)
  "NCM",                  // Coluna D (índice 3)
  "SKU",                  // Coluna E (índice 4)
  "Unidade Prato",        // Coluna F (índice 5)
  "Peso Total (g)",       // Coluna G (índice 6)
  "Tempo Impressão",      // Coluna H (índice 7) - Formato "Xh YYmin"
  "Preço (Bandeja)",      // Coluna I (índice 8)
  "Preço (Unidade)"       // Coluna J (índice 9)
];

/**
 * 1. Exibe a interface web (Index.html).
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('ZYNOR — Calculadora & Catálogo')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * 2. Localiza ou cria automaticamente a Planilha Google no seu Google Drive.
 */
function obterPlanilhaDestino() {
  if (ID_PLANILHA && ID_PLANILHA.trim() !== "") {
    return SpreadsheetApp.openById(ID_PLANILHA.trim());
  }

  let ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss) return ss;

  const props = PropertiesService.getScriptProperties();
  const idSalvo = props.getProperty("ZYNOR_SHEET_ID");
  if (idSalvo) {
    try {
      return SpreadsheetApp.openById(idSalvo);
    } catch (e) {
      props.deleteProperty("ZYNOR_SHEET_ID");
    }
  }

  ss = SpreadsheetApp.create(NOME_PLANILHA_AUTO);
  props.setProperty("ZYNOR_SHEET_ID", ss.getId());
  return ss;
}

/**
 * 3. Garante que a aba "Catalogo" exista e mantenha os 10 cabeçalhos na Linha 1.
 */
function obterOuCriarAba() {
  const ss = obterPlanilhaDestino();
  let sheet = ss.getSheetByName(NOME_ABA);
  
  if (!sheet) {
    const primeiraAba = ss.getSheets()[0];
    if (primeiraAba && primeiraAba.getLastRow() === 0) {
      primeiraAba.setName(NOME_ABA);
      sheet = primeiraAba;
    } else {
      sheet = ss.insertSheet(NOME_ABA);
    }
  }

  sheet.getRange(1, 1, 1, CABECALHOS.length)
       .setValues([CABECALHOS])
       .setFontWeight("bold")
       .setBackground("#e0f2fe");
  
  return sheet;
}

/**
 * 4. Lê todos os produtos cadastrados (Colunas A até J) + número real da linha.
 */
function obterProdutos() {
  const sheet = obterOuCriarAba();
  const ultimaLinha = sheet.getLastRow();
  
  if (ultimaLinha < 2) return [];

  const dados = sheet.getRange(2, 1, ultimaLinha - 1, CABECALHOS.length).getValues();
  
  return dados.map((linha, idx) => {
    const rowIndex = idx + 2; // Linha real na planilha (começa na linha 2)
    const colunasLimpas = linha.map(celula => {
      if (celula === null || celula === undefined) return "";
      if (celula instanceof Date) return Utilities.formatDate(celula, "GMT-3", "HH:mm");
      return celula;
    });
    return { rowIndex: rowIndex, cols: colunasLimpas };
  });
}

/**
 * 5. Grava um NOVO produto na próxima linha disponível da aba "Catalogo".
 */
function salvarProdutoCompleto(dados) {
  const sheet = obterOuCriarAba();

  const novaLinha = [
    dados.produto,              // A: Produto
    dados.cor,                  // B: Cor
    dados.categoria,            // C: Categoria
    dados.ncm,                  // D: NCM
    dados.sku,                  // E: SKU
    Number(dados.qtdBandeja),   // F: Unidade Prato
    Number(dados.peso),         // G: Peso Total (g)
    dados.tempoFormatado,       // H: Tempo Impressão (ex: "14h 06min")
    Number(dados.precoBandeja), // I: Preço (Bandeja)
    Number(dados.precoUnidade)  // J: Preço (Unidade)
  ];

  sheet.appendRow(novaLinha);
  return obterProdutos();
}

/**
 * 6. ATUALIZA um produto já existente na linha exata (rowIndex) da planilha.
 */
function atualizarProdutoCompleto(rowIndex, dados) {
  const sheet = obterOuCriarAba();
  const linhaAlvo = Number(rowIndex);

  if (!linhaAlvo || linhaAlvo < 2) {
    throw new Error("Linha do produto inválida para atualização.");
  }

  const linhaAtualizada = [
    dados.produto,              // A: Produto
    dados.cor,                  // B: Cor
    dados.categoria,            // C: Categoria
    dados.ncm,                  // D: NCM
    dados.sku,                  // E: SKU
    Number(dados.qtdBandeja),   // F: Unidade Prato
    Number(dados.peso),         // G: Peso Total (g)
    dados.tempoFormatado,       // H: Tempo Impressão (ex: "14h 06min")
    Number(dados.precoBandeja), // I: Preço (Bandeja)
    Number(dados.precoUnidade)  // J: Preço (Unidade)
  ];

  sheet.getRange(linhaAlvo, 1, 1, CABECALHOS.length).setValues([linhaAtualizada]);
  return obterProdutos();
}
