# Hostel Management System - ER Diagram

```mermaid
erDiagram
    USER ||--o{ STUDENT : has
    USER ||--o{ WARDEN : has
    STUDENT ||--o{ ATTENDANCE : has
    STUDENT ||--o{ ROOM : assigned_to
    ROOM ||--o{ BLOCK : belongs_to
    MESS ||--o{ MENU : has
    MESS ||--o{ FEEDBACK : receives
    STUDENT ||--o{ FEEDBACK : submits
    STUDENT ||--o{ PAYMENT : makes
    FEE_STRUCTURE ||--o{ PAYMENT : defines

    USER {
        string _id PK
        string name
        string email
        string password
        string role
        date createdAt
    }

    STUDENT {
        string _id PK
        string user_id FK
        string student_id
        string name
        string email
        string phone
        string gender
        string address
        string parent_name
        string parent_contact
        string room_id FK
        string batch
        string department
        boolean isAvailable
    }

    WARDEN {
        string _id PK
        string user_id FK
        string name
        string email
        string phone
        string address
    }

    BLOCK {
        string _id PK
        string block_name
        string block_type
        string gender
        int total_rooms
        int rooms_occupied
    }

    ROOM {
        string _id PK
        string block_id FK
        string room_number
        int capacity
        int current_occupancy
        string room_type
        string status
    }

    ATTENDANCE {
        string _id PK
        string student_id FK
        date date
        boolean isPresent
        string marked_by FK
    }

    MESS {
        string _id PK
        string name
        string location
        int capacity
        string incharge_id FK
    }

    MENU {
        string _id PK
        string mess_id FK
        string day
        string meal_type
        array items
    }

    FEEDBACK {
        string _id PK
        string student_id FK
        string mess_id FK
        string feedback_text
        int rating
        date feedback_date
    }

    PAYMENT {
        string _id PK
        string student_id FK
        string fee_structure_id FK
        float amount
        string payment_method
        string transaction_id
        date payment_date
        string status
    }

    FEE_STRUCTURE {
        string _id PK
        string name
        string description
        float amount
        string fee_type
        string academic_year
        date due_date
    }
```

## How to View the Diagram
1. Copy the Mermaid code above
2. Use any Mermaid-compatible viewer like:
   - [Mermaid Live Editor](https://mermaid.live/)
   - VS Code with Mermaid extension
   - GitHub/GitLab Markdown viewer (native Mermaid support)

## Key Relationships
1. **USER** is a parent entity with STUDENT and WARDEN as child entities (inheritance)
2. **STUDENT** is assigned to a ROOM
3. **ROOM** belongs to a BLOCK
4. **STUDENT** has multiple ATTENDANCE records
5. **MESS** has multiple MENU items and receives FEEDBACK
6. **STUDENT** makes PAYMENT according to FEE_STRUCTURE
