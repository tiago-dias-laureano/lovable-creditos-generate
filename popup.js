// Elementos do DOM
const replicateBtn = document.getElementById("replicateBtn");
const openModalBtn = document.getElementById("openModalBtn");
const publishBtn = document.getElementById("publishBtn");
const replicateCount = document.getElementById("replicateCount");
const replicateStatus = document.getElementById("replicateStatus");
const modalStatus = document.getElementById("modalStatus");
const publishStatus = document.getElementById("publishStatus");

// Função para mostrar status
function showStatus(element, message, type) {
  element.textContent = message;
  element.className = `status ${type}`;
  setTimeout(() => {
    element.className = "status";
  }, 5000);
}

// 1. Replicar Abas
replicateBtn.addEventListener("click", async () => {
  const count = parseInt(replicateCount.value);

  if (count < 1 || count > 50) {
    showStatus(
      replicateStatus,
      "❌ Por favor, insira um número entre 1 e 50",
      "error"
    );
    return;
  }

  try {
    replicateBtn.disabled = true;
    showStatus(replicateStatus, "⏳ Replicando abas...", "info");

    const [currentTab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    const promises = [];
    for (let i = 0; i < count; i++) {
      promises.push(
        chrome.tabs.create({
          url: currentTab.url,
          active: false,
        })
      );
    }

    await Promise.all(promises);

    showStatus(
      replicateStatus,
      `✅ ${count} aba(s) criada(s) com sucesso!`,
      "success"
    );
  } catch (error) {
    showStatus(replicateStatus, `❌ Erro: ${error.message}`, "error");
  } finally {
    replicateBtn.disabled = false;
  }
});

// Função auxiliar para verificar se a URL é acessível
function isAccessibleUrl(url) {
  if (!url) return false;
  const protectedPrefixes = [
    "chrome://",
    "chrome-extension://",
    "edge://",
    "about:",
    "data:",
    "file://",
  ];
  return !protectedPrefixes.some((prefix) => url.startsWith(prefix));
}

// 2. Abrir Modal de Publish
openModalBtn.addEventListener("click", async () => {
  try {
    openModalBtn.disabled = true;
    showStatus(modalStatus, "⏳ Abrindo modais...", "info");

    const tabs = await chrome.tabs.query({ currentWindow: true });
    const accessibleTabs = tabs.filter((tab) => isAccessibleUrl(tab.url));

    if (accessibleTabs.length === 0) {
      showStatus(modalStatus, "⚠️ Nenhuma aba acessível encontrada", "error");
      openModalBtn.disabled = false;
      return;
    }

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = tabs.length - accessibleTabs.length;

    for (const tab of accessibleTabs) {
      try {
        const result = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            function getElementByXPath(xpath) {
              return document.evaluate(
                xpath,
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
              ).singleNodeValue;
            }

            const xpath =
              "/html/body/div[2]/div/div[2]/nav/div/div/div/div[2]/div[3]/div/button[2]";
            let button = getElementByXPath(xpath);

            if (!button) {
              button = document.querySelector("#publish-menu");
            }

            if (button) {
              button.click();
              button.dispatchEvent(
                new MouseEvent("click", { bubbles: true, cancelable: true })
              );
              button.dispatchEvent(
                new MouseEvent("mousedown", { bubbles: true, cancelable: true })
              );
              button.dispatchEvent(
                new MouseEvent("mouseup", { bubbles: true, cancelable: true })
              );
              button.dispatchEvent(
                new PointerEvent("pointerdown", {
                  bubbles: true,
                  cancelable: true,
                  pointerId: 1,
                })
              );
              button.dispatchEvent(
                new PointerEvent("pointerup", {
                  bubbles: true,
                  cancelable: true,
                  pointerId: 1,
                })
              );

              return { success: true, found: true };
            }

            return { success: false, found: false };
          },
        });

        if (result?.[0]?.result?.found) {
          successCount++;
        } else {
          errorCount++;
        }

        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch {
        errorCount++;
      }
    }

    let message = "";
    if (errorCount === 0 && skippedCount === 0) {
      message = `✅ Modal aberto em ${successCount} aba(s)!`;
      showStatus(modalStatus, message, "success");
    } else if (skippedCount > 0) {
      message = `✅ ${successCount} sucesso(s) | ${skippedCount} aba(s) protegida(s) ignorada(s)`;
      showStatus(modalStatus, message, "success");
    } else {
      message = `⚠️ ${successCount} sucesso(s), ${errorCount} erro(s)`;
      showStatus(modalStatus, message, "info");
    }
  } catch (error) {
    showStatus(modalStatus, `❌ Erro: ${error.message}`, "error");
  } finally {
    openModalBtn.disabled = false;
  }
});

// 3. Clicar em Publish (botão dentro do modal)
publishBtn.addEventListener("click", async () => {
  try {
    publishBtn.disabled = true;
    showStatus(publishStatus, "⏳ Publicando...", "info");

    const tabs = await chrome.tabs.query({ currentWindow: true });
    const accessibleTabs = tabs.filter((tab) => isAccessibleUrl(tab.url));

    if (accessibleTabs.length === 0) {
      showStatus(publishStatus, "⚠️ Nenhuma aba acessível encontrada", "error");
      publishBtn.disabled = false;
      return;
    }

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = tabs.length - accessibleTabs.length;

    for (const tab of accessibleTabs) {
      try {
        const result = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            function getElementByXPath(xpath) {
              return document.evaluate(
                xpath,
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
              ).singleNodeValue;
            }

            const xpath = "/html/body/div[3]/div/div[3]/div/div/button[2]";
            let publishButton = getElementByXPath(xpath);

            if (!publishButton) {
              const buttons = document.querySelectorAll("button");
              for (const btn of buttons) {
                const text = btn.textContent.trim();
                const isInsideModal =
                  btn.closest('[role="dialog"]') ||
                  btn.closest(".modal") ||
                  btn.closest('[class*="modal"]') ||
                  btn.closest('[class*="dialog"]');

                if (text.includes("Publish") && isInsideModal) {
                  publishButton = btn;
                  break;
                }
              }
            }

            if (publishButton) {
              publishButton.click();
              return { success: true, found: true };
            }

            return { success: false, found: false };
          },
        });

        if (result?.[0]?.result?.found) {
          successCount++;
        } else {
          errorCount++;
        }

        await new Promise((resolve) => setTimeout(resolve, 150));
      } catch {
        errorCount++;
      }
    }

    let message = "";
    if (errorCount === 0 && skippedCount === 0) {
      message = `✅ Publicado em ${successCount} aba(s)!`;
      showStatus(publishStatus, message, "success");
    } else if (skippedCount > 0) {
      message = `✅ ${successCount} sucesso(s) | ${skippedCount} aba(s) protegida(s) ignorada(s)`;
      showStatus(publishStatus, message, "success");
    } else {
      message = `⚠️ ${successCount} sucesso(s), ${errorCount} erro(s)`;
      showStatus(publishStatus, message, "info");
    }
  } catch (error) {
    showStatus(publishStatus, `❌ Erro: ${error.message}`, "error");
  } finally {
    publishBtn.disabled = false;
  }
});
