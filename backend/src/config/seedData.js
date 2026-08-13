// MathQuest Question Seed Data for Backend Database Simulator

export const initialQuestions = [
  // Class 9 - Number System
  {
    id: "q-sys-9-1",
    class: 9,
    chapterId: "num-sys-9",
    type: "mcq",
    difficulty: "Easy",
    question: "Which of the following is an irrational number?",
    options: ["0.14", "0.1416", "0.14161616...", "0.401400140001..."],
    correctAnswer: "3",
    explanation: "A decimal number which is non-terminating and non-repeating is irrational. Options 1 and 2 are terminating. Option 3 is non-terminating but repeating (16 is repeating). Option 4 is non-terminating and non-repeating.",
    hint: "Irrational numbers have decimal representations that never end and never form a repeating pattern.",
    xpReward: 20,
    timeLimit: 20
  },
  {
    id: "q-sys-9-2",
    class: 9,
    chapterId: "num-sys-9",
    type: "numerical",
    difficulty: "Medium",
    question: "Find the value of (64)^(1/2).",
    options: null,
    correctAnswer: "8",
    explanation: "(64)^(1/2) means the square root of 64. Since 8 × 8 = 64, the square root is 8.",
    hint: "What positive integer multiplied by itself equals 64?",
    xpReward: 30,
    timeLimit: 25
  },
  {
    id: "q-sys-9-3",
    class: 9,
    chapterId: "num-sys-9",
    type: "boolean",
    difficulty: "Easy",
    question: "Every rational number is a whole number.",
    options: ["True", "False"],
    correctAnswer: "1",
    explanation: "Rational numbers include fractions like 1/2 or -3, which are not whole numbers. (Whole numbers are 0, 1, 2, 3...)",
    hint: "Think about negative numbers or fractions. Are they whole numbers?",
    xpReward: 15,
    timeLimit: 15
  },

  // Class 9 - Algebra
  {
    id: "q-alg-9-1",
    class: 9,
    chapterId: "algebra-9",
    type: "mcq",
    difficulty: "Medium",
    question: "Factorize completely: x² - 9y².",
    options: ["(x - 3y)(x - 3y)", "(x + 3y)(x - 3y)", "(x + 9y)(x - y)", "(x - 9y)(x + y)"],
    correctAnswer: "1",
    explanation: "Using the algebraic identity a² - b² = (a + b)(a - b), we write x² - 9y² as x² - (3y)², which factorizes to (x + 3y)(x - 3y).",
    hint: "Use the difference of squares identity: a² - b² = (a + b)(a - b).",
    xpReward: 30,
    timeLimit: 30
  },
  {
    id: "q-alg-9-2",
    class: 9,
    chapterId: "algebra-9",
    type: "numerical",
    difficulty: "Hard",
    question: "If x + y = 5 and xy = 6, find the value of x² + y².",
    options: null,
    correctAnswer: "13",
    explanation: "We know that (x + y)² = x² + y² + 2xy. Substituting the values: (5)² = x² + y² + 2(6) => 25 = x² + y² + 12 => x² + y² = 25 - 12 = 13.",
    hint: "Use the expansion of (x + y)² and substitute the given values.",
    xpReward: 50,
    timeLimit: 45
  },

  // Class 10 - Real Numbers
  {
    id: "q-real-10-1",
    class: 10,
    chapterId: "real-num-10",
    type: "numerical",
    difficulty: "Medium",
    question: "Calculate the HCF of 135 and 225 using Euclid's Division Algorithm.",
    options: null,
    correctAnswer: "45",
    explanation: "Using division algorithm: 225 = 135(1) + 90; 135 = 90(1) + 45; 90 = 45(2) + 0. Since the remainder is now 0, the divisor 45 is the HCF.",
    hint: "Apply Euclid's lemma recursively: divide 225 by 135, then divide 135 by the remainder, and so on until the remainder is 0.",
    xpReward: 35,
    timeLimit: 40
  },
  {
    id: "q-real-10-2",
    class: 10,
    chapterId: "real-num-10",
    type: "boolean",
    difficulty: "Easy",
    question: "The product of a non-zero rational and an irrational number is always irrational.",
    options: ["True", "False"],
    correctAnswer: "0",
    explanation: "If you multiply any non-zero rational number (e.g., 2) by an irrational number (e.g., √3), the product (2√3) cannot be represented as a simple fraction, meaning it is always irrational.",
    hint: "Try multiplying a simple fraction like 1/2 with √2. Is the result rational?",
    xpReward: 20,
    timeLimit: 20
  },

  // Class 10 - Trigonometry
  {
    id: "q-trig-10-1",
    class: 10,
    chapterId: "trig-10",
    type: "mcq",
    difficulty: "Medium",
    question: "If sin θ = 3/5, what is the value of cos θ?",
    options: ["4/5", "5/4", "3/4", "4/3"],
    correctAnswer: "0",
    explanation: "Using trigonometric identity sin² θ + cos² θ = 1: cos² θ = 1 - sin² θ = 1 - (3/5)² = 1 - 9/25 = 16/25. Thus, cos θ = √(16/25) = 4/5.",
    hint: "Use a right-angled triangle. If opposite = 3 and hypotenuse = 5, find the adjacent side using Pythagoras theorem, then compute adjacent/hypotenuse.",
    xpReward: 30,
    timeLimit: 30
  }
];
