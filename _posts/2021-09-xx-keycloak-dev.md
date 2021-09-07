---
layout: blogpost
title: Keycloak - Our Journey on How to Contribute to the Project
summary: Contributing to Keycloak has its own unique steps and challenges. Here is what we learned by contributing to Keycloak's codebase.
image: 
author: Dashaylan Naidoo
date: 2021-09-xx
---

## Keycloak Overview and Our Usecase

[Keycloak] is an opensource identity and access management solution.  Some of the features that it provides out-of-the-box are easy deployment of application authentication, single-sign on, identity brokering from various sources like social media applications, user federation by creating a facade for LDAP, Active Directory etc., and all of this using standard protocols like SAML, OpenID Connect (OIDC) etc.

CanDIG uses Keycloak (one deployment on each site in a project), to create a uniform interface for authentication infrastructure.  This helps alleviate the issue of supporting a variety of authentication infrastructures.  This uniformity allows CanDIG instances in a project to ask for authentication and authorization for an incoming request, from the appropriate site.

CanDIG uses OIDC and its related tokens to achieve the authentication and aurhorization in a distributed style.  This is a critical usecase for CanDIG.  CanDIG's authentication and authorization infrastructure (AAI) implementation extends OIDC by using the Global Alliance for Genomic Health (GA4GH) standard.  GA4GH defines the claims carried within the OIDC token (renamed Passport in the GA4GH spec) that help with upstream authorization.  Any claim in the JSON Web Token is merely a key-value pair within its payload section.

## The Roadblock

While the OIDC allows to create custom claims, it does not impose any limit on the size of the fields.  To make the claims and their values self-sufficient, the GA4GH standard decided to add relevant details like cryptographic keys etc., which make the claim values large.  At the same time, the value can also be a list of values for a particular claim key.  This makes them even larger, depending on how many values are in the list.

As noted in the last section, for CanDIG to work as a distributed and federated system, it needs to have a facility to check for authorization.  The core of that is checking for these Passports and claims within them.  This passport comes from an OIDC defined endpoint called "`userinfo`".

<DIAGRAM: User access>

In Keycloak, the said `userinfo` endpoint was not working.  When a user goes through logging in via their own site in a CanDIG federation project to access a resource on another site, this `userinfo` endpoint was not being called by the Keycloak on the foreign site to fetch the details of the user.  In other words, the authorization information was missing and no access was given even though this user may have been allowed some access.

<SCREENSHOT: User profile settings in Keycloak>

The screenshot above shows that even if the toggle to Disable User Info is off, the `userinfo` endpoint was still never called.

### JIRA, GitHub










[Keycloak]: https://www.keycloak.org/