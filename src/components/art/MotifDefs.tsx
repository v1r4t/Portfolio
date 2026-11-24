'use client'

/**
 * MotifDefs — the painted vocabulary of the lorry.
 * Rendered once per page so panels can <use href="#m-…" /> any motif.
 * Existing symbols ported from the original build; bulb, star, chakra and
 * kite are new for the maximalist skin.
 */
export const MotifDefs = () => {
  return (
    <svg className="motif-defs" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <path id="m-chilli-pod" d="M0 6 C-12 40 -13 98 0 154 C6 170 17 168 19 150 C23 94 14 38 0 6Z" />
        <path id="m-chilli-cal" d="M-6 4 Q0 -7 6 4 Q0 12 -6 4Z" />

        {/* Lotus Symbol */}
        <symbol id="m-lotus" viewBox="0 0 100 100">
          <g stroke="#0a0a0a" strokeWidth="2.6" strokeLinejoin="round">
            <path d="M50 92 C18 72 14 40 50 12 C86 40 82 72 50 92Z" fill="#ffd400" />
            <path d="M50 92 C8 78 2 50 32 26 C42 52 46 74 50 92Z" fill="#00b3b0" />
            <path d="M50 92 C92 78 98 50 68 26 C58 52 54 74 50 92Z" fill="#00b3b0" />
            <path d="M50 32 Q57 52 50 70 Q43 52 50 32Z" fill="#e2231a" />
            <path d="M50 88 Q34 78 30 62" fill="none" strokeWidth="2" />
            <path d="M50 88 Q66 78 70 62" fill="none" strokeWidth="2" />
          </g>
        </symbol>

        {/* Marigold Flower */}
        <symbol id="m-marigold" viewBox="0 0 100 100">
          <g stroke="#0a0a0a" strokeWidth="2.2">
            <g fill="#ffd400">
              {Array.from({ length: 10 }, (_, i) => (
                <ellipse key={i} cx="50" cy="27" rx="8" ry="16" transform={`rotate(${i * 36} 50 50)`} />
              ))}
            </g>
            <circle cx="50" cy="50" r="11" fill="#e2231a" />
          </g>
        </symbol>

        {/* Paisley (Kalka) Motif */}
        <symbol id="m-paisley" viewBox="0 0 100 120">
          <g stroke="#0a0a0a" strokeWidth="2.8" strokeLinejoin="round">
            <path
              d="M62 112 C20 100 6 62 30 30 C50 4 86 14 82 46 C79 68 54 70 48 52 C44 40 58 32 65 42"
              fill="#1b3a8c"
            />
            <circle cx="55" cy="52" r="6" fill="#ffd400" />
            <circle cx="43" cy="74" r="4" fill="#8cc63f" />
            <circle cx="63" cy="82" r="3" fill="#ffd400" />
          </g>
        </symbol>

        {/* Regal Peacock */}
        <symbol id="m-peacock" viewBox="0 0 200 240">
          <g stroke="#0a0a0a" strokeWidth="3" strokeLinejoin="round">
            <path d="M100 150 C8 128 8 26 100 8 C192 26 192 128 100 150Z" fill="#00b3b0" />
            <g fill="none" stroke="#ffd400" strokeWidth="3.2">
              <path d="M100 145 Q48 88 38 26" />
              <path d="M100 145 Q74 72 68 18" />
              <path d="M100 145 L100 12" />
              <path d="M100 145 Q126 72 132 18" />
              <path d="M100 145 Q152 88 162 26" />
            </g>
            <g fill="#1b3a8c">
              <circle cx="38" cy="26" r="7" />
              <circle cx="68" cy="18" r="7" />
              <circle cx="100" cy="12" r="7" />
              <circle cx="132" cy="18" r="7" />
              <circle cx="162" cy="26" r="7" />
            </g>
            <path d="M88 150 Q78 198 90 234 L112 234 Q124 198 112 150Z" fill="#1b3a8c" />
            <circle cx="118" cy="158" r="12" fill="#1b3a8c" />
            <path d="M130 158 L148 164 L130 170Z" fill="#ffd400" />
            <circle cx="121" cy="155" r="2.5" fill="#0a0a0a" />
          </g>
        </symbol>

        {/* Elephant Motif */}
        <symbol id="m-elephant" viewBox="0 0 220 170">
          <g stroke="#0a0a0a" strokeWidth="3" strokeLinejoin="round">
            <rect x="52" y="112" width="24" height="52" rx="7" fill="#1b3a8c" />
            <rect x="86" y="116" width="24" height="48" rx="7" fill="#1b3a8c" />
            <rect x="120" y="116" width="24" height="48" rx="7" fill="#1b3a8c" />
            <rect x="150" y="112" width="24" height="52" rx="7" fill="#1b3a8c" />
            <ellipse cx="100" cy="92" rx="74" ry="44" fill="#00b3b0" />
            <path d="M44 66 Q100 44 156 66 L150 102 Q100 116 50 102Z" fill="#e2231a" />
            <path d="M60 60 L66 96 M86 54 L90 100 M114 54 L110 100 M140 58 L134 96" fill="none" stroke="#ffd400" strokeWidth="3" />
            <circle cx="178" cy="88" r="34" fill="#00b3b0" />
            <ellipse cx="152" cy="92" rx="17" ry="27" fill="#ffd400" transform="rotate(-10 152 92)" />
            <path d="M198 100 Q214 132 196 156" fill="none" stroke="#0a0a0a" strokeWidth="20" strokeLinecap="round" />
            <path d="M198 100 Q214 132 196 156" fill="none" stroke="#00b3b0" strokeWidth="13" strokeLinecap="round" />
            <path d="M198 108 L210 124 L192 120Z" fill="#fff8e7" />
            <circle cx="186" cy="78" r="4" fill="#0a0a0a" />
          </g>
        </symbol>

        {/* Parrot Motif */}
        <symbol id="m-parrot" viewBox="0 0 120 170">
          <g stroke="#0a0a0a" strokeWidth="3" strokeLinejoin="round">
            <path d="M60 108 Q76 136 74 166 L56 154 L38 166 Q46 136 52 108Z" fill="#8cc63f" />
            <ellipse cx="58" cy="92" rx="29" ry="42" fill="#00b3b0" />
            <path d="M40 74 Q54 86 74 96 Q58 112 44 100 Q34 88 40 74Z" fill="#e2231a" />
            <circle cx="62" cy="44" r="24" fill="#00b3b0" />
            <path d="M84 38 Q104 44 84 56Z" fill="#ffd400" />
            <path d="M56 22 Q60 8 70 12 Q64 18 64 24Z" fill="#e2231a" />
            <circle cx="70" cy="40" r="4" fill="#0a0a0a" />
          </g>
        </symbol>

        {/* Flower Motif */}
        <symbol id="m-flower" viewBox="0 0 100 100">
          <g stroke="#0a0a0a" strokeWidth="2.4">
            <g fill="#ffd400">
              {Array.from({ length: 8 }, (_, i) => (
                <ellipse key={i} cx="50" cy="25" rx="11" ry="21" transform={`rotate(${i * 45} 50 50)`} />
              ))}
            </g>
            <circle cx="50" cy="50" r="10" fill="#e2231a" />
          </g>
        </symbol>

        {/* Jhumka Earring */}
        <symbol id="m-jhumka" viewBox="0 0 100 150">
          <g stroke="#0a0a0a" strokeWidth="3" strokeLinejoin="round">
            <path d="M50 8 Q74 8 74 26 Q74 42 52 46" fill="none" strokeWidth="4" />
            <circle cx="50" cy="52" r="9" fill="#ffd400" />
            <path d="M22 96 Q22 62 50 58 Q78 62 78 96Z" fill="#ffd400" />
            <path d="M17 96 L83 96" strokeWidth="5" />
            <circle cx="30" cy="108" r="5" fill="#e2231a" />
            <circle cx="50" cy="114" r="6" fill="#00b3b0" />
            <circle cx="70" cy="108" r="5" fill="#e2231a" />
          </g>
        </symbol>

        {/* Film Reel */}
        <symbol id="m-reel" viewBox="0 0 120 120">
          <g stroke="#0a0a0a" strokeWidth="3">
            <circle cx="60" cy="60" r="52" fill="#1b3a8c" />
            <circle cx="60" cy="60" r="13" fill="#fff8e7" />
            <circle cx="60" cy="26" r="9" fill="#fff8e7" />
            <circle cx="60" cy="94" r="9" fill="#fff8e7" />
            <circle cx="26" cy="60" r="9" fill="#fff8e7" />
            <circle cx="94" cy="60" r="9" fill="#fff8e7" />
          </g>
        </symbol>

        {/* Cassette Tape */}
        <symbol id="m-cassette" viewBox="0 0 160 100">
          <g stroke="#0a0a0a" strokeWidth="3" strokeLinejoin="round">
            <rect x="4" y="6" width="152" height="88" rx="8" fill="#e2231a" />
            <rect x="18" y="16" width="124" height="36" rx="4" fill="#fff8e7" />
            <circle cx="52" cy="34" r="12" fill="#ffd400" />
            <circle cx="108" cy="34" r="12" fill="#ffd400" />
            <path d="M42 68 L118 68 L106 88 L54 88Z" fill="#1b3a8c" />
          </g>
        </symbol>

        {/* Auto Rickshaw */}
        <symbol id="m-auto" viewBox="0 0 160 120">
          <g stroke="#0a0a0a" strokeWidth="3" strokeLinejoin="round">
            <path d="M18 76 L18 50 Q18 24 58 22 L102 22 Q130 24 130 50 L130 76Z" fill="#ffd400" />
            <path d="M27 70 L27 50 Q27 33 58 31 L94 31 L94 70Z" fill="#fff8e7" />
            <rect x="8" y="70" width="140" height="26" rx="6" fill="#00b3b0" />
            <circle cx="44" cy="100" r="15" fill="#0a0a0a" />
            <circle cx="44" cy="100" r="5" fill="#fff8e7" />
            <circle cx="118" cy="100" r="15" fill="#0a0a0a" />
            <circle cx="118" cy="100" r="5" fill="#fff8e7" />
          </g>
        </symbol>

        {/* Diya Lamp */}
        <symbol id="m-diya" viewBox="0 0 120 90">
          <g stroke="#0a0a0a" strokeWidth="3" strokeLinejoin="round">
            <path d="M60 10 Q74 28 67 40 Q63 50 53 42 Q45 32 60 10Z" fill="#e2231a" />
            <path d="M16 52 Q60 44 104 52 Q102 60 94 64 Q60 76 26 64 Q18 60 16 52Z" fill="#ffd400" />
            <circle cx="60" cy="40" r="5" fill="#fff8e7" />
          </g>
        </symbol>

        {/* Kalash Pot */}
        <symbol id="m-kalash" viewBox="0 0 110 130">
          <g stroke="#0a0a0a" strokeWidth="3" strokeLinejoin="round">
            <path d="M30 62 Q8 78 14 104 Q20 126 55 126 Q90 126 96 104 Q102 78 80 62Z" fill="#ffd400" />
            <path d="M36 104 Q55 96 74 104" fill="none" strokeWidth="3" />
            <rect x="34" y="46" width="42" height="18" rx="5" fill="#e2231a" />
            <path d="M24 32 Q55 6 86 32 Q55 42 24 32Z" fill="#8cc63f" />
            <circle cx="55" cy="20" r="11" fill="#1b3a8c" />
            <path d="M55 9 Q57 2 63 0" fill="none" strokeWidth="3" />
          </g>
        </symbol>

        {/* Nimbu-Mirchi (evil-eye ward) */}
        <symbol id="m-chilli" viewBox="0 0 180 240">
          <g stroke="#0a0a0a" strokeWidth="3" strokeLinejoin="round">
            <path d="M90 0 L90 26" fill="none" strokeWidth="2.4" />
            <circle cx="90" cy="29" r="4.5" fill="#ffd400" />
            <path d="M90 33 C76 24 64 28 58 39 C72 42 82 39 90 33Z" fill="#8cc63f" />
            <path d="M90 33 C104 24 116 28 122 39 C108 42 98 39 90 33Z" fill="#8cc63f" />
          </g>
          <g transform="translate(90 36)">
            {[-24, 0, 24].map((angle) => (
              <g key={angle} transform={`rotate(${angle})`}>
                <use href="#m-chilli-pod" fill="#fff8e7" stroke="#fff8e7" strokeWidth="8" />
                <use href="#m-chilli-cal" fill="#fff8e7" stroke="#fff8e7" strokeWidth="7" />
                <use href="#m-chilli-pod" fill="#e2231a" stroke="#0a0a0a" strokeWidth="4" strokeLinejoin="round" />
                <use href="#m-chilli-cal" fill="#8cc63f" stroke="#0a0a0a" strokeWidth="2.4" strokeLinejoin="round" />
                <path d="M2 24 C-5 58 -5 106 2 136" fill="none" stroke="#fff8e7" strokeWidth="2.2" opacity="0.35" />
              </g>
            ))}
          </g>
        </symbol>

        {/* ——— NEW FOR THE PAINTED-LORRY SKIN ——— */}

        {/* Electric bulb (for bulb chains) */}
        <symbol id="m-bulb" viewBox="0 0 48 72">
          <g stroke="#0a0a0a" strokeWidth="2.4" strokeLinejoin="round">
            <rect x="17" y="34" width="14" height="10" rx="2" fill="#1b3a8c" />
            <path d="M20 44 L20 50 L28 50 L28 44" fill="#0a0a0a" />
            <circle cx="24" cy="22" r="16" fill="#ffd400" />
            <path d="M19 22 Q24 15 29 22" fill="none" strokeWidth="1.8" />
            <path d="M19 26 Q24 19 29 26" fill="none" strokeWidth="1.8" />
            <path d="M24 50 L24 56" fill="none" strokeWidth="2" />
          </g>
        </symbol>

        {/* 8-point star */}
        <symbol id="m-star" viewBox="0 0 100 100">
          <path
            d="M50 2 L60 28 L86 14 L78 42 L98 50 L78 58 L86 86 L60 72 L50 98 L40 72 L14 86 L22 58 L2 50 L22 42 L14 14 L40 28Z"
            fill="#ffd400"
            stroke="#0a0a0a"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="50" cy="50" r="8" fill="#e2231a" stroke="#0a0a0a" strokeWidth="2.4" />
        </symbol>

        {/* Chakra wheel */}
        <symbol id="m-chakra" viewBox="0 0 100 100">
          <g stroke="#0a0a0a" strokeWidth="2.6">
            <circle cx="50" cy="50" r="44" fill="#fff8e7" />
            <circle cx="50" cy="50" r="34" fill="none" />
            {Array.from({ length: 12 }, (_, i) => (
              <path key={i} d="M50 50 L50 12" transform={`rotate(${i * 30} 50 50)`} strokeWidth="2" />
            ))}
            <circle cx="50" cy="50" r="9" fill="#e2231a" />
          </g>
        </symbol>

        {/* Kite (patang) */}
        <symbol id="m-kite" viewBox="0 0 100 130">
          <g stroke="#0a0a0a" strokeWidth="2.8" strokeLinejoin="round">
            <path d="M50 4 L92 48 L50 96 L8 48Z" fill="#e2231a" />
            <path d="M50 4 L50 96 M8 48 L92 48" fill="none" strokeWidth="2" />
            <path d="M50 96 Q42 116 58 122 Q68 126 62 112" fill="none" strokeWidth="2.4" />
          </g>
        </symbol>
      </defs>
    </svg>
  )
}
