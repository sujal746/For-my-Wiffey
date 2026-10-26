export const BOOT_LINES = [
  'Initializing a tiny universe...',
  'Scanning the stars...',
  'Searching for someone special...',
  'Searching...',
  'Person found: MY DOLL 🎀',
  'Identity confirmed.',
  'Preparing something made just for her...',
  'Welcome home, Doll.',
]

export const LOVE_LETTER = `Hey, my Doll,

I don't think you realize how much happiness you bring into my life.

Sometimes, it's the smallest things about you that make my entire day better. Your little habits, your voice, the way you call me Kulfi, and all those tiny moments that probably seem ordinary to you.

But to me, they're special.

I might not always find the perfect words to explain how I feel, but I hope I can keep showing you that you're someone I want to choose, appreciate, and care for.

You aren't just someone I love.

You're my Doll, my Sweetu, my Wiffey, my Jaan, and my favourite little universe.

And if you ever forget how special you are, come back here. I'll remind you.

Forever your Kulfi. ❤️`

export const SECRET_LETTER = `My Doll,

Do you know what's funny?

Sometimes I think about that morning at school, when you forgot your mask and asked me to come with you.

For you, maybe it was just a small thing.

But when you held my hand and started walking, my brain genuinely stopped working.

I was just following you, pretending everything was normal, while my heart was doing something completely different.

And the only thing I could think was, 'What is this T_T'

If someone had told me back then that this little moment would become such a special memory, I probably wouldn't have known what to say.

But here I am, making an entire universe for the girl who once made an ordinary school morning feel like a movie.

My Doll.

My Sweetu.

My Wiffey.

My Cutie.

My Jaan.

My Baby Gurl.

My World.

And the girl who calls me Kulfi.

I don't need our story to be perfect to love it.

I just want more little moments with you. More silly conversations. More memories we can look back on and smile about. More reasons to call you Doll.

And if life ever gets difficult, I hope we remember that love isn't only about grand gestures.

Sometimes, it's about holding someone's hand on an ordinary morning.

Sometimes, it's about remembering the little things.

And sometimes, it's about choosing the same person, again and again, even when nobody is watching.

I'm really happy that my story includes you.

With all my love,

Your Kulfi. ❤️`

export type MemoryStep = { text: string; big?: boolean; pause?: number; phase: 'classroom' | 'ask' | 'walk' | 'slowmo' | 'heart' | 'after' }

export const MEMORY_STEPS: MemoryStep[] = [
  { text: 'That morning, we reached school really early.', phase: 'classroom' },
  { text: 'The classroom was almost empty.', phase: 'classroom' },
  { text: 'You had forgotten to bring your mask.', phase: 'classroom' },
  { text: 'Then you asked me...', phase: 'ask' },
  { text: '“Mask lene chaloge?”', big: true, phase: 'ask', pause: 2600 },
  { text: 'I said yes.', phase: 'walk' },
  { text: 'And then...', phase: 'walk', pause: 2200 },
  { text: 'You held my hand and started taking me along with you.', phase: 'walk' },
  { text: 'And suddenly, the most ordinary school morning started feeling like a scene from a movie.', phase: 'slowmo' },
  { text: 'My heartbeat went crazy.', phase: 'slowmo' },
  { text: 'Everything felt like it was moving in slow motion.', phase: 'slowmo' },
  { text: 'And inside my head, there was only one thought...', phase: 'slowmo', pause: 2400 },
  { text: '“WHAT IS THIS T_T”', big: true, phase: 'heart', pause: 3000 },
  { text: "We weren't even that close as friends back then.", phase: 'after' },
  { text: 'But somehow, that tiny moment stayed with me.', phase: 'after' },
  { text: 'Maybe you thought we were just going to get a mask.', phase: 'after' },
  { text: 'But for me, Doll...', phase: 'after' },
  { text: 'That was one of those little moments that made my heart act differently.', phase: 'after' },
  { text: "I don't know if you remember that morning the same way I do.", phase: 'after' },
  { text: 'But I remember it.', phase: 'after' },
  { text: "And I'm really glad it happened.", phase: 'after' },
  { text: 'Because that little memory became a part of our story. ❤️', phase: 'after' },
]

export const COMPANION_IDLE_LINES = [
  "Doll, you're literally the main character here.",
  'Your Kulfi made this place, but you made it special.',
  "Psst... you're his favourite person. Don't tell the stars.",
  'Wiffey detected. Happiness levels increased.',
  'Sweetu deserves a little extra love today.',
  'Somewhere, Kulfi is smiling just thinking about you.',
  'Reminder: you are very, very loved. That is all.',
]
