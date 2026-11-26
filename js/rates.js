/* ==========================================================================
   다모아툴 공통 기준값 (rates.js)
   --------------------------------------------------------------------------
   이 파일의 값만 고치면 대출·예적금·연봉·연말정산 페이지의 안내 문구가
   함께 바뀝니다. 정기 작업은 아래 RATES 객체만 수정하면 됩니다.
   - bokBaseRate       : 한국은행 기준금리(%)
   - jeonseBase        : 법정 전월세전환율 상한 가산(%p) — 상한 = 기준금리 + 2.0%p
   - insuranceYear     : 4대보험 요율 적용 연도
   - taxYear           : 세법·공제 한도 적용 연도(귀속)
   - updatedAt         : 기준값 확인일
   ========================================================================== */
(function () {
  "use strict";

  var RATES = {
    updatedAt: "2026-11-26",
    updatedLabel: "2026.11.26",
    bokBaseRate: 3.25,
    bokBaseRatePrev: 3.00,
    bokBaseRateSource: "한국은행 통화정책방향(2026.11.26)",
    jeonseBase: 2.0,
    insuranceYear: 2026,
    insuranceRates: {
      nationalPension: 4.75,
      health: 3.595,
      longTermCare: 13.14,
      employment: 0.9,
      employeeTotal: 9.717
    },
    taxYear: 2026
  };

  /* 파생 값 */
  RATES.jeonseMonthlyCap = Math.round((RATES.bokBaseRate + RATES.jeonseBase) * 100) / 100;

  function pct(n) {
    return (Math.round(n * 100) / 100).toString();
  }

  /* 안내 박스 문구 — 페이지마다 다른 기준을 같은 형식으로 보여 줍니다. */
  function noticeFor(kind) {
    switch (kind) {
      case "loan":
        return {
          label: "기준금리",
          main: "현재 한국은행 기준금리는 연 " + pct(RATES.bokBaseRate) + "%입니다",
          meta: RATES.updatedLabel + " 한국은행 발표 기준 · 변동 시 자동 반영"
        };
      case "savings":
        return {
          label: "기준금리",
          main: "현재 한국은행 기준금리는 연 " + pct(RATES.bokBaseRate) + "%입니다",
          meta: RATES.updatedLabel + " 한국은행 발표 기준 · 변동 시 자동 반영"
        };
      case "salary":
        return {
          label: "요율 기준",
          main: RATES.insuranceYear + "년 4대보험 요율 · 국세청 근로소득 간이세액표 기준입니다",
          meta: RATES.updatedLabel + " 기준 · 요율이 바뀌면 자동 반영"
        };
      case "yearend":
        return {
          label: "세법 기준",
          main: RATES.taxYear + "년 귀속 세법·공제 한도 기준입니다",
          meta: RATES.updatedLabel + " 기준 · 제도가 바뀌면 자동 반영"
        };
      case "home":
      default:
        return {
          label: "기준값",
          main: "기준금리 연 " + pct(RATES.bokBaseRate) + "% · 법정 전월세전환율 상한 연 " +
            pct(RATES.jeonseMonthlyCap) + "%",
          meta: RATES.updatedLabel + " 한국은행 발표 기준 · 변동 시 자동 반영"
        };
    }
  }

  function buildNotice(kind) {
    var info = noticeFor(kind);
    var box = document.createElement("div");
    box.className = "rate-notice";
    box.setAttribute("role", "note");

    var label = document.createElement("span");
    label.className = "rate-notice-label";
    label.textContent = info.label;

    var body = document.createElement("p");
    body.className = "rate-notice-body";

    var main = document.createElement("strong");
    main.textContent = info.main;
    body.appendChild(main);

    var meta = document.createElement("span");
    meta.className = "rate-notice-meta";
    meta.textContent = "(" + info.meta + ")";
    body.appendChild(meta);

    box.appendChild(label);
    box.appendChild(body);
    return box;
  }

  function render() {
    var slots = document.querySelectorAll("[data-rates-notice]");
    for (var i = 0; i < slots.length; i++) {
      var kind = slots[i].getAttribute("data-rates-notice") || "home";
      if (slots[i].getAttribute("data-rates-ready") === "1") continue;
      slots[i].appendChild(buildNotice(kind));
      slots[i].setAttribute("data-rates-ready", "1");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }

  window.DT = window.DT || {};
  window.DT.rates = RATES;
  window.DT.noticeFor = noticeFor;
  window.DT.renderRates = render;
})();
