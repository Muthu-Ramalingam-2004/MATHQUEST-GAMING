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
  // â”€â”€ CLASS 9 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  // Class 9 - Number System
  { id: "q-sys-9-1", class: 9, chapterId: "num-sys-9", type: "mcq", difficulty: "Easy",
    question: "Which of the following is an irrational number?",
    options: ["0.14", "0.1416", "0.14161616...", "0.401400140001..."], correctAnswer: "3",
    explanation: "A non-terminating, non-repeating decimal is irrational. Option 4 has no repeating block.", hint: "Irrational decimals never terminate and never repeat.", xpReward: 20, timeLimit: 20 },
  { id: "q-sys-9-2", class: 9, chapterId: "num-sys-9", type: "numerical", difficulty: "Medium",
    question: "Find the value of (64)^(1/2).", options: null, correctAnswer: "8",
    explanation: "(64)^(1/2) = square root of 64 = 8.", hint: "What positive integer multiplied by itself gives 64?", xpReward: 30, timeLimit: 25 },
  { id: "q-sys-9-3", class: 9, chapterId: "num-sys-9", type: "boolean", difficulty: "Easy",
    question: "Every rational number is a whole number.", options: ["True", "False"], correctAnswer: "1",
    explanation: "Fractions like 1/2 or negative numbers like -3 are rational but not whole numbers.", hint: "Think about fractions or negative numbers.", xpReward: 15, timeLimit: 15 },

  // Class 9 - Algebra
  { id: "q-alg-9-1", class: 9, chapterId: "algebra-9", type: "mcq", difficulty: "Medium",
    question: "Factorize completely: xÂ² - 9yÂ².",
    options: ["(x - 3y)(x - 3y)", "(x + 3y)(x - 3y)", "(x + 9y)(x - y)", "(x - 9y)(x + y)"], correctAnswer: "1",
    explanation: "xÂ² - 9yÂ² = xÂ² - (3y)Â² = (x + 3y)(x - 3y) by difference of squares.", hint: "Use aÂ² - bÂ² = (a+b)(a-b).", xpReward: 30, timeLimit: 30 },
  { id: "q-alg-9-2", class: 9, chapterId: "algebra-9", type: "numerical", difficulty: "Hard",
    question: "If x + y = 5 and xy = 6, find the value of xÂ² + yÂ².", options: null, correctAnswer: "13",
    explanation: "(x+y)Â² = xÂ² + yÂ² + 2xy â†’ 25 = xÂ² + yÂ² + 12 â†’ xÂ² + yÂ² = 13.", hint: "Expand (x+y)Â² and substitute.", xpReward: 50, timeLimit: 45 },
  { id: "q-alg-9-3", class: 9, chapterId: "algebra-9", type: "mcq", difficulty: "Easy",
    question: "Which of the following is a polynomial?",
    options: ["x^(-1) + 2", "âˆšx + 3", "xÂ² + 3x + 1", "1/x"], correctAnswer: "2",
    explanation: "xÂ² + 3x + 1 has only non-negative integer exponents â€” the definition of a polynomial.", hint: "Check if all exponents of x are non-negative whole numbers.", xpReward: 20, timeLimit: 20 },

  // Class 9 - Coordinate Geometry
  { id: "q-coo-9-1", class: 9, chapterId: "coord-geom-9", type: "mcq", difficulty: "Easy",
    question: "In which quadrant does the point (-3, 4) lie?",
    options: ["Quadrant I", "Quadrant II", "Quadrant III", "Quadrant IV"], correctAnswer: "1",
    explanation: "Quadrant II: x is negative, y is positive. (-3, 4) fits.", hint: "QI(+,+) QII(-,+) QIII(-,-) QIV(+,-)", xpReward: 20, timeLimit: 20 },
  { id: "q-coo-9-2", class: 9, chapterId: "coord-geom-9", type: "boolean", difficulty: "Easy",
    question: "The point (0, 5) lies on the y-axis.", options: ["True", "False"], correctAnswer: "0",
    explanation: "Any point with x-coordinate = 0 lies on the y-axis.", hint: "A point on the y-axis has x = 0.", xpReward: 15, timeLimit: 15 },
  { id: "q-coo-9-3", class: 9, chapterId: "coord-geom-9", type: "numerical", difficulty: "Medium",
    question: "What is the distance of the point (3, 4) from the origin?", options: null, correctAnswer: "5",
    explanation: "âˆš(3Â² + 4Â²) = âˆš(9+16) = âˆš25 = 5.", hint: "Use d = âˆš(xÂ² + yÂ²).", xpReward: 25, timeLimit: 25 },

  // Class 9 - Geometry
  { id: "q-geo-9-1", class: 9, chapterId: "geometry-9", type: "mcq", difficulty: "Medium",
    question: "If two angles of a triangle are 45Â° and 65Â°, what is the third angle?",
    options: ["60Â°", "70Â°", "80Â°", "90Â°"], correctAnswer: "1",
    explanation: "Sum of angles = 180Â°. Third = 180Â° - 45Â° - 65Â° = 70Â°.", hint: "Angles of a triangle sum to 180Â°.", xpReward: 25, timeLimit: 20 },
  { id: "q-geo-9-2", class: 9, chapterId: "geometry-9", type: "boolean", difficulty: "Easy",
    question: "An equilateral triangle has all three angles equal to 60Â°.", options: ["True", "False"], correctAnswer: "0",
    explanation: "All sides equal â†’ all angles equal â†’ each = 180Â°/3 = 60Â°.", hint: "In equilateral triangles all sides and angles are equal.", xpReward: 15, timeLimit: 15 },
  { id: "q-geo-9-3", class: 9, chapterId: "geometry-9", type: "mcq", difficulty: "Hard",
    question: "In triangle ABC, if AB = AC and angle B = 50Â°, find angle A.",
    options: ["50Â°", "60Â°", "80Â°", "100Â°"], correctAnswer: "2",
    explanation: "Isosceles: âˆ B = âˆ C = 50Â°. âˆ A = 180Â° - 50Â° - 50Â° = 80Â°.", hint: "Base angles of an isosceles triangle are equal.", xpReward: 35, timeLimit: 30 },

  // Class 9 - Mensuration
  { id: "q-men-9-1", class: 9, chapterId: "mensuration-9", type: "numerical", difficulty: "Medium",
    question: "Find the area of a triangle with base 8 cm and height 5 cm.", options: null, correctAnswer: "20",
    explanation: "Area = (1/2) Ã— 8 Ã— 5 = 20 cmÂ².", hint: "Area = (1/2) Ã— base Ã— height.", xpReward: 25, timeLimit: 20 },
  { id: "q-men-9-2", class: 9, chapterId: "mensuration-9", type: "mcq", difficulty: "Easy",
    question: "What is the perimeter of a rectangle with length 6 cm and width 4 cm?",
    options: ["10 cm", "20 cm", "24 cm", "48 cm"], correctAnswer: "1",
    explanation: "Perimeter = 2(6 + 4) = 20 cm.", hint: "Perimeter = 2 Ã— (length + width).", xpReward: 20, timeLimit: 15 },
  { id: "q-men-9-3", class: 9, chapterId: "mensuration-9", type: "numerical", difficulty: "Hard",
    question: "Find the volume of a cube with side 4 cm.", options: null, correctAnswer: "64",
    explanation: "Volume = sideÂ³ = 4Â³ = 64 cmÂ³.", hint: "Volume of cube = sideÂ³.", xpReward: 30, timeLimit: 20 },

  // Class 9 - Statistics & Probability
  { id: "q-sta-9-1", class: 9, chapterId: "stats-prob-9", type: "numerical", difficulty: "Easy",
    question: "Find the mean of: 4, 8, 6, 5, 3, 2, 8, 9, 2, 3.", options: null, correctAnswer: "5",
    explanation: "Sum = 50, Count = 10. Mean = 50/10 = 5.", hint: "Mean = sum Ã· count.", xpReward: 20, timeLimit: 25 },
  { id: "q-sta-9-2", class: 9, chapterId: "stats-prob-9", type: "mcq", difficulty: "Easy",
    question: "A fair coin is tossed once. What is the probability of getting Heads?",
    options: ["0", "1/4", "1/2", "1"], correctAnswer: "2",
    explanation: "P(Heads) = 1/2 since there are 2 equally likely outcomes.", hint: "P = Favourable / Total outcomes.", xpReward: 15, timeLimit: 15 },
  { id: "q-sta-9-3", class: 9, chapterId: "stats-prob-9", type: "boolean", difficulty: "Easy",
    question: "The probability of an impossible event is 0.", options: ["True", "False"], correctAnswer: "0",
    explanation: "An impossible event has 0 probability. Probability ranges from 0 to 1.", hint: "Probability is always between 0 and 1 inclusive.", xpReward: 15, timeLimit: 15 },

  // â”€â”€ CLASS 10 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  // Class 10 - Real Numbers
  { id: "q-real-10-1", class: 10, chapterId: "real-num-10", type: "numerical", difficulty: "Medium",
    question: "Calculate the HCF of 135 and 225 using Euclid's Division Algorithm.", options: null, correctAnswer: "45",
    explanation: "225=135(1)+90; 135=90(1)+45; 90=45(2)+0. HCF = 45.", hint: "Apply Euclid's lemma until remainder = 0.", xpReward: 35, timeLimit: 40 },
  { id: "q-real-10-2", class: 10, chapterId: "real-num-10", type: "boolean", difficulty: "Easy",
    question: "The product of a non-zero rational and an irrational number is always irrational.", options: ["True", "False"], correctAnswer: "0",
    explanation: "e.g. 2 Ã— âˆš3 = 2âˆš3, which is irrational.", hint: "Try 1/2 Ã— âˆš2.", xpReward: 20, timeLimit: 20 },
  { id: "q-real-10-3", class: 10, chapterId: "real-num-10", type: "mcq", difficulty: "Medium",
    question: "Which of the following is the LCM of 12 and 15?",
    options: ["30", "45", "60", "90"], correctAnswer: "2",
    explanation: "12 = 2Â²Ã—3, 15 = 3Ã—5. LCM = 2Â²Ã—3Ã—5 = 60.", hint: "LCM = product of highest prime powers.", xpReward: 25, timeLimit: 25 },

  // Class 10 - Algebra
  { id: "q-alg-10-1", class: 10, chapterId: "algebra-10", type: "mcq", difficulty: "Medium",
    question: "What is the common difference of the AP: 3, 1, -1, -3, ...?",
    options: ["2", "-2", "1.5", "-1.5"], correctAnswer: "1",
    explanation: "d = 1 - 3 = -2.", hint: "d = termâ‚‚ - termâ‚.", xpReward: 25, timeLimit: 20 },
  { id: "q-alg-10-2", class: 10, chapterId: "algebra-10", type: "numerical", difficulty: "Hard",
    question: "Find the sum of the first 10 terms of the AP: 2, 7, 12, ...", options: null, correctAnswer: "245",
    explanation: "Sâ‚â‚€ = (10/2)[2(2)+(9)(5)] = 5Ã—49 = 245.", hint: "S_n = (n/2)[2a+(n-1)d].", xpReward: 50, timeLimit: 50 },
  { id: "q-alg-10-3", class: 10, chapterId: "algebra-10", type: "mcq", difficulty: "Medium",
    question: "What are the roots of the quadratic equation xÂ² - 5x + 6 = 0?",
    options: ["1 and 6", "2 and 3", "-2 and -3", "1 and -6"], correctAnswer: "1",
    explanation: "(x-2)(x-3)=0, so x=2 or x=3.", hint: "Find two numbers that multiply to 6 and add to -5.", xpReward: 30, timeLimit: 30 },

  // Class 10 - Trigonometry
  { id: "q-trig-10-1", class: 10, chapterId: "trig-10", type: "mcq", difficulty: "Medium",
    question: "If sin Î¸ = 3/5, what is the value of cos Î¸?",
    options: ["4/5", "5/4", "3/4", "4/3"], correctAnswer: "0",
    explanation: "cosÂ²Î¸ = 1 - (9/25) = 16/25, cos Î¸ = 4/5.", hint: "Use sinÂ²Î¸ + cosÂ²Î¸ = 1.", xpReward: 30, timeLimit: 30 },
  { id: "q-trig-10-2", class: 10, chapterId: "trig-10", type: "numerical", difficulty: "Hard",
    question: "Evaluate: (sinÂ² 30Â° + cosÂ² 30Â°) + tan 45Â°.", options: null, correctAnswer: "2",
    explanation: "sinÂ²Î¸ + cosÂ²Î¸ = 1. tan45Â° = 1. Total = 2.", hint: "sinÂ²Î¸ + cosÂ²Î¸ = 1 and tan 45Â° = 1.", xpReward: 40, timeLimit: 30 },
  { id: "q-trig-10-3", class: 10, chapterId: "trig-10", type: "mcq", difficulty: "Easy",
    question: "What is the value of sin 90Â°?",
    options: ["0", "1/2", "âˆš3/2", "1"], correctAnswer: "3",
    explanation: "sin 90Â° = 1 (standard value).", hint: "Recall: sin 0Â°=0, sin 30Â°=1/2, sin 90Â°=1.", xpReward: 15, timeLimit: 15 },

  // Class 10 - Coordinate Geometry
  { id: "q-cog-10-1", class: 10, chapterId: "coord-geom-10", type: "numerical", difficulty: "Medium",
    question: "Find the distance between the points (3, 4) and (0, 0).", options: null, correctAnswer: "5",
    explanation: "âˆš(3Â² + 4Â²) = âˆš25 = 5.", hint: "d = âˆš((xâ‚‚-xâ‚)Â² + (yâ‚‚-yâ‚)Â²).", xpReward: 25, timeLimit: 25 },
  { id: "q-cog-10-2", class: 10, chapterId: "coord-geom-10", type: "mcq", difficulty: "Medium",
    question: "What are the coordinates of the midpoint of the segment joining (2, 4) and (6, 8)?",
    options: ["(3, 5)", "(4, 6)", "(8, 12)", "(2, 2)"], correctAnswer: "1",
    explanation: "Midpoint = ((2+6)/2, (4+8)/2) = (4, 6).", hint: "Midpoint = ((xâ‚+xâ‚‚)/2, (yâ‚+yâ‚‚)/2).", xpReward: 25, timeLimit: 25 },
  { id: "q-cog-10-3", class: 10, chapterId: "coord-geom-10", type: "numerical", difficulty: "Hard",
    question: "Find the area of the triangle with vertices A(1,1), B(4,1), C(4,5).", options: null, correctAnswer: "6",
    explanation: "Area = (1/2)|1(1-5)+4(5-1)+4(1-1)| = (1/2)|12| = 6.", hint: "Use coordinate geometry area formula.", xpReward: 40, timeLimit: 40 },

  // Class 10 - Geometry & Circles
  { id: "q-geoc-10-1", class: 10, chapterId: "geometry-10", type: "boolean", difficulty: "Easy",
    question: "A tangent to a circle is perpendicular to the radius at the point of tangency.", options: ["True", "False"], correctAnswer: "0",
    explanation: "Fundamental theorem: tangent âŠ¥ radius at point of contact.", hint: "A tangent touches the circle at exactly one point.", xpReward: 15, timeLimit: 15 },
  { id: "q-geoc-10-2", class: 10, chapterId: "geometry-10", type: "mcq", difficulty: "Medium",
    question: "If two tangents are drawn from an external point to a circle, they are:",
    options: ["Unequal in length", "Equal in length", "Parallel to each other", "Perpendicular to each other"], correctAnswer: "1",
    explanation: "Tangents from an external point are always equal in length.", hint: "Consider the two right triangles formed with the radii.", xpReward: 25, timeLimit: 25 },
  { id: "q-geoc-10-3", class: 10, chapterId: "geometry-10", type: "numerical", difficulty: "Easy",
    question: "The radius of a circle is 5 cm. What is the length of the diameter?", options: null, correctAnswer: "10",
    explanation: "Diameter = 2 Ã— radius = 10 cm.", hint: "Diameter = 2 Ã— radius.", xpReward: 15, timeLimit: 15 },

  // Class 10 - Mensuration (3D)
  { id: "q-men-10-1", class: 10, chapterId: "mensuration-10", type: "numerical", difficulty: "Medium",
    question: "Find the volume of a sphere with radius 3 cm. (Use Ï€ = 3.14)", options: null, correctAnswer: "113.04",
    explanation: "V = (4/3)Ï€rÂ³ = (4/3)Ã—3.14Ã—27 = 113.04 cmÂ³.", hint: "V = (4/3)Ï€rÂ³.", xpReward: 35, timeLimit: 35 },
  { id: "q-men-10-2", class: 10, chapterId: "mensuration-10", type: "mcq", difficulty: "Easy",
    question: "What is the formula for the curved surface area of a cylinder with radius r and height h?",
    options: ["2Ï€rÂ²", "Ï€rÂ²h", "2Ï€rh", "2Ï€r(r+h)"], correctAnswer: "2",
    explanation: "Curved surface area of cylinder = 2Ï€rh.", hint: "CSA excludes the circular top and bottom caps.", xpReward: 20, timeLimit: 20 },
  { id: "q-men-10-3", class: 10, chapterId: "mensuration-10", type: "numerical", difficulty: "Hard",
    question: "A cone has radius 7 cm and slant height 10 cm. Find its curved surface area. (Use Ï€ = 22/7)", options: null, correctAnswer: "220",
    explanation: "CSA = Ï€rl = (22/7)Ã—7Ã—10 = 220 cmÂ².", hint: "CSA of cone = Ï€rl.", xpReward: 40, timeLimit: 40 },

  // Class 10 - Statistics & Probability
  { id: "q-stp-10-1", class: 10, chapterId: "stats-prob-10", type: "mcq", difficulty: "Medium",
    question: "For the data set {2, 3, 3, 4, 5, 6, 6, 6, 7}, what is the mode?",
    options: ["3", "4", "6", "5"], correctAnswer: "2",
    explanation: "6 appears 3 times â€” most frequent. Mode = 6.", hint: "The mode is the most frequently occurring value.", xpReward: 20, timeLimit: 20 },
  { id: "q-stp-10-2", class: 10, chapterId: "stats-prob-10", type: "numerical", difficulty: "Easy",
    question: "A bag has 3 red and 5 blue balls. What is the probability of drawing a red ball?", options: null, correctAnswer: "0.375",
    explanation: "P(red) = 3/8 = 0.375.", hint: "P = Favourable / Total.", xpReward: 20, timeLimit: 20 },
  { id: "q-stp-10-3", class: 10, chapterId: "stats-prob-10", type: "boolean", difficulty: "Easy",
    question: "The sum of all probabilities in a sample space is always 1.", options: ["True", "False"], correctAnswer: "0",
    explanation: "By definition, all probabilities in a sample space sum to 1.", hint: "P(H) + P(T) = 1/2 + 1/2 = 1 for a coin toss.", xpReward: 15, timeLimit: 15 }
];
