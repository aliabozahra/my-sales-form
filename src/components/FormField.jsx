/**
 * FormField — حقل إدخال موحد (نص / رقم / تاريخ / select / textarea)
 * يعرض Label + Input + رسالة الخطأ لو فيه validation error
 */
export default function FormField({
  label,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  options = [],       // للـ select فقط
  placeholder = "",
  min,
  rows = 3,
  hint,
}) {
  const baseStyle = {
    width: "100%",
    padding: "10px 14px",
    border: error ? "1.5px solid var(--danger)" : "1.5px solid var(--gray-300)",
    borderRadius: "var(--radius-sm)",
    fontSize: "0.92rem",
    fontFamily: "'Cairo', sans-serif",
    color: "var(--gray-800)",
    background: "var(--white)",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    direction: "rtl",
  };

  return (
    <div style={{ marginBottom: "14px" }}>
      {label && (
        <label style={{
          display: "block",
          marginBottom: "6px",
          fontWeight: 600,
          fontSize: "0.88rem",
          color: "var(--gray-700)",
        }}>
          {label}
          {required && <span style={{ color: "var(--danger)", marginRight: "4px" }}>*</span>}
        </label>
      )}

      {type === "select" ? (
        <select value={value} onChange={e => onChange(e.target.value)} style={baseStyle}>
          <option value="">— اختر —</option>
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          style={{ ...baseStyle, resize: "vertical", lineHeight: 1.6 }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          style={baseStyle}
        />
      )}

      {hint && !error && (
        <p style={{ marginTop: "4px", fontSize: "0.78rem", color: "var(--gray-500)" }}>{hint}</p>
      )}
      {error && (
        <p style={{ marginTop: "5px", fontSize: "0.8rem", color: "var(--danger)", fontWeight: 500 }}>
          ⚠ {error}
        </p>
      )}
    </div>
  );
}
