
import { useEffect, useMemo, useRef, useState } from "react";

function escapeHtml(str="") {
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
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
  const safe = useMemo(() => escapeHtml(text).replace(/\n/g,"<br/>"), [text]);
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
    "lectures": "Lectures 1–2",
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
      "prompt": "A bioengineering lab has 5 distinct cells: C1, C2, C3, C4, C5. The lab selects 3 cells for analysis. In how many ways can you select these cells provided that (a) You replace the cells and the order matters (b) You do NOT replace and the order matters (Permutations) (c) You do NOT replace and the order does NOT matter (Combinations) (d) You replace and the order does NOT matter",
      "solution": "(a) With replacement/order matters: $5^3=125$.\n(b) Without replacement/order matters: $5\\cdot4\\cdot3=60=5!/(5-3)!$.\n(c) Without replacement/order does not matter: $\\binom{5}{3}=10$.\n(d) With replacement/order does not matter: $\\binom{5+3-1}{3}=\\binom{7}{3}=35$."
    },
    "practice": {
      "source": "Homework 1 style",
      "prompt": "A bioengineering laboratory tests 120 patient blood samples for two biomarkers. Let A be samples where biomarker A is detected and B be samples where biomarker B is detected. Suppose |A|=50, |B|=40, and |A∩B|=15. Find |A∪B|, |A^c|, |A\\B|, and the number of samples where neither biomarker is detected.",
      "answer": "$|A\\cup B|=50+40-15=75$.\n$|A^c|=120-50=70$.\n$|A\\setminus B|=50-15=35$.\nNeither biomarker: $120-75=45$."
    }
  },
  {
    "week": "Week 2",
    "lectures": "Lectures 3–4",
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
      "prompt": "A single cell from a tumor is analyzed using sequencing. For this cell, we record: Mutation status in a cancer gene: M (mutation detected), N (no mutation). Expression level of the same gene: H (high expression), L (low expression). (a) List all possible outcomes in the sample space Ω={(Mutation Status, Expression level)} (b) State whether each is an outcome or an event: (M,H), {(M,H),(M,L)}, (N,L), {(M,H)} (c) Define events A: the cell carries a mutation, B: the gene is highly expressed, C: the cell has a mutation OR high expression, D: the cell has a mutation AND low expression. (d) Write and interpret A∩B and A^c. (e) Evaluate the relationship between {(M,H)} and A.",
      "solution": "$\\Omega=\\{(M,H),(M,L),(N,H),(N,L)\\}$.\n$(M,H)$ and $(N,L)$ are outcomes; $\\{(M,H),(M,L)\\}$ and $\\{(M,H)\\}$ are events.\n$A=\\{(M,H),(M,L)\\}$, $B=\\{(M,H),(N,H)\\}$, $C=A\\cup B=\\{(M,H),(M,L),(N,H)\\}$, $D=\\{(M,L)\\}$.\n$A\\cap B=\\{(M,H)\\}$ means mutation and high expression. $A^c=\\{(N,H),(N,L)\\}$ means no mutation. $\\{(M,H)\\}\\subset A$."
    },
    "practice": {
      "source": "Midterm 1 style",
      "prompt": "A diagnostic device is produced by Line 1 with probability 0.25 and Line 2 with probability 0.75. For Line 1, P(high signal)=0.60 and P(low noise)=0.50. For Line 2, P(high signal)=0.20 and P(low noise)=0.30. Within each line, high signal and low noise are independent. Find P(high signal and low noise), P(low noise), and P(high signal | low noise).",
      "answer": "Line 1 AND: $0.60(0.50)=0.30$. Line 2 AND: $0.20(0.30)=0.06$.\n$P(A\\cap B)=0.30(0.25)+0.06(0.75)=0.12$.\n$P(B)=0.50(0.25)+0.30(0.75)=0.35$.\n$P(A|B)=0.12/0.35\\approx0.343$."
    }
  },
  {
    "week": "Week 3",
    "lectures": "Lectures 5–6",
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
        "Single yes/no trial."
      ],
      [
        "Binomial",
        "$$P(X=k)=\\binom nkp^k(1-p)^{n-k},\\ E[X]=np,\\ Var[X]=np(1-p)$$",
        "Fixed number of independent trials; count successes."
      ],
      [
        "Geometric",
        "$$P(X=k)=(1-p)^{k-1}p,\\ E[X]=1/p,\\ Var[X]=(1-p)/p^2$$",
        "Number of trials until first success."
      ]
    ],
    "example": {
      "source": "Week 3 lecture example",
      "prompt": "A sequencing experiment analyzes 3 independent DNA sites, each of which contains a mutation with probability 1/2. Let X be the number of sites at which a mutation is detected. Find the range and PMF of X.",
      "solution": "$R_X=\\{0,1,2,3\\}$. Since each of the 8 outcomes is equally likely, $P(X=0)=1/8$, $P(X=1)=3/8$, $P(X=2)=3/8$, $P(X=3)=1/8$. This is also Binomial$(n=3,p=1/2)$."
    },
    "practice": {
      "source": "Homework 3 style",
      "prompt": "A microfluidic fluorescence assay reports signal intensity X=10,20,30 with probabilities 0.20, 0.50, 0.30. A calibration gives Y=1.5X+5. Find the PMF of Y, E[Y], and SD[Y].",
      "answer": "Values: $Y=20,35,50$ with probabilities $0.20,0.50,0.30$.\n$E[Y]=20(0.2)+35(0.5)+50(0.3)=36.5$.\n$E[Y^2]=400(0.2)+1225(0.5)+2500(0.3)=1442.5$.\n$Var[Y]=1442.5-36.5^2=110.25$, so $SD[Y]=10.5$."
    }
  },
  {
    "week": "Week 4",
    "lectures": "Lectures 7–8",
    "title": "Pascal, Hypergeometric, Poisson, Continuous RVs",
    "color": "#993C1D",
    "bg": "#FAECE7",
    "focus": "Use this for count models beyond Binomial and for continuous random variables with PDFs/CDFs.",
    "formulas": [
      [
        "Pascal / negative binomial",
        "$$P(X=k)=\\binom{k-1}{m-1}p^m(1-p)^{k-m},\\ k=m,m+1,\\ldots$$",
        "Number of trials required to get m successes."
      ],
      [
        "Pascal mean/variance",
        "$$E[X]=m/p,\\quad Var[X]=m(1-p)/p^2$$",
        "Use after identifying Pascal."
      ],
      [
        "Hypergeometric",
        "$$P(X=k)=\\frac{\\binom Kk\\binom{N-K}{n-k}}{\\binom Nn}$$",
        "Sampling without replacement from N items with K successes."
      ],
      [
        "Hypergeometric mean/variance",
        "$$E[X]=nK/N,\\quad Var[X]=n\\frac KN(1-\\frac KN)\\frac{N-n}{N-1}$$",
        "Use for finite populations without replacement."
      ],
      [
        "Poisson",
        "$$P(X=k)=e^{-\\lambda}\\frac{\\lambda^k}{k!},\\quad k=0,1,2,\\ldots$$",
        "Counts events in fixed time/space with constant rate."
      ],
      [
        "Poisson properties",
        "$$E[X]=\\lambda,\\quad Var[X]=\\lambda$$",
        "Also use as Binomial approximation when n large, p small, $\\lambda=np$."
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
        "All values in an interval equally likely."
      ]
    ],
    "example": {
      "source": "Week 4 lecture example",
      "prompt": "A PCR-based assay is used to detect a specific DNA sequence in a biological sample. Due to technical and biological variability, the assay successfully detects the target in a given run with probability 0.90, and fails otherwise. Suppose the assay is repeated until 9 successful detections are observed. Determine the probability that exactly 10 runs are required. Find the expected number of runs required to obtain these 9 successful detections.",
      "solution": "$X\\sim Pascal(m=9,p=0.90)$.\n$P(X=10)=\\binom{9}{8}(0.90)^9(0.10)=9(0.90)^9(0.10)\\approx0.3487$.\n$E[X]=m/p=9/0.90=10$."
    },
    "practice": {
      "source": "Homework 4 style",
      "prompt": "A single-cell RNA sequencing assay detects a low-abundance gene with probability p=0.30 independently each run. The experiment is repeated until 5 successful detections are observed. Let X be total runs required. Find P(X=8), E[X], and Var[X].",
      "answer": "$X\\sim Pascal(m=5,p=0.30)$.\n$P(X=8)=\\binom{7}{4}(0.30)^5(0.70)^3\\approx0.0292$.\n$E[X]=5/0.30\\approx16.67$.\n$Var[X]=5(0.70)/(0.30)^2\\approx38.89$."
    }
  },
  {
    "week": "Week 5",
    "lectures": "Lectures 9–10",
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
        "Waiting time until first event; memoryless."
      ],
      [
        "Exponential properties",
        "$$E[X]=1/\\lambda,\\quad Var[X]=1/\\lambda^2,\\quad P(X>s+t|X>s)=P(X>t)$$",
        "Use with rate/waiting-time language."
      ],
      [
        "Gamma",
        "$$f(x)=\\frac{\\lambda^\\alpha}{\\Gamma(\\alpha)}x^{\\alpha-1}e^{-\\lambda x},\\quad E[X]=\\alpha/\\lambda,\\ Var[X]=\\alpha/\\lambda^2$$",
        "Waiting time until alpha-th event / sum of exponentials."
      ],
      [
        "Normal",
        "$$f(x)=\\frac{1}{\\sqrt{2\\pi\\sigma^2}}e^{-(x-\\mu)^2/(2\\sigma^2)}$$",
        "Measurement with many small independent noise sources."
      ],
      [
        "Standardization",
        "$$Z=\\frac{X-\\mu}{\\sigma}$$",
        "Convert normal probability to standard normal table/CDF."
      ]
    ],
    "example": {
      "source": "Week 5 lecture example",
      "prompt": "In a biochemical system, let X denote a normalized substrate concentration (scaled between 0 and 1) in a microenvironment. Suppose X has the following probability density function: f_X(x)=4x^3, 0<x≤1, and 0 otherwise. The enzymatic downstream response is inversely proportional to the substrate concentration. Specifically, let Y=1/X. Find the probability density function of Y.",
      "solution": "Range: $Y\\in[1,\\infty)$. The inverse is $g^{-1}(y)=1/y$ and $g'(x)=-1/x^2$.\n$|g'(g^{-1}(y))|=y^2$.\n$f_Y(y)=f_X(1/y)/y^2=4(1/y)^3/y^2=4/y^5$, for $y\\ge1$; 0 otherwise."
    },
    "practice": {
      "source": "Homework 5 style",
      "prompt": "Let X~Exponential(λ=2). Define Y=2+3X. Find P(X>2), E[Y], Var[Y], SD[Y], and P(X>2 | Y<11).",
      "answer": "$P(X>2)=e^{-4}\\approx0.0183$.\n$E[Y]=2+3(1/2)=7/2$.\n$Var[Y]=3^2(1/4)=9/4$, so $SD[Y]=3/2$.\n$Y<11\\Leftrightarrow X<3$, so $P(X>2|Y<11)=P(2<X<3)/P(X<3)=(e^{-4}-e^{-6})/(1-e^{-6})\\approx0.0158$."
    }
  },
  {
    "week": "Week 6",
    "lectures": "Lectures 11–12",
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
      "prompt": "Consider a sequencing assay where X is the number of mutated DNA fragments detected in a sample (X∈{0,1}) and Y is the number of sequencing errors observed in the same sample (Y∈{0,1,2}). The joint PMF is: p(0,0)=1/6, p(1,0)=1/8, p(0,1)=1/4, p(1,1)=1/6, p(0,2)=1/8, p(1,2)=1/6. (a) What is the probability that a sample contains no detected mutations and at most one sequencing error? (b) Determine the marginal distributions. (c) What is P(Y=1|X=0)? (d) Are mutation detection and sequencing error independent?",
      "solution": "(a) $P(X=0,Y\\le1)=1/6+1/4=5/12$.\n(b) $P_X(0)=13/24$, $P_X(1)=11/24$; $P_Y(0)=7/24$, $P_Y(1)=5/12$, $P_Y(2)=7/24$.\n(c) $P(Y=1|X=0)=(1/4)/(13/24)=6/13$.\n(d) Not independent because $P(Y=1|X=0)=6/13\\ne P(Y=1)=5/12$."
    },
    "practice": {
      "source": "Midterm 2 style",
      "prompt": "Suppose p_{X,Y}(x,y)=c(x+y+1) for x=0,1,2 and y=0,1, and 0 otherwise. Find c, p_X(x), p_Y(y), P(X≥1|Y=1), and determine whether X and Y are independent.",
      "answer": "Sum all weights: for y=0: 1+2+3=6; for y=1: 2+3+4=9; total 15, so $c=1/15$.\n$p_X(0)=3/15=1/5$, $p_X(1)=5/15=1/3$, $p_X(2)=7/15$.\n$p_Y(0)=6/15=2/5$, $p_Y(1)=9/15=3/5$.\n$P(X\\ge1|Y=1)=(3/15+4/15)/(3/5)=7/9$.\nNot independent, for example $p(0,0)=1/15$ but $p_X(0)p_Y(0)=2/25$."
    }
  },
  {
    "week": "Week 7",
    "lectures": "Lectures 13–14",
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
        "First derivative gives mean, second gives $E[X^2]$."
      ],
      [
        "Independent sum MGF",
        "$$M_{X+Y}(t)=M_X(t)M_Y(t)$$",
        "Only when independent."
      ]
    ],
    "example": {
      "source": "Week 7 lecture example",
      "prompt": "In a molecular diagnostics experiment, the concentration of circulating tumor DNA varies across patient samples due to biological heterogeneity. The biomarker concentration varies between 1 and 2, with all concentrations in this range being equally likely. For a given concentration value x, the number of mutant DNA fragments detected during sequencing follows a Poisson distribution with rate x. Calculate the covariance between the concentration and the number of mutant DNA fragments detected during sequencing.",
      "solution": "Let $X\\sim U(1,2)$ and $Y|X\\sim Poisson(X)$. Then $E[X]=3/2$, $E[Y|X]=X$, so $E[Y]=3/2$.\n$E[XY]=E[E[XY|X]]=E[XE[Y|X]]=E[X^2]=\\int_1^2 x^2dx=7/3$.\n$Cov[X,Y]=7/3-(3/2)(3/2)=1/12$."
    },
    "practice": {
      "source": "Homework 6 style",
      "prompt": "In a multiplex biosensor experiment, Var(X)=4 and Var(Y)=9. Define Z=2X−Y and W=X+Y. Suppose Z and W are independent. Find Cov(X,Y) and the correlation between X and Y.",
      "answer": "Since Z and W are independent, $Cov(Z,W)=0$.\n$Cov(2X-Y,X+Y)=2Var(X)+2Cov(X,Y)-Cov(X,Y)-Var(Y)=8+Cov(X,Y)-9$.\nSet equal to 0: $Cov(X,Y)=1$.\n$\\rho=Cov/(\\sigma_X\\sigma_Y)=1/(2\\cdot3)=1/6$."
    }
  },
  {
    "week": "Week 8",
    "lectures": "Lectures 15–16",
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
      "prompt": "In a DNA sequencing experiment, each sequencing read independently produces an error with probability 0.05. Suppose X denotes the total number of sequencing errors among 1000 reads. A bioengineer is concerned about sequencing runs in which at least 7% of all reads contain errors, since such runs are considered experimentally unusable. For a given experiment, find an upper bound on the probability that at least 7% of reads contain sequencing errors. Solve using Markov’s inequality.",
      "solution": "$X\\sim Binomial(n=1000,p=0.05)$, so $E[X]=50$. At least 7% means $X\\ge70$.\nBy Markov: $P(X\\ge70)\\le E[X]/70=50/70\\approx0.714$."
    },
    "practice": {
      "source": "Different type from same bound topic",
      "prompt": "Suppose a biosensor error count X has E[X]=40 and Var[X]=30. Use Chebyshev's inequality to bound P(|X−40|≥10). Then use it to bound P(X≥55).",
      "answer": "$P(|X-40|\\ge10)\\le30/10^2=0.30$.\nFor $P(X\\ge55)$, $X-40\\ge15$ implies $|X-40|\\ge15$, so $P(X\\ge55)\\le30/15^2=30/225=0.1333$."
    }
  },
  {
    "week": "Week 9",
    "lectures": "Lectures 17–18",
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
      "prompt": "A bioengineer uses identical and independent biosensors to measure the concentration of a signaling molecule in a biological sample. Let X_i denote the concentration measured by the i-th biosensor. Suppose each measurement has expected value μ with a standard deviation of σ. How many biosensors are needed so that the average measured concentration is within ε=5 units of μ with probability at least 95%?",
      "solution": "Use Chebyshev on $\\bar X_n$. Need $P(|\\bar X_n-\\mu|\\ge5)\\le0.05$.\n$Var(\\bar X_n)=\\sigma^2/n$, so $P(|\\bar X_n-\\mu|\\ge5)\\le\\sigma^2/(25n)$.\nRequire $\\sigma^2/(25n)\\le0.05$, so $n\\ge\\sigma^2/1.25$. Round up to a whole number."
    },
    "practice": {
      "source": "Homework 6 / CLT style",
      "prompt": "A bioengineer wants 30 usable single-cell droplets. Each droplet is usable with probability 0.20 independently. Use a CLT approximation with continuity correction to estimate P(175≤T≤180), where T is the number of droplets needed to obtain 30 usable droplets. Identify the distribution first.",
      "answer": "$T\\sim Pascal(m=30,p=0.20)$.\n$E[T]=m/p=150$, $Var[T]=m(1-p)/p^2=30(0.8)/0.04=600$, $SD=\\sqrt{600}$.\nContinuity correction: $P(174.5<T<180.5)$.\nApprox: $P((174.5-150)/\\sqrt{600}<Z<(180.5-150)/\\sqrt{600})=P(1.000<Z<1.245)$. Use normal CDF values to finish."
    }
  },
  {
    "week": "Week 10",
    "lectures": "Lectures 19–20",
    "title": "Variance Estimation, MLE, Hypothesis Testing",
    "color": "#854F0B",
    "bg": "#FAEEDA",
    "focus": "Use this for sample variance, bias, maximum likelihood, z-tests, p-values, and Type I/II errors.",
    "formulas": [
      [
        "Known-mean variance estimator",
        "$$\\hat\\sigma_\\mu^2=\\frac1n\\sum_{i=1}^n(X_i-\\mu)^2$$",
        "Unbiased if true μ is known."
      ],
      [
        "Biased variance with sample mean",
        "$$\\bar S^2=\\frac1n\\sum_{i=1}^n(X_i-\\bar X)^2$$",
        "Biased low for σ²."
      ],
      [
        "Bias of biased variance",
        "$$E[\\bar S^2]=\\frac{n-1}{n}\\sigma^2,\\quad Bias=-\\frac{1}{n}\\sigma^2$$",
        "Shows why divide by n−1."
      ],
      [
        "Sample variance",
        "$$S^2=\\frac{1}{n-1}\\sum_{i=1}^n(X_i-\\bar X)^2$$",
        "Unbiased estimator of σ²."
      ],
      [
        "Computational variance",
        "$$S^2=\\frac{1}{n-1}\\left(\\sum X_i^2-n\\bar X^2\\right)$$",
        "Fast calculation from raw data."
      ],
      [
        "Sample standard deviation",
        "$$S=\\sqrt{S^2}$$",
        "Common estimator of σ, but generally biased."
      ],
      [
        "Likelihood",
        "$$L(\\theta)=\\prod_{i=1}^n f(X_i;\\theta)$$",
        "Probability/density of observed data as a function of θ."
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
        "For iid exponential(rate λ)."
      ],
      [
        "Z test statistic",
        "$$Z=\\frac{\\bar X-\\mu_0}{\\sigma/\\sqrt n}$$",
        "Use when σ known or CLT approximation is allowed."
      ],
      [
        "p-value right tail",
        "$$p=1-\\Phi(z_{obs})$$",
        "For $H_1:\\mu>\\mu_0$."
      ],
      [
        "Critical rule",
        "Reject H0 if p<\\alpha$$",
        "Small p-value = data is unlikely under H0."
      ],
      [
        "Type I / Type II",
        "Type I = reject true H0; Type II = fail to reject false H0; Power = 1−β",
        "Useful for interpretation questions."
      ]
    ],
    "example": {
      "source": "Week 10 lecture example",
      "prompt": "A team of bioengineers is evaluating the degradation time of a biodegradable polymer used in a tissue scaffold. The observed sample of degradation times is: T1=18, T2=21, T3=17, T4=16, T5=24, T6=20. Assuming the trials are i.i.d., find the values of the sample mean, the sample variance, and the sample standard deviation for the observed sample.",
      "solution": "$\\bar T=(18+21+17+16+24+20)/6=19.33$ minutes.\n$S^2=\\frac{1}{5}\\sum(T_i-19.33)^2=8.67$ min$^2$.\n$S=\\sqrt{8.67}=2.94$ minutes."
    },
    "practice": {
      "source": "Homework 6 style",
      "prompt": "A bioengineer measures biomarker concentrations from 5 patients: X1=8, X2=10, X3=9, X4=13, X5=10. Compare two estimators of the population mean θ: Θ1=Xbar and Θ2=(X1+X5)/2. Calculate both observed estimates and state which would generally be preferred and why.",
      "answer": "$\\hat\\Theta_1=\\bar X=(8+10+9+13+10)/5=10$.\n$\\hat\\Theta_2=(8+10)/2=9$.\nGenerally prefer $\\bar X$ because it uses all observations, usually has lower variance, and is the standard unbiased estimator of the population mean when observations are i.i.d."
    }
  }
];
const QUICK_SHEETS = [
  {
    "label": "Week 1 Lectures 1–2",
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
    "label": "Week 2 Lectures 3–4",
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
    "label": "Week 3 Lectures 5–6",
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
        "$$P(X=k)=(1-p)^{k-1}p,\\ E[X]=1/p,\\ Var[X]=(1-p)/p^2$$",
        "Number of trials until first success."
      ]
    ]
  },
  {
    "label": "Week 4 Lectures 7–8",
    "title": "Pascal, Hypergeometric, Poisson, Continuous RVs",
    "color": "#993C1D",
    "bg": "#FAECE7",
    "formulas": [
      [
        "Pascal / negative binomial",
        "$$P(X=k)=\\binom{k-1}{m-1}p^m(1-p)^{k-m},\\ k=m,m+1,\\ldots$$",
        "Number of trials required to get m successes."
      ],
      [
        "Pascal mean/variance",
        "$$E[X]=m/p,\\quad Var[X]=m(1-p)/p^2$$",
        "Use after identifying Pascal."
      ],
      [
        "Hypergeometric",
        "$$P(X=k)=\\frac{\\binom Kk\\binom{N-K}{n-k}}{\\binom Nn}$$",
        "Sampling without replacement from N items with K successes."
      ],
      [
        "Hypergeometric mean/variance",
        "$$E[X]=nK/N,\\quad Var[X]=n\\frac KN(1-\\frac KN)\\frac{N-n}{N-1}$$",
        "Use for finite populations without replacement."
      ],
      [
        "Poisson",
        "$$P(X=k)=e^{-\\lambda}\\frac{\\lambda^k}{k!},\\quad k=0,1,2,\\ldots$$",
        "Counts events in fixed time/space with constant rate."
      ],
      [
        "Poisson properties",
        "$$E[X]=\\lambda,\\quad Var[X]=\\lambda$$",
        "Also use as Binomial approximation when n large, p small, $\\lambda=np$."
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
        "All values in an interval equally likely."
      ]
    ]
  },
  {
    "label": "Week 5 Lectures 9–10",
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
        "Exponential PDF/CDF",
        "$$f(x)=\\lambda e^{-\\lambda x},\\ x\\ge0;\\quad F(x)=1-e^{-\\lambda x}$$",
        "Waiting time until first event; memoryless."
      ],
      [
        "Exponential properties",
        "$$E[X]=1/\\lambda,\\quad Var[X]=1/\\lambda^2,\\quad P(X>s+t|X>s)=P(X>t)$$",
        "Use with rate/waiting-time language."
      ],
      [
        "Gamma",
        "$$f(x)=\\frac{\\lambda^\\alpha}{\\Gamma(\\alpha)}x^{\\alpha-1}e^{-\\lambda x},\\quad E[X]=\\alpha/\\lambda,\\ Var[X]=\\alpha/\\lambda^2$$",
        "Waiting time until alpha-th event / sum of exponentials."
      ],
      [
        "Normal",
        "$$f(x)=\\frac{1}{\\sqrt{2\\pi\\sigma^2}}e^{-(x-\\mu)^2/(2\\sigma^2)}$$",
        "Measurement with many small independent noise sources."
      ],
      [
        "Standardization",
        "$$Z=\\frac{X-\\mu}{\\sigma}$$",
        "Convert normal probability to standard normal table/CDF."
      ]
    ]
  },
  {
    "label": "Week 6 Lectures 11–12",
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
    "label": "Week 7 Lectures 13–14",
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
        "First derivative gives mean, second gives $E[X^2]$."
      ],
      [
        "Independent sum MGF",
        "$$M_{X+Y}(t)=M_X(t)M_Y(t)$$",
        "Only when independent."
      ]
    ]
  },
  {
    "label": "Week 8 Lectures 15–16",
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
    ]
  },
  {
    "label": "Week 9 Lectures 17–18",
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
    ]
  },
  {
    "label": "Week 10 Lectures 19–20",
    "title": "Variance Estimation, MLE, Hypothesis Testing",
    "color": "#854F0B",
    "bg": "#FAEEDA",
    "formulas": [
      [
        "Known-mean variance estimator",
        "$$\\hat\\sigma_\\mu^2=\\frac1n\\sum_{i=1}^n(X_i-\\mu)^2$$",
        "Unbiased if true μ is known."
      ],
      [
        "Biased variance with sample mean",
        "$$\\bar S^2=\\frac1n\\sum_{i=1}^n(X_i-\\bar X)^2$$",
        "Biased low for σ²."
      ],
      [
        "Bias of biased variance",
        "$$E[\\bar S^2]=\\frac{n-1}{n}\\sigma^2,\\quad Bias=-\\frac{1}{n}\\sigma^2$$",
        "Shows why divide by n−1."
      ],
      [
        "Sample variance",
        "$$S^2=\\frac{1}{n-1}\\sum_{i=1}^n(X_i-\\bar X)^2$$",
        "Unbiased estimator of σ²."
      ],
      [
        "Computational variance",
        "$$S^2=\\frac{1}{n-1}\\left(\\sum X_i^2-n\\bar X^2\\right)$$",
        "Fast calculation from raw data."
      ],
      [
        "Sample standard deviation",
        "$$S=\\sqrt{S^2}$$",
        "Common estimator of σ, but generally biased."
      ],
      [
        "Likelihood",
        "$$L(\\theta)=\\prod_{i=1}^n f(X_i;\\theta)$$",
        "Probability/density of observed data as a function of θ."
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
        "For iid exponential(rate λ)."
      ],
      [
        "Z test statistic",
        "$$Z=\\frac{\\bar X-\\mu_0}{\\sigma/\\sqrt n}$$",
        "Use when σ known or CLT approximation is allowed."
      ],
      [
        "p-value right tail",
        "$$p=1-\\Phi(z_{obs})$$",
        "For $H_1:\\mu>\\mu_0$."
      ],
      [
        "Critical rule",
        "Reject H0 if p<\\alpha$$",
        "Small p-value = data is unlikely under H0."
      ],
      [
        "Type I / Type II",
        "Type I = reject true H0; Type II = fail to reject false H0; Power = 1−β",
        "Useful for interpretation questions."
      ]
    ]
  }
];
const FINALS = [
  {
    "id": "2025",
    "title": "Practice Final Version A — Spring 2025 Bioengineering wording",
    "duration": 10800,
    "questions": [
      {
        "id": "25q1",
        "points": 10,
        "topic": "Bayes",
        "prompt": "Suppose a CRISPR-based genome editing tool has been evaluated for detecting off-target edits. Lab tests show that if an off-target edit occurs, the system detects it 92% of the time. If no off-target edit occurs, the system reports no edit 88% of the time. Assume off-target edits occur in 5% of all genome edits. A test run returns a positive off-target detection. What is the probability that an off-target edit actually occurred?",
        "keywords": [
          "0.2875",
          "0.288",
          "bayes",
          "0.16"
        ],
        "solution": "Let A=positive test and O=off-target edit. P(O)=0.05, P(A|O)=0.92, P(A|O^c)=0.12. P(A)=0.92(0.05)+0.12(0.95)=0.16. P(O|A)=0.92(0.05)/0.16=0.2875."
      },
      {
        "id": "25q2",
        "points": 10,
        "topic": "Conditional expectation",
        "prompt": "For binary X and Y with joint PMF p(0,0)=1/5, p(0,1)=2/5, p(1,0)=2/5, p(1,1)=0, let Z=E[X|Y]. Find marginal PMFs, conditional PMFs X|Y=0 and X|Y=1, the PMF of Z, E[Z], and Var[Z].",
        "keywords": [
          "3/5",
          "2/5",
          "2/3",
          "8/75",
          "z"
        ],
        "solution": "P_X(0)=3/5, P_X(1)=2/5; P_Y(0)=3/5, P_Y(1)=2/5. X|Y=0~Bernoulli(2/3); X|Y=1~Bernoulli(0). Z=2/3 with prob 3/5 and 0 with prob 2/5. E[Z]=2/5. Var[Z]=4/15-4/25=8/75."
      },
      {
        "id": "25q3",
        "points": 10,
        "topic": "Random sum",
        "prompt": "Let N~Geometric(p). Given N, let X_i~Uniform(0,a), independent of each other and of N. Let Y=sum_{i=1}^N X_i. Find E[Y] and Var[Y].",
        "keywords": [
          "a/(2p)",
          "a^2",
          "12p",
          "1-p",
          "4p^2"
        ],
        "solution": "E[N]=1/p, Var[N]=(1-p)/p^2. E[X]=a/2, Var[X]=a^2/12. E[Y]=E[N]E[X]=a/(2p). Var[Y]=E[N]Var[X]+Var[N](E[X])^2=a^2/(12p)+a^2(1-p)/(4p^2)."
      },
      {
        "id": "25q4",
        "points": 10,
        "topic": "Transformation",
        "prompt": "Let X~N(0,1) and Y=X^2. Use the method of transformations to derive f_Y(y) for y>0.",
        "keywords": [
          "sqrt",
          "-sqrt",
          "1/sqrt",
          "2pi",
          "e^{-y/2}"
        ],
        "solution": "Branches x=sqrt(y), x=-sqrt(y). f_Y(y)=f_X(sqrt y)/(2sqrt y)+f_X(-sqrt y)/(2sqrt y)=1/(sqrt(2πy))e^{-y/2}, y>0."
      },
      {
        "id": "25q5",
        "points": 10,
        "topic": "MGF",
        "prompt": "X has pdf f_X(x)=1/(2a) e^{-|x|/a}, a>0. Let Y=|X|. Derive the MGF of Y.",
        "keywords": [
          "exponential",
          "1/a",
          "1/(1-at)",
          "t<1/a"
        ],
        "solution": "Y has exponential distribution with rate 1/a. Thus M_Y(t)=(1/a)/(1/a-t)=1/(1-at), for t<1/a."
      },
      {
        "id": "25q6",
        "points": 10,
        "topic": "Covariance by conditioning",
        "prompt": "X has CDF F_X(x)=0 for x≤1, (x−1)/2 for 1<x≤3, and 1 for x>3. Given Y|X~Exponential(rate X), find Cov(X,Y) and interpret the relationship. Use ln3≈1.10.",
        "keywords": [
          "uniform",
          "1-ln3",
          "-0.10",
          "decrease",
          "1/x"
        ],
        "solution": "X~Uniform(1,3). E[X]=2. E[Y|X]=1/X, so E[Y]=(1/2)∫_1^3 1/x dx=ln3/2. E[XY]=E[X(1/X)]=1. Cov=1−2(ln3/2)=1−ln3≈−0.10. E[Y|X]=1/X decreases as X increases."
      },
      {
        "id": "25q7",
        "points": 10,
        "topic": "CLT",
        "prompt": "A sequencing device reads 2000 base pairs. Each base has error probability 0.02 independently. A read is discarded if there are more than 60 errors. Use CLT to approximate the discard probability. Hint: Φ(3.194)≈0.99932.",
        "keywords": [
          "40",
          "39.2",
          "3.194",
          "0.00068"
        ],
        "solution": "Y~Binomial(2000,0.02). μ=40, σ²=39.2. P(Y>60)≈P(Z>(60−40)/sqrt(39.2))=P(Z>3.194)=1−0.99932=0.00068."
      },
      {
        "id": "25q8",
        "points": 10,
        "topic": "MLE Poisson",
        "prompt": "Given iid X_1,...,X_n from Poisson(λ), derive the MLE for λ using the log likelihood.",
        "keywords": [
          "lambda hat",
          "bar",
          "sum",
          "n",
          "log likelihood"
        ],
        "solution": "ℓ(λ)=−nλ+(Σx_i)lnλ−Σln(x_i!). Set dℓ/dλ=−n+Σx_i/λ=0. Thus λhat=Σx_i/n=Xbar. Second derivative is negative."
      },
      {
        "id": "25q9",
        "points": 10,
        "topic": "Bias",
        "prompt": "For iid X_i with mean μ and variance σ², an estimator for θ=μ² is Θhat=(Xbar)^2. Calculate the bias and state whether it overestimates or underestimates.",
        "keywords": [
          "sigma^2/n",
          "positive",
          "overestimate",
          "E[xbar^2]"
        ],
        "solution": "E[(Xbar)^2]=Var(Xbar)+(E[Xbar])²=σ²/n+μ². Bias=σ²/n, which is positive, so it overestimates μ² on average."
      },
      {
        "id": "25q10",
        "points": 10,
        "topic": "Hypothesis testing",
        "prompt": "Healthy PVCs per hour follow N(50,12²). Find cutoff c so P(PVCs>c|healthy)=0.01. Then for 73 PVCs, compute the p-value using Φ(1.92)≈0.9726 and interpret at α=0.05. Also state H0 and H1.",
        "keywords": [
          "77.96",
          "0.0274",
          "reject",
          "0.05",
          "mu>50"
        ],
        "solution": "H0: μ=50; H1: μ>50. c=50+12Φ^{-1}(0.99)=50+12(2.33)=77.96. For 73, z=(73−50)/12=1.92, p=1−0.9726=0.0274. Reject at 0.05."
      }
    ]
  },
  {
    "id": "2024",
    "title": "Practice Final Version B — Spring 2024 mixed final",
    "duration": 10800,
    "questions": [
      {
        "id": "24q1",
        "points": 10,
        "topic": "Conditional probability",
        "prompt": "A biased coin has P(H)=p and P(T)=q=1−p. A game ends when HH or TT first appears. I win if HH appears. Given that I won, find P(first toss was H).",
        "keywords": [
          "1/(2-p)",
          "bayes",
          "q",
          "1+q"
        ],
        "solution": "Using Bayes with A=I win: P(A|H)=p/(1-pq), P(A|T)=p^2/(1-pq). P(H|A)=P(A|H)p/[P(A|H)p+P(A|T)q]=1/(1+q)=1/(2-p)."
      },
      {
        "id": "24q2",
        "points": 10,
        "topic": "CLT",
        "prompt": "A codeword has 1000 bits, each with independent error probability 0.10. Decoding fails if errors exceed 125. Use CLT and Φ(25/sqrt(90))=0.9958 to approximate failure probability.",
        "keywords": [
          "100",
          "90",
          "0.0042",
          "25/sqrt"
        ],
        "solution": "Y~Binomial(1000,0.1). μ=100, σ²=90. P(Y>125)≈P(Z>25/sqrt(90))=1−0.9958=0.0042."
      },
      {
        "id": "24q3",
        "points": 10,
        "topic": "Poisson LOTUS",
        "prompt": "X is Poisson with mean λ. Without using Var[X]=λ, show E[X²]=λ²+λ using LOTUS.",
        "keywords": [
          "E[X(X-1)]",
          "lambda^2",
          "lambda^2+lambda",
          "lotus"
        ],
        "solution": "Compute E[X(X−1)]=Σ k(k−1)e^{−λ}λ^k/k!=λ². Since X²=X(X−1)+X, E[X²]=λ²+λ."
      },
      {
        "id": "24q4",
        "points": 10,
        "topic": "Total expectation/variance",
        "prompt": "X~Uniform(1,2). Given X=x, Y~Exponential(rate x). Find E[Y] and Var[Y]. Use ln2≈0.70.",
        "keywords": [
          "ln2",
          "0.70",
          "E[1/X]",
          "total variance",
          "2-ln2"
        ],
        "solution": "E[Y|X]=1/X, Var[Y|X]=1/X². E[Y]=∫_1^2 1/x dx=ln2≈0.70. Var[Y]=E[1/X²]+Var(1/X). E[1/X²]=1/2. E[1/X]=ln2. Var(1/X)=1/2−(ln2)^2. Total Var=1/2+1/2−(ln2)^2=1−(ln2)^2≈0.51."
      },
      {
        "id": "24q5",
        "points": 10,
        "topic": "Indicator variables",
        "prompt": "n people sit around a round table, n>5. Each tosses a fair coin. A person receives a present if their outcome differs from both neighbors. Let X be the number receiving presents. Find E[X] and outline Var[X].",
        "keywords": [
          "indicator",
          "1/4",
          "n/4",
          "covariance"
        ],
        "solution": "Let I_i=1 if person i differs from both neighbors. P(I_i=1)=P(HTH or THT)=1/4, so E[X]=ΣE[I_i]=n/4. For Var[X], use Var(sum I_i)=ΣVar(I_i)+2ΣCov(I_i,I_j), noting only nearby indicators are dependent on the circle."
      },
      {
        "id": "24q6",
        "points": 10,
        "topic": "Independence and moments",
        "prompt": "X,Y,Z are independent, X~N(μ,σ²), and Y,Z~Uniform(0,2). Given E[X²Y+XYZ]=13 and E[XY²+ZX²]=14, find μ and σ.",
        "keywords": [
          "E[Y]=1",
          "E[Z]=1",
          "E[Y^2]=4/3",
          "mu",
          "sigma"
        ],
        "solution": "Use independence: E[Y]=E[Z]=1, E[Y²]=4/3, E[X²]=μ²+σ². First equation: E[X²]E[Y]+E[X]E[Y]E[Z]=μ²+σ²+μ=13. Second: E[X]E[Y²]+E[Z]E[X²]=(4/3)μ+μ²+σ²=14. Subtract gives μ/3=1, so μ=3. Then 9+σ²+3=13, so σ²=1 and σ=1."
      },
      {
        "id": "24q7",
        "points": 10,
        "topic": "MSE",
        "prompt": "For iid X_i with mean θ and variance σ², compare Θ1=X1 and Θ2=Xbar. Show both are unbiased and for n>1, MSE(Θ1)>MSE(Θ2).",
        "keywords": [
          "unbiased",
          "sigma^2",
          "sigma^2/n",
          "mse"
        ],
        "solution": "E[X1]=θ and E[Xbar]=θ, so both unbiased. MSE=Var for unbiased estimators. Var(Θ1)=σ², Var(Θ2)=σ²/n. For n>1, σ²>σ²/n."
      },
      {
        "id": "24q8",
        "points": 10,
        "topic": "MLE Exponential",
        "prompt": "Find the MLE of θ for iid exponential(rate θ) observations (1.23, 3.32, 1.98, 2.12). Check second derivative.",
        "keywords": [
          "4/sum",
          "0.462",
          "negative",
          "1/xbar"
        ],
        "solution": "ℓ(θ)=nlnθ−θΣx_i. dℓ/dθ=n/θ−Σx_i=0, so θhat=n/Σx_i=4/(1.23+3.32+1.98+2.12)=4/8.65≈0.462. Second derivative −n/θ²<0."
      },
      {
        "id": "24q9",
        "points": 10,
        "topic": "MGF Laplace",
        "prompt": "Find the MGF of X with pdf f_X(x)=λ/2 e^{−λ|x|}, x real, λ>0.",
        "keywords": [
          "lambda^2",
          "lambda^2-t^2",
          "t<lambda",
          "split"
        ],
        "solution": "Split at 0: M(t)=λ/2∫_{−∞}0 e^{tx}e^{λx}dx+λ/2∫_0∞e^{tx}e^{−λx}dx = λ/2[1/(λ+t)+1/(λ−t)] = λ²/(λ²−t²), |t|<λ."
      },
      {
        "id": "24q10",
        "points": 10,
        "topic": "Correlation",
        "prompt": "Cov(X1,X2)=1, Var(X1)=2, Var(X2)=4. Let X3=X1+X2+319 and X4=X2+1241. Find corr(X3,X4).",
        "keywords": [
          "5",
          "4",
          "3",
          "5/sqrt",
          "cov"
        ],
        "solution": "Cov(X3,X4)=Cov(X1+X2,X2)=Cov(X1,X2)+Var(X2)=1+4=5. Var(X3)=2+4+2(1)=8. Var(X4)=4. Corr=5/sqrt(8*4)=5/sqrt32."
      }
    ]
  },
  {
    "id": "2023",
    "title": "Practice Final Version C — Spring 2023 mixed final",
    "duration": 10800,
    "questions": [
      {
        "id": "23q1",
        "points": 10,
        "topic": "Bayes",
        "prompt": "A drug test is positive with probability 0.98 for users and negative with probability 0.90 for non-users. Suppose 10% of the population uses the drug. A random person tests positive. What is P(user | positive)?",
        "keywords": [
          "0.52",
          "0.188",
          "bayes"
        ],
        "solution": "P(+)=0.98(0.10)+0.10(0.90)=0.188. P(user|+)=0.98(0.10)/0.188≈0.52."
      },
      {
        "id": "23q2",
        "points": 10,
        "topic": "Conditional expectation",
        "prompt": "For joint PMF p(0,0)=1/5, p(0,1)=2/5, p(1,0)=2/5, p(1,1)=0, let Z=E[X|Y]. Find the PMF of Z, E[Z], and Var[Z].",
        "keywords": [
          "2/3",
          "3/5",
          "2/5",
          "8/75"
        ],
        "solution": "Same calculation: Z=2/3 with probability 3/5 and 0 with probability 2/5. E[Z]=2/5. Var[Z]=8/75."
      },
      {
        "id": "23q3",
        "points": 10,
        "topic": "Random sum",
        "prompt": "N~Poisson(β). Given N, X_i~Exponential(λ), independent of each other and of N. Let Y=sum_{i=1}^N X_i. Find E[Y] and Var[Y].",
        "keywords": [
          "beta/lambda",
          "2beta/lambda^2",
          "total variance"
        ],
        "solution": "E[N]=β, Var[N]=β, E[X]=1/λ, Var[X]=1/λ². E[Y]=β/λ. Var[Y]=β/λ²+β(1/λ)²=2β/λ²."
      },
      {
        "id": "23q4",
        "points": 10,
        "topic": "Transformation",
        "prompt": "Let X be standard normal and Y=X². Find f_Y(y) using transformations.",
        "keywords": [
          "sqrt",
          "e^{-y/2}",
          "sqrt(2pi y)"
        ],
        "solution": "f_Y(y)=1/(sqrt(2πy))e^{-y/2}, y>0, from branches ±sqrt(y)."
      },
      {
        "id": "23q5",
        "points": 10,
        "topic": "MGF",
        "prompt": "X has pdf f_X(x)=1/(2a)e^{−|x|/a}, a>0. Given Y=|X|, derive M_Y(t).",
        "keywords": [
          "1/(1-at)",
          "exponential",
          "t<1/a"
        ],
        "solution": "Y~Exponential(rate 1/a), so M_Y(t)=1/(1−at), t<1/a."
      },
      {
        "id": "23q6",
        "points": 10,
        "topic": "Covariance",
        "prompt": "X has CDF 0 for x≤1, (x−1)/2 for 1<x≤3, and 1 for x>3. Given Y|X~Exponential(rate X), find Cov(X,Y), using ln3≈1.10.",
        "keywords": [
          "1-ln3",
          "-0.10",
          "uniform"
        ],
        "solution": "X~Uniform(1,3). E[X]=2, E[Y]=ln3/2, E[XY]=1, so Cov=1−ln3≈−0.10."
      },
      {
        "id": "23q7",
        "points": 10,
        "topic": "CLT",
        "prompt": "A codeword has 1000 bits and each bit has independent error probability 0.10. Decoding fails if errors exceed 125. Use CLT with Φ(25/sqrt(90))≈0.9958.",
        "keywords": [
          "0.0042",
          "100",
          "90"
        ],
        "solution": "Y~Binomial(1000,0.10). μ=100, σ²=90. P(Y>125)=1−Φ(25/sqrt90)=0.0042."
      },
      {
        "id": "23q8",
        "points": 10,
        "topic": "MLE Poisson",
        "prompt": "For iid Poisson(λ) sample X1,...,Xn, derive the MLE for λ.",
        "keywords": [
          "bar",
          "sum/n",
          "poisson",
          "mle"
        ],
        "solution": "Log likelihood: −nλ+(Σx_i)lnλ−constant. Set derivative to 0: λhat=Σx_i/n=Xbar."
      },
      {
        "id": "23q9",
        "points": 10,
        "topic": "Bias",
        "prompt": "For iid X_i with mean μ and variance σ², estimate θ=μ² using Θhat=(Xbar)^2. Calculate the bias.",
        "keywords": [
          "sigma^2/n",
          "bias",
          "positive"
        ],
        "solution": "E[(Xbar)^2]=μ²+σ²/n, so bias=σ²/n."
      },
      {
        "id": "23q10",
        "points": 10,
        "topic": "Hypothesis testing",
        "prompt": "A coin is tossed 100 times and 60 heads are observed. Test H0:p=0.5 vs H1:p>0.5 at α=0.05 and α=0.01. Use Φ(2)≈0.977, Φ^{-1}(0.95)=1.645, Φ^{-1}(0.99)=2.33. Find p-value.",
        "keywords": [
          "2",
          "0.023",
          "reject 0.05",
          "not 0.01"
        ],
        "solution": "Under H0, mean=50 and SD=sqrt(25)=5. z=(60−50)/5=2. p-value=1−Φ(2)=0.023. Reject at 0.05 because 2>1.645; do not reject at 0.01 because 2<2.33."
      }
    ]
  }
];

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
function Reveal({ title="Hidden answer", children, color=C.indigo }) {
  const [open,setOpen] = useState(false);
  return <div style={{ marginTop:"0.8rem" }}>
    <button onClick={()=>setOpen(!open)} style={S.btn(open?"outline":"primary", color)}>{open?"Hide answer":"Reveal answer"}</button>
    {open && <div style={{ marginTop:"0.75rem", padding:"0.85rem 1rem", borderRadius:"var(--border-radius-md)", background:"var(--color-background-secondary)", border:"0.5px dashed var(--color-border-secondary)", fontSize:"13px", lineHeight:1.75 }}><strong>{title}</strong><br/><MathBlock text={children}/></div>}
  </div>;
}
function ModuleCard({ m }) {
  const [open,setOpen] = useState(false);
  const [section,setSection] = useState("formulas");
  return <div style={{ ...S.card, borderColor:open?`${m.color}55`:"var(--color-border-tertiary)" }}>
    <div onClick={()=>setOpen(!open)} style={{ display:"flex", justifyContent:"space-between", gap:"1rem", cursor:"pointer" }}>
      <div>
        <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:"6px" }}><Pill color={m.color} bg={m.bg}>{m.week}</Pill><Pill color={C.gray} bg={C.grayBg}>{m.lectures}</Pill></div>
        <h3 style={{ margin:"0 0 4px", fontSize:"15px" }}>{m.title}</h3>
        <p style={{ margin:0, color:"var(--color-text-secondary)", fontSize:"13px", lineHeight:1.6 }}>{m.focus}</p>
      </div>
      <span style={{ color:m.color, fontSize:"24px", lineHeight:1 }}>{open?"−":"+"}</span>
    </div>
    {open && <div style={{ marginTop:"1rem" }}>
      <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"0.9rem" }}>
        {[['formulas','Formula sheet'],['example','Source example'],['practice','Practice question']].map(([id,label])=><button key={id} onClick={()=>setSection(id)} style={S.btn(section===id?'primary':'outline', m.color)}>{label}</button>)}
      </div>
      {section==='formulas' && <FormulaTable formulas={m.formulas}/>} 
      {section==='example' && <div style={{ background:m.bg, borderRadius:"var(--border-radius-md)", padding:"1rem", border:`0.5px solid ${m.color}40` }}>
        <Pill color={m.color} bg="var(--color-background-primary)">{m.example.source}</Pill>
        <h4 style={{ margin:"0.75rem 0 0.35rem", color:m.color }}>Example wording from source</h4>
        <div style={{ fontSize:"13.5px", lineHeight:1.75 }}><MathBlock text={m.example.prompt}/></div>
        <Reveal title="Example solution" color={m.color}>{m.example.solution}</Reveal>
      </div>}
      {section==='practice' && <div style={{ background:"var(--color-background-secondary)", borderRadius:"var(--border-radius-md)", padding:"1rem", border:"0.5px solid var(--color-border-tertiary)" }}>
        <Pill color={m.color} bg={m.bg}>{m.practice.source}</Pill>
        <h4 style={{ margin:"0.75rem 0 0.35rem", color:m.color }}>Different-type practice</h4>
        <div style={{ fontSize:"13.5px", lineHeight:1.75 }}><MathBlock text={m.practice.prompt}/></div>
        <Reveal title="Practice answer" color={m.color}>{m.practice.answer}</Reveal>
      </div>}
    </div>}
  </div>;
}
function LecturesTab() {
  const [q,setQ] = useState("");
  const filtered = MODULES.filter(m => (m.week+m.lectures+m.title+m.focus).toLowerCase().includes(q.toLowerCase()));
  return <div style={S.content}>
    <div style={S.alert(C.indigo,C.indigoBg)}>Each lecture card now starts with the formula sheet, then a source example, then a different-type practice question with the answer hidden. Final exam examples are kept out of the lecture practice area.</div>
    <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search week/topic, e.g. Bayes, CLT, covariance, MLE" style={{ width:"100%", padding:"0.7rem 0.9rem", borderRadius:"var(--border-radius-md)", border:"0.75px solid var(--color-border-secondary)", marginBottom:"1rem", fontSize:"13px" }}/>
    {filtered.map(m=><ModuleCard key={m.week} m={m}/>)}
  </div>;
}
function FormulaSheetTab() {
  const [onlyFinal,setOnlyFinal] = useState(false);
  const finalTopics = new Set(["Week 2","Week 4","Week 5","Week 6","Week 7","Week 9","Week 10"]);
  return <div style={S.content}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:"1rem", flexWrap:"wrap", marginBottom:"1rem" }}>
      <div style={S.alert(C.amber,C.amberBg)}>This is organized by lecture/week, not just by topic. Use this when making your real cheat sheet.</div>
      <label style={{ fontSize:"13px", display:"flex", gap:"6px", alignItems:"center" }}><input type="checkbox" checked={onlyFinal} onChange={e=>setOnlyFinal(e.target.checked)}/> Final-heavy topics only</label>
    </div>
    {QUICK_SHEETS.filter(s=>!onlyFinal || finalTopics.has(s.label.split(' ')[0]+' '+s.label.split(' ')[1])).map(s=><div key={s.label} style={S.card}>
      <div style={{ display:"flex", gap:"8px", alignItems:"center", flexWrap:"wrap", marginBottom:"0.75rem" }}><Pill color={s.color} bg={s.bg}>{s.label}</Pill><h3 style={{ margin:0, fontSize:"15px" }}>{s.title}</h3></div>
      <FormulaTable formulas={s.formulas} compact/>
    </div>)}
  </div>;
}
function PracticeBankTab() {
  const problems = MODULES.map(m=>({ week:m.week, title:m.title, color:m.color, bg:m.bg, ...m.practice }));
  return <div style={S.content}>
    <div style={S.alert(C.teal,C.tealBg)}>These are non-final practice questions. Answers stay hidden until you reveal them, so you can use this as normal practice before trying the timed final.</div>
    {problems.map((p,i)=><div key={i} style={S.card}>
      <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"0.75rem" }}><Pill color={p.color} bg={p.bg}>{p.week}</Pill><Pill color={C.gray} bg={C.grayBg}>{p.source}</Pill></div>
      <h3 style={{ margin:"0 0 0.6rem", fontSize:"15px" }}>{p.title}</h3>
      <div style={{ fontSize:"13.5px", lineHeight:1.8 }}><MathBlock text={p.prompt}/></div>
      <Reveal color={p.color} title="Answer">{p.answer}</Reveal>
    </div>)}
  </div>;
}
function formatTime(sec) {
  const h = Math.floor(sec/3600), m = Math.floor((sec%3600)/60), s = sec%60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}
function normalize(s="") { return String(s).toLowerCase().replace(/\s+/g," ").replace(/[−–]/g,"-"); }
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
    <div style={S.alert(C.red,C.redBg)}>Timed final mode locks answer boxes after submission or when the 3-hour timer hits zero. Scoring is automatic but keyword/rubric-based, so use the revealed solutions to check partial-credit details.</div>
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
      <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"0.7rem" }}><Pill color={C.indigo} bg={C.indigoBg}>Q{i+1} · {q.points} pts</Pill><Pill color={C.gray} bg={C.grayBg}>{q.topic}</Pill>{finished && <Pill color={(scores[q.id]||0)>=q.points*0.75?C.teal:C.red} bg={(scores[q.id]||0)>=q.points*0.75?C.tealBg:C.redBg}>{scores[q.id]||0}/{q.points}</Pill>}</div>
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
  const [tab,setTab] = useState('lectures');
  return <div style={S.app}>
    <div style={S.header}>
      <div style={{ width:"34px", height:"34px", borderRadius:"9px", background:C.indigo, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800 }}>B</div>
      <div>
        <h2 style={{ margin:0, fontSize:"16px" }}>BENG 100 Study Hub — Formula + Practice Final Edition</h2>
        <p style={{ margin:0, fontSize:"11.5px", color:"var(--color-text-secondary)" }}>Lectures 1–20 · formulas first · source examples · hidden practice · 3-hour timed final versions</p>
      </div>
      <div style={{ marginLeft:"auto", display:"flex", gap:"6px", flexWrap:"wrap" }}><Pill color={C.red} bg={C.redBg}>Show derivations for full credit</Pill></div>
    </div>
    <div style={S.tabBar}>{[
      ['lectures','📖 Lecture hub'], ['formula','📋 Formula sheet'], ['practice','✏️ Practice bank'], ['final','⏱️ Timed practice final']
    ].map(([id,label])=><button key={id} style={S.tab(tab===id)} onClick={()=>setTab(id)}>{label}</button>)}</div>
    {tab==='lectures' && <LecturesTab/>}
    {tab==='formula' && <FormulaSheetTab/>}
    {tab==='practice' && <PracticeBankTab/>}
    {tab==='final' && <TimedFinalTab/>}
  </div>;
}
