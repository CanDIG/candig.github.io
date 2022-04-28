---
layout: blogpost
title: Deploy React.js Applications on DigitalOceans
summary: How to deploy React.js applications on DigitalOceans
author: Jimmy Li
date: 2022-04-28
---

<style>
table {
    width: 100%;
    border-collapse: collapse;
}
th {
    background: #17a018;
    color: white;
}
table, th, td {
    padding: 0.5em;
    margin: 0.5em;
}
table tr:hover {
    background: #D6EEDC;
}
table tr:nth-child(even){
    background: #f2f2f2;
}
</style>

## Overview

At CanDIG, we have developed multiple React.js-based frontend applications. For demo purposes, we wanted to deploy them on a public hosting platform. There are multiple app hosting platforms, including Amazon AWS, DigitalOceans, Google Cloud, Heroku, etc. 

Currently, our demo React.js applications are hosted on [DigitalOceans’ App Platform](https://www.digitalocean.com/products/app-platform). It supports the deployment of applications written in multiple languages and frameworks and allows free deployment of up to three static sites. For non-static sites, the starting cost is $5/month.

<br>

## Quick Walkthrough
The overall deployment process is smooth. You can choose the source of your application from either  Github, Gitlab or Docker Hub, including the branch of the repo. 

Be sure to check the `Autodeploy code changes` as this is vital in enabling `Continuous Delivery` in the future. 


 <figure style="margin-bottom: 2em; margin-top: 1em; text-align: center">
    <img src="/img/posts/deploy-reactjs-apps/1.png"
    width="80%" style="margin: 10px 10px 10px 10px;">
    <figcaption>Figure 1: Choose source of the app</figcaption>
 </figure>

Once you select your repo, the UI asks you to select the Type of your application. Be sure to select `Static Site`.

 <figure style="margin-bottom: 2em; margin-top: 1em; text-align: center">
    <img src="/img/posts/deploy-reactjs-apps/2.png"
    width="50%" style="margin: 10px 10px 10px 10px;">
    <figcaption>Figure 2: Select the correct type of the app</figcaption>
 </figure>

Some platforms, like Heroku, use a first-come-first-serve way to allocate subdomains. On the plus side, you may be able to get the subdomain exactly as you want it to be. However, it is also possible that the subdomains have been taken.

DigitalOceans uses a different way to allocate subdomains; it always appends a few randomly-generated characters to the end of your chosen subdomain, so your actual subdomain will differ from the one you put in.

 <figure style="margin-bottom: 2em; margin-top: 1em; text-align: center">
    <img src="/img/posts/deploy-reactjs-apps/3.png"
    width="50%" style="margin: 10px 10px 10px 10px;">
    <figcaption>Figure 3: Choose a name of your app</figcaption>
 </figure>

Finally, you can choose the hosting plan. As mentioned above, the free starter plan is sufficient for up to three static sites/apps.

If you have any environment variables, you may specify them under `Settings -> App-Level Environment Variables`.

 <figure style="margin-bottom: 2em; margin-top: 1em; text-align: center">
    <img src="/img/posts/deploy-reactjs-apps/4.png"
    width="50%" style="margin: 10px 10px 10px 10px;">
    <figcaption>Figure 4: Specify Environment Variables, if any</figcaption>
 </figure>

<br>

## Common Issue

It is very common that your React.js application may not work on reload, this is because the server is not configured to understand the paths. Oftentimes they are handled by the React.js app itself via React-Router or something similar. To fix this issue, add the `catchall_document: index.html` to your app spec.

```
static_sites:
- build_command: npm run build
  catchall_document: index.html
  environment_slug: node-js
  github:
    branch: develop
    deploy_on_push: true
    repo: candig/candig-server-external-dashboard
  name: candig
  routes:
  - path: /
  source_dir: /
```

As of April 2022, the platform does not seem to support editing App Spec online via the UI, so you would need to make the changes locally and replace the App Spec by re-uploading the file.

## Conclusion

Depending on the needs, the DigitalOceans App Platform could be a good option for hosting static applications. The hosting is free for up to three static sites, and the overall deployment process is straightforward.

Do you have any questions? Feel free to contact us at info@distributedgenomics.ca or on Twitter at @distribgenomics.

## Reference Materials
- [The official guide on how to deploy react.js apps](https://www.digitalocean.com/community/tutorials/how-to-deploy-a-react-application-to-digitalocean-app-platform)

<br>