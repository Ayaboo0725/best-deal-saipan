// Draft articles for the client to review/edit before launch.
export type Block = { h?: string; p?: string; ul?: string[] };
export type Post = { slug: string; title: string; date: string; read: string; tag: string; excerpt: string; cover: string; aisle: string; body: Block[] };

export const POSTS: Post[] = [
  {
    slug: 'choosing-engine-oil-for-island-heat',
    title: 'Choosing engine oil for island heat',
    date: '2026-10-20',
    read: '4 min',
    tag: 'Auto',
    aisle: 'engine-oil',
    cover: 'mobil-1-0w-20-full-synthetic-motor-oil',
    excerpt: 'Viscosity grades, synthetic vs. conventional, and why stop-and-go Beach Road traffic matters more than you think.',
    body: [
      { p: 'Saipan is hot, humid and mostly short trips — exactly the conditions that are hardest on engine oil. Picking the right bottle takes about a minute if you know what to look for.' },
      { h: 'Start with your owner’s manual', p: 'The grade printed in your manual (for example 0W-20 or 5W-30) is the one your engine was designed around. The first number is how the oil flows when cold; the second is its thickness at operating temperature. In island heat, sticking to the recommended second number matters most.' },
      { h: 'Synthetic, blend or conventional?', ul: ['Full synthetic resists breaking down in heat and protects better on short, stop-and-go trips.', 'Synthetic blends are a middle ground for older engines and tighter budgets.', 'High-mileage formulas add seal conditioners for engines past ~75,000 miles.'] },
      { h: 'Scooters, trimmers and outboards', p: 'Four-stroke motorcycles need oil rated for wet clutches (look for JASO MA). Two-stroke equipment needs 2-cycle oil mixed with fuel at the ratio on the machine — and outboards want TC-W3 marine oil.' },
      { h: 'Check it more often than you think', p: 'Heat and short trips burn oil faster. Check the dipstick every couple of fill-ups, and bring the old bottle to the counter if you’re unsure what’s in there.' },
    ],
  },
  {
    slug: 'typhoon-season-checklist',
    title: 'Typhoon-season checklist: what to grab before the next storm',
    date: '2026-09-08',
    read: '5 min',
    tag: 'Home',
    aisle: 'lighting',
    cover: 'philips-rechargeable-emergency-led-bulb-a19',
    excerpt: 'Light, power, cooking and repair basics — the short list to sort out before the warnings start.',
    body: [
      { p: 'When a storm is a few days out, shelves empty fast. Getting the basics ready early means you’re checking on neighbours instead of standing in line.' },
      { h: 'Light and power', ul: ['Rechargeable emergency bulbs and LED lanterns', 'AA and D batteries — check the sizes your lights actually use', 'A generator and a proper outdoor-rated cord, run outside only, well away from windows'] },
      { h: 'Cooking without power', ul: ['A portable butane stove and a few 4-packs of canisters', 'Use stoves outdoors or with plenty of ventilation'] },
      { h: 'Secure and repair', ul: ['Hurricane ties for roof framing (fit before the season, not during the storm)', 'Heavy-duty tarps, duct tape and waterproof patch tape', 'Roof cement for small leaks once it’s safe to get up there'] },
      { h: 'After the storm', p: 'Fuel stabilizer keeps generator fuel fresh between storms, and a chainsaw with bar & chain oil makes short work of fallen branches. Stay safe and follow official guidance first.' },
    ],
  },
  {
    slug: 'keeping-a-pool-clear-in-island-sun',
    title: 'Keeping a pool clear in salt air and island sun',
    date: '2026-08-14',
    read: '3 min',
    tag: 'Pool',
    aisle: 'pool-maintenance',
    cover: 'hth-3in-stabilized-chlorine-tabs',
    excerpt: 'Test, balance, shock — a simple weekly routine that keeps algae away in tropical conditions.',
    body: [
      { p: 'Strong sun burns off chlorine quickly and warm water helps algae grow. A short routine beats a big rescue every time.' },
      { h: 'Test two or three times a week', p: 'Test strips take 30 seconds. Aim for a pH around 7.4–7.6 and keep free chlorine steady. Adjust pH first — chlorine works poorly when pH is off.' },
      { h: 'Use stabilized chlorine', p: 'Stabilized tabs in a floater or feeder protect chlorine from the sun so it lasts longer between top-ups.' },
      { h: 'Shock after storms and parties', p: 'Heavy rain, debris and lots of swimmers use up chlorine. Shock in the evening so the sun doesn’t burn it off, and run the pump overnight.' },
      { h: 'Safety first', p: 'Add chemicals to water, never water to chemicals, one product at a time — and never mix pool chemicals together.' },
    ],
  },
];

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);
