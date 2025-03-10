# 15. Constraint Identifier Strategy

Date: 2025-03-10

## Status

Proposed

## Context

The current approach to generating constraint identifiers involves developers manually creating descriptive IDs
that include keywords explaining the model location and constraint purpose. This method

- requires significant manual effort;
- creates inconsistent naming patterns;
- makes identifier generation time-consuming and error-prone; and
- lacks a systematic approach to identifier allocation.

The existing process means each developer must

- craft unique, descriptive identifiers;
- ensure no duplicate IDs exist;
- manually encode contextual information into the ID; and
- spend additional time on documentation and tracking.

## Decision

Below we propose three different approaches constraint ID management strategy. We propose moving forward with Approach 3.

1. Do nothing
2. Alternative manual ID scheme
3. Incrementing numeric ID scheme

### Approach 1: Do Nothing

The lowest effort solution is to maintain the existing approach where developers create unique, descriptive identifiers for each constraint. Continuing with this approach would

- preserve current development practices;
- continue to rely on manual, context-rich ID generation; and
- perpetuate the existing challenges of inconsistency and complexity.

### Approach 2: Alternative Manual Name Scheme

A more arduous approach is to develop a new manual naming convention that developers would consistently follow. This approach would

- attempt to create more consistency across identifiers;
- require ongoing manual maintenance and enforcement;
- not be easily automated due to the need for human judgment;
- potentially create additional cognitive overhead for developers;
- lack a systematic method for ID allocation; but
- still depend on individual developer interpretation and diligence

### Approach 3:Incrementing Numeric ID Approach

A middle-ground approach is to standardize constraint identifiers using the following convention.

- Prefix: `frr` (representing FedRAMP Requirement);
- followed by an incrementing integer (e.g., `frr100`, `frr101`, `frr102`) like [the constraint style guide](https://github.com/GSA/fedramp-automation/blob/14771a6a9597ae59ad916e2cac6d2ea54c64f249/src/validations/styleguides/STYLE.md), picking up from the last integer in that range; and
- integers will be allocated sequentially.

Benefits of this approach include:

- simplification of identifier generation;
- reduction of manual effort;
- a predictable naming pattern;
- elimination of subjective manual ID creation and maintenance; and
- support for easier tracking and management of constraints.

## Consequences

Implementing Approach 3 will have the following positive benefits.

- faster constraint development;
- more consistent identifier naming;
- reduced cognitive load on developers;
- easier long-term maintenance; and
- simplified ID tracking.


However, there are potentially negative consequences to address and potentially mitigate, such as

- initial transition effort required;
- loss of contextual information in ID itself;
- developers must rely on separate documentation for constraint details; and
- potential short-term confusion during adoption.

The team will need to maintain a separate mapping of constraint details to these standardized IDs to preserve contextual information.