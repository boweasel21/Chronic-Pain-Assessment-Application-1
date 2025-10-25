# The Complete Guide to Prompt Engineering and Context Engineering for Claude AI

**A Comprehensive Manual for Building Effective AI Agents and Applications**

Version 1.0 | October 2025

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Understanding the Fundamentals](#2-understanding-the-fundamentals)
3. [Context Engineering: The Evolution of Prompting](#3-context-engineering)
4. [Core Prompt Engineering Techniques](#4-core-prompt-engineering-techniques)
5. [Claude 4 Specific Best Practices](#5-claude-4-specific-best-practices)
6. [Advanced Techniques and Patterns](#6-advanced-techniques-and-patterns)
7. [Context Management Strategies](#7-context-management-strategies)
8. [When to Use What: Decision Framework](#8-decision-framework)
9. [Common Pitfalls and Solutions](#9-common-pitfalls-and-solutions)
10. [Practical Examples and Templates](#10-practical-examples-and-templates)
11. [Quick Reference Guide](#11-quick-reference-guide)

---

## 1. Introduction

### 1.1 What This Manual Covers

This comprehensive guide synthesizes the latest research and best practices from Anthropic on two critical disciplines for working with Claude AI:

- **Prompt Engineering**: The art of crafting effective instructions and queries
- **Context Engineering**: The science of curating and managing information in the model's context window

### 1.2 Who Should Use This Manual

- AI engineers building production applications
- Developers creating AI agents and autonomous systems
- Product managers designing AI-powered features
- Technical writers crafting AI interactions
- Anyone seeking to maximize Claude's capabilities

### 1.3 Why Both Matter

While prompt engineering focuses on *how* you write instructions, context engineering addresses *what information* the model has access to at any given time. Together, they form the foundation of effective AI system design.

**The Evolution:**
```
Early Days: Focus on prompt text alone
           ↓
Current Era: Holistic context management
           ↓
Future: Self-managing, context-aware agents
```

---

## 2. Understanding the Fundamentals

### 2.1 The Shift from Prompting to Context

Building with language models is evolving from finding the right words and phrases for prompts to answering the broader question: **"What configuration of context is most likely to generate our model's desired behavior?"**

#### Key Definitions

**Context**: The complete set of tokens included when sampling from a large language model, including:
- System prompts and instructions
- Tools and their specifications
- Model Context Protocol (MCP) resources
- External data and retrieved documents
- Conversation history
- User inputs

**Context Window**: The finite token limit (e.g., 200K tokens for Claude) that constrains how much information can be included.

**Context Engineering**: The strategies for curating and maintaining the optimal set of tokens during LLM inference, with information being cyclically refined as agents operate over multiple turns.

**Prompt Engineering**: Methods for writing and organizing LLM instructions for optimal outcomes within a single turn or interaction.

### 2.2 Why Context Engineering Matters

As AI agents move beyond single-turn interactions to multi-step, long-horizon tasks, they generate increasing amounts of data that could be relevant for subsequent operations. Without proper context engineering:

**Problems:**
1. **Context Rot**: As context length grows, retrieval precision falls—adding extensive logs may hide critical details
2. **Limited Attention**: Models, like humans, can't effectively process unlimited information simultaneously
3. **Token Inefficiency**: Valuable context space gets consumed by irrelevant information
4. **Evolving Tasks**: Agents in loops accumulate tool outputs and intermediate results that require management
5. **Cost Escalation**: More tokens = higher API costs

### 2.3 Prompt Engineering vs. Fine-Tuning

**When to use Prompt Engineering:**
✅ Resource-efficient (only needs text input, not GPUs)
✅ Cost-effective for cloud services
✅ Works across model updates without retraining
✅ Near-instant results and fast iteration
✅ Minimal data requirements (few-shot or zero-shot)
✅ Easy domain adaptation
✅ Better at helping models understand external content
✅ Preserves general knowledge
✅ Transparent and debuggable

**When to consider Fine-Tuning:**
- Highly specialized, consistent output format requirements
- Large dataset of domain-specific examples available
- Task performance plateaus with prompt engineering
- Need to optimize for minimal context usage

**General Rule**: Start with prompt engineering. It solves 95% of use cases more effectively.

---

## 3. Context Engineering

### 3.1 Core Principles

#### Principle 1: The "Goldilocks Zone" for System Prompts

System prompts should strike a balance between two extremes:

**❌ Too Rigid (Over-Specification)**
```
Bad Example:
If the user asks about weather AND it's a city name AND they want temperature, use the weather tool.
If they ask about weather but mention "feel" or "clothing", don't use the tool, just give advice.
If they ask about weather for a country, first ask them which city.
If they misspell a city name...
[continues with 50 more if-else conditions]
```

**Problems:**
- Fragile and breaks with edge cases
- High maintenance burden
- Doesn't generalize well
- Creates rigid, un-natural interactions

**❌ Too Vague (Under-Specification)**
```
Bad Example:
Use the weather tool when appropriate. Be helpful to users.
```

**Problems:**
- Leaves too much to interpretation
- Assumes shared context
- Inconsistent behavior
- No concrete guidance

**✅ Just Right (Optimal Altitude)**
```
Good Example:
Use the weather tool when users request current or forecasted weather conditions 
for specific locations. Provide the data in a clear format.

For questions about how weather feels or what to wear, use the weather tool to get 
current conditions, then provide practical advice based on that data.

If location is ambiguous, ask for clarification before calling the tool.
```

**Benefits:**
- Clear principles, not exhaustive rules
- Flexible enough to handle variations
- Provides strong heuristics
- Generalizes to edge cases

#### Principle 2: Think in Holistic Context State

Rather than focusing solely on prompt text, consider the complete context state available to the model at inference time:

**Context State Components:**

```
┌─────────────────────────────────────────┐
│ System Instructions & Role Definition   │
├─────────────────────────────────────────┤
│ Tool Definitions & MCP Resources        │
├─────────────────────────────────────────┤
│ Retrieved External Data                 │
├─────────────────────────────────────────┤
│ Conversation History                    │
├─────────────────────────────────────────┤
│ Current User Input                      │
├─────────────────────────────────────────┤
│ Intermediate Tool Results               │
└─────────────────────────────────────────┘
      ↓
 Total Context (200K token limit)
```

**Key Questions to Ask:**
- What does the model need to know right now?
- What can be retrieved later if needed?
- What's consuming tokens but not providing value?
- How will this context evolve over the conversation?

#### Principle 3: Iterative Context Curation

Context engineering is not a one-time setup—it's an ongoing process that happens each time you decide what to pass to the model:

**The Context Curation Loop:**
```
1. User Query Received
   ↓
2. Assess Context Needs
   - What information is required?
   - What can be retrieved vs. preloaded?
   ↓
3. Select Relevant Information
   - Prioritize by importance
   - Respect token budget
   ↓
4. Generate Response
   - Model processes curated context
   ↓
5. Update Context State
   - Store relevant results
   - Discard ephemeral data
   ↓
6. Next Query (repeat)
```

### 3.2 Context Management Strategies

#### Strategy 1: Dynamic Information Loading

Instead of loading all possible information upfront, fetch data as needed.

**Anti-Pattern:**
```python
# Load entire database into context
all_customers = database.get_all_customers()  # 50,000 records
all_orders = database.get_all_orders()        # 200,000 records
all_products = database.get_all_products()    # 10,000 records

prompt = f"""
Here is all our data:
Customers: {all_customers}
Orders: {all_orders}
Products: {all_products}

Now analyze Q4 sales trends for enterprise customers.
"""
# Result: Context overflow, high cost, poor performance
```

**Best Practice:**
```python
# Dynamic, targeted retrieval
prompt = """
Generate SQL queries to analyze Q4 sales trends for enterprise customers.
Use the database_query tool to retrieve only the data you need.
"""

# Agent generates and executes:
# Query 1: SELECT customer_id, company_name FROM customers WHERE tier = 'enterprise'
# Query 2: SELECT * FROM orders WHERE customer_id IN (...) AND date >= '2024-10-01'
# Query 3: SELECT product_name, revenue FROM products WHERE product_id IN (...)

# Result: Efficient, scalable, targeted analysis
```

**Benefits:**
- Circumvents token limit constraints
- Reduces hallucination risk
- Lower costs
- Mirrors human problem-solving

#### Strategy 2: Context Prioritization Framework

Organize information by priority to ensure critical data always fits:

**Priority Tiers:**

**Tier 1: High Priority (Always Include)**
- Current task description
- Recent tool results (last 1-3 calls)
- Critical system instructions
- Immediately relevant user context

**Tier 2: Medium Priority (Include When Space Permits)**
- Relevant examples (2-3 most applicable)
- Historical decisions from this session
- Background context and documentation
- Extended conversation history

**Tier 3: Low Priority (On-Demand Retrieval)**
- Full file contents
- Complete documentation
- Entire conversation history
- Auxiliary reference materials

**Implementation:**
```python
def build_context(task, token_budget=180000):
    context = []
    tokens_used = 0
    
    # Tier 1: Always include
    tier1 = [
        system_instructions,
        current_task_description,
        recent_tool_results[-3:]
    ]
    context.extend(tier1)
    tokens_used += count_tokens(tier1)
    
    # Tier 2: Add if space allows
    remaining = token_budget - tokens_used
    if remaining > 10000:
        tier2 = [
            get_relevant_examples(task, n=3),
            get_session_history(last_n_turns=5)
        ]
        context.extend(tier2)
        tokens_used += count_tokens(tier2)
    
    # Tier 3: Only add if generous space remains
    remaining = token_budget - tokens_used
    if remaining > 50000:
        tier3 = get_full_documentation()
        context.append(tier3)
    
    return context
```

#### Strategy 3: Token Budget Management

**Monitoring Checklist:**

1. **Track per-turn consumption**
   ```
   Tool definitions: ~5,000 tokens
   System prompt: ~2,000 tokens
   Conversation history (10 turns): ~15,000 tokens
   Current query + response: ~3,000 tokens
   ---
   Total: ~25,000 tokens per turn
   ```

2. **Measure tool call efficiency**
   - Does this tool provide value for its token cost?
   - Are there more token-efficient alternatives?
   - Can we compress or summarize tool outputs?

3. **Analyze window utilization**
   ```
   200K token window
   - 40K used (20%)
   - 160K available (80%)
   
   Are we:
   ✅ Efficiently using available space?
   ❌ Wasting tokens on redundant info?
   ❌ Running out of space too soon?
   ```

4. **Test at different lengths**
   - Does performance degrade with more context?
   - Is there a sweet spot for context length?
   - Do we get diminishing returns after X tokens?

### 3.3 Tools and Context Engineering

#### Well-Documented Tools

Think of tool descriptions as mini-manuals for a new team member:

**Poor Tool Documentation:**
```json
{
  "name": "search",
  "description": "Searches stuff",
  "parameters": {
    "q": "string",
    "user": "string"
  }
}
```

**Problems:**
- What does it search? (web, database, files?)
- What format is "q"? (keywords, natural language?)
- What is "user"? (ID, email, name?)
- What does it return?

**Excellent Tool Documentation:**
```json
{
  "name": "search_knowledge_base",
  "description": "Searches the company knowledge base using semantic search. Returns up to 10 most relevant articles ranked by relevance score. Best for finding internal documentation, policies, and procedures.",
  "parameters": {
    "search_query": {
      "type": "string",
      "description": "Natural language search query. Use specific terms and phrases for better results. Example: 'employee vacation policy remote workers'"
    },
    "user_id": {
      "type": "string",
      "description": "Unique identifier for the requesting user. Format: UUID (e.g., '123e4567-e89b-12d3-a456-426614174000'). Used for access control and audit logging."
    },
    "max_results": {
      "type": "integer",
      "description": "Maximum number of results to return. Default: 10. Range: 1-50.",
      "default": 10
    }
  },
  "returns": {
    "type": "array",
    "description": "Array of article objects, each containing: title, url, excerpt (first 200 chars), relevance_score (0-1), last_updated (ISO date)"
  }
}
```

**Benefits:**
- Makes implicit context explicit
- Defines specialized formats
- Clarifies relationships
- Enables autonomous, correct usage

#### Token-Efficient Tool Responses

Implement strategies to control response size:

**1. Pagination**
```json
{
  "name": "list_database_records",
  "parameters": {
    "page": "integer (default: 1)",
    "page_size": "integer (default: 50, max: 500)"
  }
}
```

**2. Range Selection**
```json
{
  "name": "get_log_entries",
  "parameters": {
    "start_time": "ISO timestamp",
    "end_time": "ISO timestamp",
    "severity": "['ERROR', 'WARN', 'INFO', 'DEBUG']"
  }
}
```

**3. Filtering**
```json
{
  "name": "fetch_customer_data",
  "parameters": {
    "fields": "array of field names to return (e.g., ['name', 'email', 'tier'])"
  }
}
```

**4. Truncation with Smart Defaults**
```python
def get_file_content(filepath, max_tokens=25000):
    content = read_file(filepath)
    tokens = count_tokens(content)
    
    if tokens <= max_tokens:
        return content
    else:
        truncated = truncate_to_tokens(content, max_tokens)
        return f"""{truncated}

[Note: Content truncated to {max_tokens} tokens. 
Original file: {tokens} tokens. 
Use range_selection to get specific sections.]"""
```

#### Prompt-Engineering Tool Errors

Make error messages instructive, not just informative:

**Poor:**
```
❌ "Error: Invalid input"
❌ "Error code: E1043"
❌ "Exception: ValueError"
```

**Excellent:**
```
✅ "Error: 'start_date' must be in YYYY-MM-DD format. 
    Received: '01/15/2025'. 
    Did you mean: '2025-01-15'?"

✅ "Error: 'user_email' domain '@test.com' not in allowed domains. 
    Allowed domains: ['@company.com', '@company.co', '@contractor.company.com']. 
    Try: Verify the email address or use 'user_id' instead."

✅ "Error: Query returned 50,000 results, exceeding the 10,000 limit. 
    Suggestions:
    - Add date range filter (e.g., 'created_after':'2024-01-01')
    - Use more specific search terms
    - Narrow down with 'category' filter"
```

### 3.4 Sub-Agents and Context Decomposition

For complex workflows, spawn specialized sub-agents with focused contexts:

**Pattern:**
```
Main Agent (broad context)
    ↓
Identifies subtask requiring specialization
    ↓
Spawns Sub-Agent (narrow, focused context)
    ↓
Sub-Agent completes focused task efficiently
    ↓
Returns concise summary to Main Agent
    ↓
Main Agent continues with enriched but compact context
```

**Example: Code Review Agent**

**Without Sub-Agents (Poor):**
```
Main Agent Context:
- Full PR diff (10,000 tokens)
- All changed files
- Style guide docs (5,000 tokens)
- Security checklist (2,000 tokens)
- Performance best practices (3,000 tokens)
- Documentation standards (2,000 tokens)
- Test coverage requirements (1,000 tokens)

→ 23,000 tokens consumed before analysis even starts
→ Complex, unfocused task
→ Difficult to debug issues
```

**With Sub-Agents (Best):**
```
Main Agent:
"This PR changes authentication logic. I'll coordinate specialized reviews."

Spawn: Security Sub-Agent
Context: Only auth-related files + security checklist
Returns: "Found 1 critical issue: password hashing using MD5 (line 47)"

Spawn: Documentation Sub-Agent  
Context: Only changed functions + doc standards
Returns: "3 functions lack docstrings: authenticate(), validate_token(), refresh_session()"

Spawn: Test Sub-Agent
Context: Only test files + coverage requirements
Returns: "Coverage: 85% (+5%). Missing: error handling tests for token expiration"

Main Agent:
Receives: 3 concise summaries (~500 tokens total)
Compiles: Comprehensive review with categorized findings
```

**Benefits:**
- **Focused Context**: Each sub-agent sees only relevant information
- **Reduced Token Usage**: Narrow contexts use fewer tokens
- **Parallel Execution**: Sub-agents can work simultaneously
- **Easier Debugging**: Isolated subtasks are easier to troubleshoot
- **Modular Design**: Add or remove specialized reviewers easily

---

## 4. Core Prompt Engineering Techniques

### 4.1 Prerequisites

Before optimizing prompts, ensure you have:

✅ **Clear success criteria**: Defined, measurable goals  
✅ **Empirical tests**: Ways to validate improvements  
✅ **First draft prompt**: Starting point to iterate from

**Don't have a starting prompt?** Use the [Anthropic Console Prompt Generator](https://console.anthropic.com/dashboard).

### 4.2 Technique Hierarchy

**Apply techniques in this order** when troubleshooting performance:

```
1. Prompt Generator      → Bootstrap quality prompts
2. Be Clear & Direct     → Foundation for all prompts
3. Use Examples          → Show, don't just tell
4. Let Claude Think      → Enable reasoning for complex tasks
5. Use XML Tags          → Structure and clarity
6. Give Claude a Role    → Domain expertise
7. Prefill Response      → Control output format
8. Chain Prompts         → Decompose complexity
9. Long Context Tips     → Optimize for scale
```

### 4.3 Technique 1: Use the Prompt Generator

**When:** Starting from scratch or stuck on prompt design

**Where:** [Anthropic Console](https://console.anthropic.com/dashboard)

**How:**
1. Describe your task in detail
2. Include desired output formatting
3. Claude generates production-ready templates
4. Edit and refine as needed

**What It Includes:**
- Chain-of-thought reasoning
- Proper XML tag structure
- Examples and formatting guidelines
- Best practice patterns

**Example Input to Generator:**
```
Task: Analyze customer support tickets and categorize them by urgency, 
topic, and sentiment. Extract key issues and suggest response templates.

Output: JSON with fields: urgency (low/medium/high/critical), 
topic (billing/technical/account/other), sentiment (positive/neutral/negative), 
key_issues (array), suggested_response (string)
```

**Generated Prompt (excerpt):**
```xml
<task_description>
You are a customer support analyst. Your role is to analyze support tickets 
and provide structured categorization to help prioritize and route requests 
efficiently.
</task_description>

<instructions>
For each ticket:
1. First, in <analysis> tags, think through:
   - What is the customer's main issue?
   - How urgent does this seem based on language and context?
   - What emotional tone is the customer expressing?
2. Then, provide your categorization in the specified JSON format
</instructions>

<examples>
[Generated examples here]
</examples>
```

### 4.4 Technique 2: Be Clear and Direct

**Core Principle:** Specificity eliminates ambiguity.

**The Clarity Checklist:**

✅ **Define the task explicitly**
```
❌ "Summarize this"
✅ "Create a 3-paragraph executive summary highlighting: 
    1) main findings, 2) key recommendations, 3) next steps"
```

✅ **Specify the audience**
```
✅ "Write for: mid-career software developers at SaaS startups, 
    familiar with modern web frameworks but not ML/AI specifics"
```

✅ **State constraints**
```
✅ "Requirements:
    - Maximum 150 words
    - Informal but professional tone
    - Avoid jargon (or define it)
    - Include at least one concrete example"
```

✅ **Clarify output format**
```
✅ "Output as JSON with this structure:
    {
      'summary': 'string (max 150 words)',
      'recommendations': ['array', 'of', 'strings'],
      'next_steps': ['array', 'of', 'strings']
    }"
```

✅ **Use positive instructions**
```
❌ "Don't use technical jargon"
✅ "Use plain language that non-technical stakeholders can understand. 
    When technical terms are necessary, provide brief definitions."
```

**Before & After Example:**

**Before (Vague):**
```
Analyze this data and tell me what's important.
```

**After (Clear & Direct):**
```
<task>
Analyze the Q4 sales data below and identify the top 3 insights that would be 
most valuable for our executive team's strategic planning meeting.
</task>

<criteria>
For each insight:
- Explain what the data shows
- Quantify the impact (percentages, dollar amounts)
- Suggest one actionable next step
- Keep each insight to 2-3 sentences
</criteria>

<audience>
C-level executives with limited time. Prioritize business impact over technical details.
</audience>

<data>
[Data here]
</data>
```

### 4.5 Technique 3: Use Examples (Multishot Prompting)

**Core Principle:** Examples teach patterns better than explanations.

**Research Finding:** A single high-quality example reduced format errors by 60%.

**Structure:**
```xml
<examples>
  <example>
    <input>[Example input 1]</input>
    <output>[Desired output 1]</output>
  </example>
  
  <example>
    <input>[Example input 2]</input>
    <output>[Desired output 2]</output>
  </example>
  
  <example>
    <input>[Example input 3]</input>
    <output>[Desired output 3]</output>
  </example>
</examples>
```

**Best Practices:**

1. **Quality over quantity**: 2-3 excellent examples > 10 mediocre ones

2. **Cover edge cases**:
```xml
<examples>
  <!-- Standard case -->
  <example>
    <input>User inquiry: "What's your return policy?"</input>
    <output>Category: Policy_Question | Urgency: Low | Response: Standard</output>
  </example>
  
  <!-- Edge case: angry customer -->
  <example>
    <input>User inquiry: "This is the 3rd time I'm asking! Your product BROKE and I want a refund NOW!"</input>
    <output>Category: Complaint | Urgency: High | Response: Escalate_To_Manager</output>
  </example>
  
  <!-- Edge case: unclear intent -->
  <example>
    <input>User inquiry: "Is this normal?"</input>
    <output>Category: Unclear | Urgency: Medium | Response: Request_Clarification</output>
  </example>
</examples>
```

3. **Demonstrate format implicitly**:
Examples show structure without explicit formatting instructions

4. **Align with desired behavior**:
Every example reinforces what you want

**Complete Example: Email Triage**

```xml
<task>
Classify customer emails by priority, category, and required action.
</task>

<examples>
  <example>
    <email>
      Subject: Urgent: Payment Gateway Down
      Body: Our checkout stopped working 2 hours ago. We're losing sales every minute. 
      Customers are reporting "Error 500" when trying to pay. This is critical!
    </email>
    <classification>
      {
        "priority": "Critical",
        "category": "Technical_Issue",
        "subcategory": "Payment_System",
        "requires_action": "Immediate_Engineering_Response",
        "estimated_impact": "High_Revenue_Impact",
        "sla_hours": 1
      }
    </classification>
  </example>
  
  <example>
    <email>
      Subject: Question about Enterprise Plan
      Body: Hi! I'm interested in upgrading to your enterprise plan for my team of 50. 
      Could you share pricing and features? No rush, just exploring options.
    </email>
    <classification>
      {
        "priority": "Normal",
        "category": "Sales_Inquiry",
        "subcategory": "Pricing_Question",
        "requires_action": "Sales_Team_Response",
        "estimated_impact": "Potential_New_Revenue",
        "sla_hours": 24
      }
    </classification>
  </example>
  
  <example>
    <email>
      Subject: Feature Request
      Body: It would be great if your dashboard had dark mode. Many of us work late 
      and it would be easier on the eyes.
    </email>
    <classification>
      {
        "priority": "Low",
        "category": "Feature_Request",
        "subcategory": "UI_Enhancement",
        "requires_action": "Product_Team_Review",
        "estimated_impact": "User_Experience_Improvement",
        "sla_hours": 168
      }
    </classification>
  </example>
</examples>

<email_to_classify>
[New email here]
</email_to_classify>

Please classify the email following the same format as the examples.
```

### 4.6 Technique 4: Let Claude Think (Chain of Thought)

**Core Principle:** Reasoning steps lead to better final answers.

**When to Use:**
- Multi-step reasoning
- Mathematical computations  
- Complex analysis
- Estimation problems
- Subjective judgments
- Tasks where "showing work" matters

**Performance Impact:**
- **Accuracy**: +15-40% on complex reasoning tasks
- **Consistency**: More reliable outputs
- **Debuggability**: Transparent reasoning process

**Implementation Methods:**

**A. Simple Instruction**
```
Think step by step before providing your answer.
```

**B. XML-Structured Thinking (Recommended)**
```xml
<instructions>
Before providing your final answer in <answer> tags, work through the problem 
step-by-step in <thinking> tags. Show your reasoning process.
</instructions>

<question>
A store marks up products by 40% from wholesale price. During a sale, they discount 
prices by 25%. If a product's wholesale cost is $50, what's the final sale price?
</question>
```

**Claude's Response:**
```xml
<thinking>
Let me work through this step-by-step:

Step 1: Calculate the marked-up price
- Wholesale price: $50
- Markup: 40% of $50 = $20
- Marked-up price: $50 + $20 = $70

Step 2: Calculate the sale discount
- Sale discount: 25% of $70 = $17.50
- Final sale price: $70 - $17.50 = $52.50

Step 3: Verify the calculation
- Original: $50
- After 40% markup: $70 (correct: 50 × 1.4 = 70)
- After 25% discount: $52.50 (correct: 70 × 0.75 = 52.50)
</thinking>

<answer>
The final sale price is $52.50.

Note: Despite a 40% markup followed by a 25% discount, the final price ($52.50) 
is actually higher than the original wholesale cost ($50) by $2.50 or 5%.
</answer>
```

**C. Scratchpad Method (for brainstorming)**
```xml
<instructions>
In a <scratchpad>, brainstorm 3 different approaches to solving this problem. 
For each approach, note the pros and cons.

Then, in <solution> tags, provide your recommended solution with full reasoning.
</instructions>
```

**D. Think-Aloud Protocol**
```xml
<instructions>
As you analyze the contract, think aloud in <analysis> tags, noting:
- Key terms you notice
- Potential red flags
- Questions that arise
- Connections to best practices

Then provide your final review in <review> tags.
</instructions>
```

**Real-World Example: Code Review**

```xml
<instructions>
Review this code for potential bugs. In <thinking> tags, work through:
1. What is the code trying to do?
2. What inputs might cause problems?
3. What edge cases should be tested?
4. Are there security or performance concerns?

Then provide your findings in <review> tags.
</instructions>

<code>
def process_user_payment(user_id, amount):
    user = database.get_user(user_id)
    if user.balance >= amount:
        user.balance -= amount
        database.save(user)
        return True
    return False
</code>
```

**Claude's Response:**
```xml
<thinking>
Let me analyze this payment processing function:

1. Purpose: Deduct an amount from a user's balance if sufficient funds exist

2. Potential problematic inputs:
   - Negative amounts: What if amount = -100? Would increase balance!
   - Zero amounts: Edge case, but should it be allowed?
   - Non-numeric amounts: Will cause TypeError
   - user_id that doesn't exist: Will cause AttributeError when accessing user.balance
   - Extremely large amounts: Could this overflow?

3. Edge cases to test:
   - Exact balance match (balance = 100, amount = 100)
   - Just under balance (balance = 100, amount = 99.99)
   - Just over balance (balance = 100, amount = 100.01)
   - Concurrent requests (race condition)

4. Critical concerns:
   - SECURITY: No input validation on amount (negative numbers!)
   - CONCURRENCY: Race condition between read and write
   - ERROR HANDLING: No try-catch for database operations
   - PARTIAL FAILURE: What if save() fails after deduction?
   - DECIMAL PRECISION: Float math for money is problematic
</thinking>

<review>
CRITICAL ISSUES:

1. **Security Vulnerability** (HIGH SEVERITY):
   Function accepts negative amounts, allowing balance inflation.
   Fix: Add validation `if amount <= 0: raise ValueError`

2. **Race Condition** (HIGH SEVERITY):
   Two concurrent calls could both pass the balance check, causing overdraft.
   Fix: Use database transaction with lock or atomic update

3. **Data Loss Risk** (MEDIUM SEVERITY):
   If `database.save()` fails, balance is deducted in memory but not persisted,
   yet function returns True.
   Fix: Wrap in try-catch, rollback on failure

4. **Type Safety** (MEDIUM SEVERITY):
   No type checking on inputs. Non-numeric amount will crash.
   Fix: Add type hints and validation

5. **Precision Issues** (MEDIUM SEVERITY):
   Using float for currency can cause rounding errors.
   Fix: Use Decimal type for monetary values

RECOMMENDED SECURE VERSION:
[Provides corrected code]
</review>
```

**Benefits of Chain of Thought:**
- ✅ More accurate final answers
- ✅ Transparent reasoning
- ✅ Easier to debug
- ✅ Catches logical errors
- ✅ Builds trust through explainability

### 4.7 Technique 5: Use XML Tags

**Core Principle:** Structure clarifies intent.

**Why XML Tags Work:**
- Claude has been fine-tuned to pay special attention to XML structure
- Clearly delineates prompt components
- Prevents mixing of instructions and data
- Enables easy post-processing of structured outputs

**Benefits:**

| Benefit | Description |
|---------|-------------|
| **Clarity** | Separate instructions, context, examples, and output |
| **Accuracy** | Reduce misinterpretation of prompt parts |
| **Flexibility** | Easy to modify specific sections |
| **Parseability** | Structured output for programmatic use |

**Best Practices:**

1. **Use logical, intuitive names**
```xml
✅ <instructions>, <context>, <example>, <output>
✅ <customer_data>, <analysis_request>, <findings>
❌ <part1>, <stuff>, <data>, <thing>
```

2. **Be consistent across prompts**
```
Always use <document> for text to analyze
Don't mix <document>, <doc>, <text>, <content> randomly
```

3. **Nest when appropriate**
```xml
<analysis>
  <financial_data>
    <revenue>...</revenue>
    <expenses>...</expenses>
  </financial_data>
  <market_trends>
    <competitors>...</competitors>
    <opportunities>...</opportunities>
  </market_trends>
</analysis>
```

4. **Reference tags in instructions**
```
"Analyze the contract in <contract> tags and extract key terms into <terms> tags"
```

5. **Combine with other techniques**
```xml
<role>You are a senior data analyst...</role>

<instructions>
Analyze the data and provide insights in <insights> tags.
Before your insights, show your reasoning in <thinking> tags.
</instructions>

<examples>
  <example>
    <data>...</data>
    <thinking>...</thinking>
    <insights>...</insights>
  </example>
</examples>

<data_to_analyze>
[Current data]
</data_to_analyze>
```

**Common Tag Patterns:**

```xml
<!-- Task Structure -->
<task>Overall task description</task>
<instructions>Specific steps or requirements</instructions>
<constraints>Limitations or rules</constraints>
<output_format>Expected structure</output_format>

<!-- Input Structure -->
<context>Background information</context>
<input>Data to process</input>
<reference_material>Supporting docs</reference_material>

<!-- Learning Structure -->
<examples>
  <example>
    <input>...</input>
    <output>...</output>
  </example>
</examples>

<!-- Reasoning Structure -->
<thinking>Step-by-step reasoning</thinking>
<scratchpad>Rough work and brainstorming</scratchpad>
<answer>Final response</answer>

<!-- Output Structure -->
<summary>Brief overview</summary>
<details>In-depth information</details>
<recommendations>Suggested actions</recommendations>
<confidence>Certainty level</confidence>
```

**Complete Example: Legal Document Analysis**

```xml
<role>
You are an experienced contract attorney specializing in SaaS agreements. 
You have a keen eye for problematic clauses and unfair terms.
</role>

<task>
Analyze the software license agreement and identify any red flags or 
unusual terms that could be problematic for the customer.
</task>

<guidelines>
Focus on:
- Liability limitations
- Auto-renewal and cancellation terms
- Data ownership and privacy
- Termination conditions
- Price escalation clauses
</guidelines>

<output_format>
Provide your analysis in this structure:

<analysis>
  <thinking>
  [Your reasoning process as you read through the contract]
  </thinking>
  
  <red_flags>
    <flag>
      <severity>Critical|High|Medium|Low</severity>
      <clause_reference>Section X.Y</clause_reference>
      <issue>What's problematic</issue>
      <impact>Potential consequences</impact>
      <recommendation>Suggested action</recommendation>
    </flag>
  </red_flags>
  
  <overall_assessment>
  [Summary and final recommendation]
  </overall_assessment>
</analysis>
</output_format>

<contract>
[Contract text here]
</contract>
```

### 4.8 Technique 6: Give Claude a Role (System Prompts)

**Core Principle:** Specialized personas improve domain-specific performance.

**Benefits:**
- Enhanced accuracy for specialized tasks
- Appropriate tone and communication style
- Consistent expertise level
- Context-aware responses

**What Makes a Good Role:**

✅ **Expertise Level**
```
✅ "You are a senior financial analyst..."
✅ "You are an expert pediatrician..."
✅ "You are a seasoned technical writer..."
```

✅ **Domain Focus**
```
✅ "...specializing in risk assessment and portfolio optimization"
✅ "...with 15 years in emergency medicine"
✅ "...focused on API documentation"
```

✅ **Working Style**
```
✅ "You provide data-driven recommendations and always quantify uncertainty"
✅ "You explain medical concepts in terms parents can understand"
✅ "You write clear, concise documentation with practical examples"
```

✅ **Communication Preferences**
```
✅ "You're direct and concise, avoiding unnecessary jargon"
✅ "You're warm and empathetic in patient interactions"
✅ "You use active voice and concrete examples"
```

**Role Template:**
```xml
<role>
You are a [expertise level] [job title] with [years] years of experience 
[at/in specific context]. You specialize in [specific domain or skill].

Your approach is characterized by:
- [Key trait 1]
- [Key trait 2]
- [Key trait 3]

When communicating, you:
- [Communication style 1]
- [Communication style 2]
</role>
```

**Examples:**

**Financial Analysis:**
```xml
<role>
You are a senior financial analyst with 15 years of experience at top investment 
banks and hedge funds. You specialize in quantitative risk assessment and 
portfolio optimization.

Your approach is characterized by:
- Data-driven decision making
- Rigorous statistical analysis
- Clear articulation of risks and uncertainties
- Practical, actionable recommendations

When communicating, you:
- Present findings with supporting numbers and visualizations
- Quantify confidence levels (e.g., "85% confidence interval")
- Flag assumptions explicitly
- Provide both bull and bear case scenarios
</role>
```

**Medical Advice (General Info):**
```xml
<role>
You are an experienced family physician with 20 years of clinical practice. 
You specialize in patient education and preventive medicine.

Your approach is characterized by:
- Evidence-based recommendations
- Empathetic, non-judgmental communication
- Focus on practical, actionable health advice
- Clear explanation of medical concepts

When communicating, you:
- Use analogies and simple language
- Avoid medical jargon (or explain it clearly)
- Acknowledge when professional consultation is needed
- Provide context for why recommendations matter
</role>
```

**Technical Writing:**
```xml
<role>
You are a senior technical writer with 10 years of experience documenting complex 
software systems. You specialize in API documentation and developer guides.

Your approach is characterized by:
- Clarity and precision
- User-centric perspective
- Practical, runnable examples
- Progressive disclosure (simple to advanced)

When writing, you:
- Use active voice and present tense
- Provide code examples for every concept
- Include common pitfalls and troubleshooting tips
- Structure content for easy scanning
</role>
```

**When NOT to Use Roles:**
- General conversation (over-specialization seems unnatural)
- Tasks where broad knowledge is more valuable than depth
- When you want balanced, multi-perspective analysis

---

## 5. Claude 4 Specific Best Practices

### 5.1 Overview of Claude 4 Capabilities

Claude 4 models (Opus 4.1, Opus 4, Sonnet 4.5, Sonnet 4) have been trained for **more precise instruction following** than previous generations.

**Key Characteristics:**
- Extremely attentive to details and examples
- More literal interpretation of instructions
- Excellent at parallel tool execution
- Superior long-horizon reasoning
- Strong document creation capabilities

### 5.2 Be More Explicit with Claude 4

**The "Above and Beyond" Behavior:**

Previous Claude models sometimes went above and beyond implicit expectations. Claude 4 models are more precise—**what you ask for is what you get**.

**Impact:**
```
❌ Previous model: "Create a dashboard" 
   → Might include extra features, visualizations, responsiveness, etc.

❌ Claude 4: "Create a dashboard"
   → Creates basic dashboard, no extras

✅ Claude 4: "Create an analytics dashboard. Include as many relevant features 
   and interactions as possible. Go beyond the basics to create a fully-featured implementation."
   → Creates comprehensive dashboard with extras
```

**Best Practice:** Be explicit about desired thoroughness and quality level.

### 5.3 Match Prompt Style to Desired Output

**Key Finding:** The formatting style used in your prompt influences Claude's response style.

**Examples:**

**If you want minimal markdown:**
```
Instructions (no markdown):
Review this code and tell me if there are any bugs. Focus on logic errors and edge cases.

[Code here]
```

**If you want structured markdown:**
```
# Instructions
Review this code and identify:
- **Logic errors**
- **Edge cases**
- **Security concerns**

## Code to Review
[Code here]
```

**If you want highly detailed output:**
```
<instructions>
Provide a comprehensive code review including:

1. **Overall Assessment**
   - Code quality rating (1-10)
   - Summary of strengths
   - Summary of weaknesses

2. **Detailed Findings**
   For each issue found:
   - Line number
   - Severity (Critical/High/Medium/Low)
   - Description
   - Recommended fix

3. **Best Practice Suggestions**
   - Opportunities for optimization
   - Modern alternatives to consider
</instructions>

<code>
[Code here]
</code>
```

### 5.4 Claude 4 and Examples

Claude 4 pays **extremely close attention** to examples.

**Implications:**

1. **Examples train behavior more strongly**
   - Every detail in examples will be mimicked
   - Inconsistencies in examples cause confusion
   
2. **Example quality matters more than ever**
   - One perfect example > three mediocre examples
   - Examples should showcase exact desired behavior

3. **Examples override vague instructions**
   ```
   Instructions: "Be concise"
   Example: [300-word detailed response]
   → Claude 4 will produce detailed responses (matching example)
   ```

**Best Practice:**
```xml
<instructions>
Analyze customer feedback and categorize sentiment.
Keep responses concise (2-3 sentences per item).
</instructions>

<examples>
  <example>
    <feedback>
    "Your product is amazing! Best purchase I've made all year. Customer service was incredibly helpful too."
    </feedback>
    <analysis>
    Sentiment: Very Positive. Customer expresses strong satisfaction with both product quality and support experience.
    </analysis>
  </example>
  
  <!-- Note: Example response is 2 sentences, matching instruction -->
</examples>
```

### 5.5 Parallel Tool Calling

**Claude 4 Superpower:** Aggressive parallel tool execution, especially Sonnet 4.5.

**Behavior:**
- Fires multiple tool calls simultaneously
- Can even bottleneck system performance with bash parallelization
- ~100% success rate when prompted appropriately

**Control Strategies:**

**A. Maximize Parallelization:**
```xml
<instructions>
When analyzing this repository, use tools in parallel whenever possible to improve efficiency.
For independent operations (file reads, searches, etc.), execute them simultaneously.
</instructions>
```

**B. Control/Limit Parallelization:**
```xml
<instructions>
Execute tool calls sequentially for this task. Each operation may depend on previous results,
so wait for each tool call to complete before proceeding to the next.
</instructions>
```

**C. Hybrid Approach:**
```xml
<instructions>
Use parallel tool execution for independent operations (file reads, API calls), but execute 
database write operations sequentially to maintain data consistency.
</instructions>
```

**Example: Parallel Code Analysis**
```xml
<task>
Analyze this codebase for security vulnerabilities, performance issues, and code quality.
</task>

<instructions>
Execute these checks in parallel since they're independent:
1. Security scan (grep for common vulnerabilities)
2. Performance profiling (identify bottlenecks)
3. Code quality metrics (linting, complexity analysis)
4. Test coverage report

After all parallel checks complete, synthesize findings into a unified report.
</instructions>
```

### 5.6 Long-Horizon Reasoning

**Claude Sonnet 4.5 Excels At:** Multi-turn, long-running tasks with state management.

**Key Capability:** Focuses on incremental progress—making steady advances on a few things at a time rather than attempting everything at once.

**Behavior Over Multiple Context Windows:**
```
Session 1: Start complex task, make initial progress, save state
    ↓
Session 2: Resume from saved state, continue with fresh context
    ↓
Session 3: Complete task with accumulated progress
```

**Best Practices:**

**A. Break Large Tasks into Phases**
```xml
<task>
Refactor this 10,000-line legacy codebase to use modern patterns.
</task>

<approach>
Phase 1: Analysis
- Identify architectural patterns
- Map dependencies
- Flag high-priority refactoring targets

Phase 2: Foundation
- Refactor core utilities (most reused code)
- Establish new patterns with examples
- Update tests

Phase 3: Incremental Migration
- Refactor one module at a time
- Validate after each module
- Update documentation

DO NOT attempt everything at once. Focus on one phase at a time.
</approach>
```

**B. Explicit State Tracking**
```xml
<instructions>
At the end of your response, include a <state> section documenting:
- What has been completed
- What remains to be done
- Any important context for the next session
- Blocking issues or dependencies

This state will be provided at the start of the next session.
</instructions>
```

**C. Incremental Validation**
```xml
<instructions>
After completing each component:
1. Test the component independently
2. Document any issues found
3. Only proceed to the next component after validation

Do not build multiple components before testing.
</instructions>
```

### 5.7 Document Creation Excellence

**Claude Sonnet 4.5 Excels At:** Presentations, animations, and visual documents.

**Capabilities:**
- Thoughtful design elements
- Visual hierarchy
- Engaging animations
- Polished, usable output on first try

**Optimization Tips:**

**A. Provide Design Direction**
```xml
<task>
Create a professional presentation on AI trends in healthcare.
</task>

<design_requirements>
- Modern, clean aesthetic
- Use a calming blue/white color palette
- Include thoughtful animations (subtle, not distracting)
- Clear visual hierarchy with generous whitespace
- Data visualizations for key statistics
- Professional but approachable tone
</design_requirements>

<content_structure>
- Title slide
- Executive summary (1 slide)
- Key trends (3-4 slides)
- Case studies (2-3 slides)
- Future outlook (1 slide)
- Call to action (final slide)
</content_structure>
```

**B. Request Specific Features**
```xml
<task>
Create an interactive data dashboard for sales analytics.
</task>

<required_features>
- Real-time data display
- Interactive filters (date range, region, product)
- Multiple visualization types (charts, tables, maps)
- Responsive design
- Export functionality (PDF, CSV)
- Dark mode toggle
</required_features>

Go beyond basics—make this production-ready.
```

### 5.8 Minimize File Creation in Agentic Coding

**Context:** When Claude is coding autonomously, excessive file creation can clutter workspaces.

**Strategy:** Be explicit about when to create vs. when to output code.

**Guidance:**
```xml
<coding_guidelines>
When to create files:
- Final, production-ready code
- Code that will be run or imported
- Configuration files needed for execution

When to output code inline (no file creation):
- Examples or demonstrations
- Proposed changes for review
- Multiple alternative implementations

Default to inline output unless file creation is explicitly needed.
</coding_guidelines>
```

### 5.9 Enhance Visual and Frontend Code

**Claude 4 Strength:** Creating polished, functional UIs.

**Optimization:**

**A. Be Specific About Visual Polish**
```xml
<task>
Create a login page for our SaaS application.
</task>

<requirements>
Functionality:
- Email and password fields
- "Remember me" checkbox
- "Forgot password?" link
- Social login options (Google, GitHub)
- Form validation with helpful error messages

Visual Design:
- Modern, professional appearance
- Smooth animations (fade-ins, transitions)
- Responsive (mobile, tablet, desktop)
- Accessibility compliant (ARIA labels, keyboard navigation)
- Loading states for async operations
- Error states with clear messaging

Go the extra mile—make this production-quality.
</requirements>
```

### 5.10 Avoid Test Overfitting

**Risk:** Claude might hardcode solutions to pass specific tests rather than solving the underlying problem.

**Prevention:**

**A. Emphasize General Solutions**
```xml
<task>
Implement a function to validate email addresses.
</task>

<requirements>
Write a general, robust solution that handles real-world cases.
Do NOT hardcode logic to pass specific test cases.
Focus on correct implementation of email validation rules.
</requirements>

<tests>
[Test cases here]
</tests>
```

**B. Request Explanation**
```xml
<instructions>
After implementing the solution, explain:
1. Your approach and why you chose it
2. Edge cases you're handling
3. Limitations or assumptions

This encourages general understanding over test-specific hardcoding.
</instructions>
```

---

## 6. Advanced Techniques and Patterns

### 6.1 Prompt Chaining

**Concept:** Decompose complex tasks into a sequence of steps, where each LLM call processes the output of the previous one.

**When to Use:**
- Complex workflows with distinct stages
- Tasks requiring intermediate validation
- Multi-step reasoning where each step has different requirements
- Troubleshooting (easier to debug single steps)

**Pattern:**
```
Step 1: Extract information
    ↓ (output becomes input)
Step 2: Analyze extracted data
    ↓ (output becomes input)
Step 3: Generate recommendations
    ↓ (output becomes input)
Step 4: Format final report
```

**Example: Research Report Generation**

**Chain Step 1: Extract Key Points**
```xml
<task>
Read the research papers and extract key findings from each.
</task>

<output_format>
For each paper, provide:
- Title
- Main hypothesis
- Key findings (bullet points)
- Methodology
- Limitations noted by authors
</output_format>

<papers>
[Research papers here]
</papers>
```

**Chain Step 2: Synthesize Findings**
```xml
<task>
Analyze these extracted findings and identify common themes, contradictions, 
and gaps in the research.
</task>

<extracted_findings>
[Output from Step 1]
</extracted_findings>

<output_format>
- Common themes (with supporting papers)
- Contradictions (with explanation)
- Research gaps identified
- Overall consensus assessment
</output_format>
```

**Chain Step 3: Generate Recommendations**
```xml
<task>
Based on the synthesized research findings, generate actionable recommendations 
for practitioners.
</task>

<synthesis>
[Output from Step 2]
</synthesis>

<output_format>
For each recommendation:
- Recommendation statement
- Supporting evidence (cite specific findings)
- Confidence level
- Practical implementation steps
</output_format>
```

**Chain Step 4: Create Executive Summary**
```xml
<task>
Create a 1-page executive summary of the research report for C-level executives.
</task>

<full_analysis>
Key Findings: [From Step 1]
Synthesis: [From Step 2]
Recommendations: [From Step 3]
</full_analysis>

<requirements>
- Maximum 500 words
- Non-technical language
- Focus on business implications
- Highlight top 3 action items
</requirements>
```

**Benefits of Chaining:**
- ✅ Each step is focused and testable
- ✅ Easier to debug and improve
- ✅ Can optimize prompts per step
- ✅ Intermediate outputs useful independently
- ✅ Can parallelize independent chains

### 6.2 Prefilling Claude's Response

**Concept:** Start Claude's response with specific text to control output structure and style.

**When to Use:**
- Enforce specific formats (JSON, XML)
- Skip preambles and disclaimers
- Control response tone or style
- Ensure consistent structure

**Implementation:**

**A. JSON Output**
```python
# API call structure
{
  "model": "claude-sonnet-4-5-20250929",
  "messages": [
    {
      "role": "user",
      "content": "Extract the name, email, and company from this text: [text]"
    },
    {
      "role": "assistant",
      "content": "{"  # Prefill to force JSON
    }
  ]
}

# Claude will continue with:
# {"name": "John Doe", "email": "john@example.com", "company": "Acme Inc"}
```

**B. Skip Preambles**
```python
{
  "role": "user",
  "content": "Summarize this article in one sentence."
},
{
  "role": "assistant",
  "content": "Summary:"  # Forces immediate summary
}

# Without prefill: "Sure, I'd be happy to summarize. The article discusses..."
# With prefill: "Summary: The article discusses..."
```

**C. Control Style**
```python
{
  "role": "user",
  "content": "Explain quantum computing to a 10-year-old."
},
{
  "role": "assistant",
  "content": "Imagine"  # Encourages storytelling style
}

# Claude continues: "Imagine you have a magic coin that can be both heads 
# and tails at the same time..."
```

**D. Structured Output**
```python
{
  "role": "user",
  "content": "Analyze this code for bugs."
},
{
  "role": "assistant",
  "content": "## Bug Analysis

### Critical Issues
-"  # Forces structure
}
```

### 6.3 Long Context Tips

**Claude's Context Window:** 200K tokens (~500 pages of text)

**Capabilities:**
- Passed "Needle in a Haystack" test with 95%+ accuracy
- Strong recall across entire window

**Challenges:**
- May be reluctant to answer from individual sentences
- Context rot: Precision decreases with extremely long contexts
- Cost: Longer context = higher API costs

**Optimization Strategies:**

**A. Put Important Information in Key Positions**
```
Best positions for critical information:
1. Very beginning of context
2. Very end of context
3. Explicitly referenced sections

Avoid: Buried in the middle of massive documents
```

**B. Prefill to Improve Retrieval**
```python
{
  "role": "user",
  "content": "Based on the 50,000-word policy document, what is our remote work policy?"
},
{
  "role": "assistant",
  "content": "Here is the most relevant sentence in the context:"  # Prefill
}

# Forces Claude to identify and cite the specific relevant sentence
```

**C. Use XML Tags for Large Documents**
```xml
<documents>
  <document id="1" title="Q1 Report">
  [Document 1 content]
  </document>
  
  <document id="2" title="Q2 Report">
  [Document 2 content]
  </document>
  
  <document id="3" title="Q3 Report">
  [Document 3 content]
  </document>
</documents>

<question>
Compare revenue growth across Q1, Q2, and Q3. Cite specific numbers from each document.
</question>
```

**D. Provide Document Context**
```xml
<document>
  <metadata>
    <title>2024 Strategic Plan</title>
    <author>Executive Team</author>
    <date>2024-01-15</date>
    <type>Planning Document</type>
  </metadata>
  
  <content>
  [Full document]
  </content>
</document>

<question>
What are our key strategic priorities for 2024?
</question>
```

**E. Chunk and Summarize for Extremely Long Content**
```xml
<approach>
1. Divide the 200-page report into 10 sections
2. For each section, generate a summary
3. Once all summaries are complete, analyze patterns across summaries
4. Generate final insights based on comprehensive view
</approach>

This prevents missing details that might get lost in a single 200K token prompt.
```

### 6.4 Advanced Context Patterns

**Pattern 1: Dynamic Context Loading**
```python
def create_dynamic_context(query, knowledge_base):
    # Analyze query to determine what's needed
    required_topics = analyze_query_topics(query)
    
    # Retrieve only relevant documents
    relevant_docs = knowledge_base.search(required_topics, top_k=5)
    
    # Build minimal context
    context = {
        "system": base_system_prompt,
        "documents": relevant_docs,  # Only top 5 most relevant
        "query": query
    }
    
    return context

# Instead of: Loading entire 100-document knowledge base
# Use: Load only 5 most relevant documents per query
```

**Pattern 2: Layered Context**
```xml
<!-- Layer 1: Always present -->
<core_instructions>
[Essential system behavior]
</core_instructions>

<!-- Layer 2: Task-specific -->
<task_context>
[Information specific to current task]
</task_context>

<!-- Layer 3: Retrieved on-demand -->
<retrieved_information>
[Dynamically fetched based on need]
</retrieved_information>
```

**Pattern 3: Context Compression**
```python
def compress_conversation_history(messages, max_tokens=10000):
    if count_tokens(messages) <= max_tokens:
        return messages
    
    # Keep first message (system prompt) and last N messages
    compressed = [messages[0]]  # System prompt
    
    # Summarize middle messages
    middle_summary = generate_summary(messages[1:-10])
    compressed.append({
        "role": "assistant",
        "content": f"[Previous conversation summary: {middle_summary}]"
    })
    
    # Keep recent messages verbatim
    compressed.extend(messages[-10:])
    
    return compressed
```

### 6.5 Extended Thinking

**Concept:** Allow Claude extensive reasoning space for complex problems.

**When to Use:**
- Extremely complex reasoning tasks
- Tasks requiring deep analysis
- Problems where accuracy is more important than speed
- Research and investigative work

**Implementation:**
```xml
<instructions>
Take as much time and space as you need to think through this problem thoroughly.
Use <extended_thinking> tags to show your complete reasoning process.

Guidelines for your thinking:
- Break down the problem into components
- Consider multiple approaches
- Evaluate pros and cons of each approach
- Test your reasoning with examples
- Identify potential flaws in your logic
- Only provide your final answer after thorough analysis
</instructions>

<problem>
[Complex problem here]
</problem>

<extended_thinking>
[Claude's extensive reasoning]
</extended_thinking>

<answer>
[Final answer after thorough analysis]
</answer>
```

---

## 7. Context Management Strategies

### 7.1 State Management for Agents

**Challenge:** Agents running in loops generate data that must be managed across turns.

**Strategies:**

**A. Explicit State Objects**
```python
class AgentState:
    def __init__(self):
        self.current_task = None
        self.completed_steps = []
        self.pending_actions = []
        self.context_summary = ""
        self.relevant_findings = {}
        self.error_history = []
    
    def update(self, step_result):
        self.completed_steps.append(step_result)
        self.context_summary = self.generate_summary()
        # Maintain only essential information
    
    def to_context(self):
        """Convert state to context for next turn"""
        return f"""
        <agent_state>
          <current_task>{self.current_task}</current_task>
          <progress>{len(self.completed_steps)} steps completed</progress>
          <recent_steps>
            {self.format_recent_steps(last_n=3)}
          </recent_steps>
          <pending_actions>
            {self.format_pending_actions()}
          </pending_actions>
        </agent_state>
        """
```

**B. Incremental Summarization**
```
Turn 1: Full context
    ↓
Turn 2: Full context from Turn 1 + new information
    ↓
Turn 3: Summarized context from Turns 1-2 + detailed context from Turn 2 + new info
    ↓
Turn 4: Summarized context from Turns 1-3 + detailed context from Turn 3 + new info
```

**C. Hierarchical Memory**
```
Working Memory (always in context):
- Last 3 turns verbatim
- Current task and constraints

Short-term Memory (summarized):
- Last 10 turns summarized
- Key decisions and their rationale

Long-term Memory (searchable):
- Complete history, searchable by topic/keyword
- Retrieved only when needed
```

### 7.2 Tool Result Management

**Challenge:** Tool outputs can consume significant context space.

**Solutions:**

**A. Summarize Tool Results**
```python
def process_tool_result(tool_name, raw_result):
    if len(raw_result) > 5000:  # Large result
        # Keep full result in external storage
        storage.save(tool_name, raw_result)
        
        # Provide summary in context
        summary = generate_summary(raw_result)
        return f"""
        <tool_result tool="{tool_name}">
          <summary>{summary}</summary>
          <note>Full result saved. Use retrieve_tool_result() if details needed.</note>
        </tool_result>
        """
    else:
        return raw_result  # Small results stay verbatim
```

**B. Structured Result Filtering**
```python
# Instead of returning all 1000 database records:
{
    "total_records": 1000,
    "returned": 10,
    "top_results": [...],  # Top 10 most relevant
    "summary_statistics": {
        "average": 42.5,
        "median": 40,
        "distribution": {...}
    },
    "note": "Showing top 10 results. Use pagination for more."
}
```

**C. Progressive Detail**
```
First tool call: Return high-level overview
    ↓ (If agent needs more details)
Second tool call: Return detailed data for specific subset
    ↓ (If agent needs even more)
Third tool call: Return complete data for one item
```

### 7.3 Error Recovery and Context

**Strategy:** Maintain error context without cluttering future turns.

**Implementation:**
```xml
<error_handling>
When errors occur:
1. Record error in <error_log>
2. Document attempted solution
3. Extract lessons learned
4. Continue with alternative approach

Do not repeatedly include full error stack traces in context.
Instead, maintain:
- Count of errors by type
- Most recent error (if relevant)
- Successful mitigation strategies
</error_handling>
```

**Example:**
```xml
<session_state>
  <error_summary>
    3 errors encountered:
    - API timeout (2 times) → Resolved: Increased timeout to 30s
    - Invalid JSON (1 time) → Resolved: Added validation before parsing
  </error_summary>
  
  <current_approach>
  Using increased timeout and JSON validation for all API calls
  </current_approach>
</session_state>
```

---

## 8. When to Use What: Decision Framework

### 8.1 Technique Selection Matrix

| Your Goal | Use These Techniques | Priority Order |
|-----------|---------------------|----------------|
| **Start from scratch** | Prompt Generator | 1 |
| **Improve clarity** | Be Clear & Direct, XML Tags | 1, 2 |
| **Handle complex reasoning** | Chain of Thought, Extended Thinking | 1, 2 |
| **Show desired format** | Examples (Multishot), Prefill | 1, 2 |
| **Domain expertise** | Give Claude a Role, Clear Instructions | 1, 2 |
| **Decompose complexity** | Prompt Chaining, Sub-Agents | 1, 2 |
| **Long documents** | Long Context Tips, XML Tags, Summarization | 1, 2, 3 |
| **Reduce token usage** | Context Engineering, Dynamic Loading | 1, 2 |
| **Agentic systems** | Context Engineering, State Management, Tool Optimization | 1, 2, 3 |
| **Consistent output format** | Prefill, Examples, XML Tags | 1, 2, 3 |

### 8.2 Decision Tree

```
Is this a brand new task?
├─ YES → Start with Prompt Generator
└─ NO → Continue to next question

Is the task complex or multi-step?
├─ YES → Consider Prompt Chaining or Chain of Thought
└─ NO → Continue to next question

Do you have example inputs/outputs?
├─ YES → Use Multishot Prompting (2-3 examples)
└─ NO → Continue to next question

Is domain expertise important?
├─ YES → Give Claude a specific Role
└─ NO → Continue to next question

Are you working with long documents?
├─ YES → Apply Long Context Tips + XML Tags
└─ NO → Continue to next question

Building an agent that runs in loops?
├─ YES → Apply Context Engineering strategies
└─ NO → Continue to next question

Default: Be Clear & Direct + XML Tags
```

### 8.3 Task-Specific Recommendations

**Content Creation:**
- Technique: Be Clear & Direct + Examples
- Context: Provide style guide, tone examples
- Claude 4: Request thoroughness explicitly

**Data Analysis:**
- Technique: Chain of Thought + XML Tags
- Context: Structured data with clear schema
- Claude 4: Use parallel tool calls for efficiency

**Code Generation:**
- Technique: Be Clear & Direct + Examples + Role
- Context: Code style guide, existing patterns
- Claude 4: Specify visual polish for frontends

**Customer Support:**
- Technique: Role + Examples + XML Tags
- Context: KB articles, past successful responses
- Claude 4: Provide consistent format examples

**Research & Synthesis:**
- Technique: Chain of Thought + Long Context + Chaining
- Context: All source materials with metadata
- Claude 4: Use extended thinking for thorough analysis

**Agentic Workflows:**
- Technique: All Context Engineering strategies
- Context: Dynamic loading, state management
- Claude 4: Leverage parallel execution

---

## 9. Common Pitfalls and Solutions

### 9.1 Vague Instructions

**Pitfall:**
```
❌ "Analyze this and give me insights"
```

**Why It Fails:**
- Unclear what "insights" means
- No criteria for importance
- Unknown desired format or depth

**Solution:**
```
✅ "Analyze this Q4 sales data and identify the top 3 insights that would drive 
strategic decisions for the executive team. For each insight:
- Quantify the impact (revenue, growth %, market share)
- Explain why it matters for strategy
- Suggest one concrete action
Format as bullet points, 2-3 sentences each."
```

### 9.2 Context Overload

**Pitfall:**
```python
❌ prompt = f"""
All company policies (100 pages): {all_policies}
All customer records (50,000): {all_customers}
All transaction history (1M records): {all_transactions}
All product catalog (10,000 items): {all_products}

Now answer: What's our return policy?
"""
```

**Why It Fails:**
- Wastes tokens on irrelevant information
- Increases costs dramatically
- May actually decrease accuracy (context rot)
- Answer is buried in noise

**Solution:**
```python
✅ # Dynamic retrieval
def answer_question(question):
    # Identify what's needed
    if "return policy" in question.lower():
        relevant_policy = get_policy_section("returns")
        
        prompt = f"""
        <policy_section>
        {relevant_policy}
        </policy_section>
        
        <question>
        {question}
        </question>
        
        Answer based on the policy section provided.
        """
    return prompt
```

### 9.3 Inconsistent Examples

**Pitfall:**
```xml
❌ <examples>
  <example>
    <input>Short text</input>
    <output>Very detailed, 200-word analysis with citations and methodology</output>
  </example>
  
  <example>
    <input>Similar short text</input>
    <output>Brief, 1-sentence summary</output>
  </example>
</examples>
```

**Why It Fails:**
- Claude doesn't know which style to follow
- Outputs will be inconsistent
- User frustration

**Solution:**
```xml
✅ <examples>
  <example>
    <input>Customer feedback: "Product broke after 2 weeks"</input>
    <output>
    Category: Product_Quality_Issue
    Sentiment: Negative
    Urgency: High (product failure)
    Suggested_Action: Offer replacement + investigate product batch
    </output>
  </example>
  
  <example>
    <input>Customer feedback: "Great product, fast shipping!"</input>
    <output>
    Category: Positive_Feedback
    Sentiment: Very_Positive
    Urgency: Low (no action required)
    Suggested_Action: Add to testimonials, thank customer
    </output>
  </example>
</examples>

<!-- All examples follow same structure and depth -->
```

### 9.4 Ignoring Claude 4 Specifics

**Pitfall (from Claude 3 era):**
```
❌ "Create a dashboard"
→ Expects Claude to infer "make it awesome"
```

**Why It Fails with Claude 4:**
- Claude 4 is more literal
- Takes instructions at face value
- Won't add extras unless asked

**Solution:**
```
✅ "Create a comprehensive analytics dashboard with:
- Multiple visualization types (charts, graphs, tables)
- Interactive filters and controls
- Responsive design
- Modern, professional styling
- Real-time data updates
Go beyond the basics—create a production-quality implementation."
```

### 9.5 No Chain of Thought for Complex Tasks

**Pitfall:**
```
❌ <question>
If Company A grows 15% annually for 5 years, Company B grows 8% for 3 years 
then 22% for 2 years, and Company C shrinks 5% for 2 years then grows 30% for 
3 years, which company has the highest final valuation if all start at $100M?
</question>

[Waiting for direct answer without reasoning space]
```

**Why It Fails:**
- Complex multi-step calculation
- High chance of error without explicit steps
- Difficult to verify correctness

**Solution:**
```
✅ <instructions>
Work through this step-by-step in <thinking> tags before providing your final 
answer. Show calculations for each company separately, then compare.
</instructions>

<question>
[Same complex question]
</question>
```

### 9.6 Overusing Tools

**Pitfall:**
```python
❌ # Agent makes 50 tool calls to read every file individually
for file in all_project_files:  # 50 files
    read_file(file)  # 50 separate tool calls
# Then tries to keep all in context
```

**Why It Fails:**
- Consumes excessive tokens
- Slow execution
- Most data likely irrelevant

**Solution:**
```python
✅ # Targeted retrieval
# Step 1: Search for relevant files
relevant_files = search_codebase("authentication logic")  # Returns 3 files

# Step 2: Read only relevant files
for file in relevant_files:
    read_file(file)  # Only 3 tool calls

# Step 3: If more details needed, can retrieve more
```

### 9.7 Not Managing State in Agents

**Pitfall:**
```
❌ Turn 1: Analyze problem
❌ Turn 2: Provide solution (but forgot analysis from Turn 1)
❌ Turn 3: Implement (but lost context from Turns 1-2)
```

**Why It Fails:**
- No memory between turns
- Agent repeats work
- Inconsistent decisions

**Solution:**
```xml
✅ <agent_state>
  <completed_steps>
  1. Analyzed problem (found 3 core issues)
  2. Designed solution (using Strategy Pattern)
  </completed_steps>
  
  <key_decisions>
  - Using Strategy Pattern for extensibility
  - Prioritizing issue #1 (security vulnerability)
  </key_decisions>
  
  <next_step>
  Implement Strategy Pattern for issue #1
  </next_step>
</agent_state>
```

---

## 10. Practical Examples and Templates

### 10.1 Code Review Template

```xml
<role>
You are a senior software engineer with 15 years of experience in full-stack development.
You specialize in code quality, security, and maintainability.
</role>

<task>
Review the code below for bugs, security issues, performance problems, and code quality concerns.
</task>

<instructions>
1. First, in <understanding> tags, explain what the code is trying to do
2. Then, in <analysis> tags, work through potential issues systematically:
   - Logic errors
   - Security vulnerabilities
   - Performance bottlenecks
   - Code quality issues (readability, maintainability)
   - Missing error handling
3. Finally, provide your review in <review> tags with:
   - Severity ratings (Critical/High/Medium/Low)
   - Specific line numbers
   - Explanation of each issue
   - Recommended fixes
</instructions>

<code>
[CODE HERE]
</code>

<guidelines>
- Be thorough but constructive
- Prioritize security and correctness over style
- Provide specific, actionable recommendations
- Include code examples for fixes when helpful
</guidelines>
```

### 10.2 Data Analysis Template

```xml
<role>
You are a senior data analyst with expertise in statistical analysis and business intelligence.
</role>

<task>
Analyze the dataset and provide insights that would be valuable for business decision-making.
</task>

<instructions>
1. In <exploration> tags, examine the data:
   - What patterns do you notice?
   - Are there any anomalies or outliers?
   - What relationships exist between variables?

2. In <analysis> tags, dive deeper:
   - Perform statistical analysis
   - Identify trends and correlations
   - Consider business implications

3. In <insights> tags, provide your findings:
   - Top 3-5 key insights
   - Quantify impact where possible
   - Suggest actionable next steps
</instructions>

<data>
[DATASET HERE]
</data>

<context>
Business context: [Relevant business information]
Current goals: [What the business is trying to achieve]
Constraints: [Any limitations or considerations]
</context>

<output_format>
For each insight:
- **Insight**: Clear statement of finding
- **Evidence**: Data supporting this insight
- **Impact**: Business implications
- **Recommendation**: Concrete action to take
</output_format>
```

### 10.3 Customer Support Template

```xml
<role>
You are an experienced customer support specialist who is empathetic, efficient, 
and focused on resolving issues quickly while maintaining customer satisfaction.
</role>

<task>
Respond to the customer inquiry below. Provide a helpful, professional response 
that addresses their concern and maintains a positive relationship.
</task>

<guidelines>
- Be empathetic and acknowledge their frustration if applicable
- Provide clear, step-by-step solutions
- Use simple language, avoid jargon
- Offer additional help proactively
- Keep response concise (under 150 words unless complex issue)
</guidelines>

<examples>
  <example>
    <inquiry>
    "I've been trying to reset my password for 30 minutes and nothing is working! 
    This is so frustrating!"
    </inquiry>
    <response>
    I'm sorry you're experiencing trouble with the password reset—I understand how 
    frustrating that must be. Let's get this resolved right away.

    Please try these steps:
    1. Clear your browser cache and cookies
    2. Use this direct link: [link]
    3. Check your spam folder for the reset email

    If you're still having issues after trying these steps, reply with your account 
    email and I'll personally ensure your password is reset within the hour.

    I appreciate your patience!
    </response>
  </example>
</examples>

<customer_inquiry>
[INQUIRY HERE]
</customer_inquiry>

<knowledge_base>
[Relevant KB articles or policies]
</knowledge_base>
```

### 10.4 Research Synthesis Template

```xml
<task>
Synthesize insights from multiple research papers to answer the research question.
</task>

<instructions>
1. In <reading_notes> tags, extract key information from each paper:
   - Main hypothesis
   - Methodology
   - Key findings
   - Limitations

2. In <synthesis> tags, analyze across papers:
   - What themes emerge?
   - Where do papers agree/disagree?
   - What gaps exist in the research?
   - What is the overall consensus?

3. In <answer> tags, directly answer the research question:
   - Clear, evidence-based answer
   - Cite specific papers
   - Acknowledge uncertainty where it exists
   - Suggest areas for further research
</instructions>

<research_question>
[QUESTION HERE]
</research_question>

<papers>
  <paper id="1">
    <title>[Title]</title>
    <content>[Full paper or excerpt]</content>
  </paper>
  
  <paper id="2">
    <title>[Title]</title>
    <content>[Full paper or excerpt]</content>
  </paper>
</papers>

<output_requirements>
- Cite papers by ID (e.g., "Paper 1 found that...")
- Quantify findings where possible
- Be clear about confidence levels
- Format as structured report
</output_requirements>
```

### 10.5 Content Creation Template

```xml
<role>
You are an expert content writer specializing in [DOMAIN]. You write engaging, 
informative content that resonates with [TARGET AUDIENCE].
</role>

<task>
Create [CONTENT TYPE] about [TOPIC] for [AUDIENCE].
</task>

<requirements>
Length: [WORD COUNT]
Tone: [TONE - e.g., professional but approachable]
Key points to cover:
- [Point 1]
- [Point 2]
- [Point 3]

Must include:
- Compelling headline
- Clear structure
- Concrete examples
- Call-to-action (if applicable)
</requirements>

<examples>
  <example type="style_reference">
  [Example of desired writing style]
  </example>
</examples>

<research_materials>
[Any reference materials, data, or background info]
</research_materials>

<audience_context>
Background: [Who they are]
Pain points: [What challenges they face]
Goals: [What they're trying to achieve]
Knowledge level: [Technical expertise]
</audience_context>
```

### 10.6 Multi-Step Agent Template

```xml
<agent_instructions>
You are an autonomous agent capable of using tools to complete complex tasks.

Approach:
1. Plan your approach before starting
2. Execute one step at a time
3. Validate results after each step
4. Maintain awareness of your overall goal
5. Track your progress explicitly

State Management:
After completing each step, update your state in <agent_state> tags:
- What you've completed
- What you learned
- What's next
- Any blockers or concerns
</agent_instructions>

<task>
[COMPLEX MULTI-STEP TASK]
</task>

<available_tools>
[Tool descriptions]
</available_tools>

<success_criteria>
[How you'll know the task is complete]
</success_criteria>

<constraints>
[Any limitations or requirements]
</constraints>
```

### 10.7 Context-Efficient Long Document Analysis

```xml
<task>
Extract specific information from multiple long documents efficiently.
</task>

<approach>
Use a two-pass strategy:

Pass 1: Quick scan
- For each document, create a brief summary and note which sections are relevant
- Output: Document map with section relevance scores

Pass 2: Targeted deep dive
- Read only the relevant sections identified in Pass 1
- Extract precise information needed
- Output: Structured data with citations
</approach>

<documents>
  <document id="1" title="Annual Report 2024">
  [Long document]
  </document>
  
  <document id="2" title="Strategic Plan">
  [Long document]
  </document>
</documents>

<information_needed>
[Specific questions to answer from documents]
</information_needed>

<output_format>
For each piece of information:
- Answer
- Source (Document ID, section)
- Confidence level
- Relevant quote
</output_format>
```

---

## 11. Quick Reference Guide

### Essential Prompt Engineering Checklist

**Before Submitting Any Prompt:**

✅ Is the task clearly defined?  
✅ Are constraints and requirements explicit?  
✅ Is the desired output format specified?  
✅ Would examples help clarify expectations?  
✅ Does this task need step-by-step reasoning?  
✅ Are different prompt components clearly separated (XML tags)?  
✅ For complex tasks, would prompt chaining help?  
✅ Is all necessary context included?  
✅ Is unnecessary context excluded?

### Context Engineering Checklist

**Before Building an Agent:**

✅ Have I identified what information is essential vs. optional?  
✅ Am I loading information dynamically rather than all upfront?  
✅ Are my tools well-documented and token-efficient?  
✅ Do I have a strategy for managing state across turns?  
✅ Am I prioritizing context by importance?  
✅ Have I implemented context summarization for long sessions?  
✅ Are tool results being efficiently managed?  
✅ Do I have error handling that doesn't pollute future context?

### Claude 4 Quick Tips

✅ Be more explicit—request thoroughness directly  
✅ Match your prompt style to desired output style  
✅ Examples matter more—ensure high quality and consistency  
✅ Leverage parallel tool execution (or control it if needed)  
✅ Trust Claude 4's long-horizon reasoning capabilities  
✅ Request production-quality for document/visual creation  
✅ Avoid test overfitting by emphasizing general solutions

### Common XML Tag Patterns

```xml
<!-- Task Definition -->
<role>...</role>
<task>...</task>
<instructions>...</instructions>
<constraints>...</constraints>

<!-- Input/Context -->
<context>...</context>
<examples>
  <example>
    <input>...</input>
    <output>...</output>
  </example>
</examples>

<!-- Reasoning -->
<thinking>...</thinking>
<analysis>...</analysis>
<scratchpad>...</scratchpad>

<!-- Output -->
<answer>...</answer>
<summary>...</summary>
<recommendations>...</recommendations>
```

### Technique Quick Reference

| Technique | Use When | Token Cost | Complexity |
|-----------|----------|------------|-----------|
| Be Clear & Direct | Always | Low | Simple |
| Examples (2-3) | Format/style guidance needed | Low-Medium | Simple |
| Chain of Thought | Complex reasoning required | Medium | Medium |
| XML Tags | Structured prompt/output | Low | Simple |
| Role Assignment | Domain expertise needed | Low | Simple |
| Prefill | Control output format | Minimal | Simple |
| Prompt Chaining | Multi-step workflow | Medium-High | Medium |
| Long Context | Large documents | High | Medium |
| Dynamic Loading | Agentic systems | Variable | Complex |
| Sub-Agents | Complex decomposition | Medium | Complex |

### Debugging Poor Performance

**If output quality is poor:**

1. Is the instruction clear and specific? → Add detail
2. Would examples help? → Add 2-3 high-quality examples
3. Is reasoning required? → Add chain of thought
4. Is output format consistent? → Use XML tags + prefill
5. Is context organized? → Use XML tags to separate sections

**If context is overwhelming:**

1. Can information be retrieved dynamically? → Implement dynamic loading
2. Are tool results too large? → Add summarization/filtering
3. Is history too long? → Implement summarization strategy
4. Is all context necessary? → Prioritize and trim

**If agent behavior is inconsistent:**

1. Is state being tracked? → Implement explicit state management
2. Are instructions clear? → Review system prompt
3. Are examples consistent? → Ensure uniform quality/format
4. Is context changing unexpectedly? → Log context per turn

---

## Conclusion

Effective work with Claude AI requires mastering both **prompt engineering** (how you write instructions) and **context engineering** (what information the model accesses).

### Key Takeaways

1. **Be Explicit**: Claude 4 models are precise—clearly state what you want
2. **Structure Everything**: XML tags improve clarity and accuracy
3. **Show, Don't Just Tell**: Examples are powerful teaching tools
4. **Enable Reasoning**: Complex tasks benefit from chain of thought
5. **Manage Context**: Dynamic loading beats static dumps
6. **Iterate**: Start simple, measure, improve systematically

### The Path Forward

```
Start: Use Prompt Generator for initial templates
   ↓
Apply: Core techniques (Clear, Direct, Examples, CoT, XML)
   ↓
Optimize: For your specific use case and constraints
   ↓
Scale: Add context engineering for production agents
   ↓
Refine: Continuously measure and improve
```

### Resources

- **Anthropic Documentation**: https://docs.anthropic.com
- **Prompt Generator**: https://console.anthropic.com/dashboard
- **Interactive Tutorial**: https://github.com/anthropics/prompt-eng-interactive-tutorial
- **Engineering Blog**: https://www.anthropic.com/engineering

---

**Version 1.0 | October 2025**  
*This manual synthesizes content from Anthropic's official documentation and research.*

Happy prompting! 🚀
