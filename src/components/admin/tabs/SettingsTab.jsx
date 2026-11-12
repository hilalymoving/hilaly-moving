import { useState, useEffect } from 'react'
import { ADMIN_TOKENS as T, adminStyles as S } from '../AdminTheme'
import { SectionCard, Field, TextInput } from '../AdminUI'

export default function SettingsTab({ onToast }) {
  const [currentEmail, setCurrentEmail] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [currentPwd, setCurrentPwd] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    import('firebase/auth').then(({ getAuth }) => {
      const user = getAuth().currentUser
      if (user) setCurrentEmail(user.email || '')
    }).catch(() => {})
  }, [])

  const handleSave = async () => {
    setErr('')
    if (!currentPwd) { setErr('يرجى إدخال كلمة المرور الحالية للتأكيد'); return }
    if (!newEmail && !newPwd) { setErr('أدخل بريداً إلكترونياً جديداً أو كلمة مرور جديدة'); return }
    if (newPwd && newPwd !== confirmPwd) { setErr('كلمة المرور الجديدة غير متطابقة مع التأكيد'); return }
    if (newPwd && newPwd.length < 6) { setErr('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل'); return }

    setBusy(true)
    try {
      const { getAuth, EmailAuthProvider, reauthenticateWithCredential, updateEmail, updatePassword } = await import('firebase/auth')
      const auth = getAuth()
      const user = auth.currentUser
      if (!user) { setErr('لا يوجد مستخدم مسجل دخوله'); return }

      const credential = EmailAuthProvider.credential(user.email, currentPwd)
      await reauthenticateWithCredential(user, credential)

      if (newEmail && newEmail !== user.email) await updateEmail(user, newEmail)
      if (newPwd) await updatePassword(user, newPwd)

      const updated = getAuth().currentUser
      if (updated) setCurrentEmail(updated.email || '')
      setNewEmail(''); setNewPwd(''); setConfirmPwd(''); setCurrentPwd('')
      onToast?.('تم تحديث بيانات الدخول بنجاح', 'success')
    } catch (e) {
      const msgs = {
        'auth/requires-recent-login': 'يرجى تسجيل الخروج وإعادة الدخول ثم المحاولة مرة أخرى',
        'auth/wrong-password': 'كلمة المرور الحالية غير صحيحة',
        'auth/invalid-credential': 'كلمة المرور الحالية غير صحيحة',
        'auth/invalid-email': 'البريد الإلكتروني غير صالح',
        'auth/email-already-in-use': 'البريد الإلكتروني مستخدم بالفعل',
        'auth/weak-password': 'كلمة المرور ضعيفة — استخدم 6 أحرف على الأقل',
      }
      setErr(msgs[e.code] || 'فشل التحديث: ' + e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <SectionCard title="🔐 إعدادات تسجيل الدخول" subtitle="تحديث البريد الإلكتروني أو كلمة المرور الخاصة بحساب مدير الموقع">
      <div style={{ display: 'grid', gap: 14, maxWidth: 460 }}>
        <Field label="البريد الإلكتروني الحالي">
          <TextInput value={currentEmail} disabled style={{ opacity: 0.65, direction: 'ltr', textAlign: 'right' }} />
        </Field>

        <Field label="البريد الإلكتروني الجديد (اختياري)">
          <TextInput
            value={newEmail}
            placeholder="admin@newemail.com"
            style={{ direction: 'ltr', textAlign: 'right' }}
            onChange={e => setNewEmail(e.target.value)}
          />
        </Field>

        <Field label="كلمة المرور الجديدة (اختياري)">
          <TextInput type="password" value={newPwd} placeholder="••••••••" onChange={e => setNewPwd(e.target.value)} />
        </Field>

        <Field label="تأكيد كلمة المرور الجديدة">
          <TextInput type="password" value={confirmPwd} placeholder="••••••••" onChange={e => setConfirmPwd(e.target.value)} />
        </Field>

        <Field label="كلمة المرور الحالية (مطلوبة للتأكيد)" hint="مطلوبة لحماية الحساب قبل تطبيق التعديلات">
          <TextInput type="password" accent={T.red} value={currentPwd} placeholder="أدخل كلمة المرور الحالية" onChange={e => setCurrentPwd(e.target.value)} />
        </Field>

        {err && <div style={{ padding: '10px 12px', borderRadius: 10, background: T.redSoft, color: '#fca5a5', fontSize: 13, fontWeight: 600 }}>{err}</div>}

        <button type="button" onClick={handleSave} disabled={busy} style={{ ...S.primaryBtn, padding: '12px 24px', opacity: busy ? 0.65 : 1 }}>
          {busy ? '⏳ جارٍ الحفظ...' : '🔐 حفظ بيانات الدخول'}
        </button>
      </div>
    </SectionCard>
  )
}
