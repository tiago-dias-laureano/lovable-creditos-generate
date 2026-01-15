// Service Worker para a extensão
// Mantém a extensão ativa e gerencia eventos em background

chrome.runtime.onInstalled.addListener(() => {
  console.log("LOVABLE CREDITS GENERATOR instalada com sucesso!");
});

// Listener para mensagens de outras partes da extensão
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "ping") {
    sendResponse({ status: "ok" });
  }
  return true;
});
