# 13. Handling OSCAL and non-OSCAL Attachments

Date: 2024-01-03

## Status

Proposed

## Context

This decision record considers requirements for business logic, software development by implementers, and encoding of information about OSCAL and non-OSCAL attachments for FedRAMP. Additionally, necessary consideration is given to possible alignment or collision to FedRAMP or more generic use cases of NIST OSCAL separate of FedRAMP with respect to the latter.

Data in instances of the seven OSCAL models necessarily reference information through data elements within that instance, another instance of a different OSCAL model, and quite frequently information that is not OSCAL altogether. For the third scenario, it is frequently necessary to use a [`back-matter/resource`](https://pages.nist.gov/OSCAL-Reference/models/v1.1.3/system-security-plan/json-reference/#/system-security-plan/back-matter/resources) and appropriately reference it by the `resource/@uuid` in relevant areas of the respective model ([`system-security-plan/system-implementation/component/link/@href`](https://pages.nist.gov/OSCAL-Reference/models/v1.1.3/system-security-plan/json-reference/#/system-security-plan/system-implementation/links), for example). For a variety of use cases, stakeholders consuming information through tooling enabled by OSCAL data must rely on metadata for a given attachment, be its [media type](https://pages.nist.gov/OSCAL-Reference/models/v1.1.3/system-security-plan/json-reference/#/system-security-plan/back-matter/resources/rlinks/media-type) or other forms of human and machine-oriented metadata. One such recent example is where FedRAMP requires a system security plan in OSCAL reference different elements of a POAM that may be OSCAL or Excel-based in [GSA/fedramp-automation#934](https://github.com/GSA/fedramp-automation/issues/934). There are several approaches, listed below, to consider with benefits and drawbacks to consider.

1. Change the generic `prop[@type]` to have new values to address specific attachment use cases at the resource level (i.e. `resource/prop`).
1. Add a new `prop` in the FedRAMP namespace (`@ns="http://fedramp.gov/ns/oscal`) at the resource level (i.e. `resource/prop`).
1. Add a new `@class` to the prop to identify FedRAMP use cases at the resource level (i.e. `resource/prop/@class`).
1. Customize the `@media-type` for a specific resource link `resource/rlink`, not at the resource level.

There are a variety of use cases for managing and cross-referencing OSCAL and non-OSCAL attachments. As a starting point, we can suppose we have a single resource, such as a POAM with individual items therein, that can be serialized into a OSCAL `plan-of-actions-and-milestones` instance and [an equivalent Excel file](). For this example, an OSCAL system security plan must reference such a `resource` in its `back-matter` and cross-reference to various fields and flags in SSP assemblies. Below is such an example resource.

```xml
<resource uuid="11111111-2222-4000-8000-001000000048">
    <title>Plan of Actions and Milestones (POAM)</title>
    <prop name="published" value="2023-05-31T00:00:00Z"/>
    <prop name="type" value="plan"/>
    <rlink href="./attachments/POAMs/SAMPLE_POAM_20230531.xml" media-type="=application/xml"/>
    <rlink href="./attachments/POAMs/SAMPLE_POAM_20230531.xlsx" media-type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
</resource>
```

### Approach 1

The first approach would have FedRAMP developers and community implementers import or export a document with `back-matter/resource`s that use an additional custom value (i.e. `value="fedramp-poam"` in place of one of the more generic original values (i.e. `value="plan"`). Below is such an example.

```xml
<resource uuid="11111111-2222-4000-8000-001000000048">
    <title>Plan of Actions and Milestones (POAM)</title>
    <prop name="published" value="2023-05-31T00:00:00Z"/>
    <prop name="type" value="fedramp-poam"/>
    <rlink href="./attachments/POAMs/SAMPLE_POAM_20230531.xml" media-type="=application/xml"/>
    <rlink href="./attachments/POAMs/SAMPLE_POAM_20230531.xlsx" media-type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
</resource>
```

This approach will require immediate coordination with NIST staff as the upstream maintainers of OSCAL. As of [the published v1.1.3 release of the core NIST OSCAL models](https://github.com/usnistgov/OSCAL/blob/v1.1.3/src/metaschema/oscal_metadata_metaschema.xml#L577-L605), the enumerated set of allowed values for `back-matter/prop[@name="type"]` is implemented with [the default closed to extension enumeration strategy, the implied `allow-other="no" default](https://pages.nist.gov/metaschema/specification/syntax/constraints/#allowed-values-constraints)), per its Metaschema definition. Therefore, it is possible to move forward with this approach, but it requires sustained coordination with NIST maintainers until a change is released. This approach is therefore a viable long-term option for subsequent releases of FedRAMP OSCAL Constraints, but likely not a viable short-term one.

### Approach 2

The second approach, to avoid the closed enumeration default with the first approach, is to add a custom property at the resource level (i.e. `prop[@ns="http://fedramp.gov/ns/oscal" and @name="custom-property-name"]` not individual serializations or data formats in their respective `rlink`s). For this high-level approach, there are two tactics: FedRAMP developers can "shadow" the core OSCAL `prop[@name="type"]` with a custom namespace and a use-case-specific value (see [Approach 2A](#approach-2a)), or add a novel property in the FedRAMP namespace and use a property name that identifies that validations will prefer or prohibit alternative formats and serializations given a superset of FedRAMP use cases (see [Approach 2B](#approach-2b)).

#### Approach 2A

```xml
<resource uuid="11111111-2222-4000-8000-001000000048">
    <title>Plan of Actions and Milestones (POAM)</title>
    <prop name="published" value="2023-05-31T00:00:00Z"/>
    <prop ns="http://fedramp.gov/ns/oscal" name="type" value="fedramp-poam"/>
    <rlink href="./attachments/POAMs/SAMPLE_POAM_20230531.xml" media-type="=application/xml"/>
    <rlink href="./attachments/POAMs/SAMPLE_POAM_20230531.xlsx" media-type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
</resource>
```

#### Approach 2B

```xml
<resource uuid="11111111-2222-4000-8000-001000000048">
    <title>Plan of Actions and Milestones (POAM)</title>
    <prop name="published" value="2023-05-31T00:00:00Z"/>
    <prop ns="http://fedramp.gov/ns/oscal" name="has-oscal-document" value="yes"/>
    <rlink href="./attachments/POAMs/SAMPLE_POAM_20230531.xml" media-type="=application/xml"/>
    <rlink href="./attachments/POAMs/SAMPLE_POAM_20230531.xlsx" media-type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
</resource>
```

### Approach 3

This approach uses a `@class` to the prop to identify FedRAMP use cases at the resource level (i.e. `resource/prop/@class`). Do to the nature of `@class` and other flag-based approaches, it cannot be used to describe individual data formats or encodings of this resource per each `rlink`. Additionally, FedRAMP developers must find a balance for various use cases between generic values (e.g. `class="fedramp"`) and use-case-specific values (e.g. `class="fedramp-poam"`).

```xml
<resource uuid="11111111-2222-4000-8000-001000000048">
    <title>Plan of Actions and Milestones (POAM)</title>
    <prop name="published" value="2023-05-31T00:00:00Z"/>
    <prop name="type" class="fedramp-poam" value="plan"/>
    <rlink href="./attachments/POAMs/SAMPLE_POAM_20230531.xml" media-type="=application/xml"/>
    <rlink href="./attachments/POAMs/SAMPLE_POAM_20230531.xlsx" media-type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
</resource>
```

### Approach 4

This approach uses media type parameters for each encoding or data format representation of an attachment. This feature of media types is optional, as specified in IETF [RFC 6838](https://datatracker.ietf.org/doc/html/rfc6838#section-4.3). Although conceptually different and more expressive than flags, the key-value structure of media type parameters requires a balance between too generic (e.g `; oscal-use-case=foo`) and too specific (e.g. `; fedramp-use-case=poam`). Additionally, there may be some redundancy with respect to OSCAL data if FedRAMP developers do or do not explicitly use the unregistered media type sub-type (e.g. `media-type="=application/oscal+json; oscal-model=poam"`). FedRAMP developers must take care given the wide number of use cases and "parameter squatting" (with regards to generic ones such as `; oscal-use-case=...`) or how to equitably share use of use-case-specific ones.

```xml
<resource uuid="11111111-2222-4000-8000-001000000048">
    <title>Plan of Actions and Milestones (POAM)</title>
    <prop name="published" value="2023-05-31T00:00:00Z"/>
    <prop name="type" value="plan"/>
    <rlink href="./attachments/POAMs/SAMPLE_POAM_20230531.xml" media-type="=application/xml; oscal-model=poam"/>
    <rlink href="./attachments/POAMs/SAMPLE_POAM_20230531.xlsx" media-type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
</resource>
```

### Benefits and drawbacks of these approaches

Given the options above, there are important considerations to the complexity of business logic, duplicative encoding, and ergonomics for software developers that implement against FedRAMP's customization of OSCAL.

## Decision

What is the change that we're proposing and/or doing?

## Consequences

What becomes easier or more difficult to do because of this change?
