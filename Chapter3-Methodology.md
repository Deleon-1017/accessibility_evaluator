# CHAPTER 3: METHODOLOGY

## Requirements Analysis

The researcher began by identifying the challenges with the current method of teaching web accessibility in the Department of Information Technology at Cavite State University. Currently, the instruction of web accessibility relies primarily on theoretical discussion without adequate hands-on tools or practical examples. Students and instructors face difficulties in understanding and applying complex WCAG 2.1 guidelines due to the lack of simplified, educational evaluation tools. Therefore, the researcher proposed the development of a Web-Based Accessibility Evaluation Tool that utilizes automated checking and plain-language feedback to enhance the learning experience, providing real-time accessibility evaluation and allowing students to easily understand and fix accessibility issues.

The title was first proposed to the adviser and approved. After approval, the researcher drafted performed a data gathering from 45 Information Technology students within the College of Engineering and Information Technology and 24 web development professionals that answered through Google Forms.

The survey instrument consisted of multiple-choice and Likert-scale questions designed to assess awareness of web accessibility concepts, formal education received in accessible design, confidence levels in implementing accessibility features, specific barriers encountered in learning accessibility, preferred learning approaches, and desired system features for accessibility education. Data was collected, tabulated, and analyzed to inform the functional and non-functional requirements of the proposed system.

Based on the gathered data, the researcher identified significant gaps in web accessibility education and implementation. The survey data revealed that while 64% of Information Technology students have heard of web accessibility, only 38% have been formally taught how to design accessible websites. This substantial gap between awareness and formal education indicates that students are encountering accessibility concepts informally without structured pedagogical support. Furthermore, over 75% of students lack strong confidence in their ability to implement accessibility features, underscoring a significant gap between awareness and practical competency. The data also showed that students expressed a clear recognition of the professional value of accessibility competencies despite current barriers to acquiring them, with 25 out of 45 students agreeing or strongly agreeing that learning web accessibility would make them better web developers.

To address these challenges, this study proposes the development of a Web-Based Accessibility Evaluation Tool for Inclusive Web Design. The primary objective of this study is to improve the teaching and learning of web accessibility by providing a user-friendly platform for students and instructors to evaluate websites against WCAG 2.1 standards. The proposed system will be designed to simplify accessibility concepts, deliver plain-language feedback, and offer educational content such as tutorials and before/after examples, ensuring an efficient and educational experience for both learners and instructors.



### Functional Requirements

The functional requirements of this project serve as a roadmap for the development process, ensuring the creation of a system that is both effective and user-friendly. These requirements provide the basis for evaluating the system's performance during testing and validation phases, guaranteeing that it meets user expectations and aligns with educational objectives.

**Table 1. Functions of the Proposed System**

| **Main Functions** | **Description** |
|---|---|
| **URL-Based Scanning Module** | Accepts website URLs as input and retrieves the HTML content for accessibility evaluation. Validates URL format and handles connection errors gracefully. |
| **HTML Code Input Module** | Allows users to directly paste HTML code for local evaluation without requiring a live website. Supports educational scenarios where students are developing code locally. |
| **WCAG 2.1 Evaluation Engine** | Analyzes web content against selected WCAG 2.1 Level A and AA success criteria. Identifies violations related to the four POUR principles: Perceivable, Operable, Understandable, and Robust. |
| **Issue Detection and Classification Module** | Detects common accessibility barriers including missing alternative text, insufficient color contrast, improper heading structures, unlabeled form elements, missing page language attributes, and broken keyboard navigation. Classifies issues by severity (Error, Warning, Info). |
| **Plain-Language Feedback Generation Module** | Provides clear, educational explanations for each detected issue. Translates technical WCAG criteria into simple language suitable for beginners. Offers actionable recommendations on how to fix each issue. |
| **Educational Content Module** | Delivers tutorials on accessibility guidelines organized by WCAG principle. Provides before-and-after examples demonstrating accessible versus non-accessible design. Includes short lessons explaining individual accessibility rules. |
| **Results Visualization and Reporting Module** | Displays scan results in an organized, user-friendly format. Presents accessibility score with visual feedback. Categorizes issues by type, WCAG criterion, and principle. Provides "How to Fix" guidance for each issue. |
| **WCAG Guidelines Reference Module** | Offers comprehensive information about WCAG 2.1 guidelines. Displays guideline details including principle, level, description, techniques, and user groups who benefit. Supports educational exploration of accessibility standards. |
| **Web Accessibility Awareness Assessment Module** | Provides an interactive 40-question quiz distributed equally across the four WCAG principles (Perceivable, Operable, Understandable, Robust). Tests users' understanding through multiple-choice questions including practical code scenarios. Features principle-based navigation with color-coded tabs, real-time progress tracking, and pre-submission review interface. Generates comprehensive results showing overall score, performance by principle, awareness level classification (Unaware, Developing Awareness, Aware), personalized recommendations for weak areas, and detailed answer reviews with explanations. Supports iterative learning through retake functionality. |



### Context Diagram

The context diagram below illustrates the high-level interaction between the system and its external entities.

```
                           ┌──────────────────┐
                           │                  │
                           │      User        │
                           │  (Students &     │
                           │  Instructors)    │
                           │                  │
                           └────────┬─────────┘
                                    │
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              │  Submit URL/        │  View Results       │
              │  HTML Code          │  Access Tutorials   │
              │                     │                     │
              ▼                     ▼                     ▼
    ┌─────────────────────────────────────────────────────────┐
    │                                                         │
    │                                                         │
    │         WEB-BASED ACCESSIBILITY EVALUATION TOOL         │
    │                                                         │
    │   • Scan websites for WCAG 2.1 compliance              │
    │   • Analyze HTML code structure                        │
    │   • Detect accessibility violations                    │
    │   • Generate plain-language feedback                   │
    │   • Provide educational content                        │
    │   • Display WCAG guidelines reference                  │
    │                                                         │
    │                                                         │
    └──────────┬─────────────────────────────┬────────────────┘
               │                             │
               │                             │
               │  Retrieve WCAG              │  Fetch Web
               │  Criteria & Store           │  Content
               │  Scan Results               │
               │                             │
               ▼                             ▼
    ┌──────────────────┐          ┌──────────────────┐
    │                  │          │                  │
    │    Database      │          │   External Web   │
    │    (MySQL)       │          │      Pages       │
    │                  │          │                  │
    └──────────────────┘          └──────────────────┘
               │
               │  WCAG Guidelines
               │  Scan History
               │  Educational Content
               │
               ▼
    ┌──────────────────┐
    │                  │
    │  Accessibility   │
    │     Results      │
    │                  │
    └──────────────────┘
```

**Figure 1. Context Diagram of the Web-Based Accessibility Evaluation Tool**

The context diagram illustrates the high-level architecture and interaction flow between the Web-Based Accessibility Evaluation Tool and its external entities. This diagram provides a comprehensive view of how the system operates within its environment and how data flows between different components.

At the top of the diagram, the **User** entity represents the primary actors who interact with the system—specifically, Information Technology students and instructors from Cavite State University. These users serve as both the input source and the output recipient of the system. Users initiate the evaluation process by providing input through two distinct methods: submitting a website URL for remote scanning or pasting HTML code directly for local evaluation. This dual-input approach addresses different learning scenarios, allowing students to evaluate both live websites and code they are actively developing. After the system completes its evaluation, users receive comprehensive accessibility results, access educational tutorials explaining WCAG principles, and obtain actionable recommendations for fixing detected issues.

The central component, the **Web-Based Accessibility Evaluation Tool**, represents the core system that performs all accessibility evaluation functions. This system acts as the processing hub that orchestrates multiple operations including scanning websites for WCAG 2.1 compliance, analyzing HTML code structure to identify elements requiring accessibility checks, detecting accessibility violations across multiple criteria, generating plain-language feedback that translates technical WCAG terminology into beginner-friendly explanations, providing educational content to support learning, administering interactive assessments to measure web accessibility knowledge, and displaying comprehensive WCAG guidelines reference materials. The system is designed with an educational focus, ensuring that all outputs prioritize learning and understanding over mere technical reporting.

The **Database (MySQL)** entity, positioned at the bottom left of the diagram, serves as the persistent storage layer for the system. The database maintains critical information required for system operation and historical tracking. It stores complete WCAG 2.1 criteria definitions including success criteria, conformance levels, and principle classifications. Additionally, it houses implementation techniques that provide guidance on how to meet each criterion, before-and-after code examples demonstrating accessible versus non-accessible implementations, user group information identifying who benefits from each accessibility feature, and scan history containing all previous evaluation results for tracking and analysis purposes. The bidirectional data flow between the system and database indicates that the system both retrieves WCAG criteria for evaluation purposes and stores scan results for future reference.

The **External Web Pages** entity, shown at the bottom right, represents websites hosted on external servers that users wish to evaluate. When a user submits a website URL, the system fetches the web content from these external sources over the internet. This interaction enables the system to perform real-world accessibility evaluations on live websites, allowing students to analyze existing web pages and learn from both good and poor accessibility practices found in production environments. The system retrieves the HTML content, stylesheets, and relevant page attributes necessary for comprehensive accessibility analysis.

The **Accessibility Results** entity at the bottom represents the final output generated by the system after completing an evaluation. These results encompass detailed findings including identified accessibility violations categorized by severity (errors, warnings, and informational notices), WCAG guideline references linking each issue to specific success criteria, principle classifications organizing issues under the POUR framework (Perceivable, Operable, Understandable, Robust), plain-language descriptions explaining what each issue means in simple terms, and actionable "How to Fix" recommendations providing step-by-step guidance for resolving each violation. This output is specifically designed to support the educational objectives of the system by making accessibility concepts understandable and actionable for students.

The data flow arrows in the diagram illustrate the sequence and direction of information exchange. Input flows downward from users to the system, processing occurs within the central system component with bidirectional communication to the database and external web pages, and output flows back upward to users in the form of comprehensive accessibility results and educational content. This flow represents a complete evaluation cycle from user input through processing to educational output, supporting the iterative learning process where students can repeatedly scan, learn, and improve their web accessibility implementations.

This context diagram establishes the system boundary and clarifies which components are internal to the Web-Based Accessibility Evaluation Tool and which are external entities. It demonstrates that the system operates as an intermediary that bridges the gap between users seeking to learn web accessibility, authoritative WCAG guidelines stored in the database, and real-world web content requiring evaluation. By visualizing these relationships, the diagram provides stakeholders with a clear understanding of the system's role within the educational environment and its interactions with external resources necessary for effective accessibility education.



### Use Case Diagram

The use case diagram illustrates the functional interactions between users and the system, including the relationships between use cases using <<include>> and <<extend>> notations.

```
    ┌──────────┐
    │          │
    │   User   │
    │(Student/ │
    │Instructor)│
    │          │
    └────┬─────┘
         │
         │
    ┌────┴──────────────────────────────────────────────────────────────┐
    │                                                                    │
    │              ACCESSIBILITY EVALUATION SYSTEM                       │
    │                                                                    │
    │    ┌──────────────────┐              ┌──────────────────┐         │
    │    │  Submit Website  │              │  Submit HTML     │         │
    │◄───┤      URL         │              │      Code        │───────► │
    │    └────────┬─────────┘              └────────┬─────────┘         │
    │             │                                 │                   │
    │             │                                 │                   │
    │             └────────────┬────────────────────┘                   │
    │                          │                                        │
    │                          │ <<include>>                            │
    │                          ▼                                        │
    │                 ┌─────────────────┐                               │
    │                 │  Validate Input │                               │
    │                 └────────┬────────┘                               │
    │                          │                                        │
    │                          │ <<include>>                            │
    │                          ▼                                        │
    │                 ┌─────────────────┐                               │
    │                 │  Retrieve/Parse │                               │
    │                 │   HTML Content  │                               │
    │                 └────────┬────────┘                               │
    │                          │                                        │
    │                          │ <<include>>                            │
    │                          ▼                                        │
    │                 ┌─────────────────┐                               │
    │                 │  Perform WCAG   │                               │
    │                 │   Evaluation    │                               │
    │                 └────────┬────────┘                               │
    │                          │                                        │
    │                          │ <<include>>                            │
    │                          ▼                                        │
    │                 ┌─────────────────┐                               │
    │                 │ Generate Report │                               │
    │                 └────────┬────────┘                               │
    │                          │                                        │
    │                          ▼                                        │
    │    ┌────────────────────────────────────────┐                     │
    │    │        View Scan Results               │                     │
    │◄───┤                                        │                     │
    │    └────────────┬───────────────────────────┘                     │
    │                 │                                                 │
    │                 │ <<extend>>                                      │
    │                 │                                                 │
    │                 ├──────────► ┌──────────────────────┐             │
    │                 │            │  Filter Results by   │             │
    │                 │            │  Severity/Principle  │             │
    │                 │            └──────────────────────┘             │
    │                 │                                                 │
    │                 │ <<extend>>                                      │
    │                 │                                                 │
    │                 └──────────► ┌──────────────────────┐             │
    │                              │  Export Results to   │             │
    │                              │       PDF/CSV        │             │
    │                              └──────────────────────┘             │
    │                                                                    │
    │    ┌──────────────────┐                                           │
    │    │  View WCAG       │                                           │
    │◄───┤  Guidelines      │                                           │
    │    └────────┬─────────┘                                           │
    │             │                                                     │
    │             │ <<include>>                                         │
    │             │                                                     │
    │             └──────────► ┌──────────────────────┐                 │
    │                          │  Browse Guidelines   │                 │
    │                          │   by Principle       │                 │
    │                          └──────────────────────┘                 │
    │                                                                    │
    │    ┌──────────────────┐                                           │
    │    │  Access          │                                           │
    │◄───┤  Educational     │                                           │
    │    │  Content         │                                           │
    │    └────────┬─────────┘                                           │
    │             │                                                     │
    │             │ <<extend>>                                          │
    │             │                                                     │
    │             ├──────────► ┌──────────────────────┐                 │
    │             │            │  View Before/After   │                 │
    │             │            │     Examples         │                 │
    │             │            └──────────────────────┘                 │
    │             │                                                     │
    │             │ <<extend>>                                          │
    │             │                                                     │
    │             └──────────► ┌──────────────────────┐                 │
    │                          │  View Tutorial       │                 │
    │                          │     Videos           │                 │
    │                          └──────────────────────┘                 │
    │                                                                    │
    │    ┌──────────────────┐                                           │
    │    │  Get Fix         │                                           │
    │◄───┤  Recommendations │                                           │
    │    │                  │                                           │
    │    └──────────────────┘                                           │
    │                                                                    │
    └────────────────────────────────────────────────────────────────────┘
```

**Figure 2. Use Case Diagram of the Web-Based Accessibility Evaluation Tool**

The use case diagram illustrates the functional interactions between users and the Web-Based Accessibility Evaluation Tool, depicting the primary use cases, their relationships, and the flow of operations within the system. The diagram employs standard UML notation including <<extend>> and <<include>> relationships to represent optional and mandatory dependencies between use cases.

**Actor:**

The primary actor in this system is the **User**, represented by the stick figure on the left side of the diagram. This actor encompasses both Information Technology students and instructors from Cavite State University who interact with the system to evaluate web accessibility and learn about WCAG 2.1 guidelines. The user initiates all primary use cases and receives outputs from the system's evaluation processes.

**Core Use Case: Evaluate Web Content**

At the center of the diagram is the **Evaluate Web Content** use case, which serves as the primary functionality of the system. This central use case represents the complete process of analyzing web content for accessibility compliance. It acts as the hub that connects to other use cases through various relationships, demonstrating how the evaluation process can be initiated through different input methods and how it produces multiple types of outputs for user consumption.

**Input Methods (<<extend>> relationships):**

The diagram shows two alternative input methods that extend the core evaluation functionality:

1. **Submit Website URL** - This use case extends "Evaluate Web Content" through an <<extend>> relationship, indicated by the dashed arrow. This relationship signifies that submitting a URL is one optional way to initiate the evaluation process. When users choose this method, they provide a live website address, and the system fetches the web content from external servers for analysis. This approach is particularly useful for evaluating existing, deployed websites and learning from real-world examples of both accessible and inaccessible web design.

2. **Paste HTML Code** - This use case also extends "Evaluate Web Content" through an <<extend>> relationship. This alternative input method allows users to directly paste HTML code into the system for local evaluation without requiring a live website. This option is especially valuable in educational scenarios where students are actively developing code and want immediate feedback on their accessibility implementations before deployment. The <<extend>> relationship indicates that this is another optional path to trigger the evaluation process.

The use of <<extend>> for both input methods is appropriate because these represent alternative ways to provide content for evaluation—users must choose one method or the other, but both ultimately lead to the same evaluation process.

**Output and Result Viewing:**

Following the evaluation process, the diagram shows two primary output-related use cases:

1. **View Accessibility Result** - Connected to "Evaluate Web Content" through a direct association line, this use case represents the user's ability to review the evaluation findings. The diagram shows an <<include>> relationship with **Generate Evaluation**, indicated by the dashed arrow pointing from "View Accessibility Result" to "Generate Evaluation." This <<include>> relationship is crucial because it signifies that generating the evaluation report is a mandatory, integral part of viewing results—users cannot view results without the system first generating them. The evaluation generation process compiles all detected issues, calculates accessibility scores, categorizes violations by severity and WCAG principle, and formats the information into a user-friendly presentation.

2. **View WCAG 2.1 Guidelines** - This use case allows users to explore the Web Content Accessibility Guidelines that form the foundation of the evaluation criteria. This educational feature helps users understand the standards against which their content is being evaluated.

**Educational Content Structure:**

The diagram illustrates a sophisticated educational content delivery system through the **View WCAG 2.1 Guidelines** use case and its related components:

1. **Browse Guidelines by Principle** - Connected to "View WCAG 2.1 Guidelines" through an <<include>> relationship, this use case represents the mandatory organizational structure of the guidelines. The <<include>> relationship indicates that browsing by principle (Perceivable, Operable, Understandable, Robust) is an essential part of viewing WCAG guidelines—the system always presents guidelines organized according to the POUR framework to facilitate systematic learning and understanding.

2. **Access Educational Content** - This use case extends from "View WCAG 2.1 Guidelines" through an <<extend>> relationship (shown by the dashed arrow), indicating that accessing additional educational materials is an optional enhancement to the basic guideline viewing functionality. Users can choose to delve deeper into educational resources beyond the standard guideline descriptions.

**Educational Content Components:**

The "Access Educational Content" use case branches into two specific educational features, both connected through solid arrows indicating direct associations:

1. **Inaccessible vs. Accessible Examples** - This component provides before-and-after code comparisons that demonstrate the difference between non-compliant and compliant implementations. By showing concrete examples of both problematic and corrected code, this feature helps students understand not just what is wrong, but how to fix it. This visual comparison approach addresses the learning preference identified in the requirements analysis, where students indicated that practical examples significantly enhance their understanding of accessibility concepts.

2. **Plain-Language Explanation** - This component delivers simplified, beginner-friendly explanations of complex WCAG terminology and technical concepts. Rather than presenting guidelines in formal, technical language, the system translates accessibility requirements into clear, understandable terms suitable for students who are new to web accessibility. This addresses the identified barrier where students found WCAG guidelines too complex and technical to understand without additional support.

**Relationship Interpretation:**

The strategic use of <<include>> and <<extend>> relationships in this diagram reveals important architectural decisions:

- **<<extend>> relationships** (Submit Website URL, Paste HTML Code, Access Educational Content) represent optional features that enhance the base functionality but are not required for basic operation. Users have flexibility in how they interact with these features based on their specific needs and learning contexts.

- **<<include>> relationships** (Generate Evaluation, Browse Guidelines by Principle) represent mandatory sub-processes that must always execute as part of the parent use case. These ensure consistent system behavior and guarantee that essential steps are never skipped.

**System Flow and User Journey:**

The diagram illustrates a complete user journey through the system:

1. The user begins by choosing an input method (Submit Website URL or Paste HTML Code) to initiate the evaluation process
2. The system performs the "Evaluate Web Content" operation, analyzing the provided content against WCAG 2.1 criteria
3. The system automatically generates an evaluation report (mandatory <<include>> relationship)
4. The user views the accessibility results, which include detected issues, severity classifications, and fix recommendations
5. Optionally, the user can explore WCAG 2.1 Guidelines to understand the standards
6. When viewing guidelines, the system organizes them by POUR principles (mandatory <<include>> relationship)
7. Optionally, the user can access additional educational content including code examples and plain-language explanations

**Educational Design Rationale:**

The structure of this use case diagram reflects the educational objectives of the system. By providing multiple pathways for learning (evaluation results, guideline exploration, examples, and explanations), the system accommodates different learning styles and preferences identified in the requirements analysis. The mandatory inclusion of organized guideline browsing ensures that students always encounter accessibility concepts in a structured, pedagogically sound manner, while the optional educational content allows motivated learners to explore topics more deeply.

**System Boundary and Scope:**

The system boundary, represented by the rectangle encompassing all use cases, clearly delineates what functionality is within the scope of the Web-Based Accessibility Evaluation Tool. All interactions between the user and the system occur through these defined use cases, providing a complete picture of the system's capabilities and the services it offers to support web accessibility education.

This use case diagram effectively communicates the functional requirements of the system, the relationships between different features, and the flexibility provided to users in how they interact with the tool. It serves as a blueprint for development, ensuring that all essential functionality is implemented while maintaining clear distinctions between mandatory and optional features.

**Primary Use Cases:**
1. **Evaluate Web Content**: Core functionality that analyzes web content for WCAG 2.1 compliance
2. **Submit Website URL**: User provides a website URL for accessibility scanning (extends Evaluate Web Content)
3. **Paste HTML Code**: User pastes HTML code directly for local evaluation (extends Evaluate Web Content)
4. **View Accessibility Result**: User reviews detected accessibility issues with detailed information
5. **View WCAG 2.1 Guidelines**: User explores accessibility standards and principles
6. **Access Educational Content**: User learns about accessibility through various educational materials (extends View WCAG 2.1 Guidelines)
7. **Take Web Accessibility Awareness Assessment**: User tests their understanding of WCAG 2.1 principles through an interactive 40-question quiz distributed across the four WCAG principles
8. **Review Assessment Results**: User views comprehensive results including overall score, performance by principle, awareness level classification, personalized recommendations, and detailed answer explanations (included in Take Web Accessibility Awareness Assessment)

**Included Use Cases (<<include>>):**
- **Generate Evaluation**: Mandatory step that compiles evaluation findings into a structured report (included in View Accessibility Result)
- **Browse Guidelines by Principle**: Organizes WCAG guidelines by POUR principles for systematic learning (included in View WCAG 2.1 Guidelines)

**Extended Use Cases (<<extend>>):**
- **Submit Website URL**: Optional input method for evaluating live websites (extends Evaluate Web Content)
- **Paste HTML Code**: Optional input method for evaluating local HTML code (extends Evaluate Web Content)
- **Access Educational Content**: Optional feature providing additional learning resources (extends View WCAG 2.1 Guidelines)

**Educational Content Components:**
- **Inaccessible vs. Accessible Examples**: Before-and-after code comparisons demonstrating proper accessibility implementation
- **Plain-Language Explanation**: Simplified explanations of WCAG concepts suitable for beginners

The <<include>> relationships represent mandatory steps that must always be executed as part of the base use case, ensuring consistent system behavior and complete functionality. The <<extend>> relationships represent optional features that enhance the base use case functionality but are not required for basic operation, providing flexibility for different user needs and learning preferences.



### Data Flow Diagram (Level 0)

The Level 0 Data Flow Diagram provides an overview of the major processes and data flows within the system.

```
                                    ┌──────────────┐
                                    │              │
                                    │     User     │
                                    │              │
                                    └───┬──────┬───┘
                                        │      │
                        URL/HTML Code   │      │   Accessibility Report
                                        │      │   Educational Content
                                        ▼      ▼
                            ┌───────────────────────────┐
                            │                           │
                            │   Process 1.0             │
                            │   Receive Input           │
                            │                           │
                            └───────────┬───────────────┘
                                        │
                                        │ Validated Input
                                        ▼
                            ┌───────────────────────────┐
                            │                           │
                            │   Process 2.0             │
                            │   Retrieve/Parse HTML     │
                            │                           │
                            └───────────┬───────────────┘
                                        │
                                        │ Parsed HTML
                                        ▼
                            ┌───────────────────────────┐
                            │                           │
                            │   Process 3.0             │
                            │   Evaluate Accessibility  │
                            │                           │
                            └───────────┬───────────────┘
                                        │
                                        │ Detected Issues
                                        ▼
                            ┌───────────────────────────┐
                            │                           │
                            │   Process 4.0             │
                            │   Generate Feedback       │
                            │                           │
                            └───────────┬───────────────┘
                                        │
                                        │ Report Data
                                        ▼
                            ┌───────────────────────────┐
                            │                           │
                            │   Process 5.0             │
                            │   Display Results         │
                            │                           │
                            └───────────────────────────┘
                                        │
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
                    ▼                   ▼                   ▼
            ┌──────────────┐    ┌──────────────┐   ┌──────────────┐
            │              │    │              │   │              │
            │  D1: WCAG    │    │  D2: Scan    │   │  D3: User    │
            │  Criteria    │    │  Results     │   │  Guidelines  │
            │              │    │              │   │              │
            └──────────────┘    └──────────────┘   └──────────────┘
```

**Figure 3. Level 0 Data Flow Diagram**

The Level 0 DFD shows the main processes:
- **Process 1.0 - Receive Input**: Accepts and validates user input (URL or HTML code)
- **Process 2.0 - Retrieve/Parse HTML**: Fetches web content or processes pasted HTML
- **Process 3.0 - Evaluate Accessibility**: Checks content against WCAG 2.1 criteria
- **Process 4.0 - Generate Feedback**: Creates plain-language explanations and recommendations
- **Process 5.0 - Display Results**: Presents findings in user-friendly format

Data Stores:
- **D1: WCAG Criteria**: Database containing accessibility guidelines and success criteria
- **D2: Scan Results**: Storage for evaluation history and findings
- **D3: User Guidelines**: Educational content, tutorials, and examples



### Activity Diagram

The activity diagram illustrates the workflow of the accessibility evaluation process from user input to result display.

```
                        ┌─────────┐
                        │  Start  │
                        └────┬────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ User Accesses  │
                    │ Home Page      │
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Choose Input   │
                    │ Method         │
                    └────┬───────┬───┘
                         │       │
              Website URL│       │HTML Code
                         │       │
                         ▼       ▼
            ┌──────────────┐  ┌──────────────┐
            │ Enter URL    │  │ Paste HTML   │
            │              │  │ Code         │
            └──────┬───────┘  └──────┬───────┘
                   │                 │
                   │                 │
                   └────────┬────────┘
                            │
                            ▼
                   ┌────────────────┐
                   │ Validate Input │
                   └────────┬───────┘
                            │
                    ┌───────┴───────┐
                    │               │
              Valid │               │ Invalid
                    │               │
                    ▼               ▼
        ┌──────────────────┐  ┌──────────────┐
        │ Retrieve/Parse   │  │ Display      │
        │ HTML Content     │  │ Error        │
        └──────┬───────────┘  └──────┬───────┘
               │                     │
               │                     │
               ▼                     │
        ┌──────────────────┐        │
        │ Initialize       │        │
        │ Accessibility    │        │
        │ Checks           │        │
        └──────┬───────────┘        │
               │                     │
               ▼                     │
        ┌──────────────────┐        │
        │ Check Images     │        │
        │ (Alt Text)       │        │
        └──────┬───────────┘        │
               │                     │
               ▼                     │
        ┌──────────────────┐        │
        │ Check Headings   │        │
        │ (Structure)      │        │
        └──────┬───────────┘        │
               │                     │
               ▼                     │
        ┌──────────────────┐        │
        │ Check Forms      │        │
        │ (Labels)         │        │
        └──────┬───────────┘        │
               │                     │
               ▼                     │
        ┌──────────────────┐        │
        │ Check Links      │        │
        │ (Descriptive)    │        │
        └──────┬───────────┘        │
               │                     │
               ▼                     │
        ┌──────────────────┐        │
        │ Check Page       │        │
        │ Attributes       │        │
        └──────┬───────────┘        │
               │                     │
               ▼                     │
        ┌──────────────────┐        │
        │ Check Color      │        │
        │ Contrast         │        │
        └──────┬───────────┘        │
               │                     │
               ▼                     │
        ┌──────────────────┐        │
        │ Compile Results  │        │
        └──────┬───────────┘        │
               │                     │
               ▼                     │
        ┌──────────────────┐        │
        │ Calculate        │        │
        │ Accessibility    │        │
        │ Score            │        │
        └──────┬───────────┘        │
               │                     │
               ▼                     │
        ┌──────────────────┐        │
        │ Generate         │        │
        │ Plain-Language   │        │
        │ Feedback         │        │
        └──────┬───────────┘        │
               │                     │
               ▼                     │
        ┌──────────────────┐        │
        │ Store Results    │        │
        │ in Database      │        │
        └──────┬───────────┘        │
               │                     │
               ▼                     │
        ┌──────────────────┐        │
        │ Display Results  │◄───────┘
        │ Page             │
        └──────┬───────────┘
               │
               ▼
        ┌──────────────────┐
        │ User Reviews     │
        │ Issues & Fixes   │
        └──────┬───────────┘
               │
               ▼
        ┌──────────────────┐
        │ Access WCAG      │
        │ Guidelines       │
        │ (Optional)       │
        └──────┬───────────┘
               │
               ▼
          ┌─────────┐
          │   End   │
          └─────────┘
```

**Figure 4. Activity Diagram of the Accessibility Evaluation Process**

The activity diagram demonstrates the sequential flow of operations from user input through evaluation to result presentation, including decision points for input validation and multiple accessibility checks performed on the web content.



### Non-Functional Requirements

The non-functional requirements define the quality attributes and constraints that ensure the system is effective, user-friendly, and suitable for educational purposes.

**Table 2. Features of the Proposed System**

| **Main Features** | **Description** |
|---|---|
| **Educational** | Designed specifically for learning environments with simplified explanations, tutorials, and examples that make complex WCAG concepts accessible to beginners and students. |
| **User-Friendly** | Intuitive interface with clear navigation, minimal technical jargon, and straightforward workflows that require no prior expertise in accessibility testing. |
| **Lightweight** | Locally deployable with minimal server requirements, using PHP and MySQL without heavy dependencies or complex infrastructure needs. |
| **Accurate** | Implements reliable detection algorithms for common accessibility issues based on established WCAG 2.1 Level A and AA success criteria. |
| **Responsive** | Provides timely feedback with reasonable processing times for typical web pages, ensuring smooth user experience during evaluation. |
| **Accessible** | The tool itself follows accessibility best practices, ensuring it can be used by individuals with disabilities, including keyboard navigation and screen reader compatibility. |
| **Scalable** | Database structure supports expansion to include additional WCAG criteria, techniques, and educational content as the system evolves. |
| **Maintainable** | Clean code architecture with clear documentation that facilitates future updates and modifications by developers. |



## System Design

In order to create a Web-Based Accessibility Evaluation Tool for Inclusive Web Design, the researcher conducted planning and requirement analysis by gathering functional and non-functional requirements from students, instructors, and web development professionals. This provided guidance on adding features for the accessibility evaluation tool, which includes automated WCAG 2.1 compliance checking, plain-language feedback generation, educational content delivery, comprehensive reporting, and an interactive assessment module for measuring web accessibility awareness. The researcher created wireframes that show a visual representation of the interfaces. Wireframes outline the structures of the given features that will help as a guide in creating the accessibility evaluation tool.

In the development phase, a database will be set up using XAMPP and MySQL to store WCAG criteria, scan results, educational content, and quiz questions for the assessment module. The platform will be developed as a web application, using HTML, CSS, and JavaScript for the frontend and PHP for backend functionalities.

**Figure 5. Wireframe of the Home Page**

This diagram represents the wireframe of the system's home page, providing an overview of how users will initially interact with the accessibility evaluation tool. It illustrates the arrangement of essential components, such as navigation menus, the accessibility scanner input area with dual options (Website URL and HTML Code), and quick access to WCAG guidelines. The home page serves as the central hub, ensuring users can efficiently navigate to key sections of the system. The wireframe highlights the user-friendly layout and prioritization of information to create an intuitive experience. By visualizing the home page, this diagram ensures the interface design supports both usability and functionality, meeting the needs of all users.

**Figure 6. Wireframe of the Scan Results Page**

This diagram illustrates the wireframe of the system's scan results page, which focuses on displaying all accessibility evaluation findings in a well-organized manner. The page is designed to provide users with easy access to detected issues, accessibility scores, and fix recommendations at a glance. The layout includes a scan summary card showing website information and scan details, a central accessibility score indicator with visual feedback, and a comprehensive issues table categorized by severity (Errors, Warnings, Info). Each issue entry includes the WCAG guideline reference, principle classification, issue description in plain language, and actionable "How to Fix" recommendations. By visualizing the results page, the diagram ensures that the content is structured and accessible, enhancing user experience and keeping users informed about accessibility violations in an efficient and educational way.

**Figure 7. Wireframe of the WCAG Guidelines Page - Guideline Detail View**

This diagram showcases the wireframe of the system's WCAG guidelines page, which is dedicated to presenting comprehensive educational content about WCAG 2.1 standards. It illustrates the arrangement of sections, including a left sidebar with collapsible navigation organized by POUR principles (Perceivable, Operable, Understandable, Robust), guideline titles with level indicators (A, AA, AAA), and detailed descriptions. The main content area displays guideline information including principle badges, level classifications, clear descriptions, before-and-after code examples demonstrating accessible versus non-accessible implementations, implementation techniques, and "Who Benefits From This" sections identifying user groups who benefit from each criterion. By visualizing this page, the diagram ensures that users can easily browse and learn about accessibility standards. The design aims to provide a clear and structured view, promoting understanding and application of WCAG guidelines among students and instructors.

**Figure 8. Wireframe of the WCAG Guidelines Page - Overview**

This diagram illustrates the wireframe of the WCAG 2.1 guidelines overview page, which is designed to introduce users to the Web Content Accessibility Guidelines and their conformance levels. It showcases the layout with a header explaining WCAG 2.1's purpose, followed by an "Understanding Conformance Levels" section featuring three cards that explain Level A (Essential Foundation), Level AA (Industry Standard), and Level AAA (Excellence Level). Each card provides a clear description of what the conformance level represents and its significance in web accessibility. By visualizing the overview page, the diagram emphasizes the importance of providing foundational knowledge about WCAG standards while ensuring users have a clear and accessible way to understand the different levels of compliance.

**Figure 8a. Wireframe of the Web Accessibility Awareness Assessment Page - Introduction View**

```
┌─────────────────────────────────────────────────────────────────────┐
│                           HEADER / NAVIGATION                       │
│  [Logo] Web Accessibility Evaluator                                 │
│  [Home] [WCAG Guidelines] [Assessment] [About]                      │
└─────────────────────────────────────────────────────────────────────┘
│                                                                     │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                                                               │ │
│  │   Web Accessibility Awareness Assessment                      │ │
│  │                                                               │ │
│  │   Test your understanding of WCAG 2.1 principles,            │ │
│  │   guidelines, and success criteria through practical         │ │
│  │   accessibility scenarios.                                   │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│                                                 ┌─────────────────┐ │
│                                                 │  [Start Quiz]   │ │
│                                                 └─────────────────┘ │
│                                                                     │
│                                                                     │
│                                                                     │
│                                                                     │
│                                                                     │
│                                                                     │
│                                                                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
│                                                                     │
│                          FOOTER                                     │
└─────────────────────────────────────────────────────────────────────┘
```

This diagram showcases the wireframe of the Web Accessibility Awareness Assessment introduction page, which serves as the entry point for students and instructors to test their understanding of WCAG 2.1 principles, guidelines, and success criteria through practical accessibility scenarios. The layout features a clear heading "Web Accessibility Awareness Assessment" followed by a descriptive subtitle explaining that users will test their understanding of WCAG 2.1 through practical scenarios. The page includes a prominent "Start Quiz" button positioned on the right side to initiate the assessment. This introduction view establishes the educational purpose of the assessment and provides users with clear expectations before beginning the quiz.

**Figure 8b. Wireframe of the Web Accessibility Awareness Assessment Page - Quiz Interface**

```
┌─────────────────────────────────────────────────────────────────────┐
│                           HEADER / NAVIGATION                       │
│  [Logo] Web Accessibility Evaluator                                 │
│  [Home] [WCAG Guidelines] [Assessment*] [About]                     │
└─────────────────────────────────────────────────────────────────────┘
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  QUIZ INTERFACE CARD                                        │   │
│  │                                                             │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │   │
│  │  │Perceiv-  │ │Operable* │ │Understand│ │ Robust   │      │   │
│  │  │able      │ │  (Active)│ │able      │ │          │      │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │   │
│  │                                                             │   │
│  │  ────────────────────────────────────────────────────────  │   │
│  │                                                             │   │
│  │  Question 15 of 40                              38%        │   │
│  │  [████████████████░░░░░░░░░░░░░░░░░░░░░░░░]               │   │
│  │                                                             │   │
│  │  ────────────────────────────────────────────────────────  │   │
│  │                                                             │   │
│  │  Which WCAG success criterion requires that all           │   │
│  │  functionality is available from a keyboard?               │   │
│  │                                                             │   │
│  │  ┌──────────────────────────────────────────────────────┐ │   │
│  │  │ // Code snippet example (if applicable)              │ │   │
│  │  │ <button onclick="handleClick()">                     │ │   │
│  │  │   Submit                                             │ │   │
│  │  │ </button>                                            │ │   │
│  │  └──────────────────────────────────────────────────────┘ │   │
│  │                                                             │   │
│  │  ┌──────────────────────────────────────────────────────┐ │   │
│  │  │ ○ A  Success Criterion 1.1.1 Non-text Content       │ │   │
│  │  └──────────────────────────────────────────────────────┘ │   │
│  │  ┌──────────────────────────────────────────────────────┐ │   │
│  │  │ ● B  Success Criterion 2.1.1 Keyboard (Selected)    │ │   │
│  │  └──────────────────────────────────────────────────────┘ │   │
│  │  ┌──────────────────────────────────────────────────────┐ │   │
│  │  │ ○ C  Success Criterion 3.2.1 On Focus               │ │   │
│  │  └──────────────────────────────────────────────────────┘ │   │
│  │  ┌──────────────────────────────────────────────────────┐ │   │
│  │  │ ○ D  Success Criterion 4.1.2 Name, Role, Value      │ │   │
│  │  └──────────────────────────────────────────────────────┘ │   │
│  │                                                             │   │
│  │  ┌──────────┐                           ┌──────────────┐  │   │
│  │  │[Previous]│                           │    [Next]    │  │   │
│  │  └──────────┘                           └──────────────┘  │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
│                          FOOTER                                     │
└─────────────────────────────────────────────────────────────────────┘
```

This diagram illustrates the wireframe of the active quiz interface where users answer questions about web accessibility. The interface is organized into several key components: at the top, principle tabs for the four WCAG principles (Perceivable, Operable, Understandable, Robust) allow users to see which principle they are currently being tested on, with active principle tabs visually highlighted using principle-specific colors. Below the tabs, a progress indicator displays the current question number (e.g., "Question 15 of 40"), percentage completion, and a visual progress bar showing overall quiz progress. The main content area presents the question text, which may include code snippets displayed in a dark-themed code block for enhanced readability when testing technical accessibility scenarios. Four multiple-choice options (A, B, C, D) are presented as selectable buttons with clear visual feedback for selected answers. Navigation buttons ("Previous" and "Next") are positioned at the bottom, with the "Next" button changing to "Review Answers" on the final question. The wireframe demonstrates how the quiz interface maintains accessibility by providing clear question counters, progress indicators with ARIA labels, and keyboard-navigable option buttons with proper focus indicators.

**Figure 8c. Wireframe of the Web Accessibility Awareness Assessment Page - Review Before Submit**

```
┌─────────────────────────────────────────────────────────────────────┐
│                           HEADER / NAVIGATION                       │
│  [Logo] Web Accessibility Evaluator                                 │
│  [Home] [WCAG Guidelines] [Assessment*] [About]                     │
└─────────────────────────────────────────────────────────────────────┘
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  REVIEW BEFORE SUBMISSION                                   │   │
│  │                                                             │   │
│  │  Review before submission                                   │   │
│  │                                                             │   │
│  │  You have answered 35 of 40 questions.                      │   │
│  │  5 questions remain unanswered.                             │   │
│  │                                                             │   │
│  │  ────────────────────────────────────────────────────────  │   │
│  │                                                             │   │
│  │  ┌──────────────────────────────────────────────────────┐  │   │
│  │  │ Question 1                      [Answered ✓]         │  │   │
│  │  │                                                      │  │   │
│  │  │ Question: What is the purpose of alt text?          │  │   │
│  │  │                                                      │  │   │
│  │  │ Your answer: A - To provide text alternative...     │  │   │
│  │  └──────────────────────────────────────────────────────┘  │   │
│  │                                                             │   │
│  │  ┌──────────────────────────────────────────────────────┐  │   │
│  │  │ Question 5                      [Unanswered ✗]      │  │   │
│  │  │                                                      │  │   │
│  │  │ Question: Which element requires a label?           │  │   │
│  │  │                                                      │  │   │
│  │  │ Your answer: Not answered                           │  │   │
│  │  └──────────────────────────────────────────────────────┘  │   │
│  │                                                             │   │
│  │  ┌──────────────────────────────────────────────────────┐  │   │
│  │  │ Question 12                     [Answered ✓]         │  │   │
│  │  │                                                      │  │   │
│  │  │ Question: What is keyboard navigation?              │  │   │
│  │  │ // Code snippet shown here                          │  │   │
│  │  │ Your answer: C - Navigating with Tab key...         │  │   │
│  │  └──────────────────────────────────────────────────────┘  │   │
│  │                                                             │   │
│  │  ... (more questions)                                       │   │
│  │                                                             │   │
│  │  ┌────────────────┐  ┌─────────────────────────────────┐  │   │
│  │  │[Return to Quiz]│  │ [Answer all questions to submit]│  │   │
│  │  └────────────────┘  └─────────────────────────────────┘  │   │
│  │                      (Submit button disabled until all     │   │
│  │                       questions are answered)              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
│                          FOOTER                                     │
└─────────────────────────────────────────────────────────────────────┘
```

This diagram presents the wireframe of the review interface that appears before final quiz submission. The layout includes a comprehensive review section titled "Review before submission" that displays a summary indicating how many questions have been answered (e.g., "You have answered 35 of 40 questions. 5 questions remain unanswered"). Below the summary, each question is listed in a card format showing the question number, question text, any associated code snippets, answer status (Answered/Unanswered) with visual badges, and the user's selected answer. This review interface allows users to verify their responses before submitting, supporting better decision-making and reducing submission errors. Two action buttons are provided: "Return to Quiz" allows users to go back and modify answers, while "Submit Quiz" completes the assessment. If questions remain unanswered, the submit button displays "Answer all questions to submit" and is disabled to ensure complete assessment data.

**Figure 8d. Wireframe of the Web Accessibility Awareness Assessment Page - Results View**

```
┌─────────────────────────────────────────────────────────────────────┐
│                           HEADER / NAVIGATION                       │
│  [Logo] Web Accessibility Evaluator                                 │
│  [Home] [WCAG Guidelines] [Assessment*] [About]                     │
└─────────────────────────────────────────────────────────────────────┘
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  WCAG 2.1 QUIZ RESULTS                                      │   │
│  │                                                             │   │
│  │                      ┌──────────────┐                       │   │
│  │                      │              │                       │   │
│  │                      │   32 / 40    │                       │   │
│  │                      │              │                       │   │
│  │                      │     80%      │                       │   │
│  │                      │              │                       │   │
│  │                      └──────────────┘                       │   │
│  │                                                             │   │
│  │            [Accessibility Awareness: Aware ✓]               │   │
│  │                                                             │   │
│  │  Your results indicate a good understanding of fundamental  │   │
│  │  WCAG 2.1 accessibility principles and their application.   │   │
│  │                                                             │   │
│  │  ────────────────────────────────────────────────────────  │   │
│  │                                                             │   │
│  │  Performance by Principle                                   │   │
│  │                                                             │   │
│  │  Perceivable           8 / 10 (80%)                         │   │
│  │  [████████████████░░]                                       │   │
│  │                                                             │   │
│  │  Operable              7 / 10 (70%)                         │   │
│  │  [██████████████░░░░]                                       │   │
│  │                                                             │   │
│  │  Understandable        9 / 10 (90%)                         │   │
│  │  [██████████████████]                                       │   │
│  │                                                             │   │
│  │  Robust                8 / 10 (80%)                         │   │
│  │  [████████████████░░]                                       │   │
│  │                                                             │   │
│  │  ────────────────────────────────────────────────────────  │   │
│  │                                                             │   │
│  │  Recommended Topics to Review                               │   │
│  │                                                             │   │
│  │  ┌──────────────────────────────────────────────────────┐  │   │
│  │  │ Success Criterion 2.1.1 — Keyboard                   │  │   │
│  │  │                                                      │  │   │
│  │  │ Score: 60%                                           │  │   │
│  │  │ Review this topic to improve keyboard accessibility  │  │   │
│  │  │                                                      │  │   │
│  │  │ [Review Success Criterion 2.1.1 →]                  │  │   │
│  │  └──────────────────────────────────────────────────────┘  │   │
│  │                                                             │   │
│  │  ┌──────────────────────────────────────────────────────┐  │   │
│  │  │ Success Criterion 1.4.3 — Contrast (Minimum)         │  │   │
│  │  │                                                      │  │   │
│  │  │ Score: 50%                                           │  │   │
│  │  │ Review this topic to improve color contrast          │  │   │
│  │  │                                                      │  │   │
│  │  │ [Review Success Criterion 1.4.3 →]                  │  │   │
│  │  └──────────────────────────────────────────────────────┘  │   │
│  │                                                             │   │
│  │  ────────────────────────────────────────────────────────  │   │
│  │                                                             │   │
│  │  Answer Review                                              │   │
│  │                                                             │   │
│  │  ┌──────────────────────────────────────────────────────┐  │   │
│  │  │ Question 1                          [Correct ✓]      │  │   │
│  │  │                                                      │  │   │
│  │  │ Principle: Perceivable                               │  │   │
│  │  │ Guideline: 1.1 Text Alternatives                     │  │   │
│  │  │ Success Criterion: 1.1.1 Non-text Content            │  │   │
│  │  │                                                      │  │   │
│  │  │ Question: What is the purpose of alt text for images?│  │   │
│  │  │                                                      │  │   │
│  │  │ Your answer: A - Provide text alternative           │  │   │
│  │  │ Correct answer: A - Provide text alternative        │  │   │
│  │  │                                                      │  │   │
│  │  │ ℹ Explanation: Alt text provides a text alternative  │  │   │
│  │  │   for images, allowing screen reader users to        │  │   │
│  │  │   understand the content and function of images.     │  │   │
│  │  └──────────────────────────────────────────────────────┘  │   │
│  │                                                             │   │
│  │  ... (all 40 questions reviewed)                            │   │
│  │                                                             │   │
│  │                    ┌────────────────┐                      │   │
│  │                    │ [Retake Quiz]  │                      │   │
│  │                    └────────────────┘                      │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
│                          FOOTER                                     │
└─────────────────────────────────────────────────────────────────────┘
```

This diagram showcases the wireframe of the comprehensive results page displayed after quiz submission. The results interface is designed to provide detailed feedback and educational recommendations organized into multiple sections. At the top, a prominent results summary displays the user's score (e.g., "32 / 40"), percentage achieved (e.g., "80%"), and an awareness level badge indicating their proficiency (e.g., "Accessibility Awareness: Aware"). The awareness levels are categorized as "Unaware" (below 40%), "Developing Awareness" (40-74%), and "Aware" (75% and above), each with color-coded badges. Below the summary, a description provides contextual feedback based on the awareness level achieved. The "Performance by Principle" section displays four progress bars showing the user's score for each WCAG principle (Perceivable, Operable, Understandable, Robust) with both numerical scores (e.g., "7 / 10") and percentages. The "Recommended Topics to Review" section identifies specific WCAG success criteria where the user scored poorly, providing targeted learning recommendations with direct links to the relevant guidelines (e.g., "Success Criterion 1.1.1 — Non-text Content" with a "Review Success Criterion 1.1.1" link). The "Answer Review" section provides a detailed breakdown of each question, showing whether the user answered correctly or incorrectly with visual badges, displaying the question text and any code snippets, revealing both the user's answer and the correct answer, and providing plain-language explanations for each question to support learning. At the bottom, a "Retake Quiz" button allows users to attempt the assessment again to improve their understanding. This comprehensive results view transforms the assessment from a simple test into an educational tool by providing actionable feedback and learning pathways.

**Assessment Module Architecture and Functionality**

The Web Accessibility Awareness Assessment module represents a significant educational feature that complements the evaluation tool by measuring and enhancing users' understanding of WCAG 2.1 concepts. This interactive assessment system consists of 40 carefully designed multiple-choice questions distributed equally across the four WCAG principles—10 questions each for Perceivable, Operable, Understandable, and Robust principles. Each question is linked to specific WCAG guidelines and success criteria, ensuring alignment with official accessibility standards.

The assessment module implements a sophisticated quiz workflow managed entirely through client-side JavaScript with backend API support. When users initiate the quiz, the system fetches questions from the database via the `api/get-quiz-questions.php` endpoint, which retrieves 40 questions randomized by principle to ensure variety across assessment attempts. The quiz state management tracks the current question index, user answers stored in a key-value structure mapping question IDs to selected options, and results data received after submission. The interface organizes questions by principle using interactive principle tabs that allow users to navigate between different sections of the quiz, providing visual feedback through principle-specific color coding—blue for Perceivable, purple for Operable, green for Understandable, and orange for Robust.

As users progress through the assessment, the interface provides real-time feedback through multiple indicators: a question counter displaying current position and total questions (e.g., "Question 5 of 40"), an overall progress bar showing percentage completion, and updated progress percentages. Questions may include practical code snippets displayed in accessible, syntax-highlighted code blocks to test users' ability to identify accessibility issues in real HTML implementations. Users select answers by clicking option buttons marked A, B, C, or D, with visual feedback indicating selected choices. Navigation is facilitated through "Previous" and "Next" buttons, with the final question's "Next" button changing to "Review Answers" to transition to the pre-submission review phase.

The review interface presents a comprehensive summary before submission, listing all questions with their answer status (Answered/Unanswered) indicated by color-coded badges. Users can see exactly which questions remain unanswered and have the opportunity to return to the quiz to complete or modify their responses. The submit button remains disabled with explanatory text ("Answer all questions to submit") until all 40 questions have been answered, ensuring complete assessment data for accurate evaluation.

Upon submission, the system sends the user's answers to the `api/submit-quiz.php` endpoint, which processes the responses by comparing them against correct answers stored in the database, calculating the overall score and percentage, determining performance for each WCAG principle separately, identifying weak areas where the user scored below 70% on specific success criteria, and generating detailed answer reviews with explanations. The results interface presents this information in an educational format designed to maximize learning outcomes.

The results view categorizes user performance into three awareness levels based on percentage scores: "Unaware" (below 40%) indicates limited familiarity with WCAG concepts and recommends reviewing fundamental principles; "Developing Awareness" (40-74%) indicates partial understanding with several areas needing further study; and "Aware" (75% and above) indicates good understanding of fundamental WCAG principles with encouragement to continue deepening knowledge. Each awareness level includes tailored descriptive feedback that acknowledges current knowledge while providing constructive guidance for improvement.

The performance by principle section visualizes scores for each of the four WCAG principles using progress bars and numerical indicators, allowing users to identify which principles they understand well and which require additional study. This breakdown supports targeted learning by directing users' attention to specific areas of weakness rather than treating accessibility knowledge as a monolithic concept.

The recommendations section provides actionable learning pathways by identifying specific WCAG success criteria where the user struggled, displaying the success criterion ID and name (e.g., "Success Criterion 2.1.1 — Keyboard"), showing the user's score for questions related to that criterion, providing a brief message explaining why this topic is important, and offering a direct link to the detailed guideline explanation in the WCAG Guidelines section of the system. This personalized recommendation engine transforms raw quiz data into a customized learning plan that addresses each user's specific knowledge gaps.

The answer review section provides the most detailed feedback by presenting every question with the user's answer, the correct answer, and a plain-language explanation of why the correct answer is right. This approach supports learning from mistakes by helping users understand not just what the correct answer is, but why it is correct according to WCAG principles. The review includes all original question context, including code snippets, ensuring users can revisit the scenario with full information.

From a technical implementation perspective, the assessment module demonstrates several sophisticated frontend and backend patterns. The client-side JavaScript manages complex state including question data, current position, user answers, and results, with reactive rendering that updates the interface based on state changes. The principle tab navigation implements ARIA roles and attributes (role="tab", aria-selected) to ensure keyboard navigation and screen reader compatibility. Progress indicators include proper ARIA labels and live regions (aria-live="polite") to announce changes to assistive technology users. Option buttons implement proper focus management with visible focus indicators meeting WCAG 2.1 success criterion 2.4.7 (Focus Visible), and use aria-pressed attributes to communicate selection state.

The backend API endpoints implement secure data handling through CSRF token validation using the X-Requested-With header to prevent cross-site request forgery, JSON payload validation to ensure data integrity, and prepared SQL statements to prevent injection attacks. The submission endpoint processes answers efficiently by loading correct answers for all questions in a single database query, calculating scores using array intersection and comparison operations, and generating recommendations by analyzing performance on a per-criterion basis with configurable thresholds.

The assessment module integrates seamlessly with the existing system architecture by sharing the same navigation structure and visual design language, linking recommendation results to the WCAG Guidelines section for continuous learning, maintaining consistent accessibility standards throughout the quiz interface, and storing quiz results in the database for potential future analysis of learning patterns. This integration ensures that the assessment feels like a natural extension of the evaluation tool rather than a separate, disconnected feature.

The educational value of the assessment module lies in its ability to transform passive learning into active knowledge testing, provide immediate, personalized feedback on knowledge gaps, connect abstract WCAG concepts to practical scenarios through code examples, support iterative learning through the retake functionality, and bridge the gap between theoretical guideline understanding and practical application skills. By incorporating this assessment module, the system addresses the survey findings that students lack confidence in implementing accessibility features and provides a low-stakes environment for testing and building that confidence through repeated practice and detailed feedback.

**Figure 9. Entity-Relationship Diagram of the System**

This diagram shows the entity-relationship structure of the accessibility evaluation tool's database, illustrating how different data entities are connected and organized. The database includes tables for storing WCAG criteria (wcag_criteria), implementation techniques (wcag_techniques), before/after code examples (wcag_examples), user groups who benefit from each criterion (wcag_user_groups), scan results metadata (scan_results), individual accessibility issues detected during scans (accessibility_checks), quiz questions for the assessment module (quiz_questions), and quiz submission records (quiz_results). The diagram demonstrates the relationships between these entities, showing how WCAG criteria serve as the foundation for techniques, examples, and user group information through one-to-many relationships, while scan results link to individual accessibility checks, and quiz questions connect to specific WCAG guidelines and success criteria. This structure ensures efficient data storage, retrieval, and management of both educational content, evaluation results, and assessment data.



### Class Diagram

The class diagram illustrates the object-oriented structure of the system, showing the classes, their attributes, methods, and relationships that form the core architecture of the Web-Based Accessibility Evaluation Tool.

```
┌───────────────────────────────────────────────────────────────────┐
│                          Frontend Layer                           │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐         ┌──────────────────┐              │
│  │  UserInterface   │         │  WCAGViewer      │              │
│  ├──────────────────┤         ├──────────────────┤              │
│  │ - scanForm       │         │ - guidelineList  │              │
│  │ - resultsPanel   │         │ - exampleViewer  │              │
│  │ - navigation     │         │ - filterPanel    │              │
│  ├──────────────────┤         ├──────────────────┤              │
│  │ + displayHome()  │         │ + loadGuidelines()│             │
│  │ + showResults()  │         │ + filterBy()     │              │
│  │ + showError()    │         │ + showExamples() │              │
│  └────────┬─────────┘         └──────────────────┘              │
│           │                                                       │
└───────────┼───────────────────────────────────────────────────────┘
            │
            │ HTTP Request
            ▼
┌───────────────────────────────────────────────────────────────────┐
│                        Application Layer                          │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    ScanController                         │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ - scanType: string                                        │   │
│  │ - sourceUrl: string                                       │   │
│  │ - htmlContent: string                                     │   │
│  │ - csrfToken: string                                       │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ + validateInput(): bool                                   │   │
│  │ + processRequest(): void                                  │   │
│  │ + fetchUrlContent(url: string): string                    │   │
│  │ + sanitizeInput(input: string): string                    │   │
│  │ + initiateScan(): array                                   │   │
│  └───────────┬────────────────────────────────┬──────────────┘   │
│              │                                │                   │
│              │ uses                           │ uses              │
│              ▼                                ▼                   │
│  ┌──────────────────────┐       ┌──────────────────────────┐    │
│  │ AccessibilityChecker │       │    ResultsGenerator      │    │
│  ├──────────────────────┤       ├──────────────────────────┤    │
│  │ - db: PDO            │       │ - issues: array          │    │
│  │ - checks: array      │       │ - summary: array         │    │
│  │ - crawler: Crawler   │       │ - scanId: string         │    │
│  │ - htmlContent: string│       ├──────────────────────────┤    │
│  ├──────────────────────┤       │ + generateReport(): array│    │
│  │ + loadChecks(): void │       │ + calculateScore(): int  │    │
│  │ + runAllChecks():    │       │ + categorizeIssues():    │    │
│  │   array              │       │   void                   │    │
│  │ + runCheck(check):   │       │ + countByPrinciple():    │    │
│  │   array              │       │   array                  │    │
│  │ - createIssue():     │       │ + formatOutput(): array  │    │
│  │   array              │       └──────────────────────────┘    │
│  │ - check_img_missing_ │                                        │
│  │   alt(): array       │                                        │
│  │ - check_missing_page_│                                        │
│  │   title(): array     │                                        │
│  │ - check_form_control_│                                        │
│  │   no_label(): array  │                                        │
│  │ - hasAccessibleName()│                                        │
│  │ - hasControlLabel()  │                                        │
│  └──────────┬───────────┘                                        │
│             │                                                     │
│             │ uses                                                │
│             ▼                                                     │
│  ┌──────────────────────┐                                        │
│  │    SecurityHelper    │                                        │
│  ├──────────────────────┤                                        │
│  │ + validateCsrfToken()│                                        │
│  │ + generateCsrfToken()│                                        │
│  │ + initSecureSession()│                                        │
│  │ + sanitizeInput()    │                                        │
│  └──────────────────────┘                                        │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
            │
            │ Data Access
            ▼
┌───────────────────────────────────────────────────────────────────┐
│                          Data Layer                               │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                        Database                           │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ - connections: array (static)                             │   │
│  │ - config: array (static)                                  │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ + getConnection(name: string): PDO (static)               │   │
│  │ + getWriteConnection(): PDO (static)                      │   │
│  │ + getReadConnection(): PDO (static)                       │   │
│  │ + testConnection(): bool (static)                         │   │
│  │ + closeAll(): void (static)                               │   │
│  │ + getInfo(): array (static)                               │   │
│  │ - getConfig(): array (static)                             │   │
│  └───────────┬────────────────────────────────────────────────┘ │
│              │                                                    │
│              │ manages connections to                             │
│              ▼                                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   Database Tables                         │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │                                                           │   │
│  │  ┌─────────────────┐      ┌─────────────────┐           │   │
│  │  │ wcag_criteria   │      │ wcag_techniques │           │   │
│  │  ├─────────────────┤      ├─────────────────┤           │   │
│  │  │ + id: string    │──┐   │ + id: int       │           │   │
│  │  │ + principle     │  │   │ + criterion_id  │◄──────────┘   │
│  │  │ + title         │  │   │ + technique_code│           │   │
│  │  │ + level         │  │   └─────────────────┘           │   │
│  │  │ + description   │  │                                  │   │
│  │  │ + explanation   │  │   ┌─────────────────┐           │   │
│  │  └─────────────────┘  │   │ wcag_examples   │           │   │
│  │                       │   ├─────────────────┤           │   │
│  │                       └──►│ + id: int       │           │   │
│  │                           │ + criterion_id  │           │   │
│  │  ┌─────────────────┐     │ + state         │           │   │
│  │  │ accessibility_  │     │ + html_code     │           │   │
│  │  │ checks          │     │ + css_code      │           │   │
│  │  ├─────────────────┤     │ + js_code       │           │   │
│  │  │ + id: int       │     └─────────────────┘           │   │
│  │  │ + check_key     │                                    │   │
│  │  │ + wcag_code     │     ┌─────────────────┐           │   │
│  │  │ + principle     │     │ wcag_user_groups│           │   │
│  │  │ + title         │     ├─────────────────┤           │   │
│  │  │ + description   │     │ + id: int       │           │   │
│  │  │ + recommendation│     │ + criterion_id  │           │   │
│  │  │ + severity      │     │ + user_group    │           │   │
│  │  │ + selector      │     └─────────────────┘           │   │
│  │  │ + enabled       │                                    │   │
│  │  │ + priority      │     ┌─────────────────┐           │   │
│  │  └─────────────────┘     │ scan_results    │           │   │
│  │                          ├─────────────────┤           │   │
│  │                          │ + id: int       │           │   │
│  │                          │ + scan_id       │           │   │
│  │                          │ + scan_type     │           │   │
│  │                          │ + source_url    │           │   │
│  │                          │ + timestamp     │           │   │
│  │                          │ + total_issues  │           │   │
│  │                          └─────────────────┘           │   │
│  │                                                         │   │
│  │  ┌─────────────────┐     ┌─────────────────┐          │   │
│  │  │ quiz_questions  │     │ quiz_results    │          │   │
│  │  ├─────────────────┤     ├─────────────────┤          │   │
│  │  │ + id: int       │──┐  │ + id: int       │          │   │
│  │  │ + principle     │  │  │ + session_id    │          │   │
│  │  │ + guideline_code│  │  │ + total_score   │          │   │
│  │  │ + success_crit. │  │  │ + percentage    │          │   │
│  │  │ + question      │  │  │ + awareness_lvl │          │   │
│  │  │ + code_snippet  │  │  │ + submitted_at  │          │   │
│  │  │ + option_a      │  │  └─────────────────┘          │   │
│  │  │ + option_b      │                                   │   │
│  │  │ + option_c      │                                   │   │
│  │  │ + option_d      │                                   │   │
│  │  │ + correct_answer│                                   │   │
│  │  │ + explanation   │                                   │   │
│  │  └─────────────────┘                                   │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘

        Relationships Legend:
        ─────►  Association/Dependency
        ──┐
          └──► One-to-Many Relationship
```

**Figure 10. Class Diagram of the Web-Based Accessibility Evaluation Tool**

The class diagram represents the complete object-oriented architecture of the Web-Based Accessibility Evaluation Tool, organized into three distinct layers: the Frontend Layer, Application Layer, and Data Layer. This layered architecture follows the Model-View-Controller (MVC) pattern and ensures proper separation of concerns, making the system maintainable, scalable, and testable.

**Frontend Layer:**

The Frontend Layer contains the presentation components that handle user interaction and display. The **UserInterface** class manages the primary user interface elements including the scan form where users input URLs or HTML code, the results panel that displays evaluation findings, and the navigation system that allows users to move between different sections of the application. Its methods include `displayHome()` for rendering the home page, `showResults()` for presenting scan results, and `showError()` for handling error messages. The **WCAGViewer** class is responsible for displaying WCAG guidelines and educational content. It maintains the guideline list, example viewer, and filter panel, with methods to load guidelines, filter by principle or level, and show before/after code examples. The **AssessmentInterface** class manages the interactive quiz experience, handling principle tab navigation, progress tracking with visual feedback, question rendering with code snippets, answer selection and validation, review before submission, and comprehensive results display with performance analytics and personalized recommendations. These frontend classes communicate with the backend through HTTP requests, sending user input and receiving processed data for display.

**Application Layer:**

The Application Layer serves as the core business logic layer where all accessibility evaluation processing occurs. At the center is the **ScanController** class, which orchestrates the entire scanning workflow. It accepts scan requests from the frontend, validates input including CSRF tokens for security, determines whether the scan is URL-based or HTML-based, fetches content when necessary using `fetchUrlContent()`, and coordinates with other classes to perform the evaluation. The ScanController uses the **AccessibilityChecker** class to perform the actual accessibility evaluation. AccessibilityChecker is the most complex class in the system, containing the database connection, an array of check configurations loaded from the database, a Symfony DomCrawler instance for HTML parsing, and the HTML content to be analyzed. It implements numerous specific check methods such as `check_img_missing_alt()` for detecting images without alt text, `check_missing_page_title()` for verifying page titles exist, and `check_form_control_no_label()` for ensuring form elements have labels. Helper methods like `hasAccessibleName()` and `hasControlLabel()` support the check implementations by verifying accessibility requirements. The **ResultsGenerator** class takes the issues array produced by AccessibilityChecker and transforms it into a comprehensive report. It calculates the overall accessibility score using `calculateScore()`, categorizes issues by severity (Error, Warning, Info) and by WCAG principle (Perceivable, Operable, Understandable, Robust), counts issues per principle, and formats the output into a structured array suitable for display or storage. The **SecurityHelper** class provides essential security functions used throughout the application layer, including CSRF token validation and generation, secure session initialization, and input sanitization to prevent injection attacks.

**Data Layer:**

The Data Layer manages all database interactions and data persistence. The **Database** class implements a connection pooling pattern to efficiently manage database connections. It maintains static properties for storing active connections and configuration, ensuring connections are reused rather than recreated for each query, which improves performance. The class provides methods to obtain read-write connections via `getWriteConnection()` and read-only connections via `getReadConnection()`, supporting a security pattern where read operations use limited-privilege connections. The `testConnection()` method verifies database connectivity, `closeAll()` properly closes connections, and `getInfo()` retrieves database metadata. The Database Tables section represents the underlying database schema with seven primary entities. The **wcag_criteria** table serves as the foundation, storing WCAG 2.1 success criteria including principle classification, title, level, description, and explanation. This table has one-to-many relationships with several related tables. The **wcag_techniques** table stores implementation techniques for each criterion, linking via criterion_id foreign key. The **wcag_examples** table contains before-and-after code examples with HTML, CSS, and JavaScript code snippets, using a state field to distinguish between "before" (inaccessible) and "after" (accessible) examples. The **wcag_user_groups** table identifies which user groups benefit from each accessibility criterion. The **accessibility_checks** table stores the check configurations that the AccessibilityChecker loads at runtime, including the check key, WCAG code reference, principle, title, description, recommendation, severity level, CSS selector for element targeting, enabled flag, and priority. The **scan_results** table persists the results of each scan performed by users, storing metadata such as scan ID, scan type, source URL, timestamp, and total issue count. The **quiz_questions** table stores the 40 assessment questions distributed equally across the four WCAG principles, with each question containing the principle classification, guideline code, success criterion reference, question text, optional code snippet for practical scenarios, four multiple-choice options (A, B, C, D), correct answer designation, and detailed explanation for educational feedback. The **quiz_results** table records each quiz submission, storing the session ID, total score achieved, percentage score, awareness level classification (Unaware, Developing Awareness, Aware), and submission timestamp for tracking student progress over time.

**Class Relationships:**

The diagram illustrates several important relationships between classes. The ScanController has dependency relationships with both AccessibilityChecker and ResultsGenerator, indicated by "uses" labels. This shows that ScanController instantiates and invokes methods on these classes to complete the scanning workflow. AccessibilityChecker has a dependency relationship with SecurityHelper, using its sanitization and validation methods to ensure data integrity. The Database class manages connections to the database tables, shown by the "manages connections to" relationship. Within the database tables, the wcag_criteria table has one-to-many relationships with wcag_techniques, wcag_examples, and wcag_user_groups, depicted by the relationship arrows showing that one criterion can have multiple techniques, multiple examples, and multiple benefiting user groups.

**Design Patterns and Principles:**

This class diagram demonstrates several software engineering best practices and design patterns. The **Layered Architecture** pattern separates concerns into Frontend, Application, and Data layers, ensuring changes in one layer have minimal impact on others. The **Connection Pooling** pattern in the Database class improves performance by reusing database connections. The **Security by Design** principle is evident in the SecurityHelper class and CSRF token validation throughout the request flow. The **Single Responsibility Principle** is applied, with each class having a focused, well-defined purpose—AccessibilityChecker performs checks, ResultsGenerator formats results, Database manages connections, and ScanController orchestrates the workflow. The **Separation of Concerns** principle ensures presentation logic (Frontend), business logic (Application), and data access logic (Data Layer) are kept distinct and independently maintainable.

**Execution Flow:**

The typical execution flow follows this path: Users interact with the UserInterface class to submit a scan request; the request is received by ScanController, which validates the input and fetches content if needed; ScanController instantiates AccessibilityChecker, passing the HTML content; AccessibilityChecker loads check configurations from the database using the Database class; AccessibilityChecker runs all enabled checks against the HTML content, collecting issues; the issues array is passed to ResultsGenerator; ResultsGenerator calculates scores, categorizes issues, and formats the output; the formatted results are returned to ScanController; ScanController stores the results in the scan_results table; finally, the results are sent back to the UserInterface for display to the user. This flow demonstrates how the three-layer architecture facilitates a clean, organized approach to processing accessibility evaluations while maintaining security, performance, and maintainability throughout the system.

**Figure 11. Software Architecture of the System**

This diagram shows the software architecture of the accessibility evaluation tool, giving a clear view of how it is structured and designed. It explains how different parts of the system interact and work together to ensure everything runs smoothly. The diagram highlights how data flows between the front-end (HTML, CSS, JavaScript) and back-end (PHP), showing how they combine to deliver content to the users. The architecture follows a three-tier model with a presentation layer handling user interfaces, an application layer processing evaluation logic and feedback generation, and a data layer managing WCAG criteria and scan results through MySQL database. It helps to understand how the system functions as a whole, making sure content is managed and displayed properly, and demonstrates the smooth connection between all parts of the system.



### Software Architecture

The Web-Based Accessibility Evaluation Tool employs a client-server architecture that integrates three core components: the Frontend, Backend, and Database. The Frontend serves as the user interface where students and instructors submit web content (either as URLs or direct HTML code) for evaluation and view the accessibility results presented in a clear, educational format. The Backend acts as the processing hub that orchestrates the accessibility scan process by retrieving WCAG issues stored in the Database, performing automated checks against the submitted web content, and generating detailed accessibility results that include issue descriptions, severity classifications, and actionable fix recommendations. The Database functions as the persistent storage layer, maintaining comprehensive WCAG 2.1 guidelines, criteria definitions, implementation techniques, before/after code examples, and historical scan results. This architectural design ensures a clear separation of concerns: the Frontend focuses on user interaction and presentation, the Backend handles business logic and accessibility evaluation algorithms, and the Database manages all data persistence, creating a modular system that supports the educational objectives of simplifying complex accessibility concepts while providing scalable, maintainable functionality for teaching and learning web accessibility.



## System Development

To develop the Web-Based Accessibility Evaluation Tool, the researcher will need several software tools and resources. Initially, the system will be built using web technologies such as HTML, CSS, and JavaScript for the frontend, while the backend will utilize PHP and MySQL for managing the database and storing WCAG criteria, scan results, and educational content. For development purposes, Visual Studio Code will be used as the primary code editor, providing features like debugging and error tracking. XAMPP will be used to simulate a local server environment for testing before deployment.

The hardware requirements include desktop or laptop computers with a minimum of 8GB RAM and internet access for both students and instructors to interact with the system. The system will be optimized for desktop viewing, so devices with an Intel Core i5 processor (10th Gen or higher) and at least 256GB of storage will be ideal for development and testing. Once the system is developed and tested, it will be hosted on a web server for users within the department to access.

In addition, online tutorials, documentation for web development, and version control tools like GitHub will be essential for collaboration and keeping track of code changes. Feedback from students and instructors during the testing phase will be critical to ensure the system is functional, user-friendly, and meets the needs of its users. After successful testing and feedback implementation, the system will be deployed for department-wide use.



## System Testing

The testing process will evaluate the system to ensure that all its features function as intended and meet the required specifications. The following specific tests will be conducted:

To perform the Functionality tests, the following procedures will be conducted:

1. Verify that the system can successfully accept both website URLs and HTML code as input for accessibility evaluation.
2. Test if the system can scan and parse HTML content correctly, identifying all relevant elements for accessibility checking.
3. Ensure that the evaluation engine accurately detects common accessibility issues such as missing alt text, improper heading structures, unlabeled form elements, and insufficient color contrast.
4. Check if the system correctly categorizes detected issues by severity (Error, Warning, Info) and assigns appropriate WCAG guideline references.
5. Verify that scan results are displayed to users with accurate details, including issue descriptions, WCAG references, principles, and "How to Fix" recommendations in plain language.
6. Ensure that the WCAG guidelines page displays educational content correctly, including guideline descriptions, before/after examples, techniques, and "Who Benefits" information.
7. Test the system's response to invalid inputs or errors, such as malformed URLs, invalid HTML code, or network connection failures.

To perform the Usability tests, the following procedures will be conducted:

1. Evaluate the ease of navigation for users (students and instructors) to access the home page, scan results, and WCAG guidelines in the system.
2. Assess the user's experience with the dual input interface, including entering website URLs and pasting HTML code for evaluation.
3. Collect feedback from student volunteers about the clarity, organization, and accessibility of scan results and educational content.
4. Test all clickable elements (buttons, links, navigation menus) to ensure they perform their intended actions and direct users appropriately.
5. Verify that all content, including scan results, guidelines, and examples, is properly displayed and accessible, including compatibility with assistive tools such as screen readers and keyboard-only navigation.
6. Monitor for delays or performance issues, particularly when scanning large web pages or processing complex HTML structures.

To perform the Reliability tests, the following procedures will be conducted:

1. Run the system continuously for an extended period to check for consistent performance and stability during multiple scan operations.
2. Simulate multiple users accessing the system simultaneously to ensure it handles concurrent scans without errors or data corruption.
3. Test the system's database consistency, ensuring that WCAG criteria, scan results, and educational content are stored and retrieved accurately across all user sessions.

To perform the Portability tests, the following procedures will be conducted:

1. Test the system on various desktop or laptop configurations and operating systems (Windows, macOS) to ensure compatibility and consistent performance.
2. Verify that the system adapts well to different screen resolutions and browser settings across Google Chrome, Mozilla Firefox, Microsoft Edge, and Safari.
3. Ensure that the system functions as expected across different internet speeds, particularly for URL-based scanning that requires fetching external web content.



## System Evaluation

The system evaluation will assure the quality of the Web-Based Accessibility Evaluation Tool, measuring its functionality and performance. Users, including students, instructors, and IT professionals, will provide feedback through survey instruments, which will allow them to rate how effective and user-friendly the accessibility evaluation tool is. This will help in determining its strengths and weaknesses.

The quality of the system will be assessed using simple parameters—functionality, which will ensure that the system works as intended; usability, which will guarantee ease of navigation; and performance, which will verify that the system runs smoothly. Test cases will result in step-by-step checks to detect and resolve any issues.

Finally, an evaluation report will be prepared, summarizing which aspects of the system are working well, which parts need improvement, and what requires further refinement.

For system evaluation, the researcher will use an assessment form based on ISO 25010. The following requirements are part of the standard: usability, security, maintainability, portability, compatibility, performance, functionality, and reliability. Technical and non-technical components will contribute to the system evaluation. The system will be evaluated by 5 Technical Evaluators and 10 non-technical users. The system will be rated by the respondents on a scale of 1 to 5. An outstanding rating of five will indicate that the system fully fulfills or beyond the majority of expectations. The system will fully satisfy all requirements and beyond many expectations with a 4 rating, which will be considered very good. A score of three will be considered good, indicating that the system satisfies all requirements.

The researcher from Cavite State University will conduct the evaluation in order to evaluate its effectiveness and identify areas for development. The study will be largely focused on key performance indicators such as user satisfaction, system utilization, system functionality, and user usability.

In order to conduct an analysis of the information obtained during the evaluation, the following statistical methods will be utilized. The conclusions reached through the use of statistical processes will serve as the basis for the respondents' overall interpretation of the systems. The researchers will use a pointing system to acquire the level of agreement of the respondents on the questions in the survey questionnaire. The points to be used are:

**Table 6. Options in each item of the questionnaire**

| **Scale** | **Description** | **Interpretation** |
|:---:|---|---|
| 5 | Strongly Agree | Excellent |
| 4 | Agree | Very Good |
| 3 | Neutral | Good |
| 2 | Disagree | Fair |
| 1 | Strongly Disagree | Poor |

**Table 7.** shows the Likert scale that can be used to generate the overall interpretation of the mean score of each item.

| **Mean Value** | **Estimation Degree** |
|:---:|---|
| 1.00 - 1.80 | Excellent |
| 1.81 - 2.60 | Very Good |
| 2.61 - 3.40 | Good |
| 3.41 - 4.20 | Fair |
| 4.21 - 5.00 | Poor |

On the other hand, the following statistical methods will be used to analyze the data collected from the System Evaluation Questionnaire. The results will help understand the overall opinion of the respondents about the system.

The sample mean represents the average score of a sample for a specific variable. Formula for Sample Mean: The mean score is calculated using the following formula:

$$\bar{x} = \frac{\sum_{i=1}^{n} x_i}{n}$$

Where:
- $\bar{x}$ = mean score
- $x_i$ = representation of each mean observation from respondents
- $n$ = total number of respondents

Sample standard deviation is a measure of the spread (variability) of the scores in the sample on a given variable. Formula for Sample standard deviation: The sample standard deviation is calculated using the following formula:

$$s = \sqrt{\frac{\sum_{i=1}^{n} (x_i - \bar{x})^2}{n}}$$

Where:
- $s$ = sample of standard deviation
- $x_i$ = representation of each mean observation from respondents
- $\bar{x}$ = mean score
- $n$ = total number of respondents




## System Implementation

The system implementation will ensure the successful deployment and operation of the Web-Based Accessibility Evaluation Tool within the academic environment of Cavite State University's Department of Information Technology. After completing development and evaluation, the system will be presented to the thesis adviser and panelists for final review and approval. This review process will verify that the system meets all educational objectives, technical requirements, and quality standards established during the planning phase. Upon receiving approval, the researcher will proceed with deployment using the university's available resources. For this implementation, the system will be deployed locally using XAMPP as the development and hosting environment, which will provide Apache web server, PHP runtime, and MySQL database capabilities on a single machine. The system files will be organized in the XAMPP htdocs directory, the database will be set up through phpMyAdmin with proper table structures and initial data, and local testing will be conducted to ensure all functionalities work correctly before making the system accessible to users within the campus network.

To facilitate effective utilization of the system, the researcher will conduct demonstration sessions for faculty members and student volunteers from the Information Technology program. These demonstrations, typically lasting one to two hours, will showcase the system's key features including URL-based scanning, HTML code input, accessibility report interpretation, and navigation through WCAG guidelines and educational content. Participants will be encouraged to test the system with sample websites and provide immediate feedback on usability and functionality. A simple user guide will be prepared and distributed in digital format (PDF), containing step-by-step instructions with screenshots that explain how to perform scans, understand the results, and access the educational resources. This documentation will serve as a reference for users who wish to explore the system independently after the demonstration sessions.

Following the demonstrations, the system will be made available for use by students and faculty within the Department of Information Technology. Access information, including the local network URL and basic usage instructions, will be shared through the department's communication channels such as class announcements and faculty meetings. During the initial weeks of deployment, the researcher will monitor system usage by reviewing scan logs stored in the database and observing how users interact with different features. Feedback will be collected informally through conversations with users and formally through a brief feedback form accessible within the system. Any technical issues or bugs reported by users will be documented and addressed promptly by the researcher. This implementation approach will allow the system to serve its educational purpose within the university setting while remaining manageable for a student-developed thesis project, with the potential for future enhancement and expansion based on user feedback and institutional support.



## Summary

This chapter presented the comprehensive methodology for developing the Web-Based Accessibility Evaluation Tool for Inclusive Web Design. The methodology encompasses six major phases: Requirements Analysis, System Design, System Development, System Testing, System Evaluation, and System Implementation.

The **Requirements Analysis** phase established the empirical foundation through survey data from 45 Information Technology students and 24 web development professionals, identifying critical gaps in accessibility education and defining both functional and non-functional requirements. The analysis revealed that 75% of students lack confidence in implementing accessibility features, with the lack of practical examples (42.2%) and limited classroom discussion (40%) being the most significant barriers to learning.

The **System Design** phase translated these requirements into concrete architectural and interface designs, guided by principles of simplicity, educational focus, and accessibility by design. Wireframes were developed for the home page, scan results page, and WCAG guidelines page, each addressing specific learning preferences identified through empirical research. The database design supports comprehensive storage of WCAG criteria, evaluation results, and educational content.

The **System Development** phase outlined the technical implementation using an Agile methodology with PHP, MySQL, HTML, CSS, and JavaScript. The development is structured into six phases spanning 14 weeks, with detailed work breakdown structure and Gantt chart providing clear timelines and deliverables. The estimated budget of PHP 92,180.00 covers hardware, software, hosting, documentation, testing, and operational expenses.

The **System Testing** phase defined comprehensive testing procedures including functional testing, usability testing with student volunteers, performance testing, compatibility testing across browsers and devices, and accuracy validation against WCAG 2.1 standards. The testing schedule allocates 33 days to ensure system reliability and educational effectiveness.

The **System Evaluation** phase established the ISO/IEC 25010 quality model as the evaluation framework, focusing on functional suitability, performance efficiency, usability, reliability, security, maintainability, and portability. Fifteen evaluators (5 technical, 10 non-technical) will assess the system using a structured questionnaire with 5-point Likert scale, with results analyzed using descriptive statistics and interpreted according to defined quality levels.

The **System Implementation** phase detailed the deployment strategy, including pre-deployment preparation, production deployment, user training, and post-deployment monitoring. The implementation timeline spans 47 days and includes instructor training, student orientation, and comprehensive support mechanisms. Success criteria and a future enhancement roadmap ensure the system's long-term viability and continuous improvement.

This methodology provides a systematic, evidence-based approach to developing an educational tool that addresses the identified gaps in web accessibility education. By grounding each phase in empirical data on student learning preferences and barriers, the methodology ensures that the resulting system will effectively support students and instructors in learning and implementing inclusive web design practices. The comprehensive testing, evaluation, and implementation strategies further ensure that the system will be reliable, user-friendly, and educationally valuable when deployed in the academic environment.

---

**End of Chapter 3**

