(function () {
  "use strict";

  const root = document.getElementById("nm-interop");
  if (!root) return;

  let currentExampleKey = "flagged";
  let currentLang = "en";

  /* ---------- i18n ---------- */

  function t(path) {
    const parts = path.split(".");
    let node = STRINGS[currentLang];
    for (const p of parts) {
      if (node == null) break;
      node = node[p];
    }
    return node == null ? "" : node;
  }

  function applyStaticI18n() {
    root.querySelectorAll("[data-i18n]").forEach((el) => {
      const value = t(el.dataset.i18n);
      if (el.dataset.i18nHtml !== undefined) el.innerHTML = value;
      else el.textContent = value;
    });

    // A few aria-labels that aren't plain text nodes.
    const ariaMap = [
      [".nm-interop-flow", "flow.ariaLabel"],
      [".nm-interop-flow-boundary", "flow.boundaryAria"],
      [".nm-interop-example-toggle", "contract.exampleAria"],
      [".nm-interop-legend", "contract.sectionsAria"],
      [".nm-interop-tabs", "verify.tabsAria"],
    ];
    ariaMap.forEach(([selector, key]) => {
      const el = root.querySelector(selector);
      if (el) el.setAttribute("aria-label", t(key));
    });

    document.documentElement.lang = currentLang;
  }

  function updateLegendBlurb() {
    const blurb = document.getElementById("nm-interop-legend-blurb");
    if (!blurb) return;
    blurb.textContent = activeSection ? t(`sections.${activeSection}.blurb`) : t("contract.legendDefault");
  }

  function wireLangToggle() {
    const buttons = root.querySelectorAll(".nm-interop-lang-btn");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.dataset.lang === currentLang) return;
        currentLang = btn.dataset.lang;
        buttons.forEach((b) => b.classList.toggle("is-active", b === btn));
        applyStaticI18n();
        updateLegendBlurb();
        runAndRenderVerification();
        try {
          localStorage.setItem("nm-interop-lang", currentLang);
        } catch (e) {
          /* private mode / storage blocked — language just won't persist */
        }
      });
    });
  }

  function initLang() {
    let saved = null;
    try {
      saved = localStorage.getItem("nm-interop-lang");
    } catch (e) {
      /* ignore */
    }
    if (saved === "en" || saved === "fr") currentLang = saved;
    const buttons = root.querySelectorAll(".nm-interop-lang-btn");
    buttons.forEach((b) => b.classList.toggle("is-active", b.dataset.lang === currentLang));
    applyStaticI18n();
  }

  /* ---------- JSON rendering (left panel) ---------- */

  function escapeAngleAmp(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // Classic JSON tokenizer for syntax highlighting. Runs on text that has
  // already had &, <, > escaped — quotes are left literal on purpose so
  // this regex can still find string/key boundaries.
  function syntaxHighlight(escaped) {
    const pattern = /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\btrue\b|\bfalse\b|\bnull\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;
    return escaped.replace(pattern, (match) => {
      let cls = "tok-num";
      if (/^"/.test(match)) cls = /:\s*$/.test(match) ? "tok-key" : "tok-str";
      else if (/true|false/.test(match)) cls = "tok-bool";
      else if (/null/.test(match)) cls = "tok-null";
      return `<span class="${cls}">${match}</span>`;
    });
  }

  const SECTION_ORDER = ["identity", "provenance", "observation", "governance", "integrity"];

  function renderContractHTML(contract) {
    const parts = SECTION_ORDER.map((key, idx) => {
      const json = JSON.stringify(contract[key], null, 2);
      const indented = json.split("\n").map((line, i) => (i === 0 ? line : "  " + line)).join("\n");
      const body = `  "${key}": ${indented}`;
      const comma = idx < SECTION_ORDER.length - 1 ? "," : "";
      const highlighted = syntaxHighlight(escapeAngleAmp(body));
      return `<span class="nm-interop-section-block" data-section="${key}">${highlighted}</span>${comma}`;
    });
    return "{\n" + parts.join("\n") + "\n}";
  }

  function renderJsonPanel() {
    const contract = EXAMPLES[currentExampleKey].contract;
    const container = document.getElementById("nm-interop-json");
    container.innerHTML = `<pre class="nm-interop-json-static"><code>${renderContractHTML(contract)}</code></pre>`;
    applySectionHighlight();
  }

  let activeSection = null;

  function applySectionHighlight() {
    root.querySelectorAll(".nm-interop-section-block").forEach((el) => {
      el.classList.toggle("is-highlighted", el.dataset.section === activeSection);
    });
  }

  function wireLegend() {
    const buttons = root.querySelectorAll(".nm-interop-legend-btn");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const section = btn.dataset.section;
        const isSame = activeSection === section;
        activeSection = isSame ? null : section;
        buttons.forEach((b) => b.classList.toggle("is-active", b.dataset.section === activeSection));
        updateLegendBlurb();
        applySectionHighlight();
      });
    });
  }

  function wireExampleToggle() {
    const buttons = root.querySelectorAll(".nm-interop-example-btn");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        currentExampleKey = btn.dataset.example;
        buttons.forEach((b) => b.classList.toggle("is-active", b === btn));
        renderJsonPanel();
        runAndRenderVerification();
      });
    });
  }

  /* ---------- tabs (right panel) ---------- */

  function wireTabs() {
    const tabs = root.querySelectorAll(".nm-interop-tab");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t2) => {
          t2.classList.toggle("is-active", t2 === tab);
          t2.setAttribute("aria-selected", t2 === tab ? "true" : "false");
        });
        root.querySelectorAll(".nm-interop-tabpanel").forEach((panel) => {
          panel.hidden = panel.dataset.tabpanel !== tab.dataset.tab;
        });
      });
    });
  }

  /* ---------- live verification (terminal) ---------- */

  function setTermLine(check, { status, symbol, detail, live }) {
    const line = root.querySelector(`.nm-interop-term-line[data-check="${check}"]`);
    if (!line) return;
    const statusEl = line.querySelector(".nm-interop-term-status");
    statusEl.dataset.status = status;
    statusEl.textContent = symbol;
    const detailEl = line.querySelector(".nm-interop-term-detail");
    detailEl.textContent = detail;
    if (live) detailEl.dataset.live = "true";
    else delete detailEl.dataset.live;
  }

  async function runAndRenderVerification() {
    const contract = EXAMPLES[currentExampleKey].contract;
    const runStatus = document.getElementById("nm-interop-run-status");
    if (runStatus) runStatus.textContent = t("verify.running");

    let result;
    try {
      result = await runVerification(contract, JWKS);
    } catch (e) {
      if (runStatus) runStatus.textContent = t("verify.runError") + e.message;
      return;
    }

    // Schema — core structural checks
    const passedCount = result.structural.items.filter((i) => i.passed).length;
    const total = result.structural.items.length;
    setTermLine("schema", {
      status: result.structural.passed ? "ok" : "fail",
      symbol: result.structural.passed ? "✓" : "✗",
      detail: `${result.structural.passed ? t("terminal.schemaPassed") : t("terminal.schemaFailed")} — ${passedCount}/${total} (declared ${contract.identity.schema_version})`,
      live: true,
    });

    // SHA-256
    setTermLine("hash", {
      status: result.hash.match ? "ok" : "fail",
      symbol: result.hash.match ? "✓" : "✗",
      detail: result.hash.match ? t("terminal.hashMatch") : t("terminal.hashMismatch").replace("{hash}", result.hash.recomputed.slice(0, 12)),
      live: true,
    });
    const hashScopeEl = document.getElementById("nm-interop-hash-scope-text");
    if (hashScopeEl) hashScopeEl.textContent = t("terminal.hashScopeLive");

    // Signature
    const sigScopeEl = document.getElementById("nm-interop-sig-scope-text");
    const sigReasonEl = document.getElementById("nm-interop-sig-reason");
    if (!result.signature.supported) {
      setTermLine("signature", {
        status: "warn",
        symbol: "⚠",
        detail: t("terminal.sigNotSupported"),
        live: false,
      });
      if (sigScopeEl) sigScopeEl.textContent = t("terminal.sigScopeLiveUnsupported");
      if (sigReasonEl) sigReasonEl.textContent = t("terminal.sigReason");
    } else {
      setTermLine("signature", {
        status: result.signature.valid ? "ok" : "fail",
        symbol: result.signature.valid ? "✓" : "✗",
        detail: result.signature.valid ? t("terminal.sigVerified") : t("terminal.sigNotVerified"),
        live: true,
      });
      if (sigScopeEl) sigScopeEl.textContent = t("terminal.sigScopeLiveSupported");
      if (sigReasonEl) sigReasonEl.textContent = "";
    }

    // Key
    const keyFound = (JWKS.keys || []).some((k) => k.kid === contract.integrity.key_id);
    setTermLine("key", {
      status: keyFound ? "ok" : "fail",
      symbol: keyFound ? "✓" : "✗",
      detail: `${keyFound ? t("terminal.keyResolved") : t("terminal.keyNotFound")} — key_id ${contract.integrity.key_id}`,
      live: true,
    });

    if (runStatus) {
      const activeExampleBtn = root.querySelector(".nm-interop-example-btn.is-active");
      const exampleLabel = activeExampleBtn ? activeExampleBtn.textContent : currentExampleKey;
      runStatus.textContent = t("verify.runDone").replace("{example}", exampleLabel);
    }
  }

  function wireRunButton() {
    const btn = document.getElementById("nm-interop-run-btn");
    if (btn) btn.addEventListener("click", runAndRenderVerification);
  }

  /* ---------- reduced motion ---------- */

  function applyReducedMotion() {
    const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) root.classList.add("nm-interop-reduced-motion");
  }

  /* ---------- init ---------- */

  document.addEventListener("DOMContentLoaded", function () {
    applyReducedMotion();
    initLang();
    renderJsonPanel();
    updateLegendBlurb();
    wireLegend();
    wireExampleToggle();
    wireTabs();
    wireRunButton();
    wireLangToggle();
    runAndRenderVerification();
  });
})();
