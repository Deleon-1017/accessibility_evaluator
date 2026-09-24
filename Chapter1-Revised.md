# DEVELOPMENT OF WEB-BASED ACCESSIBILITY EVALUATION TOOL FOR INCLUSIVE WEB DESIGN

**DE LEON, GABRIEL IAN B.**

An undergraduate capstone project outline submitted to the faculty of the Department of Information Technology, College of Engineering and Information Technology, Cavite State University, Indang, Cavite in partial fulfillment of the requirements for the degree of Bachelor of Science in Information Technology with Contribution No. _______. Prepared under the supervision of _______.

---

## INTRODUCTION

### Project Context

The digital environment has evolved into the primary infrastructure for education, employment, business, and social interaction, with recent data indicating that approximately 5.5 billion people, or 68% of the global population, are now online. As the global population depends increasingly on this environment, it becomes critical to ensure that every individual has equal access to technology, particularly as internet usage in high-income countries has reached near-universality at 93% (International Telecommunication Union, 2024). However, a significant digital divide persists, where digital content often remains inaccessible to the 1.3 billion people—approximately 16% of the world's population—who live with significant disabilities. Websites serve as essential platforms for information dissemination, communication, and online services; thus, to implement this efficiently, web accessibility is necessary. By promoting accessible web design, this project supports a technology-driven approach to reducing digital disparity and ensuring that online services are inclusive, contributing to a more equitable digital society where every user can participate meaningfully regardless of physical limitations (World Health Organization, 2023).

This research is focused on developing an educational tool primarily aimed at assisting students and instructors in learning and implementing inclusive design practices within an academic setting. The assumed primary locale for deployment and as a key beneficiary is the Department of Information Technology, College of Engineering and Information Technology, Cavite State University. This organization can integrate the system into its curriculum to demonstrate the importance of building digital platforms that are inclusive and compliant with established standards. To establish the empirical foundation for this study, survey data was gathered from two distinct populations: 45 Information Technology students and 24 web development professionals. This dual-perspective approach provides comprehensive insights into both the educational needs of learners and the practical requirements of the professional field, ensuring that the proposed tool addresses real-world competency gaps while remaining pedagogically sound.

Despite the existence of established standards, a persistent lack of accessible websites remains the primary problem addressed by this study. Inaccessible websites create barriers that exclude individuals with disabilities from vital online information, services, and opportunities, a critical issue given that companies with inaccessible sites are estimated to lose billions annually to competitors who prioritize inclusivity (accessiBe, 2025). To address this global need, the World Wide Web Consortium (W3C) established the Web Content Accessibility Guidelines (WCAG), currently in version 2.1, which serves as the global standard for building accessible digital content.

This problem is compounded because many students in academic programs lack the necessary tools or awareness to make their websites inclusive. Empirical data gathered from Information Technology students reveals a concerning disparity between awareness and competency in web accessibility. While approximately 64% of student respondents indicated familiarity with the concept of web accessibility, only 38% reported receiving formal instruction on designing accessible websites. This substantial gap between awareness and formal education suggests that students are encountering accessibility concepts informally or superficially without structured pedagogical support. Complementary data from web development professionals indicates that awareness of web accessibility exists in the professional field; however, the translation of this awareness into formal educational structures for students remains inadequate.

More critically, confidence levels in creating accessible websites remain alarmingly low among students. When asked about their confidence in creating websites accessible to all users, only 6.7% expressed being very confident, while 17.8% reported being confident. The majority—51.1%—remained neutral, indicating uncertainty about their capabilities, while 22.2% admitted to not being confident, and 2.2% expressed no confidence at all. Cumulatively, over 75% of students lack strong confidence in their ability to implement accessibility features, underscoring a significant gap between awareness and practical competency in web accessibility.

Multiple barriers to learning web accessibility have been systematically identified through empirical investigation. The most prevalent difficulty cited by students is the lack of practical examples, reported by 42.2% of respondents, which represents the highest barrier to effective learning. This is closely followed by limited discussion of accessibility topics in class, identified by 40% of students, indicating that curricular integration of accessibility principles remains insufficient. Additionally, 26.7% of students struggle with the absence of hands-on tools for checking accessibility, while an equal proportion remain unfamiliar with accessibility concepts altogether. Furthermore, 24.4% find the technical guidelines difficult to understand without proper pedagogical support. These findings reveal that the educational challenge is multifaceted, encompassing both pedagogical gaps—such as insufficient classroom coverage and lack of practical examples—and the absence of appropriate learning tools that can bridge the gap between theoretical knowledge and practical application.

While existing accessibility tools such as WAVE, AXE, and Google Lighthouse are currently available, most are designed for professional use and produce highly technical reports. These tools often require web browser extensions and familiarity with complex developer tools, making them cumbersome for use in a structured academic learning environment. Recent studies indicate that university websites continue to face significant accessibility challenges, with students with disabilities struggling to access essential educational information due to non-compliant design (accessiBe, 2025).

The existing professional tools also lack the essential educational components necessary to help students and faculty understand the meaning of accessibility errors and how to fix them in a pedagogical context. Empirical investigation into student learning preferences reveals clear pedagogical requirements for effective accessibility education. When asked which approaches would help them learn web accessibility better, students identified step-by-step explanations as the most critical feature, with 77.8% of respondents selecting this option. This was followed by examples of accessible versus non-accessible design (40%), simple language explanations (37.8%), feedback on their website code (35.6%), and automated accessibility checking (33.3%). These findings indicate that students require scaffolded learning experiences that progressively build understanding through clear explanations, comparative examples, and immediate feedback mechanisms.

Furthermore, when asked about specific learning features that should be included in an accessibility education system, students prioritized tutorials on accessibility guidelines (selected by 36 respondents), practice exercises (33 respondents), examples aligned with WCAG criteria (20 respondents), short lessons per accessibility rule (20 respondents), and instant feedback on errors (18 respondents). This data demonstrates a clear preference for structured, modular learning experiences that combine theoretical instruction with practical application and immediate validation. The gap between what students need—simplified, educational, and easy-to-use tools with pedagogical scaffolding—and what currently exists represents the felt problem for students and instructors struggling to effectively teach or apply complex WCAG standards. The focus is therefore on transforming complex accessibility standards into comprehensible and practical guidance tailored for the educational environment.

The importance of addressing this gap is further validated by the widespread recognition among students that learning web accessibility is essential for professional development. When asked whether learning web accessibility would make them better web developers, only one student strongly disagreed, while four disagreed. Fifteen students remained neutral, but the overwhelming majority—25 students—agreed or strongly agreed with this statement. This demonstrates a clear recognition of the professional value of accessibility competencies despite the current barriers to acquiring them. The strong agreement on the importance of accessibility skills, combined with the low confidence levels in implementing these skills, creates a compelling rationale for developing an educational tool that bridges this competency gap.

As a result, the researcher intended to find a solution by developing a Web-Based Accessibility Evaluation Tool for Inclusive Web Design. This proposed system differs from existing tools by offering a simplified, educational, and locally deployable platform that automatically evaluates websites based on selected WCAG 2.1 criteria. The goal is to provide plain-language technical explanations and actionable recommendations to make accessibility evaluations easier and promote compliance among students and instructors. The system design is directly informed by empirical data on student learning preferences, prioritizing tutorials on accessibility guidelines, practice exercises, examples aligned with WCAG criteria, short lessons per accessibility rule, and instant feedback on errors—all features identified as critical for effective accessibility education. By addressing the specific barriers students face—lack of practical examples, absence of hands-on checking tools, difficulty understanding guidelines, and limited classroom discussion—the proposed tool aims to create a comprehensive educational solution that transforms accessibility education from a theoretical concept into a practical, achievable competency.

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

4. **Feedback Generation**: Beyond detection, the tool provides clear, plain-language explanations and actionable recommendations that help users understand the significance of each issue and how it impacts individuals with disabilities. This directly addresses the identified need for step-by-step explanations (prioritized by 77.8% of students) and simple language explanations (37.8% of students) in accessibility education, ensuring that complex technical concepts are translated into comprehensible guidance suitable for learners at various levels of expertise.

5. **Issue Identification**: The system identifies common accessibility barriers such as missing alternative text, insufficient color contrast, improper heading structures, inaccessible forms, and broken keyboard navigation.

6. **Educational Features**: The system incorporates tutorials on accessibility guidelines, practice exercises, and examples aligned with WCAG criteria, directly responding to the learning preferences identified through empirical research on accessibility instruction. These features address the most frequently cited learning barriers: the lack of practical examples (42.2% of students), absence of hands-on tools (26.7%), and difficulty understanding guidelines (24.4%). By providing comparative examples of accessible versus non-accessible design (requested by 40% of students) and instant feedback on code (requested by 35.6%), the tool creates a comprehensive learning environment that supports both theoretical understanding and practical skill development.

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

1. Providing practical examples that 42.2% of students identified as lacking in current curricula, thereby addressing the most prevalent learning barrier
2. Offering hands-on checking tools that facilitate experiential learning, responding to the needs of 26.7% of students who cited this as a difficulty
3. Simplifying complex guidelines through pedagogically sound explanations, addressing the 24.4% of students who find guidelines difficult to understand
4. Delivering step-by-step guidance that aligns with the learning preferences of 77.8% of students who identified this as their preferred learning approach
5. Supporting students who recognize that accessibility skills are essential for professional development, as evidenced by the overwhelming agreement (25 out of 45 respondents) that accessibility knowledge will make them better web developers
6. Supplementing classroom instruction to address the 40% of students who identified limited discussion in class as a barrier to learning accessibility
7. Providing instant feedback mechanisms and practice exercises that enable iterative learning and skill refinement, responding to the 35.6% of students who requested feedback on their website code

By systematically addressing these empirically validated needs, the tool is positioned to significantly improve accessibility education outcomes, increase student confidence in implementing accessible design, and ultimately contribute to a more inclusive digital ecosystem through the development of accessibility-competent web developers.

**Figure 1.** Conceptual framework of Development of Web-Based Accessibility Evaluation Tool for Inclusive Web Design

### Definition of Terms

**Web Accessibility** - the practice of ensuring websites are usable by people with disabilities, including those using assistive technologies like screen readers or keyboard navigation.

**Web Content Accessibility Guidelines (WCAG)** - globally recognized, technical standard developed by the W3C (World Wide Web Consortium) that defines the specific success criteria (A, AA, AAA) used as the foundational rule set for the evaluation engine of the developed tool.

**Accessibility Evaluation** - process of assessing how well a website meets accessibility standards and guidelines.

**Digital Divide** - socioeconomic and technological inequality defined by the lack of access to, or skills for, using digital technologies, which this project aims to narrow by focusing on the exclusion caused by inaccessible web design for people with disabilities.

**Plain-Language Explanation** - simplified, non-technical description of accessibility issues and their solutions, designed to make complex WCAG criteria understandable for beginners and students.

**Educational Tool** - a software application specifically designed to facilitate learning and skill development, in this context focusing on web accessibility principles and implementation.
