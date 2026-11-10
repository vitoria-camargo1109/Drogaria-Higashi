document.addEventListener("DOMContentLoaded", function () {
  // 1. Controle de Tema (Modo Claro / Modo Escuro)
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const currentTheme = localStorage.getItem("theme") || "light";

  if (currentTheme === "dark") {
    document.body.classList.replace("light-theme", "dark-theme");
    themeToggleBtn.textContent = "Alternar Modo Claro";
  }

  themeToggleBtn.addEventListener("click", function () {
    if (document.body.classList.contains("light-theme")) {
      document.body.classList.replace("light-theme", "dark-theme");
      themeToggleBtn.textContent = "Alternar Modo Claro";
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.replace("dark-theme", "light-theme");
      themeToggleBtn.textContent = "Alternar Modo Escuro";
      localStorage.setItem("theme", "light");
    }
  });

  // 2. Busca e Filtro em Tempo Real (Filtragem por Tabela, Coluna e Descrição)
  const searchInput = document.getElementById("searchInput");
  const tableCards = document.querySelectorAll(".table-card");

  searchInput.addEventListener("input", function () {
    const filter = searchInput.value.toLowerCase().trim();

    tableCards.forEach(function (card) {
      const tableName = card.querySelector(".table-name").textContent.toLowerCase();
      const tableDesc = card.querySelector(".table-desc").textContent.toLowerCase();
      const rows = card.querySelectorAll("tbody tr");
      let tableHasMatch = false;

      // Se o filtro bate com o cabeçalho ou descrição da tabela, exibe tudo
      if (tableName.includes(filter) || tableDesc.includes(filter)) {
        tableHasMatch = true;
        rows.forEach(function (row) {
          row.style.display = "";
        });
      } else {
        // Se não bate com a tabela, verifica linha a linha
        rows.forEach(function (row) {
          const rowText = row.textContent.toLowerCase();
          if (rowText.includes(filter)) {
            row.style.display = "";
            tableHasMatch = true;
          } else {
            row.style.display = "none";
          }
        });
      }

      // Exibe ou oculta o cartão completo da tabela
      if (tableHasMatch) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  });

  // 3. Modal e Visualizador Panzoom do DER
  const openDerModalBtn = document.getElementById("openDerModalBtn");
  const closeDerModalBtn = document.getElementById("closeDerModalBtn");
  const derModal = document.getElementById("derModal");
  const derImage = document.getElementById("derImage");
  const zoomInBtn = document.getElementById("zoomInBtn");
  const zoomOutBtn = document.getElementById("zoomOutBtn");
  const zoomResetBtn = document.getElementById("zoomResetBtn");

  let panzoomInstance = null;

  // Inicializa o Panzoom se a biblioteca externa CDN for carregada com sucesso
  if (typeof Panzoom !== "undefined") {
    panzoomInstance = Panzoom(derImage, {
      maxScale: 6,
      minScale: 0.5,
      contain: "outside",
      cursor: "grab"
    });

    // Permite zoom usando a roda do mouse (scroll)
    derImage.parentElement.addEventListener("wheel", panzoomInstance.zoomWithWheel);

    zoomInBtn.addEventListener("click", panzoomInstance.zoomIn);
    zoomOutBtn.addEventListener("click", panzoomInstance.zoomOut);
    zoomResetBtn.addEventListener("click", panzoomInstance.reset);
  }

  function openModal() {
    derModal.style.display = "flex";
    if (panzoomInstance) {
      setTimeout(function () {
        panzoomInstance.reset();
      }, 50);
    }
  }

  function closeModal() {
    derModal.style.display = "none";
  }

  openDerModalBtn.addEventListener("click", openModal);
  closeDerModalBtn.addEventListener("click", closeModal);

  // Fecha o modal ao clicar fora da área de diálogo
  derModal.addEventListener("click", function (event) {
    if (event.target === derModal) {
      closeModal();
    }
  });

  // Fecha o modal ao pressionar a tecla ESC
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && derModal.style.display === "flex") {
      closeModal();
    }
  });
});