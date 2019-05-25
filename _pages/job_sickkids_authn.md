---
title: Backend and OIDC Developer
layout: page
permalink: job_sickkids_authn_mar2019.html
sitemap:
  priority: 1.0
  changefreq: 'weekly'

---
# Backend Developer, Services and Authentication/Authorization, SickKids (Toronto)

## Background information: CanDIG

The CanDIG project is building a federated solution for analysis of
privacy-sensitive, distributed human genomics data sets. Sites maintain
control over their data while permitting small queries to them, or
analysis pipelines to be run on them. CanDIG works with the
international standards-setting organization GA4GH to make sure that we
are as interoperable as possible with other large-scale genomics and
health projects, and that we are following the rapidly evolving best
standards in health genomics, both technically and for policies.

We’re moving away from a prototyping, proof-of-concept phase, towards
building a 12-factor application for genomic data, and a federation
layer on top of it. As part of this project, we will be standing up a
number of services - where possible, using and shaping existing
standards, but where necessary, developing our own. Principles of our
approach are:

**Distributed**: All data, and all infrastructure, is completely
distributed; no shared or centralized services. All coordination is done
at the level of policy, protocol, or software development

**Local Control**: Consistent with common governance and policy, local
data providers have complete control over access to their data, and
auditability/observability into data access and use.

**API based and driven**: Since we are building a platform whose success
hinges on interaction between users and multiple sites, new development
will rely on API-first design using Swagger/OpenAPI, with APIs developed
and documented, and services and clients built on this. This ensures
documentation of the APIs, interoperability between clients, and
alignment with GA4GH efforts. Most of our development is in Python, with
some (and hopefully more) in Go.

**Secure and Private**: Our goal is to support privacy-sensitive
(although not directly identifying) human health data, where privacy and
security lapses would be catastrophic for the project and potentially
damaging to the patients who have entrusted us with their data. We will
rely on modern authentication and authorization technologies such as
OpenID Connect this secure API-based access to data can be achieved.
Since CanDIG is also fully distributed there is no central
infrastructure to maintain or secure. Privacy-preserving methods such as
differential privacy are being actively investigated for analyses.

**Open Source, Standards-Based**: Wherever possible, CanDIG builds on
existing standards, on matters both technical (OIDC, REST, GraphQL,
MySQL, MongoDB, Docker, etc.) and genomic (via its role as a driver
project for the GA4GH effort). This approach this allows
interoperability as wide as possible, while focussing efforts only where
it matters most and not on re-inventing wheels.

**6-month plans, 2-year horizon**: The genomics landscape is evolving
rapidly, from sequencing technologies to standards to Canadian projects,
so very long planning timelines don't make much sense. We're adopting a
system where we will have 6-month roadmaps guiding our development,
revisited and updated every 3-4 months. Between those updates, we will
begin following standard agile development approaches, with sprints,
backlogs, and regular updates.

While making project plans more than six months out doesn't make much
sense, the size of our team means that anything we build we will likely
be stuck with for some time, so we aim for anything we develop to be
useful and scalable enough to meet our foreseable needs for the next \~2
years. What we expect that means is:

- \~20,000 WGS/WES samples per site
    - \~600M-6B unique germline variants
    - \~60B calls
    - \~600,000 clinical/phenotypic metadata entries, totalling > \~600MB
    - several hundred PB of raw/aligned sequence data (or what we keep of it)
- \~5 sites
- \~100 users/site
- Dozens of projects (the unit of authorization)
- Quite modest query rates (we’ll still be more likely to be measuring inbound queries in units of per hour than per second)

## Background information: This Role

There’s a lot to do in CanDIG, so there’s some flexibility in what
someone taking on this role would work on. The person hired into this
role would own several of the followig projects in their first six months,
working with other members of the team.  The tasks would involve 
solution design, code development, consultation, and testing; the person 
in the job would also be part of international GA4GH workstream meetings
relevant to the tasks to ensure we remain aligned on standards and approaches.

**Interoperable authentication/authorization**: CanDIG is part of the
CINECA project, a Canadian/European/African project for allowing
federated access to data. Part of this will require that our authn &
authz infrastructure is interoperable. While this is greatly helped by
using open standards like OpenID Connect, we must ensure that claims
language, protocols, and services are seamlessly interoperable. This
task would involve both collaboration with our EU and African colleagues
to develop and test such interoperability, and active participation in a
GA4GH workstream to define the standards consistent with that work.

**Extending the authorization service**: By the time you join us, we
will have a simple authorization service implemented in our new back end
infrastructure, likely based on [*Open Policy
Agent*](https://www.openpolicyagent.org) and making use of OIDC tokens
from our current reverse proxy/gateway. There are several avenues we
would like investigate for further development of this service:

-   Implementing finer-grained policies for authorization
-   Moving away from using JWTs and towards opaque tokens for authentication, requiring both changes to our IdP configurations and explicitly maintaining session keys
-   Investigating alternate tools to OPA
-   Investigating use of tools like Vault to manage keys for access to the data stores to further enforce authorization policies

**Self-service DAC portal**: Each science project that houses its data
in CanDIG will have its own data access policies for the data it is
responsible for. We would like the projects’ Data Access Committees
(DACs) to have a portal to manage access to its data; this would mean
managing data that is used by the authorization policy engine to
determine, for instance, role/identity mapping for RBAC. This task would
involve prototyping such a portal, integrating it into our authorization
policy infrastructure, testing it with users, and after iteratiosn
moving it into production.

**Interoperate with Canadian Access Federation**: CanDIG intends to work
with CANARIE technical team to allow use of the [*Canadian Access
Federation*](https://www.canarie.ca/identity/caf/) as an identity
provider. This project would extend previous prototype developed
elsewhere work linking CAFs Shibboleth system to OIDC.

### Topics for discussion at the interview

Below are some questions we are likely to start with, and from there
spend some time going into more details on your answers. We don’t
necessarily expect every person we discuss the job with to have
extensive experience in everything we ask about. There won’t be live
coding exercises, but we probably will ask you to sketch things out on a
whiteboard, and point us to code bases to look at afterwards where
appropriate (and possible.)

Candidates that seem like would be a good match will be asked to a
second interview that will include the PI of CCM, Mike Brudno.

### Questions

What sort of experience do you have with OAuth2/OIDC? With other
approaches for authenticating web-based services?

Walk us through the OIDC authentication process.

Tell us about distributed and aggregated OIDC claims.

What is your current favorite language or framework for the kinds of
tasks described above? Did it replace a previous favourite? What are
some of the tradeoffs?

What sorts of skills or technologies are you looking to learn, or
improve on, over the next couple of years?

We’re moving towards a twelve-factor type application; tell us about
similar things you’ve worked on, and what some of the pros and cons of
such an approach are.

What kind of experience do you have in REST API design? What are some
things you think about when making such a design?

An explicit goal of our project is to interoperate with international
partners via the GA4GH, which means participating in standards meetings,
and trying to converge our APIs to standards (and converge emerging
standards towards our use cases). This means broader applicability of
our tools, but it also means that some technical decision making is out
of our hands. Have you worked in similar situations before? How have you
handled the tradeoffs between interoperability constraints and
flexibility in the past?

Tell us about the tradeoffs between relational and NoSQL approaches for
databases, and when you might consider each. From the *very* brief
discussion of the services above, do you have a sense of where the
different approaches might be sensible?

Talk about a common code quality issue - DRY, consistent code
formatting, what have you - that you have opinions about.

What approaches do you use to make sure the code you write is robust and
high quality? What approaches have you *not* found useful?

Tell us about an tool for standing up servers - ansible, chef, docker,
etc etc - that you have experience with, and opinions about.

Given the relatively small team and the rapid pace of change in the
field, the need for extensibility in technical choices - data modelling,
software development, APIs - looms large. We can’t afford frequent
rewrites, but “keeping our options open” indefinitely isn’t an option
either - we need to make concrete forward progress. Tell us about how
you plan for extensibility in your designs & implementations, and how
you make those tradeoffs.

Tell us about a code development project that you were involved in that
didn’t, on a technical level, end up living up to its initial promise.
What went wrong, and what did you learn from it?

The CanDIG project is a national project, and any given project will
involve communicating, developing, and coordinating with colleagues in
Vancouver, Montreal, and UHN in Toronto; remote collaboration is the
default mode of operation. Tell us about situations where you’ve had to
work with remote colleagues, and what you did to make sure the team
stayed aligned and on track.

