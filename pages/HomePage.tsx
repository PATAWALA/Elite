import HeroSection from '../src/components/sections/HeroSection';
import FeaturedVehicles from '../src/components/sections/FeaturedVehicles';
import OtherProducts from '../src/components/sections/OtherProducts';
import WhyChooseUs from '../src/components/sections/WhyChooseUs';
import CtaSection from '../src/components/sections/CtaSection';

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