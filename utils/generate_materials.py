"""
Generates simple, original study-notes PDFs for each resource category.
Run once with: python3 generate_materials.py
Output goes into public/materials/
"""
import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "materials")
os.makedirs(OUT_DIR, exist_ok=True)

styles = getSampleStyleSheet()
title_style = ParagraphStyle("TitleStyle", parent=styles["Title"], textColor=colors.HexColor("#2f2361"))
h2_style = ParagraphStyle("H2Style", parent=styles["Heading2"], textColor=colors.HexColor("#4736a3"), spaceBefore=14)
body_style = ParagraphStyle("BodyStyle", parent=styles["Normal"], fontSize=10.5, leading=15)
bullet_style = ParagraphStyle("BulletStyle", parent=styles["Normal"], fontSize=10.5, leading=15)


def build_pdf(filename, title, sections):
    doc = SimpleDocTemplate(
        os.path.join(OUT_DIR, filename),
        pagesize=letter,
        topMargin=0.7 * inch,
        bottomMargin=0.7 * inch,
        leftMargin=0.75 * inch,
        rightMargin=0.75 * inch,
    )
    story = [Paragraph(title, title_style), Spacer(1, 6),
             Paragraph("PlacementPrep Study Notes", body_style), Spacer(1, 16)]

    for heading, intro, points in sections:
        story.append(Paragraph(heading, h2_style))
        if intro:
            story.append(Paragraph(intro, body_style))
            story.append(Spacer(1, 4))
        items = [ListItem(Paragraph(p, bullet_style), leftIndent=8) for p in points]
        story.append(ListFlowable(items, bulletType="bullet", start="circle"))
        story.append(Spacer(1, 8))

    doc.build(story)
    print(f"Created {filename}")


# ---------------- Aptitude ----------------
build_pdf(
    "aptitude-notes.pdf",
    "Aptitude — Quick Reference Notes",
    [
        ("1. Time, Speed & Distance", "Core relation: Speed = Distance / Time.", [
            "Convert km/hr to m/s by multiplying by 5/18, and m/s to km/hr by multiplying by 18/5.",
            "For a train crossing a pole, distance = length of train.",
            "For a train crossing a platform, distance = length of train + length of platform.",
            "Average speed for equal distances at speeds a and b = 2ab / (a + b).",
        ]),
        ("2. Time & Work", "Work done is inversely proportional to time taken.", [
            "If A can do a job in 'x' days, A's one-day work = 1/x.",
            "Combined one-day work of A and B = 1/x + 1/y.",
            "Total time for both working together = 1 / (combined one-day work).",
        ]),
        ("3. Percentages, Profit & Loss", "Percentage change = (Change / Original value) x 100.", [
            "Profit % = (Profit / Cost Price) x 100.",
            "Loss % = (Loss / Cost Price) x 100.",
            "Selling Price = Cost Price x (1 + Profit% / 100).",
        ]),
        ("4. Simple & Compound Interest", "SI = (Principal x Rate x Time) / 100.", [
            "Amount in Compound Interest = P x (1 + R/100)^T.",
            "For the same rate and time, Compound Interest is always greater than or equal to Simple Interest.",
        ]),
        ("5. Ratio & Proportion, Averages", "Ratio compares two quantities of the same kind.", [
            "If a:b = m:n, then a/b = m/n.",
            "Average = Sum of observations / Number of observations.",
        ]),
        ("Practice Tip", None, [
            "Time yourself: aim for under 60 seconds per aptitude question in a mock test.",
            "Memorize squares up to 30 and cubes up to 15 to speed up calculations.",
        ]),
    ],
)

# ---------------- Coding ----------------
build_pdf(
    "coding-notes.pdf",
    "Coding — Data Structures & Algorithms Notes",
    [
        ("1. Time Complexity Basics", "Big-O describes how runtime grows with input size 'n'.", [
            "O(1) constant, O(log n) logarithmic, O(n) linear, O(n log n), O(n^2) quadratic.",
            "Binary search on a sorted array runs in O(log n).",
            "Nested loops over the same input typically give O(n^2).",
        ]),
        ("2. Arrays & Strings", "Most interview problems start here — know these patterns.", [
            "Two-pointer technique: useful for sorted array pair-sum problems.",
            "Sliding window: useful for subarray/substring problems with a size or sum constraint.",
            "Prefix sums: precompute cumulative sums for fast range-sum queries.",
        ]),
        ("3. Stacks & Queues", "Stack = LIFO (Last In, First Out). Queue = FIFO (First In, First Out).", [
            "Stacks are used for balanced parentheses checks and undo operations.",
            "Queues are used in breadth-first search (BFS) and task scheduling.",
        ]),
        ("4. Trees & Graphs", "A Binary Search Tree keeps left < root < right at every node.", [
            "Inorder traversal of a BST gives elements in sorted order.",
            "BFS explores level by level using a queue; DFS explores depth-first using a stack or recursion.",
        ]),
        ("5. Dynamic Programming", "Break a problem into overlapping subproblems and store results.", [
            "Memoization: top-down, caches results of recursive calls.",
            "Tabulation: bottom-up, fills a table iteratively.",
            "Classic examples: Fibonacci, Knapsack, Longest Common Subsequence.",
        ]),
        ("Practice Tip", None, [
            "Always state the time and space complexity out loud when solving a problem in an interview.",
            "Practice explaining your approach before writing code — interviewers value clear thinking.",
        ]),
    ],
)

# ---------------- Core CS ----------------
build_pdf(
    "core-cs-notes.pdf",
    "Core CS — OOP, DBMS, OS & Networks Notes",
    [
        ("1. Object-Oriented Programming (OOP)", "Four pillars every interviewer expects you to explain with examples.", [
            "Encapsulation: bundling data and methods, restricting direct access to internal state.",
            "Abstraction: exposing only essential features, hiding implementation detail.",
            "Inheritance: a class acquiring properties/behavior of another class.",
            "Polymorphism: same interface, different underlying behavior (overloading/overriding).",
        ]),
        ("2. DBMS — Normalization", "Normalization reduces data redundancy and improves integrity.", [
            "1NF: atomic column values, no repeating groups.",
            "2NF: 1NF + no partial dependency on a composite key.",
            "3NF: 2NF + no transitive dependency on non-key attributes.",
            "BCNF: stricter version of 3NF for certain edge cases with multiple candidate keys.",
        ]),
        ("3. Operating Systems", "Know process scheduling, memory management, and deadlocks.", [
            "FIFO page replacement can suffer from Belady's Anomaly (more frames, more page faults).",
            "Deadlock requires 4 conditions: mutual exclusion, hold and wait, no preemption, circular wait.",
            "Breaking any one of the four conditions can prevent a deadlock.",
        ]),
        ("4. Computer Networks", "Focus on the OSI/TCP-IP layers and common protocols.", [
            "TCP/IP model layers: Application, Transport, Internet, Link.",
            "The Internet layer handles logical addressing and routing (IP).",
            "TCP is connection-oriented and reliable; UDP is connectionless and faster but unreliable.",
        ]),
        ("Practice Tip", None, [
            "Draw diagrams (ER diagrams, OSI layers) on paper/whiteboard when explaining — it shows clarity.",
            "Relate concepts to a project you've built, e.g., 'I used normalization in my DB design for...'.",
        ]),
    ],
)

# ---------------- HR ----------------
build_pdf(
    "hr-notes.pdf",
    "HR Interview — Preparation Notes",
    [
        ("1. Tell Me About Yourself", "Structure your answer: Present -> Past -> Future.", [
            "Present: your current role/degree and key skill area.",
            "Past: a relevant achievement or project that shaped your interest.",
            "Future: why you're excited about this specific role/company.",
        ]),
        ("2. The STAR Technique", "Used to answer behavioral questions with a clear structure.", [
            "Situation: briefly set the context.",
            "Task: what you were responsible for.",
            "Action: the specific steps YOU took.",
            "Result: the outcome, ideally with a measurable impact.",
        ]),
        ("3. Common Questions & Approach", "Prepare structured answers, not memorized scripts.", [
            "'What is your biggest weakness?' — share a genuine one plus the steps you're taking to improve.",
            "'Why should we hire you?' — connect your specific skills to the role's specific needs.",
            "'Where do you see yourself in 5 years?' — show ambition aligned with realistic growth in the field.",
        ]),
        ("4. Salary Negotiation Basics", "Preparation and research matter more than a specific number.", [
            "Research the market rate for the role and location beforehand.",
            "Let the employer bring up salary first where possible.",
            "It is acceptable to ask for time to consider an offer.",
        ]),
        ("Practice Tip", None, [
            "Practice answers out loud, not just in your head — timing and tone matter.",
            "Keep answers to 60-90 seconds; avoid rambling.",
        ]),
    ],
)

# ---------------- Communication ----------------
build_pdf(
    "communication-notes.pdf",
    "Communication & Group Discussion Notes",
    [
        ("1. Group Discussion Etiquette", "Evaluators watch how you engage, not just what you say.", [
            "Make a strong opening or closing statement if possible — both are memorable.",
            "Build on others' points respectfully instead of only pushing your own view.",
            "Avoid interrupting or talking over others — it is viewed very negatively.",
        ]),
        ("2. Active Listening", "Listening well is as important as speaking well.", [
            "Paraphrase what the other person said before responding, to confirm understanding.",
            "Maintain eye contact and avoid distractions like checking your phone.",
            "Don't just plan your reply while others are speaking — actually listen first.",
        ]),
        ("3. Body Language & Non-Verbal Cues", "Non-verbal signals should reinforce your spoken message.", [
            "Sit upright, maintain natural eye contact, and avoid crossed arms.",
            "A firm handshake and a smile create a strong first impression.",
        ]),
        ("4. Professional Email Writing", "Recruiters judge professionalism from your very first email.", [
            "Use a clear, specific subject line.",
            "Start with a proper greeting (e.g., 'Dear Ms. Sharma,' or 'To the Recruitment Team,').",
            "Keep the email concise, proofread before sending, and sign off with your full name.",
        ]),
        ("5. Explaining Technical Topics Simply", "A key skill for both interviews and workplace communication.", [
            "Use analogies to relate technical concepts to everyday ideas.",
            "Avoid unnecessary jargon when speaking to a non-technical audience.",
        ]),
        ("Practice Tip", None, [
            "Record yourself answering a common question and review your filler words ('um', 'like').",
            "Practice a 2-minute self-introduction until it feels natural, not memorized.",
        ]),
    ],
)

print("\nAll 5 PDFs generated successfully in public/materials/")
