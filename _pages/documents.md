---
title: Documents and Presentations
layout: page
permalink: documents.html
---

### Presentations

#### HPCS 2017 Presentation: [PDF]({{ site.url }}/img/docs/CanDIG-HPCS2017.pdf)

Tackling the “wicked problems” of cancer and rare diseases against
the already complex landscape of human biology requires health
researchers to have access to as much health and genomic data as
possible in order to see connections and test hypotheses. While a
torrent of genomic data is now being produced at sites across Canada,
accessibility to researchers means more than having it sit on a
disk somewhere with the right permission bits set.  It has to be
discoverable, analyzable, available, and linked to vital metadata
for it to be useful in improving human health.

 In this talk we present the Canadian Distributed Infrastructure
 for Genomics (CanDIG), a fully distributed platform that allows
 national-scale, privacy-maintaining analyses of locally-controlled
 data sets. CanDIG is a CFI Cyberinfrastructure-funded project with
 initial sites at the HPC4Health consortium in Toronto, the McGill
 University and Genome Quebec Innovation Centre (MUGQIC) in Montreal,
 and Canada's Michael Smith Genome Science Centre (GSC) in Vancouver.
 With participating members including the top generators of genomic
 data for Canadian patients, CanDIG will serve as a foundational
 platform for all of these institutions collaborative ventures,
 with a long-term goal of extending data sharing to a wider base
 of researchers across Canada.

  The CanDIG platform represents a new approach to sharing sensitive
  genomic data between multiple providers. By moving computation
  to the data, we enable truly national-scale analysis of private
  health data in Canada, where provincial health data privacy
  protections can make it difficult for clinical data to leave the
  province it was collected in.   privacy protections built in  from
  the very beginning, we make it easier for health data stewards
  to justify allowing their data to be part of some remote analyses.
  Granular control of the amount of data and information being
  released, and to whom, is a fundamental part of the overall design.
  Our efforts build on and contribute back to the efforts of the
  international Global Alliance for Global Health (GA4GH,
  http://genomicsandhealth.org), using standardized RESTful APIs
  for data access to provide interoperability with a wide range of
  tools, and web-era authentication and authorization standards
  (OpenID Connect and UMA) to ensure privacy and security of all
  data.

   In addition to illustrating our architectural approach for CanDIG,
   we will also show results from two early projects building upon
   our infrastructure. First, we will demonstrate an analysis of
   the Thousand Genomes dataset; we reproduce existing results using
   a federated and privacy-improving approach to the initial analyses,
   and extend it by introducing privacy-preserving data mining
   approaches.  Secondly, we will show the implementation of our
   remote analyses tool chain, and discuss our examination of several
   container-like frameworks and the running of remote tasks.

