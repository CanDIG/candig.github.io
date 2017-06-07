---
title: Architecture
subtitle: The Architecture of CanDIG
layout: page
permalink: architecture.html
---

<img src="{{ site.url }}/img/pages/architecture/arch1.png" alt="CanDIG is fundamentally distributed" style="float: right;" width="50%">

Fundamental to CanDIG is national scale analysis, but over
locally-controlled data.  Our platform is completely distributed,
with no central infrastruture to maintain or secure.  But atop
that, researchers need to be able to readily discover, access, and analyze 
this information, possibly jointly across sites, while allowing 
the data stewards to ensure the security and privacy of their data.

We do this by building on established or in-progress projects elsewhere such as
[OpenID Connect](http://openid.net/connect/) and [Keycloak](http://www.keycloak.org)
for authentication and the [GA4GH](http://genomicsandhealth.org) (Global Alliance
for Genomics and Health) APIs and schemas for genomic data and genomic data
exchange.

### API-based data access

<img src="{{ site.url }}/img/pages/architecture/api-access.png" alt="All Data Access is API-based" style="float: right;" width="40%">

In the CanDIG platform, _all_ data access, even local, is API based;
that is, there's no processes which are let loose on directories
of data files.  This allows us several advantages:

* Abstraction of back-end data stores; we have many sites which may store data differently, and if the variants (for instance) are stored in databases, there may be no files to access
* Fine-grained logging and auditing
* The potential for fine-grained authorization (does the level of data access allowed depend on the amount of data access?)

We are making use of the GA4GH APIs for data (and metadata) access, with a thin CanDIG layer on top, which we will use for

* Protyping and implementing richer queries (`select ... WHERE ...;`')
* Our own authorization and authentication mechanisms
* Privacy mechnaisms like differential privacy
* Federation of queries

<img src="{{ site.url }}/img/pages/architecture/TES.png" alt="Task execution" style="float: left;" width="33%">

The API accesses against any particular dataset can be simple queries
(&ldquo;please tell me how many individuals have this particular
variant in this data set&rdquo;) or running longer-lived tasks,
which must be scheduled and require a particular executable.  For
this we are making use of the GA4GH [Task Execution Schemas](https://github.com/ga4gh/task-execution-schemas)
and implementations such as [Funnel](https://github.com/ohsu-comp-bio/funnel).

Doing this requires the bundling and distribution of CanDIG-blessed
images for fundamental bioinformatics tasks.  We have examined various
container and VM approaches for executing these discrete tasks; while
we are proceeding with Docker comtainers in the short term, in the
medium term we will be moving to [Singularity](http://singularity.lbl.gov)
or [rkt](https://coreos.com/rkt/docs/latest/) which allow us to have
what we need (application bundling, no system-wide root daemons) without
what we don't in our context of unprivledged users and sandboxes (container-level isolation).

### Authentication

<img src="{{ site.url }}/img/pages/architecture/oidc.png" alt="OpenID Connect" style="float: right;" width="15%">

For authentication, we are using best-practices for RESTful API
authentication, such as OpenID Connect, using tools such as Keycloak.
As the project involves, we anticipate using
[UMA](https://en.wikipedia.org/wiki/User-Managed_Access) (User
Managed Access) for federated, role-based authorization.


