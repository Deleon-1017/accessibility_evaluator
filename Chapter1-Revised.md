# DEVELOPMENT OF WEB-BASED ACCESSIBILITY EVALUATION TOOL FOR INCLUSIVE WEB DESIGN

**DE LEON, GABRIEL IAN B.**

An undergraduate capstone project outline submitted to the faculty of the Department of Information Technology, College of Engineering and Information Technology, Cavite State University, Indang, Cavite in partial fulfillment of the requirements for the degree of Bachelor of Science in Information Technology with Contribution No. **\_\_\_**. Prepared under the supervision of **\_\_\_**.

---

## INTRODUCTION

### Project Context

The internet has been a primary instrument for education, business, and social interaction, based on recent data indicating that approximately 5.5 billion people, or 68% of the global population are capable to access with internet. As the global population rapidly increases, it becomes critical to ensure that every individual has equal access to technology, particularly as internet usage in highly populated countries has reached at 93% (International Telecommunication Union, 2024). However, a significant digital divide persists, where digital content often remains inaccessible to the 1.3 billion people which approximately 16% of the world’s population who live with different disabilities. Websites facilitate as essential platforms for information dissemination, communication, and online services. In order to implement this effectively, web accessibility is required. By enforcing web accessibility, it promotes technological approach for reducing digital inequality and inclusivity of online content, contributing to a more equitable digital access among users, regardless of any disabilities or physical limitations (World Health Organization, 2023).

This research is focused on developing an educational tool primarily aimed for assisting students and professionals in learning and implementing inclusive design practices. The primary locale for deployment and as a key beneficiary is the Department of Information Technology, College of Engineering and Information Technology, Cavite State University. It can integrate the system into its curriculum to demonstrate the importance of building digital platforms that are inclusive and compliant with established standards.

Despite the existence of established standards, a persistent lack of accessible websites remains the primary problem addressed by this study. Inaccessible websites create barriers that exclude individuals with disabilities from vital online information, services, and opportunities, a critical issue given that organizations with inaccessible sites lose substantial market opportunities to competitors who prioritize inclusivity (accessiBe, 2025). To address this global need, the World Wide Web Consortium (W3C) established the Web Content Accessibility Guidelines (WCAG), currently in version 2.1, which serves as the international standard for building accessible digital content. However, systematic analysis of empirical data gathered from Information Technology students and web development professionals reveals that the persistence of inaccessible websites stems not from an absence of technical standards, but rather from interconnected educational and procedural deficiencies that prevent effective learning and implementation of accessibility principles.

Research findings from fishbone analysis and survey data* reveal three connected barriers that prevent effective web accessibility education and implementation. First, students and educators struggle because dedicated accessibility evaluation tools are not available in classroom settings. This problem is made worse by limited teaching on how to measure accessibility, and the absence of standardized rubrics, clear benchmarks, and guided workflows that would help learners check their own code. Most IT students have never received formal instruction in accessible web design. Students consistently point to three main obstacles: lack of hands-on checking tools, unfamiliarity with accessibility concepts, and insufficient classroom discussion. Second, teaching methods often lack step-by-step scaffolding. Learners are confronted with complex technical terms and comprehensive WCAG specifications without getting modular lessons or foundational knowledge first. Students identified lack of practical examples as their biggest learning difficulty and said that accessibility guidelines are hard to understand without context. They strongly prefer step-by-step explanations, side-by-side examples showing accessible versus non-accessible code, and plain-language descriptions. This teaching gap extends beyond schools into professional work, where web developers report ongoing knowledge gaps and find existing accessibility tools too complex to use. Third, the absence of automated validation during development limits effective learning. Without it, learners cannot receive immediate feedback on their syntax and accessibility errors, which eliminates opportunities to correct and improve their work iteratively. Instructors also cannot provide timely, individual code reviews for large numbers of students. Students expressed clear needs for actionable feedback on their work and automated accessibility checks. Professional developers echo these needs, prioritizing automated checking, actionable recommendations, and reports they can easily understand. These connected challenges show that web accessibility education needs a comprehensive solution that addresses evaluation tools, structured teaching, and real-time feedback to support effective learning and professional practice.


These systemic problems create a learning environment where most students lack confidence in their ability to build accessible web features, even though they recognize the professional value. Three-quarters of students expressed uncertainty or low confidence in creating accessible websites, with only a quarter feeling adequately prepared. This confidence problem extends into professional practice. Although most web professionals agree that websites should be designed accessibly for people with disabilities, most rarely or only occasionally check the accessibility of the websites they build or manage. Professionals consistently report that accessibility work is often deprioritized due to project timelines and is hindered by complex tools and knowledge gaps, creating a persistent gap between professional values and actual practice.

While existing accessibility evaluation tools such as WAVE, AXE, and Google Lighthouse offer valuable assessment capabilities, these platforms are designed mainly as technical auditing instruments. They produce comprehensive reports aimed at professional compliance verification rather than educational support for beginners. These tools typically require browser extensions to work fully and generate output using specialized terminology. This creates additional barriers for students and beginners who already struggle with tool complexity and technical jargon. This educational gap is particularly concerning because research shows university websites continue to present substantial accessibility barriers. Students with disabilities encounter persistent difficulties accessing essential educational information and services due to non-compliant design practices. This highlights the need for academic institutions to ensure their digital platforms model inclusive accessibility standards (accessiBe, 2025).

The imperative for addressing these interconnected deficiencies gains validation from widespread recognition among both students and practitioners that web accessibility competency represents an essential dimension of professional development in contemporary web development practice. Despite the documented barriers to accessibility education, students demonstrate strong recognition that mastering accessibility competencies will enhance their capabilities as web developers (Appendix Figure 6). This intrinsic motivation for learning, when coupled with documented confidence deficits (Appendix Figure 6), persistent implementation gaps in professional practice (Appendix Figure 7), and the systemic absence of accessible evaluation tools, structured pedagogical pathways, and real-time developmental feedback (Appendix Figures 3–5), creates a compelling rationale for developing an educational platform specifically designed to address these multilayered competency gaps through integrated evaluation, instruction, and formative assessment capabilities.

As a result, the researcher intended to find a solution by developing a Web-Based Accessibility Evaluation Tool for Inclusive Web Design. This proposed system differs from existing tools by offering a simplified, educational, and locally deployable platform that automatically evaluates websites and codes based on selected WCAG 2.1 criteria. In direct response to the empirical findings, the goal is to provide plain-language technical explanations, step-by-step guidance, and actionable recommendations to make accessibility evaluations easier and promote compliance among students and professionals.

### Objectives of the Study

The general objective of this study is to design, develop, and evaluate a web-based accessibility evaluation tool that detects and explains common web accessibility issues according to selected WCAG 2.1 guidelines, with a focus on educational application.

To achieve this, the study aims to:

1. Identify the common accessibility problems experienced by web developers in terms of compliance with WCAG 2.1 standards, informed by empirical data on the barriers students face in learning and implementing accessibility features;

2. Analyze the WCAG 2.1 success criteria that should be included in the evaluation to ensure inclusivity for users with visual and hearing impairments, prioritizing criteria that address the most frequently encountered accessibility issues;

3. Design the project with features that provide accurate, user-friendly feedback in the form of plain-language explanations and recommendations to assist web developers in improving accessibility, specifically incorporating step-by-step explanations, practical examples, and simple language as identified through empirical research on learning preferences;

4. Develop the project using a suitable backend framework (such as PHP with MySQL) and front-end technologies (such as HTML, CSS, and JavaScript) to create a lightweight, locally deployable educational tool;

5. Evaluate the project based on ISO 25010 quality standards to ensure functionality, usability, and educational effectiveness; and

6. Prepare an implementation plan for the deployment of the project within academic institutions, particularly targeting environments where accessibility education is limited or absent.

### Purpose Description

The project aims to develop a Web-Based Accessibility Evaluation Tool that automatically detects accessibility issues on web pages according to selected WCAG 2.1 guidelines. The system is intended to assist developers and educational sectors in ensuring that online content adheres to inclusive design principles and to raise awareness, especially among beginner developers and non-experts.

The project has the following capabilities:

1. **Evaluation and Analysis**: It will analyze web page designs, identify accessibility violations, and provide clear corrective recommendations.

2. **Principle Checking**: It simplifies the evaluation process by automatically detecting issues related to the four WCAG 2.1 principles: Perceivable, Operable, Understandable, and Robust (POUR).

3. **Input Methods**: It will evaluate web pages through two primary inputs: URL-based input (where a user submits a website link) and direct HTML code input (where the user manually pastes code).

4. **Feedback Generation**: Beyond detection, the tool provides clear, plain-language explanations and actionable recommendations that help users understand the significance of each issue and how it impacts individuals with disabilities. This directly addresses the identified need for step-by-step explanations and simple language descriptions in accessibility education, ensuring that complex technical concepts are translated into comprehensible guidance suitable for learners at various levels of expertise.

5. **Issue Identification**: The system identifies common accessibility barriers such as missing alternative text, insufficient color contrast, improper heading structures, inaccessible forms, and broken keyboard navigation.

6. **Educational Features**: The system incorporates tutorials on accessibility guidelines, practice exercises, and examples aligned with WCAG criteria, directly responding to the learning preferences identified through empirical research on accessibility instruction. These features address the most frequently cited learning barriers including the lack of practical examples, absence of hands-on tools, and difficulty understanding guidelines. By providing comparative examples of accessible versus non-accessible design and instant feedback on code, the tool creates a comprehensive learning environment that supports both theoretical understanding and practical skill development.

### Time and Place of the Study

The time of the study starts on the day when the proposed project is approved, and the researcher starts the instruments for data gathering up to the day when the research is ready to present the results for the final defense. The place of the study is where the study will be conducted, which primarily includes the Department of Information Technology, College of Engineering and Information Technology, Cavite State University, Indang, Cavite.

### Scope and Limitation of the Study

The study focuses on the design and development of a Web-Based Accessibility Evaluation Tool that analyzes website content using selected parameters derived from WCAG 2.1 guidelines. The WCAG standard defines three levels of conformance: Level A (the minimum set of requirements for basic accessibility), Level AA (the standard recommended for all web content, which addresses the biggest and most common barriers for people with disabilities), and Level AAA (the highest level, which requires specialized support and is not typically achievable for all content). This project specifically targets the criteria within Levels A and AA, utilizing web technologies such as HTML, CSS, and JavaScript for the front-end interface and PHP with MySQL for backend processing and data management. Beyond its core evaluation functionality, the system integrates a Web Accessibility Awareness Assessment module designed to measure users' understanding of WCAG 2.1 principles and deliver personalized learning recommendations based on their performance.

The system operates through multiple integrated modules that support both practical evaluation and educational assessment. For accessibility evaluation, the tool accepts web pages through two primary input methods: website URL submission for remote scanning and direct HTML code input for local evaluation. The evaluation engine performs predefined accessibility checks including verification of alternative text for images, assessment of heading structure hierarchy, identification of unlabeled form elements, validation of descriptive link text, detection of missing page title or language attributes, and basic color contrast analysis. Evaluation results are presented through organized summaries that categorize issues by severity and WCAG principle, accompanied by plain-language explanations and actionable recommendations. Complementing the evaluation functionality, the Web Accessibility Awareness Assessment module presents structured questions organized according to the four POUR principles—Perceivable, Operable, Understandable, and Robust—to systematically measure users' comprehension of accessibility concepts. Upon completion, the assessment generates performance scores, classifies awareness levels, and provides personalized recommendations that direct users to specific WCAG guidelines requiring further study, thereby supporting both diagnostic evaluation and targeted educational reinforcement.

The scope of this study is grounded in empirical research on accessibility education, which systematically identified learning barriers and pedagogical preferences that informed the system's educational features. The tool addresses key challenges faced by students in accessibility education, including insufficient access to practical examples, limited availability of hands-on evaluation tools, difficulty understanding technical guidelines without pedagogical support, and restricted opportunities for classroom discussion and practice. By providing supplementary educational resources that extend learning beyond traditional classroom instruction, the system responds directly to documented student needs. The pedagogical design emphasizes step-by-step explanations, simplified language accessible to beginners, immediate feedback on both code evaluation and knowledge assessment, and structured pathways for progressive learning. This evidence-based approach ensures that system features align with actual learner needs rather than assumptions, creating an educational tool that bridges the gap between theoretical knowledge and practical accessibility implementation skills.

However, the system acknowledges several important limitations that define its intended scope and usage context. The tool functions as an educational evaluation and assessment platform rather than an automated repair system, identifying and explaining accessibility issues without automatically correcting them to preserve the learning opportunity for users. Technical constraints inherent to PHP-based parsing prevent the system from fully simulating assistive technology behavior or conducting deep analysis of complex CSS styling, JavaScript interactions, and advanced ARIA implementations that require browser runtime evaluation. System performance may be influenced by factors including the size and complexity of HTML structures being analyzed and internet connectivity stability during URL-based evaluations, while evaluation accuracy depends fundamentally on the validity of user-provided URLs or HTML code. The tool is purposefully designed for educational contexts serving beginners, students, and small-scale developers learning accessibility principles, rather than producing comprehensive enterprise-grade WCAG audit reports required for formal compliance certification. Recognizing these constraints of technology, scope, and available resources, the system's primary purpose remains delivering a lightweight, educationally-focused, and user-friendly platform that teaches accessibility evaluation through code inspection, structural interpretation, automated knowledge assessment, and clear, actionable recommendations that support progressive skill development.

### Conceptual Framework of the Study

Building upon the preceding concepts, theories, and findings from relevant literature and empirical survey data, a conceptual model is formulated, as illustrated below.

#### INPUT

**Knowledge Requirements:**

- Web Content Accessibility Guidelines 2.1 Principles
- Inclusive Web Design Practices
- Web Development Fundamentals
- Database Management
- Software Testing and Evaluation Standards (ISO 25010)

**Software Requirements:**

- Programming Language: PHP
- Database: MySQL
- Front-end Technologies: HTML, CSS, JavaScript
- Web Browser

**Hardware Requirements:**

- Personal Computer or Laptop
- Internet Connectivity

**Empirical Data:**

- Survey data from Information Technology students (45 respondents)
- Survey data from web development professionals (24 respondents)
- Identified learning barriers in web accessibility education
- Student learning preferences and pedagogical needs
- Confidence assessment data in accessibility implementation
- Curricular gap analysis in accessibility instruction

#### PROCESS

**DEVELOPMENT OF WEB-BASED ACCESSIBILITY EVALUATION TOOL FOR INCLUSIVE WEB DESIGN**

**Methodology: Agile Methodology**

**Requirement Analysis:**

- WCAG 2.1 Success Criteria
- Performance Requirements
- Educational Feature Requirements (based on accessibility education research)

**System Design:**

- UI/UX Design (emphasizing simplicity and educational value)
- Database Design
- System Flow
- Educational Module Design

**Development:**

- Front-end Implementation
- Back-end Implementation
- Database Integration
- Educational Content Development

**Testing:**

- Functional Testing
- Usability Testing
- Performance Testing
- ISO 25010 Evaluation

**Deployment:**

- System Deployment
- User Training
- Documentation

#### OUTPUT

**Web-Based Accessibility Evaluation Tool with:**

- Automated WCAG 2.1 compliance checking
- Plain-language explanations
- Step-by-step guidance
- Practical examples and tutorials
- Instant feedback mechanism
- Educational resources aligned with WCAG criteria

#### IMPACT

The successful completion of this study will enhance accessibility education in web development curricula by providing a practical learning tool for IT students and instructors, ultimately contributing to more accessible web development practices and a more inclusive digital environment. Specifically, the tool addresses the identified gaps in accessibility education by:

1. Providing integrated measurement and evaluation capabilities that enable students to assess accessibility compliance and validate their implementations through hands-on checking tools
2. Delivering structured step-by-step instructional guidance through tutorials, modular lessons, and progressive learning pathways that build foundational knowledge systematically
3. Offering real-time feedback mechanisms with instant validation, simple language error explanations, and benchmark examples that support iterative learning and skill refinement
4. Bridging the gap between theoretical knowledge and practical implementation through concrete examples demonstrating accessible versus non-accessible design aligned with WCAG criteria
5. Supplementing classroom instruction with accessible educational resources that simplify complex guidelines and provide scaffolded learning experiences
6. Supporting students who recognize that accessibility skills are essential for professional development by providing the tools and guidance necessary to develop practical competency
7. Creating an educationally-focused platform that transforms accessibility from an abstract concept into achievable skills through practice exercises and immediate validation

By systematically addressing the three critical deficiencies identified through empirical research—measurement difficulties, inadequate instructional guidance, and lack of real-time feedback—the tool is positioned to significantly improve accessibility education outcomes, increase student confidence in implementing accessible design, and ultimately contribute to a more inclusive digital ecosystem through the development of accessibility-competent web developers.

**Figure 1.** Conceptual framework of Development of Web-Based Accessibility Evaluation Tool for Inclusive Web Design

### Definition of Terms

**Web Accessibility** - the practice of ensuring websites are usable by people with disabilities, including those using assistive technologies like screen readers or keyboard navigation.

**Web Content Accessibility Guidelines (WCAG)** - globally recognized, technical standard developed by the W3C (World Wide Web Consortium) that defines the specific success criteria (A, AA, AAA) used as the foundational rule set for the evaluation engine of the developed tool.

**Accessibility Evaluation** - process of assessing how well a website meets accessibility standards and guidelines.

**Digital Divide** - socioeconomic and technological inequality defined by the lack of access to, or skills for, using digital technologies, which this project aims to narrow by focusing on the exclusion caused by inaccessible web design for people with disabilities.

**Plain-Language Explanation** - simplified, non-technical description of accessibility issues and their solutions, designed to make complex WCAG criteria understandable for beginners and students.

**Educational Tool** - a software application specifically designed to facilitate learning and skill development, in this context focusing on web accessibility principles and implementation.
