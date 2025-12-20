# System Context & Use Cases – Memory-based RAG Server

## 1. Purpose of This Document

This document defines the **system boundary**, **external actors**, **trust boundaries**, and **core use cases** for the Memory-based RAG Server. It translates the problem framing into concrete interactions without prescribing implementation details.

This document informs:

* High-level architecture diagrams
* API surface design
* Security and authorization ADRs

---

## 2. System Context

### 2.1 System Boundary

The **Memory-based RAG Server** is a backend system responsible for:

* Ingesting memories and associated documents
* Enforcing memory-level isolation and access control
* Retrieving memory-scoped knowledge
* Generating grounded responses using an LLM

The system explicitly **does not**:

* Render UI
* Manage user authentication UX
* Train or fine-tune models

---

### 2.2 External Systems

The RAG Server interacts with the following external systems:

* **Client Applications** (mobile, web)
* **Authentication Provider** (identity verification and token issuance)
* **LLM Provider** (text generation and embeddings)
* **Persistent Stores** (vector store, metadata store)

All external systems are considered **untrusted by default**.

---

## 3. Actors and Responsibilities

### 3.1 End User (Human)

#### As Memory Owner

* Creates memories
* Uploads or submits documents for ingestion
* Defines tone and personality metadata
* Grants or revokes viewer access

#### As Memory Viewer

* Queries a memory in natural language
* Receives grounded, stylistically aligned answers

---

### 3.2 Client Application

* Authenticates users via an external identity provider
* Sends authenticated requests to the RAG Server
* Displays answers and sources to users
* Does not enforce authorization logic

---

### 3.3 System Operator

* Operates ingestion pipelines
* Monitors latency, errors, and retrieval quality
* Evolves prompts and retrieval strategies

---

## 4. Trust Boundaries

### 4.1 Client → RAG Server

* Requests must be authenticated
* User identity and authorization context must be verifiable
* No client-provided memory scope is trusted without validation

### 4.2 Memory Boundary (Critical)

* Each memory is a **hard isolation boundary**
* Retrieval queries must be scoped to exactly one memory
* No cross-memory retrieval is permitted, even for the same owner

### 4.3 RAG Server → LLM Provider

* Only curated prompt context is shared
* No raw credentials or authorization data is exposed
* Memory isolation must be enforced **before** LLM invocation

---

## 5. Core Use Cases

### UC-01: Create Memory

**Primary Actor:** Memory Owner

**Description:**
The memory owner creates a new memory with associated metadata.

**Main Flow:**

1. Owner submits a create-memory request
2. System generates a unique memory identifier
3. Tone and personality metadata are stored
4. Memory is initialized as empty and isolated

**Postconditions:**

* Memory exists and is queryable (empty)
* No viewers are granted by default

---

### UC-02: Ingest Documents into Memory

**Primary Actor:** Memory Owner

**Description:**
The owner adds documents to a specific memory.

**Main Flow:**

1. Owner submits documents for ingestion
2. System validates memory ownership
3. Documents are chunked and embedded
4. Chunks are stored with memory-scoped metadata

**Postconditions:**

* Memory knowledge base is updated
* Documents become retrievable without redeployment

---

### UC-03: Grant Viewer Access

**Primary Actor:** Memory Owner

**Description:**
The owner grants another user permission to query a memory.

**Main Flow:**

1. Owner specifies viewer identity
2. System updates access control metadata
3. Viewer gains read-only access

**Postconditions:**

* Viewer can query the memory
* Viewer cannot modify memory contents

---

### UC-04: Query Memory

**Primary Actor:** Memory Viewer

**Description:**
A viewer queries a memory using natural language.

**Main Flow:**

1. Viewer submits query request
2. System authenticates user
3. System verifies viewer access to the memory
4. Query is embedded
5. Relevant chunks are retrieved **only from the target memory**
6. Prompt is assembled using:

   * Retrieved chunks
   * Memory tone & personality metadata
   * System instructions
7. LLM generates a response
8. Response is returned to the client

**Postconditions:**

* Response is grounded in memory documents
* Response reflects owner-defined tone and personality

---

### UC-05: Unauthorized Query Attempt

**Primary Actor:** Any User

**Description:**
A user attempts to query a memory they are not authorized to access.

**Main Flow:**

1. User submits query
2. Authorization check fails
3. System rejects the request

**Postconditions:**

* No retrieval or LLM call is performed
* No information leakage occurs

---

## 6. Key Invariants (Must Always Hold)

* A query targets **exactly one memory**
* Retrieval never crosses memory boundaries
* Authorization is validated before retrieval
* Tone and personality are applied only from the target memory

---

## 7. Output of This Phase

At the end of this phase, we have:

* A clear system boundary
* Defined trust boundaries
* Enumerated core use cases
* Explicit invariants for memory isolation

This directly feeds into:

* `architecture.md`
* `ADR-001: Memory-based isolation model`
* API contract definitions
