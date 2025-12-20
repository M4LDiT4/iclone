# Problem Framing – Memory-based RAG Server

## 1. Problem Statement

Users need a way to **create, share, and query isolated memories** using natural language. A *memory* represents a bounded knowledge space owned by a user and optionally shared with other users (viewers).

When a viewer queries a memory:

* Responses must be **grounded exclusively** in the memories they are authorized to access
* Responses must **not include information from unrelated memories**, even if they belong to the same owner
* Responses must **mimic the memory owner’s tone and personality**, as defined in the memory’s metadata
* Responses must be returned with **low latency** via an API consumable by multiple client applications

The system must ensure **strong isolation**, **controlled sharing**, and **consistent behavior**, while remaining reusable across multiple products and clients.

---

## 2. Actors (Who Is the User?)

### 2.1 End User

The end user interacts with the system either as a **memory owner** or a **memory viewer**.

#### Memory Owner

* Creates memories that are ingested by the system
* Each memory is **isolated**, even from other memories owned by the same user
* Defines metadata for each memory (e.g., tone, personality, intent)
* Explicitly grants access to viewers

#### Memory Viewer

* Is granted access to one or more memories
* Asks questions in natural language
* Expects accurate, grounded, and stylistically consistent answers
* Does not care about embeddings, models, or infrastructure

---

### 2.2 Client Application

* Mobile or other client-facing application
* Communicates with the RAG server via HTTP APIs
* Manages user sessions, authentication state, and UI concerns
* Does not implement retrieval or reasoning logic

---

### 2.3 System Operator

* Manages memory ingestion pipelines
* Monitors system health, latency, and errors
* Evolves retrieval quality (chunking, ranking, prompts)
* Owns operational and architectural decisions

---

## 3. User Needs

* Users need answers based **only** on data they are authorized to access
* Users need memories to be updated and queried **without retraining models**
* Users need **consistent answers** across repeated queries with the same context
* Client applications need a **simple, stable, and reusable API**

---

## 4. Core Constraints

### 4.1 Functional Constraints

* Must support natural language queries
* Must support document and memory ingestion
* Must isolate knowledge **per memory**, not just per user
* Must support controlled sharing of memories with viewers

---

### 4.2 Non-Functional Constraints

* Low latency for query responses
* Horizontal scalability
* Deterministic retrieval behavior
* Probabilistic generation behavior
* Clear failure modes (retrieval failure ≠ LLM failure)

---

## 5. Success Criteria

The system is considered successful if:

* Queries return answers grounded in relevant memory documents
* No cross-user or cross-memory data leakage occurs
* Newly ingested memories become queryable without redeployment
* The RAG server can be reused across multiple projects
* Architectural decisions are documented and traceable via ADRs

---

## 6. Explicit Non-Goals

The system explicitly does **not** aim to:

* Train or fine-tune large language models
* Guarantee factual correctness beyond the retrieved memory context
* Perform autonomous reasoning, agents, or tool use
* Handle real-time or streaming knowledge ingestion (v1)

---

## 7. Guiding Principles

* **Memory isolation by default**
* **Retrieval before generation**
* **Explicit authorization boundaries**
* **Deterministic systems before probabilistic ones**
* **Simple APIs with complex internals**

---

## 8. Glossary of Terms

### Memory

A bounded, isolated knowledge space owned by a user. A memory contains documents, metadata (tone, personality), and access controls. Memories are the primary isolation unit of the system.

### Memory Owner

The user who creates and controls a memory. The owner defines metadata and grants access to viewers.

### Memory Viewer

A user who is granted permission to query a specific memory but cannot modify its contents.

### Document

A logical unit of knowledge ingested into a memory, derived from a source such as text, markdown, or structured data.

### Chunk

A fragment of a document optimized for retrieval. Chunks are the atomic unit stored in the vector database.

### Embedding

A numerical vector representation of a chunk or query, used for semantic similarity search.

### Vector Store

A datastore optimized for storing embeddings and performing similarity search with metadata filtering.

### Retriever

The component responsible for selecting relevant chunks for a query, scoped to a specific memory and authorization context.

### Prompt

A structured input sent to the LLM that includes system instructions, retrieved context, memory metadata, and the user query.

### Tone & Personality Metadata

Attributes defined by the memory owner that influence how responses are generated (e.g., formal, casual, reflective).

### RAG Server

The backend system responsible for ingestion, retrieval, prompt assembly, and LLM invocation.

---

## 9. Outcome of This Document

This document defines the **problem space, scope, constraints, and vocabulary** for the Memory-based RAG Server. It serves as the foundation for:

* System context diagrams
* High-level architecture (`architecture.md`)
* Architectural Decision Records (ADRs)
* API design and service decomposition
