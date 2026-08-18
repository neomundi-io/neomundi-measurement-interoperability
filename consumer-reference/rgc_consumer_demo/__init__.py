"""NeoMundi Measurement Interoperability Contract v0.1 — consumer reference implementation.

Deliberately independent of NeoMundi's producer/backend code — this package
only talks to NeoMundi's PUBLIC endpoints (GET /v1/rgc/schema, GET
/v1/rgc/jwks) and re-implements canonicalization/verification from the
published contract specification, the way any third-party consumer
(an infrastructure operator, a bank, an agent orchestrator) would.

It is a reference implementation and demo, not a production dependency of
NeoMundi's own services — nothing on NeoMundi's side imports from this
package.

NeoMundi measures. The consuming infrastructure decides what to do with
that measurement — this package illustrates one possible way to receive,
verify, and act on a contract; it does not impose a policy.
"""
