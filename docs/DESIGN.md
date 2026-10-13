# Petal design

Petal should feel like a calm, personal place to keep money organised. The audience is an individual tracking everyday spending and saving for things she cares about. The interface stays practical: every control should work, and every supporting line should explain a value, an action, or a state.

- Background: warm ivory `#fbf8f4`; sidebar: sand `#f4eee8`; surfaces: white and pale parchment.
- Action colour: plum `#6d354d`; balance surface: dusty plum `#75475c`; accents: rose, sage, and muted gold.
- Display type: Cormorant Garamond. Body and controls: DM Sans. Both have local fallbacks and load with `display=swap`.
- The four-petal mark provides identity. Data charts and meaningful goal icons carry the rest of the visual detail.
- Desktop uses a persistent sidebar; phones use bottom navigation with safe-area padding. At narrow widths the balance card spans the row and income/spending share the next row.
- Input fields have real labels, readable text, visible focus states, and appropriate autocomplete/input modes. Native dialog handles modality, focus trapping, Escape, and screen-reader semantics.
- Mutations wait for server confirmation. Pending controls prevent duplicate submits, failures keep form values, and short notifications confirm the result.
- The interactive preview is clearly identified and separated from authenticated persistence. Real accounts start empty, with a useful next action.
- No decorative section eyebrows or footer slogans. Supporting copy should earn its place.

Source-owned Button, Input, Card, CardHeader, and CardContent began from shadcn/ui’s New York registry. They were adapted to Preact and Lakebed’s supported relative-source imports. Native dialog/select/date controls replace unsupported Radix imports, keeping focus and keyboard behaviour in the browser.
