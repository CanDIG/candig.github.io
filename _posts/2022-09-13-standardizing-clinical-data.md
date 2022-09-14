---
layout: blogpost
title: Data Pipelines - CanDIG’s Approach and Best Practices
summary: Addressing the heterogeneity in standards for clinical data sharing
author: Javier Castillo-Arnemann
date: 2022-09-14
---

## Challenges in creating clinical data standards

When working with any kind of data creating a model is fundamental to facilitate its querying and analysis. A data model explicitly separates the data into discrete entities, defines the relationships between them, and enables standardization when compiling data from different sources. Since a model will never capture reality fully, one must make compromises when creating a standard data model, depending on the analysis goals and research questions.

Creating data models for biological processes is particularly difficult since they involve thousands of entities (mRNAs, proteins, signalling molecules, etc.) interacting with each other in real-time, within and across cells. Cancer is a particularly complex and heterogeneous disease, and its study is constantly evolving and expanding. This adds another layer of complexity when creating data standards for it. In a clinical setting, the complex molecular underpinnings of cancer are abstracted into “bigger” entities such as tumor types and stages in order to sort patients and expedite their treatment, an example of the necessary compromises made when creating data models. 

In addition, a good clinical data standard must translate the  natural-speech of a clinician into the rigid computer-speech of coding systems while minimizing the loss of meaning, a concept called semantic interoperability. Due to this complexity, there is still no single gold standard for clinical cancer data, and CanDIG’s data translation pipeline currently employs both the [mCODE](https://confluence.hl7.org/display/COD/mCODE/) and [ICGC-ARGO](https://www.icgc-argo.org/) models, resulting in some data loss during each translation step. 

<br>

<Center>

![](/img/posts/standardizing-clinical-data/xkcd_standards.png#center)

Source: [xkcd](https://xkcd.com/)
</Center>

## CanDIG hosts genomic and clinical data to enable Canada-wide cancer research

[CanDIG](https://www.sciencedirect.com/science/article/pii/S2666979X21000409) is an initiative to enable federated access and analysis of genomics and clinical data to facilitate pan-Canadian research, currently focused on cancer data. As of now, it involves research centers in Canada’s three most populous provinces (Ontario, Quebec and British Columbia) and hosts data for five pan-Canadian projects.
 
CanDIG hosts genomic and clinical data since both are fundamental for cancer research. Genomic data refers to the sequencing results where the mutations that arise in cancer can be detected, while clinical data relates to the patient’s diagnosis, treatment, and so on. Most research questions involve a combination of genomic and clinical data, where certain mutations or genomic regions are correlated with clinical data, such as tumor types and treatment outcomes. For instance, “which mutations (**genomic**) are the most common in a certain cancer type (**clinical**)?” or  “which treatments (**clinical**) were most effective for patients with a certain mutation (**genomic**)?” are two examples of common cancer research questions, both of which specify the type of data needed to answer them. 

While genomic data is processed automatically through pipelines and using standard file formats, clinical data is often the result of manual entry and thus inconsistent and incomplete, especially when considering the multiple clinical and research sites that CanDIG data is sourced from. This heterogeneity in clinical data complicates querying and analysis since not all datasets contain the same information.

## Recommendations for clinical data management in CanDIG

Regardless of which data model is used, these are some guidelines to address the heterogeneity in clinical data, streamline our clinical data translation pipeline, and enable powerful search queries for CanDIG users:

- Discuss with researchers, clinicians, data custodians and developers to define a set of required data fields that must be included and complete for clinical data to be loaded into CanDIG, taking into account common analysis and research questions. 
- Record these fields in a specification document that we can share with data custodians, who would then ensure these data are included.
- Develop a set of software tools to translate and standardize clinical data across cohorts and quantify how much data is lost during translation. For more details on this process, read [Niharika's blog post](https://www.distributedgenomics.ca/posts/data-pipelines-candig-approach-and-best-practices/).

## Final thoughts

It is important to note that these issues are well-known in cancer research and not unique to CanDIG. The ongoing revolution in sequencing technologies has resulted in massive amounts of data, and the current challenge lies in organizing, analyzing and integrating it.

>*“There are currently no mechanisms to standardize the complex analyses, or efficient mechanisms for data sharing for cancer that will enable composite and pooled analyses of data from around the world.”*

>-[ICGC-ARGO](https://www.icgc-argo.org/)

This is why working on CanDIG is so exciting - we get to contribute to this effort and attempt something that has never been done before, enabling cancer research across Canada that will hopefully save lives and further our understanding of this complex disease.

Do you have any questions? Feel free to contact us at [info@distributedgenomics.ca](mailto:info@distributedgenomics.ca) or on Twitter at [@distribgenomics](https://twitter.com/distribgenomics).

