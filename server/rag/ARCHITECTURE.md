# Retrieval-Augmented Generation (RAG) – Server Architecture

## 1. Purpose of This Document

This document describes the **high-level and low-level architecture** of a Retrieval-Augmented Generation (RAG) system implemented as a **server-side application**. It is intended to:

* Serve as a **single source of truth** for the system design
* Be shareable as the project scales
* Help future contributors understand *why* and *how* the system is structured

This document focuses on **architecture**, not implementation details.

---

## 2. System Overview

The RAG system allows clients to query a knowledge base using natural language. The server retrieves relevant documents and uses a Large Language Model (LLM) to generate grounded responses.

### Core Responsibilities

* Accept user queries
* Retrieve relevant knowledge from a vector database
* Generate answers using an LLM
* Securely manage models, data, and API keys

---

## 3. High-Level Architecture

```
Client Applications
(Web / Mobile / CLI)
        |
        v
API Layer (HTTP / REST)
        |
        v
Application Layer (RAG Orchestration)
 ├── Query Handling
 ├── Ingestion Handling
 └── Prompt Construction
        |
        v
Infrastructure Layer
 ├── Embedding Service
 ├── Vector Database
 └── LLM Provider
```

---

## 4. Architectural Layers

### 4.1 Client Layer

**Responsibility:**

* Collect user input
* Display generated answers

**Constraints:**

* No embedding logic
* No direct access to vector database or LLM

---

### 4.2 API Layer

**Responsibility:**

* Expose endpoints
* Validate requests
* Handle authentication (future)

**Example Endpoints:**

* `POST /rag/query`
* `POST /rag/ingest`

This layer acts as the **boundary** between external systems and internal logic.

---

### 4.3 Application Layer (Core RAG Logic)

**Responsibility:**

* Orchestrate the RAG workflow
* Coordinate retrieval and generation

**Key Components:**

* **Query Use Case**

  * Accepts user question
  * Embeds query
  * Retrieves relevant documents
  * Builds prompt
  * Requests LLM completion

* **Ingestion Use Case**

  * Accepts raw documents
  * Splits documents into chunks
  * Generates embeddings
  * Stores data in vector database

This layer contains **no infrastructure-specific code**.

---

### 4.4 Domain Layer

**Responsibility:**

* Define core business concepts

**Entities:**

* Document
* DocumentChunk
* Embedding
* QueryResult

**Rules:**

* Independent of frameworks
* Independent of databases
* Independent of LLM providers

---

### 4.5 Infrastructure Layer

**Responsibility:**

* Interact with external systems

**Components:**

* **Embedding Adapter**

  * Generates vector embeddings

* **Vector Database Adapter**

  * Stores embeddings
  * Performs similarity search

* **LLM Adapter**

  * Sends prompts to LLM
  * Returns generated text

All infrastructure components are accessed via **interfaces**.

---

## 5. Data Flow Diagrams

### 5.1 Document Ingestion Flow

```
Raw Document
 → Chunking
 → Embedding Generation
 → Vector Database Storage
```

---

### 5.2 Query Flow

```
User Question
 → Query Embedding
 → Vector Search (Top-K)
 → Context Assembly
 → Prompt Construction
 → LLM Generation
 → Response to Client
```

---

## 6. Prompt Architecture

The prompt follows a **context-first** strategy:

```
System Instruction
Context (retrieved documents)
User Question
```

**Design Rule:**

* The LLM must not hallucinate answers outside the provided context

---

## 7. Non-Functional Requirements

### Security

* API keys stored server-side
* No raw document exposure to clients

### Scalability

* Stateless API layer
* Vector database supports large-scale similarity search

### Maintainability

* Clear separation of concerns
* Adapter-based infrastructure

---

## 8. Deployment Architecture

```
Dockerized API Server
 ├── RAG Application
 ├── Vector Database
 └── Optional Cache (Redis)
```

The system supports both **local development** and **cloud deployment**.

---

## 9. Architectural Decisions (ADRs)

Key decisions should be documented separately:

* Why RAG instead of fine-tuning
* Why server-side embeddings
* Why vector database over keyword search

---

## 10. Multi-Tenant Knowledge Base Architecture

### 10.1 Definition

The system supports a **multi-tenant knowledge base**, where a single RAG server instance serves multiple independent tenants (e.g., users, teams, organizations, or projects). Each tenant’s data is logically isolated, even though infrastructure and application code are shared.

A tenant must never retrieve or generate responses based on another tenant’s data.

---

### 10.2 Tenant Model

**Tenant Identifier (`tenantId`)**

* Every request is associated with a resolved `tenantId`
* The `tenantId` is derived from authentication context (not trusted directly from the client)

---

### 10.3 Data Isolation Strategy

The system uses **metadata-based tenant isolation**.

Each stored document chunk includes tenant metadata:

```
DocumentChunk
 ├── id
 ├── tenantId
 ├── embedding
 ├── text
 └── metadata
```

Vector database searches are always filtered by `tenantId`.

---

### 10.4 Ingestion Flow (Multi-Tenant)

```
Authenticated Request
 → Resolve tenantId
 → Chunk document
 → Generate embeddings
 → Store with tenantId metadata
```

---

### 10.5 Query Flow (Multi-Tenant)

```
Authenticated Request
 → Resolve tenantId
 → Embed user question
 → Vector search (filtered by tenantId)
 → Context assembly
 → Prompt construction
 → LLM generation
 → Tenant-scoped response
```

---

### 10.6 Security Considerations

* Tenant filtering is enforced **server-side**
* No cross-tenant vector searches are allowed
* Prompt context must only include documents from the same tenant
* Logs and traces must not expose raw tenant data

---

### 10.7 Extensibility

The multi-tenant design supports:

* Workspace-based knowledge bases
* Organization-level document ownership
* Future per-tenant limits (rate limits, storage quotas)

---

## 11. Future Extensions

* Authentication and access control
* Streaming responses
* Hybrid search (keyword + vector)
* Multi-tenant knowledge bases

---

## 12. Summary

This architecture ensures:

* Clear separation of concerns
* Secure and scalable RAG implementation
* Documentation-first development

The system is designed to evolve without breaking existing clients.
