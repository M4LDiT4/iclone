# RAG Memory Server – Architecture & System Design

## 1. Document Type

**Document Type:** Architecture & System Design Specification
**Audience:** Developers, architects, future contributors
**Purpose:** Serve as a single source of truth for how the RAG Memory Server is designed and how its core concepts interact.

This document sits **above ADRs** and **below product requirements**. ADRs justify *decisions*; this document explains the *system itself*.

---

## 2. System Overview

The RAG Memory Server is a **multi-user, multi-memory Retrieval-Augmented Generation (RAG) system**.

A **Memory** is an isolated knowledge space that:

* Is owned by a user
* Can be shared with other users
* Contains documents and embeddings
* Can be queried by authorized users

Each request is always scoped to **exactly one memory**.

---

## 3. Core Concepts

### 3.1 User

A User represents an authenticated identity.

* Users authenticate via Firebase Authentication
* The server trusts Firebase-issued JWTs
* Users do not directly own data without a memory membership

---

### 3.2 Memory

A Memory represents an isolated knowledge space (tenant boundary).

Characteristics:

* Owned by a user
* Can contain multiple documents
* Can be shared with multiple users
* Enforces strict data isolation

Examples:

* Personal memory

---

### 3.3 MemoryMembership

MemoryMembership defines the **many-to-many relationship** between users and memories.

Each membership includes a role:

* OWNER
* VIEWER

All authorization decisions are derived from this relationship.

---

### 3.4 Document

A Document represents a logical unit of content within a memory.

* Belongs to exactly one memory
* Serves as metadata and traceability
* Is not directly queried by the RAG system

---

### 3.5 DocumentChunk

A DocumentChunk is the **retrieval unit** used by the RAG system.

* Derived from a document
* Contains a text segment and its embedding
* Stored in the vector database
* Always scoped to a single memory

---

## 4. Data Relationships

```
User
  ↕ (many-to-many)
MemoryMembership
  ↕
Memory
  ↕ (one-to-many)
Document
  ↕ (one-to-many)
DocumentChunk
```

---

## 5. High-Level Architecture

```
Client Applications
(Web / Mobile)
        |
        | Firebase ID Token (JWT)
        v
FastAPI Server
 ├── Authentication Middleware
 ├── Memory (Tenant) Resolver
 ├── Authorization Guards
 ├── RAG Application Layer
 │    ├── IngestDocument
 │    └── QueryMemory
 └── Infrastructure Adapters
      ├── Firebase JWT Verifier
      ├── Vector Database (Pinecone)
      └── LLM Provider
```

---

## 6. Core System Flows

### 6.1 Create Memory

* User authenticates via Firebase
* Server creates a new memory
* Creator is assigned OWNER role

---

### 6.2 Share Memory

* OWNER or ADMIN adds users to a memory
* Each user is assigned a role
* Access is enforced server-side

---

### 6.3 Ingest Document

* User must have EDITOR or higher role
* Document is stored in relational storage
* Content is chunked
* Embeddings are generated
* Chunks are stored in the vector database

---

### 6.4 Query Memory

* User must have VIEWER or higher role
* Query is embedded
* Vector search is performed with memory-level filtering
* Retrieved chunks are passed to the LLM
* Response is generated and returned

---

## 7. One-Memory-Per-Query Rule

All queries are strictly scoped to a single memory.

Benefits:

* Prevents data leakage
* Simplifies authorization
* Improves retrieval quality
* Keeps prompts coherent

Multi-memory querying is considered a future extension.

---

## 8. Storage Responsibilities

| Data           | Storage                           |
| -------------- | --------------------------------- |
| Users          | Firebase Authentication           |
| Memories       | Database (Firebase)
| Memberships    | Database (Firebase)                     |
| Documents      | Database (Firebase)                     |
| DocumentChunks | Vector DB (Pinecone)              |

---

## 9. Non-Functional Characteristics

### Security

* JWT-based authentication
* Server-side authorization
* Memory-level isolation

### Scalability

* Stateless API server
* Horizontally scalable vector search

### Maintainability

* Clear domain separation
* Adapter-based infrastructure

---

## 10. Related Documents

* ADR-001: Authentication Strategy
* ADR-002: Vector Database Selection
* ADR-003: Multi-Tenant Authorization

---

## 11. Summary

The RAG Memory Server is designed as a **memory-centric, multi-tenant knowledge system** with strict isolation, role-based access, and scalable retrieval-augmented generation.

This document defines *what the system is* and *how its parts interact*, serving as a stable reference as the project evolves.
