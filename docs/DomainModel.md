# Modelo de Dominio

Supplier
│
└── Product
        │
        ├── Curve (Value Object)
        │
        ├── InventoryMovement
        │
        └── DeliveryNoteItem
                        │
                        ▼
                 DeliveryNote
                        │
                        ▼
                    Customer