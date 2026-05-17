import { motion } from "motion/react";
import { Menu, X, ChevronRight, ChevronDown, Phone, Mail, MapPin, Search, ArrowRight, Shield, Globe, TrendingUp, Verified, BarChart3, Clock, Package, FileText, CheckCircle2, Factory, Warehouse, ClipboardCheck, Ship, User, ShieldCheck, FileSignature, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation, useParams } from "react-router-dom";

// Map old setActivePage names to URL paths so existing pages keep working
const pageToPath = (page: string): string => {
  switch (page) {
    case 'home': return '/';
    case 'product': return '/quality-control';
    case 'article': return '/insights';
    default: return `/${page}`;
  }
};

// --- Data ---

type ArticleBlock =
  | { type: 'h2'; content: string }
  | { type: 'p'; content: string }
  | { type: 'ul'; content: string[] }
  | { type: 'callout'; heading: string; items: string[] };

type Article = {
  id: string;
  cat: string;
  title: string;
  excerpt: string;
  img: string;
  date: string;
  author: { name: string; role: string; avatar: string };
  featured?: boolean;
  body: ArticleBlock[];
};

const DEFAULT_AUTHOR_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNAf1VM7mrVecP9jnI-oKCAEKna6NzYz1PkLy4C4rMHXhwbvIZK_HEyMMefrfksnd7QolwwU-qGCYfWWPXHa5KNbesEOvNe6Ti06IKU8immo_MmHAFfXLDpOOBn0wyG150JKrosQpwbd7Vt-i97zvvLfQd_OqKNqij_VAe3lqFnMO51cuG2TBo84xZudCfCM3PoOB5WG3kQBQjHoPnGiMnyGUVXSzPja0RpuiWsdZ2FCKryGBhLPmCMxYwzprColaj0V-lQ78PFgU';

const articles: Article[] = [
  {
    id: 'market-outlook-2024',
    cat: 'Market News',
    title: '2024 African Raw Cashew Market Outlook: Trends and Forecasts',
    excerpt: 'An in-depth analysis of crop yields across West Africa, expected price volatility, and strategic sourcing recommendations for global buyers navigating the upcoming harvest season.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8sHIWqN01EmHzYxeqsXzcp77XI5b-rgokxtFA9zVheCjfytkbCpyUvfRSjpd0etRmei912DzD5t1_pOPsUXUct_yeQieLqO_ULWNGBjRpB3fZugy-G-RVY3E1ty1K0pWzFfxoPIfWlGQxABL_f2a8JmunllUeawHeH-tINcxuAXzOvbkn-wPtBBU-DPHeTjyDQqo8wpYcqlYNeX9I6x6K6rmU3rMsCojGaErZf837pNWiV9RwsQQRZM18_FC2ipT-L0lr-vbC4rg',
    date: 'October 24, 2024',
    author: { name: 'David Chen', role: 'Director of Market Intelligence', avatar: DEFAULT_AUTHOR_AVATAR },
    featured: true,
    body: [
      { type: 'h2', content: 'Introduction to the Current Global Supply Landscape' },
      { type: 'p', content: 'The global raw cashew nut (RCN) market is entering a pivotal phase in 2024. As major processing hubs in Asia stabilize their output capacities, attention has sharply turned to the primary sourcing regions in West Africa. This shift is driven by a complex interplay of climatic conditions, evolving regulatory frameworks, and shifting geopolitical trade dynamics.' },
      { type: 'p', content: 'Historically, supply chain predictability has been the bedrock of RCN trading. However, this year presents unique challenges and opportunities for importers who prioritize traceability and consistent quality metrics.' },
      { type: 'h2', content: 'Key Production Trends in West Africa' },
      { type: 'p', content: 'West Africa remains the powerhouse of RCN production, accounting for a significant majority of the world\'s supply. Observing the granular trends within key nations—namely Benin, Ivory Coast, and Ghana—is essential for accurate market forecasting.' },
      { type: 'ul', content: [
        '<strong>Ivory Coast (Côte d\'Ivoire):</strong> Yields are projected to hold steady, supported by government initiatives aimed at increasing domestic processing capacities before export.',
        '<strong>Benin:</strong> An early onset of the dry season has accelerated the harvest window, potentially leading to an earlier influx of high-KOR (Kernel Output Ratio) nuts into the market.',
        '<strong>Ghana:</strong> Focus has heavily shifted towards sustainability certifications, making Ghanaian RCN highly attractive to premium European markets demanding strict ESG compliance.'
      ]},
      { type: 'h2', content: 'Price Volatility & Market Drivers' },
      { type: 'p', content: 'Pricing structures in Q1 2024 have demonstrated notable volatility. Several macro-economic factors are currently driving these fluctuations:' },
      { type: 'callout', heading: 'Primary Drivers', items: [
        'Increased freight costs along major East-West shipping lanes.',
        'Currency devaluation in select emerging markets affecting local purchasing power.',
        'Premiums placed on verifiable organic and fair-trade consignments.'
      ]},
      { type: 'h2', content: 'Export Logistics & Supply Chain Resilience' },
      { type: 'p', content: 'Navigating the 2024 landscape requires robust logistical frameworks. Delays at major transit ports necessitate advanced booking strategies and diversified routing options. Horizon Agro Exports continues to leverage its deep regional networks to ensure supply chain continuity, offering real-time tracking and quality assurance at every node of the journey.' }
    ]
  },
  {
    id: 'kor-guide',
    cat: 'Cashew Industry',
    title: 'A Comprehensive Guide to Raw Cashew Nut Quality & KOR',
    excerpt: 'Understanding Kernel Outturn Ratio (KOR) is essential for processors. We break down how it is measured, why 48+ lbs matters, and how to verify quality at origin.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAADAcZ-coKkN49W61NrNgy9F9Q-RV7IvSLZ1TuvBQdPH0hfEiUirnasj7czzWnmir34crwOIw3PAXVugm-IYFBM-WdpA23WXig_8g-OcRhsKyvpzDhkbIo09XrZH53QjDCsVnhusnhdcnUuduIuqVPYBUAloJSyox-AnAdqRVXlorT6ksOwMoewg58nX5vUBjA0P1NM59loxJ3blZDGlTFw3cZ2od4EmL4P7r0od5J1xvBDKsm4oamTDBEzUKU1kZJaUrtTfz0E8',
    date: 'October 12, 2024',
    author: { name: 'Anika Patel', role: 'Head of Quality Assurance', avatar: DEFAULT_AUTHOR_AVATAR },
    body: [
      { type: 'h2', content: 'What is Kernel Outturn Ratio (KOR)?' },
      { type: 'p', content: 'Kernel Outturn Ratio, commonly known as KOR, is the single most important quality metric in the raw cashew nut trade. It measures the weight of usable kernel (in pounds) recovered from processing 80 kg of raw nuts in shell. A higher KOR means a better processing yield — and a significantly higher margin for processors at destination.' },
      { type: 'p', content: 'Industry-standard contracts typically reference KOR alongside nut count and moisture content. Any responsible exporter must be able to demonstrate KOR at origin before shipment, not after.' },
      { type: 'h2', content: 'Why KOR 48+ Is the Benchmark' },
      { type: 'p', content: 'Cargo grading at KOR 48 lbs and above is considered premium and is the operating standard for major Indian and Vietnamese processors. Below 46, processing economics collapse and most reputable buyers will reject the consignment outright or demand steep discounts.' },
      { type: 'ul', content: [
        '<strong>KOR 50+:</strong> Top-tier West African crop, commands a price premium.',
        '<strong>KOR 48–50:</strong> Standard premium-grade benchmark used in most Horizon Agro contracts.',
        '<strong>KOR 46–48:</strong> Acceptable but typically discounted; suited for blended processing runs.',
        '<strong>Below 46:</strong> Not recommended for export-grade processing.'
      ]},
      { type: 'h2', content: 'How Horizon Tests at Origin' },
      { type: 'p', content: 'Every consignment we ship is tested using cut-test sampling at the warehousing stage, with verification by SGS or Bureau Veritas before loading. We share KOR test certificates with the buyer before bill of lading is issued — no surprises at destination.' },
      { type: 'callout', heading: 'Key Quality Checkpoints', items: [
        'Cut test on a representative sample (typically 1 kg per 10 MT).',
        'Moisture content measured with calibrated meters at warehouse.',
        'Defect count (insect damage, mould, immature nuts) recorded and shared.',
        'Third-party SGS/BV inspection arranged on buyer request.'
      ]}
    ]
  },
  {
    id: 'logistics-pricing',
    cat: 'Price Trends',
    title: 'The Impact of Logistics on Global Commodity Pricing',
    excerpt: 'Freight rates, demurrage, and insurance now make up a larger share of landed cost than ever. Here is how to model and mitigate the volatility.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdkFJEOcWd5BLR22vxqk4z1681cBEH_A2KHchBb-5yWbi6M48V2FmgbLYDJNSigNY2JfjAlzTdEkc8RKE5sPJeKkQqkm2qNZ15RNhtL9wvYmeQKDgm5RrN5l1WfTyqQg_MLcjUUeWMhRugGgCN2Chb9563H9kF_KTEyBaE3uVyY2pnToPlucgo6g334L-PVnBrXnsxrQpgqTrX9fR_grQlCeDU59SMqu8aLMvji7BvLeFeEP8t60757m3zVYW-zXHMVxLdbLFVrKU',
    date: 'October 05, 2024',
    author: { name: 'Marco Bellini', role: 'Head of Trade Operations', avatar: DEFAULT_AUTHOR_AVATAR },
    body: [
      { type: 'h2', content: 'Why Landed Cost Matters More Than FOB' },
      { type: 'p', content: 'Procurement teams that benchmark suppliers purely on FOB pricing are leaving meaningful money on the table — and inviting risk. Ocean freight from West Africa to Asia has swung as much as 35% in a single quarter over the past two years, often dwarfing the savings from a few dollars per ton off the origin price.' },
      { type: 'h2', content: 'The Three Hidden Cost Levers' },
      { type: 'ul', content: [
        '<strong>Freight rate volatility:</strong> Spot rates respond to vessel availability, fuel surcharges, and Red Sea routing disruptions. Locking in a CIF contract shifts this risk to the exporter.',
        '<strong>Demurrage and detention:</strong> A 3-day delay at destination port can add $150–$300/MT to landed cost. Proper bill of lading management and pre-clearance documentation are essential.',
        '<strong>Marine insurance:</strong> Premiums for African-origin agricultural cargo have risen sharply post-2022. Group policies via established exporters typically beat self-procured cover.'
      ]},
      { type: 'h2', content: 'FOB vs CIF: When to Choose Which' },
      { type: 'p', content: 'FOB suits buyers with mature freight desks, existing carrier contracts, and dedicated marine insurance. CIF transfers freight and insurance risk to Horizon Agro — useful for first-time importers or buyers entering new shipping lanes. Either way, full transparency on every cost component should be table stakes.' },
      { type: 'callout', heading: 'What to Ask Your Exporter', items: [
        'Show me the all-in landed cost on a CIF basis, line-itemized.',
        'What is the freight rate locked in, and for how long?',
        'Who is responsible if the vessel rolls or arrives late?',
        'What is the demurrage clause in the contract?'
      ]}
    ]
  },
  {
    id: 'west-africa-seasons',
    cat: 'Sourcing',
    title: 'Sourcing from West Africa: Key Harvest Seasons',
    excerpt: 'The narrow harvest windows in Ivory Coast, Benin, and Ghana drive almost every supply decision. Here is how to time your contracts around them.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDa2yKUBaq--VH_QCfEQ4MpGeAl_jK3isGJBpu-GLDgclBIjy1-Wm6ygZSZ64EqjcDpkWEEd2z4dUaHTdPqEoduYkHd2WYZfdoM3fMLRUIVnLwrB7-1VmyYvW0eA48BoG5Xe3Z20_hzI0Ag0zfFXgp596Ijjc3I_ZOFDgiC5SJ_5Crr8DMzjtr1uVfkW-cdq_iq4Ep7B3T9Nzfow9qr8Qrir9zkI1IfVteRdYj7VvO2zqbuxfU8lxz2SrHDcNPjko6DHCBMRFbOM4Y',
    date: 'September 28, 2024',
    author: { name: 'Fatou Diallo', role: 'Regional Sourcing Lead, West Africa', avatar: DEFAULT_AUTHOR_AVATAR },
    body: [
      { type: 'h2', content: 'The Calendar That Drives Every Cashew Contract' },
      { type: 'p', content: 'Cashew is a seasonal crop with a narrow window. In West Africa, the harvest typically runs February through May, but the exact onset varies by country and by year — driven primarily by the timing of the dry season. Buyers who lock in contracts before the harvest window opens consistently secure better KOR and tighter pricing.' },
      { type: 'h2', content: 'Country-by-Country Harvest Windows' },
      { type: 'ul', content: [
        '<strong>Ivory Coast:</strong> Peak harvest mid-February through April. As the world\'s largest producer, supply ramps quickly — early contracts secure best-grade lots before mass aggregation.',
        '<strong>Benin:</strong> Harvest starts late February and runs into May. Renowned for consistently high KOR (48–52 lbs) when sourced direct from cooperative aggregators.',
        '<strong>Ghana:</strong> A slightly later window (March through May), with strong availability of certified sustainable lots suited for EU buyers.',
        '<strong>Nigeria:</strong> Largest absolute volumes but more variable quality. Selective sourcing required.'
      ]},
      { type: 'h2', content: 'Practical Procurement Timing' },
      { type: 'p', content: 'Forward contracts signed in November–January typically capture the best pricing and quality allocation, because aggregators lock supply commitments to cooperatives ahead of the harvest. Buyers entering the market in April are competing for residual stock, often at premium prices and lower KOR.' },
      { type: 'callout', heading: 'Horizon Agro Sourcing Schedule', items: [
        'Nov–Jan: Forward contracts negotiated, deposits placed with cooperatives.',
        'Feb–May: Active harvest aggregation, quality testing at warehouse.',
        'Mar–Jun: Container stuffing and ocean shipment.',
        'Jul–Oct: Off-season supply via inventory carry and stored lots.'
      ]}
    ]
  }
];

// --- Components ---

const NAV_ITEMS: { label: string; path: string }[] = [
  { label: 'Sourcing', path: '/sourcing' },
  { label: 'Logistics', path: '/logistics' },
  { label: 'Quality Control', path: '/quality-control' },
  { label: 'Market Data', path: '/insights' },
  { label: 'Sustainability', path: '/sustainability' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/insights') return location.pathname.startsWith('/insights');
    return location.pathname === path;
  };

  const go = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white border-b border-border-gray h-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex justify-between items-center">
        <div
          className="font-display text-xl md:text-2xl font-bold text-deep-forest cursor-pointer tracking-tight"
          onClick={() => go('/')}
        >
          HORIZON AGRO
        </div>

        <div className="hidden md:flex items-center gap-10">
          {NAV_ITEMS.map(({ label, path }) => (
            <button
              key={label}
              onClick={() => go(path)}
              className={`font-sans text-sm font-medium transition-colors hover:text-primary ${
                isActive(path)
                  ? 'text-primary border-b-2 border-primary pb-1'
                  : 'text-on-surface-variant'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden md:block bg-tertiary text-white font-display text-sm font-semibold px-6 py-3 rounded-sm hover:bg-tertiary-container transition-colors"
            onClick={() => go('/contact')}>
            Enquire Now
          </button>
          <button className="md:hidden text-primary" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 top-20 bg-black/40 z-30"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-border-gray p-6 flex flex-col gap-6 z-40"
        >
          {NAV_ITEMS.map(({ label, path }) => (
            <button
              key={label}
              onClick={() => go(path)}
              className={`text-left font-sans text-lg font-medium transition-colors ${
                isActive(path) ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              {label}
            </button>
          ))}
          <button className="bg-tertiary text-white font-display font-semibold py-4 rounded-sm"
            onClick={() => go('/contact')}>
            Enquire Now
          </button>
        </motion.div>
      )}
    </nav>
  );
};

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-surface-charcoal text-white py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <div className="font-display text-2xl font-bold mb-4 tracking-tight">HORIZON AGRO</div>
            <p className="text-sm text-outline-variant leading-relaxed max-w-xs">
              Connecting global buyers with premium African agricultural commodities through transparent and reliable supply chains.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-display text-sm font-bold text-tertiary uppercase tracking-widest">Company</h4>
            <div className="flex flex-col gap-2 text-sm text-outline-variant">
              <button onClick={() => navigate('/')} className="text-left hover:text-white transition-colors">About Us</button>
              <button className="text-left hover:text-white transition-colors">Careers</button>
              <button onClick={() => navigate('/contact')} className="text-left hover:text-white transition-colors">Contact</button>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-display text-sm font-bold text-tertiary uppercase tracking-widest">Connect</h4>
            <div className="flex flex-col gap-4 text-sm text-outline-variant">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-tertiary shrink-0" />
                <span className="break-all">info@horizonagroexports.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-tertiary shrink-0" />
                <span>+1 (555) 019-2837</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-outline-variant">
          <p>© 2024 Horizon Agro Exports. Global B2B Network. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Pages ---

const SourcingPage = ({ setActivePage }: { setActivePage: (p: string) => void }) => {
  return (
    <div className="pt-20">
      <header className="bg-surface-bright border-b border-border-gray">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 flex flex-col items-start gap-6">
            <span className="inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container font-sans text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
              <Verified size={14} /> Certified Global Exporter
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-deep-forest tracking-tight leading-tight">
              Reliable African Raw Cashew Supply for Global Buyers
            </h1>
            <p className="text-lg text-on-surface-variant leading-relaxed">
              Securing high-yield Raw Cashew Nuts (RCN) directly from top-producing African regions. We ensure meticulous quality control, transparent logistics, and consistent supply chains for large-scale processors worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
              <button 
                onClick={() => setActivePage('contact')}
                className="bg-tertiary text-white font-display font-semibold px-8 py-4 rounded-sm hover:bg-tertiary-container transition-all flex items-center justify-center gap-3 shadow-md">
                Request Quotation <ArrowRight size={18} />
              </button>
              <button 
                className="border border-trade-blue text-trade-blue font-display font-semibold px-8 py-4 rounded-sm hover:bg-surface-bright transition-all flex items-center justify-center gap-3">
                <Phone size={18} /> WhatsApp Us
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mt-8 border-t border-border-gray pt-8 w-full">
              <div>
                <p className="font-display text-2xl font-bold text-deep-forest uppercase">50K+</p>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">MT Annual Volume</p>
              </div>
              <div className="hidden sm:block w-px h-12 bg-border-gray"></div>
              <div>
                <p className="font-display text-2xl font-bold text-deep-forest uppercase">KOR 48+</p>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Premium Quality</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-6 h-[300px] md:h-[500px] w-full rounded-sm overflow-hidden shadow-2xl border border-border-gray relative">
            <img
               src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEZK_Z_bd3WGYPhw6b_QodN8_H_EEcv3V31qLRGbZCs2aPyOkYaNgUCsq8CRqGZWkMvDMSq4z22prRYHcGYSbuO7io9ohjXrSZH94CgpFQWs63ii1r07jI_hSQif_6od5-9J3I2w2tDnXu-wbYO623a_rgbclUsVVS8vveA5uOw9yY2mufwv-xmNfGe4-CCLFJUhP8N3FCeFR-_k98RsCk0rV-7ph7sUWDQpW-kF54DBBVNnj-27CFQenNkJpLSj5jC3k81ZBh768"
               alt="Raw Cashew Nuts"
               className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display text-3xl font-bold text-deep-forest mb-8 tracking-tight">Bridging African Agriculture with Global Markets</h2>
            <p className="text-on-surface-variant leading-relaxed mb-10 text-lg">
              Horizon Agro Exports stands at the intersection of local farming heritage and international trade precision. We specialize in aggregating, grading, and exporting premium agricultural commodities, primarily focusing on Raw Cashew Nuts.
            </p>
            <p className="text-on-surface-variant leading-relaxed mb-12">
              Our presence across key sourcing regions ensures we bypass unnecessary intermediaries, delivering competitive pricing and traceable quality directly to your manufacturing facility.
            </p>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="bg-primary/10 p-3 rounded-sm text-primary max-h-fit">
                   <Shield size={24} />
                </div>
                <div>
                   <h3 className="font-display font-bold text-deep-forest mb-1">Trade Assurance</h3>
                   <p className="text-sm text-on-surface-variant">Fully compliant with international shipping and phytosanitary standards.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-primary/10 p-3 rounded-sm text-primary max-h-fit">
                   <MapPin size={24} />
                </div>
                <div>
                   <h3 className="font-display font-bold text-deep-forest mb-1">Regional Coverage</h3>
                   <p className="text-sm text-on-surface-variant">Active sourcing networks in Côte d'Ivoire, Ghana, and Nigeria.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative rounded-sm overflow-hidden border border-border-gray shadow-md h-[320px] md:h-[400px] lg:h-full lg:min-h-[400px]">
            <img
               src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQBd7-gYulLPKPrwiEoeFtlBMQ6V-QzSzmKSvq7U_hwvgtyITcUvDYHaZN1zf117ukDA8NNpz84VrM-k5jDmQPkt4oYypvEKTIizbDrFaLFp9oLlWLvwvXFk-CuOIBjZzmALarcSUkkH12NKUnWp2Wp7KmVhOQovteGDTfz5qSWF86adKVDy45ptzHja3qhrU18euHqFsJsh7V_tC7AtC1uDqCyTAM4Ov3s-Zwr1Yba8jBUuHLSjzRIH1SBW2RA9mkLKMWuRnxF-c"
               alt="Global Routes"
               className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
               <div className="bg-white/95 backdrop-blur-md p-6 md:p-8 border border-border-gray shadow-xl text-center max-w-xs md:max-w-sm rounded-sm">
                  <Globe size={36} className="mx-auto mb-3 md:mb-4 text-trade-blue" />
                  <h3 className="font-display text-xl md:text-2xl font-bold text-deep-forest mb-2 uppercase tracking-tight">Global Reach</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Exporting to major processing hubs in India, Vietnam, and the UAE with real-time logistical tracking.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface-bright border-y border-border-gray">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-deep-forest mb-4">How We Work</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">A streamlined, transparent process designed to mitigate risk and ensure timely delivery of high-quality commodities.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: '1', title: 'Direct Sourcing', desc: 'We engage directly with farmer cooperatives and local aggregators during the harvest season to secure the freshest crop.' },
              { num: '2', title: 'Quality Assessment', desc: 'Rigorous testing for Kernel Outturn Ratio (KOR), moisture content, and defect counts before warehousing.' },
              { num: '3', title: 'Secure Processing', desc: 'Proper drying, bagging in seaworthy jute bags, and secure warehousing to maintain integrity.' },
              { num: '4', title: 'Global Logistics', desc: 'Efficient customs clearance, stuffing into containers, and FOB or CIF shipping to your destination port.' }
            ].map((step, i) => (
              <div key={i} className="bg-white p-8 border border-border-gray rounded-sm group hover:shadow-2xl transition-all h-full flex flex-col justify-between">
                <div>
                   <div className="w-12 h-12 rounded-full border border-border-gray flex items-center justify-center text-xl font-display font-bold text-deep-forest mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                      {step.num}
                   </div>
                   <h3 className="font-display font-bold text-deep-forest text-lg mb-4 uppercase tracking-wide">{step.title}</h3>
                   <p className="text-sm text-on-surface-variant leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-deep-forest text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-12">
           <div className="max-w-xl">
              <h2 className="font-display text-3xl font-bold mb-6">Partner for Bulk Commodities</h2>
              <p className="text-outline-variant leading-relaxed opacity-80">Join our network of international buyers and secure your supply chain with Horizon Agro Exports.</p>
           </div>
           <button 
             onClick={() => setActivePage('contact')}
             className="bg-tertiary text-white font-display font-bold px-10 py-5 rounded-sm hover:bg-white hover:text-deep-forest transition-all shadow-xl">
             Enquire Now
           </button>
        </div>
      </section>
    </div>
  );
};

const LogisticsPage = ({ setActivePage }: { setActivePage: (p: string) => void }) => {
  return (
    <div className="pt-20">
      <header className="relative bg-deep-forest text-white py-24 md:py-32 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEdOXCmf_bDSmAsl43g07ZwpdHdCtPPiSBEnY2HiqnsbKGZml8N1nsJmPnA5It0s8uzkFmsiXR6qSexx-BOWOTEvgfHbIm2Sq6ZBf30gPb3UPZFWmCjryAtRNSiKboijU4oFePJP2nFbQJtb_ucwbUi_SKqhjIztw86rNUoxYEtKiBkmawiqhkcpDqhn8b5-inof3QkZ963g1FF2OCMUQEWh6_SYKazbGg9OE-xjY37RIWy9iw3OauzzZD4L6GRgTCUWRcNL5P5Y0" 
            alt="Logistics Terminal" 
            className="w-full h-full object-cover opacity-30 object-center"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-start gap-8">
          <h1 className="font-display text-4xl md:text-6xl font-bold max-w-3xl leading-tight">
            Streamlined Global Logistics & Supply Chain
          </h1>
          <p className="font-sans text-lg text-outline-variant max-w-2xl leading-relaxed opacity-90">
            Ensuring the integrity of African raw cashew exports through precision handling, rigorous quality control, and reliable global freight coordination.
          </p>
          <button 
            onClick={() => setActivePage('contact')}
            className="bg-tertiary text-white font-display font-bold px-10 py-5 rounded-sm hover:opacity-90 transition-all shadow-xl">
            Discuss Your Logistics Requirements
          </button>
        </div>
      </header>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="font-display text-3xl font-bold text-deep-forest mb-16 text-center">The Logistics Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { title: '1. Warehousing & Drying', desc: 'Proper storage in state-of-the-art, moisture-controlled environments to preserve raw cashew nut integrity prior to transit.', icon: Warehouse },
              { title: '2. Quality Inspection', desc: 'Rigorous SGS/Bureau Veritas coordination and precise KOR verification ensuring international grade compliance.', icon: ClipboardCheck },
              { title: '3. Professional Bagging', desc: 'Utilization of durable, seaworthy jute bagging specifically designed for optimal air circulation during long-haul transit.', icon: Package },
              { title: '4. Global Freight', desc: 'Expert FOB and CIF coordination orchestrating seamless delivery to major international ports including India, Vietnam, and Europe.', icon: Ship }
            ].map((step, idx) => (
              <div key={idx} className="p-8 bg-surface-bright border border-border-gray rounded-sm group hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-secondary-container text-primary rounded-full flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                  <step.icon size={28} />
                </div>
                <h3 className="font-display text-xl font-bold text-deep-forest mb-4 leading-tight">{step.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface-bright border-y border-border-gray">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="mb-12">
            <h2 className="font-display text-3xl font-bold text-deep-forest mb-4">Shipment Terms Comparison</h2>
            <p className="text-on-surface-variant max-w-2xl">Understanding your freight options. We offer flexible terms tailored to your import capabilities.</p>
          </div>
          
          <div className="overflow-x-auto rounded-sm border border-border-gray bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-border-gray">
                  <th className="p-6 font-sans text-xs font-bold text-on-surface-variant uppercase tracking-widest">Responsibility</th>
                  <th className="p-6 font-sans text-xs font-bold text-on-surface-variant uppercase tracking-widest border-l border-border-gray">FOB (Free on Board)</th>
                  <th className="p-6 font-sans text-xs font-bold text-on-surface-variant uppercase tracking-widest border-l border-border-gray bg-secondary-container text-primary">CIF (Cost, Insurance, Freight)</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { label: 'Origin Transport & Loading', fob: true, cif: true },
                  { label: 'Export Customs Clearance', fob: true, cif: true },
                  { label: 'Main Carriage (Ocean Freight)', fob: false, cif: true },
                  { label: 'Marine Insurance', fob: false, cif: true },
                  { label: 'Destination Port Charges', fob: false, cif: false }
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border-gray last:border-0">
                    <td className="p-6 font-semibold text-deep-forest">{row.label}</td>
                    <td className="p-6 border-l border-border-gray">
                      {row.fob ? (
                        <div className="flex items-center gap-2 text-primary font-medium">
                          <CheckCircle2 size={16} /> Horizon Agro
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-on-surface-variant">
                          <User size={16} /> Buyer
                        </div>
                      )}
                    </td>
                    <td className="p-6 border-l border-border-gray bg-secondary-container/10">
                      {row.cif ? (
                        <div className="flex items-center gap-2 text-primary font-medium">
                          <CheckCircle2 size={16} /> Horizon Agro
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-on-surface-variant">
                          <User size={16} /> Buyer
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-7 bg-surface-bright border border-border-gray rounded-sm p-10 flex flex-col justify-between min-h-[400px] relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-sm bg-primary text-white flex items-center justify-center mb-8">
                <Globe size={24} />
              </div>
              <h2 className="font-display text-3xl font-bold text-deep-forest mb-6">Strategic Port Access</h2>
              <p className="text-on-surface-variant leading-relaxed max-w-lg mb-10 text-lg">
                We leverage deep relationships with major port authorities to ensure priority loading and expedited customs processing across West and East Africa.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 relative z-10">
              {['Abidjan, CIV', 'Cotonou, BEN', 'Dar es Salaam, TZA', 'Mombasa, KEN', 'Lagos, NGA'].map(port => (
                <span key={port} className="px-4 py-2 bg-white border border-border-gray text-xs font-bold text-deep-forest rounded-sm shadow-sm uppercase tracking-widest">
                  {port}
                </span>
              ))}
            </div>
            <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 pointer-events-none">
              <Globe size={400} />
            </div>
          </div>
          
          <div className="md:col-span-5 bg-deep-forest text-white rounded-sm p-10 flex flex-col justify-center">
            <h2 className="font-display text-3xl font-bold mb-10">Trust & Compliance</h2>
            <div className="space-y-8">
              {[
                { title: 'Phytosanitary Certificates', desc: 'Strict adherence to international plant health standards for every shipment.', icon: ShieldCheck },
                { title: 'Certificates of Origin', desc: 'Verified documentation proving the authentic sourcing of raw materials.', icon: FileText },
                { title: 'Bill of Lading Management', desc: 'Accurate and timely issuance of vital shipping documents to prevent demurrage.', icon: FileSignature }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-6">
                  <div className="text-tertiary shrink-0"><item.icon size={32} /></div>
                  <div>
                    <h3 className="font-display text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-outline-variant leading-relaxed opacity-80">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const SustainabilityPage = ({ setActivePage }: { setActivePage: (p: string) => void }) => {
  return (
    <div className="pt-20">
      <header className="bg-surface-bright border-b border-border-gray py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-sans text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-8">
              <TrendingUp size={14} /> Our Commitment to the Future
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-deep-forest mb-8 tracking-tight">Sustainable Sourcing & Ethical Trade</h1>
            <p className="text-lg text-on-surface-variant leading-relaxed">
              We believe that long-term commercial success in agricultural exports is inextricably linked to the prosperity of our farmers and the health of the land.
            </p>
          </div>
        </div>
      </header>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {[
              { 
                title: 'Ethical Sourcing', 
                desc: 'We enforce strict fair-trade practices, ensuring that farmers receive premium prices above market averages to support rural community development.',
                icon: Shield
              },
              { 
                title: 'Traceability', 
                desc: 'Every consignment is fully traceable. We map our supply chains down to the cooperative level, providing buyers with complete transparency.',
                icon: FileText
              },
              { 
                title: 'Regenerative Practices', 
                desc: 'We support farming partners in adopting regenerative agricultural practices that improve soil health and increase climate resilience.',
                icon: CheckCircle2
              }
            ].map((pillar, idx) => (
              <div key={idx} className="flex flex-col gap-6 p-10 bg-surface-bright rounded-sm border border-border-gray hover:bg-white hover:shadow-xl transition-all">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <pillar.icon size={32} />
                </div>
                <h3 className="font-display text-2xl font-bold text-deep-forest">{pillar.title}</h3>
                <p className="text-on-surface-variant leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-deep-forest text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
           <div className="rounded-sm overflow-hidden aspect-video border border-white/10 shadow-2xl">
              <img 
                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuDa2yKUBaq--VH_QCfEQ4MpGeAl_jK3isGJBpu-GLDgclBIjy1-Wm6ygZSZ64EqjcDpkWEEd2z4dUaHTdPqEoduYkHd2WYZfdoM3fMLRUIVnLwrB7-1VmyYvW0eA48BoG5Xe3Z20_hzI0Ag0zfFXgp596Ijjc3I_ZOFDgiC5SJ_5Crr8DMzjtr1uVfkW-cdq_iq4Ep7B3T9Nzfow9qr8Qrir9zkI1IfVteRdYj7VvO2zqbuxfU8lxz2SrHDcNPjko6DHCBMRFbOM4Y" 
                 alt="Sustainable Farming" 
                 className="w-full h-full object-cover"
              />
           </div>
           <div>
              <h2 className="font-display text-3xl font-bold mb-8 tracking-tight">The Horizon Empowerment Fund</h2>
              <p className="text-outline-variant leading-relaxed mb-8 opacity-80 text-lg">
                For every metric ton exported, a percentage of our revenue is reinvested directly into the local communities through our Empowerment Fund.
              </p>
              <div className="grid grid-cols-2 gap-8 mb-10">
                 <div>
                    <p className="text-3xl font-bold text-tertiary">150+</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Cooperatives Supported</p>
                 </div>
                 <div>
                    <p className="text-3xl font-bold text-tertiary">25%</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Revenue Reinvested</p>
                 </div>
              </div>
              <button 
                onClick={() => setActivePage('contact')}
                className="inline-flex items-center gap-2 font-display font-bold text-tertiary hover:text-white transition-colors">
                Read our 2024 ESG Report <ArrowRight size={20} />
              </button>
           </div>
        </div>
      </section>

      <section className="py-24 bg-white border-b border-border-gray">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h2 className="font-display text-3xl font-bold text-deep-forest mb-12">Our Certifications</h2>
          <div className="flex flex-wrap justify-center gap-4 md:gap-12 opacity-60">
            {['FairTrade International', 'Rainforest Alliance', 'Organic EU', 'ISO 14001'].map((cert) => (
              <div key={cert} className="font-display text-sm md:text-xl font-black text-on-surface-variant uppercase tracking-widest px-4 md:px-8 py-3 md:py-4 border-2 border-border-gray">
                {cert}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const HomePage = ({ setActivePage, openArticle }: { setActivePage: (p: string) => void; openArticle: (id: string) => void }) => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-surface-bright border-b border-border-gray">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-5 flex flex-col gap-6"
          >
            <span className="font-sans text-xs font-bold text-trade-blue uppercase tracking-[0.2em]">Premium Raw Cashew Nut Exporters</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-deep-forest leading-tight tracking-tight">
              Africa's Reliable Raw Cashew Supply Chain Partner.
            </h1>
            <p className="font-sans text-lg text-on-surface-variant leading-relaxed">
              Bridging the gap between fertile African agricultural heritage and demanding global markets with uncompromising reliability, structural precision, and deep regional expertise.
            </p>
            <div className="flex gap-4 pt-4">
               <button onClick={() => setActivePage('contact')} className="bg-tertiary text-white font-display font-semibold px-8 py-4 rounded-sm hover:bg-tertiary-container transition-all flex items-center gap-2">
                 Enquire Now <ArrowRight size={18} />
               </button>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 pt-6 border-t border-border-gray">
              <div>
                <p className="font-display text-2xl font-bold text-deep-forest">50K+</p>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">MT Annual Volume</p>
              </div>
              <div className="hidden sm:block w-px h-10 bg-border-gray"></div>
              <div>
                <p className="font-display text-2xl font-bold text-deep-forest">KOR 48+</p>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Premium Grade</p>
              </div>
              <div className="hidden sm:block w-px h-10 bg-border-gray"></div>
              <div>
                <p className="font-display text-2xl font-bold text-deep-forest">5+</p>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">African Origins</p>
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-7 aspect-[4/3] rounded-sm overflow-hidden border border-border-gray shadow-xl relative"
          >
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgx3lT2ACLXKqWACtvebno1Z9FOlrefLj_hxhcx7e-ifSkQN93OWJrJH8iQcUXVdMvhSSxFbWvd1f55_JdPGFYoTqyhCGHpD8L7S2W9XAOwVqfKgxAaR7_pNOH-3OcgnaKhT6TEvLAxuRos9sMA8pBgrgfAveovMVT8fxApqp3vtoymRNeuGC2PNJtHJAhXzxZmF9jNGQ3Ab6nazh3WiMI75QgODYKoPo_hBsOSyXsvW74-WslWegZbCExUy7CTCAzy_AwvdE8q6o" 
              alt="Agricultural Port" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-deep-forest/10 to-transparent"></div>
          </motion.div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-16">
          <div className="md:col-span-4">
            <h2 className="font-display text-3xl font-bold text-deep-forest sticky top-28">Our Heritage & Mission</h2>
          </div>
          <div className="md:col-span-8 space-y-8">
            <p className="text-lg text-on-surface-variant leading-relaxed">
              Founded on the principles of 'Stable Growth', Horizon Agro Exports was established to professionalize and streamline the bulk export of premium African agricultural commodities. We recognize that international trade requires more than just access to resources; it demands rigorous quality control, transparent logistics, and unwavering financial stability.
            </p>
            <p className="text-on-surface-variant leading-relaxed">
              Our mission is to serve as the definitive conduit for global B2B buyers seeking high-volume, premium-grade agricultural products from the African continent. We eliminate the friction of international procurement by managing every phase of the supply chain—from origin sourcing to final port delivery—with meticulous attention to detail.
            </p>
            <div className="border-l-4 border-primary pl-8 py-4 bg-surface-bright rounded-r-md italic">
              <p className="text-deep-forest text-lg">
                "We do not just trade commodities; we engineer reliable supply chains that empower global food and manufacturing networks."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How We Deliver */}
      <section className="py-24 bg-surface-bright border-t border-border-gray">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-deep-forest mb-4">How We Deliver</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">A streamlined, transparent process designed to mitigate risk and ensure timely delivery of high-quality commodities.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: '1', title: 'Direct Sourcing', desc: 'We engage directly with farmer cooperatives during harvest season to secure the freshest crop.' },
              { num: '2', title: 'Quality Assessment', desc: 'Rigorous testing for KOR, moisture content, and defect counts before warehousing.' },
              { num: '3', title: 'Secure Processing', desc: 'Proper drying, jute bagging, and secure warehousing to maintain integrity.' },
              { num: '4', title: 'Global Logistics', desc: 'Customs clearance, container stuffing, and FOB or CIF shipping to your destination port.' }
            ].map((step, i) => (
              <div key={i} className="bg-white p-8 border border-border-gray rounded-sm group hover:shadow-2xl transition-all">
                <div className="w-12 h-12 rounded-full border border-border-gray flex items-center justify-center text-xl font-display font-bold text-deep-forest mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                  {step.num}
                </div>
                <h3 className="font-display font-bold text-deep-forest text-lg mb-4 uppercase tracking-wide">{step.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Coverage */}
      <section className="py-24 bg-surface-bright border-t border-border-gray">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="mb-16">
            <h2 className="font-display text-3xl font-bold text-deep-forest mb-6">Strategic Market Coverage</h2>
            <p className="text-lg text-on-surface-variant max-w-2xl">
              Our extensive ground network spans crucial agricultural zones across the continent, allowing us to source optimal commodities aligned with seasonal harvest cycles.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                region: 'West Africa', 
                desc: 'The global hub for premium cocoa and cashews. Our dedicated procurement teams ensure strict adherence to fair trade and quality grading directly at the source.',
                exports: 'Cocoa, Cashews, Sesame',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9T-ffVJOPVEWudaM0QfTGAvUh3Ua8IkWmri3t5Oxu-TCQKpz6PS84wm8i4N3M-bWaJ96cNkW9A8NGbdt0RUYhqTOpFtqMrtkhdteiiYlbaspR-3psvenW_UpmQQrctZXhjZpYC2Ya0ltjip7baM8Glyowdi0mqP7P4QiXUUtst9U7-yI76YwKuaQnEBAwgMYZsivGk-dPIHXem3wkmOBYUXs-9xo7bTul490HUULtyyYMWjasIDsanvmN06CsP4P39CLzKBCX_D0'
              },
              { 
                region: 'East Africa', 
                desc: 'Renowned for world-class Arabica coffee and distinct tea varieties. We maintain deep relationships with highland cooperatives to secure early harvest allocations.',
                exports: 'Coffee, Tea, Spices',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeC6F4eWhc4JJEs6BWrqhbTD01SAgVVsgp2FPVgsmVtk83EVkx9YzuiPSBkSSl1q525TGslSdA682uzBnT1R6m8euTvf_bTlO8cyizFAcyo4XEYmJSz98cqSJbvGJ-7hhnsEyP3BbQzlLZOwYvIjj6zng_eI83i1fBT-wuR5MXzSEfv2NdqrYggkoe0qeF5ozPkSPhJDXUW6Fpl8tHXLXbApn3T0QWR_PPa-VHYOaN0YHEYUyYPcXdBJGKAmSfRYN8-DRXVxT7dNk'
              },
              { 
                region: 'Southern Africa', 
                desc: 'A powerhouse of commercial agriculture. We leverage advanced cold-chain logistics to export high-yield citrus, maize, and essential grains to global markets.',
                exports: 'Citrus, Maize, Grains',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwWj9aN77JBowfS9M3aRZWPy4H4ExYOUjmn_u0F75tQLSHwHSSQy6gQnKJDXwv4Q7WU9SNDDxzCpCT9q5h33R_7KmsuNlv7cDTKhC9hTizZnhKcMMGRp4JG1tYdR8GhtGg55GUIfk7PWdQy26dZfpGNCb5Gn-iM__I6HPEXG9tzfagsLRTTr1lO7PFdMeTR4rEBX3tNsFUkuf8eMGhsKGoUXO9bPFljIcJ5lUgaRvpalNqn2i1vekaXG6kWh6rT2Dg8233-sSgU60'
              }
            ].map((zone) => (
              <div key={zone.region} className="bg-white border border-border-gray rounded-sm flex flex-col overflow-hidden hover:shadow-2xl transition-all duration-500 group cursor-pointer" onClick={() => setActivePage('sourcing')}>
                <div className="h-56 overflow-hidden">
                  <img src={zone.img} alt={zone.region} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-6 text-trade-blue">
                    <MapPin size={20} />
                    <h3 className="font-display text-xl font-bold text-deep-forest">{zone.region}</h3>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed mb-8 flex-grow">
                    {zone.desc}
                  </p>
                  <div className="pt-6 border-t border-border-gray flex justify-between items-center">
                    <span className="font-sans text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Key Exports: {zone.exports}</span>
                    <ArrowRight size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Horizon Advantage */}
      <section className="py-24 bg-white border-t border-border-gray">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-20">
            <h2 className="font-display text-3xl font-bold text-deep-forest mb-6">The Horizon Advantage</h2>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
              We don't just facilitate transactions; we engineer secure, transparent, and highly efficient commodity supply chains tailored for corporate buyers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Shield, title: 'Unwavering Reliability', desc: 'We execute contracts with absolute precision. From strict phytosanitary compliance to guaranteed vessel loading windows, our operations are designed to mitigate risk.' },
              { icon: BarChart3, title: 'Transparent Pricing', desc: 'Leveraging real-market data and deep local networks, we provide highly competitive, transparent pricing models. No hidden fees, just straightforward FOB or CIF terms.' },
              { icon: Factory, title: 'End-to-End Support', desc: 'Our dedicated trade desks handle all complex documentation, customs clearances, and multi-modal logistics, providing you with a single point of contact.' }
            ].map((item, idx) => (
               <div key={idx} className="bg-surface-bright p-10 border border-border-gray rounded-sm flex flex-col items-center text-center hover:bg-white transition-colors">
                  <div className="w-16 h-16 rounded-full bg-secondary-container text-primary flex items-center justify-center mb-8">
                    <item.icon size={32} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-deep-forest mb-4">{item.title}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
               </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-surface-bright border-t border-border-gray">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <p className="text-center text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.3em] mb-10">Certified & Compliant</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70">
            {['FairTrade International', 'Rainforest Alliance', 'Organic EU', 'ISO 14001', 'SGS Verified'].map((cert) => (
              <div key={cert} className="font-display text-sm md:text-base font-black text-on-surface-variant uppercase tracking-widest">
                {cert}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Insights */}
      <section className="py-24 bg-white border-t border-border-gray">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div>
              <h2 className="font-display text-3xl font-bold text-deep-forest mb-4">Latest Market Intelligence</h2>
              <p className="text-on-surface-variant max-w-xl">Trade analysis, harvest forecasts, and sourcing strategy from our market intelligence team.</p>
            </div>
            <button
              onClick={() => setActivePage('insights')}
              className="inline-flex items-center gap-2 font-display font-bold text-primary hover:gap-3 transition-all">
              View All Insights <ArrowRight size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.slice(0, 3).map((a) => (
              <div key={a.id} className="group cursor-pointer" onClick={() => openArticle(a.id)}>
                <div className="aspect-[16/10] overflow-hidden rounded-sm border border-border-gray mb-6">
                  <img src={a.img} alt={a.title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                </div>
                <div className="text-[10px] font-bold text-tertiary uppercase tracking-widest mb-3">{a.cat}</div>
                <h3 className="font-display text-lg font-bold text-deep-forest mb-3 leading-tight group-hover:text-primary transition-colors">{a.title}</h3>
                <div className="text-xs text-on-surface-variant uppercase font-medium">{a.date}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 bg-deep-forest text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-bold mb-4 tracking-tight">Ready to Secure Your Supply Chain?</h2>
            <p className="text-outline-variant leading-relaxed opacity-80">Connect with our trade specialists to discuss volume requirements, pricing terms, and delivery schedules.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <button
              onClick={() => setActivePage('contact')}
              className="bg-tertiary text-white font-display font-bold px-10 py-5 rounded-sm hover:bg-white hover:text-deep-forest transition-all shadow-xl">
              Enquire Now
            </button>
            <button
              onClick={() => setActivePage('sourcing')}
              className="border border-white/30 text-white font-display font-semibold px-10 py-5 rounded-sm hover:bg-white/10 transition-all">
              View Sourcing Details
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const ProductPage = ({ setActivePage }: { setActivePage: (p: string) => void }) => {
  return (
    <div className="pt-20">
      <header className="bg-surface-bright border-b border-border-gray">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-6 flex flex-col items-start gap-6">
            <span className="inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container font-sans text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
              <Verified size={14} /> Certified Global Exporter
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-deep-forest tracking-tight">
              Reliable African Raw Cashew Supply
            </h1>
            <p className="text-lg text-on-surface-variant leading-relaxed">
              Securing high-yield Raw Cashew Nuts (RCN) directly from top-producing African regions. We ensure meticulous quality control and consistent supply chains.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
              <button 
                onClick={() => setActivePage('contact')}
                className="bg-tertiary text-white font-display font-semibold px-8 py-4 rounded-sm hover:bg-tertiary-container transition-all flex items-center justify-center gap-3">
                Request Quotation <ArrowRight size={18} />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mt-8 border-t border-border-gray pt-8 w-full">
              <div>
                <p className="font-display text-2xl font-bold text-deep-forest">50K+</p>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">MT Annual Volume</p>
              </div>
              <div className="hidden sm:block w-px h-12 bg-border-gray"></div>
              <div>
                <p className="font-display text-2xl font-bold text-deep-forest">KOR 48+</p>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Premium Quality</p>
              </div>
            </div>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-6 h-[300px] md:h-[500px] w-full rounded-sm overflow-hidden shadow-2xl border border-border-gray relative"
          >
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEZK_Z_bd3WGYPhw6b_QodN8_H_EEcv3V31qLRGbZCs2aPyOkYaNgUCsq8CRqGZWkMvDMSq4z22prRYHcGYSbuO7io9ohjXrSZH94CgpFQWs63ii1r07jI_hSQif_6od5-9J3I2w2tDnXu-wbYO623a_rgbclUsVVS8vveA5uOw9yY2mufwv-xmNfGe4-CCLFJUhP8N3FCeFR-_k98RsCk0rV-7ph7sUWDQpW-kF54DBBVNnj-27CFQenNkJpLSj5jC3k81ZBh768" alt="Raw Cashew Nuts" className="w-full h-full object-cover" />
            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-sm border border-border-gray shadow-lg">
               <span className="text-[10px] font-bold text-primary block uppercase tracking-tighter">Harvest Season</span>
               <span className="font-display text-xl font-bold text-deep-forest">2024 Active</span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Technical Specs */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="mb-16">
            <h2 className="font-display text-3xl font-bold text-deep-forest mb-6 tracking-tight">Technical Specifications</h2>
            <p className="text-on-surface-variant max-w-2xl leading-relaxed">
              Our RCN undergoes rigorous inspection to meet international processing standards. Data below reflects standard export parameters.
            </p>
          </div>
          <div className="bg-surface-bright border border-border-gray rounded-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 border-b md:border-b-0 md:border-r border-border-gray">
                <h3 className="font-sans text-xs font-bold text-trade-blue uppercase tracking-[0.2em] mb-8 pb-3 border-b border-border-gray">Primary Metrics</h3>
                <div className="space-y-1">
                  {[
                    ['Kernel Out-Turn Ratio (KOR)', '48 - 52 lbs'],
                    ['Nut Count', '170 - 210 per kg'],
                    ['Moisture Content', '< 8%'],
                    ['Defective Nuts', '< 5%']
                  ].map(([label, val], i) => (
                    <div key={i} className={`flex justify-between items-center py-4 px-4 rounded-sm ${i % 2 === 0 ? 'bg-white' : 'bg-transparent'}`}>
                      <span className="text-sm text-on-surface-variant font-medium">{label}</span>
                      <span className="text-sm font-bold text-deep-forest">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-8">
                 <h3 className="font-sans text-xs font-bold text-trade-blue uppercase tracking-[0.2em] mb-8 pb-3 border-b border-border-gray">Logistics & Packaging</h3>
                 <div className="space-y-1">
                  {[
                    ['Standard Packaging', '80kg Jute Bags'],
                    ['Container Load (20ft)', '17 Metric Tons'],
                    ['Container Load (40ft)', '28 Metric Tons'],
                    ['Inspection Partner', 'SGS / Bureau Veritas']
                  ].map(([label, val], i) => (
                    <div key={i} className={`flex justify-between items-center py-4 px-4 rounded-sm ${i % 2 === 0 ? 'bg-white' : 'bg-transparent'}`}>
                      <span className="text-sm text-on-surface-variant font-medium">{label}</span>
                      <span className="text-sm font-bold text-deep-forest">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sourcing Origins */}
      <section className="py-24 bg-surface-bright border-t border-border-gray">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="font-display text-3xl font-bold text-deep-forest mb-4 tracking-tight">Sourcing Origins</h2>
              <p className="text-on-surface-variant max-w-2xl leading-relaxed">
                We leverage a robust network across key African producing nations to ensure year-round supply stability.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-secondary-container text-primary text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest">
              <Globe size={14} /> Global Reach
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
             <div className="col-span-2 row-span-2 relative h-[400px] md:h-auto rounded-sm overflow-hidden group border border-border-gray shadow-sm">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6QjNo0KhTMbqnfbgjOF4je4PqWLXMqKn_FZMNPWnoHyZszgMt99BXuxFyNUMA2mGQbUmQhNxyAQLGYRv8OxmFuCAjShleL48b2-JNVZfvTNzEKMRwcJNF2wiubZPFTJeDCAIq4ETrOHBHfCHs_ikxL1jWzzU5C2yXVSzNbPDUIx4lt2lcffmujow0-Iw7usb5vxwRRZVQJ8FKtteaF7qDqXkfT8eLYx7OIBKPVJl2ZOiDbwm3wIcQNynsA-lxtGWyjhwj4960wK8" alt="Ivory Coast" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/90 via-deep-forest/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8">
                   <div className="mb-2 uppercase text-[10px] font-black text-white/60 tracking-[0.3em]">Primary Origin</div>
                   <h3 className="font-display text-3xl font-bold text-white mb-2">Ivory Coast</h3>
                   <p className="text-xs text-white/80 line-clamp-2">The world's largest producer, offering excellent KOR and consistent volume.</p>
                </div>
             </div>
             {['Benin', 'Ghana', 'Tanzania', 'Nigeria'].map((origin) => (
                <div key={origin} className="bg-white p-8 border border-border-gray rounded-sm flex flex-col justify-between hover:border-primary transition-all group">
                   <div className="w-12 h-12 rounded-sm bg-surface-container flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                      <MapPin size={24} />
                   </div>
                   <div>
                      <h4 className="font-display text-xl font-bold text-deep-forest mb-2">{origin}</h4>
                      <p className="text-xs text-on-surface-variant leading-relaxed">Strategic sourcing network with on-ground quality inspectors.</p>
                   </div>
                </div>
             ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const InsightsPage = ({ setActivePage, openArticle }: { setActivePage: (p: string) => void; openArticle: (id: string) => void }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setSubscribed(true);
    setEmail('');
  };

  const featured = articles.find(a => a.featured) ?? articles[0];
  const rest = articles.filter(a => a.id !== featured.id);

  return (
    <div className="pt-20">
      <header className="bg-surface-bright border-b border-border-gray py-24 mb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <div className="max-w-3xl mx-auto border-x border-border-gray/50 px-4">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-deep-forest mb-8 tracking-tight">
              Industry Insights & Market Updates
            </h1>
            <p className="text-lg text-on-surface-variant leading-relaxed">
              Expert analysis, critical market data, and comprehensive export guides focused on African agricultural commodities.
            </p>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-24">
        {/* Featured Post Card */}
        <div
          className="grid grid-cols-1 md:grid-cols-12 gap-12 bg-white border border-border-gray rounded-sm overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-500 mb-20"
          onClick={() => openArticle(featured.id)}
        >
          <div className="md:col-span-12 lg:col-span-8 relative h-96 md:h-[500px] overflow-hidden">
            <img src={featured.img} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" />
            <div className="absolute top-6 left-6 bg-primary text-white px-4 py-1.5 font-display text-[10px] font-bold rounded-sm uppercase tracking-widest shadow-lg">{featured.cat}</div>
          </div>
          <div className="md:col-span-12 lg:col-span-4 p-8 md:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-6 text-on-surface-variant font-sans text-xs font-bold uppercase tracking-widest">
              <Clock size={16} /> {featured.date}
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-deep-forest mb-8 leading-tight tracking-tight group-hover:text-primary transition-colors">
              {featured.title}
            </h2>
            <p className="text-on-surface-variant leading-relaxed mb-10 text-sm">
              {featured.excerpt}
            </p>
            <div className="flex items-center text-primary font-display text-sm font-bold gap-2">
              Read Full Report <ArrowRight size={20} />
            </div>
          </div>
        </div>

        {/* List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {rest.map((insight) => (
            <div key={insight.id} className="group cursor-pointer" onClick={() => openArticle(insight.id)}>
              <div className="aspect-[16/10] overflow-hidden rounded-sm border border-border-gray mb-6">
                <img src={insight.img} alt={insight.title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
              </div>
              <div className="text-[10px] font-bold text-tertiary uppercase tracking-widest mb-3">{insight.cat}</div>
              <h3 className="font-display text-lg font-bold text-deep-forest mb-4 leading-tight group-hover:text-primary transition-colors">{insight.title}</h3>
              <div className="text-xs text-on-surface-variant font-sans uppercase font-medium">{insight.date}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-deep-forest py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
           <div className="md:w-1/2 text-white">
              <h3 className="font-display text-3xl font-bold mb-4 tracking-tight">Stay Updated on Market Trends</h3>
              <p className="text-outline-variant leading-relaxed text-sm opacity-80">Join our exclusive mailing list to receive monthly market reports, price trend alerts, and strategic sourcing advice directly to your inbox.</p>
           </div>
           <div className="md:w-1/2 w-full flex flex-col gap-4">
              {subscribed ? (
                <div className="bg-white/10 border border-tertiary/40 rounded-sm px-6 py-5 flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-tertiary shrink-0" />
                  <span className="text-white text-sm">Thanks — you're on the list. Watch your inbox for our next market report.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your business email"
                    className="flex-grow px-6 py-4 bg-white/10 border border-white/20 text-white rounded-sm focus:outline-none focus:border-white transition-all placeholder:text-white/40"
                  />
                  <button type="submit" className="bg-tertiary text-white font-display font-bold px-8 py-4 rounded-sm hover:bg-white hover:text-deep-forest transition-all">
                    Subscribe Now
                  </button>
                </form>
              )}
              <p className="text-[10px] text-white/40 font-medium uppercase tracking-widest">We respect your privacy. No spam, just trade intelligence.</p>
           </div>
        </div>
      </section>
    </div>
  );
};

const ContactPage = () => {
  return (
    <div className="pt-20">
      <header className="bg-surface-container-low border-b border-border-gray py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(circle_at_100%_100%,#012d1d_0,transparent_40%),radial-gradient(circle_at_0%_0%,#C4A265_0,transparent_40%)]"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-deep-forest mb-6 tracking-tight">Global Trade Inquiries</h1>
            <p className="text-lg text-on-surface-variant leading-relaxed">Partner with Horizon Agro Exports for secure, high-volume agricultural sourcing. Connect with our trade specialists to structure your next contract.</p>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-24 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-4 space-y-12">
          <div>
             <h2 className="font-display text-xl font-bold text-deep-forest uppercase tracking-widest mb-10 pb-4 border-b border-border-gray">Direct Contact</h2>
             <div className="space-y-10">
                <div className="flex gap-6">
                  <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-1">General inquiries</div>
                    <div className="text-lg font-bold text-deep-forest">info@horizonagroexports.com</div>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-1">Global Headquarters</div>
                    <div className="text-lg font-bold text-deep-forest">South Africa HQ</div>
                    <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">Strategic access to major shipping routes and premier agricultural zones.</p>
                  </div>
                </div>
             </div>
          </div>
          
          <div className="bg-white p-8 border border-border-gray rounded-sm">
             <h3 className="font-display text-xl font-bold text-deep-forest mb-8">Why Horizon?</h3>
             <div className="space-y-6">
                {[
                  ['ISO 9001 Certified Quality Control', Verified, 'text-harvest-gold'],
                  ['Exporting to 40+ Destination Ports', Globe, 'text-trade-blue'],
                  ['Premium Grade Sustainable Sourcing', TrendingUp, 'text-primary'],
                  ['Secure Trade Logistics & Compliance', Shield, 'text-deep-forest']
                ].map(([text, Icon, colorClass], i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Icon size={20} className={colorClass as string} />
                    <span className="text-sm font-medium text-on-surface-variant">{text as string}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="lg:col-span-8">
           <div className="bg-white border border-border-gray p-8 md:p-16 rounded-sm shadow-2xl relative">
              <div className="flex justify-between items-end mb-12 border-b border-border-gray pb-8">
                 <div>
                    <h2 className="font-display text-3xl font-bold text-deep-forest">Request a Quotation</h2>
                    <p className="text-sm text-on-surface-variant mt-3">Complete our brief inquiry form to receive precision logistics and pricing models.</p>
                 </div>
                 <FileText size={48} className="text-border-gray hidden sm:block" />
              </div>

              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Company Name *</label>
                    <input className="border border-border-gray bg-surface-bright px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all rounded-sm" type="text" required />
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Country of Destination *</label>
                    <input className="border border-border-gray bg-surface-bright px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all rounded-sm" type="text" required />
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Contact Person *</label>
                    <input className="border border-border-gray bg-surface-bright px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all rounded-sm" type="text" required />
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">WhatsApp / Phone *</label>
                    <input className="border border-border-gray bg-surface-bright px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all rounded-sm" type="tel" required />
                  </div>
                </div>
                <div className="flex flex-col gap-3 text-sm">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Commodity Interest & Volume</label>
                  <textarea rows={4} className="border border-border-gray bg-surface-bright p-4 focus:outline-none focus:border-primary transition-all rounded-sm" placeholder="e.g. Raw Cashew Nuts, 5000 MT, Shipment Term FOB..." />
                </div>
                <div className="pt-10 border-t border-border-gray flex flex-col sm:flex-row justify-between items-center gap-6">
                  <p className="text-[10px] text-on-surface-variant uppercase font-medium tracking-widest">Professional inquiries only. Response time: &lt; 24h</p>
                  <button type="submit" className="w-full sm:w-auto bg-tertiary text-white font-display font-bold px-12 py-5 rounded-sm hover:bg-tertiary-container transition-all flex items-center justify-center gap-2 shadow-lg">
                    Submit Request <ArrowRight size={20} />
                  </button>
                </div>
              </form>
           </div>
        </div>
      </section>
    </div>
  );
};

const ArticlePage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const article = articles.find(a => a.id === id) ?? articles[0];
  const related = articles.filter(a => a.id !== article.id).slice(0, 2);
  const setActivePage = (p: string) => navigate(pageToPath(p));
  const openArticle = (aid: string) => navigate(`/insights/${aid}`);

  return (
    <div className="pt-20">
      <header className="max-w-4xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="mb-8">
          <button
            onClick={() => setActivePage('insights')}
            className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
          >
            <ChevronRight size={16} className="rotate-180" /> Back to Insights
          </button>
        </div>
        <div className="mb-6">
           <span className="bg-primary text-white px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-widest rounded-sm">{article.cat}</span>
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-bold text-deep-forest mb-8 leading-tight tracking-tight">
          {article.title}
        </h1>
        <div className="flex items-center gap-6 pb-12 border-b border-border-gray">
           <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-border-gray bg-surface-container">
                 <img src={article.author.avatar} alt={article.author.name} className="w-full h-full object-cover" />
              </div>
              <div>
                 <p className="text-sm font-bold text-primary leading-none">{article.author.name}</p>
                 <p className="text-xs text-on-surface-variant font-medium mt-1">{article.author.role}</p>
              </div>
           </div>
           <div className="h-8 w-px bg-border-gray"></div>
           <div className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{article.date}</div>
        </div>
      </header>

      <div className="w-full h-96 md:h-[600px] overflow-hidden">
         <img src={article.img} alt={article.title} className="w-full h-full object-cover" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 markdown-body">
           {article.body.map((block, idx) => {
             if (block.type === 'h2') return <h2 key={idx}>{block.content}</h2>;
             if (block.type === 'p') return <p key={idx}>{block.content}</p>;
             if (block.type === 'ul') return (
               <ul key={idx}>
                 {block.content.map((item, i) => (
                   <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                 ))}
               </ul>
             );
             if (block.type === 'callout') return (
               <div key={idx} className="my-10 p-8 bg-surface-bright border border-border-gray rounded-sm">
                 <h3 className="font-display text-xl font-bold text-deep-forest mb-6">{block.heading}</h3>
                 <ul className="space-y-4 text-sm list-none pl-0">
                   {block.items.map((item, i) => (
                     <li key={i} className="flex items-center gap-3">
                       <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
                       <span>{item}</span>
                     </li>
                   ))}
                 </ul>
               </div>
             );
             return null;
           })}
        </div>

        <aside className="lg:col-span-4 space-y-12">
           <div className="p-8 bg-surface-bright border border-border-gray rounded-sm">
              <h3 className="font-display text-xl font-bold text-deep-forest mb-4">Secure Your Supply</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-8">Discuss forward contracts and lock in current favorable rates with our trade specialists.</p>
              <button
                onClick={() => setActivePage('contact')}
                className="w-full bg-deep-forest text-white font-display font-bold py-4 rounded-sm hover:opacity-90 transition-all">
                Request a Quote
              </button>
           </div>

           <div className="p-8 bg-white border border-border-gray rounded-sm">
              <h3 className="font-display text-lg font-bold text-deep-forest mb-6 flex items-center gap-2">
                <BarChart3 size={20} className="text-harvest-gold" /> Market Highlights
              </h3>
              <div className="space-y-6">
                 <div>
                   <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Avg. KOR (Benin)</div>
                   <div className="text-2xl font-bold text-primary">48 - 50 lbs</div>
                 </div>
                 <div>
                   <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Moisture content</div>
                   <div className="text-2xl font-bold text-primary">&lt; 10%</div>
                 </div>
                 <div>
                   <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Transit Time (WAF &gt; VIE)</div>
                   <div className="text-2xl font-bold text-primary">~45 Days</div>
                 </div>
              </div>
           </div>

           <div>
              <h3 className="font-display text-lg font-bold text-deep-forest mb-6">Related Insights</h3>
              <div className="space-y-4">
                 {related.map((r) => (
                   <div key={r.id} onClick={() => openArticle(r.id)} className="p-5 border border-border-gray rounded-sm hover:border-primary cursor-pointer transition-all">
                      <h4 className="text-sm font-bold text-primary mb-2 leading-tight">{r.title}</h4>
                      <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest">{r.date}</p>
                   </div>
                 ))}
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
};

// --- App ---

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [activeArticleId, setActiveArticleId] = useState<string>(articles[0].id);

  const openArticle = (id: string) => {
    setActiveArticleId(id);
    setActivePage('article');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activePage, activeArticleId]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      <main className="flex-grow">
        {activePage === 'home' && <HomePage setActivePage={setActivePage} openArticle={openArticle} />}
        {activePage === 'sourcing' && <SourcingPage setActivePage={setActivePage} />}
        {activePage === 'product' && <ProductPage setActivePage={setActivePage} />}
        {activePage === 'insights' && <InsightsPage setActivePage={setActivePage} openArticle={openArticle} />}
        {activePage === 'article' && <ArticlePage articleId={activeArticleId} setActivePage={setActivePage} openArticle={openArticle} />}
        {activePage === 'contact' && <ContactPage />}
        {activePage === 'logistics' && <LogisticsPage setActivePage={setActivePage} />}
        {activePage === 'sustainability' && <SustainabilityPage setActivePage={setActivePage} />}
      </main>

      <Footer setActivePage={setActivePage} />
    </div>
  );
}
