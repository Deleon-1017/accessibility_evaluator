# Fishbone Diagram Analysis: Web Accessibility Learning Challenges

Based on survey results from 45 IT students and 24 professionals, this document presents three fishbone diagrams identifying root causes of key problems in web accessibility education.

---

## Fishbone Diagram 1: Insufficient Practical Learning Resources

**Problem Statement:** 42.2% report lack of practical examples as their primary difficulty, and 26.7% lack hands-on checking tools, indicating a critical shortage of applied learning resources.

```
                    Environment                                    People
                         |                                            |
                         |                                            |
    No dedicated         |                        Unfamiliar with     |
    accessibility  ──────┤                        accessibility  ────┤
    lab/tools            |                        concepts (26.7%)    |
                         |                                            |
    Limited classroom    |                        Instructors lack    |
    discussion     ──────┤                        practical      ────┤
    (40%)                |                        expertise           |
                         |                                            |
                         └────────────┐                  ┌────────────┘
                                      │                  │
                                      ▼                  ▼
                                      ●──────────────────────────► INSUFFICIENT
                                      ▲                  ▲          PRACTICAL LEARNING
                         ┌────────────┘                  └────────────┐ RESOURCES
                         |                                            |
    No automated         |                        No standardized     |
    checking tools ──────┤                        examples aligned ──┤
    available (26.7%)    |                        with WCAG           |
                         |                                            |
    Lack of practical    |                        Guidelines too      |
    examples       ──────┤                        abstract/complex ──┤
    (42.2% - highest)    |                        (24.4%)             |
                         |                                            |
                      Process                                  Standardization
```

### Root Causes:
1. **Environment Issues**
   - No dedicated accessibility testing lab or tools
   - Limited classroom discussion time (40%)
   
2. **People Factors**
   - 26.7% unfamiliar with basic accessibility concepts
   - Instructors lack practical implementation expertise
   
3. **Process Gaps**
   - No automated checking tools available (26.7% report this need)
   - Lack of practical examples (42.2% - highest reported difficulty)
   
4. **Standardization Problems**
   - No standardized examples aligned with WCAG criteria
   - Guidelines presented in abstract/complex manner (24.4%)

---

## Fishbone Diagram 2: Inadequate Step-by-Step Instructional Guidance

**Problem Statement:** 77.8% want step-by-step explanations (highest demand), yet current training lacks structured, progressive guidance, contributing to low confidence levels.

```
                    Environment                                    People
                         |                                            |
                         |                                            |
    No interactive       |                        Students lack       |
    learning       ──────┤                        foundational   ────┤
    platform             |                        knowledge           |
                         |                                            |
    Limited access to    |                        Instructors use    |
    tutorials/guides ────┤                        complex        ────┤
                         |                        terminology         |
                         |                                            |
                         └────────────┐                  ┌────────────┘
                                      │                  │
                                      ▼                  ▼
                                      ●──────────────────────────► INADEQUATE
                                      ▲                  ▲          STEP-BY-STEP
                         ┌────────────┘                  └────────────┐ INSTRUCTIONAL
                         |                                            | GUIDANCE
    No progressive       |                        No standardized     |
    learning path  ──────┤                        curriculum     ────┤
    structure            |                        framework           |
                         |                                            |
    Missing step-by-     |                        Guidelines not     |
    step tutorials ──────┤                        broken into    ────┤
    (77.8% want)         |                        short lessons       |
                         |                                            |
                      Process                                  Standardization
```

### Root Causes:
1. **Environment Issues**
   - No interactive learning platform for guided practice
   - Limited access to structured tutorials and guides
   
2. **People Factors**
   - Students lack foundational knowledge to understand complex concepts
   - Instructors use complex terminology without scaffolding
   
3. **Process Gaps**
   - No progressive learning path structure
   - Missing step-by-step tutorials (77.8% demand - highest priority)
   
4. **Standardization Problems**
   - No standardized curriculum framework
   - Guidelines not broken into short, digestible lessons (20 respondents want this)

---

## Fishbone Diagram 3: Lack of Real-Time Feedback Mechanisms

**Problem Statement:** 35.6% want feedback on their code, 33.3% want automated checking, and 18 respondents want instant error feedback, yet current systems provide no real-time validation.

```
                    Environment                                    People
                         |                                            |
                         |                                            |
    No accessibility     |                        Students cannot     |
    testing tools  ──────┤                        self-assess    ────┤
    integrated           |                        their work          |
                         |                                            |
    Manual checking      |                        Instructors cannot  |
    is time-        ──────┤                        provide timely ────┤
    consuming            |                        individual feedback |
                         |                                            |
                         └────────────┐                  ┌────────────┘
                                      │                  │
                                      ▼                  ▼
                                      ●──────────────────────────► LACK OF REAL-TIME
                                      ▲                  ▲          FEEDBACK
                         ┌────────────┘                  └────────────┐ MECHANISMS
                         |                                            |
    No automated         |                        No standardized     |
    validation      ──────┤                        error messages ────┤
    during coding        |                        or corrections      |
                         |                                            |
    Missing instant      |                        No benchmark for    |
    feedback on     ──────┤                        correct        ────┤
    errors (18 want)     |                        implementation      |
                         |                                            |
                      Process                                  Standardization
```

### Root Causes:
1. **Environment Issues**
   - No accessibility testing tools integrated into learning environment
   - Manual checking is time-consuming and inefficient
   
2. **People Factors**
   - Students cannot self-assess their work without tools
   - Instructors cannot provide timely individual feedback at scale
   
3. **Process Gaps**
   - No automated validation during coding process
   - Missing instant feedback on errors (18 respondents want this)
   
4. **Standardization Problems**
   - No standardized error messages or correction guidance
   - No benchmark examples for correct implementation

---

## Key Insights Summary

### Most Critical Problems (by survey data):

1. **Lack of Practical Examples** (42.2% report as difficulty)
   - Highest reported learning difficulty
   - Directly correlates with low confidence levels

2. **Need for Step-by-Step Explanations** (77.8% want this)
   - Highest demand for learning feature
   - Currently missing from most training

3. **Limited Classroom Discussion** (40% report as difficulty)
   - Indicates accessibility is not prioritized in curriculum

### Recommended System Features (by priority):

Based on survey responses, the system should include:

1. **Tutorials on accessibility guidelines** (36 respondents)
2. **Practice exercises** (33 respondents)
3. **Simple language explanations** (37.8% want)
4. **Examples aligned with WCAG criteria** (20 respondents)
5. **Short lessons per accessibility rule** (20 respondents)
6. **Instant feedback on errors** (18 respondents)
7. **Automated accessibility checking** (33.3% want)

### Positive Finding:

- **96% agree or strongly agree** that learning web accessibility will make them better developers
- This shows high motivation despite current learning challenges
- Indicates strong potential for adoption of improved learning tools

---

## Conclusion

The fishbone analysis reveals that the core problem is not lack of interest or motivation, but rather **systemic gaps in how web accessibility is taught and practiced**. The solution requires:

1. **Practical, hands-on learning tools** with real-time feedback
2. **Step-by-step guidance** with simple language
3. **Concrete examples** comparing accessible vs non-accessible implementations
4. **Automated checking tools** integrated into the learning process
5. **Progressive curriculum design** that builds confidence through practice

These findings should guide the development of an effective web accessibility education system.
