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
    <rlink href="./attachments/POAMs/SAMPLE_POAM_20230531.xml" media-type="application/xml"/>
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
    <rlink href="./attachments/POAMs/SAMPLE_POAM_20230531.xml" media-type="application/xml"/>
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
    <rlink href="./attachments/POAMs/SAMPLE_POAM_20230531.xml" media-type="application/xml"/>
    <rlink href="./attachments/POAMs/SAMPLE_POAM_20230531.xlsx" media-type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
</resource>
```

#### Approach 2B

```xml
<resource uuid="11111111-2222-4000-8000-001000000048">
    <title>Plan of Actions and Milestones (POAM)</title>
    <prop name="published" value="2023-05-31T00:00:00Z"/>
    <prop ns="http://fedramp.gov/ns/oscal" name="has-oscal-document" value="yes"/>
    <rlink href="./attachments/POAMs/SAMPLE_POAM_20230531.xml" media-type="application/xml"/>
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
    <rlink href="./attachments/POAMs/SAMPLE_POAM_20230531.xml" media-type="application/xml"/>
    <rlink href="./attachments/POAMs/SAMPLE_POAM_20230531.xlsx" media-type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
</resource>
```

### Approach 4

This approach uses media type parameters for each encoding or data format representation of an attachment. This feature of media types is optional, as specified in IETF [RFC 6838](https://datatracker.ietf.org/doc/html/rfc6838#section-4.3). Although conceptually different and more expressive than flags, the key-value structure of media type parameters requires a balance between too generic (e.g `; oscal-use-case=foo`) and too specific (e.g. `; fedramp-use-case=poam`). Additionally, there may be some redundancy with respect to OSCAL data if FedRAMP developers do or do not explicitly use the unregistered media type sub-type (e.g. `media-type="application/oscal+json; oscal-model=poam"`). FedRAMP developers must take care given the wide number of use cases and "parameter squatting" (with regards to generic ones such as `; oscal-use-case=...`) or how to equitably share use of use-case-specific ones.

```xml
<resource uuid="11111111-2222-4000-8000-001000000048">
    <title>Plan of Actions and Milestones (POAM)</title>
    <prop name="published" value="2023-05-31T00:00:00Z"/>
    <prop name="type" value="plan"/>
    <rlink href="./attachments/POAMs/SAMPLE_POAM_20230531.xml" media-type="application/xml; oscal-model=poam"/>
    <rlink href="./attachments/POAMs/SAMPLE_POAM_20230531.xlsx" media-type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
</resource>
```

### Benefits and drawbacks of these approaches

Given the options above, there are important considerations to the complexity of business logic, duplicative encoding, and ergonomics for software developers that implement against FedRAMP's customization of OSCAL.

Business logic complexity, especially for similar use cases beyond [GSA/fedramp-automation#934](https://github.com/GSA/fedramp-automation/issues/934), is a concern. With approaches that encode information at the per-resource level, developers will need potentially different `prop`s to address different scenarios, even if the `prop` is generic (e.g. `prop[@name="fedramp-use-case"]`). There are at least four different scenarios for attachments with different encodings.

1. Accept either OSCAL or non-OSCAL content as equally weighted options.
1. Prefer OSCAL attachments, even if both are present generally.
1. Prefer non-OSCAL attachments, even if both are present generally.
1. Prefer OSCAL or non-OSCAL content after use-case-specific processing logic occurs in one or both attachments through Metaschema-based constraints or other automated mechanisms.

At a very minimum, developers consuming and implementing FedRAMP OSCAL constraints may have to account for these multiple scenarios for `prop` annotation to pass constraint validation. If not that, developers may need to expose one, two, or more prop annotations per-resource to signal the desired or intended processing mode if multiple options for a use case exist. With such an implementation, it is not sufficient to just add the proper metadata to one or both attachments. All tools, not just FedRAMP systems receiving Digital Authorization Packages, will need to implement this logic.

Therefore, an optimal solution is sufficiently generic (for not just the POAM use case, but other FedRAMP use cases), but requires the least amount of business logic for CSP, 3PAO, and agency stakeholders outside of FedRAMP at the same time.

## Decision

FedRAMP developers propose a variation of Approach 4, with short-term and long-term goals. In the short-term, it is best to increase locality to the attached data (OSCAL or non-OSCAL) and minimize additional business logic developers must implement outside of constraints. Therefore, a preferable short-term solution is to identify the OSCAL model with a media type parameter (if it is OSCAL) and identify FedRAMP-specific use case.

```xml
<resource uuid="11111111-2222-4000-8000-001000000048">
    <title>Plan of Actions and Milestones (POAM)</title>
    <prop name="published" value="2023-05-31T00:00:00Z"/>
    <prop name="type" value="plan"/>
    <rlink href="./attachments/POAMs/SAMPLE_POAM_20230531.xml" media-type="application/xml; oscal-model=poam;fedramp-use=poam;"/>
    <rlink href="./attachments/POAMs/SAMPLE_POAM_20230531.xlsx" media-type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;fedramp-use=poam;"/>
</resource>
```

```xml
<resource uuid="11111111-2222-4000-8000-001000000048">
    <title>Plan of Actions and Milestones (POAM)</title>
    <prop name="published" value="2023-05-31T00:00:00Z"/>
    <prop name="type" value="plan"/>
    <rlink href="./attachments/POAMs/SAMPLE_POAM_20230531.xml" media-type="application/oscal+xml; oscal-model=poam;fedramp-use=poam;"/>
    <rlink href="./attachments/POAMs/SAMPLE_POAM_20230531.xlsx" media-type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;fedramp-use=poam;"/>
</resource>
```

Although less elegant, FedRAMP developers may require explicit use of both parameters, even if that is redundant and unnecessary.

```xml
<resource uuid="11111111-2222-4000-8000-001000000048">
    <title>Plan of Actions and Milestones (POAM)</title>
    <prop name="published" value="2023-05-31T00:00:00Z"/>
    <prop name="type" value="plan"/>
    <rlink href="./attachments/POAMs/SAMPLE_POAM_20230531.xml" media-type="application/xml; oscal-model=poam;fedramp-use=poam;"/>
    <rlink href="./attachments/POAMs/SAMPLE_POAM_20230531.xlsx" media-type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;oscal-model=none;fedramp-use=poam;"/>
</resource>
```

In the long-term, given community feedback and overlapping needs between FedRAMP and other OSCAL community adopters, this use-case-specific parameter _may_ be generalized for all OSCAL use-cases, or more specifically particular communities. For some FedRAMP use cases, there is a likelihood cross-community use is an important factor in the long-term (e.g. [FedRAMP's reciprocity with the US military's authorization processes](https://dodcio.defense.gov/Portals/0/Documents/Library/FEDRAMP-EquivalencyCloudServiceProviders.pdf)). Nonetheless, this transition from a `fedramp-use` to a more generalized use key (tentative examples below) require sufficient uptake of the short-term approach and feedback from community adopters. Coordination with NIST maintainers will be necessary for this long-term approach as well.

```xml
<resource uuid="11111111-2222-4000-8000-001000000048">
    <title>Plan of Actions and Milestones (POAM)</title>
    <prop name="published" value="2023-05-31T00:00:00Z"/>
    <prop name="type" value="plan"/>
    <rlink href="./attachments/POAMs/SAMPLE_POAM_20230531.xml" media-type="application/xml; oscal-model=poam;oscal-use=poam;"/>
    <rlink href="./attachments/POAMs/SAMPLE_POAM_20230531.xlsx" media-type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;oscal-model=none;oscal-use=poam;"/>
</resource>
```

```xml
<resource uuid="11111111-2222-4000-8000-001000000048">
    <title>Plan of Actions and Milestones (POAM)</title>
    <prop name="published" value="2023-05-31T00:00:00Z"/>
    <prop name="type" value="plan"/>
    <rlink href="./attachments/POAMs/SAMPLE_POAM_20230531.xml" media-type="application/xml; oscal-model=poam;federal-use=poam;"/>
    <rlink href="./attachments/POAMs/SAMPLE_POAM_20230531.xlsx" media-type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;oscal-model=none;federal-use=poam;"/>
</resource>
```

```xml
<resource uuid="11111111-2222-4000-8000-001000000048">
    <title>Plan of Actions and Milestones (POAM)</title>
    <prop name="published" value="2023-05-31T00:00:00Z"/>
    <prop name="type" value="plan"/>
    <rlink href="./attachments/POAMs/SAMPLE_POAM_20230531.xml" media-type="application/xml; oscal-model=poam;rmf-use=poam;"/>
    <rlink href="./attachments/POAMs/SAMPLE_POAM_20230531.xlsx" media-type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;oscal-model=none;rmf-use=poam;"/>
</resource>
```

## Consequences

Without this change, it is impractical for FedRAMP developers and community adopters to identify attachments, OSCAL or non-OSCAL, when multiple options exist with FedRAMP-specific use cases with their own business logic. For Approach 4 and others, community developers will need to invest effort in adding or changing the implementation. Identifying attachment data format and use case consistently for each attachment gives the most precision with limited overhead. It also provides an onramp to generalize this approach without "namespace squatting" in the interim.
