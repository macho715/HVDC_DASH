# HVDC UI/UX Strategy 2026

## Stage 4 – metrics

| Persona | Objective | Core KPI | Target Threshold | Sample Measurement Method |
| --- | --- | --- | --- | --- |
| Control Tower Manager | Situational awareness | Urgent shipment visibility rate | ≥ 95% surfaced within 2 minutes | Alert audit log review + median time-to-locate drill |
| Operations Coordinator | Workflow efficiency | Task completion rate | ≥ 90% tasks closed per shift | Shift task tracker completion % |
| Finance & Compliance Analyst | Accessibility | SUS score for finance workflows | ≥ 80 SUS | Quarterly SUS survey on invoice review flow |
| Customer Experience Lead | Scalability | Concurrent dashboard users without degradation | ≥ 200 concurrent users | Load testing with p95 response time monitoring |

## Objective Success Metrics

This section extends the **Stage 4 – metrics** table above to ensure each persona is covered for
all objectives (situational awareness, workflow efficiency, accessibility, scalability) with
clear KPI targets and measurement methods.

| Persona | Objective | KPI | Target Threshold | Sample Measurement Method |
| --- | --- | --- | --- | --- |
| Control Tower Manager | Situational awareness | Median time-to-locate urgent shipment | ≤ 90 seconds | Timed drill from alert receipt to selection in worklist |
| Control Tower Manager | Workflow efficiency | Alert triage completion rate | ≥ 92% within SLA | SLA compliance report by shift |
| Control Tower Manager | Accessibility | Critical alert readability (contrast compliance) | 100% of alert UI meets WCAG 2.2 AA | Quarterly WCAG audit pass rate for alert views |
| Control Tower Manager | Scalability | Real-time alert refresh latency | ≤ 5 seconds at 200 concurrent users | Load test with p95 refresh latency tracking |
| Operations Coordinator | Situational awareness | Gate status accuracy | ≥ 98% accurate vs. ground truth | Weekly reconciliation of gate status vs. shipment logs |
| Operations Coordinator | Workflow efficiency | Task completion rate | ≥ 90% tasks closed per shift | Shift task tracker completion % |
| Operations Coordinator | Accessibility | Task flow SUS score | ≥ 82 SUS | SUS survey after task workflow walkthrough |
| Operations Coordinator | Scalability | Batch update throughput | ≥ 300 updates/hour | Time study on batch edit sessions |
| Finance & Compliance Analyst | Situational awareness | Exception identification time | ≤ 4 minutes per invoice exception | Timed audit on exception discovery in cost view |
| Finance & Compliance Analyst | Workflow efficiency | Invoice resolution cycle time | ≤ 2 business days median | Finance ticketing system median close time |
| Finance & Compliance Analyst | Accessibility | WCAG audit pass rate | ≥ 95% of finance views pass WCAG 2.2 AA | Quarterly WCAG audit results |
| Finance & Compliance Analyst | Scalability | Report generation p95 time | ≤ 20 seconds for 1-year export | Load test on export endpoint |
| Customer Experience Lead | Situational awareness | Customer-impact alert coverage | ≥ 95% incidents tagged to accounts | Incident tagging audit + alert coverage report |
| Customer Experience Lead | Workflow efficiency | Customer update task completion rate | ≥ 92% within 4 hours | CRM task completion report |
| Customer Experience Lead | Accessibility | Support workflow SUS score | ≥ 80 SUS | SUS survey on customer update workflow |
| Customer Experience Lead | Scalability | Concurrent account view load time | ≤ 2.5 seconds p95 at 200 users | Load test with p95 page load time |
