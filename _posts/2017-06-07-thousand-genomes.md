---
layout: page
title: Federated Analysis of the Thousand Genomes Project
subtitle: Reproducing Classic Analyses on the CanDIG Platform
author: Jonathan Dursi
date: 2017-06-07
---

<img src="{{ site.url }}/img/posts/thousand-genomes/original-figures.png" alt="Original Figures" width="50%" style="float:right;">

The [thousand genome project](http://www.internationalgenome.org)
was an early large-scale population genomics project which sequenced
2,504 individuals from a broad range of regions and ancestries,
with aligned reads and called variants being made publically
available.  The resulting populations included some now-classic
figures in population genetics, such as those shown to the right.

Here we describe our process of reproducing this analysis of
important, public, moderately sized data sets with well-understood
characteristics, but now across a partitioned, federated set of the
data.  Our aim is to demonstrate that we can perform a wide range
of federated analysis over vertically-partitioned data sets located
across Canada.

### Preparation of data

To federate the data, we randomly partitioned the individuals in the 
thousand genome VCFs into three equal sets, and partitioned the
VCFs themselves correspondingly.  We then removed any variants 
from each of the partitions that were note observed within that partition,
as they would have no reason to be listed absent any observations
in the local data; this ensure swe have to do realistic bookkeeping
to merge the data sets.

We then stood up GA4GH read and variant servers across Canada (Ontario,
Québec, and British Columbia) atop these data sets.

### Genotype matrix API

When performing the analyses over the GA4GH API (using the nice
[Python API](http://ga4gh-server.readthedocs.io/en/stable/demo.html))
we found that querying the calls data has been prohibitively slow.  In
particular, querying variants with a large callset takes a long
time. 

Testing revealed that for 900 calls, it would took ~10s to retrieve
50 variants. To find the cause, a profiler was inserted into the
GA4GH Flask server. The majority of time was spent in the convertVariant
function. This function converts the variants from pysam objects
to google protocol buffer (protobuf) messages. This process creates
millions of small objects that takes a long time to process when
querying a large callset. 

Querying variants can be sped up by a factor of 4 by making modest
changes to the GA4GH client and server &mdash; by using the C++
version of protobuf, and by using protobuf serialization rather than
serializating into JSON, and these changes have been contributed
back to the project.

However, more substantial performance wins can be made by reconsidering
how per-call (or even per-variant) data is stored and accessed
within the schema. Another performance gain of 12x was achieved by
implementing a separate API call to directly return a genotype
matrix (which can be viewed
[here](https://github.com/ljdursi/ga4gh-server/tree/genotypes) ).

