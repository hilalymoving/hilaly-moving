import { useTheme } from '../theme'
import { Reveal } from '../Reveal'
import SectionHeader from './SectionHeader'

const STEP_COLORS = [
    { bg: 'from-indigo-500 to-indigo-600', light: '#eef2ff', icon: '💬' },
    { bg: 'from-emerald-500 to-emerald-600', light: '#d1fae5', icon: '✅' },
    { bg: 'from-amber-500 to-amber-600', light: '#fef3c7', icon: '📦' },
    { bg: 'from-blue-500 to-blue-600', light: '#e0f2fe', icon: '🚛' },
    { bg: 'from-rose-500 to-rose-600', light: '#ffe4e6', icon: '🎉' },
]

export function HowItWorksSection({ t }) {
    const th = useTheme()

    if (!t?.howItWorks) return null

    return (
        <section className="py-28 px-6 bg-brand-bg relative overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="max-w-[1200px] mx-auto relative z-10">
                <SectionHeader title={t.howItWorks.title} sub={t.howItWorks.sub} />

                {/* Desktop Timeline */}
                <div className="hidden md:block">
                    <div className="relative">
                        {/* Animated Connecting line */}
                        <style>{`
                            @keyframes slideRight {
                                from { width: 0; }
                                to { width: 100%; }
                            }
                            .animated-line {
                                animation: slideRight 2s ease-out forwards;
                            }
                        `}</style>

                        <div className="absolute top-12 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 via-emerald-500 to-rose-500 rounded-full animated-line shadow-lg" />

                        {/* Steps grid */}
                        <div className="grid grid-cols-5 gap-4">
                            {t.howItWorks.steps.map((step, i) => (
                                <Reveal key={i} delay={i * 120}>
                                    <div className="flex flex-col items-center relative">
                                        {/* Colored circle with 3D effect */}
                                        <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${STEP_COLORS[i].bg} flex items-center justify-center mb-7 relative z-20 shadow-2xl transform hover:scale-110 transition-transform duration-300`}>
                                            {/* Inner glow */}
                                            <div className="absolute inset-1 rounded-full bg-white/10 blur-sm" />

                                            <div className="text-center relative z-10">
                                                <div className="text-4xl mb-1">{step.icon}</div>
                                                <div className="text-xs font-extrabold text-white">الخطوة {step.num}</div>
                                            </div>
                                        </div>

                                        {/* Colored background box for content */}
                                        <div
                                            className="w-full rounded-xl p-5 shadow-lg border border-opacity-20"
                                            style={{
                                                backgroundColor: STEP_COLORS[i].light,
                                                borderColor: STEP_COLORS[i].bg
                                            }}
                                        >
                                            <h3 className="font-extrabold text-[16px] text-gray-900 mb-2 text-center">{step.title}</h3>
                                            <p className="text-gray-700 text-xs leading-relaxed text-center font-medium">{step.desc}</p>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobile Timeline */}
                <div className="md:hidden space-y-5">
                    {t.howItWorks.steps.map((step, i) => (
                        <Reveal key={i} delay={i * 100}>
                            <div className="flex gap-4">
                                {/* Left circle & line */}
                                <div className="flex flex-col items-center flex-shrink-0">
                                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${STEP_COLORS[i].bg} flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform`}>
                                        <div className="text-2xl">{step.icon}</div>
                                    </div>
                                    {i < t.howItWorks.steps.length - 1 && (
                                        <div className={`w-1.5 h-14 bg-gradient-to-b ${STEP_COLORS[i].bg} opacity-60 mt-2 rounded-full`} />
                                    )}
                                </div>

                                {/* Right content with background */}
                                <div className="flex-1 pt-1 pb-4">
                                    <div
                                        className="rounded-lg p-4 border shadow-md"
                                        style={{
                                            backgroundColor: STEP_COLORS[i].light,
                                        }}
                                    >
                                        <div className="font-extrabold text-xs text-gray-700 mb-1">الخطوة {step.num}</div>
                                        <h3 className="font-extrabold text-[15px] text-gray-900 mb-2">{step.title}</h3>
                                        <p className="text-gray-700 text-xs leading-relaxed font-medium">{step.desc}</p>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    )
}
