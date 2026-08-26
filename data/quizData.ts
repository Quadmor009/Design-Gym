export interface Question {
  id: string
  difficulty: "beginner" | "mid" | "expert"
  type: "image" | "typeface" | "prompt"
  prompt: string
  optionA: string
  optionB: string
  correctOption: "A"
  explanation: string
  /** Used by prompt-training questions: the generated image to match. */
  image?: string
  /** False until A/B PNGs exist in /public. Omitted or true means the question can be served. */
  ready?: boolean
}

export const foxQuote = "The quick brown fox jumps over the lazy dog."

export const questions: Question[] = [
  // BEGINNER LEVEL - IMAGE QUESTIONS (30 total)
  {
    id: "layout-beg-q1",
    difficulty: "beginner",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/layout-beg-q1-a.png",
    optionB: "/layout-beg-q1-b.png",
    correctOption: "A",
    explanation: "Layout"
  },
  {
    id: "contrast-beg-q2",
    difficulty: "beginner",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/contrast-beg-q2-a.png",
    optionB: "/contrast-beg-q2-b.png",
    correctOption: "A",
    explanation: "Contrast"
  },
  {
    id: "contrast-beg-q3",
    difficulty: "beginner",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/contrast-beg-q3-a.png",
    optionB: "/contrast-beg-q3-b.png",
    correctOption: "A",
    explanation: "Contrast"
  },
  {
    id: "color-beg-q4",
    difficulty: "beginner",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/color-beg-q4-a.png",
    optionB: "/color-beg-q4-b.png",
    correctOption: "A",
    explanation: "Color"
  },
  {
    id: "hierarchy-beg-q5",
    difficulty: "beginner",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/hierarchy-beg-q5-a.png",
    optionB: "/hierarchy-beg-q5-b.png",
    correctOption: "A",
    explanation: "Visual hierarchy"
  },
  {
    id: "color-beg-q6",
    difficulty: "beginner",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/color-beg-q6-a.png",
    optionB: "/color-beg-q6-b.png",
    correctOption: "A",
    explanation: "Color"
  },
  {
    id: "color-beg-q7",
    difficulty: "beginner",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/color-beg-q7-a.png",
    optionB: "/color-beg-q7-b.png",
    correctOption: "A",
    explanation: "Color"
  },
  {
    id: "contrast-beg-q8",
    difficulty: "beginner",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/contrast-beg-q8-a.png",
    optionB: "/contrast-beg-q8-b.png",
    correctOption: "A",
    explanation: "Contrast"
  },
  {
    id: "width thickness-beg-q9",
    difficulty: "beginner",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/width-thickness-beg-q9-a.png",
    optionB: "/width-thickness-beg-q9-b.png",
    correctOption: "A",
    explanation: "Line weight"
  },
  {
    id: "visual hierarchy-beg-q10",
    difficulty: "beginner",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/visual-hierarchy-beg-q10-a.png",
    optionB: "/visual-hierarchy-beg-q10-b.png",
    correctOption: "A",
    explanation: "Visual hierarchy"
  },
  {
    id: "alignment-beg-q11",
    difficulty: "beginner",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/alignment-beg-q11-a.png",
    optionB: "/alignment-beg-q11-b.png",
    correctOption: "A",
    explanation: "Alignment"
  },
  {
    id: "spacing-beg-q12",
    difficulty: "beginner",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/spacing-beg-q12-a.png",
    optionB: "/spacing-beg-q12-b.png",
    correctOption: "A",
    explanation: "Spacing"
  },
  {
    id: "spacing-beg-q13",
    difficulty: "beginner",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/spacing-beg-q13-a.png",
    optionB: "/spacing-beg-q13-b.png",
    correctOption: "A",
    explanation: "Spacing"
  },
  {
    id: "copy-beg-q14",
    difficulty: "beginner",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/copy-beg-q14-a.png",
    optionB: "/copy-beg-q14-b.png",
    correctOption: "A",
    explanation: "Copy"
  },
  {
    id: "contrast-beg-q15",
    difficulty: "beginner",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/contrast-beg-q15-a.png",
    optionB: "/contrast-beg-q15-b.png",
    correctOption: "A",
    explanation: "Contrast"
  },

  // BEGINNER LEVEL - BRAND FIT IMAGE QUESTIONS (3)
  {
    id: "brandfit-beg-q16",
    difficulty: "beginner",
    type: "image",
    prompt: "Stillness, distilled. A quiet retreat for the overworked mind.",
    optionA: "/brandfit-beg-q16-a.png",
    optionB: "/brandfit-beg-q16-b.png",
    correctOption: "A",
    explanation: "Brand fit"
  },
  {
    id: "brandfit-beg-q17",
    difficulty: "beginner",
    type: "image",
    prompt: "Chaos, but make it delicious. Snacks that refuse to sit still.",
    optionA: "/brandfit-beg-q17-a.png",
    optionB: "/brandfit-beg-q17-b.png",
    correctOption: "A",
    explanation: "Brand fit"
  },
  {
    id: "brandfit-beg-q18",
    difficulty: "beginner",
    type: "image",
    prompt: "Built for the 4am trade. No noise. No fluff. Just the number.",
    optionA: "/brandfit-beg-q18-a.png",
    optionB: "/brandfit-beg-q18-b.png",
    correctOption: "A",
    explanation: "Brand fit"
  },

  // BEGINNER LEVEL - NEW CATEGORY IMAGE QUESTIONS (12; beginner image pool is 30 total)
  {
    id: "font-pairing-beg-q41",
    difficulty: "beginner",
    type: "image",
    ready: true,
    prompt: "Which of these images is most correct?",
    optionA: "/font-pairing-beg-q41-a.png",
    optionB: "/font-pairing-beg-q41-b.png",
    correctOption: "A",
    explanation: "Font pairing"
  },
  {
    id: "font-pairing-beg-q42",
    difficulty: "beginner",
    type: "image",
    ready: true,
    prompt: "Which of these images is most correct?",
    optionA: "/font-pairing-beg-q42-a.png",
    optionB: "/font-pairing-beg-q42-b.png",
    correctOption: "A",
    explanation: "Font pairing"
  },
  {
    id: "letter-spacing-beg-q43",
    difficulty: "beginner",
    type: "image",
    ready: true,
    prompt: "Which of these images is most correct?",
    optionA: "/letter-spacing-beg-q43-a.png",
    optionB: "/letter-spacing-beg-q43-b.png",
    correctOption: "A",
    explanation: "Letter spacing"
  },
  {
    id: "letter-spacing-beg-q44",
    difficulty: "beginner",
    type: "image",
    ready: true,
    prompt: "Which of these images is most correct?",
    optionA: "/letter-spacing-beg-q44-a.png",
    optionB: "/letter-spacing-beg-q44-b.png",
    correctOption: "A",
    explanation: "Letter spacing"
  },
  {
    id: "font-weight-beg-q45",
    difficulty: "beginner",
    type: "image",
    ready: true,
    prompt: "Which of these images is most correct?",
    optionA: "/font-weight-beg-q45-a.png",
    optionB: "/font-weight-beg-q45-b.png",
    correctOption: "A",
    explanation: "Font weight"
  },
  {
    id: "font-weight-beg-q46",
    difficulty: "beginner",
    type: "image",
    ready: true,
    prompt: "Which of these images is most correct?",
    optionA: "/font-weight-beg-q46-a.png",
    optionB: "/font-weight-beg-q46-b.png",
    correctOption: "A",
    explanation: "Font weight"
  },
  {
    id: "color-contrast-beg-q47",
    difficulty: "beginner",
    type: "image",
    ready: true,
    prompt: "Which of these images is most correct?",
    optionA: "/color-contrast-beg-q47-a.png",
    optionB: "/color-contrast-beg-q47-b.png",
    correctOption: "A",
    explanation: "Color contrast"
  },
  {
    id: "color-contrast-beg-q48",
    difficulty: "beginner",
    type: "image",
    ready: true,
    prompt: "Which of these images is most correct?",
    optionA: "/color-contrast-beg-q48-a.png",
    optionB: "/color-contrast-beg-q48-b.png",
    correctOption: "A",
    explanation: "Color contrast"
  },
  {
    id: "icon-consistency-beg-q49",
    difficulty: "beginner",
    type: "image",
    ready: true,
    prompt: "Which of these images is most correct?",
    optionA: "/icon-consistency-beg-q49-a.png",
    optionB: "/icon-consistency-beg-q49-b.png",
    correctOption: "A",
    explanation: "Icon consistency"
  },
  {
    id: "icon-consistency-beg-q50",
    difficulty: "beginner",
    type: "image",
    ready: true,
    prompt: "Which of these images is most correct?",
    optionA: "/icon-consistency-beg-q50-a.png",
    optionB: "/icon-consistency-beg-q50-b.png",
    correctOption: "A",
    explanation: "Icon consistency"
  },
  {
    id: "button-states-beg-q51",
    difficulty: "beginner",
    type: "image",
    ready: true,
    prompt: "Which of these images is most correct?",
    optionA: "/button-states-beg-q51-a.png",
    optionB: "/button-states-beg-q51-b.png",
    correctOption: "A",
    explanation: "Button states"
  },
  {
    id: "button-states-beg-q52",
    difficulty: "beginner",
    type: "image",
    ready: true,
    prompt: "Which of these images is most correct?",
    optionA: "/button-states-beg-q52-a.png",
    optionB: "/button-states-beg-q52-b.png",
    correctOption: "A",
    explanation: "Button states"
  },

  // BEGINNER LEVEL - TYPEFACE QUESTIONS (5 total)
  // Focus: Font family recognition and right font for right use case
  {
    id: "typeface-beg-q1",
    difficulty: "beginner",
    type: "typeface",
    prompt: "Which typeface belongs to the serif family?",
    optionA: "'Times New Roman', serif",
    optionB: "'Arial', sans-serif",
    correctOption: "A",
    explanation: "Serif vs sans-serif"
  },
  {
    id: "typeface-beg-q2",
    difficulty: "beginner",
    type: "typeface",
    prompt: "Which typeface works better for a formal business document?",
    optionA: "'Times New Roman', serif",
    optionB: "'Comic Sans MS', sans-serif",
    correctOption: "A",
    explanation: "Typeface choice"
  },
  {
    id: "typeface-beg-q3",
    difficulty: "beginner",
    type: "typeface",
    prompt: "Which typeface is a sans-serif font?",
    optionA: "'Helvetica', sans-serif",
    optionB: "'Garamond', serif",
    correctOption: "A",
    explanation: "Serif vs sans-serif"
  },
  {
    id: "typeface-beg-q4",
    difficulty: "beginner",
    type: "typeface",
    prompt: "Which typeface is more appropriate for a children's book?",
    optionA: "'Comic Sans MS', sans-serif",
    optionB: "'Times New Roman', serif",
    correctOption: "A",
    explanation: "Typeface choice"
  },
  {
    id: "typeface-beg-q5",
    difficulty: "beginner",
    type: "typeface",
    prompt: "Which typeface is better for a wedding invitation?",
    optionA: "'Garamond', serif",
    optionB: "'Arial', sans-serif",
    correctOption: "A",
    explanation: "Typeface choice"
  },

  // MID LEVEL - IMAGE QUESTIONS (12 total)
  {
    id: "typo-med-q16",
    difficulty: "mid",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/typo-med-q16-a.png",
    optionB: "/typo-med-q16-b.png",
    correctOption: "A",
    explanation: "Typography"
  },
  {
    id: "spacing-med-q17",
    difficulty: "mid",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/spacing-med-q17-a.png",
    optionB: "/spacing-med-q17-b.png",
    correctOption: "A",
    explanation: "Spacing"
  },
  {
    id: "curve radius consistency-med-q18",
    difficulty: "mid",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/curve-radius-consistency-med-q18-a.png",
    optionB: "/curve-radius-consistency-med-q18-b.png",
    correctOption: "A",
    explanation: "Corner radius"
  },
  {
    id: "selection type-med-q19",
    difficulty: "mid",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/selection-type-med-q19-a.png",
    optionB: "/selection-type-med-q19-b.png",
    correctOption: "A",
    explanation: "Selection state"
  },
  {
    id: "size-med-q20",
    difficulty: "mid",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/size-med-q20-a.png",
    optionB: "/size-med-q20-b.png",
    correctOption: "A",
    explanation: "Size"
  },
  {
    id: "spacing-med-q21",
    difficulty: "mid",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/spacing-med-q21-a.png",
    optionB: "/spacing-med-q21-b.png",
    correctOption: "A",
    explanation: "Spacing"
  },
  {
    id: "contrast-med-q22",
    difficulty: "mid",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/contrast-med-q22-a.png",
    optionB: "/contrast-med-q22-b.png",
    correctOption: "A",
    explanation: "Contrast"
  },
  {
    id: "spacing-med-q23",
    difficulty: "mid",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/spacing-med-q23-a.png",
    optionB: "/spacing-med-q23-b.png",
    correctOption: "A",
    explanation: "Spacing"
  },
  {
    id: "visual balance-med-q24",
    difficulty: "mid",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/visual-balance-med-q24-a.png",
    optionB: "/visual-balance-med-q24-b.png",
    correctOption: "A",
    explanation: "Visual balance"
  },
  {
    id: "contrast-med-q25",
    difficulty: "mid",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/contrast-med-q25-a.png",
    optionB: "/contrast-med-q25-b.png",
    correctOption: "A",
    explanation: "Contrast"
  },
  {
    id: "alignment-med-q26",
    difficulty: "mid",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/alignment-med-q26-a.png",
    optionB: "/alignment-med-q26-b.png",
    correctOption: "A",
    explanation: "Alignment"
  },
  {
    id: "alignment-med-q27",
    difficulty: "mid",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/alignment-med-q27-a.png",
    optionB: "/alignment-med-q27-b.png",
    correctOption: "A",
    explanation: "Alignment"
  },

  // MID LEVEL - TYPEFACE QUESTIONS (8 total)
  // Mix: Right font for right use case, readability, contrast, and identify fonts
  {
    id: "typeface-med-q1",
    difficulty: "mid",
    type: "typeface",
    prompt: "Which typeface has better readability for extended reading?",
    optionA: "'Merriweather', serif",
    optionB: "'Courier New', monospace",
    correctOption: "A",
    explanation: "Readability"
  },
  {
    id: "typeface-med-q2",
    difficulty: "mid",
    type: "typeface",
    prompt: "Which typeface provides better contrast for accessibility?",
    optionA: "'Open Sans', sans-serif",
    optionB: "'Papyrus', fantasy",
    correctOption: "A",
    explanation: "Contrast"
  },
  {
    id: "typeface-med-q3",
    difficulty: "mid",
    type: "typeface",
    prompt: "Which typeface is Poppins?",
    optionA: "'Poppins', sans-serif",
    optionB: "'Roboto', sans-serif",
    correctOption: "A",
    explanation: "Font identification"
  },
  {
    id: "typeface-med-q4",
    difficulty: "mid",
    type: "typeface",
    prompt: "Which typeface offers better readability in small sizes?",
    optionA: "'Source Sans Pro', sans-serif",
    optionB: "'Bodoni', serif",
    correctOption: "A",
    explanation: "Readability"
  },
  {
    id: "typeface-med-q5",
    difficulty: "mid",
    type: "typeface",
    prompt: "Which typeface has better contrast for UI elements?",
    optionA: "'Inter', sans-serif",
    optionB: "'Brush Script', cursive",
    correctOption: "A",
    explanation: "Typeface choice"
  },
  {
    id: "typeface-med-q6",
    difficulty: "mid",
    type: "typeface",
    prompt: "Which typeface is more appropriate for a modern web interface?",
    optionA: "'System UI', sans-serif",
    optionB: "'Old English Text MT', serif",
    correctOption: "A",
    explanation: "Typeface choice"
  },
  {
    id: "typeface-med-q7",
    difficulty: "mid",
    type: "typeface",
    prompt: "Which typeface provides better readability in body text?",
    optionA: "'Lora', serif",
    optionB: "'Impact', sans-serif",
    correctOption: "A",
    explanation: "Readability"
  },
  {
    id: "typeface-med-q8",
    difficulty: "mid",
    type: "typeface",
    prompt: "Which typeface has better letter spacing for readability?",
    optionA: "'PT Sans', sans-serif",
    optionB: "'Stencil', fantasy",
    correctOption: "A",
    explanation: "Letter spacing"
  },

  // EXPERT LEVEL - IMAGE QUESTIONS (13 total)
  {
    id: "info break-exp-q28",
    difficulty: "expert",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/info-break-exp-q28-a.png",
    optionB: "/info-break-exp-q28-a-1.png",
    correctOption: "A",
    explanation: "Information grouping"
  },
  {
    id: "spacing-exp-q29",
    difficulty: "expert",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/spacing-exp-q29-a.png",
    optionB: "/spacing-exp-q29-b.png",
    correctOption: "A",
    explanation: "Spacing"
  },
  {
    id: "spacing-exp-q30",
    difficulty: "expert",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/spacing-exp-q30-a.png",
    optionB: "/spacing-exp-q30-a-1.png",
    correctOption: "A",
    explanation: "Spacing"
  },
  {
    id: "line spacing-exp-q31",
    difficulty: "expert",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/line-spacing-exp-q31-a.png",
    optionB: "/line-spacing-exp-q31-b.png",
    correctOption: "A",
    explanation: "Line height"
  },
  {
    id: "Typo-exp-q32",
    difficulty: "expert",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/Typo-exp-q32-a.png",
    optionB: "/Typo-exp-q32-b.png",
    correctOption: "A",
    explanation: "Typography"
  },
  {
    id: "contrast-exp-q33",
    difficulty: "expert",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/contrast-exp-q33-a.png",
    optionB: "/contrast-exp-q33-b.png",
    correctOption: "A",
    explanation: "Contrast"
  },
  {
    id: "alignment-exp-q34",
    difficulty: "expert",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/alignment-exp-q34-a.png",
    optionB: "/alignment-exp-q34-b.png",
    correctOption: "A",
    explanation: "Alignment"
  },
  {
    id: "font-exp-q35",
    difficulty: "expert",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/font-exp-q35-a.png",
    optionB: "/font-exp-q35-b.png",
    correctOption: "A",
    explanation: "Typeface hierarchy"
  },
  {
    id: "alignment-exp-q36",
    difficulty: "expert",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/alignment-exp-q36-a.png",
    optionB: "/alignment-exp-q36-b.png",
    correctOption: "A",
    explanation: "Alignment"
  },
  {
    id: "image quality-exp-q37",
    difficulty: "expert",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/image-quality-exp-q37-a.png",
    optionB: "/image-quality-exp-q37-b.png",
    correctOption: "A",
    explanation: "Image quality"
  },
  {
    id: "border width-exp-q38",
    difficulty: "expert",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/border-width-exp-q38-a.png",
    optionB: "/border-width-exp-q38-b.png",
    correctOption: "A",
    explanation: "Border weight"
  },
  {
    id: "image size-exp-q39",
    difficulty: "expert",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/image-size-exp-q39-a.png",
    optionB: "/image-size-exp-q39-b.png",
    correctOption: "A",
    explanation: "Image size"
  },
  {
    id: "icon style-exp-q40",
    difficulty: "expert",
    type: "image",
    prompt: "Which of these images is most correct?",
    optionA: "/icon-style-exp-q40-a.png",
    optionB: "/icon-style-exp-q40-b.png",
    correctOption: "A",
    explanation: "Icon style"
  },

  // EXPERT LEVEL - TYPEFACE QUESTIONS (7 total)
  {
    id: "typeface-exp-q1",
    difficulty: "expert",
    type: "typeface",
    prompt: "Which typeface is Arial?",
    optionA: "'Arial', sans-serif",
    optionB: "'Helvetica', sans-serif",
    correctOption: "A",
    explanation: "Font identification"
  },
  {
    id: "typeface-exp-q2",
    difficulty: "expert",
    type: "typeface",
    prompt: "Which typeface is Helvetica?",
    optionA: "'Helvetica', sans-serif",
    optionB: "'Arial', sans-serif",
    correctOption: "A",
    explanation: "Font identification"
  },
  {
    id: "typeface-exp-q3",
    difficulty: "expert",
    type: "typeface",
    prompt: "Which typeface is Georgia?",
    optionA: "'Georgia', serif",
    optionB: "'Times New Roman', serif",
    correctOption: "A",
    explanation: "Font identification"
  },
  {
    id: "typeface-exp-q4",
    difficulty: "expert",
    type: "typeface",
    prompt: "Which typeface is Verdana?",
    optionA: "'Verdana', sans-serif",
    optionB: "'Tahoma', sans-serif",
    correctOption: "A",
    explanation: "Font identification"
  },
  {
    id: "typeface-exp-q5",
    difficulty: "expert",
    type: "typeface",
    prompt: "Which typeface is Garamond?",
    optionA: "'Garamond', serif",
    optionB: "'Baskerville', serif",
    correctOption: "A",
    explanation: "Font identification"
  },
  {
    id: "typeface-exp-q6",
    difficulty: "expert",
    type: "typeface",
    prompt: "Which typeface is Futura?",
    optionA: "'Futura', sans-serif",
    optionB: "'Gotham', sans-serif",
    correctOption: "A",
    explanation: "Font identification"
  },
  {
    id: "typeface-exp-q7",
    difficulty: "expert",
    type: "typeface",
    prompt: "Which typeface is Baskerville?",
    optionA: "'Baskerville', serif",
    optionB: "'Garamond', serif",
    correctOption: "A",
    explanation: "Font identification"
  }
]
