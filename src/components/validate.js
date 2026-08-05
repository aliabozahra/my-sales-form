/** validate.js — منطق التحقق من صحة البيانات */

/**
 * يتحقق من رقم الهاتف — أرقام فقط بدون قيود على الطول
 * يقبل أي رقم من 7 إلى 15 خانة
 */
export function isValidPhone(phone) {
  if (!phone) return false;
  
  const cleaned = phone.toString().replace(/[^\d]/g, "");
    return cleaned.length >= 6 && /^[0-9]+$/.test(cleaned);
}

/** يتحقق أن التاريخ في المستقبل أو اليوم */
export function isFutureOrToday(dateStr) {
  if (!dateStr) return false;
  const today = new Date().toISOString().split("T")[0];
  return dateStr >= today;
}

/**
 * validateForm — يتحقق من كل البيانات ويرجع كائن errors
 * Returns: { isValid: bool, errors: { fieldPath: message } }
 */
export function validateForm(state) {
  const errors = {};

  // Header
  if (!state.salesName) errors.salesName = "اختر اسمك من القائمة";

  // القسم 1 — أرقام التسويق
// القسم 1 — أرقام التسويق
state.marketingRows.forEach((row, i) => {
  if (!row.phone && !row.email)
    errors[`mk_contact_${i}`] = "أدخل رقم الهاتف أو الإيميل";
  else if (row.phone && !isValidPhone(row.phone))
    errors[`mk_phone_${i}`] = "الرقم غير صحيح";
  if (!row.country) errors[`mk_country_${i}`] = "اختر الدولة";
  if (!row.type) errors[`mk_type_${i}`] = "اختر النوع";
  if (!row.status) errors[`mk_status_${i}`] = "اختر موقف العميل";
});

  // القسم 2 — الديلات المفتوحة
  state.openDeals.forEach((deal, i) => {
    if (!deal.client_name) errors[`od_name_${i}`] = "اسم العميل مطلوب";
    if (!deal.client_phone) errors[`od_phone_${i}`] = "الرقم مطلوب";
    else if (!isValidPhone(deal.client_phone)) errors[`od_phone_${i}`] = "الرقم غير صحيح";
    if (!deal.service_group) errors[`od_sg_${i}`] = "اختر جروب الخدمة";
    if (!deal.service_type) errors[`od_st_${i}`] = "نوع الخدمة مطلوب";
    if (!deal.expected_value || Number(deal.expected_value) <= 0)
      errors[`od_val_${i}`] = "أدخل قيمة صحيحة بالريال";
    if (!deal.expected_close_date) errors[`od_date_${i}`] = "التاريخ المتوقع مطلوب";
    else if (!isFutureOrToday(deal.expected_close_date))
      errors[`od_date_${i}`] = "التاريخ لازم يكون في المستقبل";
    if (!deal.b2b_or_b2c) errors[`od_b2b_${i}`] = "اختر B2B أو B2C";
  });

  // القسم 3.5 — عدد عملاء الحملة
  if (state.campaignReplied === "" || state.campaignReplied === undefined)
    errors.campaign_replied = "أدخل عدد العملاء اللي ردوا على الحملة";
  else if (!Number.isInteger(Number(state.campaignReplied)) || Number(state.campaignReplied) < 0)
    errors.campaign_replied = "أدخل رقمًا صحيحًا (0 أو أكثر)";

  if (state.campaignPurchased === "" || state.campaignPurchased === undefined)
    errors.campaign_purchased = "أدخل عدد العملاء اللي اشتروا من الحملة";
  else if (!Number.isInteger(Number(state.campaignPurchased)) || Number(state.campaignPurchased) < 0)
    errors.campaign_purchased = "أدخل رقمًا صحيحًا (0 أو أكثر)";

  // القسم 4 — B2B
  if (state.b2bMeetings !== "" && Number(state.b2bMeetings) < 0)
    errors.b2b_meetings = "أدخل رقمًا صحيحًا (0 أو أكثر)";

  // القسم 5 — التوقعات
  state.expectations.forEach((exp, i) => {
    if (!exp.client_name) errors[`ex_name_${i}`] = "اسم العميل مطلوب";
    if (!exp.client_phone) errors[`ex_phone_${i}`] = "الرقم مطلوب";
    else if (!isValidPhone(exp.client_phone)) errors[`ex_phone_${i}`] = "الرقم غير صحيح";
    if (!exp.service_name) errors[`ex_sname_${i}`] = "اسم الخدمة مطلوب";
    if (!exp.service_type) errors[`ex_stype_${i}`] = "اختر نوع الخدمة";
    if (!exp.amount || Number(exp.amount) <= 0)
      errors[`ex_amount_${i}`] = "أدخل المبلغ بالريال";
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}