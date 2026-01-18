Project Brief: TailorFlow (Multi-Item Support)
1. Updated User Interface & Flow
Page 3: Step 2 Form (Add Clothing Item)
Header: "Add Clothing Item for [Client Name]"
Fields: Waist, Sleeve, Leg, Hip, Thigh, Extra Details, and Image Upload.
Action: * [Done]: Takes you to the Review Page.
[+ Add Another Item]: Saves the current measurement to temporary state and clears the form for a second item for the same client.
Page 4: Review & Preview Page
Content: * Client Contact Info (at the top).
List of Items: A card for each clothing item added, showing the measurements and the small image preview.
Actions:
[Edit]: Edit specific item details.
[Add Another Item]: Return to the measurement form to add more to this specific order.
[Save All]: Commits the client AND all associated clothing items to the database.
2. Updated Database Schema (Supabase)
To make this work, Claude needs to create two tables that are linked together. This is a "Relational Database" setup.
Table 1: clients (The Person)
id: uuid (primary key)
full_name, location, phone
Table 2: items (The Clothes)
id: uuid (primary key)
client_id: uuid (foreign key linking back to the client)
waist, sleeve, leg_length, hip, thigh, extra_details, image_url
