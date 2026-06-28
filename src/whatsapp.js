export const WA_NUMBER = '201012345678' // ← Change to your WhatsApp number

export function buildWAMessage(f, lang) {
  const ar = lang === 'ar'
  const lines = ar
    ? [
        '🚛 *طلب نقل أثاث – الهلالي لنقل الاثاث*',
        '━━━━━━━━━━━━━',
        `👤 *الاسم:* ${f.name}`,
        `📱 *واتساب:* ${f.phone}`,
        `📍 *من:* ${f.from}`,
        `🏠 *إلى:* ${f.to}`,
        `📅 *التاريخ:* ${f.date}`,
        `🛋️ *الغرف:* ${f.rooms}`,
        `🏢 *الطابق:* ${f.floor}`,
        f.services?.length ? `✅ *خدمات:*\n${f.services.map(s => '  • ' + s).join('\n')}` : '',
        f.notes ? `📝 *ملاحظات:* ${f.notes}` : '',
        '━━━━━━━━━━━━━',
        'أرجو إرسال عرض السعر. شكراً!',
      ]
    : [
        '🚛 *New Moving Request – الهلالي لنقل الاثاث*',
        '━━━━━━━━━━━━━',
        `👤 *Name:* ${f.name}`,
        `📱 *WhatsApp:* ${f.phone}`,
        `📍 *From:* ${f.from}`,
        `🏠 *To:* ${f.to}`,
        `📅 *Date:* ${f.date}`,
        `🛋️ *Rooms:* ${f.rooms}`,
        `🏢 *Floor:* ${f.floor}`,
        f.services?.length ? `✅ *Services:*\n${f.services.map(s => '  • ' + s).join('\n')}` : '',
        f.notes ? `📝 *Notes:* ${f.notes}` : '',
        '━━━━━━━━━━━━━',
        'Please send me a quote. Thank you!',
      ]
  return lines.filter(Boolean).join('\n')
}
