
import React, { useEffect, useMemo, useRef, useState } from "react";

function escapeHtml(str="") {
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}
function formatPartSpacing(str="") {
  return String(str).replace(/([.:?])\s+\(([a-j])\)\s+/g, "$1\n\n($2) ");
}
function loadKatex(cb) {
  if (typeof window === "undefined") return;
  if (window.renderMathInElement) { cb(); return; }
  const existing = document.querySelector('script[data-katex="auto-render"]');
  if (existing) { existing.addEventListener("load", cb, { once:true }); return; }
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css";
  document.head.appendChild(link);
  const s1 = document.createElement("script");
  s1.src = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js";
  s1.onload = () => {
    const s2 = document.createElement("script");
    s2.src = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js";
    s2.dataset.katex = "auto-render";
    s2.onload = cb;
    document.head.appendChild(s2);
  };
  document.head.appendChild(s1);
}
function MathBlock({ text, mono=false }) {
  const ref = useRef(null);
  const safe = useMemo(() => escapeHtml(formatPartSpacing(text)).replace(/\n/g,"<br/>"), [text]);
  useEffect(() => {
    loadKatex(() => {
      if (ref.current && window.renderMathInElement) {
        window.renderMathInElement(ref.current, {
          delimiters: [
            { left:"$$", right:"$$", display:true },
            { left:"$", right:"$", display:false },
          ],
          throwOnError:false,
        });
      }
    });
  }, [safe]);
  return <span ref={ref} style={{ whiteSpace:"normal", fontFamily:mono?"var(--font-mono)":undefined }} dangerouslySetInnerHTML={{ __html:safe }} />;
}

const C = { indigo:"#4338CA", indigoBg:"#EEF2FF", teal:"#0F6E56", tealBg:"#E1F5EE", amber:"#854F0B", amberBg:"#FAEEDA", blue:"#185FA5", blueBg:"#E6F1FB", red:"#A32D2D", redBg:"#FCEBEB", purple:"#3C3489", purpleBg:"#EEEDFE", coral:"#993C1D", coralBg:"#FAECE7", gray:"#5F5E5A", grayBg:"#F1EFE8" };
const S = {
  app:{ minHeight:"100vh", background:"var(--color-background-tertiary)", fontFamily:"var(--font-sans)", color:"var(--color-text-primary)" },
  header:{ background:"var(--color-background-primary)", borderBottom:"0.5px solid var(--color-border-tertiary)", padding:"1rem 1.5rem", display:"flex", gap:"12px", alignItems:"center", position:"sticky", top:0, zIndex:10 },
  content:{ maxWidth:"1120px", margin:"0 auto", padding:"1.25rem 1.5rem 2.5rem" },
  card:{ background:"var(--color-background-primary)", border:"0.5px solid var(--color-border-tertiary)", borderRadius:"var(--border-radius-lg)", padding:"1rem 1.15rem", marginBottom:"12px", boxShadow:"0 1px 2px #00000008" },
  tabBar:{ background:"var(--color-background-primary)", borderBottom:"0.5px solid var(--color-border-tertiary)", padding:"0 1.5rem", display:"flex", overflowX:"auto", position:"sticky", top:"65px", zIndex:9 },
  tab:a=>({ padding:"0.75rem 1rem", border:"none", borderBottom:a?`2px solid ${C.indigo}`:"2px solid transparent", background:"transparent", cursor:"pointer", whiteSpace:"nowrap", fontSize:"13px", color:a?"var(--color-text-primary)":"var(--color-text-secondary)", fontWeight:a?600:400 }),
  btn:(v="primary", color=C.indigo)=>({ padding:"0.46rem 0.9rem", borderRadius:"var(--border-radius-md)", border:v==="primary"?"none":"0.5px solid var(--color-border-secondary)", background:v==="primary"?color:"var(--color-background-primary)", color:v==="primary"?"#fff":"var(--color-text-primary)", cursor:"pointer", fontSize:"13px", fontWeight:500 }),
  pill:(color,bg)=>({ display:"inline-flex", alignItems:"center", gap:"4px", background:bg, color, border:`0.5px solid ${color}35`, borderRadius:"999px", padding:"2px 8px", fontSize:"11px", fontWeight:600, whiteSpace:"nowrap" }),
  alert:(color,bg)=>({ background:bg, color, border:`0.5px solid ${color}45`, borderLeft:`4px solid ${color}`, borderRadius:"var(--border-radius-md)", padding:"0.8rem 1rem", fontSize:"13px", lineHeight:1.65, marginBottom:"1rem" }),
  input:{ width:"100%", minHeight:"120px", resize:"vertical", border:"0.75px solid var(--color-border-secondary)", borderRadius:"var(--border-radius-md)", padding:"0.8rem", fontSize:"13px", lineHeight:1.55, background:"var(--color-background-primary)", color:"var(--color-text-primary)" },
};
function Pill({ color=C.indigo, bg=C.indigoBg, children }) { return <span style={S.pill(color,bg)}>{children}</span>; }

const MODULES = [
  {
    "week": "Week 1",
    "lectures": "Lectures 1-2",
    "title": "Probability, Statistics, Counting, Sets",
    "color": "#5F5E5A",
    "bg": "#F1EFE8",
    "focus": "Use this when the problem is about counting equally likely outcomes, sample spaces, set operations, or probability vs statistics.",
    "formulas": [
      [
        "Equally likely probability",
        "$$P(A)=\\frac{|A|}{|\\Omega|}$$",
        "Use when every outcome in the sample space has the same probability."
      ],
      [
        "With replacement, order matters",
        "$$n^k$$",
        "Use when you choose k times, items can repeat, and order matters."
      ],
      [
        "Without replacement, order matters",
        "$$\\frac{n!}{(n-k)!}$$",
        "Permutation. Use when selected items cannot repeat and different orders count separately."
      ],
      [
        "Without replacement, order does not matter",
        "$$\\binom{n}{k}=\\frac{n!}{(n-k)!k!}$$",
        "Combination. Use when only the group matters."
      ],
      [
        "With replacement, order does not matter",
        "$$\\binom{n+k-1}{k}$$",
        "Stars and bars. Use when repeats allowed but order ignored."
      ],
      [
        "Union of two events",
        "$$P(A\\cup B)=P(A)+P(B)-P(A\\cap B)$$",
        "Use for OR / at least one when A and B may overlap."
      ],
      [
        "Complement",
        "$$P(A^c)=1-P(A)$$",
        "Use for NOT, none, or at least one problems."
      ],
      [
        "De Morgan",
        "$$(A\\cup B)^c=A^c\\cap B^c,\\quad (A\\cap B)^c=A^c\\cup B^c$$",
        "Use to translate neither / not both."
      ]
    ],
    "example": {
      "source": "Week 1 lecture example",
      "prompt": "EXAMPLE: A bioengineering lab has 5 distinct cells: $C_1,C_2,C_3,C_4,C_5$. The lab selects 3 cells for analysis. In how many ways can you select these cells provided that (a) You replace the cells and the order matters (b) You do NOT replace and the order matters (Permutations) (c) You do NOT replace and the order does NOT matter (Combinations) (d) You replace and the order does NOT matter",
      "solution": "Step 1: Match each part to the counting rule.\n\n(a) Replacement allowed and order matters, so use $n^k$: $5^3=125$.\n\n(b) No replacement and order matters, so use permutations: $5\\cdot4\\cdot3=60=5!/(5-3)!$.\n\n(c) No replacement and order does not matter, so use combinations: $\\binom{5}{3}=10$.\n\n(d) Replacement allowed and order does not matter, so use stars and bars: $\\binom{5+3-1}{3}=\\binom{7}{3}=35$."
    },
    "practice": {
      "source": "Homework 1 Problem 1",
      "prompt": "Problem 1 [16 points]. A bioengineering laboratory tests 120 patient blood samples for two biomarkers associated with early cancer detection. The following sets are defined as: $A$: samples where biomarker A is detected; $B$: samples where biomarker B is detected; $\\Omega$: the set of all tested samples. Suppose that $|A|=50$, $|B|=40$, and $|A\\cap B|=15$. (a) Find the number of samples in $A\\cup B$. (b) Describe in words what the set $A^c$ represents and calculate the number of samples in this set. (c) Describe in words what the set $A\\setminus B$ represents and calculate the number of samples in this set. (d) Find the number of samples where neither biomarker is detected.",
      "answer": "(a) $|A\\cup B|=|A|+|B|-|A\\cap B|=50+40-15=75$.\n\n(b) $A^c$ means samples where biomarker A is not detected. $|A^c|=120-50=70$.\n\n(c) $A\\setminus B$ means samples where biomarker A is detected but biomarker B is not detected. $|A\\setminus B|=50-15=35$.\n\n(d) Neither biomarker: $120-|A\\cup B|=120-75=45$."
    }
  },
  {
    "week": "Week 2",
    "lectures": "Lectures 3-4",
    "title": "Probability Spaces, Conditional Probability, Bayes",
    "color": "#0F6E56",
    "bg": "#E1F5EE",
    "focus": "Use this when the problem says given, among, conditional, test positive, partition, subgroup, or asks whether events are independent.",
    "formulas": [
      [
        "Probability space",
        "$$(\\Omega,\\mathcal F,P)$$",
        "Omega is all outcomes, F is the set of events, and P assigns probabilities."
      ],
      [
        "Conditional probability",
        "$$P(A|B)=\\frac{P(A\\cap B)}{P(B)}$$",
        "Use whenever B is already known to have happened."
      ],
      [
        "Multiplication rule",
        "$$P(A\\cap B)=P(A|B)P(B)=P(B|A)P(A)$$",
        "Use for AND when conditional probabilities are given."
      ],
      [
        "Law of total probability",
        "$$P(A)=\\sum_i P(A|B_i)P(B_i)$$",
        "Use when the population is split into groups/lines/subtypes."
      ],
      [
        "Bayes' rule",
        "$$P(B_j|A)=\\frac{P(A|B_j)P(B_j)}{\\sum_i P(A|B_i)P(B_i)}$$",
        "Use to flip conditioning, especially positive-test questions."
      ],
      [
        "Independence",
        "$$P(A\\cap B)=P(A)P(B)$$",
        "Equivalent to $P(A|B)=P(A)$ when $P(B)>0$."
      ],
      [
        "Conditional independence",
        "$$P(A\\cap B|C)=P(A|C)P(B|C)$$",
        "Use when independent only within a subgroup C; may fail overall."
      ]
    ],
    "example": {
      "source": "Week 2 lecture example",
      "prompt": "EXAMPLE: A single cell from a tumor is analyzed using sequencing. For this cell, we record: Mutation status in a cancer gene: $M$ (mutation detected), $N$ (no mutation). Expression level of the same gene: $H$ (high expression), $L$ (low expression). (a) List all possible outcomes in the sample space $\\Omega=\\{(\\text{Mutation Status},\\text{Expression level})\\}$. (b) State whether each is an outcome or an event: $(M,H)$, $\\{(M,H),(M,L)\\}$, $(N,L)$, $\\{(M,H)\\}$. (c) Define the following events as sets of outcomes: $A$: the cell carries a mutation; $B$: the gene is highly expressed; $C$: the cell has a mutation OR high expression; $D$: the cell has a mutation AND low expression. (d) Write and interpret $A\\cap B$ and $A^c$. (e) Evaluate the relationship between $\\{(M,H)\\}$ and $A$.",
      "solution": "Step 1: List every mutation-expression pair: $\\Omega=\\{(M,H),(M,L),(N,H),(N,L)\\}$.\n\nStep 2: Classify outcomes versus events. $(M,H)$ and $(N,L)$ are single outcomes. $\\{(M,H),(M,L)\\}$ and $\\{(M,H)\\}$ are events because they are sets of outcomes.\n\nStep 3: Write the requested events as sets: $A=\\{(M,H),(M,L)\\}$, $B=\\{(M,H),(N,H)\\}$, $C=A\\cup B=\\{(M,H),(M,L),(N,H)\\}$, and $D=\\{(M,L)\\}$.\n\nStep 4: Interpret the set operations. $A\\cap B=\\{(M,H)\\}$ means mutation and high expression. $A^c=\\{(N,H),(N,L)\\}$ means no mutation.\n\nStep 5: Compare the singleton event with $A$: $\\{(M,H)\\}\\subset A$."
    },
    "practice": {
      "source": "Midterm 1 Problem 1",
      "prompt": "Problem 1 [18 points]. In a bioengineering study, a diagnostic device is manufactured using two different assembly lines. Approximately 25% of devices are produced using Line 1, while the remaining 75% are produced using Line 2. Each device is evaluated for two performance outcomes: whether it produces a high signal response and whether it achieves low measurement noise. For devices produced on Line 1, 60% produce a high signal response and 50% achieve low measurement noise. For devices produced on Line 2, 20% produce a high signal response and 30% achieve low measurement noise. It is known that, within each assembly line, the two performance outcomes are independent. (a) What is the probability that a device from Line 1 produces both a high signal response and achieves low measurement noise? (b) What is the overall probability that a randomly selected device produces both a high signal response and achieves low measurement noise? (c) What is the overall probability that a randomly selected device achieves low measurement noise? (d) Among devices that achieve low measurement noise, what fraction also produce a high signal response? (e) Based on your result in part (d), determine whether the two performance outcomes are independent in the overall population. Briefly justify your answer.",
      "answer": "(a) For Line 1, independence gives $0.60(0.50)=0.30$.\n\n(b) For Line 2, the AND probability is $0.20(0.30)=0.06$, so overall $P(A\\cap B)=0.30(0.25)+0.06(0.75)=0.12$.\n\n(c) $P(B)=0.50(0.25)+0.30(0.75)=0.35$.\n\n(d) $P(A|B)=P(A\\cap B)/P(B)=0.12/0.35\\approx0.343$.\n\n(e) Not independent overall, because $P(A|B)\\approx0.343$ is not equal to $P(A)=0.60(0.25)+0.20(0.75)=0.30$."
    }
  },
  {
    "week": "Week 3",
    "lectures": "Lectures 5-6",
    "title": "Random Variables, PMF, Expected Value, Variance",
    "color": "#854F0B",
    "bg": "#FAEEDA",
    "focus": "Use this when a problem defines a random variable, asks for a PMF/CDF, expected value, variance, or identifies Bernoulli/Binomial/Geometric.",
    "formulas": [
      [
        "Random variable",
        "$$X:\\Omega\\to\\mathbb R$$",
        "A function mapping outcomes to numbers."
      ],
      [
        "PMF",
        "$$p_X(x)=P(X=x),\\quad \\sum_{x\\in R_X}p_X(x)=1$$",
        "Use for discrete random variables."
      ],
      [
        "Event from PMF",
        "$$P(X\\in S)=\\sum_{x\\in S}P(X=x)$$",
        "Add probabilities for all values in the event."
      ],
      [
        "Expected value",
        "$$E[X]=\\sum_x xP(X=x)$$",
        "Long-run average of a discrete random variable."
      ],
      [
        "LOTUS discrete",
        "$$E[g(X)]=\\sum_x g(x)P(X=x)$$",
        "Use to get $E[X^2]$, $E[e^{tX}]$, etc. without finding distribution of g(X)."
      ],
      [
        "Variance",
        "$$Var[X]=E[(X-E[X])^2]=E[X^2]-(E[X])^2$$",
        "Use after finding $E[X]$ and $E[X^2]$."
      ],
      [
        "Linearity",
        "$$E[aX+b]=aE[X]+b,\\quad E[X+Y]=E[X]+E[Y]$$",
        "Always true, even when variables are dependent."
      ],
      [
        "Variance scaling",
        "$$Var[aX+b]=a^2Var[X]$$",
        "Constants shift the mean but do not change variance."
      ],
      [
        "Bernoulli",
        "$$P(X=1)=p,\\ E[X]=p,\\ Var[X]=p(1-p)$$",
        "Identify: one trial only; success/failure; $X$ is 0 or 1."
      ],
      [
        "Binomial",
        "$$P(X=k)=\\binom nkp^k(1-p)^{n-k},\\ E[X]=np,\\ Var[X]=np(1-p)$$",
        "Identify: fixed number $n$ of independent trials; count successes."
      ],
      [
        "Geometric",
        "$$P(X=k)=(1-p)^{k-1}p,\\ E[X]=1/p,\\ Var[X]=(1-p)/p^2$$",
        "Identify: repeat until first success; $X$ is the trial number of that first success."
      ]
    ],
    "example": {
      "source": "Week 3 lecture example",
      "prompt": "EXAMPLE: A sequencing experiment analyzes 3 independent DNA sites, each of which contains a mutation with probability $1/2$. Let $X$ be the number of sites at which a mutation is detected. Find the range and PMF of $X$.",
      "solution": "Step 1: Identify what $X$ counts. It counts the number of mutated sites among 3 sites, so $R_X=\\{0,1,2,3\\}$.\n\nStep 2: Count the equally likely outcomes. With 3 independent sites, there are $2^3=8$ mutation/no-mutation patterns.\n\nStep 3: Count patterns for each value: $\\binom30=1$, $\\binom31=3$, $\\binom32=3$, and $\\binom33=1$.\n\nStep 4: Divide by 8 to get the PMF: $P(X=0)=1/8$, $P(X=1)=3/8$, $P(X=2)=3/8$, and $P(X=3)=1/8$.\n\nStep 5: Distribution check: this is $X\\sim Binomial(n=3,p=1/2)$."
    },
    "practice": {
      "source": "Homework 3 Problem 1",
      "prompt": "Problem 1 [21 points]. In a microfluidic fluorescence assay, droplets pass through a detector that records signal intensity. Due to biological variability, the device reports three possible signal levels: 10, 20, or 30 units. Experimental characterization shows that low-intensity droplets (10 units) occur 20% of the time, medium-intensity droplets (20 units) occur 50% of the time, and high-intensity droplets (30 units) occur 30% of the time. Let $X$ denote the measured fluorescence intensity of a randomly selected droplet. To improve measurement accuracy, the system applies a calibration that rescales and shifts the signal according to $Y=1.5X+5$. (a) Compute the probability mass function (PMF) of $Y$. (b) Compute the expected value of $Y$. (c) Compute the standard deviation of $Y$.",
      "answer": "(a) The possible values are $Y=20,35,50$ with probabilities $0.20,0.50,0.30$.\n\n(b) $E[Y]=20(0.2)+35(0.5)+50(0.3)=36.5$.\n\n(c) $E[Y^2]=400(0.2)+1225(0.5)+2500(0.3)=1442.5$. Then $Var[Y]=1442.5-36.5^2=110.25$, so $SD[Y]=10.5$."
    }
  },
  {
    "week": "Week 4",
    "lectures": "Lectures 7-8",
    "title": "Pascal, Hypergeometric, Poisson, Continuous RVs",
    "color": "#993C1D",
    "bg": "#FAECE7",
    "focus": "Use this for count models beyond Binomial and for continuous random variables with PDFs/CDFs.",
    "formulas": [
      [
        "Pascal / negative binomial",
        "$$P(X=k)=\\binom{k-1}{m-1}p^m(1-p)^{k-m},\\ k=m,m+1,\\ldots$$",
        "Trigger: repeated independent trials until the m-th success. X = total trials needed."
      ],
      [
        "Pascal mean/variance",
        "$$E[X]=m/p,\\quad Var[X]=m(1-p)/p^2$$",
        "Use after identifying Pascal."
      ],
      [
        "Hypergeometric",
        "$$P(X=k)=\\frac{\\binom Kk\\binom{N-K}{n-k}}{\\binom Nn}$$",
        "Trigger: sample without replacement from a finite group. Count successes in n draws."
      ],
      [
        "Hypergeometric mean/variance",
        "$$E[X]=nK/N,\\quad Var[X]=n\\frac KN(1-\\frac KN)\\frac{N-n}{N-1}$$",
        "Use for finite populations without replacement."
      ],
      [
        "Poisson",
        "$$P(X=k)=e^{-\\lambda}\\frac{\\lambda^k}{k!},\\quad k=0,1,2,\\ldots$$",
        "Trigger: count events in fixed time/area/volume with rate $\\lambda$; events occur independently. Words: number of errors, arrivals, mutations, spikes."
      ],
      [
        "Poisson properties",
        "$$E[X]=\\lambda,\\quad Var[X]=\\lambda$$",
        "Poisson check: support is $0,1,2,...$ and mean = variance = $\\lambda$. Approx Binomial when n large, p small, $\\lambda=np$."
      ],
      [
        "PDF properties",
        "$$f_X(x)\\ge0,\\quad \\int_{-\\infty}^{\\infty}f_X(x)dx=1$$",
        "Continuous RV; probabilities are areas."
      ],
      [
        "CDF from PDF",
        "$$F_X(x)=\\int_{-\\infty}^{x}f_X(t)dt$$",
        "Use for $P(X\\le x)$ or to find intervals."
      ],
      [
        "Interval probability",
        "$$P(a<X\\le b)=F_X(b)-F_X(a)$$",
        "Endpoints do not matter for continuous variables."
      ],
      [
        "Uniform",
        "$$X\\sim U(a,b): f(x)=1/(b-a),\\ E[X]=(a+b)/2,\\ Var[X]=(b-a)^2/12$$",
        "Trigger: all values in an interval equally likely, random location/time/concentration between a and b."
      ]
    ],
    "example": {
      "source": "Week 4 lecture example",
      "prompt": "EXAMPLE: A PCR-based assay is used to detect a specific DNA sequence in a biological sample. Due to technical and biological variability, the assay successfully detects the target in a given run with probability 0.90, and fails otherwise. Suppose the assay is repeated until 9 successful detections are observed. Determine the probability that exactly 10 runs are required. Find the expected number of runs required to obtain these 9 successful detections.",
      "solution": "Step 1: Identify the distribution. The assay repeats until the 9th success, so $X\\sim Pascal(m=9,p=0.90)$, where $X$ is the total number of runs.\n\nStep 2: For exactly 10 runs, the 10th run must be the 9th success. The first 9 runs must contain exactly 8 successes.\n\nStep 3: Apply the Pascal PMF: $P(X=10)=\\binom{10-1}{9-1}(0.90)^9(0.10)^{10-9}$.\n\nStep 4: Simplify: $P(X=10)=\\binom98(0.90)^9(0.10)=9(0.90)^9(0.10)\\approx0.3487$.\n\nStep 5: Use the Pascal mean: $E[X]=m/p=9/0.90=10$."
    },
    "practice": {
      "source": "Homework 4 Problem 2",
      "prompt": "Problem 2 [15 points]. A single-cell RNA sequencing assay is used to detect expression of a low-abundance gene. Due to biological variability and measurement noise, each sequencing run successfully detects the gene with probability $p=0.30$, independently of other runs. The experiment is repeated until 5 successful detections are observed. Let $X$ denote the total number of sequencing runs required to obtain these 5 successful detections. (a) What is the probability that exactly 8 runs are required to obtain the 5 successful detections? (b) What is the expected number of runs required? (c) What is the variance of the number of runs required?",
      "answer": "(a) $X\\sim Pascal(m=5,p=0.30)$, so $P(X=8)=\\binom{7}{4}(0.30)^5(0.70)^3\\approx0.0292$.\n\n(b) $E[X]=m/p=5/0.30\\approx16.67$.\n\n(c) $Var[X]=m(1-p)/p^2=5(0.70)/(0.30)^2\\approx38.89$."
    }
  },
  {
    "week": "Week 5",
    "lectures": "Lectures 9-10",
    "title": "Transformations and Continuous Distributions",
    "color": "#185FA5",
    "bg": "#E6F1FB",
    "focus": "Use this when a new random variable is defined as Y=g(X), or when identifying Exponential, Gamma, or Normal distributions.",
    "formulas": [
      [
        "Monotone transformation",
        "$$f_Y(y)=f_X(g^{-1}(y))\\left|\\frac{d}{dy}g^{-1}(y)\\right|$$",
        "Use when g is one-to-one and differentiable."
      ],
      [
        "Derivative inverse form",
        "$$f_Y(y)=\\frac{f_X(g^{-1}(y))}{|g'(g^{-1}(y))|}$$",
        "Same formula; useful when g'(x) is easier."
      ],
      [
        "Non-monotone transformation",
        "$$f_Y(y)=\\sum_i f_X(g_i^{-1}(y))\\left|\\frac{d}{dy}g_i^{-1}(y)\\right|$$",
        "Split the range of X into intervals where g is monotone, then add branches."
      ],
      [
        "CDF method",
        "$$F_Y(y)=P(g(X)\\le y),\\quad f_Y(y)=F_Y'(y)$$",
        "Safest method when transformation is tricky."
      ],
      [
        "Exponential PDF/CDF",
        "$$f(x)=\\lambda e^{-\\lambda x},\\ x\\ge0;\\quad F(x)=1-e^{-\\lambda x}$$",
        "Trigger: waiting time until first event, lifetime, decay time, time between Poisson events."
      ],
      [
        "Exponential properties",
        "$$E[X]=1/\\lambda,\\quad Var[X]=1/\\lambda^2,\\quad P(X>s+t|X>s)=P(X>t)$$",
        "Clue: memoryless wording or rate $\\lambda$ per time. If asking count, think Poisson; if asking waiting time, think Exponential."
      ],
      [
        "Gamma",
        "$$f(x)=\\frac{\\lambda^\\alpha}{\\Gamma(\\alpha)}x^{\\alpha-1}e^{-\\lambda x},\\quad E[X]=\\alpha/\\lambda,\\ Var[X]=\\alpha/\\lambda^2$$",
        "Trigger: waiting time until the $\\alpha$-th event, or sum of independent Exponential(rate $\\lambda$) variables."
      ],
      [
        "Normal",
        "$$f(x)=\\frac{1}{\\sqrt{2\\pi\\sigma^2}}e^{-(x-\\mu)^2/(2\\sigma^2)}$$",
        "Trigger: measurement noise, biological variation, averages/CLT, symmetric bell-shaped data."
      ],
      [
        "Standardization",
        "$$Z=\\frac{X-\\mu}{\\sigma}$$",
        "Convert normal probability to standard normal table/CDF."
      ]
    ],
    "example": {
      "source": "Week 5 lecture example",
      "prompt": "EXAMPLE: In a biochemical system, let $X$ denote a normalized substrate concentration (scaled between 0 and 1) in a microenvironment. Suppose $X$ has the following probability density function: $$f_X(x)=\\begin{cases}4x^3,&0<x\\le1\\\\0,&\\text{otherwise}\\end{cases}$$ The enzymatic downstream response is inversely proportional to the substrate concentration. Specifically, let $Y=1/X$. Find the probability density function of $Y$.",
      "solution": "Step 1: Find the range of $Y$. Since $0<X\\le1$ and $Y=1/X$, we have $Y\\in[1,\\infty)$.\n\nStep 2: Find the inverse transformation: $y=1/x$ gives $g^{-1}(y)=1/y$.\n\nStep 3: Compute the derivative term. Since $g'(x)=-1/x^2$, $|g'(g^{-1}(y))|=y^2$.\n\nStep 4: Apply the transformation formula: $f_Y(y)=f_X(g^{-1}(y))/|g'(g^{-1}(y))|$.\n\nStep 5: Substitute: $f_Y(y)=f_X(1/y)/y^2=4(1/y)^3/y^2=4/y^5$ for $y\\ge1$, and $0$ otherwise."
    },
    "practice": {
      "source": "Homework 5 Problem 1",
      "prompt": "Problem 1 [20 points]. In a bioengineering experiment, a researcher studies the decay of a fluorescent signal in a biosensor after activation. Let $X$ (in hours) denote the time until the signal decays to baseline. Experimental observations show that the probability that the signal decays in a short time interval is proportional to the length of that interval, and this probability does not depend on how long the signal has already persisted. Further, experiments show that the signal decays at an average rate of 2 events per hour. The total processing time required for downstream analysis depends on the decay time and is modeled as $Y=2+3X$, where 2 hours represents fixed preparation time and $3X$ accounts for signal-dependent processing. (a) Find $P(X>2)$. (b) Find the expected, variance, and standard deviation of $Y$. (c) Find $P(X>2|Y<11)$.",
      "answer": "$P(X>2)=e^{-4}\\approx0.0183$.\n$E[Y]=2+3(1/2)=7/2$.\n$Var[Y]=3^2(1/4)=9/4$, so $SD[Y]=3/2$.\n$Y<11\\Leftrightarrow X<3$, so $P(X>2|Y<11)=P(2<X<3)/P(X<3)=(e^{-4}-e^{-6})/(1-e^{-6})\\approx0.0158$."
    }
  },
  {
    "week": "Week 6",
    "lectures": "Lectures 11-12",
    "title": "Joint, Marginal, Conditional Distributions",
    "color": "#3C3489",
    "bg": "#EEEDFE",
    "focus": "Use this when two variables are measured together and you need joint PMF/PDF, marginal, conditional, or independence.",
    "formulas": [
      [
        "Joint PMF",
        "$$p_{XY}(x,y)=P(X=x,Y=y)$$",
        "Comma means AND for random variables."
      ],
      [
        "Discrete marginal",
        "$$p_X(x)=\\sum_y p_{XY}(x,y),\\quad p_Y(y)=\\sum_x p_{XY}(x,y)$$",
        "Sum out the variable you do not want."
      ],
      [
        "Discrete conditional",
        "$$p_{X|Y}(x|y)=\\frac{p_{XY}(x,y)}{p_Y(y)}$$",
        "Fix Y=y and normalize by the marginal."
      ],
      [
        "Discrete independence",
        "$$p_{XY}(x,y)=p_X(x)p_Y(y)\\quad\\text{for all }(x,y)$$",
        "Must hold for every pair, not just one."
      ],
      [
        "Joint CDF",
        "$$F_{XY}(x,y)=P(X\\le x,Y\\le y)$$",
        "Use for threshold events in two variables."
      ],
      [
        "Rectangle probability",
        "$$P(a<X\\le b,c<Y\\le d)=F(b,d)-F(a,d)-F(b,c)+F(a,c)$$",
        "2D inclusion-exclusion."
      ],
      [
        "Joint PDF",
        "$$P((X,Y)\\in A)=\\iint_A f_{XY}(x,y)dxdy$$",
        "Integrate over a region."
      ],
      [
        "Continuous marginal",
        "$$f_X(x)=\\int f_{XY}(x,y)dy,\\quad f_Y(y)=\\int f_{XY}(x,y)dx$$",
        "Integrate out the other variable."
      ],
      [
        "Continuous conditional",
        "$$f_{X|Y}(x|y)=\\frac{f_{XY}(x,y)}{f_Y(y)}$$",
        "Same logic as discrete."
      ]
    ],
    "example": {
      "source": "Week 6 lecture example",
      "prompt": "EXAMPLE: Consider a sequencing assay where $X$ is the number of mutated DNA fragments detected in a sample ($X\\in\\{0,1\\}$) and $Y$ is the number of sequencing errors observed in the same sample ($Y\\in\\{0,1,2\\}$). The joint PMF is: $p(0,0)=1/6$, $p(1,0)=1/8$, $p(0,1)=1/4$, $p(1,1)=1/6$, $p(0,2)=1/8$, $p(1,2)=1/6$. (a) What is the probability that a sample contains no detected mutations and at most one sequencing error? (b) Determine the marginal distributions. (c) What is $P(Y=1|X=0)$? (d) Are mutation detection and sequencing error independent?",
      "solution": "Step 1: For part (a), add the joint probabilities with $X=0$ and $Y\\le1$: $P(X=0,Y\\le1)=p(0,0)+p(0,1)=1/6+1/4=5/12$.\n\nStep 2: For part (b), sum over $Y$ to get $p_X$. Thus $P_X(0)=1/6+1/4+1/8=13/24$ and $P_X(1)=1/8+1/6+1/6=11/24$.\n\nStep 3: Sum over $X$ to get $p_Y$. Thus $P_Y(0)=1/6+1/8=7/24$, $P_Y(1)=1/4+1/6=5/12$, and $P_Y(2)=1/8+1/6=7/24$.\n\nStep 4: For part (c), use conditional probability: $P(Y=1|X=0)=P(X=0,Y=1)/P_X(0)=(1/4)/(13/24)=6/13$.\n\nStep 5: For part (d), compare conditional and marginal probabilities. Since $P(Y=1|X=0)=6/13\\ne P(Y=1)=5/12$, $X$ and $Y$ are not independent."
    },
    "practice": {
      "source": "Midterm 2 Problem 2",
      "prompt": "Problem 2 [20 points]. In a tissue-engineering experiment, a bioengineer studies the distribution of two different cell types seeded onto a biodegradable scaffold. Let $X$ denote the number of stem cells attached to a randomly selected scaffold region, and $Y$ denote the number of immune cells attached to the same region. Suppose the joint probability mass function of $X$ and $Y$ is given by $$P_{X,Y}(x,y)=\\begin{cases}c(x+y+1),&x=0,1,2,\\ y=0,1\\\\0,&\\text{otherwise}\\end{cases}$$ (a) Find the value of the normalization constant $c$. (b) Find the marginal PMFs $p_X(x)$ and $p_Y(y)$. (c) Compute the probability that at least one stem cell is attached to the scaffold region given that exactly one immune cell is attached to the same region. (d) Evaluate and determine whether $X$ and $Y$ are independent.",
      "answer": "Sum all weights: for $y=0$, $1+2+3=6$; for $y=1$, $2+3+4=9$; total 15, so $c=1/15$.\n$p_X(0)=3/15=1/5$, $p_X(1)=5/15=1/3$, $p_X(2)=7/15$.\n$p_Y(0)=6/15=2/5$, $p_Y(1)=9/15=3/5$.\n$P(X\\ge1|Y=1)=(3/15+4/15)/(3/5)=7/9$.\nNot independent, for example $p(0,0)=1/15$ but $p_X(0)p_Y(0)=2/25$."
    }
  },
  {
    "week": "Week 7",
    "lectures": "Lectures 13-14",
    "title": "Covariance, Correlation, Multiple RVs, MGF",
    "color": "#993C1D",
    "bg": "#FAECE7",
    "focus": "Use this when asked about linear association, variance of a sum, conditioning with covariance, or moment generating functions.",
    "formulas": [
      [
        "Covariance definition",
        "$$Cov[X,Y]=E[(X-E[X])(Y-E[Y])]$$",
        "Measures linear association."
      ],
      [
        "Computational covariance",
        "$$Cov[X,Y]=E[XY]-E[X]E[Y]$$",
        "Most common exam formula."
      ],
      [
        "Covariance properties",
        "$$Cov[aX+b,cY+d]=ac\\,Cov[X,Y]$$",
        "Constants vanish; scale factors come out."
      ],
      [
        "Variance of sum",
        "$$Var[X+Y]=Var[X]+Var[Y]+2Cov[X,Y]$$",
        "Do not drop covariance unless independent."
      ],
      [
        "Correlation",
        "$$\\rho_{XY}=\\frac{Cov[X,Y]}{\\sigma_X\\sigma_Y}$$",
        "Standardized covariance; always between -1 and 1."
      ],
      [
        "Law of total expectation",
        "$$E[Y]=E[E[Y|X]]$$",
        "Condition when Y depends on X."
      ],
      [
        "Law of total variance",
        "$$Var[Y]=E[Var(Y|X)]+Var(E[Y|X])$$",
        "Within-condition variance plus between-condition variance."
      ],
      [
        "MGF",
        "$$M_X(t)=E[e^{tX}]$$",
        "Differentiate at 0 to get moments."
      ],
      [
        "Moments from MGF",
        "$$E[X^n]=M_X^{(n)}(0)$$",
        "Clarification: $E[X]=M_X'(0)$ and $E[X^2]=M_X''(0)$."
      ],
      [
        "Independent sum MGF",
        "$$M_{X+Y}(t)=M_X(t)M_Y(t)$$",
        "Only when independent."
      ]
    ],
    "example": {
      "source": "Week 7 lecture example",
      "prompt": "EXAMPLE: In a molecular diagnostics experiment, the concentration of circulating tumor DNA varies across patient samples due to biological heterogeneity. The biomarker concentration varies between 1 and 2, with all concentrations in this range being equally likely. For a given concentration value $x$, the number of mutant DNA fragments detected during sequencing follows a Poisson distribution with rate $x$. Calculate the covariance between the concentration and the number of mutant DNA fragments detected during sequencing.",
      "solution": "Step 1: Define the variables. Let $X\\sim U(1,2)$ be the concentration and let $Y|X=x\\sim Poisson(x)$ be the fragment count.\n\nStep 2: Compute $E[X]$. For $X\\sim U(1,2)$, $E[X]=(1+2)/2=3/2$.\n\nStep 3: Use the conditional mean of a Poisson random variable: $E[Y|X]=X$. Therefore $E[Y]=E[E[Y|X]]=E[X]=3/2$.\n\nStep 4: Compute $E[XY]$ by conditioning on $X$: $E[XY]=E[E[XY|X]]=E[XE[Y|X]]=E[X^2]$.\n\nStep 5: Evaluate $E[X^2]=\\int_1^2 x^2\\,dx=7/3$.\n\nStep 6: Use $Cov[X,Y]=E[XY]-E[X]E[Y]$: $Cov[X,Y]=7/3-(3/2)(3/2)=1/12$."
    },
    "practice": {
      "source": "Homework 6 Problem 1",
      "prompt": "Problem 1 [17 points]. In a multiplex biosensor experiment, two sources of biological signal are measured from each sample: $X$: normalized receptor-binding signal, and $Y$: normalized downstream fluorescence signal. Suppose the variance of the receptor-binding signal is 4, while the variance of the fluorescence signal is 9. A bioengineer constructs two derived readouts: $Z=2X-Y$ and $W=X+Y$. The readout $Z$ represents a contrast between amplified receptor binding and fluorescence, while $W$ represents the total combined signal. Suppose experimental analysis shows that $Z$ and $W$ are independent. Find the covariance and correlation between $X$ and $Y$.",
      "answer": "Since $Z$ and $W$ are independent, $Cov(Z,W)=0$.\n$Cov(2X-Y,X+Y)=2Var(X)+2Cov(X,Y)-Cov(X,Y)-Var(Y)=8+Cov(X,Y)-9$.\nSet equal to 0: $Cov(X,Y)=1$.\n$\\rho=Cov(X,Y)/(\\sigma_X\\sigma_Y)=1/(2\\cdot3)=1/6$."
    }
  },
  {
    "week": "Week 8",
    "lectures": "Lectures 15-16",
    "title": "Probability Bounds",
    "color": "#A32D2D",
    "bg": "#FCEBEB",
    "focus": "Use this when the exact distribution is unknown or hard but you know mean, variance, or an MGF.",
    "formulas": [
      [
        "Markov inequality",
        "$$P(X\\ge a)\\le\\frac{E[X]}{a},\\quad X\\ge0,a>0$$",
        "Use when only the mean of a nonnegative RV is available."
      ],
      [
        "Chebyshev inequality",
        "$$P(|X-E[X]|\\ge b)\\le\\frac{Var[X]}{b^2}$$",
        "Use with mean and variance; works for any distribution."
      ],
      [
        "One-sided conversion",
        "$$P(X\\ge a)=P(X-\\mu\\ge a-\\mu)\\le P(|X-\\mu|\\ge a-\\mu)$$",
        "Use Chebyshev for upper tail by making it two-sided."
      ],
      [
        "Chernoff bound",
        "$$P(X\\ge a)\\le e^{-ta}M_X(t),\\quad t>0$$",
        "Use when MGF is known; optimize over t if asked."
      ],
      [
        "Lower tail Chernoff",
        "$$P(X\\le a)\\le e^{-ta}M_X(t),\\quad t<0$$",
        "Use negative t for lower-tail events."
      ],
      [
        "Binomial mean/variance reminder",
        "$$E[X]=np,\\quad Var[X]=np(1-p)$$",
        "Common input for Markov/Chebyshev examples."
      ]
    ],
    "example": {
      "source": "Week 8 lecture example",
      "prompt": "EXAMPLE: In a DNA sequencing experiment, each sequencing read independently produces an error with probability 0.05. Suppose $X$ denotes the total number of sequencing errors among 1000 reads. A bioengineer is concerned about sequencing runs in which at least 7% of all reads contain errors, since such runs are considered experimentally unusable. For a given experiment, find an upper bound on the probability that at least 7% of reads contain sequencing errors. Solve using Markov's inequality.",
      "solution": "Step 1: Identify the count distribution. $X\\sim Binomial(n=1000,p=0.05)$.\n\nStep 2: Compute the mean needed for Markov's inequality: $E[X]=np=1000(0.05)=50$.\n\nStep 3: Translate the event. At least 7% of 1000 reads means $X\\ge70$.\n\nStep 4: Apply Markov's inequality for nonnegative $X$: $P(X\\ge70)\\le E[X]/70$.\n\nStep 5: Substitute: $P(X\\ge70)\\le50/70\\approx0.714$."
    },
    "practice": {
      "source": "Week 8 lecture example",
      "prompt": "EXAMPLE: In a DNA sequencing experiment, each sequencing read independently produces an error with probability 0.05. Suppose $X$ denotes the total number of sequencing errors among 1000 reads. A bioengineer is concerned about sequencing runs in which at least 7% of all reads contain errors, since such runs are considered experimentally unusable. For a given experiment, find an upper bound on the probability that at least 7% of reads contain sequencing errors. Solve using Chebyshev's inequality.",
      "answer": "$X\\sim Binomial(n=1000,p=0.05)$, so $E[X]=50$ and $Var[X]=47.5$. At least 7% means $X\\ge70$.\n$P(X\\ge70)\\le P(|X-50|\\ge20)\\le47.5/20^2=0.11875$."
    }
  },
  {
    "week": "Week 9",
    "lectures": "Lectures 17-18",
    "title": "LLN, CLT, Statistical Inference, Mean Estimation",
    "color": "#4338CA",
    "bg": "#EEF2FF",
    "focus": "Use this for large-n approximation, averages, sums, standard error, confidence-type reasoning, and estimators of the mean.",
    "formulas": [
      [
        "Sample average",
        "$$\\bar X_n=\\frac{1}{n}\\sum_{i=1}^n X_i$$",
        "Average of iid measurements."
      ],
      [
        "Mean of sample average",
        "$$E[\\bar X_n]=\\mu$$",
        "Shows sample mean is unbiased for population mean."
      ],
      [
        "Variance of sample average",
        "$$Var[\\bar X_n]=\\sigma^2/n$$",
        "Averages become less variable as n grows."
      ],
      [
        "Weak LLN",
        "$$\\lim_{n\\to\\infty}P(|\\bar X_n-\\mu|\\ge\\epsilon)=0$$",
        "Averages converge in probability."
      ],
      [
        "CLT for average",
        "$$\\bar X_n\\approx N(\\mu,\\sigma^2/n)$$",
        "Large n; individual distribution need not be normal."
      ],
      [
        "CLT standardization",
        "$$Z=\\frac{\\bar X_n-\\mu}{\\sigma/\\sqrt n}\\approx N(0,1)$$",
        "Convert average to standard normal."
      ],
      [
        "CLT for sum",
        "$$S_n=\\sum X_i\\approx N(n\\mu,n\\sigma^2)$$",
        "Use for binomial counts as sum of Bernoulli variables."
      ],
      [
        "Standard error",
        "$$SE=\\sigma/\\sqrt n$$",
        "Uncertainty of an average."
      ],
      [
        "Bias",
        "$$Bias[\\hat\\theta]=E[\\hat\\theta]-\\theta$$",
        "Unbiased if bias is 0."
      ],
      [
        "MSE",
        "$$MSE[\\hat\\theta]=Var[\\hat\\theta]+Bias[\\hat\\theta]^2$$",
        "Compare estimators; for unbiased estimators MSE=variance."
      ]
    ],
    "example": {
      "source": "Week 9 lecture example",
      "prompt": "EXAMPLE: A bioengineer uses identical and independent biosensors to measure the concentration of a signaling molecule in a biological sample. Let $X_i$ denote the concentration measured by the $i$-th biosensor. Suppose each measurement has expected value of $\\mu$ with a standard deviation of $\\sigma$. How many biosensors are needed so that the average measured concentration is within $\\epsilon=5$ units of $\\mu$ with probability at least 95%?",
      "solution": "Step 1: The target is $P(|\\bar X_n-\\mu|<5)\\ge0.95$, which is equivalent to $P(|\\bar X_n-\\mu|\\ge5)\\le0.05$.\n\nStep 2: Use the variance of the sample average: $Var(\\bar X_n)=\\sigma^2/n$.\n\nStep 3: Apply Chebyshev's inequality: $P(|\\bar X_n-\\mu|\\ge5)\\le Var(\\bar X_n)/5^2$.\n\nStep 4: Substitute: $P(|\\bar X_n-\\mu|\\ge5)\\le \\sigma^2/(25n)$.\n\nStep 5: Require this bound to be at most $0.05$: $\\sigma^2/(25n)\\le0.05$.\n\nStep 6: Solve for $n$: $n\\ge\\sigma^2/1.25$. Round up to the next whole biosensor count."
    },
    "practice": {
      "source": "Homework 6 Problem 4",
      "prompt": "Problem 4 [17 points]. In a single-cell microfluidics experiment, a bioengineer loads cells into droplets. Each droplet independently contains a usable single cell with probability 0.20. Droplets that contain zero cells, multiple cells, or damaged cells are discarded. The bioengineer continues generating droplets until one usable single-cell droplet is obtained. Let $X_i$ denote the number of droplets required to obtain the $i$-th usable single-cell droplet after the previous usable droplet has been found. The bioengineer wants to obtain 30 usable single-cell droplets. Calculate the probability that at least 175 but no more than 180 droplets are generated to obtain 30 usable single-cell droplets. Perform the calculation using the Pascal distribution and also using the Central Limit Theorem with continuity correction. Compare the results.",
      "answer": "$T\\sim Pascal(m=30,p=0.20)$.\n$E[T]=m/p=150$, $Var[T]=m(1-p)/p^2=30(0.8)/0.04=600$, $SD=\\sqrt{600}$.\nContinuity correction: $P(174.5<T<180.5)$.\nApprox: $P((174.5-150)/\\sqrt{600}<Z<(180.5-150)/\\sqrt{600})=P(1.000<Z<1.245)$. Use normal CDF values to finish."
    }
  },
  {
    "week": "Week 10",
    "lectures": "Lectures 19-20",
    "title": "Variance Estimation, MLE, Hypothesis Testing",
    "color": "#854F0B",
    "bg": "#FAEEDA",
    "focus": "Use this for sample variance, bias, maximum likelihood, z-tests, p-values, and Type I/II errors.",
    "formulas": [
      [
        "Known-mean variance estimator",
        "$$\\hat\\sigma_\\mu^2=\\frac1n\\sum_{i=1}^n(X_i-\\mu)^2$$",
        "Unbiased if true $\\mu$ is known."
      ],
      [
        "Biased variance with sample mean",
        "$$\\bar S^2=\\frac1n\\sum_{i=1}^n(X_i-\\bar X)^2$$",
        "Biased low for $\\sigma^2$."
      ],
      [
        "Bias of biased variance",
        "$$E[\\bar S^2]=\\frac{n-1}{n}\\sigma^2,\\quad Bias=-\\frac{1}{n}\\sigma^2$$",
        "Shows why divide by $n-1$."
      ],
      [
        "Sample variance",
        "$$S^2=\\frac{1}{n-1}\\sum_{i=1}^n(X_i-\\bar X)^2$$",
        "Unbiased estimator of $\\sigma^2$."
      ],
      [
        "Computational variance",
        "$$S^2=\\frac{1}{n-1}\\left(\\sum X_i^2-n\\bar X^2\\right)$$",
        "Fast calculation from raw data."
      ],
      [
        "Sample standard deviation",
        "$$S=\\sqrt{S^2}$$",
        "Common estimator of $\\sigma$, but generally biased."
      ],
      [
        "Likelihood",
        "$$L(\\theta)=\\prod_{i=1}^n f(X_i;\\theta)$$",
        "Probability/density of observed data as a function of $\\theta$."
      ],
      [
        "Log likelihood",
        "$$\\ell(\\theta)=\\log L(\\theta)$$",
        "Turns product into sum; easier derivatives."
      ],
      [
        "MLE steps",
        "$$\\frac{d\\ell}{d\\theta}=0,\\quad \\frac{d^2\\ell}{d\\theta^2}<0$$",
        "Solve critical point and check maximum."
      ],
      [
        "Poisson MLE",
        "$$\\hat\\lambda=\\bar X$$",
        "For iid Poisson samples."
      ],
      [
        "Exponential MLE",
        "$$\\hat\\lambda=1/\\bar X$$",
        "For iid exponential(rate $\\lambda$)."
      ],
      [
        "Z test statistic",
        "$$Z=\\frac{\\bar X-\\mu_0}{\\sigma/\\sqrt n}$$",
        "Use when $\\sigma$ known or CLT approximation is allowed."
      ],
      [
        "p-value right tail",
        "$$p=1-\\Phi(z_{obs})$$",
        "For $H_1:\\mu>\\mu_0$."
      ],
      [
        "Critical rule",
        "$$\\text{Reject }H_0\\text{ if }p<\\alpha$$",
        "Small p-value = data is unlikely under $H_0$."
      ],
      [
        "Type I / Type II",
        "Type I = reject true $H_0$; Type II = fail to reject false $H_0$; Power = $1-\\beta$",
        "Useful for interpretation questions."
      ]
    ],
    "example": {
      "source": "Week 10 lecture example",
      "prompt": "EXAMPLE: A team of bioengineers is evaluating the degradation time of a biodegradable polymer used in a tissue scaffold. To estimate the mean and variability of the degradation time, the team records the time (in minutes) it takes for the polymer to fully degrade in six independent trials under identical experimental conditions. Let $T$ represent the degradation time. The observed sample of degradation times is: $T_1=18$, $T_2=21$, $T_3=17$, $T_4=16$, $T_5=24$, $T_6=20$. Assuming that $T_1,T_2,T_3,T_4,T_5,T_6$ are i.i.d. with the same distribution as $T$. Find the values of the sample mean, the sample variance, and the sample standard deviation for the observed sample.",
      "solution": "Step 1: Compute the sample mean: $\\bar T=(18+21+17+16+24+20)/6=19.33$ minutes.\n\nStep 2: Use the unbiased sample variance formula with $n-1=5$: $S^2=\\frac{1}{5}\\sum_{i=1}^6(T_i-\\bar T)^2$.\n\nStep 3: Substitute $\\bar T=19.33$: $S^2=\\frac{1}{5}\\sum_{i=1}^6(T_i-19.33)^2=8.67$ min$^2$.\n\nStep 4: Take the square root to get the sample standard deviation: $S=\\sqrt{8.67}=2.94$ minutes."
    },
    "practice": {
      "source": "Homework 6 Problem 5",
      "prompt": "Problem 5 [14 points]. A bioengineer wants to estimate the true average concentration of a biomarker in a patient population. The true average concentration is denoted by $\\theta$, but its value is unknown. The bioengineer collects biomarker measurements from 5 randomly selected patients: $X_1=8$, $X_2=10$, $X_3=9$, $X_4=13$, $X_5=10$. Consider two point estimators for $\\theta$: $\\hat\\Theta_1=\\bar X=(X_1+X_2+X_3+X_4+X_5)/5$ and $\\hat\\Theta_2=(X_1+X_5)/2$. Calculate the observed estimates produced by each estimator. Which estimator would generally be preferred for estimating the true population mean, and why?",
      "answer": "$\\hat\\Theta_1=\\bar X=(8+10+9+13+10)/5=10$.\n$\\hat\\Theta_2=(8+10)/2=9$.\nGenerally prefer $\\bar X$ because it uses all observations, usually has lower variance, and is the standard unbiased estimator of the population mean when observations are i.i.d."
    }
  }
];
const EXTRA_EXAMPLES = {
  "Week 1": [
    {
      type: "DNA barcode collision",
      source: "Week 1 lecture example",
      prompt: "EXAMPLE: A bioengineering experiment uses DNA barcodes to label cells. Each barcode is a sequence of length 4, where each position can be one of four nucleotides ($A$, $C$, $G$, $T$). A researcher labels 20 cells, assigning each cell a barcode independently and uniformly at random. What is the probability that at least two cells receive the same barcode?",
      solution: "Step 1: Count possible barcodes. Each of 4 positions has 4 choices, so there are $4^4=256$ barcodes.\n\nStep 2: Use the complement because \"at least two share\" is easier as $1-P(\\text{all different})$.\n\nStep 3: Compute the no-collision probability: $P(\\text{all different})=\\frac{256}{256}\\frac{255}{256}\\cdots\\frac{237}{256}\\approx0.476$.\n\nStep 4: Subtract from 1: $P(\\text{at least one shared barcode})\\approx1-0.476=0.524$."
    },
    {
      type: "Set union/complement",
      source: "Week 1 lecture example",
      prompt: "EXAMPLE: A study examines 200 patients for two cardiovascular risk factors. Let $H$ be the set of patients with hypertension and $C$ be the set of patients with high cholesterol. The study reports: $|H|=80$, $|C|=70$, $|H\\cap C|=30$. (a) Compute the number of patients with hypertension or high cholesterol. (b) Compute the number of patients with neither hypertension nor high cholesterol. (c) Compute the number of patients who do not have hypertension and do not have high cholesterol.",
      solution: "Step 1: For part (a), use inclusion-exclusion: $|H\\cup C|=|H|+|C|-|H\\cap C|=80+70-30=120$.\n\nStep 2: For part (b), \"neither\" is the complement of $H\\cup C$: $|(H\\cup C)^c|=200-120=80$.\n\nStep 3: For part (c), use De Morgan's law: $H^c\\cap C^c=(H\\cup C)^c$.\n\nStep 4: Therefore the number with no hypertension and no high cholesterol is also $80$."
    }
  ],
  "Week 2": [
    {
      type: "Independence check",
      source: "Homework 2 Problem 4",
      prompt: "Problem 4 [14 points]. A bioengineering lab studies single cells under controlled thermodynamic conditions. Each cell is characterized by two properties: whether it has high ATP concentration (event $A$) and whether it is actively proliferating (event $B$). From experimental measurements across a large population of cells, the following probabilities are observed: $P(A)=0.6$, $P(B)=0.5$, and $P(A\\cap B)=0.30$. (a) Determine whether events $A$ and $B$ are independent, and justify your answer. (b) Suppose that under a different thermodynamic condition, such as nutrient limitation, the joint probability changes to $P(A\\cap B)=0.15$ while $P(A)$ and $P(B)$ remain the same. Are the events still independent?",
      solution: "Step 1: To test independence, compare $P(A\\cap B)$ with $P(A)P(B)$.\n\n(a) Compute $P(A)P(B)=0.6(0.5)=0.30$. Since this equals $P(A\\cap B)=0.30$, $A$ and $B$ are independent.\n\n(b) Under the new condition, $P(A)P(B)$ is still $0.30$, but $P(A\\cap B)=0.15$. Since $0.15\\ne0.30$, the events are not independent."
    },
    {
      type: "Two-test Bayes",
      source: "Midterm 1 Problem 3",
      prompt: "Problem 3 [16 points]. In a bioengineering study, a diagnostic pipeline is used to detect a genetic mutation in patient samples. The pipeline consists of two sequential tests: a screening test followed by a confirmatory test, where the confirmatory test is only performed if the screening test is positive. In the population, 10% of samples carry the mutation. The screening test correctly identifies 90% of mutation-positive samples but also returns a positive result in 20% of mutation-negative samples. The confirmatory test correctly identifies 95% of mutation-positive samples and returns a positive result in 10% of mutation-negative samples. Assume that the outcomes of the screening and confirmatory tests are independent given whether the sample carries the mutation. A randomly selected sample tests positive on the screening test and subsequently tests positive on the confirmatory test. (a) What is the probability that the sample carries the mutation given that it tested positive on the screening test? (b) What is the probability that the sample carries the mutation given that it tested positive on both the screening and confirmatory tests?",
      solution: "Step 1: Define events. Let $M$ be mutation, $S$ be screening positive, and $C$ be confirmatory positive.\n\n(a) Use Bayes after the screening test: $P(M|S)=\\frac{P(S|M)P(M)}{P(S|M)P(M)+P(S|M^c)P(M^c)}$.\n\n(a) Substitute: $P(M|S)=\\frac{0.90(0.10)}{0.90(0.10)+0.20(0.90)}=1/3$.\n\n(b) Treat the screening-positive group as the updated population. Then $P(M^c|S)=2/3$.\n\n(b) Apply Bayes again using the confirmatory test: $P(M|S\\cap C)=\\frac{0.95(1/3)}{0.95(1/3)+0.10(2/3)}\\approx0.826$."
    }
  ],
  "Week 3": [
    {
      type: "Geometric CDF",
      source: "Week 3 lecture example",
      prompt: "EXAMPLE: A PCR-based assay is used to detect a specific DNA sequence in a biological sample. Due to technical and biological variability, the assay successfully detects the target in a given run with probability 0.90, and fails otherwise. Suppose the assay is repeated until the DNA sequence is successfully detected. Determine the probability that the first successful detection occurs on the third run. What is the chance the first successful run occurred before the fourth run?",
      solution: "Step 1: Identify the distribution. The assay repeats until the first success, so $X\\sim Geometric(p=0.90)$.\n\nStep 2: First success on run 3 means two failures followed by one success: $P(X=3)=(0.10)^2(0.90)=0.009$.\n\nStep 3: \"Before the fourth run\" means $X<4$, or $X\\le3$.\n\nStep 4: Use the complement of failing the first 3 runs: $P(X\\le3)=1-(0.10)^3=0.999$."
    },
    {
      type: "Binomial count",
      source: "Midterm 1 Problem 5",
      prompt: "Problem 5 [16 points]. In a bioengineering experiment, a CRISPR-based editing protocol is applied independently to 5 cells. For each cell, the probability that the target gene is successfully edited is 0.60. Please answer the questions below and note that answers may be left as exact fractions or decimals. (a) What is the probability that exactly 3 of the 5 cells are successfully edited? (b) What is the probability that at least 1 of the 5 cells is successfully edited? (c) What is the expected number of successfully edited cells? (d) What is the variance of the number of successfully edited cells?",
      solution: "Step 1: Identify the distribution. There are 5 independent cells and each is edited with probability $0.60$, so $X\\sim Binomial(n=5,p=0.60)$.\n\n(a) Exactly 3 edited cells: $P(X=3)=\\binom53(0.60)^3(0.40)^2$.\n\n(b) At least 1 edited cell is easier by complement: $P(X\\ge1)=1-P(X=0)=1-(0.40)^5$.\n\n(c) Use the binomial mean: $E[X]=np=5(0.60)=3$.\n\n(d) Use the binomial variance: $Var[X]=np(1-p)=5(0.60)(0.40)=1.2$."
    }
  ],
  "Week 4": [
    {
      type: "Hypergeometric",
      source: "Week 4 lecture example",
      prompt: "EXAMPLE: A PCR-laboratory has a collection of $N=20$ biological samples, of which $K=6$ contain a target DNA mutation. A researcher randomly selects $n=5$ samples without replacement for testing. Determine the probability that exactly 4 of the selected samples contain the mutation. Find the expected number of mutated samples in the selection.",
      solution: "Step 1: Identify the distribution. Sampling is without replacement from a finite collection, so $X\\sim Hypergeometric(N=20,K=6,n=5)$.\n\nStep 2: Exactly 4 mutated samples means choose 4 from the 6 mutated samples and 1 from the 14 non-mutated samples.\n\nStep 3: Divide by all possible samples of size 5: $P(X=4)=\\frac{\\binom64\\binom{14}{1}}{\\binom{20}{5}}\\approx0.0135$.\n\nStep 4: Use the hypergeometric mean: $E[X]=nK/N=5(6/20)=1.5$."
    },
    {
      type: "Poisson approximation",
      source: "Homework 4 Problem 3",
      prompt: "Problem 3 [18 points]. In a high-throughput single-cell assay, 50 independent cells are analyzed for the presence of a rare mutation. Each cell contains the mutation with probability $p=0.10$, independently of the others. What is the probability that more than 3 mutated cells are present, exceeding the platform's capacity? Solve the problem: (a) using the Binomial distribution, and (b) using a Poisson approximation.",
      solution: "Step 1: For part (a), the exact model is $X\\sim Binomial(n=50,p=0.10)$ because there are 50 independent cells.\n\n(a) More than 3 means use the complement: $P(X>3)=1-P(X\\le3)\\approx0.748$.\n\nStep 2: For part (b), check the Poisson approximation clue: $n$ is fairly large and $p$ is small.\n\n(b) Set $\\lambda=np=50(0.10)=5$, so $X\\approx Poisson(5)$.\n\nStep 3: Approximate the same tail: $P(X>3)=1-P(X\\le3)\\approx0.735$."
    }
  ],
  "Week 5": [
    {
      type: "Transformation: square root",
      source: "Midterm 2 Problem 1",
      prompt: "Problem 1 [20 points]. In a CRISPR gene-editing experiment, a bioengineer measures the editing efficiency of individual cells. Let $X$ denote the fraction of successfully edited DNA molecules in a randomly selected cell. Suppose $X$ has probability density function $$f_X(x)=\\begin{cases}2x,&0\\le x\\le1\\\\0,&\\text{otherwise}\\end{cases}$$ To quantify editing instability, the bioengineer defines the variability score: $Y=\\sqrt X$. Find the probability density function of $Y$. (Hint: Consider using the methods of transformations.)",
      solution: "Step 1: Identify the transformation: $Y=g(X)=\\sqrt X$.\n\nStep 2: Find the inverse: $y=\\sqrt x$ gives $g^{-1}(y)=y^2$.\n\nStep 3: Find the derivative of the inverse: $\\frac{d}{dy}g^{-1}(y)=2y$.\n\nStep 4: Find the support. Since $0\\le X\\le1$, we have $0\\le Y\\le1$.\n\nStep 5: Apply the transformation formula: $f_Y(y)=f_X(y^2)|2y|=2y^2(2y)=4y^3$ for $0\\le y\\le1$, and $0$ otherwise."
    },
    {
      type: "Poisson count vs exponential wait",
      source: "Week 5 lecture example",
      prompt: "EXAMPLE: You are monitoring the binding of a rare ligand to a biosensor surface, where binding events occur randomly at an average rate of 8 events per hour. (a) What is the probability that exactly 5 binding events are observed in the first 30 minutes of the experiment? (b) What is the probability that the first binding event occurs between 30 minutes and 60 minutes after starting the observation?",
      solution: "Step 1: For part (a), recognize a count in a fixed time interval. Counts in a Poisson process are Poisson.\n\n(a) The interval is 30 minutes = 0.5 hours, so $X\\sim Poisson(\\lambda=8(0.5)=4)$.\n\n(a) Compute $P(X=5)=e^{-4}4^5/5!\\approx0.156$.\n\nStep 2: For part (b), recognize a waiting-time question. Time until the first event is exponential.\n\n(b) Let $Y\\sim Exponential(\\lambda=8)$.\n\n(b) The requested probability is $P(0.5\\le Y\\le1)=F_Y(1)-F_Y(0.5)\\approx0.018$."
    }
  ],
  "Week 6": [
    {
      type: "Conditional PMF given event",
      source: "Week 6 lecture example",
      prompt: "EXAMPLE: In a targeted sequencing experiment, a bioengineer analyzes short DNA fragments from a biological sample. Due to variability in the sample and sequencing process, the number of mutated fragments detected per sample varies. Based on prior experiments, the bioengineer knows that the number of mutated fragments in a sample can be 0, 1, 2, or 3, each occurring with equal likelihood. To ensure high-quality downstream analysis, a filtering step is applied that retains only samples with low mutation burden (at most one mutated fragment). Given that a sample passes the quality control filter, determine the conditional probability mass function (PMF) of the number of mutated fragments detected.",
      solution: "Step 1: Define the conditioning event: $A=\\{X\\le1\\}=\\{X=0\\text{ or }X=1\\}$.\n\nStep 2: Compute the probability of the event. Since each value has probability $1/4$, $P(A)=P(X=0)+P(X=1)=1/4+1/4=1/2$.\n\nStep 3: Use the conditional PMF formula. For $x=0,1$, $P_{X|A}(x)=P(X=x)/P(A)=(1/4)/(1/2)=1/2$.\n\nStep 4: Values outside the filter cannot occur after conditioning, so for $x=2,3$, $P_{X|A}(x)=0$."
    },
    {
      type: "Joint PMF and independence",
      source: "Midterm 2 Problem 2",
      prompt: "Problem 2 [20 points]. In a tissue-engineering experiment, a bioengineer studies the distribution of two different cell types seeded onto a biodegradable scaffold. Let $X$ denote the number of stem cells attached to a randomly selected scaffold region, and $Y$ denote the number of immune cells attached to the same region. Suppose the joint probability mass function of $X$ and $Y$ is given by $$P_{X,Y}(x,y)=\\begin{cases}c(x+y+1),&x=0,1,2,\\ y=0,1\\\\0,&\\text{otherwise}\\end{cases}$$ (a) Find the value of the normalization constant $c$. (b) Find the marginal PMFs $p_X(x)$ and $p_Y(y)$. (c) Compute the probability that at least one stem cell is attached to the scaffold region given that exactly one immune cell is attached to the same region. (d) Evaluate and determine whether $X$ and $Y$ are independent.",
      solution: "Step 1: Normalize the joint PMF. The total weight is $(1+2+3)+(2+3+4)=15$, so $c=1/15$.\n\nStep 2: Sum over $y$ to get $p_X$: $p_X(0)=3/15$, $p_X(1)=5/15$, and $p_X(2)=7/15$.\n\nStep 3: Sum over $x$ to get $p_Y$: $p_Y(0)=6/15$ and $p_Y(1)=9/15$.\n\nStep 4: Use conditional probability: $P(X\\ge1|Y=1)=(3/15+4/15)/(9/15)=7/9$.\n\nStep 5: Check independence using one counterexample. $P(X=0,Y=0)=1/15$, but $p_X(0)p_Y(0)=(3/15)(6/15)=2/25$. Since these are not equal, $X$ and $Y$ are not independent."
    }
  ],
  "Week 7": [
    {
      type: "Covariance properties",
      source: "Week 7 lecture example",
      prompt: "EXAMPLE: In a biosensor experiment, background electronic noise and stochastic molecular fluctuations both contribute to the observed sensor measurements. Suppose $X$: normalized background sensor noise and $Y$: normalized molecular fluctuation signal. Assume that $X$ and $Y$ are independent standard normal random variables. A bioengineer defines two derived measurements: the amplified sensor response $Z=1+X+XY^2$ and the baseline corrected signal $W=1+X$. Calculate $Cov[Z,W]$.",
      solution: "Step 1: Drop constants inside covariance: $Cov[Z,W]=Cov[1+X+XY^2,1+X]=Cov[X+XY^2,X]$.\n\nStep 2: Split covariance over addition: $Cov[X+XY^2,X]=Cov[X,X]+Cov[XY^2,X]$.\n\nStep 3: Since $X$ is standard normal, $Cov[X,X]=Var[X]=1$.\n\nStep 4: Compute the second term: $Cov[XY^2,X]=E[X^2Y^2]-E[XY^2]E[X]$.\n\nStep 5: Use independence and standard-normal moments: $E[X^2Y^2]=E[X^2]E[Y^2]=1$, while $E[XY^2]E[X]=0$.\n\nStep 6: Add the terms: $Cov[Z,W]=1+1-0=2$."
    },
    {
      type: "Zero correlation not independence",
      source: "Week 7 lecture example",
      prompt: "EXAMPLE: In a bioengineering experiment, a researcher measures the normalized expression level of a regulatory protein in a cell. Let $X$ be the normalized protein expression level, which is equally likely between the values of $-1$ and $1$. The activity of a downstream signaling pathway depends on the square of the protein expression level, since both unusually high and unusually low expression disrupt cellular homeostasis. (a) Is the activity of the downstream signaling pathway independent of the normalized expression level? (b) Is the activity of the downstream signaling pathway correlated with the normalized expression level?",
      solution: "Step 1: Model the expression level as $X\\sim Uniform(a=-1,b=1)$.\n\nStep 2: The pathway activity is determined by the square, so let $Y=X^2$.\n\n(a) $X$ and $Y$ are not independent because once $X$ is known, $Y$ is fixed.\n\nStep 3: For correlation, compute covariance: $Cov[X,Y]=E[XY]-E[X]E[Y]=E[X^3]-E[X]E[X^2]$.\n\nStep 4: By symmetry on $[-1,1]$, $E[X]=0$ and $E[X^3]=0$.\n\n(b) Therefore $Cov[X,Y]=0$, so $\\rho_{XY}=0$. The variables are dependent but uncorrelated."
    },
    {
      type: "Multiple random variables",
      source: "Week 7 lecture example",
      prompt: "EXAMPLE: In a multiplex biosensor experiment, a researcher simultaneously measures normalized glucose concentration $X$, normalized lactate concentration $Y$, and normalized inflammatory biomarker concentration $Z$. Suppose the joint probability density function of these three biomarkers is given by $$f_{X,Y,Z}(x,y,z)=\\begin{cases}c(x+2y+3z),&0\\le x,y,z\\le1\\\\0,&\\text{otherwise}\\end{cases}$$ (a) Find the constant $c$. (b) Find the marginal PDF of the glucose concentration $X$.",
      solution: "Step 1: Use total probability to find $c$: $1=\\int_0^1\\int_0^1\\int_0^1 c(x+2y+3z)\\,dx\\,dy\\,dz$.\n\nStep 2: Evaluate the integral: $\\int_0^1\\int_0^1\\int_0^1 (x+2y+3z)\\,dx\\,dy\\,dz=3$, so $3c=1$ and $c=1/3$.\n\nStep 3: To find the marginal PDF of $X$, integrate out $y$ and $z$.\n\nStep 4: For $0\\le x\\le1$, $f_X(x)=\\int_0^1\\int_0^1 \\frac13(x+2y+3z)\\,dy\\,dz$.\n\nStep 5: Simplify: $f_X(x)=\\frac13(x+5/2)$ for $0\\le x\\le1$."
    },
    {
      type: "Variance of a sum",
      source: "Week 7 lecture example",
      prompt: "EXAMPLE: A bioengineer designs an array of $n$ identical biosensors to measure the concentration of a signaling molecule. Assume that all biosensors have an average error of $\\mu$ with a variance of $\\sigma^2$. You are interested in calculating the average and variance of the total measurement error across all biosensors. (a) Assume that all biosensors are independent. (b) Assume that environmental fluctuations introduce correlations between every pair of biosensors, such that the covariance between any two distinct biosensors is $c$.",
      solution: "Step 1: Let the total measurement error be $S=X_1+\\cdots+X_n$.\n\nStep 2: Use linearity of expectation: $E[S]=E[X_1]+\\cdots+E[X_n]=n\\mu$.\n\n(a) If the biosensors are independent, all covariance terms are 0, so $Var[S]=n\\sigma^2$.\n\n(b) If every distinct pair has covariance $c$, use $Var(S)=\\sum_i Var(X_i)+2\\sum_{i<j}Cov(X_i,X_j)$.\n\nStep 3: There are $\\binom n2$ distinct pairs, so $2\\binom n2c=n(n-1)c$.\n\nStep 4: Therefore $Var[S]=n\\sigma^2+n(n-1)c$."
    },
    {
      type: "MGF from PMF/PDF",
      source: "Week 7 lecture example",
      prompt: "EXAMPLE: For each of the following bioengineering random variables, find the moment generating function (MGF). (a) In a single-cell sequencing experiment, a low-abundance gene is measured in an individual cell. Suppose the sequencing assay detects either one or two transcript molecules, where $P_X(1)=1/3$ and $P_X(2)=2/3$. (b) Suppose the fraction of activated membrane receptors on a cell surface is equally likely to take any value between 0 and 1 due to stochastic ligand exposure. Let $Y\\sim Uniform(a=0,b=1)$, where $Y$ represents the fraction of activated receptors.",
      solution: "Step 1: For part (a), use the discrete MGF definition $M_X(s)=E[e^{sX}]$.\n\n(a) Substitute the PMF values: $M_X(s)=e^sP_X(1)+e^{2s}P_X(2)=\\frac13e^s+\\frac23e^{2s}$.\n\nStep 2: For part (b), use the continuous MGF definition $M_Y(s)=E[e^{sY}]$.\n\n(b) Since $Y\\sim Uniform(0,1)$, $f_Y(y)=1$ for $0\\le y\\le1$.\n\nStep 3: Integrate: $M_Y(s)=\\int_0^1 e^{sy}\\,dy=(e^s-1)/s$ for $s\\ne0$.\n\nStep 4: At $s=0$, every MGF equals 1, so $M_Y(0)=1$."
    },
    {
      type: "Moments from MGF",
      source: "Week 7 lecture example",
      prompt: "EXAMPLE: Suppose a biosensor measuring molecular concentration produces a discrete stochastic signal with MGF: $$M_X(s)=\\frac14+\\frac12e^s+\\frac14e^{2s}.$$ Find the mean and variance of the biosensor signal.",
      solution: "Step 1: Differentiate once to get the mean: $M_X'(s)=\\frac12e^s+\\frac12e^{2s}$.\n\nStep 2: Evaluate at 0: $E[X]=M_X'(0)=1$.\n\nStep 3: Differentiate twice to get $E[X^2]$: $M_X''(s)=\\frac12e^s+e^{2s}$.\n\nStep 4: Evaluate at 0: $E[X^2]=M_X''(0)=3/2$.\n\nStep 5: Use $Var[X]=E[X^2]-(E[X])^2$: $Var[X]=3/2-1^2=1/2$."
    }
  ],
  "Week 8": [
    {
      type: "Chebyshev bound",
      source: "Week 8 lecture example",
      prompt: "EXAMPLE: In a DNA sequencing experiment, each sequencing read independently produces an error with probability 0.05. Suppose $X$ denotes the total number of sequencing errors among 1000 reads. A bioengineer is concerned about sequencing runs in which at least 7% of all reads contain errors, since such runs are considered experimentally unusable. For a given experiment, find an upper bound on the probability that at least 7% of reads contain sequencing errors. Solve using Chebyshev's inequality.",
      solution: "Step 1: Identify the count distribution: $X\\sim Binomial(n=1000,p=0.05)$.\n\nStep 2: Compute the mean and variance: $E[X]=1000(0.05)=50$ and $Var[X]=1000(0.05)(0.95)=47.5$.\n\nStep 3: Translate 7% of 1000 reads into a count: $X\\ge70$.\n\nStep 4: Convert the one-sided event into a Chebyshev event: $X\\ge70$ implies $|X-50|\\ge20$.\n\nStep 5: Apply Chebyshev: $P(X\\ge70)\\le P(|X-50|\\ge20)\\le47.5/20^2=0.11875$."
    },
    {
      type: "Chernoff bound",
      source: "Homework 6 Problem 6",
      prompt: "Problem 6 [18 points]. In a single-cell microfluidics experiment, a bioengineer prepares a batch of droplets for single-cell RNA sequencing. Due to random loading variability, some droplets contain more than one cell. These are called doublet droplets and can interfere with downstream analysis. Suppose the number of doublet droplets in one batch is modeled as a Poisson random variable $X\\sim Poisson(\\lambda=5)$. A batch is considered low quality if it contains at least 12 doublet droplets. Use a Chernoff bound to find an upper bound on the probability of having at least 12 doublet droplets. Make sure to first derive the moment generating function of $X$.",
      solution: "Step 1: Start with the MGF for a Poisson random variable. For $X\\sim Poisson(5)$, $M_X(t)=\\exp(5(e^t-1))$.\n\nStep 2: Apply Chernoff's bound for an upper tail: $P(X\\ge12)\\le e^{-12t}M_X(t)$ for $t>0$.\n\nStep 3: Substitute the MGF: $P(X\\ge12)\\le\\exp(5(e^t-1)-12t)$.\n\nStep 4: Optimize the exponent by differentiating: $\\frac{d}{dt}[5(e^t-1)-12t]=5e^t-12$.\n\nStep 5: Set the derivative to 0: $5e^t=12$, so $t=\\ln(12/5)$."
    }
  ],
  "Week 9": [
    {
      type: "CLT with continuity correction",
      source: "Week 9 lecture example",
      prompt: "EXAMPLE: A bioengineer is evaluating the quality of a DNA sequencing experiment. In this experiment, each sequencing read may contain an error due to limitations of the sequencing chemistry, imaging noise, or base-calling uncertainty. Suppose that each read independently has probability of 0.05 to contain an error. The bioengineer generates 100 reads and wants to approximate the probability that 10 to 15 reads contain errors. Solve the problem exactly using Binomial distribution and also Central Limit Theorem.",
      solution: "Step 1: Exact model: $S_{100}\\sim Binomial(n=100,p=0.05)$.\n\nStep 2: Write the exact probability as a binomial sum: $P(10\\le S_{100}\\le15)=\\sum_{k=10}^{15}\\binom{100}{k}(0.05)^k(0.95)^{100-k}\\approx0.0282$.\n\nStep 3: For the CLT approximation, compute $\\mu=np=5$ and $\\sigma^2=np(1-p)=4.75$.\n\nStep 4: Apply continuity correction: $P(10\\le S_{100}\\le15)\\approx P(9.5\\le N\\le15.5)$ where $N\\sim N(5,4.75)$.\n\nStep 5: Standardize the two endpoints and use the standard normal CDF."
    },
    {
      type: "Point estimators",
      source: "Week 9 lecture example",
      prompt: "EXAMPLE: Suppose a bioengineer wants to estimate the true average concentration of a biomarker, $X$, in a patient population. Let $\\theta$ denote the true average biomarker concentration and $\\sigma^2$ the true variance of biomarker concentration. The bioengineer collects a random sample of $n$ independent and representative patient measurements: $X_1,X_2,\\ldots,X_n$. Evaluate the following estimators for $\\theta$: $\\hat\\Theta_1=X_1$, $\\hat\\Theta_2=\\bar X=(X_1+X_2+\\cdots+X_n)/n$, and $\\hat\\Theta_3=(X_1^2+X_2^2+\\cdots+X_n^2)/n^2$.",
      solution: "Step 1: Check $\\hat\\Theta_1=X_1$. Since $E[X_1]=\\theta$, this estimator is unbiased and $MSE(\\hat\\Theta_1)=Var(X_1)=\\sigma^2$.\n\nStep 2: Check $\\hat\\Theta_2=\\bar X$. Since $E[\\bar X]=\\theta$, this estimator is unbiased and $MSE(\\hat\\Theta_2)=Var(\\bar X)=\\sigma^2/n$.\n\nStep 3: Check $\\hat\\Theta_3=(X_1^2+\\cdots+X_n^2)/n^2$. Since $E[X_i^2]=\\sigma^2+\\theta^2$, $E[\\hat\\Theta_3]=(\\sigma^2+\\theta^2)/n$.\n\nStep 4: Because $E[\\hat\\Theta_3]$ is not generally equal to $\\theta$, $\\hat\\Theta_3$ is generally biased for $\\theta$."
    }
  ],
  "Week 10": [
    {
      type: "MLE exponential",
      source: "Week 10 lecture example",
      prompt: "EXAMPLE: A bioengineer is studying the degradation time of a therapeutic enzyme embedded in a tissue scaffold. The degradation time is continuous, non-negative, and is assumed to follow an Exponential distribution with unknown rate parameter $\\theta$: $X_i\\sim Exponential(\\lambda=\\theta)$. Four independent degradation-time measurements are recorded, in hours: $x_1=1.23$, $x_2=3.32$, $x_3=1.98$, $x_4=2.12$. Assuming that $X_1,X_2,X_3,X_4$ are independent and identically distributed, find the likelihood function and the maximum likelihood estimate of the degradation rate $\\theta$.",
      solution: "Step 1: Write the exponential density: $f(x;\\theta)=\\theta e^{-\\theta x}$ for $x\\ge0$.\n\nStep 2: Multiply the four independent densities: $L(1.23,3.32,1.98,2.12;\\theta)=\\theta^4e^{-\\theta(1.23+3.32+1.98+2.12)}$.\n\nStep 3: Add the observations: $1.23+3.32+1.98+2.12=8.65$, so $L(1.23,3.32,1.98,2.12;\\theta)=\\theta^4e^{-8.65\\theta}$.\n\nStep 4: Take logs: $\\ell(\\theta)=4\\ln\\theta-8.65\\theta$.\n\nStep 5: Differentiate and set to 0: $\\ell'(\\theta)=4/\\theta-8.65=0$.\n\nStep 6: Solve: $\\hat\\theta=4/8.65\\approx0.462$."
    },
    {
      type: "P-value: one-sided vs two-sided",
      source: "Week 10 lecture example",
      prompt: "EXAMPLE: A team of bioengineers is testing an automated microfluidic device designed to sort immune cells into two categories: activated and non-activated. According to the design specification, the system should classify cells as activated 50% of the time when using a standardized cell mixture. Let $\\theta$ denote the probability that a randomly selected cell is classified as activated by the device: $\\theta=P(\\text{activated classification})$. To assess the accuracy of the system, the team runs 100 trials using the reference cell population and observes 60 activations. Answer the following: (a) Based on the observation, is there sufficient evidence at the 0.05 significance level to conclude that the device activates more than 50% of cells? What is the p-value associated with this test? (b) Is there evidence at the 0.05 significance level to suggest that the device's activation rate is not equal to 50%? What is the p-value associated with this test?",
      solution: "Step 1: Under $H_0$, the activation count is $X\\sim Binomial(n=100,p=0.50)$.\n\nStep 2: Compute the null mean and variance: $E[X]=50$ and $Var[X]=100(0.50)(0.50)=25$.\n\nStep 3: Standardize the observed count $X=60$: $z=(60-50)/5=2$.\n\n(a) For the right-tailed test, $p=1-\\Phi(2)\\approx0.0228$. Since $0.0228<0.05$, reject $H_0$.\n\n(b) For the two-sided test, $p=2[1-\\Phi(2)]\\approx0.0456$. Since $0.0456<0.05$, reject $H_0$."
    }
  ]
};
const QUICK_SHEETS = [
  {
    "label": "Week 1 Lectures 1-2",
    "title": "Probability, Statistics, Counting, Sets",
    "color": "#5F5E5A",
    "bg": "#F1EFE8",
    "formulas": [
      [
        "Equally likely probability",
        "$$P(A)=\\frac{|A|}{|\\Omega|}$$",
        "Use when every outcome in the sample space has the same probability."
      ],
      [
        "With replacement, order matters",
        "$$n^k$$",
        "Use when you choose k times, items can repeat, and order matters."
      ],
      [
        "Without replacement, order matters",
        "$$\\frac{n!}{(n-k)!}$$",
        "Permutation. Use when selected items cannot repeat and different orders count separately."
      ],
      [
        "Without replacement, order does not matter",
        "$$\\binom{n}{k}=\\frac{n!}{(n-k)!k!}$$",
        "Combination. Use when only the group matters."
      ],
      [
        "With replacement, order does not matter",
        "$$\\binom{n+k-1}{k}$$",
        "Stars and bars. Use when repeats allowed but order ignored."
      ],
      [
        "Union of two events",
        "$$P(A\\cup B)=P(A)+P(B)-P(A\\cap B)$$",
        "Use for OR / at least one when A and B may overlap."
      ],
      [
        "Complement",
        "$$P(A^c)=1-P(A)$$",
        "Use for NOT, none, or at least one problems."
      ],
      [
        "De Morgan",
        "$$(A\\cup B)^c=A^c\\cap B^c,\\quad (A\\cap B)^c=A^c\\cup B^c$$",
        "Use to translate neither / not both."
      ]
    ]
  },
  {
    "label": "Week 2 Lectures 3-4",
    "title": "Probability Spaces, Conditional Probability, Bayes",
    "color": "#0F6E56",
    "bg": "#E1F5EE",
    "formulas": [
      [
        "Probability space",
        "$$(\\Omega,\\mathcal F,P)$$",
        "Omega is all outcomes, F is the set of events, and P assigns probabilities."
      ],
      [
        "Conditional probability",
        "$$P(A|B)=\\frac{P(A\\cap B)}{P(B)}$$",
        "Use whenever B is already known to have happened."
      ],
      [
        "Multiplication rule",
        "$$P(A\\cap B)=P(A|B)P(B)=P(B|A)P(A)$$",
        "Use for AND when conditional probabilities are given."
      ],
      [
        "Law of total probability",
        "$$P(A)=\\sum_i P(A|B_i)P(B_i)$$",
        "Use when the population is split into groups/lines/subtypes."
      ],
      [
        "Bayes' rule",
        "$$P(B_j|A)=\\frac{P(A|B_j)P(B_j)}{\\sum_i P(A|B_i)P(B_i)}$$",
        "Use to flip conditioning, especially positive-test questions."
      ],
      [
        "Independence",
        "$$P(A\\cap B)=P(A)P(B)$$",
        "Equivalent to $P(A|B)=P(A)$ when $P(B)>0$."
      ],
      [
        "Conditional independence",
        "$$P(A\\cap B|C)=P(A|C)P(B|C)$$",
        "Use when independent only within a subgroup C; may fail overall."
      ]
    ]
  },
  {
    "label": "Week 3 Lectures 5-6",
    "title": "Random Variables, PMF, Expected Value, Variance",
    "color": "#854F0B",
    "bg": "#FAEEDA",
    "formulas": [
      [
        "Random variable",
        "$$X:\\Omega\\to\\mathbb R$$",
        "A function mapping outcomes to numbers."
      ],
      [
        "PMF",
        "$$p_X(x)=P(X=x),\\quad \\sum_{x\\in R_X}p_X(x)=1$$",
        "Use for discrete random variables."
      ],
      [
        "Event from PMF",
        "$$P(X\\in S)=\\sum_{x\\in S}P(X=x)$$",
        "Add probabilities for all values in the event."
      ],
      [
        "Expected value",
        "$$E[X]=\\sum_x xP(X=x)$$",
        "Long-run average of a discrete random variable."
      ],
      [
        "LOTUS discrete",
        "$$E[g(X)]=\\sum_x g(x)P(X=x)$$",
        "Use to get $E[X^2]$, $E[e^{tX}]$, etc. without finding distribution of g(X)."
      ],
      [
        "Variance",
        "$$Var[X]=E[(X-E[X])^2]=E[X^2]-(E[X])^2$$",
        "Use after finding $E[X]$ and $E[X^2]$."
      ],
      [
        "Linearity",
        "$$E[aX+b]=aE[X]+b,\\quad E[X+Y]=E[X]+E[Y]$$",
        "Always true, even when variables are dependent."
      ],
      [
        "Variance scaling",
        "$$Var[aX+b]=a^2Var[X]$$",
        "Constants shift the mean but do not change variance."
      ],
      [
        "Bernoulli",
        "$$P(X=1)=p,\\ E[X]=p,\\ Var[X]=p(1-p)$$",
        "Single yes/no trial."
      ],
      [
        "Binomial",
        "$$P(X=k)=\\binom nkp^k(1-p)^{n-k},\\ E[X]=np,\\ Var[X]=np(1-p)$$",
        "Fixed number of independent trials; count successes."
      ],
      [
        "Geometric",
        "$$P(X=k)=(1-p)^{k-1}p,\\ E[X]=1/p,\\ Var[X]=(1-p)/p^2,\\ P(X>k)=(1-p)^k$$",
        "Number of trials until first success; tail shortcut is $(1-p)^k$."
      ]
    ]
  },
  {
    "label": "Week 4 Lectures 7-8",
    "title": "Pascal, Hypergeometric, Poisson, Continuous RVs",
    "color": "#993C1D",
    "bg": "#FAECE7",
    "formulas": [
      [
        "Pascal / negative binomial",
        "$$P(X=k)=\\binom{k-1}{m-1}p^m(1-p)^{k-m},\\ k=m,m+1,\\ldots$$",
        "Identify: repeat independent trials until the m-th success. $k$ = total trials, $m$ = required successes, $p$ = success probability."
      ],
      [
        "Pascal mean/variance",
        "$$E[X]=m/p,\\quad Var[X]=m(1-p)/p^2$$",
        "$m$ = number of successes you need; $p$ = probability of success on each trial."
      ],
      [
        "Hypergeometric",
        "$$P(X=k)=\\frac{\\binom Kk\\binom{N-K}{n-k}}{\\binom Nn}$$",
        "Identify: sample without replacement. $N$ = total population, $K$ = successes in population, $n$ = sample size, $k$ = successes drawn."
      ],
      [
        "Hypergeometric mean/variance",
        "$$E[X]=nK/N,\\quad Var[X]=n\\frac KN(1-\\frac KN)\\frac{N-n}{N-1}$$",
        "$K/N$ is success fraction; $(N-n)/(N-1)$ is finite-population correction."
      ],
      [
        "Poisson",
        "$$P(X=k)=e^{-\\lambda}\\frac{\\lambda^k}{k!},\\quad k=0,1,2,\\ldots$$",
        "Identify: count events in fixed time/area/volume. $k$ = event count; $\\lambda$ = expected count/rate for that interval."
      ],
      [
        "Poisson properties",
        "$$E[X]=\\lambda,\\quad Var[X]=\\lambda,\\quad N(t)\\sim Poisson(\\lambda t)$$",
        "Check: support $0,1,2,...$ and mean = variance = $\\lambda$. Approx Binomial when $n$ large, $p$ small, $\\lambda=np$; for rate $\\lambda$ per unit time, interval $t$ gives mean $\\lambda t$."
      ],
      [
        "Tail shortcuts",
        "$$\\begin{aligned}P(X>n)&=1-P(X\\le n)=1-F_X(n)\\\\P(X>n)&=1-\\sum_{k=0}^{n}P(X=k)\\quad\\text{(discrete integer-valued X)}\\\\P(X\\ge n)&=1-P(X<n)\\\\P(X>n)&=\\int_n^\\infty f_X(u)\\,du=1-F_X(n)\\quad\\text{(continuous X)}\\end{aligned}$$",
        "Use complements for upper tails; sums for discrete X and integrals for continuous X."
      ],
      [
        "PDF properties",
        "$$f_X(x)\\ge0,\\quad \\int_{-\\infty}^{\\infty}f_X(x)dx=1$$",
        "Continuous RV; probabilities are areas."
      ],
      [
        "CDF from PDF",
        "$$F_X(x)=\\int_{-\\infty}^{x}f_X(t)dt$$",
        "Use for $P(X\\le x)$ or to find intervals."
      ],
      [
        "Interval probability",
        "$$P(a<X\\le b)=F_X(b)-F_X(a)$$",
        "Endpoints do not matter for continuous variables."
      ],
      [
        "Uniform",
        "$$X\\sim U(a,b): f(x)=1/(b-a),\\ F_X(x)=(x-a)/(b-a),\\ a\\le x\\le b,\\ E[X]=(a+b)/2,\\ Var[X]=(b-a)^2/12$$",
        "Identify: all values in interval equally likely. $a$ = lower endpoint, $b$ = upper endpoint."
      ]
    ]
  },
  {
    "label": "Week 5 Lectures 9-10",
    "title": "Transformations and Continuous Distributions",
    "color": "#185FA5",
    "bg": "#E6F1FB",
    "formulas": [
      [
        "Monotone transformation",
        "$$f_Y(y)=f_X(g^{-1}(y))\\left|\\frac{d}{dy}g^{-1}(y)\\right|$$",
        "Use when g is one-to-one and differentiable."
      ],
      [
        "Derivative inverse form",
        "$$f_Y(y)=\\frac{f_X(g^{-1}(y))}{|g'(g^{-1}(y))|}$$",
        "Same formula; useful when g'(x) is easier."
      ],
      [
        "Non-monotone transformation",
        "$$f_Y(y)=\\sum_i f_X(g_i^{-1}(y))\\left|\\frac{d}{dy}g_i^{-1}(y)\\right|$$",
        "Split the range of X into intervals where g is monotone, then add branches."
      ],
      [
        "CDF method",
        "$$F_Y(y)=P(g(X)\\le y),\\quad f_Y(y)=F_Y'(y)$$",
        "Safest method when transformation is tricky."
      ],
      [
        "Continuous LOTUS",
        "$$\\begin{aligned}E[g(X)]&=\\int_{-\\infty}^{\\infty}g(x)f_X(x)\\,dx\\\\\\text{Special cases:}\\quad E[X]&=\\int_{-\\infty}^{\\infty}x f_X(x)\\,dx\\\\E[X^2]&=\\int_{-\\infty}^{\\infty}x^2f_X(x)\\,dx\\end{aligned}$$",
        "Use the density directly for a function of $X$; mean and second moment are special cases."
      ],
      [
        "Inverse examples",
        "$$\\begin{aligned}Y=aX+b&\\Rightarrow g^{-1}(y)=\\frac{y-b}{a}\\\\Y=1/X&\\Rightarrow g^{-1}(y)=1/y,\\ \\left|\\frac{d}{dy}g^{-1}(y)\\right|=1/y^2\\\\Y=\\sqrt X&\\Rightarrow g^{-1}(y)=y^2,\\ \\frac{d}{dy}g^{-1}(y)=2y\\end{aligned}$$",
        "Always find the support/range of Y first before writing $f_Y(y)$."
      ],
      [
        "Exponential PDF/CDF",
        "$$f(x)=\\lambda e^{-\\lambda x},\\ x\\ge0;\\quad F(x)=1-e^{-\\lambda x};\\quad P(X>x)=e^{-\\lambda x}$$",
        "Identify: waiting time until first event, lifetime, decay time, time between Poisson events."
      ],
      [
        "Exponential properties",
        "$$E[X]=1/\\lambda,\\quad Var[X]=1/\\lambda^2,\\quad P(X>s+t|X>s)=P(X>t)$$",
        "Decision rule: if asking count, use Poisson; if asking waiting time, use Exponential."
      ],
      [
        "Gamma",
        "$$f(x)=\\frac{\\lambda^\\alpha}{\\Gamma(\\alpha)}x^{\\alpha-1}e^{-\\lambda x},\\quad E[X]=\\alpha/\\lambda,\\ Var[X]=\\alpha/\\lambda^2$$",
        "Identify: waiting time until the $\\alpha$-th event, or sum of independent Exponential(rate $\\lambda$) variables."
      ],
      [
        "Normal",
        "$$f(x)=\\frac{1}{\\sqrt{2\\pi\\sigma^2}}e^{-(x-\\mu)^2/(2\\sigma^2)}$$",
        "Identify: measurement noise, biological variation, averages/CLT, symmetric bell-shaped data."
      ],
      [
        "Standardization",
        "$$Z=\\frac{X-\\mu}{\\sigma},\\quad P(X\\le x)=\\Phi\\left(\\frac{x-\\mu}{\\sigma}\\right)$$",
        "Convert normal probability to standard normal table/CDF."
      ]
    ]
  },
  {
    "label": "Week 6 Lectures 11-12",
    "title": "Joint, Marginal, Conditional Distributions",
    "color": "#3C3489",
    "bg": "#EEEDFE",
    "formulas": [
      [
        "Joint PMF",
        "$$p_{XY}(x,y)=P(X=x,Y=y)$$",
        "Comma means AND for random variables."
      ],
      [
        "Discrete marginal",
        "$$p_X(x)=\\sum_y p_{XY}(x,y),\\quad p_Y(y)=\\sum_x p_{XY}(x,y)$$",
        "Sum out the variable you do not want."
      ],
      [
        "Discrete conditional",
        "$$p_{X|Y}(x|y)=\\frac{p_{XY}(x,y)}{p_Y(y)}$$",
        "Fix Y=y and normalize by the marginal."
      ],
      [
        "Discrete independence",
        "$$p_{XY}(x,y)=p_X(x)p_Y(y)\\quad\\text{for all }(x,y)$$",
        "Must hold for every pair, not just one."
      ],
      [
        "Joint CDF",
        "$$F_{XY}(x,y)=P(X\\le x,Y\\le y)$$",
        "Use for threshold events in two variables."
      ],
      [
        "Rectangle probability",
        "$$P(a<X\\le b,c<Y\\le d)=F(b,d)-F(a,d)-F(b,c)+F(a,c)$$",
        "2D inclusion-exclusion."
      ],
      [
        "Joint PDF",
        "$$P((X,Y)\\in A)=\\iint_A f_{XY}(x,y)dxdy$$",
        "Integrate over a region."
      ],
      [
        "Expectation of two RVs",
        "$$E[g(X,Y)]=\\sum_x\\sum_y g(x,y)p_{X,Y}(x,y),\\quad E[g(X,Y)]=\\iint g(x,y)f_{X,Y}(x,y)\\,dx\\,dy$$",
        "Use the joint PMF/PDF directly for functions of two variables."
      ],
      [
        "Continuous marginal",
        "$$f_X(x)=\\int f_{XY}(x,y)dy,\\quad f_Y(y)=\\int f_{XY}(x,y)dx$$",
        "Integrate out the other variable."
      ],
      [
        "Continuous conditional",
        "$$f_{X|Y}(x|y)=\\frac{f_{XY}(x,y)}{f_Y(y)}$$",
        "Same logic as discrete."
      ]
    ]
  },
  {
    "label": "Week 7 Lectures 13-14",
    "title": "Covariance, Correlation, Multiple RVs, MGF",
    "color": "#993C1D",
    "bg": "#FAECE7",
    "formulas": [
      [
        "Covariance definition",
        "$$Cov[X,Y]=E[(X-E[X])(Y-E[Y])]$$",
        "Measures linear association."
      ],
      [
        "Computational covariance",
        "$$Cov[X,Y]=E[XY]-E[X]E[Y]$$",
        "Most common exam formula."
      ],
      [
        "Covariance properties",
        "$$Cov[aX+b,cY+d]=ac\\,Cov[X,Y]$$",
        "Constants vanish; scale factors come out. Independence implies zero covariance, but zero covariance does not guarantee independence."
      ],
      [
        "Variance of sum",
        "$$Var[X+Y]=Var[X]+Var[Y]+2Cov[X,Y],\\quad Var[X-Y]=Var[X]+Var[Y]-2Cov[X,Y]$$",
        "Do not drop covariance unless independent."
      ],
      [
        "Correlation",
        "$$\\rho_{XY}=\\frac{Cov[X,Y]}{\\sigma_X\\sigma_Y}$$",
        "Standardized covariance; always between -1 and 1."
      ],
      [
        "Law of total expectation",
        "$$E[Y]=E[E[Y|X]]$$",
        "Condition when Y depends on X."
      ],
      [
        "Law of total variance",
        "$$Var[Y]=E[Var(Y|X)]+Var(E[Y|X])$$",
        "Within-condition variance plus between-condition variance."
      ],
      [
        "MGF",
        "$$M_X(t)=E[e^{tX}]$$",
        "Differentiate at 0 to get moments."
      ],
      [
        "Moments from MGF",
        "$$E[X^n]=M_X^{(n)}(0)$$",
        "Clarification: $E[X]=M_X'(0)$ and $E[X^2]=M_X''(0)$."
      ],
      [
        "Common MGFs",
        "$$\\begin{aligned}\\text{Bernoulli}(p):\\ &M_X(t)=1-p+pe^t\\\\\\text{Binomial}(n,p):\\ &M_X(t)=(1-p+pe^t)^n\\\\\\text{Poisson}(\\lambda):\\ &M_X(t)=\\exp(\\lambda(e^t-1))\\\\\\text{Exponential}(\\lambda):\\ &M_X(t)=\\frac{\\lambda}{\\lambda-t},\\ t<\\lambda\\\\\\text{Normal}(\\mu,\\sigma^2):\\ &M_X(t)=\\exp(\\mu t+\\sigma^2 t^2/2)\\end{aligned}$$",
        "Memorize the standard families that show up most often on exams."
      ],
      [
        "Independent sum MGF",
        "$$M_{X+Y}(t)=M_X(t)M_Y(t)$$",
        "Only when independent."
      ]
    ]
  },
  {
    "label": "Week 8 Lectures 15-16",
    "title": "Probability Bounds",
    "color": "#A32D2D",
    "bg": "#FCEBEB",
    "formulas": [
      [
        "Markov inequality",
        "$$P(X\\ge a)\\le\\frac{E[X]}{a},\\quad X\\ge0,a>0$$",
        "Use when only the mean of a nonnegative RV is available."
      ],
      [
        "Chebyshev inequality",
        "$$P(|X-E[X]|\\ge b)\\le\\frac{Var[X]}{b^2},\\quad P(|X-E[X]|<b)\\ge 1-\\frac{Var[X]}{b^2}$$",
        "Use with mean and variance; works for any distribution."
      ],
      [
        "One-sided conversion",
        "$$P(X\\ge a)=P(X-\\mu\\ge a-\\mu)\\le P(|X-\\mu|\\ge a-\\mu)$$",
        "Use Chebyshev for upper tail by making it two-sided."
      ],
      [
        "Chernoff bound",
        "$$P(X\\ge a)\\le e^{-ta}M_X(t),\\quad t>0$$",
        "Use when MGF is known; optimize over t if asked."
      ],
      [
        "Lower tail Chernoff",
        "$$P(X\\le a)\\le e^{-ta}M_X(t),\\quad t<0$$",
        "Use negative t for lower-tail events."
      ],
      [
        "Binomial mean/variance reminder",
        "$$E[X]=np,\\quad Var[X]=np(1-p)$$",
        "Common input for Markov/Chebyshev examples."
      ]
    ]
  },
  {
    "label": "Week 9 Lectures 17-18",
    "title": "LLN, CLT, Statistical Inference, Mean Estimation",
    "color": "#4338CA",
    "bg": "#EEF2FF",
    "formulas": [
      [
        "Sample average",
        "$$\\bar X_n=\\frac{1}{n}\\sum_{i=1}^n X_i$$",
        "Average of iid measurements."
      ],
      [
        "Mean of sample average",
        "$$E[\\bar X_n]=\\mu$$",
        "Shows sample mean is unbiased for population mean."
      ],
      [
        "Variance of sample average",
        "$$Var[\\bar X_n]=\\sigma^2/n$$",
        "Averages become less variable as n grows."
      ],
      [
        "Weak LLN",
        "$$\\lim_{n\\to\\infty}P(|\\bar X_n-\\mu|\\ge\\epsilon)=0$$",
        "Averages converge in probability."
      ],
      [
        "CLT for average",
        "$$\\bar X_n\\approx N(\\mu,\\sigma^2/n)$$",
        "Large n; individual distribution need not be normal."
      ],
      [
        "CLT standardization",
        "$$Z=\\frac{\\bar X_n-\\mu}{\\sigma/\\sqrt n}\\approx N(0,1)$$",
        "Convert average to standard normal."
      ],
      [
        "CLT for sum",
        "$$S_n=\\sum X_i\\approx N(n\\mu,n\\sigma^2),\\quad X\\sim Binomial(n,p)\\approx N(np,np(1-p)),\\quad P(X\\le k)\\approx P(N\\le k+0.5)$$",
        "Use for sums and binomial counts; add continuity correction when asked."
      ],
      [
        "Standard error",
        "$$SE=\\sigma/\\sqrt n$$",
        "Uncertainty of an average."
      ],
      [
        "Bias",
        "$$Bias[\\hat\\theta]=E[\\hat\\theta]-\\theta$$",
        "Unbiased if bias is 0."
      ],
      [
        "MSE",
        "$$MSE[\\hat\\theta]=Var[\\hat\\theta]+Bias[\\hat\\theta]^2$$",
        "Compare estimators; for unbiased estimators MSE=variance."
      ]
    ]
  },
  {
    "label": "Week 10 Lectures 19-20",
    "title": "Variance Estimation, MLE, Hypothesis Testing",
    "color": "#854F0B",
    "bg": "#FAEEDA",
    "formulas": [
      [
        "Known-mean variance estimator",
        "$$\\hat\\sigma_\\mu^2=\\frac1n\\sum_{i=1}^n(X_i-\\mu)^2$$",
        "Unbiased if true $\\mu$ is known."
      ],
      [
        "Biased variance with sample mean",
        "$$\\bar S^2=\\frac1n\\sum_{i=1}^n(X_i-\\bar X)^2$$",
        "Biased low for $\\sigma^2$."
      ],
      [
        "Bias of biased variance",
        "$$E[\\bar S^2]=\\frac{n-1}{n}\\sigma^2,\\quad Bias=-\\frac{1}{n}\\sigma^2$$",
        "Shows why divide by $n-1$."
      ],
      [
        "Sample variance",
        "$$S^2=\\frac{1}{n-1}\\sum_{i=1}^n(X_i-\\bar X)^2$$",
        "Unbiased estimator of $\\sigma^2$."
      ],
      [
        "Computational variance",
        "$$S^2=\\frac{1}{n-1}\\left(\\sum X_i^2-n\\bar X^2\\right)$$",
        "Fast calculation from raw data."
      ],
      [
        "Sample standard deviation",
        "$$S=\\sqrt{S^2}$$",
        "Common estimator of $\\sigma$, but generally biased."
      ],
      [
        "Likelihood",
        "$$L(\\theta)=\\prod_{i=1}^n f(X_i;\\theta)$$",
        "Probability/density of observed data as a function of $\\theta$."
      ],
      [
        "Log likelihood",
        "$$\\ell(\\theta)=\\log L(\\theta)$$",
        "Turns product into sum; easier derivatives."
      ],
      [
        "MLE steps",
        "$$\\frac{d\\ell}{d\\theta}=0,\\quad \\frac{d^2\\ell}{d\\theta^2}<0$$",
        "Solve critical point and check maximum."
      ],
      [
        "Poisson MLE",
        "$$\\hat\\lambda=\\bar X$$",
        "For iid Poisson samples."
      ],
      [
        "Exponential MLE",
        "$$\\hat\\lambda=1/\\bar X$$",
        "For iid exponential(rate $\\lambda$)."
      ],
      [
        "Z test statistic",
        "$$Z=\\frac{\\bar X-\\mu_0}{\\sigma/\\sqrt n}$$",
        "Use when $\\sigma$ known or CLT approximation is allowed."
      ],
      [
        "p-value tails",
        "$$p=\\Phi(z_{obs})\\ (\\text{left tail}),\\quad p=1-\\Phi(z_{obs})\\ (\\text{right tail}),\\quad p=2[1-\\Phi(|z_{obs}|)]\\ (\\text{two-sided})$$",
        "Match the p-value formula to the direction of $H_1$."
      ],
      [
        "Critical rule",
        "$$\\text{Reject }H_0\\text{ if }p<\\alpha$$",
        "Small p-value = data is unlikely under $H_0$."
      ],
      [
        "Type I / Type II",
        "Type I = reject true $H_0$; Type II = fail to reject false $H_0$; Power = $1-\\beta$",
        "Useful for interpretation questions."
      ]
    ]
  }
];
const FORMULA_SHEET_PAGES = [
  {
    title: "Page 1: Probability, Bayes, Random Variables, Common Distributions",
    weeks: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"]
  },
  {
    title: "Page 2: Joint RVs, Moments, Bounds, CLT, Estimation, Testing",
    weeks: ["Week 6", "Week 7", "Week 8", "Week 9", "Week 10"]
  }
];
const DISTRIBUTION_ID_GUIDE = [
  ["Bernoulli", "One trial, yes/no, success/failure.", "$X\\in\\{0,1\\}$"],
  ["Binomial", "Fixed number $n$ independent trials; count successes.", "$n$ trials, $k$ successes, $p$ success prob"],
  ["Geometric", "Repeat until first success; X = trial number of first success.", "$k$ = first-success trial"],
  ["Pascal", "Repeat until m-th success; X = total trials needed.", "$k$ total trials, $m$ successes, $p$ success prob"],
  ["Hypergeometric", "Sample without replacement from finite population.", "$N$ total, $K$ successes, $n$ sample, $k$ drawn successes"],
  ["Poisson", "Count events in fixed time/area/volume with rate $\\lambda$.", "$k$ count, $\\lambda$ expected count in interval"],
  ["Uniform", "All values in interval equally likely.", "$a$ lower, $b$ upper"],
  ["Exponential", "Waiting time until first event; time between Poisson events.", "if count -> Poisson; if wait -> Exponential"],
  ["Gamma", "Waiting time until $\\alpha$-th event or sum of exponentials.", "$\\alpha$ stages/events"],
  ["Normal", "Measurement noise, biological variation, averages/CLT.", "bell-shaped / standardized z"]
];
const FINALS = [
  {
    "id": "2025",
    "title": "Practice Final Version A - Spring 2025 PDF wording + LaTeX notation",
    "duration": 10800,
    "questions": [
      {
        "id": "25q1",
        "points": 11,
        "topic": "Bayes",
        "prompt": "Problem 1 [11 points]. Suppose a CRISPR-based genome editing tool has been evaluated for detecting off-target edits. Lab tests show that if an off-target edit occurs, the system detects it 92% of the time. If no off-target edit occurs, the system reports no edit 88% of the time. Assume off-target edits occur in 5% of all genome edits. A test run returns a positive off-target detection. What is the probability that an off-target edit actually occurred?",
        "keywords": [
          "0.2875",
          "0.288",
          "bayes",
          "0.16"
        ],
        "solution": "Let $A=$ positive test and $O=$ off-target edit. $P(O)=0.05$, $P(A|O)=0.92$, $P(A|O^c)=0.12$. $P(A)=0.92(0.05)+0.12(0.95)=0.16$. $P(O|A)=0.92(0.05)/0.16=0.2875$."
      },
      {
        "id": "25q2",
        "points": 11,
        "topic": "Conditional expectation",
        "prompt": `Problem 2 [11 points]. In a synthetic biology experiment, you are studying the relationship between gene activation (modeled as random variable $X$) and the presence of a specific regulatory protein (modeled as random variable $Y$) in a cell population. The random variables $X$ and $Y$ are binary and jointly distributed as shown in the table below:

$Y=0$ (No protein), $Y=1$ (Protein present)
$X=0$ (Gene off): $1/5$, $2/5$
$X=1$ (Gene on): $2/5$, $0$

Let $Z=E[X|Y]$, the expected level of gene activation given the protein state. Answer the following:
a) Find the marginal PMFs of gene activation, $X$, and protein presence, $Y$
b) Find the conditional PMFs of $X$ when $Y=0$ or when $Y=1$
c) Find the probability mass function of $Z$
d) Find $E[Z]$ and $Var[Z]$`,
        "keywords": [
          "3/5",
          "2/5",
          "2/3",
          "8/75",
          "z"
        ],
        "solution": "$P_X(0)=3/5$, $P_X(1)=2/5$; $P_Y(0)=3/5$, $P_Y(1)=2/5$. $X|Y=0\\sim Bernoulli(2/3)$; $X|Y=1\\sim Bernoulli(0)$. $Z=2/3$ with probability $3/5$ and $0$ with probability $2/5$. $E[Z]=2/5$. $Var[Z]=4/15-4/25=8/75$."
      },
      {
        "id": "25q3",
        "points": 11,
        "topic": "Random sum",
        "prompt": `Problem 3 [11 points]. Let $N$ be the random number of action potentials (spikes) generated by a neuron in a given time interval. Suppose $N\\sim Geometric(p)$, where $0<p<1$ is a known firing rate.

Let $X_i$ be the duration of the refractory period following the ith spike, for $i=1,2,\\ldots,N$. Assume the $X_i$'s are independent of each other and also independent of $N$. Further, assume $X_i\\sim Uniform(0,a)$, where $a>0$ is known. Let $Y$ be the sum of the durations of the refractory period:

$$Y=\\sum_{i=1}^N X_i$$

Find $E[Y]$ and $Var[Y]$.`,
        "keywords": [
          "a/(2p)",
          "a^2",
          "12p",
          "1-p",
          "4p^2"
        ],
        "solution": "$E[N]=1/p$, $Var[N]=(1-p)/p^2$. $E[X]=a/2$, $Var[X]=a^2/12$. $E[Y]=E[N]E[X]=a/(2p)$. $Var[Y]=E[N]Var[X]+Var[N](E[X])^2=a^2/(12p)+a^2(1-p)/(4p^2)$."
      },
      {
        "id": "25q4",
        "points": 11,
        "topic": "Transformation",
        "prompt": "Problem 4 [11 points]. Let $X\\sim N(\\mu=0,\\sigma^2=1)$ be a standard normal random variable, and $Y=X^2$. Use the method of transformations to derive the probability density function $f_Y(y)$ for $y\\ge0$. Express your final answer in simplified symbolic form. You may leave constants such as $\\sqrt{2\\pi}$ and expressions like $e^{-y/2}$ unevaluated.",
        "keywords": [
          "sqrt",
          "-sqrt",
          "1/sqrt",
          "2pi",
          "e^{-y/2}"
        ],
        "solution": "Branches $x=\\sqrt y$ and $x=-\\sqrt y$. $f_Y(y)=f_X(\\sqrt y)/(2\\sqrt y)+f_X(-\\sqrt y)/(2\\sqrt y)=\\frac{1}{\\sqrt{2\\pi y}}e^{-y/2}$, for $y>0$."
      },
      {
        "id": "25q5",
        "points": 11,
        "topic": "MGF",
        "prompt": `Problem 5 [11 points]. A random variable $X$ is defined based on its probability density function:

$$f_X(x)=\\frac{1}{2a}e^{-|x|/a}$$

Where $a\\in\\mathbb R$ and $a>0$. Given that $Y=|X|$, derive the moment generating function of $Y$.`,
        "keywords": [
          "exponential",
          "1/a",
          "1/(1-at)",
          "t<1/a"
        ],
        "solution": "$Y$ has exponential distribution with rate $1/a$. Thus $M_Y(t)=(1/a)/(1/a-t)=1/(1-at)$, for $t<1/a$."
      },
      {
        "id": "25q6",
        "points": 11,
        "topic": "Covariance by conditioning",
        "prompt": `Problem 6 [11 points]. A random variable $X$ is defined based on its cumulative distribution function:

$$F_X(x)=\\begin{cases}0,&x\\le1\\\\(x-1)/(3-1),&1<x\\le3\\\\1,&x>3\\end{cases}$$

Provided that $Y|X\\sim Exponential(X)$, find the covariance of $X$ and $Y$. Based on the covariance, interpret the relationship between $X$ and $Y$. As the value of $X$ increases, does the expected value of $Y$ tend to increase, decrease, or remain constant? Hint: Consider using the law of total variance and the law of total probability to solve this problem. For calculation simplicity please consider $\\log_e 3=\\ln 3\\approx1.10$.`,
        "keywords": [
          "uniform",
          "1-ln3",
          "-0.10",
          "decrease",
          "1/x"
        ],
        "solution": "$X\\sim Uniform(1,3)$. $E[X]=2$. $E[Y|X]=1/X$, so $E[Y]=(1/2)\\int_1^3 (1/x)\\,dx=\\ln 3/2$. $E[XY]=E[X(1/X)]=1$. $Cov(X,Y)=1-2(\\ln 3/2)=1-\\ln 3\\approx-0.10$. $E[Y|X]=1/X$ decreases as $X$ increases."
      },
      {
        "id": "25q7",
        "points": 11,
        "topic": "CLT",
        "prompt": "Problem 7 [11 points]. In a high-throughput DNA sequencing device, 2000 base pairs are read per sequencing cycle. Due to chemical noise and imaging errors, each base pair has a 2% chance of being misread. Errors are assumed to occur independently across base pairs. The downstream analysis pipeline can tolerate up to 60 sequencing errors per cycle without impacting the overall variant calling accuracy. If more than 60 errors occur in a cycle, the read is considered unreliable and discarded. Using the Central Limit Theorem, approximate the probability that a read is discarded due to excessive errors. Hint: for calculation simplicity please consider $\\Phi((60-40)/\\sqrt{39.2})=\\Phi(3.194)\\approx0.99932$, where $\\Phi$ is the standard normal cumulative distribution function.",
        "keywords": [
          "40",
          "39.2",
          "3.194",
          "0.00068"
        ],
        "solution": "$Y\\sim Binomial(2000,0.02)$. $\\mu=40$, $\\sigma^2=39.2$. $P(Y>60)\\approx P\\left(Z>\\frac{60-40}{\\sqrt{39.2}}\\right)=P(Z>3.194)=1-0.99932=0.00068$."
      },
      {
        "id": "25q8",
        "points": 11,
        "topic": "MLE Poisson",
        "prompt": "Problem 8 [11 points]. Given that $X_1,X_2,X_3,\\ldots,X_n$ is a random sample from $X\\sim Poisson(\\lambda)$, derive the maximum likelihood estimator for $\\lambda$. Hint: consider using the log likelihood function.",
        "keywords": [
          "lambda hat",
          "bar",
          "sum",
          "n",
          "log likelihood"
        ],
        "solution": "$\\ell(\\lambda)=-n\\lambda+(\\sum x_i)\\ln\\lambda-\\sum\\ln(x_i!)$. Set $d\\ell/d\\lambda=-n+\\sum x_i/\\lambda=0$. Thus $\\hat\\lambda=\\sum x_i/n=\\bar X$. Second derivative is negative."
      },
      {
        "id": "25q9",
        "points": 11,
        "topic": "Bias",
        "prompt": `Problem 9 [11 points]. In a bioengineering study of calcium signaling dynamics, a researcher records the peak intracellular calcium concentration in response to repeated stimuli across n cells using a fluorescent indicator. Let $X_1,X_2,X_3,\\ldots,X_n$ denote the measured peak calcium amplitudes (in microM) from each cell. Assume the $X_i$'s are independent and identically distributed with unknown mean $\\mu$ and unknown variance $\\sigma^2$. The researcher is interested in estimating the squared mean amplitude $\\theta=\\mu^2$, which is proportional to the power of the calcium response across the cell population. They define the estimator:

$$\\hat\\Theta=(\\bar X)^2=\\left(\\frac{1}{n}\\sum_{i=1}^n X_i\\right)^2$$

to estimate $\\theta$. Calculate the bias of $\\hat\\Theta$ for estimating $\\theta$. Does the estimator tend to underestimate, overestimate, or provide an unbiased estimate?`,
        "keywords": [
          "sigma^2/n",
          "positive",
          "overestimate",
          "E[xbar^2]"
        ],
        "solution": "$E[(\\bar X)^2]=Var(\\bar X)+(E[\\bar X])^2=\\sigma^2/n+\\mu^2$. Bias $=\\sigma^2/n$, which is positive, so it overestimates $\\mu^2$ on average."
      },
      {
        "id": "25q10",
        "points": 11,
        "topic": "Hypothesis testing",
        "prompt": `Problem 10 [11 points]. In a clinical bioengineering study, premature ventricular contractions (PVCs) are monitored as a biomarker for risk of cardiac events. It is known that in a healthy population, the number of PVCs per hour follows a normal distribution with mean $\\mu=50$ and standard deviation $\\sigma=12$. You want to define a PVC threshold above which a person is considered at significant risk of a heart attack. Specifically, you wish to determine a cutoff value $c$ such that a healthy individual has only a 1% chance of exceeding it, i.e., $P(PVCs>c|healthy)=0.01$. Assume that PVC measurements are averaged over a one-hour recording for each individual.
a) State the null and alternative hypotheses.
b) Derive the value of the threshold $c$ that would lead to a 1% false positive rate for healthy individuals (i.e., Type I error $\\alpha=0.01$).
c) For a new patient who shows 73 PVCs in a one-hour recording, compute the p-value under the null hypothesis that they are from the healthy population. Based on this p-value, briefly interpret whether this result is significant at the 0.05 level. Hint: for calculation simplicity please consider $\\Phi(23/12)=\\Phi(1.92)\\approx0.9726$ and $\\Phi^{-1}(0.99)\\approx2.33$, where $\\Phi$ is the standard normal cumulative distribution function and $\\Phi^{-1}$ is its inverse.`,
        "keywords": [
          "77.96",
          "0.0274",
          "reject",
          "0.05",
          "mu>50"
        ],
        "solution": "$H_0:\\mu=50$; $H_1:\\mu>50$. $c=50+12\\Phi^{-1}(0.99)=50+12(2.33)=77.96$. For 73, $z=(73-50)/12=1.92$, so $p=1-0.9726=0.0274$. Reject at $0.05$."
      }
    ]
  },
  {
    "id": "2024",
    "title": "Practice Final Version B - Spring 2024 condensed wording",
    "duration": 10800,
    "questions": [
      {
        "id": "24q1",
        "points": 11,
        "topic": "Conditional probability",
        "prompt": "A biased coin has $P(H)=p$ and $P(T)=q=1-p$. A game ends when $HH$ or $TT$ first appears. I win if $HH$ appears. Given that I won, find $P(\\text{first toss was }H)$.",
        "keywords": [
          "1/(2-p)",
          "bayes",
          "q",
          "1+q"
        ],
        "solution": "Using Bayes with $A=\\text{I win}$: $P(A|H)=p/(1-pq)$ and $P(A|T)=p^2/(1-pq)$. Then $P(H|A)=P(A|H)p/[P(A|H)p+P(A|T)q]=1/(1+q)=1/(2-p)$."
      },
      {
        "id": "24q2",
        "points": 11,
        "topic": "CLT",
        "prompt": "A codeword has 1000 bits, each with independent error probability 0.10. Decoding fails if errors exceed 125. Use CLT and $\\Phi(25/\\sqrt{90})=0.9958$ to approximate failure probability.",
        "keywords": [
          "100",
          "90",
          "0.0042",
          "25/sqrt"
        ],
        "solution": "$Y\\sim Binomial(1000,0.1)$. $\\mu=100$, $\\sigma^2=90$. $P(Y>125)\\approx P(Z>25/\\sqrt{90})=1-0.9958=0.0042$."
      },
      {
        "id": "24q3",
        "points": 11,
        "topic": "Poisson LOTUS",
        "prompt": "$X$ is Poisson with mean $\\lambda$. Without using $Var[X]=\\lambda$, show $E[X^2]=\\lambda^2+\\lambda$ using LOTUS.",
        "keywords": [
          "E[X(X-1)]",
          "lambda^2",
          "lambda^2+lambda",
          "lotus"
        ],
        "solution": "Compute $E[X(X-1)]=\\sum k(k-1)e^{-\\lambda}\\lambda^k/k!=\\lambda^2$. Since $X^2=X(X-1)+X$, $E[X^2]=\\lambda^2+\\lambda$."
      },
      {
        "id": "24q4",
        "points": 11,
        "topic": "Total expectation/variance",
        "prompt": "$X\\sim Uniform(1,2)$. Given $X=x$, $Y\\sim Exponential(\\text{rate }x)$. Find $E[Y]$ and $Var[Y]$. Use $\\ln2\\approx0.70$.",
        "keywords": [
          "ln2",
          "0.70",
          "E[1/X]",
          "total variance",
          "2-ln2"
        ],
        "solution": "$E[Y|X]=1/X$, $Var[Y|X]=1/X^2$. $E[Y]=\\int_1^2 (1/x)\\,dx=\\ln2\\approx0.70$. $Var[Y]=E[1/X^2]+Var(1/X)$. $E[1/X^2]=1/2$ and $E[1/X]=\\ln2$, so total variance is $1-(\\ln2)^2\\approx0.51$."
      },
      {
        "id": "24q5",
        "points": 11,
        "topic": "Indicator variables",
        "prompt": "$n$ people sit around a round table, $n>5$. Each tosses a fair coin. A person receives a present if their outcome differs from both neighbors. Let $X$ be the number receiving presents. Find $E[X]$ and outline $Var[X]$.",
        "keywords": [
          "indicator",
          "1/4",
          "n/4",
          "covariance"
        ],
        "solution": "Let $I_i=1$ if person $i$ differs from both neighbors. $P(I_i=1)=P(HTH\\text{ or }THT)=1/4$, so $E[X]=\\sum E[I_i]=n/4$. For $Var[X]$, use $Var(\\sum I_i)=\\sum Var(I_i)+2\\sum Cov(I_i,I_j)$, noting only nearby indicators are dependent on the circle."
      },
      {
        "id": "24q6",
        "points": 11,
        "topic": "Independence and moments",
        "prompt": "$X,Y,Z$ are independent, $X\\sim N(\\mu,\\sigma^2)$, and $Y,Z\\sim Uniform(0,2)$. Given $E[X^2Y+XYZ]=13$ and $E[XY^2+ZX^2]=14$, find $\\mu$ and $\\sigma$.",
        "keywords": [
          "E[Y]=1",
          "E[Z]=1",
          "E[Y^2]=4/3",
          "mu",
          "sigma"
        ],
        "solution": "Use independence: $E[Y]=E[Z]=1$, $E[Y^2]=4/3$, and $E[X^2]=\\mu^2+\\sigma^2$. The first equation gives $\\mu^2+\\sigma^2+\\mu=13$. The second gives $(4/3)\\mu+\\mu^2+\\sigma^2=14$. Subtract to get $\\mu/3=1$, so $\\mu=3$. Then $9+\\sigma^2+3=13$, so $\\sigma^2=1$ and $\\sigma=1$."
      },
      {
        "id": "24q7",
        "points": 11,
        "topic": "MSE",
        "prompt": "For iid $X_i$ with mean $\\theta$ and variance $\\sigma^2$, compare $\\Theta_1=X_1$ and $\\Theta_2=\\bar X$. Show both are unbiased and for $n>1$, $MSE(\\Theta_1)>MSE(\\Theta_2)$.",
        "keywords": [
          "unbiased",
          "sigma^2",
          "sigma^2/n",
          "mse"
        ],
        "solution": "$E[X_1]=\\theta$ and $E[\\bar X]=\\theta$, so both are unbiased. $MSE=Var$ for unbiased estimators. $Var(\\Theta_1)=\\sigma^2$ and $Var(\\Theta_2)=\\sigma^2/n$. For $n>1$, $\\sigma^2>\\sigma^2/n$."
      },
      {
        "id": "24q8",
        "points": 11,
        "topic": "MLE Exponential",
        "prompt": "Find the MLE of $\\theta$ for iid exponential(rate $\\theta$) observations $(1.23,3.32,1.98,2.12)$. Check second derivative.",
        "keywords": [
          "4/sum",
          "0.462",
          "negative",
          "1/xbar"
        ],
        "solution": "$\\ell(\\theta)=n\\ln\\theta-\\theta\\sum x_i$. Set $d\\ell/d\\theta=n/\\theta-\\sum x_i=0$, so $\\hat\\theta=n/\\sum x_i=4/(1.23+3.32+1.98+2.12)=4/8.65\\approx0.462$. Second derivative $-n/\\theta^2<0$."
      },
      {
        "id": "24q9",
        "points": 11,
        "topic": "MGF Laplace",
        "prompt": "Find the MGF of $X$ with pdf $f_X(x)=\\lambda e^{-\\lambda|x|}/2$, $x$ real, $\\lambda>0$.",
        "keywords": [
          "lambda^2",
          "lambda^2-t^2",
          "t<lambda",
          "split"
        ],
        "solution": "Split at 0: $M(t)=\\frac{\\lambda}{2}\\int_{-\\infty}^0 e^{tx}e^{\\lambda x}\\,dx+\\frac{\\lambda}{2}\\int_0^\\infty e^{tx}e^{-\\lambda x}\\,dx=\\frac{\\lambda}{2}[1/(\\lambda+t)+1/(\\lambda-t)]=\\lambda^2/(\\lambda^2-t^2)$, $|t|<\\lambda$."
      },
      {
        "id": "24q10",
        "points": 11,
        "topic": "Correlation",
        "prompt": "$Cov(X_1,X_2)=1$, $Var(X_1)=2$, $Var(X_2)=4$. Let $X_3=X_1+X_2+319$ and $X_4=X_2+1241$. Find $corr(X_3,X_4)$.",
        "keywords": [
          "5",
          "4",
          "3",
          "5/sqrt",
          "cov"
        ],
        "solution": "$Cov(X_3,X_4)=Cov(X_1+X_2,X_2)=Cov(X_1,X_2)+Var(X_2)=1+4=5$. $Var(X_3)=2+4+2(1)=8$ and $Var(X_4)=4$. Thus $corr(X_3,X_4)=5/\\sqrt{8\\cdot4}=5/\\sqrt{32}$."
      }
    ]
  },
  {
    "id": "2023",
    "title": "Practice Final Version C - Spring 2023 condensed wording",
    "duration": 10800,
    "questions": [
      {
        "id": "23q1",
        "points": 11,
        "topic": "Bayes",
        "prompt": "A drug test is positive with probability 0.98 for users and negative with probability 0.90 for non-users. Suppose 10% of the population uses the drug. A random person tests positive. What is P(user | positive)?",
        "keywords": [
          "0.52",
          "0.188",
          "bayes"
        ],
        "solution": "$P(+)=0.98(0.10)+0.10(0.90)=0.188$. $P(\\text{user}|+)=0.98(0.10)/0.188\\approx0.52$."
      },
      {
        "id": "23q2",
        "points": 11,
        "topic": "Conditional expectation",
        "prompt": "For joint PMF $p(0,0)=1/5$, $p(0,1)=2/5$, $p(1,0)=2/5$, $p(1,1)=0$, let $Z=E[X|Y]$. Find the PMF of $Z$, $E[Z]$, and $Var[Z]$.",
        "keywords": [
          "2/3",
          "3/5",
          "2/5",
          "8/75"
        ],
        "solution": "Same calculation: $Z=2/3$ with probability $3/5$ and $0$ with probability $2/5$. $E[Z]=2/5$ and $Var[Z]=8/75$."
      },
      {
        "id": "23q3",
        "points": 11,
        "topic": "Random sum",
        "prompt": "$N\\sim Poisson(\\beta)$. Given $N$, $X_i\\sim Exponential(\\lambda)$, independent of each other and of $N$. Let $Y=\\sum_{i=1}^N X_i$. Find $E[Y]$ and $Var[Y]$.",
        "keywords": [
          "beta/lambda",
          "2beta/lambda^2",
          "total variance"
        ],
        "solution": "$E[N]=\\beta$, $Var[N]=\\beta$, $E[X]=1/\\lambda$, $Var[X]=1/\\lambda^2$. $E[Y]=\\beta/\\lambda$. $Var[Y]=\\beta/\\lambda^2+\\beta(1/\\lambda)^2=2\\beta/\\lambda^2$."
      },
      {
        "id": "23q4",
        "points": 11,
        "topic": "Transformation",
        "prompt": "Let $X$ be standard normal and $Y=X^2$. Find $f_Y(y)$ using transformations.",
        "keywords": [
          "sqrt",
          "e^{-y/2}",
          "sqrt(2pi y)"
        ],
        "solution": "$f_Y(y)=\\frac{1}{\\sqrt{2\\pi y}}e^{-y/2}$, $y>0$, from branches $\\pm\\sqrt y$."
      },
      {
        "id": "23q5",
        "points": 11,
        "topic": "MGF",
        "prompt": "$X$ has pdf $f_X(x)=\\frac{1}{2a}e^{-|x|/a}$, $a>0$. Given $Y=|X|$, derive $M_Y(t)$.",
        "keywords": [
          "1/(1-at)",
          "exponential",
          "t<1/a"
        ],
        "solution": "$Y\\sim Exponential(\\text{rate }1/a)$, so $M_Y(t)=1/(1-at)$, $t<1/a$."
      },
      {
        "id": "23q6",
        "points": 11,
        "topic": "Covariance",
        "prompt": "$X$ has CDF 0 for $x\\le1$, $(x-1)/2$ for $1<x\\le3$, and 1 for $x>3$. Given $Y|X\\sim Exponential(\\text{rate }X)$, find $Cov(X,Y)$, using $\\ln3\\approx1.10$.",
        "keywords": [
          "1-ln3",
          "-0.10",
          "uniform"
        ],
        "solution": "$X\\sim Uniform(1,3)$. $E[X]=2$, $E[Y]=\\ln3/2$, $E[XY]=1$, so $Cov(X,Y)=1-\\ln3\\approx-0.10$."
      },
      {
        "id": "23q7",
        "points": 11,
        "topic": "CLT",
        "prompt": "A codeword has 1000 bits and each bit has independent error probability 0.10. Decoding fails if errors exceed 125. Use CLT with $\\Phi(25/\\sqrt{90})\\approx0.9958$.",
        "keywords": [
          "0.0042",
          "100",
          "90"
        ],
        "solution": "$Y\\sim Binomial(1000,0.10)$. $\\mu=100$, $\\sigma^2=90$. $P(Y>125)=1-\\Phi(25/\\sqrt{90})=0.0042$."
      },
      {
        "id": "23q8",
        "points": 11,
        "topic": "MLE Poisson",
        "prompt": "For iid $Poisson(\\lambda)$ sample $X_1,\\ldots,X_n$, derive the MLE for $\\lambda$.",
        "keywords": [
          "bar",
          "sum/n",
          "poisson",
          "mle"
        ],
        "solution": "Log likelihood: $-n\\lambda+(\\sum x_i)\\ln\\lambda-\\text{constant}$. Set derivative to 0: $\\hat\\lambda=\\sum x_i/n=\\bar X$."
      },
      {
        "id": "23q9",
        "points": 11,
        "topic": "Bias",
        "prompt": "For iid $X_i$ with mean $\\mu$ and variance $\\sigma^2$, estimate $\\theta=\\mu^2$ using $\\hat\\Theta=(\\bar X)^2$. Calculate the bias.",
        "keywords": [
          "sigma^2/n",
          "bias",
          "positive"
        ],
        "solution": "$E[(\\bar X)^2]=\\mu^2+\\sigma^2/n$, so bias $=\\sigma^2/n$."
      },
      {
        "id": "23q10",
        "points": 11,
        "topic": "Hypothesis testing",
        "prompt": "A coin is tossed 100 times and 60 heads are observed. Test $H_0:p=0.5$ vs $H_1:p>0.5$ at $\\alpha=0.05$ and $\\alpha=0.01$. Use $\\Phi(2)\\approx0.977$, $\\Phi^{-1}(0.95)=1.645$, $\\Phi^{-1}(0.99)=2.33$. Find p-value.",
        "keywords": [
          "2",
          "0.023",
          "reject 0.05",
          "not 0.01"
        ],
        "solution": "Under $H_0$, mean $=50$ and $SD=\\sqrt{25}=5$. $z=(60-50)/5=2$. p-value $=1-\\Phi(2)=0.023$. Reject at $0.05$ because $2>1.645$; do not reject at $0.01$ because $2<2.33$."
      }
    ]
  }
];

const FINAL_TOPIC_WEEKS = new Set(["Week 2","Week 3","Week 4","Week 5","Week 6","Week 7","Week 8","Week 9","Week 10"]);
const STORAGE_KEY = "beng100-study-progress-v2";
const EXAM_INFO = {
  date: "Thursday, June 11",
  time: "7:00-10:00 PM",
  room: "CENTR 214",
  problems: "10 problems",
  points: "110 points total",
  target: "95+ points = A+",
  strategy: "Correctly solve 9 of 10 problems and write derivations clearly."
};
const FINAL_FOCUS = [
  ["Bayes + total probability", "Week 2", "test-positive, partitions, conditional probability"],
  ["Conditioning on random variables", "Weeks 6-7", "conditional PMF/PDF, E[Y|X], Var(Y|X)"],
  ["Total expectation/variance", "Week 7", "nested random systems and mixture problems"],
  ["Transformations", "Week 5", "find support, inverse, derivative/Jacobian, CDF method"],
  ["MGFs", "Week 7", "identify distributions and get moments"],
  ["Covariance", "Week 7", "E[XY]-E[X]E[Y], variance of sums"],
  ["Inequalities", "Week 8", "Markov, Chebyshev, Chernoff-style bounds"],
  ["CLT", "Week 9", "normal approximation, sums/averages, continuity correction"],
  ["Bias/MSE of estimators", "Weeks 9-10", "E[estimator]-parameter and variance tradeoffs"],
  ["MLE", "Week 10", "likelihood, log likelihood, derivative, second-derivative check"],
  ["Hypothesis testing", "Week 10", "z statistic, p-value, reject/fail-to-reject, Type I/II"],
  ["Common random variables", "Weeks 3-5", "Bernoulli, Binomial, Geometric, Pascal, Hypergeometric, Poisson, Exponential, Gamma, Normal"]
];
const FINAL_TOPIC_MAP = {
  "Week 1": {
    priority: "support",
    order: 1,
    step: "Warm-up foundation",
    topics: ["sets/sample spaces", "counting", "union/complement"],
    examUse: "Foundation for probability setups. Review quickly, but do not let it steal time from conditioning, CLT, MLE, and testing."
  },
  "Week 2": {
    priority: "A+ core",
    order: 2,
    step: "First must-know final topic",
    topics: ["Bayes' rule", "law of total probability", "conditional probability", "independence"],
    examUse: "Likely appears as a test-positive, subgroup, partition, or conditional probability problem."
  },
  "Week 3": {
    priority: "A+ core",
    order: 3,
    step: "Discrete RV base",
    topics: ["PMF", "expectation", "variance", "Bernoulli/Binomial/Geometric"],
    examUse: "This is the language behind most discrete RV problems and common distribution recognition."
  },
  "Week 4": {
    priority: "A+ core",
    order: 4,
    step: "Common distributions",
    topics: ["Pascal", "Hypergeometric", "Poisson", "continuous RV basics"],
    examUse: "Know the support, mean, variance, and when each distribution is triggered by wording."
  },
  "Week 5": {
    priority: "A+ core",
    order: 5,
    step: "Transformation skill",
    topics: ["method of transformations", "Exponential", "Gamma", "Normal", "standardization"],
    examUse: "Professor named transformations directly. Always start with support, inverse/CDF, then derivative."
  },
  "Week 6": {
    priority: "A+ core",
    order: 6,
    step: "Joint and conditional setup",
    topics: ["joint PMF/PDF", "marginal distributions", "conditional PMF/PDF"],
    examUse: "This is the base for conditioning on a random variable and conditional expectations."
  },
  "Week 7": {
    priority: "A+ core",
    order: 7,
    step: "High-value mixed RV tools",
    topics: ["law of total expectation", "law of total variance", "covariance", "MGF"],
    examUse: "Very high value: several professor-listed topics are concentrated here."
  },
  "Week 8": {
    priority: "high",
    order: 8,
    step: "Bounds after moments",
    topics: ["Markov", "Chebyshev", "Chernoff", "probability bounds"],
    examUse: "Professor named inequalities. Memorize trigger conditions and what information each bound needs."
  },
  "Week 9": {
    priority: "A+ core",
    order: 9,
    step: "CLT and estimators",
    topics: ["CLT", "sample mean", "bias", "MSE", "point estimators"],
    examUse: "Use for normal approximations, continuity correction, and estimator comparison."
  },
  "Week 10": {
    priority: "A+ core",
    order: 10,
    step: "Final inference finish",
    topics: ["sample variance", "MLE", "hypothesis testing", "p-values"],
    examUse: "Week 10 is included. Expect derivation-style work for MLE or clear decision rules for tests."
  }
};
const FINAL_PREP_STEPS = [
  "Do Spring 2025 first because your professor said it is the closest in content, structure, difficulty, and style.",
  "For every missed problem, write the trigger words, the formula family, and the first correct setup line.",
  "Then do Spring 2024 and Spring 2023 as extra reps, but prioritize fixing Spring 2025 mistakes first.",
  "Practice without a calculator, phone, laptop, tablet, or notes besides one double-sided letter-sized cheat sheet.",
  "Build the cheat sheet around derivation steps and decision rules, not only final formulas."
];
const CHEAT_SHEET_BLOCKS = [
  "Bayes/conditioning: total probability, Bayes, conditional PMF/PDF, independence checks",
  "RV reference: common discrete/continuous distributions with mean, variance, support",
  "Transformations: support mapping, inverse formula, CDF method, non-monotone branch sum",
  "Moments: LOTUS, covariance, MGF definitions, total expectation/variance",
  "Bounds/CLT: Markov, Chebyshev, Chernoff setup, normal approximation templates",
  "Inference: bias, MSE, likelihood/log likelihood, MLE steps, z-test and p-value rules"
];

function flattenText(value) {
  if (Array.isArray(value)) return value.map(flattenText).join(" ");
  if (value && typeof value === "object") return Object.values(value).map(flattenText).join(" ");
  return String(value || "");
}
function matchesQuery(value, q) {
  return flattenText(value).toLowerCase().includes(q.trim().toLowerCase());
}
function firstWeekLabel(label="") {
  const match = String(label).match(/Week\s+\d+/);
  return match ? match[0] : "";
}
function useStoredState(key, initialValue) {
  const [value,setValue] = useState(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const saved = window.localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value,setValue];
}
function pct(done, total) {
  return total ? Math.round((done / total) * 100) : 0;
}
function ProgressBar({ value, color=C.indigo }) {
  return <div style={{ height:"8px", background:"var(--color-background-secondary)", border:"0.5px solid var(--color-border-tertiary)", borderRadius:"999px", overflow:"hidden" }}>
    <div style={{ width:`${Math.max(0, Math.min(100, value))}%`, height:"100%", background:color }} />
  </div>;
}
function EmptyState({ children }) {
  return <div style={{ ...S.card, textAlign:"center", color:"var(--color-text-secondary)", fontSize:"13px" }}>{children}</div>;
}

function FormulaTable({ formulas, compact=false }) {
  return <div style={{ overflowX:"auto" }}><table style={{ width:"100%", borderCollapse:"collapse", fontSize:compact?"12px":"12.5px" }}>
    <thead><tr style={{ borderBottom:"1px solid var(--color-border-tertiary)" }}>
      {['Formula','Meaning','When to use'].map((h,i)=><th key={h} style={{ textAlign:"left", padding:"7px 8px", color:"var(--color-text-secondary)", fontWeight:600, width:i===0?"24%":i===1?"38%":"38%" }}>{h}</th>)}
    </tr></thead>
    <tbody>{formulas.map((r,i)=><tr key={i} style={{ borderBottom:"0.5px solid var(--color-border-tertiary)" }}>
      <td style={{ padding:"8px", verticalAlign:"top", fontWeight:600 }}>{r[0]}</td>
      <td style={{ padding:"8px", verticalAlign:"top", lineHeight:1.65 }}><MathBlock text={r[1]} /></td>
      <td style={{ padding:"8px", verticalAlign:"top", lineHeight:1.65, color:"var(--color-text-secondary)" }}><MathBlock text={r[2]} /></td>
    </tr>)}</tbody>
  </table></div>;
}
function weekFromSheetLabel(label="") {
  return firstWeekLabel(label);
}
function formulasForPage(page) {
  return page.weeks.map(week => QUICK_SHEETS.find(s => weekFromSheetLabel(s.label) === week)).filter(Boolean);
}
function compactFormulaText(str="") {
  return String(str).replace(/\$\$/g, "$");
}
function renderFormulaSheetHtml() {
  const renderRows = sheet => sheet.formulas.map(([name, formula, use]) => `
    <div class="formula-row ${weekFromSheetLabel(sheet.label) === "Week 1" ? "week-one-row" : ""}">
      <div class="formula-name">${escapeHtml(name)}</div>
      <div class="formula-math">${escapeHtml(compactFormulaText(formula))}</div>
      ${weekFromSheetLabel(sheet.label) === "Week 1" ? "" : `<div class="formula-use">${escapeHtml(use)}</div>`}
    </div>
  `).join("");
  const renderDistributionGuide = () => `
    <section class="week-block id-guide">
      <div class="formula-grid">
        ${DISTRIBUTION_ID_GUIDE.map(([name, clue, key]) => `
          <div class="formula-row">
            <div class="formula-name">${escapeHtml(name)}</div>
            <div class="formula-math">${escapeHtml(clue)}</div>
            <div class="formula-use">${escapeHtml(key)}</div>
          </div>
        `).join("")}
      </div>
    </section>
  `;
  const pages = FORMULA_SHEET_PAGES.map((page, pageIndex) => `
    <section class="page">
      <header></header>
      <main>
        ${pageIndex === 0 ? renderDistributionGuide() : ""}
        ${formulasForPage(page).map(sheet => `
          <section class="week-block">
            <div class="formula-grid">${renderRows(sheet)}</div>
          </section>
        `).join("")}
      </main>
    </section>
  `).join("");
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>BENG 100 Two-Page Formula Sheet</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  <style>
    @page { size: letter landscape; margin: 0; }
    * { box-sizing: border-box; }
    body { margin: 0; background: #e8e8e8; color: #171717; font-family: Arial, Helvetica, sans-serif; }
    .toolbar { position: sticky; top: 0; z-index: 2; padding: 10px 14px; background: #fff; border-bottom: 1px solid #ccc; display: flex; gap: 8px; align-items: center; }
    .toolbar button { border: 1px solid #777; background: #111827; color: #fff; border-radius: 6px; padding: 8px 11px; cursor: pointer; }
    .toolbar span { font-size: 12px; color: #555; }
    .page { width: 1056px; min-height: 816px; margin: 12px auto; padding: 26px; background: #fff; page-break-after: always; overflow: hidden; }
    header { border-bottom: 1px solid #111; padding-bottom: 6px; margin-bottom: 6px; }
    .page-number { font-size: 8px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; color: #555; }
    main { column-count: 3; column-gap: 18px; }
    .week-block { break-inside: avoid; margin-bottom: 5px; border: .5px solid #d9d9d9; border-radius: 3px; padding: 3px; }
    .formula-grid { display: grid; gap: 3px; }
    .formula-row { display: grid; grid-template-columns: 20% 39% 41%; gap: 3px; align-items: start; border-bottom: .5px solid #eee; padding-bottom: 2px; }
    .formula-row.week-one-row { grid-template-columns: 38% 62%; }
    .formula-name { font-size: 8px; font-weight: 700; line-height: 1.15; }
    .formula-math { font-size: 7.5px; line-height: 1.2; overflow-wrap: anywhere; }
    .formula-use { font-size: 7.2px; color: #444; line-height: 1.22; }
    .katex { font-size: 1em !important; }
    .katex-display { margin: 0; overflow: visible; text-align: left; }
    @media print {
      body { background: #fff; }
      .toolbar { display: none; }
      .page { margin: 0; box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="toolbar"><button onclick="window.print()">Print / Save as PDF</button><span>Use paper size Letter 8.5 x 11, orientation landscape, scale 100%, margins none/default.</span></div>
  ${pages}
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
  <script>
    window.addEventListener("load", function() {
      renderMathInElement(document.body, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false }
        ],
        throwOnError: false
      });
    });
  </script>
</body>
</html>`;
}
function downloadFormulaSheet() {
  const blob = new Blob([renderFormulaSheetHtml()], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "beng100-two-page-letter-formula-sheet.html";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
function openPrintableFormulaSheet() {
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.open();
  win.document.write(renderFormulaSheetHtml());
  win.document.close();
}
function FormulaA4Page({ page, index }) {
  return <div style={{ background:"#fff", color:"#171717", border:"1px solid var(--color-border-tertiary)", boxShadow:"0 2px 8px #00000014", width:"100%", maxWidth:"1056px", minHeight:"816px", margin:"0 auto 18px", padding:"26px", overflow:"hidden" }}>
    <div style={{ borderBottom:"1px solid #222", paddingBottom:"6px", marginBottom:"6px" }} />
    <div style={{ columnCount:3, columnGap:"18px" }}>
      {index === 0 && <section style={{ breakInside:"avoid", marginBottom:"5px", border:"0.5px solid #d9d9d9", borderRadius:"3px", padding:"3px" }}>
        <div style={{ display:"grid", gap:"3px" }}>
          {DISTRIBUTION_ID_GUIDE.map(([name, clue, key])=><div key={name} style={{ display:"grid", gridTemplateColumns:"20% 39% 41%", gap:"3px", borderBottom:"0.5px solid #eee", paddingBottom:"2px", alignItems:"start" }}>
            <div style={{ fontSize:"8px", fontWeight:800, lineHeight:1.15 }}>{name}</div>
            <div style={{ fontSize:"7.5px", lineHeight:1.2, overflowWrap:"anywhere" }}><MathBlock text={clue}/></div>
            <div style={{ fontSize:"7.2px", color:"#444", lineHeight:1.22 }}><MathBlock text={key}/></div>
          </div>)}
        </div>
      </section>}
      {formulasForPage(page).map(sheet=><section key={sheet.label} style={{ breakInside:"avoid", marginBottom:"5px", border:"0.5px solid #d9d9d9", borderRadius:"3px", padding:"3px" }}>
        <div style={{ display:"grid", gap:"3px" }}>
          {sheet.formulas.map(([name, formula, use])=>{
            const isWeekOne = weekFromSheetLabel(sheet.label) === "Week 1";
            return <div key={`${sheet.label}-${name}`} style={{ display:"grid", gridTemplateColumns:isWeekOne?"38% 62%":"20% 39% 41%", gap:"3px", borderBottom:"0.5px solid #eee", paddingBottom:"2px", alignItems:"start" }}>
            <div style={{ fontSize:"8px", fontWeight:800, lineHeight:1.15 }}>{name}</div>
            <div style={{ fontSize:"7.5px", lineHeight:1.2, overflowWrap:"anywhere" }}><MathBlock text={compactFormulaText(formula)}/></div>
            {!isWeekOne && <div style={{ fontSize:"7.2px", color:"#444", lineHeight:1.22 }}><MathBlock text={use}/></div>}
          </div>;
          })}
        </div>
      </section>)}
    </div>
  </div>;
}
function Reveal({ title="Hidden answer", children, color=C.indigo }) {
  const [open,setOpen] = useState(false);
  return <div style={{ marginTop:"0.8rem" }}>
    <button onClick={()=>setOpen(!open)} style={S.btn(open?"outline":"primary", color)}>{open?"Hide answer":"Reveal answer"}</button>
    {open && <div style={{ marginTop:"0.75rem", padding:"0.85rem 1rem", borderRadius:"var(--border-radius-md)", background:"var(--color-background-secondary)", border:"0.5px dashed var(--color-border-secondary)", fontSize:"13px", lineHeight:1.75 }}><strong>{title}</strong><br/><MathBlock text={children}/></div>}
  </div>;
}
function ModuleCard({ m, progress={}, onProgressChange=()=>{}, targetWeek="" }) {
  const [open,setOpen] = useState(false);
  const [section,setSection] = useState("formulas");
  const cardRef = useRef(null);
  const weekProgress = progress[m.week] || {};
  const finalTopic = FINAL_TOPIC_MAP[m.week];
  const completed = ["formulas","example","practice"].filter(k=>weekProgress[k]).length;
  useEffect(() => {
    if (targetWeek !== m.week) return;
    setOpen(true);
    window.setTimeout(() => cardRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }), 30);
  }, [targetWeek, m.week]);
  function toggleProgress(key) {
    onProgressChange(m.week, { ...weekProgress, [key]: !weekProgress[key] });
  }
  return <div ref={cardRef} id={`lecture-${m.week.toLowerCase().replace(/\s+/g,"-")}`} style={{ ...S.card, borderColor:open?`${m.color}55`:"var(--color-border-tertiary)", scrollMarginTop:"130px" }}>
    <div onClick={()=>setOpen(!open)} style={{ display:"flex", justifyContent:"space-between", gap:"1rem", cursor:"pointer" }}>
      <div>
        <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:"6px" }}><Pill color={m.color} bg={m.bg}>{m.week}</Pill>{finalTopic && <Pill color={m.color} bg={m.bg}>step {finalTopic.order}</Pill>}<Pill color={C.gray} bg={C.grayBg}>{m.lectures}</Pill><Pill color={completed===3?C.teal:C.gray} bg={completed===3?C.tealBg:C.grayBg}>{completed}/3 done</Pill>{finalTopic && <Pill color={finalTopic.priority==="support"?C.gray:C.red} bg={finalTopic.priority==="support"?C.grayBg:C.redBg}>{finalTopic.priority}</Pill>}</div>
        <h3 style={{ margin:"0 0 4px", fontSize:"15px" }}>{m.title}</h3>
        <p style={{ margin:0, color:"var(--color-text-secondary)", fontSize:"13px", lineHeight:1.6 }}>{finalTopic?.examUse || m.focus}</p>
      </div>
      <span style={{ color:m.color, fontSize:"24px", lineHeight:1 }}>{open?"-":"+"}</span>
    </div>
    {open && <div style={{ marginTop:"1rem" }}>
      {finalTopic && <div style={{ background:finalTopic.priority==="support"?C.grayBg:C.redBg, color:finalTopic.priority==="support"?C.gray:C.red, border:`0.5px solid ${(finalTopic.priority==="support"?C.gray:C.red)}40`, borderRadius:"var(--border-radius-md)", padding:"0.75rem 0.85rem", marginBottom:"0.9rem", fontSize:"12.5px", lineHeight:1.65 }}>
        <strong>Study step {finalTopic.order}: {finalTopic.step}.</strong> Final exam connection: {finalTopic.topics.join(" | ")}
      </div>}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(150px, 1fr))", gap:"8px", marginBottom:"0.9rem" }}>
        {[["formulas","Formula sheet"],["example","Source example"],["practice","Practice done"]].map(([id,label])=><label key={id} style={{ display:"flex", gap:"7px", alignItems:"center", fontSize:"12.5px", color:"var(--color-text-secondary)", background:"var(--color-background-secondary)", border:"0.5px solid var(--color-border-tertiary)", borderRadius:"var(--border-radius-md)", padding:"0.55rem 0.65rem" }}>
          <input type="checkbox" checked={!!weekProgress[id]} onChange={()=>toggleProgress(id)} />
          {label}
        </label>)}
      </div>
      <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"0.9rem" }}>
        {[['formulas','Formula sheet'],['example','Source example'],['practice','Practice question']].map(([id,label])=><button key={id} onClick={()=>setSection(id)} style={S.btn(section===id?'primary':'outline', m.color)}>{label}</button>)}
      </div>
      {section==='formulas' && <FormulaTable formulas={m.formulas}/>} 
      {section==='example' && <div style={{ background:m.bg, borderRadius:"var(--border-radius-md)", padding:"1rem", border:`0.5px solid ${m.color}40` }}>
        <Pill color={m.color} bg="var(--color-background-primary)">{m.example.source}</Pill>
        <h4 style={{ margin:"0.75rem 0 0.35rem", color:m.color }}>Example wording from source</h4>
        <div style={{ fontSize:"13.5px", lineHeight:1.75 }}><MathBlock text={m.example.prompt}/></div>
        <Reveal title="Step-by-step example solution" color={m.color}>{m.example.solution}</Reveal>
        {!!EXTRA_EXAMPLES[m.week]?.length && <div style={{ marginTop:"1rem", display:"grid", gap:"8px" }}>
          <h4 style={{ margin:"0.25rem 0 0", color:m.color }}>More example types</h4>
          {EXTRA_EXAMPLES[m.week].map(ex=><div key={ex.type} style={{ background:"var(--color-background-primary)", border:"0.5px solid var(--color-border-tertiary)", borderRadius:"var(--border-radius-md)", padding:"0.85rem" }}>
            <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
              <Pill color={m.color} bg={m.bg}>{ex.type}</Pill>
              {ex.source && <Pill color={C.gray} bg={C.grayBg}>{ex.source}</Pill>}
            </div>
            <div style={{ marginTop:"0.55rem", fontSize:"13px", lineHeight:1.7 }}><MathBlock text={ex.prompt}/></div>
            <Reveal title="Step-by-step example solution" color={m.color}>{ex.solution}</Reveal>
          </div>)}
        </div>}
      </div>}
      {section==='practice' && <div style={{ background:"var(--color-background-secondary)", borderRadius:"var(--border-radius-md)", padding:"1rem", border:"0.5px solid var(--color-border-tertiary)" }}>
        <Pill color={m.color} bg={m.bg}>{m.practice.source}</Pill>
        <h4 style={{ margin:"0.75rem 0 0.35rem", color:m.color }}>Practice wording from source</h4>
        <div style={{ fontSize:"13.5px", lineHeight:1.75 }}><MathBlock text={m.practice.prompt}/></div>
        <Reveal title="Practice answer" color={m.color}>{m.practice.answer}</Reveal>
      </div>}
    </div>}
  </div>;
}
function DashboardTab({ progress, onProgressChange, setTab, jumpToLecture }) {
  const totalTasks = MODULES.length * 3;
  const doneTasks = MODULES.reduce((sum,m)=>sum + ["formulas","example","practice"].filter(k=>progress[m.week]?.[k]).length, 0);
  const finalDone = MODULES.filter(m=>FINAL_TOPIC_WEEKS.has(m.week)).reduce((sum,m)=>sum + ["formulas","example","practice"].filter(k=>progress[m.week]?.[k]).length, 0);
  const nextModule = MODULES.find(m => ["formulas","example","practice"].some(k => !progress[m.week]?.[k])) || MODULES[0];
  const nextProgress = progress[nextModule.week] || {};
  const stats = [
    ["A+ target", "95+", "9 strong problems out of 10 is enough for A+", C.red],
    ["Overall progress", `${pct(doneTasks,totalTasks)}%`, `${doneTasks}/${totalTasks} study tasks checked off`, C.indigo],
    ["Professor focus", `${FINAL_FOCUS.length}`, "priority topics pulled from the final announcement", C.teal],
    ["Practice finals", `${FINALS.length}`, "start with Spring 2025 style first", C.amber],
  ];
  return <div style={S.content}>
    <div style={{ ...S.card, display:"grid", gridTemplateColumns:"minmax(0, 1.5fr) minmax(260px, 0.8fr)", gap:"1rem", alignItems:"start" }}>
      <div>
        <Pill color={C.indigo} bg={C.indigoBg}>Final: {EXAM_INFO.date} | {EXAM_INFO.time}</Pill>
        <h1 style={{ margin:"0.65rem 0 0.35rem", fontSize:"clamp(24px, 4vw, 40px)", lineHeight:1.1, letterSpacing:0 }}>Aim for 9 clean solutions, not random coverage.</h1>
        <p style={{ margin:"0 0 1rem", color:"var(--color-text-secondary)", lineHeight:1.7, fontSize:"14px" }}>{EXAM_INFO.problems}, {EXAM_INFO.points}. {EXAM_INFO.target}. Focus on derivations, setup, and recognizing which formula family each problem is asking for.</p>
        <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
          <button style={S.btn("primary", C.red)} onClick={()=>setTab("plan")}>Open A+ plan</button>
          <button style={S.btn("outline")} onClick={()=>setTab("final")}>Start timed final</button>
          <button style={S.btn("outline")} onClick={()=>setTab("formula")}>Build cheat sheet</button>
        </div>
      </div>
      <div style={{ background:nextModule.bg, border:`0.5px solid ${nextModule.color}40`, borderRadius:"var(--border-radius-md)", padding:"1rem" }}>
        <Pill color={nextModule.color} bg="var(--color-background-primary)">Next up | {nextModule.week}</Pill>
        <h3 style={{ margin:"0.7rem 0 0.4rem", fontSize:"16px" }}>{nextModule.title}</h3>
        <ProgressBar value={pct(["formulas","example","practice"].filter(k=>nextProgress[k]).length, 3)} color={nextModule.color} />
        <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginTop:"0.8rem" }}>
          {["formulas","example","practice"].map(k=><label key={k} style={{ fontSize:"12px", display:"flex", gap:"5px", alignItems:"center" }}>
            <input type="checkbox" checked={!!nextProgress[k]} onChange={()=>onProgressChange(nextModule.week, { ...nextProgress, [k]: !nextProgress[k] })}/>
            {k}
          </label>)}
        </div>
      </div>
    </div>
    <div style={{ ...S.alert(C.red,C.redBg), display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))", gap:"8px" }}>
      <span><strong>Room:</strong> {EXAM_INFO.room}</span>
      <span><strong>Bring:</strong> blue book + one double-sided 8.5 x 11 cheat sheet</span>
      <span><strong>No devices:</strong> no calculator, laptop, tablet, or phone</span>
    </div>
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:"12px", marginBottom:"12px" }}>
      {stats.map(([label,value,detail,color])=><div key={label} style={S.card}>
        <div style={{ color, fontSize:"26px", fontWeight:800, lineHeight:1 }}>{value}</div>
        <h3 style={{ margin:"0.45rem 0 0.25rem", fontSize:"14px" }}>{label}</h3>
        <p style={{ margin:0, color:"var(--color-text-secondary)", fontSize:"12.5px", lineHeight:1.6 }}>{detail}</p>
      </div>)}
    </div>
    <div style={S.card}>
      <div style={{ display:"flex", justifyContent:"space-between", gap:"1rem", flexWrap:"wrap", alignItems:"center", marginBottom:"0.8rem" }}>
        <h3 style={{ margin:0, fontSize:"15px" }}>Professor Priority Topics</h3>
        <button style={S.btn("outline")} onClick={()=>setTab("plan")}>See full plan</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(230px, 1fr))", gap:"8px" }}>
        {FINAL_FOCUS.slice(0,6).map(([topic,week,why])=><button key={topic} onClick={()=>jumpToLecture(firstWeekLabel(week))} style={{ border:"0.5px solid var(--color-border-tertiary)", borderRadius:"var(--border-radius-md)", padding:"0.7rem", background:"var(--color-background-secondary)", textAlign:"left", cursor:"pointer", color:"var(--color-text-primary)" }}>
          <Pill color={FINAL_TOPIC_WEEKS.has(week) ? C.red : C.indigo} bg={FINAL_TOPIC_WEEKS.has(week) ? C.redBg : C.indigoBg}>{week}</Pill>
          <h4 style={{ margin:"0.5rem 0 0.25rem", fontSize:"13px" }}>{topic}</h4>
          <p style={{ margin:0, color:"var(--color-text-secondary)", fontSize:"12px", lineHeight:1.5 }}>{why}</p>
        </button>)}
      </div>
    </div>
    <div style={S.card}>
      <h3 style={{ margin:"0 0 0.8rem", fontSize:"15px" }}>Week Checklist</h3>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(230px, 1fr))", gap:"10px" }}>
        {MODULES.map(m=>{
          const done = ["formulas","example","practice"].filter(k=>progress[m.week]?.[k]).length;
          return <button key={m.week} onClick={()=>jumpToLecture(m.week)} style={{ border:"0.5px solid var(--color-border-tertiary)", borderRadius:"var(--border-radius-md)", padding:"0.75rem", background:"var(--color-background-primary)", textAlign:"left", cursor:"pointer", color:"var(--color-text-primary)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", gap:"8px", alignItems:"center", marginBottom:"0.55rem" }}><Pill color={m.color} bg={m.bg}>{m.week}</Pill><span style={{ fontSize:"12px", color:"var(--color-text-secondary)" }}>{done}/3</span></div>
            <strong style={{ fontSize:"13px" }}>{m.title}</strong>
            <div style={{ marginTop:"0.65rem" }}><ProgressBar value={pct(done,3)} color={m.color}/></div>
          </button>
        })}
      </div>
    </div>
  </div>;
}
function LecturesTab({ progress, onProgressChange, initialTargetWeek="" }) {
  const [q,setQ] = useState("");
  const [targetWeek,setTargetWeek] = useState("");
  const studyOrder = [...MODULES].sort((a,b) => (FINAL_TOPIC_MAP[a.week]?.order ?? 99) - (FINAL_TOPIC_MAP[b.week]?.order ?? 99));
  const filtered = MODULES
    .filter(m => matchesQuery(m, q))
    .sort((a,b) => (FINAL_TOPIC_MAP[a.week]?.order ?? 99) - (FINAL_TOPIC_MAP[b.week]?.order ?? 99));
  function jumpToWeek(week) {
    setQ("");
    setTargetWeek(week);
  }
  useEffect(() => {
    if (initialTargetWeek) jumpToWeek(initialTargetWeek);
  }, [initialTargetWeek]);
  return <div style={S.content}>
    <div style={S.alert(C.red,C.redBg)}><strong>Lecture hub is ordered for learning plus priority.</strong> Go from easier foundations into the highest-value final topics: Bayes, distributions, transformations, conditioning, covariance/MGF, inequalities, CLT, then MLE/testing.</div>
    <div style={S.card}>
      <div style={{ display:"flex", justifyContent:"space-between", gap:"1rem", alignItems:"center", flexWrap:"wrap", marginBottom:"0.75rem" }}>
        <div>
          <h3 style={{ margin:"0 0 0.25rem", fontSize:"15px" }}>Best Study Order</h3>
          <p style={{ margin:0, color:"var(--color-text-secondary)", fontSize:"12.5px", lineHeight:1.55 }}>Tap a step to jump to the lecture. The order starts easy and builds toward the highest-priority final skills.</p>
        </div>
        <Pill color={C.red} bg={C.redBg}>9 strong problems = A+</Pill>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))", gap:"8px" }}>
        {studyOrder.map(m=>{
          const info = FINAL_TOPIC_MAP[m.week];
          return <button key={m.week} onClick={()=>jumpToWeek(m.week)} style={{ border:"0.5px solid var(--color-border-tertiary)", borderRadius:"var(--border-radius-md)", padding:"0.75rem", background:info?.priority==="support"?"var(--color-background-secondary)":m.bg, textAlign:"left", cursor:"pointer", color:"var(--color-text-primary)" }}>
            <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:"0.55rem" }}><Pill color={m.color} bg="var(--color-background-primary)">step {info?.order}</Pill><Pill color={m.color} bg="var(--color-background-primary)">{m.week}</Pill>{info && <Pill color={info.priority==="support"?C.gray:C.red} bg={info.priority==="support"?C.grayBg:C.redBg}>{info.priority}</Pill>}</div>
            <strong style={{ fontSize:"13px" }}>{m.title}</strong>
            <p style={{ margin:"0.35rem 0 0", color:m.color, fontSize:"12px", fontWeight:600, lineHeight:1.45 }}>{info?.step}</p>
            <p style={{ margin:"0.35rem 0 0", color:"var(--color-text-secondary)", fontSize:"12px", lineHeight:1.55 }}>{info?.topics.join(", ")}</p>
          </button>;
        })}
      </div>
    </div>
    <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search week/topic, e.g. Bayes, CLT, covariance, MLE" style={{ width:"100%", padding:"0.7rem 0.9rem", borderRadius:"var(--border-radius-md)", border:"0.75px solid var(--color-border-secondary)", marginBottom:"1rem", fontSize:"13px" }}/>
    {filtered.length ? filtered.map(m=><ModuleCard key={m.week} m={m} progress={progress} onProgressChange={onProgressChange} targetWeek={targetWeek}/>) : <EmptyState>No lecture cards match that search.</EmptyState>}
  </div>;
}
function FormulaSheetTab() {
  const [onlyFinal,setOnlyFinal] = useState(false);
  const [q,setQ] = useState("");
  const sheets = QUICK_SHEETS.filter(s=>!onlyFinal || FINAL_TOPIC_WEEKS.has(s.label.split(' ')[0]+' '+s.label.split(' ')[1])).filter(s=>matchesQuery(s, q));
  return <div style={S.content}>
    <div style={{ ...S.card, display:"flex", justifyContent:"space-between", gap:"1rem", alignItems:"center", flexWrap:"wrap" }}>
      <div>
        <Pill color={C.amber} bg={C.amberBg}>Two-page 8.5 x 11 sheet</Pill>
        <h2 style={{ margin:"0.55rem 0 0.25rem", fontSize:"20px" }}>Downloadable Formula Sheet</h2>
        <p style={{ margin:0, color:"var(--color-text-secondary)", fontSize:"13px", lineHeight:1.6 }}>All current formula content is compressed into two landscape 8.5 x 11 pages. Use the print button to save as PDF from your browser.</p>
      </div>
      <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
        <button style={S.btn("primary", C.amber)} onClick={downloadFormulaSheet}>Download 8.5 x 11 HTML</button>
        <button style={S.btn("outline")} onClick={openPrintableFormulaSheet}>Open print / save PDF</button>
      </div>
    </div>
    <div style={S.alert(C.amber,C.amberBg)}>For a PDF: press <strong>Open print / save PDF</strong>, then choose "Save as PDF" in the print window. Set paper size to Letter 8.5 x 11 and orientation to landscape.</div>
    <div style={{ display:"grid", gap:"18px", marginBottom:"1rem" }}>
      {FORMULA_SHEET_PAGES.map((page,i)=><FormulaA4Page key={page.title} page={page} index={i}/>)}
    </div>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:"1rem", flexWrap:"wrap", marginBottom:"1rem" }}>
      <div style={S.alert(C.gray,C.grayBg)}>Searchable full formula tables are still below for studying on screen.</div>
      <label style={{ fontSize:"13px", display:"flex", gap:"6px", alignItems:"center" }}><input type="checkbox" checked={onlyFinal} onChange={e=>setOnlyFinal(e.target.checked)}/> Final-heavy topics only</label>
    </div>
    <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search formulas, meanings, or when-to-use notes" style={{ width:"100%", padding:"0.7rem 0.9rem", borderRadius:"var(--border-radius-md)", border:"0.75px solid var(--color-border-secondary)", marginBottom:"1rem", fontSize:"13px" }}/>
    {sheets.length ? sheets.map(s=><div key={s.label} style={S.card}>
      <div style={{ display:"flex", gap:"8px", alignItems:"center", flexWrap:"wrap", marginBottom:"0.75rem" }}><Pill color={s.color} bg={s.bg}>{s.label}</Pill><h3 style={{ margin:0, fontSize:"15px" }}>{s.title}</h3></div>
      <FormulaTable formulas={s.formulas} compact/>
    </div>) : <EmptyState>No formulas match that search.</EmptyState>}
  </div>;
}
function PracticeBankTab() {
  const [q,setQ] = useState("");
  const problems = MODULES.map(m=>({ week:m.week, title:m.title, color:m.color, bg:m.bg, ...m.practice }));
  const filtered = problems.filter(p=>matchesQuery(p, q));
  return <div style={S.content}>
    <div style={S.alert(C.teal,C.tealBg)}>These are non-final practice questions. Answers stay hidden until you reveal them, so you can use this as normal practice before trying the timed final.</div>
    <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search practice by topic, source, or wording" style={{ width:"100%", padding:"0.7rem 0.9rem", borderRadius:"var(--border-radius-md)", border:"0.75px solid var(--color-border-secondary)", marginBottom:"1rem", fontSize:"13px" }}/>
    {filtered.length ? filtered.map((p,i)=><div key={`${p.week}-${i}`} style={S.card}>
      <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"0.75rem" }}><Pill color={p.color} bg={p.bg}>{p.week}</Pill><Pill color={C.gray} bg={C.grayBg}>{p.source}</Pill></div>
      <h3 style={{ margin:"0 0 0.6rem", fontSize:"15px" }}>{p.title}</h3>
      <div style={{ fontSize:"13.5px", lineHeight:1.8 }}><MathBlock text={p.prompt}/></div>
      <Reveal color={p.color} title="Answer">{p.answer}</Reveal>
    </div>) : <EmptyState>No practice questions match that search.</EmptyState>}
  </div>;
}
function FinalPlanTab({ setTab }) {
  return <div style={S.content}>
    <div style={{ ...S.card, display:"grid", gridTemplateColumns:"minmax(0, 1fr) minmax(240px, 0.55fr)", gap:"1rem", alignItems:"start" }}>
      <div>
        <Pill color={C.red} bg={C.redBg}>A+ target: {EXAM_INFO.target}</Pill>
        <h1 style={{ margin:"0.65rem 0 0.35rem", fontSize:"clamp(24px, 4vw, 36px)", lineHeight:1.1, letterSpacing:0 }}>Your goal is 9 complete derivations.</h1>
        <p style={{ margin:"0 0 1rem", color:"var(--color-text-secondary)", lineHeight:1.7, fontSize:"14px" }}>The exam is {EXAM_INFO.problems}, each worth 11 points. Since 95+ is A+, one weak problem is survivable if the other nine are organized, justified, and finished.</p>
        <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
          <button style={S.btn("primary", C.red)} onClick={()=>setTab("final")}>Take timed final</button>
          <button style={S.btn("outline")} onClick={()=>setTab("formula")}>Review formulas</button>
          <button style={S.btn("outline")} onClick={()=>setTab("practice")}>Untimed reps</button>
        </div>
      </div>
      <div style={{ background:C.redBg, color:C.red, border:`0.5px solid ${C.red}40`, borderRadius:"var(--border-radius-md)", padding:"1rem", lineHeight:1.7, fontSize:"13px" }}>
        <strong>Exam logistics</strong><br/>
        {EXAM_INFO.date}, {EXAM_INFO.time}<br/>
        {EXAM_INFO.room}<br/>
        Bring a blue book and one double-sided 8.5 x 11 cheat sheet.<br/>
        No calculator or digital devices.
      </div>
    </div>

    <div style={S.card}>
      <h3 style={{ margin:"0 0 0.75rem", fontSize:"15px" }}>Previous Final Order</h3>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:"10px" }}>
        {[
          ["1", "Spring 2025", "Do this first. It is the closest match to the current exam style, structure, difficulty, and content."],
          ["2", "Spring 2024", "Use after 2025 mistakes are corrected. Look for repeated topic patterns."],
          ["3", "Spring 2023", "Use as extra endurance and recognition practice."]
        ].map(([num,title,body])=><div key={title} style={{ border:"0.5px solid var(--color-border-tertiary)", borderRadius:"var(--border-radius-md)", padding:"0.85rem", background:"var(--color-background-secondary)" }}>
          <Pill color={num==="1"?C.red:C.gray} bg={num==="1"?C.redBg:C.grayBg}>Step {num}</Pill>
          <h4 style={{ margin:"0.6rem 0 0.25rem", fontSize:"14px" }}>{title}</h4>
          <p style={{ margin:0, color:"var(--color-text-secondary)", fontSize:"12.5px", lineHeight:1.6 }}>{body}</p>
        </div>)}
      </div>
    </div>

    <div style={S.card}>
      <h3 style={{ margin:"0 0 0.75rem", fontSize:"15px" }}>Professor Focus Topics</h3>
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"12.5px" }}>
          <thead><tr style={{ borderBottom:"1px solid var(--color-border-tertiary)" }}>
            {["Topic","Where","What to drill"].map(h=><th key={h} style={{ textAlign:"left", padding:"8px", color:"var(--color-text-secondary)" }}>{h}</th>)}
          </tr></thead>
          <tbody>{FINAL_FOCUS.map(([topic,week,drill])=><tr key={topic} style={{ borderBottom:"0.5px solid var(--color-border-tertiary)" }}>
            <td style={{ padding:"8px", fontWeight:700, verticalAlign:"top" }}>{topic}</td>
            <td style={{ padding:"8px", verticalAlign:"top" }}><Pill color={C.indigo} bg={C.indigoBg}>{week}</Pill></td>
            <td style={{ padding:"8px", color:"var(--color-text-secondary)", lineHeight:1.6, verticalAlign:"top" }}>{drill}</td>
          </tr>)}</tbody>
        </table>
      </div>
    </div>

    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))", gap:"12px" }}>
      <div style={S.card}>
        <h3 style={{ margin:"0 0 0.75rem", fontSize:"15px" }}>A+ Prep Loop</h3>
        {FINAL_PREP_STEPS.map((step,i)=><div key={step} style={{ display:"grid", gridTemplateColumns:"28px 1fr", gap:"8px", marginBottom:"0.7rem", alignItems:"start" }}>
          <span style={{ width:"24px", height:"24px", borderRadius:"50%", background:C.indigoBg, color:C.indigo, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:"12px", fontWeight:800 }}>{i+1}</span>
          <span style={{ color:"var(--color-text-secondary)", fontSize:"13px", lineHeight:1.6 }}>{step}</span>
        </div>)}
      </div>
      <div style={S.card}>
        <h3 style={{ margin:"0 0 0.75rem", fontSize:"15px" }}>Cheat Sheet Blocks</h3>
        {CHEAT_SHEET_BLOCKS.map(block=><div key={block} style={{ padding:"0.55rem 0", borderBottom:"0.5px solid var(--color-border-tertiary)", color:"var(--color-text-secondary)", fontSize:"13px", lineHeight:1.55 }}>{block}</div>)}
      </div>
    </div>
  </div>;
}
function formatTime(sec) {
  const h = Math.floor(sec/3600), m = Math.floor((sec%3600)/60), s = sec%60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}
function normalize(s="") { return String(s).toLowerCase().replace(/\s+/g," ").replace(/[\u2212\u2013]/g,"-"); }
function scoreQuestion(q, ans) {
  const n = normalize(ans);
  if (!n.trim()) return 0;
  let matched = 0;
  for (const k of q.keywords || []) {
    const kk = normalize(k).replace(/\s+/g,"");
    const compact = n.replace(/\s+/g,"");
    if (n.includes(normalize(k)) || compact.includes(kk)) matched += 1;
  }
  return Math.min(q.points, Math.round(q.points * matched / Math.max(1,(q.keywords||[]).length)));
}
function TimedFinalTab() {
  const [version,setVersion] = useState(FINALS[0].id);
  const final = FINALS.find(f=>f.id===version) || FINALS[0];
  const [started,setStarted] = useState(false);
  const [finished,setFinished] = useState(false);
  const [timeLeft,setTimeLeft] = useState(final.duration);
  const [answers,setAnswers] = useState({});
  const [scores,setScores] = useState({});

  useEffect(()=>{ setStarted(false); setFinished(false); setTimeLeft(final.duration); setAnswers({}); setScores({}); }, [version]);
  useEffect(()=>{
    if (!started || finished) return;
    const id = setInterval(()=>setTimeLeft(t=>{
      if (t<=1) { clearInterval(id); return 0; }
      return t-1;
    }),1000);
    return ()=>clearInterval(id);
  }, [started, finished]);
  useEffect(()=>{ if (started && !finished && timeLeft===0) finishExam(); }, [timeLeft]);

  function finishExam() {
    const s = {};
    final.questions.forEach(q => { s[q.id] = scoreQuestion(q, answers[q.id] || ""); });
    setScores(s); setFinished(true); setStarted(false);
  }
  const total = Object.values(scores).reduce((a,b)=>a+b,0);
  const max = final.questions.reduce((a,q)=>a+q.points,0);

  return <div style={S.content}>
    <div style={S.alert(C.red,C.redBg)}>Real final target: 10 problems, 110 points, 95+ for A+. Spring 2025 uses PDF-style wording with LaTeX notation to keep formulas readable; Spring 2024 and 2023 are condensed practice wording. Use this timed mode to practice finishing clean derivations in 3 hours, then grade with the revealed solutions because automatic scoring is keyword/rubric-based.</div>
    <div style={{ ...S.card, display:"flex", gap:"1rem", flexWrap:"wrap", alignItems:"center", justifyContent:"space-between", position:"sticky", top:"110px", zIndex:8 }}>
      <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", alignItems:"center" }}>
        <select value={version} onChange={e=>setVersion(e.target.value)} disabled={started && !finished} style={{ padding:"0.5rem", borderRadius:"var(--border-radius-md)", border:"0.75px solid var(--color-border-secondary)", fontSize:"13px" }}>{FINALS.map(f=><option key={f.id} value={f.id}>{f.title}</option>)}</select>
        <Pill color={finished?C.red:C.indigo} bg={finished?C.redBg:C.indigoBg}>{finished?`Score: ${total}/${max}`:`Timer: ${formatTime(timeLeft)}`}</Pill>
      </div>
      <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
        {!started && !finished && <button style={S.btn('primary',C.indigo)} onClick={()=>setStarted(true)}>Start 3-hour final</button>}
        {started && !finished && <button style={S.btn('primary',C.red)} onClick={finishExam}>Submit and grade</button>}
        {finished && <button style={S.btn('outline')} onClick={()=>{setStarted(false);setFinished(false);setTimeLeft(final.duration);setAnswers({});setScores({});}}>Reset this version</button>}
      </div>
    </div>
    {!started && !finished && <div style={S.alert(C.gray,C.grayBg)}>Choose a version, press Start, then type answers in the boxes. Answers and scoring are hidden until you submit or time expires.</div>}
    {final.questions.map((q,i)=><div key={q.id} style={S.card}>
      <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"0.7rem" }}><Pill color={C.indigo} bg={C.indigoBg}>Q{i+1} | {q.points} pts</Pill><Pill color={C.gray} bg={C.grayBg}>{q.topic}</Pill>{finished && <Pill color={(scores[q.id]||0)>=q.points*0.75?C.teal:C.red} bg={(scores[q.id]||0)>=q.points*0.75?C.tealBg:C.redBg}>{scores[q.id]||0}/{q.points}</Pill>}</div>
      <div style={{ fontSize:"13.5px", lineHeight:1.8, marginBottom:"0.85rem" }}><MathBlock text={q.prompt}/></div>
      <textarea disabled={!started || finished} value={answers[q.id]||""} onChange={e=>setAnswers(a=>({...a,[q.id]:e.target.value}))} placeholder={started&&!finished?"Type your derivation and final answer here...":"Start the timer to type your answer."} style={{ ...S.input, opacity:(!started||finished)?0.75:1 }}/>
      {finished && <div style={{ marginTop:"0.85rem", background:"var(--color-background-secondary)", borderRadius:"var(--border-radius-md)", padding:"0.9rem 1rem", border:"0.5px solid var(--color-border-tertiary)", fontSize:"13px", lineHeight:1.75 }}>
        <strong>Rubric keywords:</strong> {(q.keywords||[]).join(', ')}<br/><br/>
        <strong>Solution:</strong><br/><MathBlock text={q.solution}/>
      </div>}
    </div>)}
  </div>;
}
export default function StudyHub() {
  const [tab,setTab] = useState('dashboard');
  const [lectureTarget,setLectureTarget] = useState("");
  const [progress,setProgress] = useStoredState(STORAGE_KEY, {});
  function updateProgress(week, nextWeekProgress) {
    setProgress(current => ({ ...current, [week]: nextWeekProgress }));
  }
  function jumpToLecture(week) {
    if (!week) return;
    setLectureTarget(week);
    setTab("lectures");
  }
  return <div style={S.app}>
    <div style={S.header}>
      <div style={{ width:"34px", height:"34px", borderRadius:"9px", background:C.indigo, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800 }}>B</div>
      <div>
        <h2 style={{ margin:0, fontSize:"16px" }}>BENG 100 Study Hub</h2>
        <p style={{ margin:0, fontSize:"11.5px", color:"var(--color-text-secondary)" }}>A+ final prep | Spring 2025 first | professor focus topics | derivations over memorization</p>
      </div>
      <div style={{ marginLeft:"auto", display:"flex", gap:"6px", flexWrap:"wrap" }}><Pill color={C.red} bg={C.redBg}>Show derivations for full credit</Pill></div>
    </div>
    <div style={S.tabBar}>{[
      ['dashboard','Dashboard'], ['plan','A+ Plan'], ['lectures','Lecture hub'], ['formula','Formula sheet'], ['practice','Practice bank'], ['final','Timed final']
    ].map(([id,label])=><button key={id} style={S.tab(tab===id)} onClick={()=>setTab(id)}>{label}</button>)}</div>
    {tab==='dashboard' && <DashboardTab progress={progress} onProgressChange={updateProgress} setTab={setTab} jumpToLecture={jumpToLecture}/>}
    {tab==='plan' && <FinalPlanTab setTab={setTab}/>}
    {tab==='lectures' && <LecturesTab progress={progress} onProgressChange={updateProgress} initialTargetWeek={lectureTarget}/>}
    {tab==='formula' && <FormulaSheetTab/>}
    {tab==='practice' && <PracticeBankTab/>}
    {tab==='final' && <TimedFinalTab/>}
  </div>;
}
