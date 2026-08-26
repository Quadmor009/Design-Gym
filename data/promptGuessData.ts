export interface PromptGuessQuestion {
  id: string
  image: string
  optionA: string
  optionB: string
  correctOption: "A"
  explanation: string
}

export const promptGuessQuestions: PromptGuessQuestion[] = [
  {
    id: "prompt-guess-q1",
    image: "/prompt-guess-q1.png",
    optionA:
      "A red vintage bicycle leaning against a sunlit brick wall, photorealistic, 35mm, shallow depth of field, warm afternoon light",
    optionB:
      "A red vintage bicycle leaning against a brick wall",
    correctOption: "A",
    explanation: "Missing style modifier",
  },
  {
    id: "prompt-guess-q2",
    image: "/prompt-guess-q2.png",
    optionA:
      "Overhead shot of a ceramic breakfast bowl, sliced figs and honey, marble table, soft window light from the left, editorial food photography",
    optionB:
      "A ceramic breakfast bowl with sliced figs and honey on a marble table, editorial food photography",
    correctOption: "A",
    explanation: "Missing composition detail",
  },
  {
    id: "prompt-guess-q3",
    image: "/prompt-guess-q3.png",
    optionA:
      "A lone cabin on a snowy ridge at blue hour, long exposure, cool moonlight, cinematic still from a Nordic film",
    optionB:
      "A lone cabin on a snowy ridge at golden hour, long exposure, warm sunlight, cinematic still from a Nordic film",
    correctOption: "A",
    explanation: "Wrong lighting",
  },
  {
    id: "prompt-guess-q4",
    image: "/prompt-guess-q4.png",
    optionA:
      "Portrait of a jazz pianist, shot on 85mm f/1.4, creamy bokeh, stage spotlight, film grain",
    optionB:
      "Portrait of a jazz pianist, ultra wide 16mm, everything in focus, stage spotlight, film grain",
    correctOption: "A",
    explanation: "Wrong camera and lens",
  },
  {
    id: "prompt-guess-q5",
    image: "/prompt-guess-q5.png",
    optionA:
      "A tabby cat asleep inside a cardboard box, one paw hanging over the edge, cluttered home office, natural light",
    optionB:
      "A cat asleep inside a cardboard box, cluttered home office, natural light",
    correctOption: "A",
    explanation: "Missing subject detail",
  },
  {
    id: "prompt-guess-q6",
    image: "/prompt-guess-q6.png",
    optionA:
      "A vintage typewriter on a wooden desk, cinematic lighting, dust particles in the air, warm sepia tones, film photography aesthetic",
    optionB:
      "A vintage typewriter on a wooden desk",
    correctOption: "A",
    explanation: "Missing style modifier",
  },
  {
    id: "prompt-guess-q7",
    image: "/prompt-guess-q7.png",
    optionA:
      "A still alpine lake reflecting snow-capped peaks at sunrise, soft pink and orange light, mist rising off the water",
    optionB:
      "A still alpine lake reflecting snow-capped peaks at midday, harsh overhead sun, no mist",
    correctOption: "A",
    explanation: "Wrong lighting",
  },
  {
    id: "prompt-guess-q8",
    image: "/prompt-guess-q8.png",
    optionA:
      "Close-up of a flaky croissant on a linen napkin, crumbs scattered around, shot from a 45-degree angle, shallow depth of field",
    optionB:
      "A flaky croissant on a linen napkin, shallow depth of field",
    correctOption: "A",
    explanation: "Missing composition detail",
  },
  {
    id: "prompt-guess-q9",
    image: "/prompt-guess-q9.png",
    optionA:
      "Portrait of an astronaut in a reflective helmet, shot on 50mm f/1.8, sharp focus on the visor reflection, studio lighting",
    optionB:
      "Portrait of an astronaut in a reflective helmet, shot on a fisheye lens, distorted wide view, studio lighting",
    correctOption: "A",
    explanation: "Wrong camera and lens",
  },
  {
    id: "prompt-guess-q10",
    image: "/prompt-guess-q10.png",
    optionA:
      "A lone figure in a yellow raincoat crossing a rain-soaked city street at night, neon signs reflected in puddles",
    optionB:
      "A person crossing a rain-soaked city street at night, neon signs reflected in puddles",
    correctOption: "A",
    explanation: "Missing subject detail",
  },
  {
    id: "prompt-guess-q11",
    image: "/prompt-guess-q11.png",
    optionA:
      "A skateboarder mid-air off a concrete ramp, motion blur on the wheels, dust kicked up, dramatic low-angle shot",
    optionB:
      "A skateboarder mid-air off a concrete ramp, dramatic low-angle shot",
    correctOption: "A",
    explanation: "Missing motion detail",
  },
  {
    id: "prompt-guess-q12",
    image: "/prompt-guess-q12.png",
    optionA:
      "A glass perfume bottle on black marble, gold accents, warm amber liquid, dramatic side lighting, luxury product photography",
    optionB:
      "A glass perfume bottle on black marble, blue accents, cool teal liquid, dramatic side lighting, luxury product photography",
    correctOption: "A",
    explanation: "Wrong color palette",
  },
  {
    id: "prompt-guess-q13",
    image: "/prompt-guess-q13.png",
    optionA:
      "A narrow dirt path through a forest in full autumn color, red and orange leaves covering the ground, soft diffused light",
    optionB:
      "A narrow dirt path through a forest in early spring, fresh green leaves budding, soft diffused light",
    correctOption: "A",
    explanation: "Wrong season",
  },
  {
    id: "prompt-guess-q14",
    image: "/prompt-guess-q14.png",
    optionA:
      "A small household robot, brushed aluminum shell, matte rubber joints, soft studio lighting, product render",
    optionB:
      "A small household robot, soft studio lighting, product render",
    correctOption: "A",
    explanation: "Missing material detail",
  },
  {
    id: "prompt-guess-q15",
    image: "/prompt-guess-q15.png",
    optionA:
      "Sand dunes stretching to the horizon at dusk, wide-angle shot, everything in sharp focus from foreground to horizon",
    optionB:
      "Sand dunes stretching to the horizon at dusk, telephoto shot, extremely shallow depth of field, background dune blurred",
    correctOption: "A",
    explanation: "Wrong depth of field",
  },
  {
    id: "prompt-guess-q16",
    image: "/prompt-guess-q16.png",
    optionA:
      "A minimalist living room with a large window overlooking a rainy city skyline, raindrops visible on the glass, moody gray light",
    optionB:
      "A minimalist living room with a large window, moody gray light",
    correctOption: "A",
    explanation: "Missing environmental detail",
  },
  {
    id: "prompt-guess-q17",
    image: "/prompt-guess-q17.png",
    optionA:
      "A barn owl perched on a fence post at dusk, deep blue twilight sky, soft rim light on its feathers",
    optionB:
      "A barn owl perched on a fence post at midday, bright blue sky, harsh direct sunlight",
    correctOption: "A",
    explanation: "Wrong time of day",
  },
  {
    id: "prompt-guess-q18",
    image: "/prompt-guess-q18.png",
    optionA:
      "A model wearing a chunky cable-knit wool sweater, close-up on the texture, natural window light, editorial fashion photography",
    optionB:
      "A model wearing a sweater, natural window light, editorial fashion photography",
    correctOption: "A",
    explanation: "Missing texture detail",
  },
  {
    id: "prompt-guess-q20",
    image: "/prompt-guess-q20.png",
    optionA:
      "A towering glass skyscraper photographed from street level, a single pedestrian crossing in the foreground for scale, dramatic upward perspective",
    optionB:
      "A towering glass skyscraper photographed from street level, dramatic upward perspective",
    correctOption: "A",
    explanation: "Missing scale reference",
  },
]
