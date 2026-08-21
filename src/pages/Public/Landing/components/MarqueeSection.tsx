type MarqueeSectionProps = {
  marqueeText: string;
};

export default function MarqueeSection({ marqueeText }: MarqueeSectionProps) {
  return (
    <div className="orbit-marquee">
      <div className="orbit-marquee-track">
        <span style={{ paddingRight: 12 }}>{marqueeText}</span>
        <span style={{ paddingRight: 12 }}>{marqueeText}</span>
      </div>
    </div>
  );
}
