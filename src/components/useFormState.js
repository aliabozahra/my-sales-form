import { useState } from "react";

/** القيم الفارغة لكل نوع صف */
const emptyMarketingRow = () => ({ phone: "", country: "", type: "", status: "" });
const emptyOpenDeal = () => ({
  client_name: "",
  client_phone: "",
  service_group: "",
  service_type: "",
  expected_value: "",
  expected_close_date: "",
  b2b_or_b2c: "",
  deal_stage: "",
  rejection_reason: "",
  notes: "",
});
const emptyClosedDeal = () => ({
  client_name: "", client_phone: "", service: "", result: "", loss_reason: "",
});
const emptyExpectation = () => ({
  client_name: "", client_phone: "", service_name: "",
  service_type: "", amount: "", notes: "",
});

/** useFormState — يدير حالة الفورم كاملة */
export function useFormState() {
  const today = new Date().toISOString().split("T")[0];

  // القسم 0 — Header
  const [salesName, setSalesName] = useState("");
  const date = today; // تلقائي

  // القسم 1 — أرقام التسويق
  const [marketingRows, setMarketingRows] = useState([]);
  const addMarketing = () => setMarketingRows(r => [...r, emptyMarketingRow()]);
  const removeMarketing = i => setMarketingRows(r => r.filter((_, idx) => idx !== i));
  const updateMarketing = (i, field, val) =>
    setMarketingRows(r => r.map((row, idx) => idx === i ? { ...row, [field]: val } : row));

  // القسم 2 — الديلات المفتوحة
  const [openDeals, setOpenDeals] = useState([]);
  const addOpenDeal = () => setOpenDeals(r => [...r, emptyOpenDeal()]);
  const removeOpenDeal = i => setOpenDeals(r => r.filter((_, idx) => idx !== i));
  const updateOpenDeal = (i, field, val) =>
    setOpenDeals(r => r.map((row, idx) => idx === i ? { ...row, [field]: val } : row));

  // القسم 3 — الديلات المغلقة
  const [closedDeals, setClosedDeals] = useState([]);
  const addClosedDeal = () => setClosedDeals(r => [...r, emptyClosedDeal()]);
  const removeClosedDeal = i => setClosedDeals(r => r.filter((_, idx) => idx !== i));
  const updateClosedDeal = (i, field, val) =>
    setClosedDeals(r => r.map((row, idx) => idx === i ? { ...row, [field]: val } : row));

  // القسم 4 — B2B
  const [b2bMeetings, setB2bMeetings] = useState("");
  const [b2bQuotes, setB2bQuotes] = useState("");

  // القسم 5 — التوقعات
  const [expectations, setExpectations] = useState([]);
  const addExpectation = () => setExpectations(r => [...r, emptyExpectation()]);
  const removeExpectation = i => setExpectations(r => r.filter((_, idx) => idx !== i));
  const updateExpectation = (i, field, val) =>
    setExpectations(r => r.map((row, idx) => idx === i ? { ...row, [field]: val } : row));

  // القسم 6 — ملاحظات عامة
  const [generalNotes, setGeneralNotes] = useState("");

  /** تجميع الـ JSON النهائي */
  const buildPayload = () => ({
    sales_name: salesName,
    date,
    marketing_numbers: marketingRows,
    open_deals: openDeals,
    closed_deals: closedDeals,
    b2b_stats: {
      meetings_count: parseInt(b2bMeetings) || 0,
      quotes_details: b2bQuotes,
    },
    month_expectations: expectations,
    general_notes: generalNotes,
  });

  return {
    // Header
    salesName, setSalesName, date,
    // Marketing
    marketingRows, addMarketing, removeMarketing, updateMarketing,
    // Open Deals
    openDeals, addOpenDeal, removeOpenDeal, updateOpenDeal,
    // Closed Deals
    closedDeals, addClosedDeal, removeClosedDeal, updateClosedDeal,
    // B2B
    b2bMeetings, setB2bMeetings, b2bQuotes, setB2bQuotes,
    // Expectations
    expectations, addExpectation, removeExpectation, updateExpectation,
    // Notes
    generalNotes, setGeneralNotes,
    // Builder
    buildPayload,
  };
}
