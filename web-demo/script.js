(function () {
  "use strict";

  const root = document.getElementById("nm-interop");
  if (!root) return;

  let currentExampleKey = "flagged";

  /* ---------- JSON rendering (left panel) ---------- */

  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  const SECTION_ORDER = ["identity", "provenance", "observation", "governance", "integrity"];

  function renderContractHTML(contract) {
    const parts = SECTION_ORDER.map((key, idx) => {
      const json = JSON.stringify(contract[key], null, 2);
      const indented = json.split("\n").map((line, i) => (i === 0 ? line : "  " + line)).join("\n");
      const body = `  "${key}": ${indented}`;
      const comma = idx < SECTION_ORDER.length - 1 ? "," : "";
      return `<span class="nm-interop-section-block" data-section="${key}">${escapeHtml(body)}</span>${comma}`;
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
    const blurb = document.getElementById("nm-interop-legend-blurb");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const section = btn.dataset.section;
        const isSame = activeSection === section;
        activeSection = isSame ? null : section;
        buttons.forEach((b) => b.classList.toggle("is-active", b.dataset.section === activeSection));
        blurb.textContent = activeSection
          ? SECTION_INFO[activeSection].blurb
          : "Select a section above to see what it's for.";
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
        tabs.forEach((t) => {
          t.classList.toggle("is-active", t === tab);
          t.setAttribute("aria-selected", t === tab ? "true" : "false");
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
    if (runStatus) runStatus.textContent = "Running…";

    let result;
    try {
      result = await runVerification(contract, JWKS);
    } catch (e) {
      if (runStatus) runStatus.textContent = "Verification failed to run: " + e.message;
      return;
    }

    // Schema — core structural checks
    const passedCount = result.structural.items.filter((i) => i.passed).length;
    const total = result.structural.items.length;
    setTermLine("schema", {
      status: result.structural.passed ? "ok" : "fail",
      symbol: result.structural.passed ? "✓" : "✗",
      detail: `core structural checks ${result.structural.passed ? "passed" : "FAILED"} — ${passedCount}/${total} (declared ${contract.identity.schema_version})`,
      live: true,
    });

    // SHA-256
    setTermLine("hash", {
      status: result.hash.match ? "ok" : "fail",
      symbol: result.hash.match ? "✓" : "✗",
      detail: result.hash.match ? "MATCH" : `MISMATCH (recomputed ${result.hash.recomputed.slice(0, 12)}…)`,
      live: true,
    });
    const hashScopeEl = document.getElementById("nm-interop-hash-scope-text");
    if (hashScopeEl) hashScopeEl.textContent = "Recomputed live, in your browser, from the raw contract via SubtleCrypto SHA-256.";

    // Signature
    const sigScopeEl = document.getElementById("nm-interop-sig-scope-text");
    const sigReasonEl = document.getElementById("nm-interop-sig-reason");
    if (!result.signature.supported) {
      setTermLine("signature", {
        status: "warn",
        symbol: "⚠",
        detail: "NOT VERIFIED IN THIS BROWSER",
        live: false,
      });
      if (sigScopeEl) sigScopeEl.textContent = "Live verification was attempted in your browser.";
      if (sigReasonEl) {
        sigReasonEl.textContent = "This browser's WebCrypto does not implement Ed25519 verification — the check above could not run here. Verify with the reference Python verifier (verify.py) instead.";
      }
    } else {
      setTermLine("signature", {
        status: result.signature.valid ? "ok" : "fail",
        symbol: result.signature.valid ? "✓" : "✗",
        detail: result.signature.valid ? "VERIFIED (Ed25519/JWS)" : "NOT VERIFIED — signature or signed claims did not match",
        live: true,
      });
      if (sigScopeEl) sigScopeEl.textContent = "Verified live, in your browser, against the public JWKS (GET /v1/rgc/jwks) via SubtleCrypto Ed25519.";
      if (sigReasonEl) sigReasonEl.textContent = "";
    }

    // Key
    const keyFound = (JWKS.keys || []).some((k) => k.kid === contract.integrity.key_id);
    setTermLine("key", {
      status: keyFound ? "ok" : "fail",
      symbol: keyFound ? "✓" : "✗",
      detail: `${keyFound ? "RESOLVED" : "NOT FOUND"} — key_id ${contract.integrity.key_id}`,
      live: true,
    });

    if (runStatus) {
      runStatus.textContent = "Done — ran against the \"" + EXAMPLES[currentExampleKey].label + "\" example.";
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
    renderJsonPanel();
    wireLegend();
    wireExampleToggle();
    wireTabs();
    wireRunButton();
    runAndRenderVerification();
  });
})();
