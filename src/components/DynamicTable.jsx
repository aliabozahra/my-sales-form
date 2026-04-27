/**
 * DynamicTable — جدول ديناميكي قابل للتوسع
 * ────────────────────────────────────────
 * زرار ➕ يضيف صف جديد فارغ
 * زرار 🗑 (أحمر) يحذف الصف المقابل
 * على الموبايل: كل صف يتحول لـ card بدل جدول
 *
 * Props:
 *  rows        — مصفوفة البيانات الحالية
 *  onAdd       — دالة تُضيف صفاً فارغاً
 *  onRemove(i) — دالة تحذف الصف برقم i
 *  addLabel    — نص زرار الإضافة
 *  renderRow(row, i, onChange) — دالة ترسم حقول الصف
 */
export default function DynamicTable({ rows, onAdd, onRemove, addLabel = "إضافة", renderRow }) {
  return (
    <div>
      {rows.length === 0 && (
        <div style={{
          textAlign: "center",
          padding: "28px 0",
          color: "var(--gray-400)",
          fontSize: "0.88rem",
          borderRadius: "var(--radius-md)",
          border: "2px dashed var(--gray-300)",
          marginBottom: "16px",
        }}>
          لا توجد بنود مضافة بعد
        </div>
      )}

      {rows.map((row, i) => (
        <div key={i} style={{
          background: "var(--gray-50)",
          borderRadius: "var(--radius-md)",
          border: "1.5px solid var(--gray-200)",
          padding: "16px",
          marginBottom: "12px",
          position: "relative",
        }}>
          {/* رقم الصف + زرار الحذف */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}>
            <span style={{
              background: "var(--primary)",
              color: "white",
              borderRadius: "50%",
              width: "26px",
              height: "26px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.78rem",
              fontWeight: 700,
              flexShrink: 0,
            }}>
              {i + 1}
            </span>

            <button
              type="button"
              onClick={() => onRemove(i)}
              title="حذف هذا الصف"
              style={{
                background: "var(--danger-light)",
                color: "var(--danger)",
                border: "1px solid var(--danger)",
                borderRadius: "var(--radius-sm)",
                padding: "5px 12px",
                cursor: "pointer",
                fontSize: "0.82rem",
                fontFamily: "'Cairo', sans-serif",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "5px",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => e.target.style.background = "var(--danger)"}
              onMouseLeave={e => e.target.style.background = "var(--danger-light)"}
            >
              🗑 حذف
            </button>
          </div>

          {/* حقول الصف */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "10px",
          }}>
            {renderRow(row, i)}
          </div>
        </div>
      ))}

      {/* زرار الإضافة ➕ */}
      <button
        type="button"
        onClick={onAdd}
        style={{
          width: "100%",
          padding: "12px",
          background: "linear-gradient(135deg, var(--primary-bg) 0%, #e8d5ff 100%)",
          color: "var(--primary-dark)",
          border: "2px dashed var(--primary-light)",
          borderRadius: "var(--radius-md)",
          cursor: "pointer",
          fontSize: "0.92rem",
          fontFamily: "'Cairo', sans-serif",
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          transition: "all 0.2s",
          marginTop: "4px",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = "var(--primary)";
          e.currentTarget.style.color = "white";
          e.currentTarget.style.borderStyle = "solid";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = "linear-gradient(135deg, var(--primary-bg) 0%, #e8d5ff 100%)";
          e.currentTarget.style.color = "var(--primary-dark)";
          e.currentTarget.style.borderStyle = "dashed";
        }}
      >
        <span style={{ fontSize: "1.1rem" }}>➕</span> {addLabel}
      </button>
    </div>
  );
}
