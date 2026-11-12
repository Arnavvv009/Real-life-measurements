import React from 'react';

/* =========================================================================
   MEASURE DIAGRAM — a picture of the measuring tool plus the given amount
   and what is being asked, for each practice question.
   ========================================================================= */
const VW = 360;
const VH = 210;

function Icon({ type }) {
  switch (type) {
    case 'length':
      return (
        <g>
          <rect x="18" y="80" width="130" height="44" rx="6" fill="#facc15" fillOpacity="0.25" stroke="#facc15" strokeWidth="3" />
          {[...Array(14)].map((_, i) => (
            <line key={i} x1={26 + i * 9} y1="80" x2={26 + i * 9} y2={i % 5 === 0 ? 104 : 94} stroke="#facc15" strokeWidth="2" />
          ))}
          <text x="83" y="116" fill="#fde047" fontSize="12" fontWeight="900" textAnchor="middle">cm</text>
        </g>
      );
    case 'mass':
      return (
        <g>
          <rect x="30" y="140" width="110" height="18" rx="5" fill="#64748b" />
          <circle cx="85" cy="100" r="40" fill="#0c0424" stroke="#38bdf8" strokeWidth="4" />
          {[...Array(12)].map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return <line key={i} x1={85 + 32 * Math.sin(a)} y1={100 - 32 * Math.cos(a)} x2={85 + 38 * Math.sin(a)} y2={100 - 38 * Math.cos(a)} stroke="#7dd3fc" strokeWidth="2" />;
          })}
          <line x1="85" y1="100" x2="108" y2="78" stroke="#f472b6" strokeWidth="4" strokeLinecap="round" />
          <text x="85" y="126" fill="#7dd3fc" fontSize="11" fontWeight="900" textAnchor="middle">kg</text>
        </g>
      );
    case 'capacity':
      return (
        <g>
          <rect x="45" y="100" width="80" height="70" fill="#38bdf8" fillOpacity="0.45" />
          <path d="M45 45 v125 h80 v-125" fill="none" stroke="#e2e8f0" strokeWidth="4" />
          <path d="M125 65 q30 8 0 55" fill="none" stroke="#e2e8f0" strokeWidth="4" />
          {[70, 100, 130].map(y => <line key={y} x1="45" y1={y} x2="60" y2={y} stroke="#e2e8f0" strokeWidth="2" />)}
          <text x="85" y="140" fill="#ffffff" fontSize="12" fontWeight="900" textAnchor="middle">mL</text>
        </g>
      );
    case 'time':
      return (
        <g>
          <circle cx="85" cy="105" r="55" fill="#0c0424" stroke="#c084fc" strokeWidth="5" />
          {[...Array(12)].map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return <circle key={i} cx={85 + 45 * Math.sin(a)} cy={105 - 45 * Math.cos(a)} r={i % 3 === 0 ? 3.5 : 2} fill="#e9d5ff" />;
          })}
          <line x1="85" y1="105" x2="85" y2="68" stroke="#facc15" strokeWidth="4" strokeLinecap="round" />
          <line x1="85" y1="105" x2="112" y2="118" stroke="#f472b6" strokeWidth="5" strokeLinecap="round" />
          <circle cx="85" cy="105" r="5" fill="#fff" />
        </g>
      );
    case 'speed':
      return (
        <g>
          <rect x="10" y="140" width="150" height="10" fill="#475569" />
          {[0, 1, 2, 3, 4].map(i => <rect key={i} x={18 + i * 30} y="143" width="16" height="4" fill="#facc15" />)}
          <path d="M30 128 h70 l20 -22 h-50 l-14 22" fill="#f472b6" stroke="#fbcfe8" strokeWidth="2" />
          <rect x="22" y="112" width="110" height="20" rx="8" fill="#f472b6" />
          <circle cx="45" cy="134" r="9" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
          <circle cx="110" cy="134" r="9" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
          <path d="M60 70 a28 28 0 0 1 56 0" fill="none" stroke="#38bdf8" strokeWidth="5" />
          <line x1="88" y1="70" x2="104" y2="52" stroke="#facc15" strokeWidth="4" strokeLinecap="round" />
        </g>
      );
    case 'area':
      return (
        <g>
          <rect x="30" y="50" width="110" height="110" fill="#38bdf8" fillOpacity="0.15" stroke="#38bdf8" strokeWidth="3" />
          {[1, 2, 3, 4].map(i => (
            <g key={i}>
              <line x1={30 + i * 22} y1="50" x2={30 + i * 22} y2="160" stroke="#7dd3fc" strokeOpacity="0.6" strokeWidth="1.5" />
              <line x1="30" y1={50 + i * 22} x2="140" y2={50 + i * 22} stroke="#7dd3fc" strokeOpacity="0.6" strokeWidth="1.5" />
            </g>
          ))}
          <rect x="30" y="50" width="22" height="22" fill="#facc15" fillOpacity="0.7" />
        </g>
      );
    case 'price':
      return (
        <g>
          <path d="M30 70 l40 -30 h70 v100 h-70 z" fill="#facc15" fillOpacity="0.3" stroke="#facc15" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="58" cy="90" r="7" fill="#0c0424" stroke="#facc15" strokeWidth="2" />
          <text x="108" y="96" fill="#fde047" fontSize="30" fontWeight="900" textAnchor="middle">$</text>
          <path d="M40 160 q40 -18 100 0 l-8 18 h-84z" fill="#fde047" fillOpacity="0.6" stroke="#fde047" strokeWidth="2" />
        </g>
      );
    default:
      return null;
  }
}

export function MeasureDiagram({ diagramData, size = 190 }) {
  if (!diagramData) return null;
  const d = diagramData;
  const ask = d.ask || '';
  const long = ask.length > 22;
  return (
    <div className="flex items-center justify-center my-1">
      <svg width={size * (VW / VH)} height={size} viewBox={`0 0 ${VW} ${VH}`} className="max-w-full drop-shadow-[0_0_18px_rgba(250,204,21,0.25)]">
        <Icon type={d.type} />
        <rect x="172" y="44" width="178" height="56" rx="12" fill="#14082c" stroke="#38bdf8" strokeWidth="2" />
        <text x="261" y="73" fill="#ffffff" fontSize={d.value.length > 18 ? 13 : 18} fontWeight="900" textAnchor="middle" dominantBaseline="middle">{d.value}</text>
        <text x="261" y="120" fill="#c4b5fd" fontSize="20" fontWeight="900" textAnchor="middle" dominantBaseline="middle">↓</text>
        <rect x="172" y="138" width="178" height="56" rx="12" fill="#14082c" stroke="#f472b6" strokeWidth="2" />
        <text x="261" y="167" fill="#f9a8d4" fontSize={long ? 10.5 : 18} fontWeight="900" textAnchor="middle" dominantBaseline="middle">{ask}</text>
        {d.side && <text x="85" y="198" fill="#cbd5e1" fontSize="12" fontWeight="800" textAnchor="middle">{d.side}</text>}
      </svg>
    </div>
  );
}
