import Link from "next/link";

type StoreCardProps = { name: string; area: string; distance: string; lastUpdate: string };

export function StoreCard({ name, area, distance, lastUpdate }: StoreCardProps) {
  return (
    <Link className="store-card" href="/stores">
      <div className="store-icon" aria-hidden="true">🛒</div>
      <div>
        <h3>{name}</h3>
        <p>{area} ・ {distance}</p>
        <small>最新の投稿 {lastUpdate}</small>
      </div>
      <span className="arrow" aria-hidden="true">→</span>
    </Link>
  );
}
