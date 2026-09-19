const fs = require('fs');
const path = require('path');

const iconDir = path.join(__dirname, '..', 'public', 'img', 'icons');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

const icons = {
  'kubernetes': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="46" fill="#326CE5" />
    <path d="M50 16L79.4 33v34L50 84 20.6 67V33L50 16z" stroke="#FFFFFF" stroke-width="4.5" fill="none" stroke-linejoin="round"/>
    <circle cx="50" cy="50" r="10" fill="#FFFFFF"/>
    <line x1="50" y1="20" x2="50" y2="40" stroke="#FFFFFF" stroke-width="4"/>
    <line x1="50" y1="60" x2="50" y2="80" stroke="#FFFFFF" stroke-width="4"/>
    <line x1="24" y1="35" x2="41" y2="45" stroke="#FFFFFF" stroke-width="4"/>
    <line x1="59" y1="55" x2="76" y2="65" stroke="#FFFFFF" stroke-width="4"/>
    <line x1="24" y1="65" x2="41" y2="55" stroke="#FFFFFF" stroke-width="4"/>
    <line x1="59" y1="45" x2="76" y2="35" stroke="#FFFFFF" stroke-width="4"/>
  </svg>`,

  'docker': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="20" fill="#2496ED" />
    <g fill="#FFFFFF">
      <rect x="24" y="38" width="10" height="10" rx="1.5" />
      <rect x="36" y="38" width="10" height="10" rx="1.5" />
      <rect x="48" y="38" width="10" height="10" rx="1.5" />
      <rect x="36" y="26" width="10" height="10" rx="1.5" />
      <rect x="48" y="26" width="10" height="10" rx="1.5" />
      <rect x="60" y="38" width="10" height="10" rx="1.5" />
      <path d="M84 48c-1-6-6-8-9-8-1 0-2 .2-3 .5 1-4-1-8-5-10-6-3-11 2-11 2s-3-2-8-2c-15 0-25 10-27 24-2 0-9 1-9 7 0 7 7 10 12 10h44c10 0 18-6 19-15 .2-.6.4-1.2.5-1.9 1-.4 2-.9 3-1.6 2-1.5 2.5-3 2.5-5z" fill-opacity="0.95" />
    </g>
  </svg>`,

  'podman': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="20" fill="#892CA0" />
    <path d="M50 20C32 20 22 32 22 48c0 14 8 26 21 30v-8c-8-3-13-11-13-22 0-12 7-20 20-20s20 8 20 20c0 11-5 19-13 22v8c13-4 21-16 21-30 0-16-10-28-28-28z" fill="#FFFFFF"/>
    <circle cx="42" cy="44" r="4" fill="#FFFFFF"/>
    <circle cx="58" cy="44" r="4" fill="#FFFFFF"/>
    <path d="M46 54h8l-4 6-4-6z" fill="#FFFFFF"/>
  </svg>`,

  'opentofu': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="20" fill="#FFDA1A" />
    <g fill="#1A1A1A">
      <path d="M50 18L76 33V63L50 78L24 63V33L50 18Z" stroke="#1A1A1A" stroke-width="5" fill="#FFE866"/>
      <path d="M50 18L76 33L50 48L24 33L50 18Z" fill="#1A1A1A" fill-opacity="0.15"/>
      <path d="M50 48V78L24 63V33L50 48Z" fill="#1A1A1A" fill-opacity="0.3"/>
      <circle cx="50" cy="48" r="7" fill="#1A1A1A"/>
    </g>
  </svg>`,

  'ansible': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="46" fill="#000000"/>
    <circle cx="50" cy="50" r="44" stroke="#EE0000" stroke-width="3"/>
    <path d="M50 20L68 76H56L51 60H39l-4 16H25L46 20h4zm-3 28l-5-16-5 16h10z" fill="#FFFFFF"/>
  </svg>`,

  'pulumi': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="20" fill="#241C35" />
    <polygon points="50,18 78,34 78,66 50,82 22,66 22,34" stroke="#F6B847" stroke-width="4" fill="none"/>
    <polygon points="50,28 69,39 69,61 50,72 31,61 31,39" fill="#8A3391"/>
    <polygon points="50,38 60,44 60,56 50,62 40,56 40,44" fill="#F6B847"/>
  </svg>`,

  'crossplane': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="20" fill="#192A3E" />
    <path d="M50 22L74 36V64L50 78L26 64V36L50 22Z" stroke="#25B4BE" stroke-width="4" fill="#0E1E2F"/>
    <circle cx="50" cy="36" r="6" fill="#25B4BE"/>
    <circle cx="36" cy="60" r="6" fill="#E86D82"/>
    <circle cx="64" cy="60" r="6" fill="#F3A63B"/>
    <line x1="50" y1="36" x2="36" y2="60" stroke="#FFFFFF" stroke-width="2.5" stroke-dasharray="3 3"/>
    <line x1="50" y1="36" x2="64" y2="60" stroke="#FFFFFF" stroke-width="2.5" stroke-dasharray="3 3"/>
    <line x1="36" y1="60" x2="64" y2="60" stroke="#FFFFFF" stroke-width="2.5"/>
  </svg>`,

  'argocd': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="46" fill="#EF6B3C" />
    <circle cx="50" cy="50" r="16" fill="#FFFFFF"/>
    <circle cx="50" cy="50" r="8" fill="#1D2A3A"/>
    <circle cx="28" cy="32" r="7" fill="#FFFFFF"/>
    <circle cx="72" cy="32" r="7" fill="#FFFFFF"/>
    <circle cx="24" cy="60" r="7" fill="#FFFFFF"/>
    <circle cx="76" cy="60" r="7" fill="#FFFFFF"/>
    <circle cx="50" cy="78" r="7" fill="#FFFFFF"/>
    <path d="M28 32 C38 40, 42 45, 50 50" stroke="#FFFFFF" stroke-width="4"/>
    <path d="M72 32 C62 40, 58 45, 50 50" stroke="#FFFFFF" stroke-width="4"/>
    <path d="M24 60 C36 58, 42 54, 50 50" stroke="#FFFFFF" stroke-width="4"/>
    <path d="M76 60 C64 58, 58 54, 50 50" stroke="#FFFFFF" stroke-width="4"/>
    <path d="M50 78 C50 68, 50 60, 50 50" stroke="#FFFFFF" stroke-width="4"/>
  </svg>`,

  'flux': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="20" fill="#326CE5" />
    <path d="M25 45 C35 25, 65 25, 75 45 C65 65, 35 65, 25 45 Z" stroke="#00D3A9" stroke-width="6" fill="none"/>
    <circle cx="25" cy="45" r="7" fill="#FFFFFF"/>
    <circle cx="75" cy="45" r="7" fill="#00D3A9"/>
    <circle cx="50" cy="55" r="5" fill="#FFFFFF"/>
  </svg>`,

  'jenkins': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="20" fill="#D33833" />
    <circle cx="50" cy="40" r="18" fill="#F4EDE6"/>
    <ellipse cx="50" cy="30" rx="14" ry="7" fill="#2E2E2E"/>
    <rect x="42" y="16" width="16" height="14" rx="3" fill="#2E2E2E"/>
    <path d="M36 62c0-8 6-12 14-12s14 4 14 12v18H36V62z" fill="#2E2E2E"/>
    <polygon points="50,56 46,62 54,62" fill="#D33833"/>
    <circle cx="45" cy="39" r="2.5" fill="#2E2E2E"/>
    <circle cx="55" cy="39" r="2.5" fill="#2E2E2E"/>
  </svg>`,

  'prometheus': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="46" fill="#E6522C"/>
    <path d="M50 18c0 14-14 22-14 34 0 9 7 16 16 16s16-7 16-16c0-10-8-18-12-25 4 4 6 10 6 15 0 6-4 10-10 10s-10-4-10-10c0-9 8-15 14-24z" fill="#FFFFFF"/>
    <circle cx="50" cy="80" r="3" fill="#FFFFFF"/>
  </svg>`,

  'grafana': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="20" fill="#F46800" />
    <path d="M50 20a30 30 0 1 0 30 30h-12a18 18 0 1 1-18-18V20z" fill="#FFFFFF"/>
    <circle cx="50" cy="50" r="8" fill="#FFFFFF"/>
    <circle cx="70" cy="28" r="6" fill="#FFC933"/>
  </svg>`,

  'opentelemetry': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="20" fill="#4B5B9D" />
    <circle cx="34" cy="36" r="9" fill="#00D084"/>
    <circle cx="66" cy="36" r="9" fill="#FFC933"/>
    <circle cx="50" cy="68" r="9" fill="#F46800"/>
    <path d="M34 36L66 36L50 68Z" stroke="#FFFFFF" stroke-width="4" fill="none" stroke-linejoin="round"/>
  </svg>`,

  'jaeger': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="20" fill="#60D0E4" />
    <path d="M22 66L38 32l16 20 16-18 10 32H22z" fill="#1D2A3A"/>
    <circle cx="38" cy="32" r="5" fill="#FFE866"/>
    <circle cx="70" cy="34" r="5" fill="#FFE866"/>
    <path d="M30 76h40" stroke="#1D2A3A" stroke-width="4" stroke-linecap="round"/>
  </svg>`,

  'loki': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="20" fill="#181B1F" />
    <polygon points="50,18 78,34 78,66 50,82 22,66 22,34" stroke="#F46800" stroke-width="4.5" fill="#24272D"/>
    <path d="M36 40h28v6H36zm0 12h20v6H36zm0 12h24v6H36z" fill="#F46800"/>
  </svg>`,

  'cilium': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="20" fill="#0E1E2F" />
    <polygon points="50,18 78,34 78,66 50,82 22,66 22,34" stroke="#F4A228" stroke-width="4" fill="#152638"/>
    <circle cx="40" cy="46" r="4" fill="#FFFFFF"/>
    <circle cx="60" cy="46" r="4" fill="#FFFFFF"/>
    <path d="M36 60c4 6 24 6 28 0" stroke="#F4A228" stroke-width="4" stroke-linecap="round"/>
    <line x1="50" y1="24" x2="50" y2="34" stroke="#FFFFFF" stroke-width="3"/>
  </svg>`,

  'istio': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="20" fill="#466BB0" />
    <polygon points="26,76 74,76 50,22" fill="#FFFFFF"/>
    <polygon points="36,76 64,76 50,38" fill="#466BB0"/>
    <polygon points="50,38 64,76 50,76" fill="#1D3E78"/>
  </svg>`,

  'envoy': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="20" fill="#AB1B48" />
    <polygon points="50,20 76,35 76,65 50,80 24,65 24,35" stroke="#FFFFFF" stroke-width="4" fill="none"/>
    <polygon points="50,32 66,42 66,58 50,68 34,58 34,42" fill="#FFFFFF"/>
  </svg>`,

  'vault': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="20" fill="#1A1A1A" />
    <rect x="28" y="44" width="44" height="34" rx="4" fill="#E8B038"/>
    <path d="M38 44V32a12 12 0 0 1 24 0v12" stroke="#FFFFFF" stroke-width="5" fill="none"/>
    <circle cx="50" cy="58" r="4.5" fill="#1A1A1A"/>
    <line x1="50" y1="62" x2="50" y2="69" stroke="#1A1A1A" stroke-width="3.5" stroke-linecap="round"/>
  </svg>`,

  'trivy': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="20" fill="#1B4992" />
    <path d="M50 18L76 28v24c0 18-12 30-26 34C36 82 24 70 24 52V28L50 18z" fill="#00C4FF"/>
    <path d="M42 49l6 6 12-14" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  'falco': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="20" fill="#002D59" />
    <path d="M26 34c14 0 28 6 38 18-8 8-16 10-24 6-4-2-8-8-14-24z" fill="#00A7E1"/>
    <circle cx="62" cy="46" r="3" fill="#FFFFFF"/>
    <path d="M30 68c12 2 24-4 36-16" stroke="#00A7E1" stroke-width="4" stroke-linecap="round"/>
  </svg>`,

  'cert-manager': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="20" fill="#2E73B8" />
    <rect x="30" y="24" width="40" height="52" rx="4" fill="#FFFFFF"/>
    <path d="M38 36h24M38 46h24M38 56h16" stroke="#2E73B8" stroke-width="3" stroke-linecap="round"/>
    <circle cx="64" cy="62" r="9" fill="#00C48C"/>
    <path d="M61 62l2 2 4-5" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  'backstage': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="20" fill="#9BF0E1" />
    <circle cx="50" cy="50" r="32" fill="#1F2937"/>
    <circle cx="50" cy="50" r="22" fill="#9BF0E1"/>
    <circle cx="50" cy="50" r="12" fill="#1F2937"/>
    <line x1="50" y1="18" x2="50" y2="82" stroke="#1F2937" stroke-width="4"/>
  </svg>`,

  'keda': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="20" fill="#326CE5" />
    <polygon points="54,18 28,52 48,52 44,82 72,44 52,44" fill="#FFC933" stroke="#FFFFFF" stroke-width="2"/>
  </svg>`,

  'k9s': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="20" fill="#1E232A" />
    <path d="M30 32h40v36H30V32z" fill="#0D1117" stroke="#FFC933" stroke-width="3"/>
    <circle cx="42" cy="46" r="3" fill="#FFC933"/>
    <circle cx="58" cy="46" r="3" fill="#FFC933"/>
    <path d="M44 58h12" stroke="#FFC933" stroke-width="3" stroke-linecap="round"/>
    <path d="M32 26l6 6M68 26l-6 6" stroke="#FFC933" stroke-width="4" stroke-linecap="round"/>
  </svg>`,

  'helm': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="46" fill="#0F1689"/>
    <circle cx="50" cy="50" r="30" stroke="#FFFFFF" stroke-width="5" fill="none"/>
    <circle cx="50" cy="50" r="11" fill="#FFFFFF"/>
    <line x1="50" y1="12" x2="50" y2="88" stroke="#FFFFFF" stroke-width="4"/>
    <line x1="12" y1="50" x2="88" y2="50" stroke="#FFFFFF" stroke-width="4"/>
    <line x1="23" y1="23" x2="77" y2="77" stroke="#FFFFFF" stroke-width="4"/>
    <line x1="77" y1="23" x2="23" y2="77" stroke="#FFFFFF" stroke-width="4"/>
  </svg>`
};

for (const [name, svg] of Object.entries(icons)) {
  fs.writeFileSync(path.join(iconDir, `${name}.svg`), svg.trim());
}

console.log(`Generated ${Object.keys(icons).length} SVG icons successfully!`);
