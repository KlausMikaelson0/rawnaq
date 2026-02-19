"use strict";

(function initSite() {
  const config = window.STORE_CONFIG || {
    name: "رونق",
    tagline: "عطور فاخرة بصياغة خليجية",
    currency: "ريال",
    contact: { email: "", phone: "", whatsapp: "#", location: "" },
    business: { shippingNote: "", paymentNote: "", qualityNote: "" }
  };

  const page = document.body?.dataset?.page || "";

  function applyBrandText() {
    document.querySelectorAll("[data-store-name]").forEach((el) => {
      el.textContent = config.name;
    });
    document.querySelectorAll("[data-store-tagline]").forEach((el) => {
      el.textContent = config.tagline;
    });
    document.querySelectorAll("[data-store-email]").forEach((el) => {
      el.textContent = config.contact.email;
    });
    document.querySelectorAll("[data-store-phone]").forEach((el) => {
      el.textContent = config.contact.phone;
    });
    document.querySelectorAll("[data-store-location]").forEach((el) => {
      el.textContent = config.contact.location;
    });
    document.querySelectorAll("[data-store-whatsapp]").forEach((el) => {
      if (el.tagName.toLowerCase() === "a") {
        el.setAttribute("href", config.contact.whatsapp);
      } else {
        el.textContent = config.contact.whatsapp;
      }
    });
    document.querySelectorAll("[data-store-shipping-note]").forEach((el) => {
      el.textContent = config.business.shippingNote;
    });
    document.querySelectorAll("[data-store-payment-note]").forEach((el) => {
      el.textContent = config.business.paymentNote;
    });
    document.querySelectorAll("[data-store-quality-note]").forEach((el) => {
      el.textContent = config.business.qualityNote;
    });
    document.querySelectorAll("[data-current-year]").forEach((el) => {
      el.textContent = String(new Date().getFullYear());
    });
  }

  function applyMetaBranding() {
    const titleTemplate = document.body?.dataset?.titleTemplate;
    if (titleTemplate) {
      document.title = titleTemplate.replaceAll("{store}", config.name);
    }

    const descriptionTemplate = document.body?.dataset?.descriptionTemplate;
    if (descriptionTemplate) {
      const descriptionMeta = document.querySelector('meta[name="description"]');
      if (descriptionMeta) {
        descriptionMeta.setAttribute(
          "content",
          descriptionTemplate.replaceAll("{store}", config.name)
        );
      }
    }
  }

  function navLinkClass(targetPage) {
    return targetPage === page ? "nav-link active" : "nav-link";
  }

  function renderHeaderFooter() {
    const headerRoot = document.getElementById("site-header");
    const footerRoot = document.getElementById("site-footer");

    if (headerRoot) {
      headerRoot.innerHTML = `
        <header class="site-header">
          <div class="container header-inner">
            <a class="brand" href="index.html" aria-label="العودة إلى الرئيسية">
              <img src="assets/brand/logo-icon.svg" alt="شعار ${config.name}" class="brand-logo" />
              <div class="brand-text">
                <strong data-store-name>${config.name}</strong>
                <span data-store-tagline>${config.tagline}</span>
              </div>
            </a>
            <button id="mobileMenuToggle" class="mobile-toggle" aria-label="فتح القائمة">☰</button>
            <nav id="mainNav" class="main-nav" aria-label="القائمة الرئيسية">
              <a class="${navLinkClass("home")}" href="index.html">الرئيسية</a>
              <a class="${navLinkClass("products")}" href="products.html">المنتجات</a>
              <a class="${navLinkClass("about")}" href="about.html">من نحن</a>
              <a class="${navLinkClass("contact")}" href="contact.html">تواصل معنا</a>
            </nav>
            <a class="btn btn-gold header-cta" href="products.html">تسوق الآن</a>
          </div>
        </header>
      `;
    }

    if (footerRoot) {
      footerRoot.innerHTML = `
        <footer class="site-footer">
          <div class="container footer-grid">
            <section>
              <h3>عن <span data-store-name>${config.name}</span></h3>
              <p>
                متجر عطور فاخر جاهز للتشغيل الفوري في السوق الخليجي، بتجربة شراء راقية وهوية
                بصرية احترافية قابلة لنقل الملكية بالكامل.
              </p>
            </section>
            <section>
              <h3>روابط مهمة</h3>
              <ul class="footer-links">
                <li><a href="privacy.html">سياسة الخصوصية</a></li>
                <li><a href="terms.html">الشروط والأحكام</a></li>
                <li><a href="returns.html">سياسة الاسترجاع</a></li>
                <li><a href="contact.html">تواصل معنا</a></li>
              </ul>
            </section>
            <section>
              <h3>بيانات التواصل</h3>
              <ul class="footer-contact">
                <li><strong>البريد:</strong> <span data-store-email>${config.contact.email}</span></li>
                <li><strong>الهاتف:</strong> <span data-store-phone>${config.contact.phone}</span></li>
                <li><strong>المدينة:</strong> <span data-store-location>${config.contact.location}</span></li>
                <li><a class="footer-whatsapp" data-store-whatsapp href="${config.contact.whatsapp}">واتساب مباشر</a></li>
              </ul>
            </section>
          </div>
          <div class="container footer-bottom">
            <p>© <span data-current-year></span> <span data-store-name>${config.name}</span>. جميع الحقوق محفوظة.</p>
          </div>
        </footer>
      `;
    }
  }

  function initMobileMenu() {
    const toggle = document.getElementById("mobileMenuToggle");
    const nav = document.getElementById("mainNav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  }

  function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;
    const status = document.getElementById("formStatus");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (status) {
        status.textContent = `تم استلام رسالتك بنجاح. سيتواصل معك فريق ${config.name} خلال وقت قصير.`;
      }
      form.reset();
    });
  }

  function initFaq() {
    document.querySelectorAll(".faq-item").forEach((item) => {
      const button = item.querySelector(".faq-question");
      if (!button) return;
      button.addEventListener("click", () => {
        item.classList.toggle("open");
      });
    });
  }

  window.formatCurrency = function formatCurrency(value) {
    return `${value.toLocaleString("ar-SA")} ${config.currency}`;
  };

  window.getStoreConfig = function getStoreConfig() {
    return config;
  };

  renderHeaderFooter();
  applyBrandText();
  applyMetaBranding();
  initMobileMenu();
  initContactForm();
  initFaq();
})();
