// ─────────────────────────────────────────────────────────────────────────────
// SAMPLE CATALOG — 202 products across the 17 stocked aisles.
// TODO(client): replace with the real Best Deal product list (names, sizes,
// prices, stock and photos). Prices, stock levels and sale prices below are
// placeholders so the store can be designed and tested end to end.
//
// Row format:
//   [brand, name, spec, art, sizes, options]
//   spec   – short spec headline used on generated labels (e.g. "12K BTU")
//   art    – packshot shape ("bottle", "jug", "pail", "aerosol", "trigger",
//            "bulb", "canister", "box", "bag", "roll", "tube", "tub", "spool")
//            or "label" for products without a photo (auto-generated label)
//   sizes  – "size:price|size:price" ("each" = sold individually)
//   options– { was, deal, new, pop, spot, family, grade, pg }
//            was    = compare-at price of the first size (shows SALE −X%)
//            deal   = featured in "Deal of the week"
//            pop    = position in "Popular right now"
//            spot   = brand spotlight it appears in ("mobil" | "dewalt" | "garden")
//            family = products that are grade variants of each other
//            pg     = Pureguard type filter ("2-cycle" | "gear" | "hydraulic" | "atf")
// Real photos: drop  public/products/<product-slug>.webp  (or .avif/.jpg/.png;
// optional <product-slug>-2.webp for the alternate angle) and rebuild — the
// photo replaces the artwork automatically. Products without a photo keep
// their auto-generated spec label.
// ─────────────────────────────────────────────────────────────────────────────

export const PRODUCTS = {
  'engine-oil': [
    ['Mobil', 'Mobil 1 0W-20 Full Synthetic Motor Oil', '0W-20', 'bottle', '32oz:13.75|5qt:44.95', { family: 'mobil1', grade: '0W-20', spot: 'mobil', pop: 1 }],
    ['Mobil', 'Mobil 1 5W-30 Full Synthetic Motor Oil', '5W-30', 'bottle', '32oz:13.75|5qt:44.95', { family: 'mobil1', grade: '5W-30', spot: 'mobil', was: 15.95, deal: 1 }],
    ['Mobil', 'Mobil 1 0W-16 Advanced Fuel Economy Motor Oil', '0W-16', 'bottle', '32oz:14.50', { family: 'mobil1', grade: '0W-16', spot: 'mobil', new: 1 }],
    ['Mobil', 'Mobil 1 10W-30 High Mileage Full Synthetic', '10W-30', 'bottle', '32oz:14.25|5qt:46.95', { spot: 'mobil' }],
    ['Mobil', 'Mobil 1 Turbo Diesel Truck 5W-40', '5W-40', 'jug', '1gal:39.95', { spot: 'mobil' }],
    ['Mobil', 'Mobil 1 Racing 4T 10W-40 Motorcycle Oil', '10W-40', 'bottle', '1qt:16.95', { spot: 'mobil' }],
    ['Mobil', 'Mobil Super 5W-30 Synthetic Blend', '5W-30', 'bottle', '32oz:9.25|5qt:29.95', { spot: 'mobil' }],
    ['Mobil', 'Mobil Super 10W-40 High Mileage', '10W-40', 'bottle', '32oz:8.95', { spot: 'mobil' }],
    ['Mobil', 'Mobil Delvac 15W-40 Heavy Duty Diesel Oil', '15W-40', 'jug', '1gal:32.50', { spot: 'mobil' }],
    ['Pureguard', 'Pureguard 2-Cycle Engine Oil Synthetic Blend', '2-CYCLE', 'bottle', '2.6oz:2.25|3.2oz:2.75|5.2oz:3.95|6.4oz:4.50|8oz:5.25|16oz:8.50|32oz:14.95|1gal:39.95', { pg: '2-cycle', pgName: '2-cycle · Synthetic Blend · Engine Oil', pop: 3 }],
    ['Pureguard', 'Pureguard TC-W3 Marine 2-Stroke Outboard Oil', 'TC-W3', 'jug', '16oz:7.95|32oz:12.95|1gal:34.95|2.5gal:79.95|5gal:149.00', { pg: '2-cycle', pgName: 'TC-W3 · Marine 2-Stroke · Outboard Oil' }],
    ['Pureguard', 'Pureguard Gear Oil 80W-90 GL-5', '80W-90', 'jug', '32oz:9.95|1gal:29.95|2.5gal:64.95|5gal:119.00', { pg: 'gear', pgName: 'Gear Oil · 80W-90 · GL-5' }],
    ['Pureguard', 'Pureguard Gear Oil 85W-140 GL-5', '85W-140', 'jug', '32oz:10.95|1gal:32.95|5gal:129.00', { pg: 'gear', pgName: 'Gear Oil · 85W-140 · GL-5' }],
    ['Pureguard', 'Pureguard AW 32 Hydraulic Oil', 'AW 32', 'pail', '1gal:24.95|2.5gal:54.95|5gal:99.00', { pg: 'hydraulic', pgName: 'Hydraulic · AW 32 · Anti-Wear' }],
    ['Pureguard', 'Pureguard AW 68 Hydraulic Oil', 'AW 68', 'pail', '1gal:25.95|2.5gal:56.95|5gal:102.00', { pg: 'hydraulic', pgName: 'Hydraulic · AW 68 · Anti-Wear', new: 1 }],
    ['Castrol', 'Castrol GTX 10W-30 Conventional Motor Oil', '10W-30', 'jug', '5qt:27.95'],
    ['Castrol', 'Castrol EDGE 5W-30 Full Synthetic Motor Oil', '5W-30', 'jug', '5qt:42.95'],
    ['Castrol', 'Castrol Power1 4T 10W-40 Motorcycle Oil', '10W-40', 'bottle', '1L:12.95'],
    ['Valvoline', 'Valvoline MaxLife 10W-40 High Mileage Motor Oil', '10W-40', 'bottle', '32oz:9.75'],
    ['Valvoline', 'Valvoline Advanced Full Synthetic 0W-20', '0W-20', 'jug', '5qt:39.95'],
    ['Shell', 'Shell Rotella T4 15W-40 Diesel Engine Oil', '15W-40', 'jug', '1gal:29.95'],
    ['Shell', 'Shell Helix HX7 10W-40 Semi-Synthetic', '10W-40', 'jug', '4L:31.50'],
    ['Havoline', 'Havoline ProDS 5W-30 Full Synthetic', '5W-30', 'bottle', '32oz:11.50'],
    ['STP', 'STP Oil Treatment', 'TREATMENT', 'bottle', '15oz:7.95'],
    ['Lucas', 'Lucas Heavy Duty Oil Stabilizer', 'STABILIZER', 'bottle', '32oz:16.95'],
    ['Marvel', 'Marvel Mystery Oil', 'MYSTERY', 'bottle', '32oz:14.95'],
  ],

  lighting: [
    ['Philips', 'Philips LED A19 60W-Equivalent Daylight Bulb', '60W', 'bulb', '4-pack:12.95', { pop: 6 }],
    ['Philips', 'Philips LED A19 100W-Equivalent Soft White Bulb', '100W', 'bulb', '2-pack:11.95'],
    ['Philips', 'Philips LED BR30 65W-Equivalent Flood Bulb', 'BR30', 'bulb', '2-pack:13.50'],
    ['Philips', 'Philips Rechargeable Emergency LED Bulb A19', '9W', 'bulb', 'each:8.95', { new: 1 }],
    ['Philips', 'Philips CFL Spiral 23W Daylight Bulb', '23W', 'bulb', '2-pack:7.95'],
    ['GE', 'GE LED Candelabra 40W-Equivalent Bulb', 'E12', 'bulb', '4-pack:9.95'],
    ['GE', 'GE Reveal LED A19 75W-Equivalent Bulb', '75W', 'bulb', '2-pack:10.95'],
    ['Sylvania', 'Sylvania LED PAR38 Outdoor Flood 90W-Equivalent', 'PAR38', 'bulb', 'each:14.95'],
    ['Feit Electric', 'Feit Electric LED T8 Tube 4ft 18W', 'T8 4FT', 'label', '2-pack:21.95'],
    ['Feit Electric', 'Feit Electric LED Linkable Shop Light 4ft', '5000LM', 'label', 'each:39.95'],
    ['Feit Electric', 'Feit Electric Outdoor String Lights 48ft', '48FT', 'box', 'each:49.95'],
    ['Lithonia', 'Lithonia LED Flush Mount Ceiling Light 11in', '11IN', 'label', 'each:34.95'],
    ['Lithonia', 'Lithonia LED Dusk-to-Dawn Wall Pack 30W', '30W', 'label', 'each:59.95'],
    ['Westinghouse', 'Westinghouse Ceiling Fan Light Kit', 'FAN KIT', 'label', 'each:29.95'],
    ['Heath Zenith', 'Heath Zenith Motion Sensor Security Light', '180°', 'label', 'each:39.95'],
    ['Westinghouse', 'Westinghouse Solar LED Path Lights', 'SOLAR', 'box', '6-pack:24.95'],
    ['Energizer', 'Energizer LED Headlamp 400 Lumens', '400LM', 'box', 'each:19.95'],
    ['Rayovac', 'Rayovac LED Lantern 600 Lumens', '600LM', 'label', 'each:24.95'],
    ['Coleman', 'Coleman Rechargeable LED Lantern 800 Lumens', '800LM', 'label', 'each:39.95'],
    ['Maglite', 'Maglite Mini LED Flashlight 2AA', '2AA', 'label', 'each:24.95'],
  ],

  'construction-supplies': [
    ['Quikrete', 'Quikrete Concrete Mix', '80LB', 'bag', '80lb:9.95'],
    ['Quikrete', 'Quikrete Fast-Setting Concrete Mix', '50LB', 'bag', '50lb:11.50'],
    ['Sakrete', 'Sakrete Type N Mortar Mix', '60LB', 'bag', '60lb:10.95'],
    ['Simpson Strong-Tie', 'Simpson Strong-Tie H2.5A Hurricane Tie', 'H2.5A', 'label', '10-pack:8.95|50-pack:39.95'],
    ['Grip-Rite', 'Grip-Rite 16d Galvanized Common Nails', '16D', 'box', '5lb:12.95'],
    ['Grip-Rite', 'Grip-Rite Exterior Deck Screws 3in', '#9 3IN', 'box', '1lb:9.95|5lb:39.95'],
    ['Liquid Nails', 'Liquid Nails Heavy Duty Construction Adhesive', 'LN-903', 'tube', '10oz:6.95'],
    ['DAP', 'DAP Alex Plus Acrylic Latex Caulk White', 'CAULK', 'tube', '10.1oz:4.95'],
    ['Gorilla', 'Gorilla Waterproof Patch & Seal Tape 4in', '4IN', 'roll', '10ft:22.95'],
    ['3M', '3M Duct Tape 1.88in', '60YD', 'roll', '60yd:9.95'],
    ['Henry', 'Henry 208 Wet Patch Roof Cement', '208', 'pail', '0.9gal:24.95'],
    ["Thompson's", "Thompson's WaterSeal Waterproofer Clear", 'CLEAR', 'jug', '1gal:26.95'],
    ['Stanley', 'Stanley PowerLock Tape Measure 25ft', '25FT', 'label', 'each:14.95'],
    ['Estwing', 'Estwing Rip Claw Hammer 16oz', '16OZ', 'label', 'each:32.95'],
    ['Husky', 'Husky 6 Mil Plastic Sheeting 10ft x 25ft', '6 MIL', 'roll', 'each:24.95'],
    ['HDX', 'HDX Heavy Duty Silver Tarp 10ft x 12ft', '10×12', 'bag', 'each:19.95'],
  ],

  'pool-maintenance': [
    ['HTH', 'HTH 3in Stabilized Chlorine Tabs', '3IN TABS', 'pail', '5lb:34.95|25lb:119.00'],
    ['HTH', 'HTH Super Shock Treatment', 'SHOCK', 'bag', '1lb:6.95'],
    ['HTH', 'HTH pH Increaser', 'PH UP', 'tub', '4lb:12.95'],
    ['HTH', 'HTH pH Reducer', 'PH DOWN', 'tub', '5lb:13.95'],
    ['Clorox Pool&Spa', 'Clorox Pool&Spa Green Algae Remover', 'ALGAE', 'bottle', '32oz:14.95'],
    ["Leslie's", "Leslie's 6-Way Pool Test Strips", '6-WAY', 'box', '50ct:14.95'],
    ['In The Swim', 'In The Swim Pool Water Clarifier', 'CLARIFIER', 'bottle', '32oz:15.95'],
    ['Kem-Tek', 'Kem-Tek Pool Salt', '40LB', 'bag', '40lb:14.95'],
    ['Poolmaster', 'Poolmaster Telescopic Pool Pole 16ft', '16FT', 'label', 'each:39.95'],
    ['Poolmaster', 'Poolmaster Heavy Duty Leaf Skimmer', 'SKIMMER', 'label', 'each:14.95'],
  ],

  'power-steering-fluid': [
    ['Mobil', 'Mobil 1 Synthetic Automatic Transmission Fluid', 'ATF', 'bottle', '32oz:15.95', { spot: 'mobil' }],
    ['Pureguard', 'Pureguard ATF Dexron III / Mercon', 'ATF', 'jug', '32oz:9.50|1gal:27.95|2.5gal:59.95|5gal:109.00', { pg: 'atf', pgName: 'ATF · Dexron III / Mercon' }],
    ['Prestone', 'Prestone Power Steering Fluid', 'PSF', 'bottle', '12oz:6.95'],
    ['Prestone', 'Prestone Power Steering Fluid + Stop Leak', 'PSF+', 'bottle', '12oz:8.50'],
    ['Lucas', 'Lucas Power Steering Stop Leak', 'STOP LEAK', 'bottle', '12oz:10.95'],
    ['Valvoline', 'Valvoline Power Steering Fluid', 'PSF', 'bottle', '12oz:6.50'],
  ],

  'kitchen-appliances': [
    ['Hamilton Beach', 'Hamilton Beach 12-Cup Programmable Coffee Maker', '12-CUP', 'label', 'each:34.95'],
    ['Hamilton Beach', 'Hamilton Beach 2-Slice Cool-Touch Toaster', '2-SLICE', 'label', 'each:24.95'],
    ['Hamilton Beach', 'Hamilton Beach Electric Kettle 1.7L', '1.7L', 'label', 'each:29.95'],
    ['Oster', 'Oster 6-Speed Blender 48oz', '48OZ', 'label', 'each:39.95'],
    ['Black+Decker', 'Black+Decker 6-Cup Rice Cooker', '6-CUP', 'label', 'each:29.95'],
    ['Zojirushi', 'Zojirushi Micom Rice Cooker 5.5-Cup', '5.5-CUP', 'label', 'each:189.00', { new: 1 }],
    ['Panasonic', 'Panasonic Countertop Microwave 1.2 cu ft', '1.2 CU FT', 'label', 'each:149.00'],
    ['Presto', 'Presto Electric Skillet 16in', '16IN', 'label', 'each:54.95'],
    ['Instant Pot', 'Instant Pot Duo 7-in-1 Pressure Cooker 6qt', '6QT', 'label', 'each:89.95', { was: 109.95, deal: 1 }],
  ],

  'butane-gas': [
    ['Iwatani', 'Iwatani Butane Gas Canister 8oz', '8OZ', 'canister', '4-pack:11.95|12-pack:32.95', { was: 14.95, deal: 1, pop: 2 }],
    ['Gas One', 'Gas One Butane Fuel Canister 8oz', '8OZ', 'canister', '4-pack:9.95'],
    ['Iwatani', 'Iwatani 35FW Portable Butane Stove', '35FW', 'label', 'each:54.95'],
    ['Gas One', 'Gas One GS-3000 Portable Butane Stove', 'GS-3000', 'label', 'each:29.95'],
    ['Ronson', 'Ronson Multi-Fill Ultra Butane', '5.82OZ', 'canister', '5.82oz:5.95'],
  ],

  'engine-coolant': [
    ['Prestone', 'Prestone All Vehicles 50/50 Antifreeze/Coolant', '50/50', 'jug', '1gal:17.95'],
    ['Prestone', 'Prestone All Vehicles Concentrated Antifreeze/Coolant', 'CONC.', 'jug', '1gal:22.95'],
    ['Peak', 'Peak OET Asian Vehicles Blue 50/50 Coolant', 'ASIAN', 'jug', '1gal:18.95'],
    ['Zerex', 'Zerex Asian Vehicle 50/50 Coolant', 'ASIAN', 'jug', '1gal:19.95'],
    ['Toyota', 'Toyota Super Long Life Coolant', 'SLLC', 'jug', '1gal:29.95'],
    ['Prestone', 'Prestone Radiator Flush & Cleaner', 'FLUSH', 'bottle', '22oz:8.95'],
    ["Bar's Leaks", "Bar's Leaks Radiator Stop Leak", 'STOP LEAK', 'bottle', '11oz:9.95'],
    ['Red Line', 'Red Line WaterWetter Coolant Additive', 'ADDITIVE', 'bottle', '12oz:14.95'],
  ],

  'electrical-supplies': [
    ['Southwire', 'Southwire Romex 12/2 NM-B Wire with Ground', '12/2', 'label', '25ft:39.95|50ft:74.95'],
    ['Southwire', 'Southwire Romex 14/2 NM-B Wire with Ground', '14/2', 'label', '50ft:49.95'],
    ['Leviton', 'Leviton 15A Duplex Receptacle White', '15A', 'box', '10-pack:9.95'],
    ['Leviton', 'Leviton 20A GFCI Outlet', '20A GFCI', 'label', 'each:21.95'],
    ['Eaton', 'Eaton 15A Single-Pole Toggle Switch', '15A', 'box', '10-pack:8.95'],
    ['Square D', 'Square D QO 20A Single-Pole Circuit Breaker', '20A', 'label', 'each:12.95'],
    ['Siemens', 'Siemens 30A Double-Pole Circuit Breaker', '30A', 'label', 'each:14.95'],
    ['Woods', 'Woods 12/3 Outdoor Extension Cord 50ft', '50FT', 'label', 'each:39.95'],
    ['Woods', 'Woods 6-Outlet Surge Protector 4ft Cord', '6-OUTLET', 'box', 'each:14.95'],
    ['3M', '3M Temflex Vinyl Electrical Tape 3/4in', '3/4IN', 'roll', '10-pack:12.95'],
    ['Ideal', 'Ideal Twister Wire Connectors Assorted', '100CT', 'box', '100ct:9.95'],
    ['Klein Tools', 'Klein Tools Non-Contact Voltage Tester', 'NCVT', 'label', 'each:24.95'],
    ['Energizer', 'Energizer MAX AA Alkaline Batteries', 'AA', 'box', '24-pack:19.95'],
    ['Energizer', 'Energizer MAX D Alkaline Batteries', 'D', 'box', '4-pack:9.50'],
    ['Champion', 'Champion 4500W Dual Fuel Portable Generator', '4500W', 'label', 'each:649.00', { new: 1 }],
    ['Reliance', 'Reliance 30A Generator Power Cord 10ft', '30A', 'label', 'each:89.95'],
  ],

  'lawn-garden': [
    ['Oregon', 'Oregon Gatorline Trimmer Line .095in', '.095', 'spool', '1lb:14.95|3lb:34.95', { spot: 'garden', pop: 4 }],
    ['Oregon', 'Oregon Magnum Trimmer Line .080in', '.080', 'spool', '3lb:29.95', { spot: 'garden' }],
    ['Echo', 'Echo Black Diamond Trimmer Line .105in', '.105', 'spool', '1lb:26.95', { spot: 'garden' }],
    ['Echo', 'Echo GT-225 Curved Shaft String Trimmer', '21.2CC', 'label', 'each:229.00', { spot: 'garden' }],
    ['Miracle-Gro', 'Miracle-Gro Water Soluble All Purpose Plant Food', '24-8-16', 'tub', '1.5lb:9.95', { spot: 'garden' }],
    ['Miracle-Gro', 'Miracle-Gro Potting Mix', '8QT', 'bag', '8qt:8.95|25qt:19.95', { spot: 'garden' }],
    ['Scotts', 'Scotts Turf Builder Lawn Food', '12.5LB', 'bag', '12.5lb:29.95'],
    ['Ortho', 'Ortho Home Defense Insect Killer', '1.1GAL', 'jug', '1.1gal:14.95', { spot: 'garden' }],
    ['Spectracide', 'Spectracide Weed & Grass Killer Ready-to-Use', '1GAL', 'jug', '1gal:17.95'],
    ['Roundup', 'Roundup Weed & Grass Killer Concentrate', 'CONC.', 'bottle', '32oz:29.95'],
    ['Sevin', 'Sevin Insect Killer Concentrate', 'CONC.', 'bottle', '32oz:18.95'],
    ['Gilmour', 'Gilmour Flexogen Garden Hose 5/8in', '50FT', 'label', '50ft:44.95|100ft:74.95'],
    ['Melnor', 'Melnor Pulsating Sprinkler', '360°', 'label', 'each:14.95'],
    ['Fiskars', 'Fiskars Bypass Pruning Shears', 'PRUNER', 'label', 'each:19.95', { spot: 'garden' }],
    ['Corona', 'Corona Machete 18in', '18IN', 'label', 'each:16.95', { spot: 'garden' }],
    ['True Temper', 'True Temper Round Point Shovel', 'SHOVEL', 'label', 'each:29.95'],
    ['Ames', 'Ames Steel Leaf Rake 24in', '24IN', 'label', 'each:19.95'],
    ['Chapin', 'Chapin 2-Gallon Pump Sprayer', '2GAL', 'label', 'each:29.95', { was: 34.95 }],
    ['Briggs & Stratton', 'Briggs & Stratton SAE 30 Lawn Mower Oil', 'SAE 30', 'bottle', '18oz:6.95'],
    ['Sta-Bil', 'Sta-Bil Fuel Stabilizer', '8OZ', 'bottle', '8oz:9.95'],
  ],

  'auto-parts-cleaner': [
    ['CRC', 'CRC Brakleen Non-Chlorinated Brake Parts Cleaner', 'BRAKLEEN', 'aerosol', '14oz:7.95'],
    ['CRC', 'CRC Mass Air Flow Sensor Cleaner', 'MAF', 'aerosol', '11oz:9.95'],
    ['CRC', 'CRC QD Electronic Contact Cleaner', 'QD', 'aerosol', '11oz:8.95'],
    ['WD-40', 'WD-40 Multi-Use Product', 'WD-40', 'aerosol', '8oz:5.95|12oz:7.95', { pop: 5 }],
    ['WD-40', 'WD-40 Specialist Degreaser', 'DEGREASER', 'aerosol', '15oz:8.50'],
    ['Gunk', 'Gunk Original Engine Degreaser', 'DEGREASER', 'aerosol', '15oz:6.95'],
    ['Berryman', 'Berryman B-12 Chemtool Carburetor Cleaner', 'B-12', 'aerosol', '16oz:7.50'],
    ['Chevron', 'Chevron Techron Fuel System Cleaner', 'TECHRON', 'bottle', '12oz:11.95'],
    ['Sea Foam', 'Sea Foam Motor Treatment', 'SEA FOAM', 'bottle', '16oz:11.95'],
    ['Liquid Wrench', 'Liquid Wrench Penetrating Oil', 'PENETRANT', 'aerosol', '11oz:6.95'],
    ["PB B'laster", "PB B'laster Penetrating Catalyst", 'PB', 'aerosol', '11oz:7.95'],
    ['Permatex', 'Permatex Fast Orange Pumice Hand Cleaner', 'HAND', 'trigger', '15oz:8.95'],
  ],

  'power-tools': [
    ['DeWalt', 'DeWalt 20V MAX Cordless Drill/Driver Kit 1/2in', '20V', 'label', 'each:129.00', { spot: 'dewalt', was: 159.00, deal: 1 }],
    ['DeWalt', 'DeWalt 20V MAX Impact Driver Kit 1/4in', '20V', 'label', 'each:149.00', { spot: 'dewalt' }],
    ['DeWalt', 'DeWalt 20V MAX 6-1/2in Circular Saw (Tool Only)', '6-1/2IN', 'label', 'each:159.00', { spot: 'dewalt' }],
    ['DeWalt', 'DeWalt 20V MAX Reciprocating Saw (Tool Only)', 'RECIP', 'label', 'each:149.00', { spot: 'dewalt' }],
    ['DeWalt', 'DeWalt 20V MAX 5.0Ah Battery', '5.0AH', 'box', '2-pack:169.00', { spot: 'dewalt', new: 1 }],
    ['DeWalt', 'DeWalt 20V MAX 4-1/2in Angle Grinder', '4-1/2IN', 'label', 'each:139.00', { spot: 'dewalt' }],
    ['DeWalt', 'DeWalt 20V MAX 13in String Trimmer', '13IN', 'label', 'each:179.00', { spot: 'dewalt' }],
    ['DeWalt', 'DeWalt Titanium Nitride Drill Bit Set 21-Piece', '21-PC', 'box', 'each:29.95', { spot: 'dewalt' }],
    ['Makita', 'Makita 18V LXT 1/2in Cordless Drill', '18V', 'label', 'each:119.00'],
    ['Black+Decker', 'Black+Decker 20V MAX Cordless Drill', '20V', 'label', 'each:59.95'],
    ['Ryobi', 'Ryobi ONE+ 18V Cordless Jig Saw', '18V', 'label', 'each:79.95'],
    ['Bosch', 'Bosch SDS-Plus 1in Rotary Hammer', 'SDS+', 'label', 'each:229.00'],
    ['Skil', 'Skil 15A 7-1/4in Circular Saw', '15A', 'label', 'each:69.95'],
    ['Craftsman', 'Craftsman V20 Cordless Leaf Blower', 'V20', 'label', 'each:99.00'],
  ],

  airconditioning: [
    ['Midea', 'Midea 9,000 BTU Window Air Conditioner 115V', '9K', 'label', 'each:329.00'],
    ['Midea', 'Midea 12,000 BTU Window Air Conditioner 230V', '12K BTU', 'label', 'each:429.00'],
    ['Carrier', 'Carrier 24,000 BTU Inverter Split-Type Air Conditioner', '24K BTU', 'label', 'each:1399.00'],
    ['Gree', 'Gree 12,000 BTU Inverter Split-Type Air Conditioner', '12K BTU', 'label', 'each:899.00', { new: 1 }],
    ['LG', 'LG 8,000 BTU Portable Air Conditioner', '8K BTU', 'label', 'each:399.00'],
    ['Interdynamics', 'Interdynamics R-1234yf Refrigerant', 'R-1234YF', 'label', '8oz:69.95'],
    ['A/C Pro', 'A/C Pro R-134a Refrigerant Recharge Kit', 'R-134A', 'label', '20oz:49.95'],
    ['Frost King', 'Frost King Window AC Filter 15in x 24in', '15×24', 'label', 'each:6.95'],
    ['Nu-Calgon', 'Nu-Calgon Evap Foam Coil Cleaner', 'COIL', 'label', '18oz:12.95'],
  ],

  'car-cleans-protectant': [
    ['Armor All', 'Armor All Original Protectant', 'PROTECT', 'trigger', '16oz:7.95'],
    ['Armor All', 'Armor All Glass Cleaner', 'GLASS', 'trigger', '22oz:5.95'],
    ['Armor All', 'Armor All Leather Wipes', 'WIPES', 'canister', '20ct:6.95'],
    ["Meguiar's", "Meguiar's Gold Class Car Wash", 'WASH', 'jug', '64oz:14.95'],
    ["Meguiar's", "Meguiar's Ultimate Liquid Wax", 'WAX', 'bottle', '16oz:24.95'],
    ["Meguiar's", "Meguiar's Hot Shine Tire Coating", 'TIRE', 'aerosol', '15oz:11.95'],
    ['Turtle Wax', 'Turtle Wax ICE Spray Wax', 'ICE', 'trigger', '20oz:12.95'],
    ['Turtle Wax', 'Turtle Wax Bug & Tar Remover', 'BUG & TAR', 'trigger', '16oz:7.95'],
    ['Chemical Guys', 'Chemical Guys Mr. Pink Foaming Car Wash', 'PINK', 'bottle', '16oz:11.95'],
    ['Rain-X', 'Rain-X Original Glass Water Repellent', 'RAIN-X', 'bottle', '7oz:7.95'],
    ['Simoniz', 'Simoniz Microfiber Towels', 'MICROFIBER', 'bag', '6-pack:9.95'],
    ['Mothers', 'Mothers California Gold Clay Bar Kit', 'CLAY', 'box', 'each:24.95'],
  ],

  'all-purpose-cleaner': [
    ['Simple Green', 'Simple Green All-Purpose Cleaner', 'APC', 'trigger', '32oz:6.95'],
    ['Simple Green', 'Simple Green All-Purpose Cleaner Concentrate', 'CONC.', 'jug', '1gal:14.95', { was: 17.95 }],
    ['Clorox', 'Clorox Clean-Up Cleaner + Bleach', 'BLEACH', 'trigger', '32oz:5.95'],
    ['Clorox', 'Clorox Regular Bleach', 'BLEACH', 'jug', '121oz:8.95'],
    ['Lysol', 'Lysol Disinfectant Spray Crisp Linen', 'DISINFECT', 'aerosol', '19oz:8.95'],
    ['Pine-Sol', 'Pine-Sol Original Multi-Surface Cleaner', 'PINE', 'bottle', '48oz:7.95'],
    ['Fabuloso', 'Fabuloso Multi-Purpose Cleaner Lavender', 'LAVENDER', 'bottle', '56oz:6.50'],
    ['Mr. Clean', 'Mr. Clean Magic Eraser Original', 'ERASER', 'box', '4ct:5.95'],
    ['Krud Kutter', 'Krud Kutter Original Cleaner/Degreaser', 'DEGREASER', 'trigger', '32oz:9.95'],
    ['Zep', 'Zep Heavy-Duty Citrus Degreaser', 'CITRUS', 'jug', '1gal:21.95'],
  ],

  'brake-fluid': [
    ['Prestone', 'Prestone DOT 3 Brake Fluid', 'DOT 3', 'bottle', '12oz:6.95|32oz:14.95'],
    ['Prestone', 'Prestone DOT 4 Synthetic Brake Fluid', 'DOT 4', 'bottle', '12oz:8.95'],
    ['Valvoline', 'Valvoline DOT 3 & 4 Brake Fluid', 'DOT 3/4', 'bottle', '32oz:14.95'],
    ['Castrol', 'Castrol DOT 4 Brake Fluid', 'DOT 4', 'bottle', '12oz:9.50'],
    ['Motul', 'Motul RBF 600 DOT 4 Racing Brake Fluid', 'RBF 600', 'bottle', '500ml:24.95'],
  ],

  'bar-chain-lubricant': [
    ['Oregon', 'Oregon Bar & Chain Oil', 'B&C', 'jug', '1gal:21.95'],
    ['Husqvarna', 'Husqvarna Bar & Chain Oil', 'B&C', 'bottle', '1qt:9.95'],
    ['Echo', 'Echo Bar & Chain Oil', 'B&C', 'jug', '1gal:22.95'],
    ['Poulan Pro', 'Poulan Pro Bar & Chain Oil', 'B&C', 'bottle', '1qt:8.50'],
  ],
};
