---
layout: blogpost
title: Keycloak - Our Journey on How to Contribute to the Project
summary: Contributing to Keycloak has its own unique steps and challenges. Here is what we learned by contributing to Keycloak's codebase and what prompted us.
image: 
author: Dashaylan Naidoo
date: 2021-09-09
---

## Keycloak Overview and Our Usecase

[Keycloak] is an opensource identity and access management solution.  [Some of the features] that it provides out-of-the-box are easy deployment of application authentication, [single-sign on], identity brokering from various sources like social media applications, user federation by creating a facade for [LDAP], [Active Directory] etc., and all of this using standard protocols like [SAML], [OpenID Connect (OIDC)] etc.

CanDIG uses Keycloak (one deployment on each site in a project), to create a uniform interface for authentication and authorization infrastructure (AAI).  This helps alleviate the issue of supporting a variety of authentication tools and protocols.  This uniformity allows CanDIG instances in a project to ask for authentication and authorization for an incoming request, from the appropriate site much more easily.

CanDIG uses OIDC and its related tokens to achieve the authentication and aurhorization in a distributed manner.  This is a critical usecase for CanDIG.  CanDIG's AAI implementation extends OIDC by using the [Global Alliance for Genomic Health (GA4GH)] [Passports standard].  GA4GH defines the claims carried within the OIDC token (renamed Passport in the [GA4GH spec]) that help with upstream authorization.  Any claim in the token (which is a [JSON Web Token]) is merely a key-value pair within its payload section.

## The Roadblock

While the OIDC allows to create custom claims (the key-value pairs) in the tokens, it does not impose any limit on the size of the fields.  To make the claims and their values self-sufficient, the GA4GH standard decided to add relevant details like cryptographic keys etc., which make the claim values large.  At the same time, the claim value can also be a list of items.  This makes them even larger, depending on how many items are in the list.

As noted in the last section, for CanDIG to work as a distributed and federated system, it needs to have a facility to check for authorization.  The core of that is checking for these Passports and claims within them.  This Passport comes from an OIDC defined endpoint called "[userinfo]".

<figure style="margin-bottom: 1em; margin-top: 1em;">
  <img src="{{ site.url }}/img/posts/keycloak-dev/user-access-userinfo-endpoint.png" 
  alt="Diagram showing the use of userinfo endpoint of the OpenID Connect protocol to fetch the Identity Token." 
  width="95%" style="margin: 10px 10px 10px 10px;">
 <figcaption>Figure 1: Identity Brokering in Keycloak using OpenID Connect's userinfo endpoint to get Identity Token from the user's institute</figcaption>
</figure>

In Keycloak, the said `userinfo` endpoint was not working.  When a user goes through logging in via their own site in a CanDIG federation project to access a resource on another site, this `userinfo` endpoint was not being called by the Keycloak on the foreign site to fetch the details of the user.  As a result, the authorization information was missing and no access was given even though this user may have had valid access.

<figure style="margin-bottom: 1em; margin-top: 1em;">
  <img src="{{ site.url }}/img/posts/keycloak-dev/keycloak-identity-broker-settings-userinfo-toggle.png" 
  alt="Screenshot of the settings page in Keycloak for an Identity Broker with markers to show the userinfo toggle." 
  width="95%" style="margin: 10px 10px 10px 10px;">
 <figcaption>Figure 2: Settings page in Keycloak for an Identity Broker with markers to show the userinfo toggle</figcaption>
</figure>

The screenshot above shows that even if the toggle to Disable User Info is off, the `userinfo` endpoint was still never called.  

## The Fix

[The line that is responsible for this issue](https://github.com/keycloak/keycloak/pull/7214/files#diff-2995cb6221a9b645041bd02ce7963219ec50d440dd6ef46e4f93830b6497b893) is as follows - 

```java
if (userInfoUrl != null && !userInfoUrl.isEmpty() && (id == null || name == null || preferredUsername == null || email == null)) {
```

and the fixed version is -

```java
if (userInfoUrl != null && !userInfoUrl.isEmpty()) {
```

Deleting the unneeded conditional checks was the only thing required to fix this.

## Contributing to Keycloak Codebase

Setting up to a point where we can finally test the changes, add tests, confirm nothing else breaks, and contribute the PR, all of this was the cumbersome part.  This fix needed to be manually checked first and that required setting up two Keycloak servers with the right configuration.

### Reasons Bootstrapping is Tough

* Keycloak has a large suite of tests.  On a personal development laptop, it took about four (4) hours to finish.  
* Codebase is verbose, as is expected with such vast project with object oriented design.
* You have to read and understand quite a few classes if you want to add a new test.  This is required to be able to extend the correct abstract and/or base classes for these tests. For example, for this fix, we added [OidcUserinfoClaimToRoleMapperTest.java](https://github.com/keycloak/keycloak/blob/master/testsuite/integration-arquillian/tests/base/src/test/java/org/keycloak/testsuite/broker/OidcUserInfoClaimToRoleMapperTest.java)

### Broker testing

One detail in this entire story is that fetching `userinfo` internally Keycloak has a feature called [Mappers] which help in mapping or converting the incoming external claims to internal user attributes.  This is important so as to pass the incoming claim to the user's session so that the local application can use those user attributes to make the decisions.

When using the Keycloak's user interface, it is easy to check these mappers, change them and set them.  However, when you have to write unit tests, you need to find a way to do that programmatically and figure out which class to extend.  In this case, the main two classes were - 
* [`AbstractRoleMapperTest`](https://github.com/keycloak/keycloak/blob/master/testsuite/integration-arquillian/tests/base/src/test/java/org/keycloak/testsuite/broker/AbstractRoleMapperTest.java): for the test itself
* [`KcOidcBrokerConfiguration`](https://github.com/keycloak/keycloak/blob/master/testsuite/integration-arquillian/tests/base/src/test/java/org/keycloak/testsuite/broker/KcOidcBrokerConfiguration.java): for creating a broker to be used in the test

Once you figure out the correct classes to extend, your test writing is much more smooth.  Writing tests gives you confidence and makes the maintainers lives easier.  It is to be noted that you may not have to write a ton of tests.  The original PR had ten (10) tests but the maintainers suggested only tests were sufficient because they likely cover the cases that need focus.

You can see the pull request - [KEYCLOAK-14039 - UserInfo claims from external OIDC identity provider are not imported #7214].

## Final Word and Recap

Every opensource project has its peculiarities and it may seem daunting at first.

* To confirm if this is a bug, first open a JIRA ticket on [Keycloak JIRA].  You may have to create a RedHat account.
* Discuss with the maintainers and subject matter experts.
* Once they confirm what they see and there is a path forward to fix things, fork GitHub Keycloak repository and work on it.
* You may have to spend some time reading documentation on how to work with the codebase and write tests.
* Please do write test(s).
* Once done, open a PR.  Follow the discussions and guidelines.
* When your PR is merged, celebrate!

## References

* Talk: [The Keycloak Test Suite - CanDIG Mini-Conference (Chapter 2)] - [Slides for the talk](https://docs.google.com/presentation/d/1ZDuPCpztPiIIRrpE5xc3f6n5nKK6upnXp-lIXNoviWg/edit#slide=id.gb030900e6d_0_10)
* [Keycloak GitHub repository](https://github.com/keycloak/keycloak) 
* [Keycloak documentation on how to run integration test suite](https://github.com/keycloak/keycloak/blob/master/testsuite/integration-arquillian/HOW-TO-RUN.md)
* [Keycloak JIRA]
* Pull request: [KEYCLOAK-14039 - UserInfo claims from external OIDC identity provider are not imported #7214]



<!-- links -->
[Keycloak]: https://www.keycloak.org/
[Some of the features]: https://www.keycloak.org/about
[single-sign on]: https://en.wikipedia.org/wiki/Single_sign-on
[LDAP]: https://en.wikipedia.org/wiki/Lightweight_Directory_Access_Protocol
[Active Directory]: https://en.wikipedia.org/wiki/Active_Directory
[SAML]: https://en.wikipedia.org/wiki/Security_Assertion_Markup_Language
[OpenID Connect (OIDC)]: https://en.wikipedia.org/wiki/OpenID
[Global Alliance for Genomic Health (GA4GH)]: https://www.ga4gh.org/
[Passports standard]: https://www.ga4gh.org/news/ga4gh-passports-and-the-authorization-and-authentication-infrastructure/
[GA4GH spec]: https://github.com/ga4gh-duri/ga4gh-duri.github.io/blob/master/researcher_ids/ga4gh_passport_v1.md
[JSON Web Token]: https://jwt.io/
[userinfo]: https://openid.net/specs/openid-connect-core-1_0.html#UserInfo
[Mappers]: https://www.keycloak.org/docs/latest/server_admin/#_protocol-mappers
[Keycloak JIRA]: https://issues.redhat.com/projects/KEYCLOAK/
[The Keycloak Test Suite - CanDIG Mini-Conference (Chapter 2)]: https://www.youtube.com/watch?v=c46gMnftY3c
[KEYCLOAK-14039 - UserInfo claims from external OIDC identity provider are not imported #7214]: https://github.com/keycloak/keycloak/pull/7214