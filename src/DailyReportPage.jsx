import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  EMPLOYEES, COUNTRIES, CLIENT_STATUSES,
  SERVICE_GROUPS, BUSINESS_TYPES, CLIENT_TYPES,
  SERVICE_TYPES_EXPECTATION, WEBHOOK_URL,DEAL_RESULTS,DEAL_STAGES, DEAL_REJECTION_REASONS,
} from "./constants";
import FormField from "./components/FormField";
import SectionCard from "./components/SectionCard";
import DynamicTable from "./components/DynamicTable";
import { useFormState } from "./components/useFormState";
import { validateForm } from "./components/validate";

export default function DailyReportPage() {
  const form = useFormState();
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // ───── تنسيق التاريخ بالعربي ─────
  const dateFormatted = new Date().toLocaleDateString("ar-EG", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  // ───── إرسال الفورم ─────
  async function handleSubmit() {
    const { isValid, errors: errs } = validateForm({
      salesName: form.salesName,
      marketingRows: form.marketingRows,
      openDeals: form.openDeals,
      closedDeals: form.closedDeals,
      b2bMeetings: form.b2bMeetings,
      expectations: form.expectations,
    });

    if (!isValid) {
      setErrors(errs);
      // Scroll للأول خطأ
      setTimeout(() => {
        const firstError = document.querySelector('[data-error="true"]');
        if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
      return;
    }

    setErrors({});
    setSubmitting(true);
    setSubmitError("");

    try {
      const payload = form.buildPayload();
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setShowSuccess(true);
    } catch (err) {
      setSubmitError("حدث خطأ أثناء الإرسال. تأكد من الاتصال وحاول مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  }

  const e = (key) => errors[key]; // shorthand

  return (
    <div style={{ margin: "0 auto", padding: "0 0 80px" }}>



       {/* Modal النجاح */}
    {showSuccess && (
      <div style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 999, padding: "20px",
      }}>
        <div style={{
          background: "white", borderRadius: "24px",
          padding: "40px 32px", maxWidth: "380px", width: "100%",
          textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>✅</div>
          <h2 style={{
            fontFamily: "'Cairo', sans-serif", fontWeight: 800,
            fontSize: "1.4rem", color: "#198754", marginBottom: "10px",
          }}>تم إرسال التقرير بنجاح!</h2>
          <p style={{ color: "#6c757d", fontSize: "0.9rem", marginBottom: "28px" }}>
            وصلت بياناتك لـ Google Sheets تلقائياً ✓
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              width: "100%", padding: "14px",
              background: "linear-gradient(135deg, #6610f2, #fd7e14)",
              color: "white", border: "none", borderRadius: "14px",
              fontSize: "1rem", fontFamily: "'Cairo', sans-serif",
              fontWeight: 700, cursor: "pointer",
            }}
          >
            🔄 تقرير جديد
          </button>
        </div>
      </div>
    )}


      {/* ═══════════════════════════════════════
          STICKY HEADER
      ═══════════════════════════════════════ */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 60%, var(--accent) 100%)",
        padding: "14px 24px",
        boxShadow: "0 4px 20px rgba(102,16,242,0.35)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "8px",
      }}>
        <div>
          <h1 style={{
            color: "white",
            fontSize: "1.1rem",
            fontWeight: 800,
            margin: 0,
            letterSpacing: "0.01em",
          }}>
            📊 التقرير اليومي للمبيعات
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.78rem", margin: "2px 0 0" }}>
            {dateFormatted}
          </p>
        </div>
        <div style={{
          background: "rgba(255,255,255,0.15)",
          borderRadius: "var(--radius-sm)",
          padding: "6px 14px",
          color: "white",
          fontSize: "0.82rem",
          fontWeight: 600,
          backdropFilter: "blur(4px)",
          border: "1px solid rgba(255,255,255,0.25)",
        }}>
          {form.date}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          محتوى الصفحة
      ═══════════════════════════════════════ */}
      <div style={{ padding: "28px 16px 0" }}>

        {/* ═══ القسم 0 — اسم السيلز ═══ */}
        <SectionCard
          icon="👤"
          title="بيانات السيلز"
          description="اختر اسمك من القائمة — التاريخ يُحدَّد تلقائياً"
        >
          <div data-error={!!e("salesName")}>
            <FormField
              label="اسم السيلز"
              type="select"
              value={form.salesName}
              onChange={form.setSalesName}
              options={EMPLOYEES}
              error={e("salesName")}
              required
            />
          </div>
          <div style={{
            background: "var(--primary-bg)",
            borderRadius: "var(--radius-sm)",
            padding: "10px 14px",
            fontSize: "0.85rem",
            color: "var(--primary-dark)",
            fontWeight: 500,
          }}>
            📅 تاريخ التقرير: <strong>{form.date}</strong>
          </div>
        </SectionCard>

        {/* ═══ القسم 1 — أرقام التسويق الشخصي ═══ */}
        <SectionCard
          icon="📞"
          title="أرقام التسويق الشخصي"
          description="سجّل كل الأرقام التي تواصلت معها اليوم عبر التسويق الشخصي. اضغط ➕ لإضافة رقم، واضغط 🗑 لحذف أي صف."
        >
          <DynamicTable
            rows={form.marketingRows}
            onAdd={form.addMarketing}
            onRemove={form.removeMarketing}
            addLabel="إضافة رقم جديد"
            renderRow={(row, i) => (
              <>
                <div data-error={!!e(`mk_phone_${i}`)}>
                  <FormField
                    label="رقم الهاتف"
                    value={row.phone}
                    onChange={v => form.updateMarketing(i, "phone", v)}
                    error={e(`mk_phone_${i}`)}
                    placeholder="966551234567"
                    hint="يشمل كود الدولة (9+ أرقام)"
                    required
                  />
                </div>
                <div data-error={!!e(`mk_country_${i}`)}>
                  <FormField
                    label="الدولة"
                    type="select"
                    value={row.country}
                    onChange={v => form.updateMarketing(i, "country", v)}
                    options={COUNTRIES}
                    error={e(`mk_country_${i}`)}
                    required
                  />
                </div>
                <div data-error={!!e(`mk_type_${i}`)}>
                  <FormField
                    label="فرد أم شركة"
                    type="select"
                    value={row.type}
                    onChange={v => form.updateMarketing(i, "type", v)}
                    options={CLIENT_TYPES}
                    error={e(`mk_type_${i}`)}
                    required
                  />
                </div>
                <div data-error={!!e(`mk_status_${i}`)}>
                  <FormField
                    label="موقف العميل"
                    type="select"
                    value={row.status}
                    onChange={v => form.updateMarketing(i, "status", v)}
                    options={CLIENT_STATUSES}
                    error={e(`mk_status_${i}`)}
                    required
                  />
                </div>
              </>
            )}
          />
        </SectionCard>

        {/* ═══ القسم 2 — الديلات المفتوحة ═══ */}
       {/* ═══ القسم 2 — الديلات المفتوحة ═══ */}
<SectionCard
  icon="🤝"
  title="الديلات المفتوحة"
  description="سجّل كل الديلات التي لا تزال قيد التفاوض. اضغط ➕ لإضافة ديل، واضغط 🗑 لحذفه."
>
  <DynamicTable
    rows={form.openDeals}
    onAdd={form.addOpenDeal}
    onRemove={form.removeOpenDeal}
    addLabel="إضافة ديل جديد"
    renderRow={(row, i) => (
      <>
        <div data-error={!!e(`od_name_${i}`)}>
          <FormField
            label="اسم العميل"
            value={row.client_name}
            onChange={v => form.updateOpenDeal(i, "client_name", v)}
            error={e(`od_name_${i}`)}
            placeholder="مثال: شركة المستقبل"
            required
          />
        </div>
        <div data-error={!!e(`od_phone_${i}`)}>
          <FormField
            label="رقم الهاتف"
            value={row.client_phone}
            onChange={v => form.updateOpenDeal(i, "client_phone", v)}
            error={e(`od_phone_${i}`)}
            placeholder="966551234567"
            required
          />
        </div>
        <div data-error={!!e(`od_sg_${i}`)}>
          <FormField
            label="جروب الخدمة"
            type="select"
            value={row.service_group}
            onChange={v => form.updateOpenDeal(i, "service_group", v)}
            options={SERVICE_GROUPS}
            error={e(`od_sg_${i}`)}
            required
          />
        </div>
        <div data-error={!!e(`od_st_${i}`)}>
          <FormField
            label="نوع الخدمة"
            value={row.service_type}
            onChange={v => form.updateOpenDeal(i, "service_type", v)}
            error={e(`od_st_${i}`)}
            placeholder="مثال: ورشة عمل 45 دقيقة"
            required
          />
        </div>
        <div data-error={!!e(`od_val_${i}`)}>
          <FormField
            label="القيمة المتوقعة (ريال)"
            type="number"
            value={row.expected_value}
            onChange={v => form.updateOpenDeal(i, "expected_value", v)}
            error={e(`od_val_${i}`)}
            placeholder="0"
            min="1"
            required
          />
        </div>
        <div data-error={!!e(`od_date_${i}`)}>
          <FormField
            label="تاريخ الإغلاق المتوقع"
            type="date"
            value={row.expected_close_date}
            onChange={v => form.updateOpenDeal(i, "expected_close_date", v)}
            error={e(`od_date_${i}`)}
            required
          />
        </div>
        <div data-error={!!e(`od_b2b_${i}`)}>
          <FormField
            label="نوع العميل"
            type="select"
            value={row.b2b_or_b2c}
            onChange={v => form.updateOpenDeal(i, "b2b_or_b2c", v)}
            options={BUSINESS_TYPES}
            error={e(`od_b2b_${i}`)}
            required
          />
        </div>

        {/* مرحلة الديل — اختياري */}
        <div>
          <FormField
            label="مرحلة الديل (اختياري)"
            type="select"
            value={row.deal_stage}
            onChange={v => form.updateOpenDeal(i, "deal_stage", v)}
            options={DEAL_STAGES}
          />
        </div>

        {/* سبب الرفض — يظهر فقط لو المرحلة "رفض الديل" */}
        {row.deal_stage === "رفض الديل" && (
          <div>
            <FormField
              label="سبب رفض الديل (اختياري)"
              type="select"
              value={row.rejection_reason}
              onChange={v => form.updateOpenDeal(i, "rejection_reason", v)}
              options={DEAL_REJECTION_REASONS}
            />
          </div>
        )}

        {/* ملاحظات — عرض كامل */}
        <div style={{ gridColumn: "1 / -1" }}>
          <FormField
            label="ملاحظات (اختياري)"
            type="textarea"
            value={row.notes}
            onChange={v => form.updateOpenDeal(i, "notes", v)}
            placeholder="أي تفاصيل إضافية عن الديل..."
            rows={2}
          />
        </div>
      </>
    )}
  />
</SectionCard>

        {/* ═══ القسم 3 — الديلات المغلقة ═══ */}
        =

        {/* ═══ القسم 4 — إحصائيات B2B ═══ */}
        <SectionCard
          icon="🏢"
          title="إحصائيات B2B"
          description="سجّل عدد الاجتماعات مع عملاء B2B اليوم، وفاصّل عروض الأسعار التي أرسلتها."
        >
          <FormField
            label="عدد الميتنج مع عملاء B2B"
            type="number"
            value={form.b2bMeetings}
            onChange={form.setB2bMeetings}
            error={e("b2b_meetings")}
            placeholder="0"
            min="0"
            required
            hint="أدخل 0 إذا لم يكن هناك اجتماعات"
          />
          <FormField
            label="تفاصيل عروض الأسعار لعملاء B2B (اختياري)"
            type="textarea"
            value={form.b2bQuotes}
            onChange={form.setB2bQuotes}
            placeholder={"مثال:\nعرض سعر لشركة X بقيمة 5000 ريال لحقيبة تدريبية\nعرض سعر لمركز Y بقيمة 2000 ريال لورشة عمل"}
            rows={4}
          />
        </SectionCard>

        {/* ═══ القسم 5 — توقعات تقفيل الشهر ═══ */}
        <SectionCard
          icon="📈"
          title="توقعات تقفيل الشهر"
          description="ما هي الديلات التي تتوقع إغلاقها قبل نهاية الشهر؟ اضغط ➕ لإضافة توقع، واضغط 🗑 لحذفه."
        >
          <DynamicTable
            rows={form.expectations}
            onAdd={form.addExpectation}
            onRemove={form.removeExpectation}
            addLabel="إضافة توقع"
            renderRow={(row, i) => (
              <>
                <div data-error={!!e(`ex_name_${i}`)}>
                  <FormField
                    label="اسم العميل"
                    value={row.client_name}
                    onChange={v => form.updateExpectation(i, "client_name", v)}
                    error={e(`ex_name_${i}`)}
                    placeholder="اسم العميل"
                    required
                  />
                </div>
                <div data-error={!!e(`ex_phone_${i}`)}>
                  <FormField
                    label="رقم العميل"
                    value={row.client_phone}
                    onChange={v => form.updateExpectation(i, "client_phone", v)}
                    error={e(`ex_phone_${i}`)}
                    placeholder="966561234567"
                    required
                  />
                </div>
                <div data-error={!!e(`ex_sname_${i}`)}>
                  <FormField
                    label="اسم الخدمة"
                    value={row.service_name}
                    onChange={v => form.updateExpectation(i, "service_name", v)}
                    error={e(`ex_sname_${i}`)}
                    placeholder="مثال: كتاب الإدارة الرشيقة"
                    required
                  />
                </div>
                <div data-error={!!e(`ex_stype_${i}`)}>
                  <FormField
                    label="نوع الخدمة"
                    type="select"
                    value={row.service_type}
                    onChange={v => form.updateExpectation(i, "service_type", v)}
                    options={SERVICE_TYPES_EXPECTATION}
                    error={e(`ex_stype_${i}`)}
                    required
                  />
                </div>
                <div data-error={!!e(`ex_amount_${i}`)}>
                  <FormField
                    label="المبلغ بالريال"
                    type="number"
                    value={row.amount}
                    onChange={v => form.updateExpectation(i, "amount", v)}
                    error={e(`ex_amount_${i}`)}
                    placeholder="0"
                    min="1"
                    required
                  />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <FormField
                    label="ملاحظات (اختياري)"
                    type="textarea"
                    value={row.notes}
                    onChange={v => form.updateExpectation(i, "notes", v)}
                    placeholder="أي تفاصيل إضافية..."
                    rows={2}
                  />
                </div>
              </>
            )}
          />
        </SectionCard>

        {/* ═══ القسم 6 — ملاحظات عامة ═══ */}
        <SectionCard
          icon="📝"
          title="ملاحظات عامة"
          description="أي ملاحظات أو معلومات إضافية تريد إيصالها للمدير — اختياري تماماً."
        >
          <FormField
            type="textarea"
            value={form.generalNotes}
            onChange={form.setGeneralNotes}
            placeholder="أكتب أي ملاحظات تريد إيصالها للمدير..."
            rows={5}
          />
        </SectionCard>

        {/* ═══ رسالة الخطأ العامة ═══ */}
        {submitError && (
          <div style={{
            background: "var(--danger-light)",
            border: "1.5px solid var(--danger)",
            borderRadius: "var(--radius-md)",
            padding: "16px 20px",
            marginBottom: "20px",
            color: "var(--danger)",
            fontWeight: 600,
            fontSize: "0.92rem",
          }}>
            ❌ {submitError}
          </div>
        )}

        {/* ═══ رسالة أخطاء الـ Validation ═══ */}
        {Object.keys(errors).length > 0 && (
          <div style={{
            background: "#fff3cd",
            border: "1.5px solid var(--warning)",
            borderRadius: "var(--radius-md)",
            padding: "14px 20px",
            marginBottom: "20px",
            color: "#856404",
            fontWeight: 600,
            fontSize: "0.88rem",
          }}>
            ⚠ يوجد {Object.keys(errors).length} خطأ في الفورم — راجع الحقول المميزة باللون الأحمر
          </div>
        )}

        {/* ═══ زرار الإرسال ═══ */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            width: "100%",
            padding: "16px",
            background: submitting
              ? "var(--gray-400)"
              : "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
            color: "white",
            border: "none",
            borderRadius: "var(--radius-lg)",
            fontSize: "1.05rem",
            fontFamily: "'Cairo', sans-serif",
            fontWeight: 800,
            cursor: submitting ? "not-allowed" : "pointer",
            boxShadow: submitting ? "none" : "0 6px 24px rgba(102,16,242,0.35)",
            transition: "all 0.25s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            letterSpacing: "0.02em",
          }}
        >
          {submitting ? (
            <>
              <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⏳</span>
              جاري الإرسال...
            </>
          ) : (
            <>📤 إرسال التقرير</>
          )}
        </button>

        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>

      </div>
    </div>
  );

  
}