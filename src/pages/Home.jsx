import { Helmet } from 'react-helmet-async'
import { useOutletContext } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import VideoSection from '../components/VideoSection'
import { OffersSection, ServicesSection, PricingSection, GallerySection, TestimonialsSection, ServiceAreasSection } from '../components/Sections'
import FAQSection from '../components/FAQSection'
import BookingForm from '../components/BookingForm'

export default function Home() {
  const { t, scrollTo, video } = useOutletContext()

  return (
    <>
      <Helmet>
        <title>هلالي موفينج - شركة نقل أثاث في القاهرة والإسكندرية وجميع المحافظات</title>
        <meta name="description" content="شركة نقل أثاث في القاهرة (مدينة نصر، مصر الجديدة، المعادي، التجمع الخامس)، الإسكندرية، الشيخ زايد، 6 أكتوبر. فك وتركيب وتغليف بأفضل الأسعار. احصل على عرض سعر مجاني." />
        <link rel="canonical" href="https://helalymoving.tryasp.net/" />
      </Helmet>
      <HeroSection t={t} scrollTo={scrollTo} />
      <VideoSection video={video} key={video.src} />
      <OffersSection t={t} />
      <ServicesSection t={t} />
      <ServiceAreasSection t={t} />
      <PricingSection t={t} />
      <GallerySection t={t} />
      <TestimonialsSection t={t} />
      <FAQSection t={t} />
      <BookingForm t={t} lang="ar" />
    </>
  )
}
