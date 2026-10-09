/**
 * All copy for the site, taken from warrenstoneweddings.com (services,
 * process, FAQ, testimonials) and tightened for the new layout. Photos are
 * the couples' and suppliers' own, from the same site.
 */

import {u} from './lib/url';

export const brand = {
  name: 'Warren-Stone',
  full: 'Warren-Stone Weddings and Events',
  short: 'Warren-Stone Weddings',
  city: 'Cape Town',
  phone: '+27 71 568 6343',
  phoneHref: 'tel:+27715686343',
  email: 'info@warrenstoneweddings.com',
  address: '302 Gulmarn, Waterfront Marina, Cape Town',
  instagram: 'https://www.instagram.com/warrenstoneweddings/',
  facebook: 'https://www.facebook.com/warrenstoneweddings',
};

export const nav = [
  {label: 'Services', href: u('/services/')},
  {label: 'Process', href: u('/process/')},
  {label: 'Weddings', href: u('/weddings/')},
  {label: 'About', href: u('/about/')},
];

/* ------------------------------------------------------------- Home */

export const hero = {
  kicker: 'Luxury wedding planning · Cape Town',
  left: 'Say I do',
  right: 'in Cape Town',
  caption: 'Planning and coordination for couples from all over the world — in Cape Town, the Winelands and beyond.',
  cta: 'Begin the story',
  hint: 'Scroll to begin',
  metaLabel: 'Couples from',
  meta: '15 countries',
  arch: 'A bride and groom walking hand in hand away from a ceremony arch of white roses and greenery.',
};

export const details = {
  eyebrow: 'The details',
  lead: 'You enjoy the build-up. We carry the rest.',
  titleA: 'Every detail',
  titleB: 'is a promise',
  accent: 'kept beautifully.',
  body: 'From budget strategy and venue selection to décor mock-ups, menu tastings and an architect-drawn floor plan — every detail gets the same care, whether it is the centrepiece or the smallest touch.',
  cta: 'See our process',
  ctaHref: u('/process/'),
  tiles: [
    {src: u('/media/detail-setting.webp'), label: 'The setting', note: 'No. 1', alt: 'A candlelit reception hall with towering white floral arrangements.'},
    {src: u('/media/detail-toast.webp'), label: 'The toast', note: 'No. 2', alt: 'Champagne being poured into flutes at golden hour.'},
    {src: u('/media/detail-moment.webp'), label: 'The moment', note: 'No. 3', alt: 'A groom kissing his bride on the forehead.'},
    {src: u('/media/detail-table.webp'), label: 'The table', note: 'No. 4', alt: 'A long table set with tapered candles and red and blush roses.'},
  ],
};

export const manifesto = {
  eyebrow: '02 — Why Warren-Stone',
  words:
    'We plan the year so you can live the day. Every supplier, every timeline, every petal is handled — calmly, discreetly and on budget — so all that is left for you is to say yes.',
  accentWords: ['live', 'day.', 'calmly,', 'yes.'],
};

export const finale = {
  title: 'Leave it to us',
  cta: 'Begin your enquiry',
  caption: 'Complimentary 30-minute consultation · Cape Town, the Winelands & destination weddings abroad.',
  photoAlt: 'A couple sharing their first dance beneath a ceiling of hanging white flowers.',
};

export const chapters = {
  eyebrow: 'Explore',
  title: 'Four chapters',
  accent: 'of one story.',
  items: [
    {label: 'Services', note: 'Four ways to say yes', href: u('/services/'), img: u('/media/pkg-premium-m.webp')},
    {label: 'Process', note: 'Nine steps to effortless', href: u('/process/'), img: u('/media/step-decor-m.webp')},
    {label: 'Weddings', note: 'Real couples, real days', href: u('/weddings/'), img: u('/media/couple-lizzy-m.webp')},
    {label: 'About', note: 'Chelsea & the WW team', href: u('/about/'), img: u('/media/team-m.webp')},
  ],
};

/* ---------------------------------------------------------- Services */

export const servicesPage = {
  numeral: 'i',
  eyebrow: 'Services & packages',
  title: 'Four ways',
  accent: 'to say yes.',
  intro: 'Premium wedding coordination, complete planning and on-the-day coordination — plus private and corporate events, planned with exactly the same care.',
  image: u('/media/vividblue.webp'),
  imageAlt: 'A groom dipping his bride for a kiss in the aisle as their guests applaud.',
};

export const packages = [
  {
    no: '01',
    name: 'Premium',
    accent: 'coordination',
    tag: 'The three-day celebration',
    body: 'The organisation of your full three-day wedding celebration: the pre-wedding event, the wedding day itself, and the post-wedding farewell.',
    points: ['Pre-wedding event', 'Wedding day', 'Farewell celebration', 'Full supplier management'],
    img: u('/media/pkg-premium.webp'),
    alt: 'A bride standing beside a chestnut horse at a Winelands estate.',
  },
  {
    no: '02',
    name: 'Complete',
    accent: 'coordination',
    tag: 'Enjoy the build-up',
    body: 'Enjoy the excitement of preparing for your special day while the detailed planning is left to us — from budget and venue to décor, suppliers and the final programme.',
    points: ['Budget strategy', 'Venue selection', 'Design & décor', 'Final programme'],
    img: u('/media/pkg-complete.webp'),
    alt: 'Guests celebrating around a couple at a multicultural wedding.',
  },
  {
    no: '03',
    name: 'On the day',
    accent: 'coordination',
    tag: 'You plan, we deliver',
    body: 'For couples who wish to plan independently: a two-hour supplier guidance and recommendation meeting, then full management of your celebration from 14 days before the wedding date.',
    points: ['2-hour supplier meeting', 'Takeover 14 days out', 'All confirmed suppliers', 'Programme on time'],
    img: u('/media/pkg-onday.webp'),
    alt: 'A laughing bride embraced by her groom in front of white flowers.',
  },
  {
    no: '04',
    name: 'Private',
    accent: 'events',
    tag: 'Birthdays & corporate functions',
    body: 'Your birthday celebration or end-of-year function, planned in detail: all third-party service providers, budget planning and the execution of the event itself — within your budget.',
    points: ['Milestone birthdays', 'Corporate functions', 'Anniversaries', 'Bar & Bat Mitzvahs'],
    img: u('/media/pkg-private.webp'),
    alt: 'The gold winged emblem on the bonnet of a vintage car.',
  },
];

export const ceremonies = {
  eyebrow: 'Every kind of yes',
  title: 'Every ceremony,',
  accent: 'every love story.',
  body: 'Religious, civil, double weddings, single-gender, eco-friendly, military and vow renewals — and the whole celebration around them.',
  list: ['Religious', 'Civil', 'Double weddings', 'Single gender', 'Eco-friendly', 'Military', 'Vow renewals', 'Destination'],
  extrasTitle: 'More than one day',
  extras: ['Welcome dinner', 'Rehearsal', 'Wedding day', 'Post-wedding brunch', 'Gift-opening gathering', 'Farewell event'],
};

/* ----------------------------------------------------------- Process */

export const processPage = {
  numeral: 'ii',
  eyebrow: 'Our planning process',
  title: 'Nine steps',
  accent: 'to effortless.',
  intro: 'Years spent perfecting one process, so you can sit back, relax and enjoy your special day. A clear roadmap you can follow — and always know where things stand.',
  image: u('/media/decor-reveal.webp'),
  imageAlt: 'A couple at the décor reveal of their reception under a floral ceiling.',
};

export const steps = [
  {
    title: 'Budget management',
    accent: 'and allocation',
    body: 'We share industry knowledge on what each part of a wedding costs, then draft a detailed budget document recommending what to assign to each supplier — so every decision is an informed one.',
    img: u('/media/step-budget.webp'),
    alt: 'A hand signing a planning document with a fountain pen.',
  },
  {
    title: 'The perfect',
    accent: 'venue',
    body: 'Recommendations in your chosen area that suit your budget and style, site visits arranged on your behalf — in person or by video call — and a detailed comparison of your final two.',
    img: u('/media/step-venue.webp'),
    alt: 'A lakeside wine estate beneath the Cape mountains.',
  },
  {
    title: 'Concept',
    accent: 'and design',
    body: 'Layout, colour palette, textures and overall aesthetic, discussed in depth until we see what you see. Then furniture, flooring, linen, lighting and décor hire to match.',
    img: u('/media/step-concept.webp'),
    alt: 'A long reception table beneath rattan pendant lights and greenery.',
  },
  {
    title: 'Décor & florals',
    accent: 'finalised',
    body: 'A décor mock-up at your venue — in person or virtually — so you can meet your suppliers, see a table come to life, and perfect every detail before the day.',
    img: u('/media/step-decor.webp'),
    alt: 'A white and grey tablescape in a bright reception hall.',
  },
  {
    title: 'The right',
    accent: 'professionals',
    body: 'Photography, film, entertainment, styling, officiating and more, chosen from industry leaders we know well — and every one of them briefed on your vision in detail.',
    img: u('/media/step-suppliers.webp'),
    alt: 'Champagne poured at sunset.',
  },
  {
    title: 'Culinary',
    accent: 'and beverage',
    body: 'A tasting ahead of time: canapés, plated or buffet options and paired wines — with your cake designer there too, so you can sample flavours together.',
    img: u('/media/step-culinary.webp'),
    alt: 'A plated dish surrounded by red and pink flowers.',
  },
  {
    title: 'Music &',
    accent: 'entertainment',
    body: 'Live acts and DJs for the ceremony, pre-drinks and reception — and the wow-factors: photobooths, sparklers, fireworks, confetti, ice sculptures and more.',
    img: u('/media/step-music.webp'),
    alt: 'A fire performer inside a glowing sphere on a lawn at dusk.',
  },
  {
    title: 'Floor plan',
    accent: 'to scale',
    body: 'Our in-house architect drafts a to-scale floor plan of your venue: tables, dance floor, staging, bar, lighting and florals. Once approved, it guides every supplier on set-up day.',
    img: u('/media/step-floor.webp'),
    alt: 'An outdoor ceremony aisle lined with white chairs and floral arrangements.',
  },
  {
    title: 'The final',
    accent: 'programme',
    body: 'A detailed Final Programme for every supplier, your bridal party and MC: timeline, bridal and groom schedules, menus, and a full photography and film briefing.',
    img: u('/media/step-programme.webp'),
    alt: 'A groom fastening his cufflinks in a black tuxedo.',
  },
];

export const promise = {
  eyebrow: 'What stays the same',
  title: 'One point of',
  accent: 'contact.',
  items: [
    {k: 'Weekly meetings', v: 'Pre-planned agendas, clear and concise communication.'},
    {k: 'No hidden costs', v: 'A transparent quoting process and a detailed account of funds.'},
    {k: 'Everything documented', v: 'A thorough record of planning, down to the smallest detail.'},
    {k: 'Contingency plans', v: 'Flexibility to accommodate changes, even at short notice.'},
  ],
};

/* ---------------------------------------------------------- Weddings */

export const weddingsPage = {
  numeral: 'iii',
  eyebrow: 'Real weddings',
  title: 'Real couples,',
  accent: 'real days.',
  intro: 'A portfolio of extravagant and multicultural weddings for couples from all over the world — and, in their own words, what it felt like.',
  image: u('/media/hannah.webp'),
  imageAlt: 'A reception room of white roses and hydrangeas beneath draped fabric.',
};

export const gallery = [
  {src: u('/media/gallery-3'), alt: 'A bride in a long veil kissing her groom beneath a floral arch.', w: 3, h: 2},
  {src: u('/media/gallery-16'), alt: 'A couple seated beneath a white draped arch of flowers.', w: 2, h: 3},
  {src: u('/media/first-kiss'), alt: 'A groom kissing his bride on a sunlit staircase.', w: 3, h: 2},
  {src: u('/media/gallery-11'), alt: 'A bride embracing her groom in uniform among the vines.', w: 3, h: 2},
  {src: u('/media/gallery-17'), alt: 'A couple walking along a boardwalk under the trees.', w: 2, h: 3},
  {src: u('/media/tables'), alt: 'A candlelit reception with festoon lights and white florals.', w: 3, h: 2},
  {src: u('/media/gallery-13'), alt: 'A groom kissing his laughing bride beneath her veil.', w: 3, h: 2},
  {src: u('/media/gallery-5'), alt: 'A couple holding hands beside a mountain lake at dusk.', w: 3, h: 2},
  {src: u('/media/bridal-party'), alt: 'A bride laughing with her bridesmaids in blush dresses.', w: 3, h: 2},
  {src: u('/media/gallery-9'), alt: 'A couple walking from a floral ceremony arch.', w: 2, h: 3},
  {src: u('/media/gallery-14'), alt: 'A groom kissing his bride’s forehead.', w: 3, h: 2},
  {src: u('/media/gallery-4'), alt: 'Laser-cut screens framing a garden ceremony.', w: 3, h: 2},
];

export type Story = {
  couple: string;
  place: string;
  quote: string;
  story: string;
  img: string;
  alt: string;
};

export const stories: Story[] = [
  {
    couple: 'Tsungai & Tafara',
    place: 'Amsterdam',
    quote: 'I stained my dress literally five minutes before walking down the aisle, and Lynne was calm, quick, and had a fix ready.',
    story:
      'Our wedding was on the 13th of March 2025 at the beautiful Cavalli Estate. We worked with Lynne and honestly couldn’t have asked for a better coordinator. She was incredibly patient and understanding, especially with a bride planning a wedding from miles away and dealing with more stress than expected. … On the day, she was amazing at keeping things running smoothly even while we were off enjoying our sunset photos, she made sure we stayed on track without rushing us.',
    img: u('/media/couple-tsungai'),
    alt: 'Tsungai and Tafara celebrating with their guests.',
  },
  {
    couple: 'Angela & Chad',
    place: 'South Africa',
    quote: 'She understood our vision and brought it to life better than we could have imagined.',
    story:
      'From the very first meeting with Chelsea, I knew we were in great hands. She understood our vision and brought it to life better than we could have imagined. Chelsea and her team went above and beyond to make sure every single detail of our wedding was perfect, and it was truly the most magical day of our lives. … On the wedding day itself, Chelsea made sure everything ran smoothly so we could relax, be present, and soak in every moment.',
    img: u('/media/couple-angela'),
    alt: 'Angela and Chad walking through their cheering guests.',
  },
  {
    couple: 'Lizzy & Miles',
    place: 'South Africa',
    quote: 'Chelsea, Chanel, and their incredible team are truly the GOATs of “I Do.”',
    story:
      'Working with Warren-Stone Weddings and Events was nothing short of extraordinary. From the very start, what stood out was the unmatched peace of mind they provided. We felt calm, supported, and able to savour every moment, from the lead-up to the big day itself. No jitters, no exhaustion — just pure joy and the wedding of our dreams.',
    img: u('/media/couple-lizzy'),
    alt: 'Lizzy and Miles leaping beside a white paddock fence.',
  },
  {
    couple: 'Sikhulile & Craig',
    place: 'United Kingdom',
    quote: 'Being based in the UK, this made planning a destination wedding such a pleasure.',
    story:
      'From our very first meeting, the team at Warren-Stone Weddings made us feel supported, understood, and truly excited about our wedding journey. … On the big day, everything ran like clockwork. We were able to relax and fully enjoy the moment, knowing Chelsea and her team had everything under control. … She makes me want to get married all over again!',
    img: u('/media/couple-sikhulile'),
    alt: 'Sikhulile and Craig embracing beside a vintage car.',
  },
  {
    couple: 'Lindsay & Luuk',
    place: 'Netherlands',
    quote: 'Everything was perfect down to the smallest of detail.',
    story:
      'Living overseas but planning a wedding in Cape Town can be a daunting, overwhelming task, however we were put at ease from the start and really enjoyed the process thanks to Chelsea, Chanel, and the rest of the team. … From the start of the planning process, we were constantly kept informed in a highly organised way of the progress with the vendors and what was to be done on our side.',
    img: u('/media/couple-lindsay'),
    alt: 'Lindsay and Luuk smiling among wildflowers.',
  },
  {
    couple: 'Lauren & Elliot',
    place: 'United Kingdom',
    quote: 'The coordination on the day was flawless, everything ran like clockwork without a single hiccup.',
    story:
      'As an overseas bride planning a destination wedding, I was initially daunted by the distance and logistics, but working with Lyneé at Warren-Stone Weddings completely eased those concerns from day one. … Every detail of our wedding was handled with care, creativity, and precision. The coordination on the day was flawless, everything ran like clockwork without a single hiccup, and I was able to fully relax and enjoy every moment.',
    img: u('/media/couple-lauren'),
    alt: 'Lauren and Elliot in golden evening light.',
  },
  {
    couple: 'Vanessa & Gary',
    place: 'South Africa',
    quote: 'Gary and I were able to truly enjoy every moment without worrying about a single detail.',
    story:
      'We are so incredibly grateful to have had Chelsea as our wedding planner. From start to finish, she made the entire process feel effortless. … Whenever we felt unsure or indecisive, she provided thoughtful advice that helped guide us in the right direction. … She handled everything with grace, professionalism, and a genuine kindness.',
    img: u('/media/couple-vanessa'),
    alt: 'Vanessa and Gary beneath giant paper flowers.',
  },
  {
    couple: 'Danielle & Charl',
    place: 'South Africa',
    quote: '…she took all of my existing planning and created a precise, down-to-the-minute timeline that made everything feel so much more manageable and completely under control.',
    story:
      'We had the absolute pleasure of working with Warren-Stone Weddings for our big day, and we couldn’t be more grateful—especially for our incredible coordinator, Lynné. From the very beginning, she brought such a calm, confident presence and an incredible attention to detail to the planning process. … What stood out most was her attention to detail and the thoughtful suggestions she offered—things I hadn’t even considered but made a big difference on the day.',
    img: u('/media/couple-danielle'),
    alt: 'Danielle and Charl running across a lawn below the mountains.',
  },
];

export const couples = [
  ['Tsungai & Tafara', 'Amsterdam'], ['Angela & Chad', 'South Africa'], ['Danielle & Charl', 'South Africa'], ['Lizzy & Miles', 'South Africa'],
  ['Sikhulile & Craig', 'United Kingdom'], ['Lindsay & Luuk', 'Netherlands'], ['Vanessa & Gary', 'South Africa'], ['Lauren & Elliot', 'United Kingdom'],
  ['Lauren & Herman', 'South Africa'], ['Nicolene & Wian', 'South Africa'], ['Anastasiya & Damian', 'United Kingdom'], ['Brogan & Roberto', 'Dublin'],
  ['Thana & Charles', 'South Africa'], ['Zane & Hanro', 'South Africa'], ['Alexandra & Garth', 'United Kingdom'], ['Caralie & Josh', 'South Africa'],
  ['Mbali & Michael', 'United Kingdom'], ['Bronwyn & Jack', 'Shanghai'], ['Jemma & Michelle', 'Zimbabwe'], ['Brittany & Grant', 'Amsterdam'],
  ['Gloria & Lucas', 'Germany'], ['Dario & Junior', 'Congo'], ['Kim & Denzyl', 'South Africa'], ['Johane & Rory', 'South Africa'],
  ['Megan & Joey', 'Zimbabwe'], ['Sisanda & Colin', 'South Africa'], ['Ingrid & Bertus', 'USA'], ['Dore & Emile', 'South Africa'],
  ['Lyne & James', 'Dubai'], ['Mia & Marco', 'South Africa'], ['Nadine & Hillel', 'Israel'], ['Nikita & Johnathan', 'South Africa'],
  ['Eden & Mark', 'South Africa'], ['Frances & Scott', 'Hong Kong'], ['Sharon & Kundai', 'Australia'], ['Maxine & Jarrett', 'Kuwait'],
  ['Brittain & Wesley', 'USA'], ['Mante & Andrew', 'New Zealand'], ['Hilda & Reinhardt', 'Dubai'], ['Jeannie & Kieran', 'New Zealand'],
];

/* ------------------------------------------------------------- About */

export const aboutPage = {
  numeral: 'iv',
  eyebrow: 'Who we are',
  title: 'Chelsea',
  accent: '& the WW team.',
  intro: 'A South African planning company trusted by discerning local and international couples — more than a decade of calm, systematic, beautifully detailed celebrations.',
  image: u('/media/team.webp'),
  imageAlt: 'The Warren-Stone Weddings team, dressed in black, seated together in a bright studio.',
};

export const founder = {
  eyebrow: 'Founder',
  name: 'Chelsea Warren-Stone',
  quote: 'Sincere, calm, and seemingly effortless.',
  body: [
    'Chelsea Warren-Stone is the founder and the driving force behind Warren-Stone Weddings and Events — a creative planner who personally designs opulent celebrations together with her senior coordinators.',
    'She is known for realising a couple’s vision holistically, with a principled, systematic and detailed way of communicating that clients rely on. With extensive knowledge of Cape Town and its exquisite venues, Chelsea has been a well-respected wedding planner for more than a decade.',
  ],
  img: u('/media/chelsea.webp'),
  alt: 'Chelsea Warren-Stone seated in front of a painted landscape.',
};

export const team = {
  eyebrow: 'The WW team',
  title: 'A team that',
  accent: 'thrives on detail.',
  body: 'We plan every detail and execute in a structured, thorough way — honouring personal requests while keeping strict financial control, so expenses never exceed your budget. Our service is built on trust: caring, amiable and discreet. We know the Cape intimately — its natural beauty, venues and accommodation — and extend our services across Southern Africa and abroad.',
};

export const pillars = [
  {
    title: 'Proficient & accomplished',
    points: ['Respected industry leaders', 'Trustworthy reputation', 'More than 10 years’ experience', 'Numerous 5-star testimonials'],
  },
  {
    title: 'All-inclusive service',
    points: ['Holistic planning', 'Budget strategy', 'Service provider liaison', 'Architectural floor plans'],
  },
  {
    title: 'A stress-free experience',
    points: ['An assigned point of contact', 'Continuous communication', 'Comprehensive documentation', 'Extensive logistical planning'],
  },
  {
    title: 'A personal touch',
    points: ['Weekly meetings', 'Pre-planned agendas', 'Genuine enthusiasm', 'All small details documented'],
  },
  {
    title: 'Open & honest',
    points: ['Transparent quoting', 'No hidden costs', 'Discretion with budgets', 'Detailed account of funds'],
  },
  {
    title: 'On your wedding day',
    points: ['Foreseeing bridal needs', 'Full-day management', 'Supplier supervision', 'Managing the unforeseen'],
  },
];

export const faqs = [
  {
    q: 'How do consultation meetings work?',
    a: 'We would love to get to know you as a couple. Through a complimentary 30-minute phone or video call, we hear what you have in mind for your day, discuss the coordination process and answer any questions you may have.',
  },
  {
    q: 'Do you coordinate destination weddings?',
    a: 'Yes. Through email, phone and online meetings, distance will not hinder the planning process. Where needed, travel and accommodation for the coordinator and assistant are simply included within the wedding budget.',
  },
  {
    q: 'Do you work with internationally based couples marrying in South Africa?',
    a: 'Absolutely — it is a speciality. With regular email, calls and virtual meetings, we source trusted suppliers, manage the logistics and coordinate your day, so planning feels seamless wherever you live.',
  },
  {
    q: 'Can we bring in a supplier we already love?',
    a: 'Most certainly. We work with a vetted network across every category, from entry-level to luxury. To protect the standard of service we include a maximum of three external vendors per wedding.',
  },
  {
    q: 'What other events do you plan?',
    a: 'Welcome dinners, rehearsals, post-wedding brunches, gift openings and farewells — plus corporate events, anniversaries, milestone birthdays and Bar and Bat Mitzvahs, with the same care and precision.',
  },
  {
    q: 'Do you coordinate events on public holidays?',
    a: 'Yes, with the same level of service. Public holiday dates are very popular, so we recommend booking early to secure your preferred date.',
  },
  {
    q: 'What is the first step to securing our date?',
    a: 'Complete the enquiry form with the date you hope to marry and your estimated guest count. After your initial consultation, your quote and contract are finalised for your approval.',
  },
];

/* ----------------------------------------------------------- Contact */

export const contactPage = {
  eyebrow: 'Enquire',
  title: 'Let’s begin',
  accent: 'your story.',
  intro: 'We turn wedding dreams into memorable realities. Tell us a little about your day and we will be in touch to arrange a complimentary 30-minute consultation.',
  countries: [
    'South Africa', 'United Kingdom', 'Ireland', 'Netherlands', 'Germany', 'Belgium', 'France', 'Switzerland', 'Italy', 'Spain', 'Portugal',
    'United States', 'Canada', 'United Arab Emirates', 'Australia', 'New Zealand', 'Namibia', 'Botswana', 'Zimbabwe', 'Mauritius', 'Other',
  ],
  heard: ['Google search', 'Social media', 'Venue or supplier recommendation', 'Referral (friend, family or past couple)'],
};

/* ------------------------------------------------------------ Shared */

export const cta = {
  title: 'Your day,',
  accent: 'beautifully kept.',
  body: 'Book a complimentary 30-minute consultation and tell us what you have in mind.',
  button: 'Begin your enquiry',
};

export const footer = {
  marquee: 'Say I do · Leave the rest to us · ',
  quote: '“We turn wedding dreams into memorable realities.”',
  note: `© ${new Date().getFullYear()} Warren-Stone Weddings and Events · Luxury wedding planning & coordination in Cape Town, South Africa.`,
};
