CanDIG Variant Search 

Francis Nguyen
March 2, 2023
An overview of CanDIG's ingestion and search of genomic variant data.
One figure from below chosen as a primary figure

---
layout: blogpost
title: CanDIG Variant Search
summary: An overview of CanDIG's ingestion and search of genomic variant data.
image: img/posts/variant-search/search.png
author: Francis Nguyen
date: 2023-03-02
---

## Introduction – Genomic Variants

Genomic variants are differences from one genome to the next. These variants can take multiple forms, from modifications to a single nucleotide, or the deletion, insertion, copying, translocation, inversion, etc. of entire segments. While a genomic variant can technically be relative to anything, in human genetics we generally talk about genomic variants in one of two contexts:
1. comparison between an individual or groups of individuals to a Genomic Assembly, for example GRch38.
2. comparison between the genome of tumour tissue to normal tissue.

These genomic variants are important to study because combinations of them have been implicated in poorer patient prognosis. Genomic risk factors, such as the ones found in 23andme reports, are found by assaying for known variants (usually SNPs).

Part of what CanDIG wants to enable is making sure genomic data that is collected by the Marathon of Hope Cancer Centres Network (MoHCCN) is available to researchers.

## Data Discovery
CanDIG is a data discovery platform, which means that rather than being interested in just being a store of information, we're aiming to enable institutions and consortia to share information to the people that can make use of them. Moreover, CanDIG is deployed at sites, rather than being a centralized store. This allows each local site team to make accessible whatever data they choose for querying and analysis within the federation of CanDIG servers. Due to this federated approach to deployment:
1. Researchers can still find if there are patients that fit their criteria by asking the federation
2. Hospitals have full control over their own databases
3. Patients can ensure that their data is only used according to the data release policies they have signed off on.

GA4GH's Beacon protocol, which propagates queries (such as whether or not there is a specific nucleotide at a specific region on someone's genome) across a variety of sites that implement Beacon, and receive back everybody that matches. CanDIG implements parts of this Beacon protocol in a performant manner.

## Data Ingestion
Currently, HTSGet ingests data by creating Data Repository Service objects for each ingested file, which contains metadata about the data for future lookup. Firstly, we start by considering the entire genome as 10kbp bins, for easier lookup. With the genome being 3.2x10^9 bp in the hg38 assembly, we only have to consider 3.2x10^5 bins, which is a good size for our index. Both these indexes and a mapping for each ingested file's header to its associated file are stored in a SQLite database.

Suppose we have a region of the genome, and two VCFs containing SNVs at those locations like the following figure:


<Center>
![](/img/posts/variant-search/ingest-1.png)
</Center>

Since we use 10kbp bins, we create indexes for each SNV along those bins, like so:


<Center>
![](/img/posts/variant-search/ingest-2.png)
</Center>

This index of bins->VCF, and the headers for each VCF, is now stored in the SQLite database for easier retrieval.

## Data Search

When a search comes in, we:
- Transform the searched region into buckets, like above
- Check which files contain an entry in each of those bucketes
- Run `pysam` to grab only the parts of the VCF files that are relevant
- Postprocess those files for the Beacon protocol using the headers for each file, which were also stored in SQLite

Suppose we have a request for a region covered by one of the VCFs above. First, this request is transformed into bins, and we search the index for each file covered by those bins:

<Center>
![](/img/posts/variant-search/search.png)
</Center>

From the indexes, we know that PatientA.vcf has variants in this region. We can then grab the relevant segment via `pysam`, and combine with header information for the metadata.

## Frontend
Two sections to the frontend. A summary landing page:

And a search page. There are many features to this search page:
- A sidebar to filter results, similar to how other genomics sites allow you to filter data, passing these queries to the backend to obtain a paginated list on the frontend.
- Data privacy is also respected -- if a researcher does not have the credentials necessary to view the patients, counts are returned instead.
- As we implement the GA4GH HTSGet protocol, we are interoperable with software that can interface with it (e.g. IGV viewers)

## Conclusion
Genomic variants are variations in the genome that can be of interest to researchers. CanDIG allows researchers to find genomic variants of interest in a performant manner, using binning and indexes to speed up searches over the entire genome. These searches are supported by a frontend that shows the data privacy aspect of CanDIG, and implements GA4GH HTSGet.

Do you have any questions? Feel free to contact us at
info@distributedgenomics.ca or on Twitter at @distribgenomics.



