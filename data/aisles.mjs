// The 21 aisles at Best Deal, in the order shown on the original site.
// `stocked: false` aisles render dimmed with a COMING SOON tag.
// `popular: true` = the top 3 aisles by sales. TODO(client): confirm with real sales data.
// `label` = gradient colours used for auto-generated spec labels (colour-coded by aisle).
// Aisle 21 was unreadable in the source video [UNCLEAR] — "Paint & Sundries" is a placeholder.

export const AISLES = [
  {
    num: 1, slug: 'engine-oil', name: 'Engine Oil', icon: 'oil', stocked: true, popular: true, collection: 'shop',
    label: ['#2a1704', '#a35f0b', '#ffb547'],
    blurb: 'Motor oil, 2-cycle and marine oil, gear oil and hydraulic fluid for cars, trucks, scooters, boats and shop equipment.',
    compat: 'Match the viscosity grade (for example 0W-20) and the API / ILSAC rating to your owner’s manual. Two-stroke oils are mixed with fuel at the ratio printed on your equipment. Bring the old bottle to the counter if you are unsure.',
  },
  {
    num: 2, slug: 'lighting', name: 'Lighting', icon: 'bulb', stocked: true, collection: 'home-garden',
    label: ['#2b2405', '#8f7a0c', '#ffe066'],
    blurb: 'LED bulbs, tubes, fixtures, lanterns and flashlights — including rechargeable lights for typhoon season.',
    compat: 'Check the base type (E26 standard, E12 candelabra), the fixture’s maximum wattage and whether the bulb is rated for enclosed or outdoor fixtures.',
  },
  {
    num: 3, slug: 'construction-supplies', name: 'Construction Supplies', icon: 'brick', stocked: true, collection: 'shop',
    label: ['#1b1c1f', '#55585f', '#d9dbe0'],
    blurb: 'Concrete, mortar, fasteners, hurricane ties, adhesives, sealants, tape and tarps.',
    compat: 'Follow the mixing ratio and cure time on the bag. For hurricane ties, use the fasteners specified by the manufacturer and check local building requirements.',
  },
  {
    num: 4, slug: 'pool-maintenance', name: 'Pool Maintenance', icon: 'wave', stocked: true, collection: 'home-garden',
    label: ['#04222a', '#0b6f80', '#5fe3f0'],
    blurb: 'Chlorine, shock, balancers, clarifiers, test strips and skimming gear for clear water in island sun.',
    compat: 'Test water before adding chemicals and add one product at a time. Never mix pool chemicals together. Dosage depends on pool volume — see the label.',
  },
  {
    num: 5, slug: 'power-steering-fluid', name: 'Power Steering Fluid', icon: 'steering', stocked: true, collection: 'shop',
    label: ['#2a0c06', '#9c3415', '#ff8a5c'],
    blurb: 'Power steering fluid, stop-leak and automatic transmission fluid.',
    compat: 'Some vehicles require a specific fluid (for example ATF Dexron III or a manufacturer fluid). Check the cap of your reservoir or your owner’s manual.',
  },
  {
    num: 6, slug: 'kitchen-appliances', name: 'Kitchen Appliances', icon: 'pot', stocked: true, collection: 'home-garden',
    label: ['#26100f', '#8a3d34', '#ffb09c'],
    blurb: 'Rice cookers, coffee makers, kettles, blenders, microwaves and countertop cookers.',
    compat: 'Most countertop appliances run on standard 110–120V outlets. Check the wattage before running several appliances on one circuit.',
  },
  {
    num: 7, slug: 'butane-gas', name: 'Butane Gas', icon: 'flame', stocked: true, popular: true, collection: 'home-garden',
    label: ['#2b0905', '#b3260f', '#ff9a3c'],
    blurb: 'Butane canisters and portable stoves — the island kitchen backup.',
    compat: 'Use canisters made for your stove’s connector type. Store away from heat and direct sun, and never use portable stoves indoors without ventilation.',
  },
  {
    num: 8, slug: 'engine-coolant', name: 'Engine Coolant', icon: 'thermo', stocked: true, collection: 'shop',
    label: ['#06231a', '#0f7a52', '#6ff0b8'],
    blurb: 'Antifreeze/coolant, radiator flush, stop-leak and coolant additives.',
    compat: 'Many Asian vehicles specify a phosphate-enhanced coolant. Do not mix coolant types; check the colour and specification in your owner’s manual.',
  },
  {
    num: 9, slug: 'office-supplies', name: 'Office Supplies', icon: 'clip', stocked: false, collection: 'shop',
    label: ['#14161c', '#3d4352', '#c3c9d6'], blurb: 'Arriving soon.', compat: '',
  },
  {
    num: 10, slug: 'electrical-supplies', name: 'Electrical Supplies', icon: 'plug', stocked: true, collection: 'home-garden',
    label: ['#160b2e', '#5b2bb5', '#c3a2ff'],
    blurb: 'Wire, outlets, switches, breakers, cords, batteries and generators.',
    compat: 'Match breaker brand and type to your panel. Wire gauge must suit the circuit’s amperage. If in doubt, consult a licensed electrician.',
  },
  {
    num: 11, slug: 'lawn-garden', name: 'Lawn & Garden', icon: 'leaf', stocked: true, popular: true, collection: 'home-garden',
    label: ['#08220f', '#1f7a32', '#9be36a'],
    blurb: 'Trimmer line, trimmers, plant food, potting mix, weed and insect control, hoses and hand tools.',
    compat: 'Check your trimmer head’s maximum line diameter (for example .080in or .095in). Read and follow the label on all weed and insect products.',
  },
  {
    num: 12, slug: 'auto-parts-cleaner', name: 'Auto & Parts Cleaner', icon: 'spray', stocked: true, collection: 'shop',
    label: ['#2a0608', '#a3141c', '#ff6b6b'],
    blurb: 'Brake cleaner, degreasers, sensor and contact cleaners, fuel treatments and penetrants.',
    compat: 'Use sensor-safe cleaners on mass air flow sensors and electronics. Some cleaners can damage paint and plastics — test on a hidden area first.',
  },
  {
    num: 13, slug: 'power-tools', name: 'Power Tools', icon: 'drill', stocked: true, collection: 'shop',
    label: ['#121212', '#3a3208', '#ffd21f'],
    blurb: 'Cordless drills, drivers, saws, grinders, trimmers, batteries and bits.',
    compat: 'Cordless tools and batteries work within the same platform (for example 20V MAX with 20V MAX). “Tool only” means battery and charger are sold separately.',
  },
  {
    num: 14, slug: 'airconditioning', name: 'Airconditioning', icon: 'snow', stocked: true, collection: 'shop',
    label: ['#04122e', '#0f3f9e', '#6fb6ff'],
    blurb: 'Window, split-type and portable air conditioners, refrigerant, filters and coil cleaner.',
    compat: 'Match BTU to room size and check the voltage (115V or 230V). R-1234yf and R-134a are not interchangeable — check the label under your hood.',
  },
  {
    num: 15, slug: 'car-cleans-protectant', name: 'Car Cleans & Protectant', icon: 'car', stocked: true, collection: 'shop',
    label: ['#1a0a24', '#6b2a8c', '#f0a3ff'],
    blurb: 'Car wash, wax, protectants, glass care, tire shine, wipes and microfiber.',
    compat: 'Wash and wax in the shade — island sun dries products fast and can leave streaks. Use glass-safe products on tinted windows.',
  },
  {
    num: 16, slug: 'all-purpose-cleaner', name: 'All-Purpose Cleaner', icon: 'sparkle', stocked: true, collection: 'home-garden',
    label: ['#05231f', '#11806e', '#7ff5dc'],
    blurb: 'Multi-surface cleaners, bleach, disinfectants and degreasers for home and shop.',
    compat: 'Never mix bleach with ammonia or acidic cleaners. Follow dilution directions on concentrates.',
  },
  {
    num: 17, slug: 'brake-fluid', name: 'Brake Fluid', icon: 'disc', stocked: true, collection: 'shop',
    label: ['#24040a', '#8c0f24', '#ff7088'],
    blurb: 'DOT 3, DOT 4 and racing brake fluid.',
    compat: 'Use the DOT rating printed on your master cylinder cap. DOT 5 (silicone) must never be mixed with DOT 3 or DOT 4.',
  },
  {
    num: 18, slug: 'bar-chain-lubricant', name: 'Bar & Chain Lubricant', icon: 'chain', stocked: true, collection: 'home-garden',
    label: ['#1d1a05', '#6b5b0c', '#ffcf5c'],
    blurb: 'Bar and chain oil for chainsaws and pole saws.',
    compat: 'Fill the bar oil reservoir every time you refuel the saw.',
  },
  {
    num: 19, slug: 'outdoor-sports', name: 'Outdoor Sports', icon: 'ball', stocked: false, collection: 'home-garden',
    label: ['#14161c', '#3d4352', '#c3c9d6'], blurb: 'Arriving soon.', compat: '',
  },
  {
    num: 20, slug: 'bath-faucets', name: 'Bath & Faucets', icon: 'faucet', stocked: false, collection: 'home-garden',
    label: ['#14161c', '#3d4352', '#c3c9d6'], blurb: 'Arriving soon.', compat: '',
  },
  {
    num: 21, slug: 'paint-sundries', name: 'Paint & Sundries', icon: 'roller', stocked: false, collection: 'home-garden',
    label: ['#14161c', '#3d4352', '#c3c9d6'], blurb: 'Arriving soon.', compat: '',
  },
];
