// MathQuest Chapters and Questions Database

export const chaptersData = {
  9: [
    {
      id: "num-sys-9",
      name: "Number System",
      icon: "Binary",
      difficulty: "Easy",
      xpReward: 300,
      description: "Dive into real numbers, rationalizing denominators, and laws of exponents.",
      color: "from-blue-500 to-indigo-600"
    },
    {
      id: "algebra-9",
      name: "Algebra",
      icon: "Variables",
      difficulty: "Medium",
      xpReward: 400,
      description: "Master polynomials, algebraic identities, and linear equations in two variables.",
      color: "from-purple-500 to-pink-600"
    },
    {
      id: "coord-geom-9",
      name: "Coordinate Geometry",
      icon: "Grid",
      difficulty: "Easy",
      xpReward: 300,
      description: "Learn about the Cartesian plane, plotting coordinates, and quadrants.",
      color: "from-emerald-500 to-teal-600"
    },
    {
      id: "geometry-9",
      name: "Geometry",
      icon: "Compass",
      difficulty: "Hard",
      xpReward: 500,
      description: "Unlock theorems on lines, angles, triangles, and quadrilaterals.",
      color: "from-orange-500 to-red-600"
    },
    {
      id: "mensuration-9",
      name: "Mensuration",
      icon: "Layers",
      difficulty: "Medium",
      xpReward: 400,
      description: "Calculate surface areas and volumes of spheres, cones, and cylinders.",
      color: "from-sky-500 to-blue-600"
    },
    {
      id: "stats-prob-9",
      name: "Statistics & Probability",
      icon: "BarChart3",
      difficulty: "Easy",
      xpReward: 350,
      description: "Analyze graphical data, find mean, median, mode, and calculate basic probability.",
      color: "from-yellow-500 to-amber-600"
    }
  ],
  10: [
    {
      id: "real-num-10",
      name: "Real Numbers",
      icon: "Hash",
      difficulty: "Easy",
      xpReward: 300,
      description: "Understand the Fundamental Theorem of Arithmetic and irrationality proofs.",
      color: "from-blue-600 to-cyan-600"
    },
    {
      id: "algebra-10",
      name: "Algebra",
      icon: "PlusMinus",
      difficulty: "Hard",
      xpReward: 500,
      description: "Solve quadratic equations, find roots, and explore Arithmetic Progressions (AP).",
      color: "from-purple-600 to-fuchsia-600"
    },
    {
      id: "trig-10",
      name: "Trigonometry",
      icon: "Percent",
      difficulty: "Hard",
      xpReward: 600,
      description: "Master trigonometric ratios, identities, heights, and distances.",
      color: "from-rose-500 to-red-600"
    },
    {
      id: "coord-geom-10",
      name: "Coordinate Geometry",
      icon: "MapPin",
      difficulty: "Medium",
      xpReward: 400,
      description: "Apply distance formulas, section formulas, and calculate area of triangles.",
      color: "from-emerald-600 to-green-700"
    },
    {
      id: "geometry-10",
      name: "Geometry & Circles",
      icon: "Circle",
      difficulty: "Medium",
      xpReward: 450,
      description: "Explore properties of circles, tangents, and similar triangle theorems.",
      color: "from-indigo-600 to-violet-700"
    },
    {
      id: "mensuration-10",
      name: "Mensuration (3D)",
      icon: "Box",
      difficulty: "Hard",
      xpReward: 500,
      description: "Solve combined solids surface area, volume conversion, and frustums.",
      color: "from-amber-500 to-orange-600"
    },
    {
      id: "stats-prob-10",
      name: "Statistics & Probability",
      icon: "PieChart",
      difficulty: "Medium",
      xpReward: 400,
      description: "Compute cumulative frequencies, ogives, and complex probability cases.",
      color: "from-teal-500 to-emerald-600"
    }
  ]
};

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
    correctAnswer: "3", // Index of "0.401400140001..."
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
    correctAnswer: "1", // Index of "False"
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
    correctAnswer: "1", // Index of "(x + 3y)(x - 3y)"
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

  // Class 9 - Coordinate Geometry
  {
    id: "q-coo-9-1",
    class: 9,
    chapterId: "coord-geom-9",
    type: "mcq",
    difficulty: "Easy",
    question: "In which quadrant does the point (-3, 4) lie?",
    options: ["Quadrant I", "Quadrant II", "Quadrant III", "Quadrant IV"],
    correctAnswer: "1", // Index of "Quadrant II"
    explanation: "In Quadrant II, the x-coordinate is negative and the y-coordinate is positive. For (-3, 4), x = -3 (negative) and y = 4 (positive).",
    hint: "In Quadrant I (+,+), II (-,+), III (-,-), IV (+,-). Check the signs of (-3, 4).",
    xpReward: 20,
    timeLimit: 20
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
    correctAnswer: "0", // Index of "True"
    explanation: "If you multiply any non-zero rational number (e.g., 2) by an irrational number (e.g., √3), the product (2√3) cannot be represented as a simple fraction, meaning it is always irrational.",
    hint: "Try multiplying a simple fraction like 1/2 with √2. Is the result rational?",
    xpReward: 20,
    timeLimit: 20
  },

  // Class 10 - Algebra
  {
    id: "q-alg-10-1",
    class: 10,
    chapterId: "algebra-10",
    type: "mcq",
    difficulty: "Medium",
    question: "What is the common difference of the AP: 3, 1, -1, -3, ...?",
    options: ["2", "-2", "1.5", "-1.5"],
    correctAnswer: "1", // Index of "-2"
    explanation: "Common difference (d) is any term minus the preceding term. Here, d = 1 - 3 = -2 (or -1 - 1 = -2).",
    hint: "Subtract the first term from the second term (term2 - term1).",
    xpReward: 25,
    timeLimit: 20
  },
  {
    id: "q-alg-10-2",
    class: 10,
    chapterId: "algebra-10",
    type: "numerical",
    difficulty: "Hard",
    question: "Find the sum of the first 10 terms of the AP: 2, 7, 12, ...",
    options: null,
    correctAnswer: "245",
    explanation: "Here, first term a = 2, common difference d = 7 - 2 = 5, number of terms n = 10. The sum S_n = (n/2) * [2a + (n-1)d]. S_10 = (10/2) * [2(2) + (9)(5)] = 5 * [4 + 45] = 5 * 49 = 245.",
    hint: "Use the AP sum formula: S_n = (n/2) * [2a + (n-1)d] where a=2, d=5, n=10.",
    xpReward: 50,
    timeLimit: 50
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
    correctAnswer: "0", // Index of "4/5"
    explanation: "Using trigonometric identity sin² θ + cos² θ = 1: cos² θ = 1 - sin² θ = 1 - (3/5)² = 1 - 9/25 = 16/25. Thus, cos θ = √(16/25) = 4/5.",
    hint: "Use a right-angled triangle. If opposite = 3 and hypotenuse = 5, find the adjacent side using Pythagoras theorem, then compute adjacent/hypotenuse.",
    xpReward: 30,
    timeLimit: 30
  },
  {
    id: "q-trig-10-2",
    class: 10,
    chapterId: "trig-10",
    type: "numerical",
    difficulty: "Hard",
    question: "Evaluate: (sin² 30° + cos² 30°) + tan 45°.",
    options: null,
    correctAnswer: "2",
    explanation: "We know sin² θ + cos² θ = 1 for any angle. Thus, sin² 30° + cos² 30° = 1. Also, tan 45° = 1. So, 1 + 1 = 2.",
    hint: "Recall trigonometric identity sin² θ + cos² θ = 1, and the value of tan 45°.",
    xpReward: 40,
    timeLimit: 30
  }
];
