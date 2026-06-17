import { useTheme } from '../theme'
import { Reveal } from '../Reveal'
import SectionHeader from './SectionHeader'

export function TrustBadgesSection({ t }) {
    const th = useTheme()

    if (!t?.trust) return null

    return (
        <section className="py-24 px-6 bg-brand-section">
            <div className="max-w-[1100px] mx-auto">
                <SectionHeader title={t.trust.title} sub={t.trust.sub} />

                {/* Trust Badges Grid */}
                <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 mb-16">
                    {t.trust.badges.map((badge, i) => (
                        <Reveal key={i} delay={i * 80}>
                            <div className="bg-brand-card rounded-[20px] border border-brand-border p-8 shadow-brand-sm text-center transition-all duration-300 hover:border-brand-accent hover:shadow-lg hover:-translate-y-1">
                                <div className="text-5xl mb-3">{badge.icon}</div>
                                <div className="text-3xl font-black text-brand-accent mb-2">{badge.num}</div>
                                <div className="font-extrabold text-[17px] text-brand-text mb-2">{badge.label}</div>
                                <p className="text-brand-muted text-sm leading-relaxed">{badge.desc}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>

                {/* Guarantees Section */}
                <div>
                    <h3 className="font-extrabold text-2xl text-brand-text text-center mb-1">✨ ضماناتنا المطلقة</h3>
                    <p className="text-brand-muted text-center mb-8 text-sm">ثلاثة ضمانات تجعلك مرتاح البال تماماً</p>

                    <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
                        {t.trust.guarantees.map((guarantee, i) => (
                            <Reveal key={i} delay={i * 100}>
                                <div className="relative">
                                    {/* Gradient border effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/20 to-transparent rounded-[22px]" />

                                    <div className="relative bg-brand-card rounded-[22px] border border-brand-border p-7 shadow-brand transition-all duration-300 hover:border-brand-accent hover:shadow-lg">
                                        <div className="text-4xl mb-4">{guarantee.icon}</div>
                                        <h4 className="font-extrabold text-[18px] text-brand-text mb-2.5">{guarantee.title}</h4>
                                        <p className="text-brand-muted text-sm leading-relaxed">{guarantee.desc}</p>

                                        {/* Checkmark decoration */}
                                        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-brand-accent/10 flex items-center justify-center">
                                            <span className="text-brand-accent font-extrabold">✓</span>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>

                {/* Trust Statement */}
                <Reveal>
                    <div className="mt-16 p-8 bg-gradient-to-r from-brand-accent/10 via-transparent to-brand-accent/5 rounded-[24px] border border-brand-accent/20 text-center">
                        <p className="text-brand-text font-extrabold mb-2">🎯 عهدنا لك</p>
                        <p className="text-brand-muted max-w-[600px] mx-auto">
                            نحن لا نقل فقط أثاثك — نحن ننقل ذكرياتك وأحلامك. ثقتك هي أغلى ما نملك، ولهذا نعطيك ضمانات قوية على كل خدمة.
                        </p>
                    </div>
                </Reveal>
            </div>
        </section>
    )
}
