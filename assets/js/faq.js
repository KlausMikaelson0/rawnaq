"use strict";

(function initFaqPage() {
  if (document.body?.dataset?.page !== "faq") return;
  const root = document.getElementById("faqPageList");
  if (!root || !window.PublicAPI) return;

  const language = window.getCurrentLanguage ? window.getCurrentLanguage() : "ar";
  const status = document.getElementById("faqStatus");

  function setStatus(message) {
    if (status) status.textContent = message || "";
  }

  function bindAccordion() {
    root.querySelectorAll(".faq-item").forEach((item) => {
      const button = item.querySelector(".faq-question");
      if (!button) return;
      button.addEventListener("click", () => {
        item.classList.toggle("open");
      });
    });
  }

  async function render() {
    setStatus("");
    const items = await window.PublicAPI.getFaqs(language);
    if (!items.length) {
      root.innerHTML = `
        <div class="empty-state">
          <h3>No FAQs available</h3>
        </div>
      `;
      return;
    }
    root.innerHTML = items
      .map((item) => {
        const question =
          language === "en" ? item.question.en : item.question.ar;
        const answer = language === "en" ? item.answer.en : item.answer.ar;
        return `
          <article class="faq-item">
            <button class="faq-question">${question}</button>
            <p class="faq-answer">${answer}</p>
          </article>
        `;
      })
      .join("");
    bindAccordion();
  }

  render().catch((error) => {
    setStatus(error.message || "Unable to load FAQs.");
  });
})();
