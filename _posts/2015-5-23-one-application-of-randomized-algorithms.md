---
layout: post
title: One Application of Randomized Algorithms
author: steve_jarvis
excerpt: "An overview of one useful application of randomization in computer science: checking matrix multiplication."
tags: [computer science, algorithms, randomized, matrix]
comments: true
image:
  feature: header.jpg
---

Here's a relatively simple
problem: Given three matrices, $$A$$, $$B$$ and $$C$$, check that $$C$$ is the
correct product of $$A \times B$$.

So, simple, yeah? Just compute $$A \times B$$ and check the result against
$$C$$. The multiplication takes $$O(n^3)$$ operations and the check is
$$O(n^2)$$, assuming $$A$$, $$B$$, and $$C$$ are $$n \times n$$ matrices. It's
polynomial time and guaranteed to be correct. However, what if our primary goal
was speed? Perhaps this check needs to be done many times as part of some
complex game play and, given the nature of the game, the matrices are very large
and 99% correctness it quite acceptable.

Then consider an $$n \times 1$$ matrix, $$D$$, with entries randomly selected
to be 1 or 0. It would take only $$O(n^2)$$ time to calculate
$$A \times D \times B$$ (calculated in that order) and $$O(n^2)$$ again to find
$$C \times D$$, for $$O(n^2)$$ overall.

When $$A \times B = C$$, then $$A \times B \times D = C \times D$$.
When $$A \times B \neq C$$, then $$A \times B \times D \neq C \times D$$ at
least half of the time. This is because the multiplication of elements that
differ between $$A \times B$$ and $$C$$ by a 0 in $$D$$ effectively hides
that inequality, and every element of $$D$$ has a
$$\frac{1}{2}$$ probability of being 0. Therefore each difference between $$A
\times B$$ and $$C$$ has a $$\frac{1}{2}$$ probability of being detected, and
further differences only increase the likelihood of correct detection.

Being right 50% of the time isn't much to get excited about, but, like we
mentioned, being right 99% of the time can be useful. Since this
approximation runs asymptotically faster than the full $$A \times B$$
calculation ($$O(n^2)$$ vs $$O(n^3)$$), we can repeat it a constant number of times
and still be faster than the traditional check. If each run uses a new,
randomly chosen $$D$$, then each result has a statistically independent chance
of being incorrect, with probability $$\leq \frac{1}{2}$$. So, we can
simply repeat the check 7 times and have $$\leq \frac{1}{2^7} = \frac{1}{128}$$
probability of being wrong, even better than 99% certainty.

That's pretty cool.

{% comment %}
First find $$A \times D$$.
\\
\\
$$
\begin{bmatrix}
A_{11} & A_{12} & A_{13} & A_{14} \\
A_{22} & A_{22} & A_{23} & A_{24} \\
A_{33} & A_{32} & A_{33} & A_{34} \\
A_{44} & A_{42} & A_{43} & A_{44}
\end{bmatrix}
\times
\begin{bmatrix}
D_1 \\
D_2 \\
D_3 \\
D_4
\end{bmatrix}
=
\begin{bmatrix}
X_1 \\
X_2 \\
X_3 \\
X_4
\end{bmatrix}
$$

Then calculate $$X \times B$$, or $$A \times B \times D$$.
\\
\\
$$
\begin{bmatrix}
X_1 \\
X_2 \\
X_3 \\
X_4
\end{bmatrix}
\times
\begin{bmatrix}
B_{11} & B_{12} & B_{13} & B_{14} \\
B_{22} & B_{22} & B_{23} & B_{24} \\
B_{33} & B_{32} & B_{33} & B_{34} \\
B_{44} & B_{42} & B_{43} & B_{44}
\end{bmatrix}
=
\begin{bmatrix}
Y_1 \\
Y_2 \\
Y_3 \\
Y_4
\end{bmatrix}
$$
\\

Lastly, $$C \times D$$ will yield a similar $$n \times 1$$ matrix.
{% endcomment %}
