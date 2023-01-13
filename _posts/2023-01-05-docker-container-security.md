---
layout: blogpost
title: CanDIGv2 Docker Container Security Guide
summary: Challenges as well as providing best practices for hardening containerized applications using OWASP Docker Top 10 recommendations
author: Shaikh Farhan Rashid
date: 2023-01-05
---

## Overview

Containerization and container technologies such as Docker have ushered in a new era of application development, allowing the proliferation of microservice architectures and distributed apps. With containerization, developers can package application code in a virtual runtime with its dependencies without having to be concerned about the restrictions or requirements of the host system. This approach aids portability and operates consistently across various computing environments and infrastructure, without losing efficiency. However, building apps in this paradigm also introduces new security challenges and risks. A single compromised container can threaten all other containers as well as the underlying host, underscoring the importance of securing Docker.

![](https://lh5.googleusercontent.com/H4MVAIkZ7dzsvE4E8gHRQfDZoV0Au2aKiYHQcF0HT9xIyIH4n6sJUnIo4c89qM0xtbnhKfVqVw0Xxy63AGo4lZoNSmMz8Ot3NW86iU15-nJ1q472hmvHlnoBR0u1i70Sr0fWHCgBBpiaAC9ZvdbMjuGqs8UG-MDpqAapaq9jDDx0r1Dbel3WRMtJeMFatUo=s2048)

This article focuses on container security by highlighting Docker container security risks and challenges as well as providing best practices for hardening your environment during the build and deploy phases and protecting your Docker containers during runtime.

## Container Security Challenges

Unlike appliations deployed in virtual machines (VMs) or bare metal servers, containerization introduces several new challenges that must be addressed. Securing Docker can be loosely categorized into two areas: securing and hardening the host so that a container breach doesn't also lead to host breach, and securing Docker containers. When creating or deploying applications in containers, developers should take the following into consideration:

- Containers enable microservices, which increases data traffic and network and access control complexity.
- Containers rely on a base image, and knowing whether the image comes from a secure or insecure source can be challenging. Images can also contain vulnerabilities that can spread to all containers that use the vulnerable image.
- Containers have short life spans, so monitoring them, especially during runtime, can be extremely difficult. Another security risk arises from a lack of visibility into an ever-changing container environment.
- Containers, unlike VMs, aren't necessarily isolated from one another. A single compromised container can lead to other containers being compromised.
- Container configuration is yet another area that poses security risks. Are containers running with heightened privileges when they shouldn't? Are images launching unnecessary services that increase the attack surface? Are secrets stored in images?

## OWASP Docker Top 10

![](https://lh4.googleusercontent.com/yBxR6VanGEQUlJ6ypZZh1o59s4GbZvsaTpL6FbEh8r9k-R_AQe0QBaYDDncJDYrfcDym7THzIULAqzykgqsNW_QEIlCEeLnHJ9KmpwurTC2tInsLbs6aZd7PsmMwNYxsgw3jhzpR6RrwYf8aDv5eJbHHw2z2RtvjKCevSG5_bXRVRnq44Z-B28w-OHWK6xE=s2048)

The classical approach how to secure an environment is looking at it from the attacker perspective and enumerate vectors for an attack. Those vectors will help you to define what needs to be protected. With this definition one can put security controls in place to provide a baseline protection and beyond. [The OWASP Docker Top 10](https://github.com/OWASP/Docker-Security/blob/main/D00%20-%20Overview.md) project gives ten bullet points to plan and implement a secure docker-based container environment.

| Title | Description |
| -- | -- |
| D01 - Secure User Mapping | Most often the application within the container runs with the default administrative privileges: root. This violates the least privilege principle and gives an attacker better chances further extending his activities if he manages to break out of the application into the container. From the host perspective the application should never run as root. |
| D02 - Patch Management Strategy | The host, the containment technology, the orchestration solution and the minimal operating system images in the container will have security bugs. Once publicly known it is vital for your security posture to address those bugs in a timely fashion. For all those components mentioned you need to decide when you apply regular and emergency patches before you put those into production. |
| D03 - Network Segmentation and Firewalling | You properly need to design your network upfront. Management interfaces from the orchestration tool and especially network services from the host are crucial and need to be protected on a network level. Also make sure that all other network based microservices are only exposed to the legitimate consumer of this microservice and not to the whole network. |
| D04 - Secure Defaults and Hardening | Depending on your choice of host and container operating system and orchestration tool you have to take care that no unneeded components are installed or started. Also all needed components need to be properly configured and locked down. |
| D05 - Maintain Security Contexts | Mixing production containers on one host with other stages of undefined or less secure containers may open a backdoor to your production. Also mixing e.g. frontend with backend services on one host may have negative security impacts. |
| D06 - Protect Secrets | Authentication and authorization of a microservice against a peer or a third party requires secrets to be provided. For an attacker those secrets potentially enable him to access more of your data or services. Thus any passwords, tokens, private keys or certificates need to be protected as good as possible. |
| D07 - Resource Protection | As all containers share the same physical CPU, disks, memory and networks. Those physical resources need to be protected so that a single container running out of control -- deliberately or not -- doesn't affect any other container's resources. |
| D08 - Container Image Integrity and Origin | The minimal operating system in the container runs your code and needs to be trustworthy, starting from the origin up until the deployment. You need to make sure that all transfers and images at rest haven't been tampered with.  |
| D09 - Follow Immutable Paradigm | Often container images don't need to write into their filesystem or a mounted filesystem, once set up and deployed. In those cases you have an extra security benefit if you start the containers in read-only mode. |
| D10 - Logging | For your container image, orchestration tool and host you need to log all security relevant events on a system and API level. All logs should be remote, they should contain a common timestamp and they should be tamper proof. Your application should also provide remote logging. |

## CanDIG Container Security Best Practices

At CanDIG, we implement a multi-layered approach to securing our distributed platform and containerized architecture.  Based on the OWASP Docker Top 10, some of these security best practices and recommendations include:

### Limit privileges Inside and outside container

- If you are using containers without an explicit container user defined in the image, you should enable user namespace support, which will allow you to re-map container user to host user.
- Disallow containers from acquiring new privileges. By default, containers can acquire new privileges, so this configuration must be explicitly set. Another step you can take to minimize a privilege escalation attack is to remove the `setuid` and `setgid` permissions in the images.
- As a best practice, run your containers as a non-root user (UID not 0). By default, containers run with root privileges as the root user inside the container.
- Implement a strong governance policy that enforces frequent image scanning. Stale or outdated images should be rejected or rescanned before moving to build stage. Build a workflow that regularly identifies and removes stale or unused images and containers from the host.
- When running containers, remove all capabilities not required for the container to function as needed. You can use Docker's `CAP DROP` capability to drop a specific container's capabilities (also called Linux capability), and use `CAP ADD` to add only those capabilities required for the proper functioning of the container.
- Limit the number of containers running with the `--privileged` flag, as this type of container will have most of the capabilities available to the underlying host. This flag also overwrites any rules you set using `CAP DROP` or `CAP ADD`.

![](/img/posts/candigv2-docker-security/example1.png)

### Minimize base images and pin application dependencies

- Use only trusted base images when building your containers. It's important to know which images are available for use on the Docker host, understand their provenance, and review the content in them. You should also enable Content trust for Docker for image verification and install only verified packages into images.
- Use minimal base images that remove unnecessary software packages, which could lead to a larger attack surface. Having fewer components in your container reduces the number of available attack vectors. Minimal images also yields better performance because there are fewer bytes on disk and less network traffic for images being copied. BusyBox and Apline are two options for building minimal base images.

![](https://lh6.googleusercontent.com/bk6Rr1bvc94q90TU1Mnf8Br9v3skyj8FTpjggAE4R9d9jOoTtyi48-6NHn2EOPP2cEAiOFU2WPBh0-DTsORxnYCUl9QPeGqpvb3tZSEHDvemmwge0Io1BPvsQ1Ig65ZzVMi5XYQzFtlZnZIGvi5m5fh8unkY1n4YPIs9COYcJjkrBsmizfv59kklWidGWAI=s2048)

### Segment container network communications

- Avoid sshd within containers. By default, the ssh daemon will not be running in a container, and you shouldn't install the ssh daemon to simplify security management of the SSH server.
- Try not to map any ports below 1024 within a container as they are considered privileged because they transmit sensitive data. By default, Docker maps container ports to one that's within the 49153–65525 range, but it allows the container to be mapped to a privileged port. As a general rule of thumb, ensure only needed ports are open on the container.
- Reduce the need to share the host's network namespace, process namespace, IPC namespace, user namespace, or UTS namespace, unless necessary, to ensure proper isolation between Docker containers and the underlying host.

![](https://lh6.googleusercontent.com/e2XHe2GexCPdTDvmOe8N36NqJK1FdjbDCOqH9IkGpfuEerHDYvrrj-1LNAwCpq0i6_lsMgJZfQcXh0Iq1JA8S0UO5qUhBs22RIs9H8QTC_jPzss0GAfkhnd_akfVQeMY6dadjMCv9IMWh3n5Z0xVUb7zJpxYOdSnKGNAUXJOihCaoeZtY-DOeiUJvMHSAyw=s2048)

### Use COPY Instead of ADD

- In `Dockerfile`, there are two commands that you can use to copy files/directories into it – `ADD` and `COPY`. Both perform the same task but have differences in the scope of their function.
- Arbitrary URLs specified for `ADD` could result in MITM attacks, or sources of malicious data. `ADD` implicitly unpacks local archives which may not be expected and result in path traversal and Zip Slip vulnerabilities
- Use `COPY`, unless `ADD` is specifically required

![](/img/posts/candigv2-docker-security/example2.png)

### Store secrets outside of codebase

- Remove secrets stored images/Dockerfiles. By default, you're allowed to store secrets in Dockerfiles, but storing secrets in an image gives any user of that image access to the secret. When a secret is required, use a secrets management tool.
- Avoid mounting sensitive host system directories on containers, especially in writable mode that could expose them to being changed maliciously in a way that could lead to host compromise.

![](https://lh6.googleusercontent.com/SWfqIg-IIOs082B8aVnLQZWuqspXWUJv5_h-sUmSuz5HVGVjnHz-3wqS1ptYKOQyxz-ugEoVaeUQtaPuQB-0x1DVUvL-J6SLM92jds4jWGjSAoiplKT60sFG594bYY_4bwyN1-EfJQPRlP60tojeu19EMQdQhwNZw_XHS9kGwfPlP9iSnibEJj8qjwenXjs=s2048)

## Conclusion

Containers make it easy for the developers to build the application with all its dependencies and libraries and ship it out as one package. Naturally, as with any technology that's rapidly adopted, there's going to be a widespread difference in emerging practices. Thankfully, organizations like OWASP are providing resources to consolidate the best practices and community support. These recommendations are of benefit to software developers, researchers, and curious Docker-nauts


**References**

<https://medium.com/lucjuggery/from-env-variables-to-docker-secrets-bc8802cacdfd>
<https://snyk.io/blog/top-ten-most-popular-docker-images-each-contain-at-least-30-vulnerabilities/>
<https://owasp.org/www-project-docker-top-10/>
<https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html>
<https://docs.docker.com/engine/security/userns-remap/#enable-userns-remap-on-the-daemon>
<https://hackernoon.com/you-should-use-alpine-linux-instead-of-ubuntu-yb193ujt>
<https://docs.docker.com/network/>
<https://docs.docker.com/network/bridge/>
<https://docs.docker.com/network/overlay/>
<https://phoenixnap.com/kb/docker-add-vs-copy>
<https://rockbag.medium.com/why-you-should-pin-your-docker-images-with-sha-instead-of-tags-fd132443b8a6>
<https://github.com/OWASP/Docker-Security/blob/master/dist/owasp-docker-security.pdf>
