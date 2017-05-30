---
layout: page
title: Distributed privacy preserving data mining
---




## Motivation
While de-identification by removing explicit identifiers is the first step that we take towards the privacy protection, we consider the cases when the approach may fail to provide the sufficient level of protection specifically when records associated to the individuals contain characteristics or combinations of characteristics that are rare if not unique and make them identifiable even in the large crowds and even in the cases when data query responses are restricted to aggregate statistical results only.

CanDIG provides an additional layer of privacy that enable to perform different data analyses in a privacy-preserving way. CanDig does that by the implementing the notion of differential privacy. That is, to learn as much as possible about a group while learning the minimum possible at the individual-level. 

With differential privacy, a data user can perform analyses collectively over the available data in a way that lets him glean useful notions about the associated group of individuals as a whole. But anything about a single, specific one of those participants can’t be learned.

CanDIG implements the extension of differential privacy in two ways. First, it facilitates the choice of **_e_** in a more meaningful way thereby simplifying the application of differential privacy in practice. Second, it supports privacy-preserving data analyses in distributed settings. This is an important requirement in modern biomedicine research since data collected at one site are usually sparse and insufficient to draw significantly reliable scientific conclusions. CanDIG ensures that the required level of privacy be achieved when analysis be performed collectily over the data partitions residing distributively.   

## Why Differential Privacy
Because it is future proof. Backed by a formal proof, Differential Privacy gives a specified level of assurance that no participant of a data analysis will be affected in privacy perspective irrespective of what other datasets, studies, or information sources are or will become available in future. This also implies that sensitive data can readily be made available for useful analysis without such practices as data usage agreement or data protection plans.      

Given a randomized computation **_M_**, Differential Privacy requires that the change in the probabilities that any given output is produced using a given input and by its neighbouring datasets (construced by adding to or removing a record from the input dataset) is at most a multiplicative factor **_e_**. In other words, the ratio of the probabilities that **_M_** produces a given output when an individual opts in or out of a study is upper bounded by **_e_**. The probabilities are taken over random choices made by **_M_**. 

The parameter **_e_** gives a way to precisely control and quantify the privacy loss guarantees. Lower the **_e_** causes stronger privacy guarantees as it limits the effect of a record  on the outcome of the computation and hence may produce the output with lower accuracy level. This leads to to the fact that the choice of **_e_** is cruicial but not trival since $\epsilon$ is taken in the context of a relative quantification of privacy and does not easily relate to an absolute privacy measure in practice. 

CanDig supports differentially private data analysis by implementing differentially privacy in simple low-level computational constructs over the data. The low-level queries are made differentially-private using laplace mechanism. A laplace mechanism computes the original results from given input and adds random noise from 0-centered laplace distribution. The scale of the distribution is determined by the sensitivity of the computation (i.e. the maximum amount by which the original output changes when a computation is performed over a dataset and a neighbouring dataset) and by the choice of privacy settings **_e_**.    

This allows privacy loss over the composition of multiple differentially private mechanims be quantified and hence complex data mining can be made with privacy-preserving way. 

## Privacy-Preserving Decision Tree Induction over 1000 Genome Data
For experimentation purposes, we implemented differentially-private decision tree induction algorithms originally presented by Jagannathan _et. al_ [ref] under CanDIG. A Decision tree Induction builds classification or regression models in the form of a tree structure. Given a set of pre-classified instances as input, the algorithm decides which of the so far unused attributes is best to split on, uses the attribute values to split the instances into smaller subsets, and recurses over the resulting subsets until the instances in all subsets have homogenous class attribute values or a pre-specified condition is met. The final result is a tree with decision nodes and leaf nodes representing the attributes used to classify the attribute at the corresponding recursive step and the classification results respectively.

We report our findings over 1000 Genome data. More specifically, we considered the problem of classifying individuals into one of the given ancestral populations based on the single-neucleotide polymorphisms (SNPs). The SNPs overlapping xenobiotic metabolisim and human pigmentation gene regions e.g. TYR, OCA2, DCT _etc._ were considered. It was noticed that not all the SNPs are equally informative and further filteration was therefore performed based on their allele frequencies in each population.   
 
 
### ID3 (Iterative Dichotomiser 3)
ID3 is a classical decison tree induction method. It uses a heuristic that is based around the goal of constructing a tree with the purest possible leaf-nodes but the minimum possible depth. ID3 does that by greedily choosing an unused attribute at each split that leads to the data subsets with maximum purity. The purity is measured using the concept of information gain. That is, the change in the amount of information needed to classify the instances of a current dataset partition, to the amount of information required to classify them if the current dataset partition were to be further partitioned on a given attribute.

We obtained the differentially private ID3 algorithm by replacing original low-level queries over training instances with equivalent laplace mechanisms. **_e_** privacy loss guarantees in the overall tree induction is ensured by taking into account the composibility of these **_e_**-differentially private low-level query functions. Following the observation of Jagannathan _et. al_ [ref], the **_e_**-differentially private queries posed to extend the different nodes at a particular level of the tree takes disjoint subsets of data. Therefore the combined outputs are not more diclosive about an individual than the individual query results and hence gives **_e_**-differential privacy. 

Queries posed at different hierarchical levels use sequential compositition. That is, they operate on the same data and the query functions at particular hierarchical level are composed of the query functions at the previous level. Assume, if the depth of the tree is **_d_** and privacy loss at each level is **_e_** then the overall privacy loss is **_d e_**.           

[Data Ingestion and Federated Distributed Data] (ga4gh)


### Random Forst

## Accuracy vs epsilon

## Adverarial model

## Accuracy vs Privacy

## References
