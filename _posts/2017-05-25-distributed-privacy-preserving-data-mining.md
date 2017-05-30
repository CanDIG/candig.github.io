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

CanDig implements differentially privacy in simple low-level computational constructs that require a data access. This allows the privacy loss over multiple computations be quantified and hence complex data mining can be made in a privacy-preserving way. These data accesses are carried out using laplace mechanism. A laplace mechanism computes the original results from given input and adds random noise from 0-centered laplace distribution. The scale of the distribution is determined by the sensitivity of the computation (i.e. the maximum amount by which the original output changes when a computation is performed over a dataset and a neighbouring dataset) and by the choice of privacy settings **_e_**.    

#### Parallel and Sequential Composition 
As mentioned earlier, Data mining algorithms are made differentially privacy by using the results from multiple low-level differentially private queries thereby adding random noise from laplace distribution to each query but in order to ensure that the final output of a data mining task achieves no less than specified privacy loss **_e_**, we must consider if there is any co-relation among multiple queries under a data mining task. CanDIG ensure the privacy guarantees over a complex data mining task by considering the co-relation among queries.     

Here, we define that any two queries (not necessarily identical) are co-related if their outputs produced are contributed partially or completely by overlapped data subsets. In such cases, the combined output of the queries may be more disclosive than the privacy loss due to the output of each individual query. We follow sequential composition theorem. Consider a data mining task involving two co-related queries **_q<sub>1</sub>_** and **_q<sub>2</sub>_** producing output with privacy loss **_e<sub>1</sub>_** and **_e<sub>2</sub>_** respectively. The output produced by the mining task is **_(e<sub>1</sub>+e<sub>2</sub>)_**. So generally, if a data mining involves **_k_** such queries then to produce **_e_**-differential private output, each query must achieve **_e/k_**. This shows that the data mining tasks  
involving large number of co-related queries require large amount of noise to be added to each query and hence may result in significance accuracy loss. 

We reserve the term unrelated for any two queries if the outputs by them are from two disjoint data partitions under a data analysis task. The output produced by the data analysis task in such cases gives the privacy loss equal to the maximum of the privacy loss achieved by any of the individual queries. For example, assume that **_q<sub>1</sub>_** and **_q<sub>2</sub>_** are unrelated and produce output with privacy loss **_e<sub>1</sub>_** and **_e<sub>2</sub>_** respectively. The output task will achieve **_max(e<sub>1</sub>, e<sub>2</sub>)_** 

## Privacy-Preserving Decision Tree Induction over 1000 Genome Data
For experimentation purposes, we implemented differentially-private decision tree induction algorithms originally presented by Jagannathan _et. al_ [ref] under CanDIG. A Decision tree Induction builds classification or regression models in the form of a tree structure. Given a set of pre-classified instances as input, the algorithm decides which of the so far unused attributes is best to split on, uses the attribute values to split the instances into smaller subsets, and recurses over the resulting subsets until all training instances are categorized or a pre-specified condition is met. The final result is a tree with decision nodes and leaf nodes representing the attributes used to classify the attribute at the corresponding recursive step and the classification results respectively.

We report our findings over 1000 Genome data. More specifically, we considered the problem of classifying individuals into one of the given ancestral populations based on the single-neucleotide polymorphisms (SNPs). The SNPs overlapping xenobiotic metabolisim and human pigmentation gene regions e.g. TYR, OCA2, DCT _etc._ were considered. It was noticed that not all the SNPs are equally informative and further filteration was therefore performed based on their allele frequencies in each population.   
 


(reference to the paper we're using)

### ID3 (Iterative Dichotomiser 3)
ID3 is a classical decison tree induction method. It uses a heuristic that is based around the goal of constructing a tree with the purest possible leaf-nodes but the minimum possible depth. At each split, it chooses an attribute that leads to the data subsets with maximum purity. The purity is measured using the concept of information gain. That is, the change in the amount of information needed to classify the instances of a current dataset partition, to the amount of information required to classify them if the current dataset partition were to be further partitioned on a given attribute.  
- highlight the steps where differential privacy is required. 
- How data was ingested (over distributed sites using ga4gh)
- The steps of how differential privacy was achieved.


### Random Forst

## Accuracy vs epsilon

## Adverarial model

## Accuracy vs Privacy

## References
