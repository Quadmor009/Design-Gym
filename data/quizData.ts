export interface Question {
  id: number
  level: "beginner" | "mid"
  category: "interface-comparison" | "font-identification"
  question: string
  promptContext?: string
  leftImage?: string
  rightImage?: string
  leftFont?: string
  rightFont?: string
  correctAnswer: "left" | "right"
  principlesTested: string[]
  explanation: string
  type?: 'design' | 'font'
}

export const foxQuote = "The quick brown fox jumps over the lazy dog."

export const questions: Question[] = [
  // BEGINNER LEVEL QUESTIONS (1-10)
  {
    id: 1,
    level: "beginner",
    category: "interface-comparison",
    question: "Which button design has better visual contrast?",
    promptContext: "A user needs to identify the primary action on a form.",
    leftImage: "https://picsum.photos/seed/beginner-01-left/400/300",
    rightImage: "https://picsum.photos/seed/beginner-01-right/400/300",
    correctAnswer: "right",
    principlesTested: ["contrast", "visual hierarchy"],
    explanation: "The right option uses higher contrast between the button and background, making it easier to distinguish as the primary action. Strong contrast is essential for accessibility and visual clarity.",
    type: 'design'
  },
  {
    id: 2,
    level: "beginner",
    category: "interface-comparison",
    question: "Which layout has better text alignment?",
    promptContext: "Comparing two text-heavy interfaces for readability.",
    leftImage: "https://picsum.photos/seed/beginner-02-left/400/300",
    rightImage: "https://picsum.photos/seed/beginner-02-right/400/300",
    correctAnswer: "left",
    principlesTested: ["alignment", "readability"],
    explanation: "The left option shows consistent alignment with text properly left-aligned and elements aligned to a grid. Poor alignment creates visual chaos and reduces readability.",
    type: 'design'
  },
  {
    id: 3,
    level: "beginner",
    category: "interface-comparison",
    question: "Which interface uses spacing more effectively?",
    promptContext: "Evaluating white space usage in a dashboard layout.",
    leftImage: "https://picsum.photos/seed/beginner-03-left/400/300",
    rightImage: "https://picsum.photos/seed/beginner-03-right/400/300",
    correctAnswer: "right",
    principlesTested: ["spacing", "visual hierarchy"],
    explanation: "The right option provides adequate spacing between elements, making the interface easier to scan and reducing visual clutter. Proper spacing is fundamental to good design.",
    type: 'design'
  },
  {
    id: 4,
    level: "beginner",
    category: "font-identification",
    question: "Which typeface belongs to the serif family?",
    leftFont: "'Arial', sans-serif",
    rightFont: "'Times New Roman', serif",
    correctAnswer: "right",
    principlesTested: ["typography fundamentals"],
    explanation: "Times New Roman is a serif typeface, characterized by small decorative strokes (serifs) at the ends of letters. Arial is a sans-serif typeface without these decorative elements.",
    type: 'font'
  },
  {
    id: 5,
    level: "beginner",
    category: "interface-comparison",
    question: "Which design has clearer visual hierarchy?",
    promptContext: "A landing page needs to guide users to the main call-to-action.",
    leftImage: "https://picsum.photos/seed/beginner-05-left/400/300",
    rightImage: "https://picsum.photos/seed/beginner-05-right/400/300",
    correctAnswer: "right",
    principlesTested: ["visual hierarchy", "readability"],
    explanation: "The right option establishes clear hierarchy through size, weight, and positioning. The most important element is most prominent, guiding the user's attention effectively.",
    type: 'design'
  },
  {
    id: 6,
    level: "beginner",
    category: "interface-comparison",
    question: "Which interface distinguishes primary from secondary actions better?",
    promptContext: "A form with multiple action buttons.",
    leftImage: "https://picsum.photos/seed/beginner-06-left/400/300",
    rightImage: "https://picsum.photos/seed/beginner-06-right/400/300",
    correctAnswer: "right",
    principlesTested: ["primary vs secondary actions", "visual hierarchy"],
    explanation: "The right option clearly differentiates the primary action through size, color, and styling, while secondary actions are visually de-emphasized. This prevents user confusion.",
    type: 'design'
  },
  {
    id: 7,
    level: "beginner",
    category: "interface-comparison",
    question: "Which text has better readability?",
    promptContext: "Body text in a blog post interface.",
    leftImage: "https://picsum.photos/seed/beginner-07-left/400/300",
    rightImage: "https://picsum.photos/seed/beginner-07-right/400/300",
    correctAnswer: "left",
    principlesTested: ["readability", "contrast"],
    explanation: "The left option uses appropriate font size, line height, and contrast for body text. The text is easy to read and doesn't strain the eyes, which is essential for content consumption.",
    type: 'design'
  },
  {
    id: 8,
    level: "beginner",
    category: "font-identification",
    question: "Which typeface is Poppins?",
    leftFont: "'Helvetica', sans-serif",
    rightFont: "'Poppins', sans-serif",
    correctAnswer: "right",
    principlesTested: ["typography fundamentals"],
    explanation: "Poppins is a geometric sans-serif typeface designed by Indian Type Foundry. It features rounded letterforms and is widely used in modern web design.",
    type: 'font'
  },
  {
    id: 9,
    level: "beginner",
    category: "interface-comparison",
    question: "Which layout has better element alignment?",
    promptContext: "A card-based interface showing product information.",
    leftImage: "https://picsum.photos/seed/beginner-09-left/400/300",
    rightImage: "https://picsum.photos/seed/beginner-09-right/400/300",
    correctAnswer: "left",
    principlesTested: ["alignment", "visual clarity"],
    explanation: "The left option demonstrates consistent alignment across all elements, creating a clean and organized appearance. Proper alignment is a foundational design principle.",
    type: 'design'
  },
  {
    id: 10,
    level: "beginner",
    category: "interface-comparison",
    question: "Which design uses contrast more effectively?",
    promptContext: "An important notification banner in an application.",
    leftImage: "https://picsum.photos/seed/beginner-10-left/400/300",
    rightImage: "https://picsum.photos/seed/beginner-10-right/400/300",
    correctAnswer: "right",
    principlesTested: ["contrast", "visual hierarchy"],
    explanation: "The right option uses strong contrast to make important information stand out. High contrast draws attention and ensures critical messages are noticed immediately.",
    type: 'design'
  },

  // MID LEVEL QUESTIONS (11-20)
  {
    id: 11,
    level: "mid",
    category: "interface-comparison",
    question: "Which interface better supports a returning user completing a task quickly?",
    promptContext: "A dashboard used daily by experienced users who need efficiency.",
    leftImage: "https://picsum.photos/seed/mid-01-left/400/300",
    rightImage: "https://picsum.photos/seed/mid-01-right/400/300",
    correctAnswer: "left",
    principlesTested: ["information density", "cognitive load", "contextual hierarchy"],
    explanation: "The left option provides more information density and shortcuts that experienced users need. While it may seem cluttered to beginners, it reduces clicks for power users who have learned the interface.",
    type: 'design'
  },
  {
    id: 12,
    level: "mid",
    category: "interface-comparison",
    question: "Which design better handles progressive disclosure for a complex feature?",
    promptContext: "A settings panel with many configuration options.",
    leftImage: "https://picsum.photos/seed/mid-02-left/400/300",
    rightImage: "https://picsum.photos/seed/mid-02-right/400/300",
    correctAnswer: "right",
    principlesTested: ["progressive disclosure", "cognitive load", "information architecture"],
    explanation: "The right option uses progressive disclosure to show only relevant options initially, with expandable sections for advanced settings. This reduces initial cognitive load while still providing access to all features.",
    type: 'design'
  },
  {
    id: 13,
    level: "mid",
    category: "interface-comparison",
    question: "Which interface provides better affordance for interactive elements?",
    promptContext: "Users need to understand what can be clicked or interacted with.",
    leftImage: "https://picsum.photos/seed/mid-03-left/400/300",
    rightImage: "https://picsum.photos/seed/mid-03-right/400/300",
    correctAnswer: "right",
    principlesTested: ["affordance", "usability", "visual clarity"],
    explanation: "The right option makes interactive elements clearly distinguishable through hover states, shadows, and visual cues. While both might be functional, better affordance reduces user hesitation and improves discoverability.",
    type: 'design'
  },
  {
    id: 14,
    level: "mid",
    category: "interface-comparison",
    question: "Which design better balances consistency with necessary emphasis?",
    promptContext: "A notification system that must be consistent but also draw attention when needed.",
    leftImage: "https://picsum.photos/seed/mid-04-left/400/300",
    rightImage: "https://picsum.photos/seed/mid-04-right/400/300",
    correctAnswer: "left",
    principlesTested: ["consistency vs emphasis", "contextual hierarchy"],
    explanation: "The left option maintains visual consistency while using strategic emphasis only when truly important. Consistency helps users learn patterns, but selective emphasis ensures critical information isn't missed.",
    type: 'design'
  },
  {
    id: 15,
    level: "mid",
    category: "font-identification",
    question: "Which typeface belongs to the serif family?",
    leftFont: "'Verdana', sans-serif",
    rightFont: "'Georgia', serif",
    correctAnswer: "right",
    principlesTested: ["typography fundamentals"],
    explanation: "Georgia is a serif typeface designed specifically for screen readability, featuring serifs on its letterforms. Verdana is a sans-serif typeface without serifs.",
    type: 'font'
  },
  {
    id: 16,
    level: "mid",
    category: "interface-comparison",
    question: "Which layout better manages cognitive load for a multi-step process?",
    promptContext: "A checkout flow with multiple steps that must feel manageable.",
    leftImage: "https://picsum.photos/seed/mid-06-left/400/300",
    rightImage: "https://picsum.photos/seed/mid-06-right/400/300",
    correctAnswer: "right",
    principlesTested: ["cognitive load", "progressive disclosure", "information architecture"],
    explanation: "The right option breaks the process into clear, manageable steps with visual progress indicators. This reduces cognitive load by letting users focus on one step at a time rather than overwhelming them with all information upfront.",
    type: 'design'
  },
  {
    id: 17,
    level: "mid",
    category: "interface-comparison",
    question: "Which interface better adapts hierarchy for different content types?",
    promptContext: "A content management system displaying various content formats.",
    leftImage: "https://picsum.photos/seed/mid-07-left/400/300",
    rightImage: "https://picsum.photos/seed/mid-07-right/400/300",
    correctAnswer: "left",
    principlesTested: ["contextual hierarchy", "flexibility"],
    explanation: "The left option adjusts its hierarchy based on content type, emphasizing different elements as context demands. This contextual approach is more appropriate for varied content than a rigid, one-size-fits-all hierarchy.",
    type: 'design'
  },
  {
    id: 18,
    level: "mid",
    category: "interface-comparison",
    question: "Which design better handles information density for expert users?",
    promptContext: "A developer tool where users need to see many details at once.",
    leftImage: "https://picsum.photos/seed/mid-08-left/400/300",
    rightImage: "https://picsum.photos/seed/mid-08-right/400/300",
    correctAnswer: "left",
    principlesTested: ["information density", "cognitive load", "user expertise"],
    explanation: "The left option presents more information in a structured, scannable format. For expert users in professional tools, higher information density is valuable as it reduces navigation and provides necessary context at a glance.",
    type: 'design'
  },
  {
    id: 19,
    level: "mid",
    category: "interface-comparison",
    question: "Which interface better provides affordance through visual design?",
    promptContext: "Users need to understand functionality without prior experience.",
    leftImage: "https://picsum.photos/seed/mid-09-left/400/300",
    rightImage: "https://picsum.photos/seed/mid-09-right/400/300",
    correctAnswer: "right",
    principlesTested: ["affordance", "usability", "visual communication"],
    explanation: "The right option uses visual design cues like icons, hover states, and styling to communicate interactivity. Better affordance reduces the learning curve and makes interfaces more intuitive for new users.",
    type: 'design'
  },
  {
    id: 20,
    level: "mid",
    category: "interface-comparison",
    question: "Which design better balances simplicity with necessary functionality?",
    promptContext: "An interface that must be simple but also powerful for advanced use cases.",
    leftImage: "https://picsum.photos/seed/mid-10-left/400/300",
    rightImage: "https://picsum.photos/seed/mid-10-right/400/300",
    correctAnswer: "left",
    principlesTested: ["progressive disclosure", "consistency vs emphasis", "usability"],
    explanation: "The left option maintains a simple default interface while providing access to advanced features through progressive disclosure. This approach serves both beginners and power users better than trying to show everything at once or hiding functionality.",
    type: 'design'
  }
]

