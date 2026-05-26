# LLM Strategy Prompts

Prompt files:

- `prompts/trend-content-strategy/system.md`
- `prompts/trend-content-strategy/user-template.md`
- `prompts/serp-analysis/system.md`
- `prompts/product-candidate-analysis/system.md`

The prompt layer receives market config, trend cluster, trend keyword, SERP analysis, competitor patterns, missing angles, intended article type, required sections, forbidden claims, and monetization state.

The output must be structured JSON plus markdown draft. Links are forbidden at this stage.
