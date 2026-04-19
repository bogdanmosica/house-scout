# /new-property-type

Add a new property type to House Scout (e.g. Studio, Villa, Townhouse).

## Usage
```
/new-property-type <TypeName>
```

## What to do

1. Add the type to the property type enum/union in the data model
2. Decide which rooms apply — most types use all 7 rooms; studios may skip `bedroom` as separate
3. Add any type-specific questions to the relevant room banks:
   - Use `BUY_EXTRAS` / `RENT_EXTRAS` pattern if mode-specific
   - Or add a `TYPE_EXTRAS` map keyed by property type if type-specific questions grow
4. Add the type to the Add Property picker UI with an appropriate icon (lucide-react)
5. Assign a default `tone`: terra | sage | sky | gold (used for photo placeholders)
6. Update `CLAUDE.md` planned screens table if the type needs a unique flow
