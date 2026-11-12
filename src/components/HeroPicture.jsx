import { useMemo } from 'react'
import { SVGS, svgUrl } from '../game/art/index.js'
import { FRAME_W, FRAME_H, HERO_W } from '../game/art/composeHero.js'

// Shows the hero wearing a costume, as stacked pictures (for menus).
export default function HeroPicture({ heroSvg, costume, className = '' }) {
  const urls = useMemo(
    () => ({
      hero: svgUrl(heroSvg, 12),
      under: costume ? svgUrl(SVGS[`${costume}Under`], 8) : null,
      over: costume ? svgUrl(SVGS[`${costume}Over`], 8) : null,
    }),
    [heroSvg, costume],
  )
  return (
    <div className={`hero-picture ${className}`} style={{ aspectRatio: `${FRAME_W} / ${FRAME_H}` }}>
      {urls.under && <img src={urls.under} alt="" className="layer" />}
      <img
        src={urls.hero}
        alt=""
        className="hero-layer"
        style={{ width: `${(HERO_W / FRAME_W) * 100}%`, left: `${((FRAME_W - HERO_W) / 2 / FRAME_W) * 100}%` }}
      />
      {urls.over && <img src={urls.over} alt="" className="layer" />}
    </div>
  )
}
