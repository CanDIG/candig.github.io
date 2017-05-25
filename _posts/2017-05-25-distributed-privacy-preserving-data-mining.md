---
layout: page
title: Distributed privacy preserving data mining
---

# Distributed privacy preserving data mining


## Motivation
While de-identification by removing explicit identifiers is the first step that we take towards the privacy protection, we consider the cases when the approach may fail to provide the sufficient level of protection specifically when records associated to the individuals contain characteristics or combinations of characteristics that are rare if not unique and make them identifiable even in the large crowds and even in the cases when data query responses are restricted to aggregate statistical results only.

CanDIG provides an additional layer of privacy that enable to perform different data analyses in a privacy-preserving way. CanDig does that by the implementing the notion of differential privacy. That is, to learn as much as possible about a group while learning the minimum possible at the individual-level. 

With differential privacy, a data user can perform analyses collectively over the available data in a way that lets him glean useful notions about the associated group of individuals as a whole. But anything about a single, specific one of those participants can’t be learned.

CanDIG extends the privacy-preserving solution in two ways. First, it facilitates the choice of **_e_** thereby supporting the use of differential privacy in practice. Second, it supports privacy-preserving data analyses in distributed settings. This is an important requirement in modern biomedicine research since data collected at one site are usually sparse and insufficient to draw significantly reliable scientific conclusions. CanDIG ensures that the required level of privacy be achieved when  analysis be performed collectily over the data partitions residing distributively.   

## Why Differential Privacy
Because it is future proof. Backed by a formal proof, Differential Privacy gives a specified level of assurance that no participant of a data analysis will be affected in privacy perspective irrespective of what other datasets, studies, or information sources are or will become available in future. This also implies that sensitive data can readily be made available for useful analysis without such practices as data usage agreement or data protection plans.      

Given a randomized computation **_M_**, Differential Privacy requires that the change in the probabilities that any given output is produced using a given input and by its neighbouring datasets (construced by adding to or removing a record from the input dataset) is at most a multiplicative factor **_e_**. In other words, the ratio of the probabilities that **_M_** produces a given output when an individual opts in or out of a study is upper bounded by **_e_**. The probabilities are taken over random choices made by **_M_**. 

The parameter **_e_** gives a way to precisely control and quantify the privacy loss guarantees. Lower the **_e_** causes stronger privacy guarantees as it limits the effect of a record  on the outcome of the computation and hence may produce the output with lower accuracy level. This leads to to the fact that the choice of **_e_** is cruicial but not trival since $\epsilon$ is taken in the context of a relative quantification of privacy and does not easily relate to an absolute privacy measure in practice. 

CanDig implements differentially privacy in simple low-level computational constructs that require a data access. This allows the privacy loss over multiple computations be quantified and hence complex data mining can be made in a privacy-preserving way. These data accesses are carried out using laplace mechanism. A laplace mechanism computes the original results from given input and adds random noise from 0-centered laplace distribution. The scale of the distribution is determined by the sensitivity of the computation (i.e. the maximum amount by which the original output changes when a computation is performed over a dataset and a neighbouring dataset) and by the choice of privacy settings **_e_**.    

## Classification

(reference to the paper we're using)

### ID3

### Random Forst

## Accuracy vs epsilon

## Adverarial model

## Accuracy vs Privacy

## References
