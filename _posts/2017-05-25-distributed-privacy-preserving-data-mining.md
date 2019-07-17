---
layout: page
title: Distributed privacy preserving data mining
author: Neelam Memon
date: 2017-05-25
---

## Motivation

While de-identification by removing explicit identifiers is the
first step that we take towards the privacy protection, we consider
the cases when the approach may fail to provide the sufficient level
of protection specifically when records associated to the individuals
contain characteristics or combinations of characteristics that are
rare if not unique and make them identifiable even in the large
crowds and even in the cases when data query responses are restricted
to aggregate statistical results only.

CanDIG provides an additional layer of privacy that enable to perform
different data analyses in a privacy-preserving way. CanDig does
that by the implementing the notion of differential privacy. That
is, to learn as much as possible about a group while learning the
minimum possible at the individual-level.

With differential privacy, a data user can perform analyses
collectively over the available data in a way that lets him glean
useful notions about the associated group of individuals as a whole.
But anything about a single, specific one of those participants
can't be learned.

CanDIG implements the extension of differential privacy in two ways.
First, it facilitates the choice of **_&epsilon;_** in a more meaningful
way thereby simplifying the application of differential privacy in
practice. Second, it supports privacy-preserving data analyses in
distributed settings. This is an important requirement in modern
biomedicine research since data collected at one site are usually
sparse and insufficient to draw significantly reliable scientific
conclusions. CanDIG ensures that the required level of privacy be
achieved when analysis be performed collectily over the data
partitions residing distributively.

## Why Differential Privacy

Because it is future proof. Backed by a formal proof, Differential
Privacy gives a specified level of assurance that no participant
of a data analysis will be affected in privacy perspective irrespective
of what other datasets, studies, or information sources are or will
become available in future. This also implies that sensitive data
can readily be made available for useful analysis without such
practices as data usage agreement or data protection plans.

Given a randomized computation **_M_**, Differential Privacy requires
that the change in the probabilities that any given output is
produced using a given input and by its neighbouring datasets
(construced by adding to or removing a record from the input dataset)
is at most a multiplicative factor **_e_**. In other words, the
ratio of the probabilities that **_M_** produces a given output
when an individual opts in or out of a study is upper bounded by
**_e_**. The probabilities are taken over random choices made by
**_M_**.

The parameter **_e_** gives a way to precisely control and quantify
the privacy loss guarantees. Lower the **_e_** causes stronger
privacy guarantees as it limits the effect of a record  on the
outcome of the computation and hence may produce the output with
lower accuracy level. This leads to to the fact that the choice of
**_e_** is cruicial but not trival since $\epsilon$ is taken in the
context of a relative quantification of privacy and does not easily
relate to an absolute privacy measure in practice.

CanDIG supports differentially private data analysis by implementing
differentially privacy in simple low-level computational constructs
over the data. The low-level queries are made differentially-private
using laplace mechanism. A laplace mechanism computes the original
results from given input and adds random noise from 0-centered
laplace distribution. The scale of the distribution is determined
by the sensitivity of the computation (i.e. the maximum amount by
which the original output changes when a computation is performed
over a dataset and a neighbouring dataset) and by the choice of
privacy settings **_e_**.

This allows privacy loss over the composition of multiple differentially
private mechanims be quantified and hence complex data mining can
be made with privacy-preserving way.

## Privacy-Preserving Decision Tree Induction over 1000 Genome Data

For experimentation purposes, we implemented differentially-private
decision tree induction algorithms originally presented by Jagannathan
_et. al_ [ref] under CanDIG. A Decision tree Induction builds
classification or regression models in the form of a tree structure.
Given a set of pre-classified instances as input, the algorithm
decides which of the so far unused attributes is best to split on,
uses the attribute values to split the instances into smaller
subsets, and recurses over the resulting subsets until the instances
in all subsets have homogenous class attribute values or a pre-specified
condition is met. The final result is a tree with decision nodes
and leaf nodes representing the attributes used to classify the
attribute at the corresponding recursive step and the classification
results respectively.

We report our findings over 1000 Genome data. More specifically,
we considered the problem of classifying individuals into one of
the given ancestral populations based on the single-neucleotide
polymorphisms (SNPs). The SNPs overlapping xenobiotic metabolisim
and human pigmentation gene regions e.g. TYR, OCA2, DCT _etc._ were
considered. It was noticed that not all the SNPs are equally
informative and further filteration was therefore performed based
on their allele frequencies in each population.

### ID3 (Iterative Dichotomiser 3) 

ID3 is a classical decison tree induction method. It uses a heuristic
that is based around the goal of constructing a tree with the purest
possible leaf-nodes but the minimum possible depth. ID3 does that
by greedily choosing an unused attribute at each split that leads
to the data subsets with maximum purity. The purity is measured
using the concept of information gain. That is, the change in the
amount of information needed to classify the instances of a current
dataset partition, to the amount of information required to classify
them if the current dataset partition were to be further partitioned
on a given attribute.

We obtained the differentially private ID3 algorithm by replacing
original low-level queries over training instances with equivalent
laplace mechanisms. **_e_** privacy loss guarantees in the overall
tree induction is ensured by taking into account the composibility
of these **_e_**-differentially private low-level query functions.
Following the observation of Jagannathan _et. al_ [ref], the
**_e_**-differentially private queries posed to extend the different
nodes at a particular level of the tree takes disjoint subsets of
data. Therefore the combined outputs are not more diclosive about
an individual than the individual query results and hence gives
**_e_**-differential privacy.

Queries posed at different hierarchical levels use sequential
compositition. That is, they operate on the same data and the query
functions at particular hierarchical level are composed of the query
functions at the previous level. Assume, if the depth of the tree
is **_d_** and privacy loss at each level is **_e_** then the overall
privacy loss is **_d e_**.

[Data Ingestion and Differentially private Federated Classification needs first implementation] (ga4gh)

### Random Decision Trees
The random decision tree classifier presented in Jagannathan et. al is composed of an ensemble of random decision trees (RDT). As written in the paper, a random decision tree is built by repeatedly splitting the data by a randomly chosen feature. After a random tree structure is built, the training data is filtered through the tree to collect counts of each class label at the leaf nodes. To classify an individual, its data is passed through the tree until a leaf node is reached. The individual is classified as the class with the highest count at the leaf node. To privatize the classifier, laplacian noise is added to the counts.

An of ensemble of these random trees is used to increases the robustness of the classifier. The counts are added up from each individual tree and the highest sum is used to classify a data point.

In the case of the 1000 genomes data, the features of an individual were based on the SNPs at certain locations in the genome that were informative of their ancestral population [ref]. The data in the paper (~20) had relatively fewer features than our dataset (~180). This caused the RDT ensembles to produce poor classification results. To improve the results, PCA was run on the data to product features that were more informative.

Building an ensemble of trees of the top 40 principal components with a maximum height of 10 seemed to produce the best results with an accuracy of 74.48. Adding noise with a very low epsilon of 0.0001 reduced the accuracy to 22.32 while an epsilon of 0.15 only reduced the accuracy to 65.83.

```
                  mean        std
              accuracy   accuracy
ncomponents         40         40
ntrees              10         10
max_h               10         10
eps                              
-1.0000      74.484127   3.632744
 0.0001      22.321429  10.616327
 0.0010      21.607143  12.978305
 0.0100      42.480159  10.975078
 0.0200      51.607143   6.281403
 0.0500      63.432540   3.605242
 0.1000      65.793651   2.806267
 0.1500      65.833333   2.841442
 0.3000      67.301587   3.019191
 5.0000      77.202381   1.760838
 10.0000     77.658730   1.530844
 ```

## Accuracy vs epsilon

We experimented the effect of  **_e_** and **_d_** over the accuracy
of ID3 classification. At each particular setting of **_e_** and
**_d_**, we repeated the experiment 40 times and diplayed the results
using a five-number summary(_i.e._ minimum, first quartile, median,
third quartile and maximum).

Overall, the results follow the s-shaped growth. That is, for certain range of **_e_**, the accuracy grows dramatically(_e.g._ 0.15 to 1.0 when depth is set to 30). Increasing or decreasing the **_e_** values beyond that range does not significantly effect the accuracy level. 

<table style="text-align:center; display: inline; width=100%">
<tr>
<td><img src='{{ site.url }}/img/posts/distributed-privacy-preserving-data-mining/ID3_depth10.png' alt="ID3; Depth 10"></td>
<td><img src='{{ site.url }}/img/posts/distributed-privacy-preserving-data-mining/ID3_depth30.png' alt="ID3; Depth 30"></td>
</tr>
<tr>
<td><img src='{{ site.url }}/img/posts/distributed-privacy-preserving-data-mining/ID3_depth60.png' alt="ID3; Depth 60"></td>
<td><img src='{{ site.url }}/img/posts/distributed-privacy-preserving-data-mining/ID3_depth90.png' alt="ID3; Depth 90"></td>
</tr>
</table>

As expected, the accuracy level is also effected by **_d_**. For
some fixed **_e_**, increasing **_d_** to significantly high values
causes small privacy loss budget to be allocated to each query and
hence high amount of noise to be added to each query results. This
causes low accuracy achieved at most of the **_e_** settings but
when **_d_** is set to relatively very low value (_e.g._ **_d_** =
5) constructs highly generalized model and hence an underfit to the
data.

## Adverarial model

While differential privacy backed by formal proof seems a perfect
solution, the choice of **_e_** still makes the proper application
of differential privacy in practice difficult. For example, adhering
to a jurisdiction's privacy law, the goal of a data curator is to
achieve the privacy to the level that no data participant is
individually identified. Interpreting the values of  **_e_** to
achieve this goal in different data summaries is not simple yet
important. Note that setting **_e_** to singificantly low values
may be required in a number of scenarios but not always a panacea
since it also controls the accuracy with which a data analysis can
be made and hence may leave the data over-protected but useless at
the same time for any research purposes.

CanDIG supports the choice of **_e_** for proper privacy protection
by interpretating it in a more meaningful way thereby assuming the
presence of a very strong adversary [ref] who has access to a dataset
**_D_** consisting of **_|D|_** records. Consider a study in which
**_|D|-1_** of the individuals participated. Let the prior beliefs
of the adversary about the participance of an individual on the
study is **_1/|D|_**. That is, the absence of an individual in the
study is equally probable. Given the noisy results of the study,
the adversary may learn that some of the individuals are less likely
to participate in the study than others. Our goal is to choose
**_e_** in a way that the associated disclosure risk about the
participation of an individual is upper bounded by a pre-specified
threshold **_B_**.

