---
layout: blogpost
title: GA4GH Beacon API - Implementing a REST API specification in GraphQL
summary: GA4GH API specs are often RESTful. How do we adapt the specs for a GraphQL service?
author: Ali Raza Zaidi
date: 2022-04-20
---

<!-- The code for table styling was copied from Courtney Gosselin's blog post markdown file. https://github.com/CanDIG/candig.github.io/blob/production/_posts/2022-02-18-introduction-to-figma-and-design-principles.md -->

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

The CanDIG team, in their [quest] to enable "national scale analysis over locally-controlled data", make extensive use of APIs. The backbone for many of these APIs are the standards laid out by the Global Alliance for Genomics and Health ([GA4GH]). These standards tend to be RESTful, which make adopting an additional standard like GraphQL a tall order.

GraphQL is booming in popularity, attributable, in part, to its excellent data response system, which eliminates both the [over-fetching and under-fetching] of data by returning only the fields requested by the caller. The removal of excess data reduces the cleanup and data processing that external applications must do when using REST APIs. GraphQL's nested query structure also enables cross-datatype queries, making it the perfect tool for complex data analysis like Machine Learning.

Although in theory, our GraphQL API service should be a successor to the REST APIs currently used by the CanDIGv2 stack, as of right now, it simply sits alongside them. Previous CanDIG Intern, Nina Wang, [goes into greater depth] about the process required to generate a GraphQL service within the current CanDIG infrastructure in her blog post.

For services with existing GA4GH REST APIs within the CanDIGv2 stack, setting up corresponding GraphQL resources is relatively straightforward. We simply call the RESTful service with the given input parameters and mirror the output through the GraphQL Interface. The approach taken to implement a GraphQL service for a standard that doesn't have a CanDIGv2 microservice differs slightly. Let's delve deeper into the implementation of such a service. The code for this implementation is at https://github.com/CanDIG/GraphQL-interface.

## GA4GH Beacon Standard

The GA4GH organization describes [Beacon] as a tool designed to make querying for genomic variants more straightforward. The standard is designed to be implemented as a RESTful API that connects directly to a data backend, like the example implementation, [Beacon Elixir]. The [standard] takes allele characteristics as input and returns a response object containing, among other fields, a boolean value specifying whether said allele was found within the patient population. The Beacon service has two existing specifications, `v0` and `v1`, while the Beacon `v2` specification is currently in development and [plans to allow] for "more informative queries" using tools such as "filtering".

## Challenges

Several challenges arise when trying to mimic the native Beacon service through GraphQL. The intended implementation uses a data backend, and our proposed prototype implementation does not currently connect to any data backend. This means that we can't replicate some functionality and fields, like `datasetAlleleResponses`, of the native implementation. Differences between GraphQL and REST also bring about some issues. For example, REST specifications can easily support 'one of many' field types, which aren't officially supported by GraphQL as of yet, though their support is in the [works].

## Opportunities

While challenges do arise when creating a GraphQL service that mocks a RESTful API, there are also a variety of opportunities that open up. For one, GraphQL is inherently good at filtering tasks. Therefore, implementing the Beacon `v2` specification may be easier than anticipated.

Another significant opportunity is the use of the CanDIG variants service and the Katsu metadata service. The [CanDIG] variants service records allele information and the patients associated with certain alleles, conversely, the [Katsu] metadata service stores clinical metadata. Given this, we can connect the two to implement a rudimentary Beacon service. We can also make use of a lot of the code written for the GraphQL implementations of the Katsu and CanDIG variants services, reducing the developmental uptime required to get the Beacon implementation up and running.

## Implementing the Beacon V1 Service using GraphQL

Such a massive undertaking is a multi-step process. So let us go step-by-step in implementing this service.

### Step 1: Field Selection

This first step is crucial in implementing the Beacon service. It involves selecting the Beacon fields we want to simulate using GraphQL. As aforementioned, given the differences between the intended implementation and our implementation, we may not be able to use all of the fields present in the specification.

To combat this, we scour the [Beacon REST API specs] to find which fields are essential to execute a Beacon query, which fields need to be dropped, and which fields can be included or excluded, with no detriment either way.

Fields labelled as _Mandatory Fields_ were generally required within the native Beacon specification and were included because of their importance to the core functionality of the Beacon API.

Those labelled as _Fields to Remove_ were the fields that were incompatible with our implementation. Removing these fields does not change the core functionality of the application, as most of these fields were not mandatory in the original specification.

The optional fields, labelled as _Extra Fields_, made no impact on the core functionality of the Beacon API. The optional fields that required little to no upgrades to our Beacon implementation were the only ones included in our final prototype implementation.

The specification's main fields are listed below with **bold** indicating fields present in our implementation.

#### BeaconAlleleRequest

The _BeaconAlleleRequest_ object stores the necessary fields for a request to be made to the Beacon API.[^1]

<table>
    <tr>
        <th>Mandatory Fields</th>
        <th>Fields to Remove</th>
        <th>Extra Fields</th>
    </tr>
    <tr>
        <td><b>referenceName</b>: <i>string</i></td>
        <td>assemblyId: <i>string</i></td>
        <td>startMin: <i>integer</i></td>
    </tr>
    <tr>
        <td><b>referenceBases</b>: <i>string</i></td>
        <td>variantType: <i>string</i></td>
        <td>startMax: <i>integer</i></td>
    </tr>
    <tr>
        <td><b>alternateBases</b>: <i>string</i></td>
        <td>includeDatasetResponses: <i>string</i></td>
        <td>endMin: <i>integer</i></td>
    </tr>
    <tr>
        <td><b>start</b>: <i>integer</i></td>
        <td></td>
        <td>endMax: <i>integer</i></td>
    </tr>
    <tr>
        <td><b>end</b>: <i>integer</i></td>
        <td></td>
        <td><b>datasetIds</b>: <i>array[string]</i></td>
    </tr>
</table>

#### BeaconAlleleResponse

The _BeaconAlleleResponse_ fields hold the structure of the response object for a query to a Beacon service.[^2]

<table>
    <tr>
        <th>Mandatory Fields</th>
        <th>Fields to Remove</th>
        <th>Extra Fields</th>
    </tr>
    <tr>
        <td><b>exists</b>: <i>boolean</i></td>
        <td>datasetAlleleResponses: <i>BeaconDatasetAlleleResponse object</i></td>
        <td><b>beaconId</b>: <i>string</i></td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td><b>apiVersion</b>: <i>string</i></td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td><b>alleleRequest</b>: <i>BeaconAlleleRequest object</i></td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td><b>error</b>: <i>BeaconError object</i></td>
    </tr>
</table>

### Step 2: Building Schemas

After selecting the required fields, the next step is implementing the GraphQL Beacon. To do this, we must first use the _strawberry_ module in Python to define the schemas for our GraphQL API.

First, we define the schema for our `BeaconAlleleRequest` object, ensuring that the class fields are the same as those selected above. Here we can also add documentation for our API by adding a `description` parameter to our strawberry objects.

```python
@strawberry.input(description="...")
class BeaconAlleleRequest:
    # Mandatory Fields
    referenceName: str = strawberry.field(description="...")
    referenceBases: str = strawberry.field(description="...")
    start: int = strawberry.field(description="...")
    end: int = strawberry.field(description="...")
    alternateBases: str = strawberry.field(description="...")

    # Optional Fields
    datasetIds: Optional[List[str]] = strawberry.field(default=None, description="...")
```

### Step 3: Connecting Services

The next step involves building the logic to get from inputs to outputs via the 'Beacon data loader' function. This function handles requests in batches but we will detail the logic for just a single request below.

The first part of the data loader function processes the input fields for future use. It will then send the processed input to the variants service. After receiving a response, it checks to see if any of the patients returned are present in the Katsu metadata service and returns a _BeaconAlleleResponse_ object containing the result.

The code block below illustrates only the steps taken to connect the services and generate output. Note that while our data loader function connects the Katsu and variants services, if you choose to implement a data backend for your application, then you will replace the cross-service queries performed in the data loader function with your data collection logic.

```python
async def beacon_data_loader(request_batch):
    responses = []
    for request in request_batch:
        ...
        variant_patients = await DataLoader(load_fn=get_candig_server_variants).load(processed_input)
        have_individuals = await present_in_katsu(variant_patients, start, end, name, base, alt_base, info)
        responses.append(build_response(have_individuals, base_allele_request))

    return responses
```

Now we modify our GraphQL service's `Query` object to accept these Beacon objects by passing it the Beacon data loader function and specifying the input and output parameter types.

```python
@strawberry.type
class Query:
    ...
    @strawberry.field
    async def beaconQuery(self, info, input: Optional[BeaconAlleleRequest]) -> BeaconAlleleResponse:
        return await info.context['beacon_data_loader'].load(BeaconAlleleDataLoaderInput(input, info))
```

### Implementation Complete

We have now implemented the Beacon v1 REST API spec as a GraphQL application without an existing Beacon REST API. While we lose some functionality because of the fields we dropped, we gain the advantages of using a GraphQL API which is more important for applications such as Machine Learning.

## Possible Improvements

For starters we could add Beacon `v2` functionality when the `v2` spec is officially released. This would probably involve changing the schemas or the input and output fields to fit better with the `v2` spec.

Another improvement we could make would be to try and implement some of the `v1` fields we dropped for our prototype version. This would help flesh out the Beacon `v1` functionality of our service.

Speaking of which, given that some of our `v1` fields couldn't be added because we didn't use a data backend, we could try changing our Beacon implementation so that it uses a local storage mechanism, instead of having to perform cross-service queries. This would not only bring our Beacon implementation closer to the original, but it would also allow us to make our Beacon service [faster].

## Implementing Additional Services

We have only modelled one GA4GH REST API as a GraphQL service here, but there are many other API standards published by GA4GH. Many of these do not have existing CanDIGv2 microservices, and thus by following a similar process, we can implement them as GraphQL services in CanDIGv2 as well.

<br>

Do you have any questions? Feel free to contact us at [info@distributedgenomics.ca] or on Twitter at [@distribgenomics].

<hr/>

[^1]: `datasetIds` is a database-related field but it can be used in our implementation because the CanDIG variants service, from which we are sourcing allele information, allows us to specify the id of the dataset we are looking for. The same cannot be said for the characteristics needed to properly implement `includeDatasetResponses` and the related `datasetAlleleResponses` fields.
[^2]: The response fields that were object types followed a similar implementation pattern to the _BeaconAlleleRequest_ and _BeaconAlleleResponse_ objects. Their fields were selected from the [Beacon REST API specs] in a similar manner where the core functionality was kept intact and any fields that were incompatible with the application were dropped.

<!-- links -->

[quest]: https://www.distributedgenomics.ca/architecture
[ga4gh]: https://ga4gh.org
[over-fetching and under-fetching]: https://www.howtographql.com/basics/1-graphql-is-the-better-rest/
[goes into greater depth]: https://www.distributedgenomics.ca/posts/secure-cross-service-graphql-interface/
[beacon]: https://beacon-project.io/
[beacon elixir]: https://github.com/ga4gh-beacon/beacon-elixir
[standard]: https://github.com/ga4gh-beacon/specification/blob/master/beacon.md
[plans to allow]: https://beacon-project.io/
[works]: https://stepzen.com/blog/coming-soon-to-graphql-the-oneof-input-object
[candig]: https://candig-server.readthedocs.io/en/v1.5.0-alpha/data.html
[katsu]: https://github.com/CanDIG/katsu/blob/develop/README.md
[beacon rest api specs]: https://github.com/ga4gh-beacon/specification/blob/master/beacon.md
[faster]: https://softwareengineering.stackexchange.com/questions/286788/what-is-faster-using-rest-api-or-querying-a-database-directly
[info@distributedgenomics.ca]: mailto:info@distributedgenomics.ca
[@distribgenomics]: https://twitter.com/distribgenomics
