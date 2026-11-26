/* 다모아툴 공통 스크립트 — 헤더 메뉴, 복사 토스트, 숫자 서식 유틸 */
(function () {
  "use strict";

  /* ---------- 모바일 메뉴 ---------- */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("mainNav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target && e.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- 토스트 ---------- */
  var toastTimer = null;

  function toast(message) {
    var el = document.getElementById("dtToast");
    if (!el) {
      el = document.createElement("div");
      el.id = "dtToast";
      el.className = "toast";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      document.body.appendChild(el);
    }
    el.textContent = message || "복사했어요";
    el.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.classList.remove("show");
    }, 1900);
  }

  /* ---------- 복사 (클립보드 API → 폴백) ---------- */
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-1000px";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (err) {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  }

  function copy(text, message) {
    var value = text == null ? "" : String(text);
    if (!value) {
      toast("복사할 내용이 없어요");
      return Promise.resolve(false);
    }
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(value).then(
        function () {
          toast(message || "복사했어요");
          return true;
        },
        function () {
          var ok = fallbackCopy(value);
          toast(ok ? message || "복사했어요" : "복사에 실패했어요. 직접 선택해 주세요");
          return ok;
        }
      );
    }
    var ok = fallbackCopy(value);
    toast(ok ? message || "복사했어요" : "복사에 실패했어요. 직접 선택해 주세요");
    return Promise.resolve(ok);
  }

  /* ---------- 유틸 ---------- */
  function num(value) {
    var n = Number(String(value).replace(/[^0-9.-]/g, ""));
    return isFinite(n) ? n : 0;
  }

  function won(n) {
    return Math.round(num(n)).toLocaleString("ko-KR");
  }

  function el(id) {
    return document.getElementById(id);
  }

  function bindCopyButtons(root) {
    (root || document).addEventListener("click", function (e) {
      var btn = e.target.closest("[data-copy-target]");
      if (!btn) return;
      var target = document.getElementById(btn.getAttribute("data-copy-target"));
      if (!target) return;
      copy(target.value != null ? target.value : target.textContent, btn.getAttribute("data-copy-message") || "복사했어요");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    bindCopyButtons(document);
  });

  window.DT = {
    toast: toast,
    copy: copy,
    num: num,
    won: won,
    el: el
  };
})();
