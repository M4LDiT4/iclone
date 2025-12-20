# High-Level Architecture – Memory-based RAG Server

## 1. Purpose of This Document

This document defines the **high-level architecture** of the Memory-based RAG Server. It identifies the major components, their responsibilities, and how they interact, without binding the system to specific technologies.

This document serves as the foundation for:

* Component-level design
* API contracts
* Architectural Decision Records (ADRs)

---

## 2. Architectural Overview

At a high level, the system is composed of **five major subsystems**:

1. Client Interaction Layer
2. Authorization & Memory Access Layer
3. Ingestion Pipeline
4. Retrieval Pipeline
5. Generation Pipeline

Each subsystem enforces a specific concern and communicates via explicit interfaces.

---

## 3. System Diagram (Conceptual)

```
+-------------------+
|   Client Apps     |
| (Mobile / Web)    |
+---------+---------+
          |
          | HTTP API
          v
+---------+---------+
|  RAG API Gateway  |
+---------+---------+
          |
          v
+---------+-------------------------------+
| Authorization & Memory Access Layer     |
| - Auth Context Validation               |
| - Memory Ownership & Viewer Checks      |
+---------+-------------------------------+
          |
          +-------------------+
          |                   |
          v                   v
+---------+---------+   +-----+----------------+
| Ingestion Pipeline |   | Retrieval Pipeline   |
|                   |   |                      |
| - Chunking         |   | - Query Embedding    |
| - Embedding        |   | - Memory-scoped      |
| - Metadata Attach |   |   Similarity Search  |
+---------+---------+   +-----+----------------+
          |                   |
          v                   v
+---------+-------------------------------+
|        Persistent Storage Layer         |
| - Vector Store (Chunks + Embeddings)    |
| - Metadata Store (Memories, ACLs)       |
+---------+-------------------------------+
                              |
                              v
                    +---------+-------------+
                    | Generation Pipeline   |
                    | - Prompt Assembly     |
                    | - Tone & Personality  |
                    | - LLM Invocation      |
                    +---------+-------------+
                              |
                              v
                       +------+------+
                       |   Response   |
                       +-------------+
```

---

## 4. Core Components

### 4.1 RAG API Gateway

**Responsibilities:**

* Exposes HTTP APIs to client applications
* Accepts authenticated requests
* Routes requests to appropriate internal pipelines

**Non-Responsibilities:**

* Does not enforce memory authorization
* Does not perform retrieval or generation

---

### 4.2 Authorization & Memory Access Layer

**Responsibilities:**

* Validates user identity from auth context
* Enforces memory ownership and viewer permissions
* Resolves the target memory for each request

**Key Invariant:**

* No ingestion, retrieval, or generation occurs without passing this layer

---

### 4.3 Ingestion Pipeline

**Responsibilities:**

* Accepts documents associated with a memory
* Splits documents into chunks
* Generates embeddings
* Attaches memory ID and metadata to each chunk
* Persists chunks to storage

**Characteristics:**

* Can be synchronous or asynchronous
* Idempotent per document

---

### 4.4 Retrieval Pipeline

**Responsibilities:**

* Embeds incoming queries
* Performs similarity search scoped to a single memory
* Applies deterministic ranking and filtering

**Key Constraint:**

* Retrieval queries MUST include a memory identifier

---

### 4.5 Generation Pipeline

**Responsibilities:**

* Assembles prompt context
* Injects tone and personality metadata
* Invokes LLM provider
* Produces final answer

**Non-Responsibilities:**

* Does not retrieve data
* Does not enforce authorization

---

### 4.6 Persistent Storage Layer

**Components:**

* **Vector Store**: Stores chunk embeddings with memory-scoped metadata
* **Metadata Store**: Stores memory definitions, ACLs, and configuration

**Key Property:**

* Storage enforces logical separation via memory identifiers

---

## 5. Key Architectural Decisions (Preview)

These decisions will be formalized as ADRs:

* Memory is the primary isolation boundary
* Authorization precedes retrieval
* Retrieval is deterministic; generation is probabilistic
* Tone and personality are applied at prompt assembly time
* Client applications are thin and stateless

---

## 6. Failure Mode Separation

* Authorization failure → request rejected, no retrieval
* Retrieval failure → empty or partial context
* LLM failure → surfaced as generation error

Each failure mode is observable and debuggable independently.

---

## 7. Evolution Considerations

This architecture supports future extensions:

* Streaming responses
* Multi-memory queries (future ADR)
* Advanced ranking strategies
* Audit logging per memory

---

## 8. Output of This Phase

At the end of this phase, we have:

* A shared mental model of the system
* Clear component boundaries
* Identified decision points for ADRs

This document feeds directly into:

* `ADR-001: Memory-based Isolation Model`
* API specifications
* Component-level design documents
