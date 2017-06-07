---
title: Choosing a Container Solution for CanDIG
title: Docker or rkt or Singularity, Oh My!
layout: page
date: 2017-06-04
category: infrastructure
---

An important part of our [architecture](/architecture.png) is the
ability to run specified bioinformatics tasks against data sets;
but this requires the ability to bundle up these tasks and distribute
them across potentially quite heterogenous sites.

There are many different possibilties for such an approach:

* Containers (Docker, rkt, LXC, Singularity, Intel Clear Containers)
* VMs
* Application packagers (AppImage, Snappy)

To weigh these options, we conducted a simple [Benchmark](https://github.com/CanDIG/images_bakeoff);
a crude remapping pipeline taking reads from GRCh37 to GRCh38, then measuring coverage in specific exons.
This benchmark allows us to examine:

* Different tools: samtools, BWA, picard 
* Different performance bottlenecks: disk throughput, disk IOPS, mem throughput
* Different execution types: simple executables, chained executables, large JAVA application

We were benchmarking performance, but also maintainability, security,
composability, and infrastructure needed on sites to support.

<img src="{{ site.url }}/img/posts/containers/benchmarks.png" alt="Performance Benchmarks" width="50%" style="float:right;">

VMs were quickly ruled out as an awkward fit for our use case, that
of running one of a very large number of specific, discrete, typically
short-running tasks against single data sets.  Similarly, most
application packagers are very desktop-focussed, requiring installation
in some sort of local repository &mdash; an uncomfortable fit for
our system of likely more transient nodes.

Among container options, most performed roughly equally well; there
was a slight startup penalty (and perhaps a very slight IOPS overhead)
for docker or rkt run with typical isolation; otherwise, and
particularly for long-running tasks, performance results were roughly
identical.

For maintainability and composability, most of the container options
were similar; all allow ready automation at the level we need, and
transparency as to the content of executables, library versions,
etc.

The main differences came down to isolation.  In our regime &mdash; 
where tasks will be running as unprivledged users in sandboxes, with
only (authenticated) API access to data, container-level isolation 
is not particularly important to us.  In that case, the need for
privledged users running support daemons for Docker is likely too 
high a price to pay for the very nice tooling available, especially
with open container standards making most of that tooling available
to other container types.

Rkt does not have those same requirements, and more readily allows 
the turning up or down of isolation levels for containers, all the way
down to simply running chrooted executables, which is the regime where
Singularity plays.

In the near term then, we'll be using docker as some of our components
still require it, but we anticipate moving to Singularity (with rkt as a backup)
in the near future.
