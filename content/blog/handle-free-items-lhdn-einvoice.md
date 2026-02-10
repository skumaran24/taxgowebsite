---
title: "How to Handle Free Items in LHDN e-Invoice (When Quantity Cannot Be Zero)"
date: "2026-02-10"
description: "Learn the correct and compliant ways to handle free items, promotional gifts, and FOC items in LHDN e-Invoice when zero quantity is not allowed."
author: "TaxGo Team"
tags: ["e-invoice", "LHDN", "how-to", "compliance"]
image: "/images/taxgologo.png"
---

One common question businesses face when implementing LHDN e-Invoice is:

> "How do we include free items when LHDN does not allow zero quantity?"

This usually happens with:

- Free gifts
- Promotional items
- Buy-one-free-one (BOGO) deals
- Complimentary services

If handled incorrectly, these invoices may be **rejected by LHDN**.

This article explains the correct and compliant ways to handle free items under Malaysia's e-Invoice requirements.

## Why Zero Quantity Is a Problem

Under LHDN e-Invoice validation rules:

- Invoice line items are expected to have a **positive quantity**
- Quantity = 0 is **not accepted**
- Zero quantity often triggers schema or business validation errors

This means the traditional approach of:

| Field | Value |
|---|---|
| Quantity | 0 |
| Unit Price | RM 0.00 |

**Will fail LHDN validation.**

## Common Real-World Scenarios

Businesses usually encounter this in cases like:

- "Free item with every purchase"
- "FOC (Free of Charge) items"
- "Complimentary samples"
- "Marketing giveaways listed in invoice"

Even though the item is free, LHDN still expects structured, logical invoice data.

## Recommended Approach 1: Quantity = 1, Unit Price = RM 0.00

This is the most common and safest approach.

**Example:**

| Field | Value |
|---|---|
| Quantity | 1 |
| Unit Price | RM 0.00 |
| Line Amount | RM 0.00 |
| Tax Amount | RM 0.00 |

**Why this works:**

- Quantity is non-zero
- Total amount is correctly zero
- LHDN validations pass
- Clear audit trail

This approach clearly communicates: *"One item was provided, free of charge."*

## Recommended Approach 2: Nominal Price + Discount (Advanced)

Some businesses prefer to reflect the actual value of the free item.

**Example:**

| Field | Value |
|---|---|
| Quantity | 1 |
| Unit Price | RM 50.00 |
| Discount | RM 50.00 |
| Net Line Amount | RM 0.00 |

**When to use this:**

- Promotions where value disclosure is important
- Internal revenue tracking
- Detailed commercial agreements

**Important — ensure:**

- Discount fields are correctly supported
- Net payable amount remains RM 0.00
- Tax calculation aligns with LHDN rules

## What You Should Avoid

Avoid these patterns:

- Quantity = 0
- Negative quantities
- Missing line items
- Hiding free items outside invoice lines

These approaches often lead to:

- LHDN rejection
- Inconsistent audit records
- Compliance risk during review

## Tax Treatment for Free Items

Generally:

- If no consideration is charged, tax amount should be **RM 0**
- If tax rules apply due to deemed supply, **consult your tax advisor**

Always ensure consistency between:

- Quantity
- Price
- Discount
- Tax fields

## How TaxGo Handles Free Items

TaxGo automatically:

- **Validates quantity rules** before submission
- **Prevents zero-quantity** line items
- **Ensures invoice structure** complies with LHDN requirements
- **Supports both** RM 0 pricing and discount-based approaches

This avoids last-minute rejection and resubmission.

## Final Thoughts

Free items are common in business — but e-Invoice rules require structured handling.

The key takeaway: **Never use zero quantity for free items in LHDN e-Invoice.**

Using the correct approach ensures:

- Smooth validation
- Accurate records
- Full compliance

---

Need help validating invoices before submission? [TaxGo helps businesses handle LHDN e-Invoice rules correctly — including free items](/#contact).
