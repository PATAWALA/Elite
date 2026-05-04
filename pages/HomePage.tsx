import HeroSection from '../components/sections/HeroSection';
import FeaturedVehicles from '../components/sections/FeaturedVehicles';
import OtherProducts from '../components/sections/OtherProducts';
import WhyChooseUs from '../components/sections/WhyChooseUs';
import CtaSection from '../components/sections/CtaSection';

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <FeaturedVehicles />
      <OtherProducts />
      <WhyChooseUs />
      <CtaSection />
    </>
  );
};

export default HomePage;