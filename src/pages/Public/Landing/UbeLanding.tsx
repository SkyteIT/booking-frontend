import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";
import "./orbitLanding.css";
import { useLandingListings } from "./useLandingListings";
import { GRADIENTS, CHIP_POS, cardBackground } from "./landingData";
import { useHeroDeck } from "./hooks/useHeroDeck";
import { useFeaturedFlow } from "./hooks/useFeaturedFlow";
import { useRevealOnScroll } from "./hooks/useRevealOnScroll";
import { useStageTilt } from "./hooks/useStageTilt";
import HeroSection from "./components/HeroSection";
import MarqueeSection from "./components/MarqueeSection";
import CategoryFanSection from "./components/CategoryFanSection";
import FeaturedFlowSection from "./components/FeaturedFlowSection";
import StepsSection from "./components/StepsSection";
import CtaSection from "./components/CtaSection";

const UbeLanding = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const stageRef = useRef<HTMLDivElement>(null);
  const { loading, categoryStats, featuredListings, totalListings } = useLandingListings();
  const categories = categoryStats;

  const { activeHeroIndex, heroWords, deckCards, setHeroIndex } = useHeroDeck(categories);
  const {
    flowIndex,
    setFlowIndex,
    flowWrapRef,
    dragOffset,
    dragMoved,
    onFlowPointerDown,
    flowSource,
    flowCards,
  } = useFeaturedFlow(featuredListings);

  useRevealOnScroll();
  useStageTilt(stageRef);

  const chips = categories.slice(0, CHIP_POS.length).map((c, i) => ({
    ...c,
    ...CHIP_POS[i],
    bg: GRADIENTS[i % GRADIENTS.length],
  }));
  const fanCards = categories.map((c, i) => ({
    ...c,
    num: `0${i + 1}`,
    bg: cardBackground(c.name, GRADIENTS[i % GRADIENTS.length], i + 1),
    rot: `${((i - (categories.length - 1) / 2) * 12).toFixed(1)}deg`,
  }));

  const marqueeText = `${categories.map((c) => c.name).join(" ✦ ")} ✦ `.repeat(2);

  const goExplore = () => navigate("/search");
  const goStartExploring = () => navigate(isAuthenticated ? "/search" : "/register");
  const openListing = (id: string) => navigate(`/view-product/${id}`);

  // The search page filters by the fixed ListingCategory type enum
  // (Hotel/Restaurant/Event/CarRental/Activity). "Apartments" isn't one of
  // those types, so it falls back to a text search instead of a category filter.
  const goToCategory = (categoryName: string) => {
    const key = categoryName.trim().toLowerCase();
    const typeMap: Record<string, string> = {
      hotels: "Hotel",
      restaurants: "Restaurant",
      events: "Event",
      activities: "Activity",
      "car rentals": "CarRental",
    };
    const type = typeMap[key];
    navigate(type ? `/search?category=${type}` : `/search?q=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="orbit-page">
      {/* real site nav comes from MainLayout/CustomerNavbar */}
      <HeroSection
        stageRef={stageRef}
        loading={loading}
        totalListings={totalListings}
        categoryCount={categories.length}
        activeHeroIndex={activeHeroIndex}
        heroWords={heroWords}
        deckCards={deckCards}
        categories={categories}
        setHeroIndex={setHeroIndex}
        chips={chips}
        goExplore={goExplore}
      />

      <MarqueeSection marqueeText={marqueeText} />

      <CategoryFanSection fanCards={fanCards} goToCategory={goToCategory} />

      <FeaturedFlowSection
        loading={loading}
        hasListings={flowSource.length > 0}
        flowWrapRef={flowWrapRef}
        onFlowPointerDown={onFlowPointerDown}
        dragOffset={dragOffset}
        flowCards={flowCards}
        flowIndex={flowIndex}
        setFlowIndex={setFlowIndex}
        dragMoved={dragMoved}
        onOpenListing={openListing}
      />

      <StepsSection />

      <CtaSection onStartExploring={goStartExploring} />
    </div>
  );
};

export default UbeLanding;
