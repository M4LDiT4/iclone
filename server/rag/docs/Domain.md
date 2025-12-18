# Domain & Interfaces – RAG Server

## Purpose of This Document

This document defines the **core domain model** and **application interfaces (ports)** for the RAG server.

It intentionally avoids:

* Framework-specific code (FastAPI)
* Infrastructure details (Firebase, Pinecone, LLM vendors)
* Implementation concerns

The goal is to establish a **stable core** that:

* Drives implementation
* Prevents architectural drift
* Allows infrastructure to change without rewriting business logic

---

## 1. Architectural Principle

The system follows **Clean Architecture / Hexagonal Architecture** principles:

* Domain and use cases do **not depend on infrastructure**
* Infrastructure depends on domain-defined interfaces
* All external systems are accessed via adapters

```
Domain → Application → Interfaces ← Infrastructure
```

---

## 2. Domain Model

### 2.1 User

Represents an authenticated identity (resolved from Firebase).

**Attributes:**

* `id` (string) – Firebase UID
* `email` (string)
* `createdAt` (datetime)

**Rules:**

* A user may belong to **multiple memories**
* Users do not directly own data without a membership

---

### 2.2 Memory (Tenant)

Represents an isolated knowledge space. 

**Attributes:**

* `id` (string)
* `name` (string)
* `ownerUserId` (string)
* `createdAt` (datetime)

**Rules:**

* A memory is the primary isolation boundary
* All documents, chunks, and queries are scoped to a memory

---

### 2.3 MemoryMembership

Defines a **many-to-many relationship** between users and memories.

**Attributes:**

* `userId` (string)
* `memoryId` (string)
* `role` (enum: OWNER | ADMIN | EDITOR | VIEWER)
* `createdAt` (datetime)

**Rules:**

* Authorization decisions are derived from this entity
* A user can have different roles across memories

---

### 2.4 Document

Represents a raw ingested knowledge source.

**Attributes:**

* `id` (string)
* `memoryId` (string)
* `source` (string)
* `createdAt` (datetime)

---

### 2.5 DocumentChunk

Represents a chunked portion of a document used for retrieval.

**Attributes:**

* `id` (string)
* `documentId` (string)
* `memoryId` (string)
* `content` (string)
* `embedding` (vector)

---

### 2.6 Query

Represents a user query scoped to a memory.

**Attributes:**

* `question` (string)
* `memoryId` (string)
* `userId` (string)

---

### 2.7 QueryResult

Represents the output of a RAG operation.

**Attributes:**

* `answer` (string)
* `sources` (list of DocumentChunk IDs)

---

## 3. Application Interfaces (Ports)

These interfaces define **what the system needs**, not how it is implemented.

---

### 3.1 EmbeddingProvider

Responsible for generating vector embeddings.

```text
EmbeddingProvider
- embed(text: string) → vector
```

**Notes:**

* May be backed by OpenAI, local models, or other providers
* Batch embedding can be added later

---

### 3.2 VectorStore

Responsible for storing and retrieving embeddings.

```text
VectorStore
- upsert(chunks: list[DocumentChunk])
- query(vector, tenantId, topK) → list[DocumentChunk]
```

**Rules:**

* All queries MUST be filtered by tenantId
* Store does not perform authorization

---

### 3.3 LLMProvider

Responsible for generating text from prompts.

```text
LLMProvider
- generate(prompt: string) → string
```

**Rules:**

* Prompt construction is done in application layer
* LLM provider is stateless

---

### 3.4 UserRepository

Responsible for resolving user and tenant context.

```text
UserRepository
- findByUid(uid: string) → User
```

**Rules:**

* Source of truth for tenant resolution
* No authentication logic inside repository

---

## 4. Use Case Dependencies

Use cases depend ONLY on interfaces:

```
QueryKnowledgeBase
 ├── EmbeddingProvider
 ├── VectorStore
 ├── LLMProvider
 └── UserRepository
```

This ensures:

* Testability
* Replaceable infrastructure
* Clear ownership of responsibilities

---

## 5. What This Document Enables

* Parallel development of infrastructure adapters
* Safe refactoring of vendors (Firebase, Pinecone, LLMs)
* Clear onboarding documentation
* Long-term maintainability

---

## 6. What Comes Next

After this document:

1. Define **Use Case specifications**
2. Implement **domain models in code**
3. Create **infrastructure adapters**
4. Expose use cases via FastAPI

This document must be updated if domain rules change.

---

## Summary

This README defines the **core contract of the system**. Everything else in the RAG server exists to support and execute the rules defined here.

If this document remains clean, the system will scale without architectural decay.
