/**
 * SectionCard — غلاف كل قسم من أقسام الفورم
 * كل قسم له عنوان ووصف مختصر يوضح الغرض منه
 */
export default function SectionCard({ icon, title, description, children, accent = false }) {
  return (
    <div style={{
      background: "var(--white)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-md)",
      overflow: "hidden",
      marginBottom: "24px",
      border: accent ? "2px solid var(--accent)" : "1.5px solid var(--gray-200)",
    }}>
      {/* Header القسم */}
      <div style={{
        background: accent
          ? "linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%)"
          : "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)",
        padding: "18px 24px",
        display: "flex",
        alignItems: "flex-start",
        gap: "14px",
      }}>
        <div style={{
          fontSize: "28px",
          lineHeight: 1,
          flexShrink: 0,
          marginTop: "2px",
        }}>
          {icon}
        </div>
        <div>
          <h2 style={{
            color: "var(--white)",
            fontSize: "1.15rem",
            fontWeight: 700,
            margin: 0,
            fontFamily: "'Cairo', sans-serif",
          }}>{title}</h2>
          {description && (
            <p style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: "0.82rem",
              margin: "4px 0 0",
              fontWeight: 400,
              lineHeight: 1.5,
            }}>{description}</p>
          )}
        </div>
      </div>

      {/* Body القسم */}
      <div style={{ padding: "24px" }}>
        {children}
      </div>
    </div>
  );
}
