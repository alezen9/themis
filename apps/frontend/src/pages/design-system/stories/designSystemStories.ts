import { InputNumberStory } from "./input-number/InputNumberStory";
import { TabsStory } from "./tabs/TabsStory";

export const designSystemStories = [
  {
    id: "input-number",
    label: "InputNumber",
    description:
      "Numeric field variants and states for the shared input foundation.",
    component: InputNumberStory,
  },
  {
    id: "tabs",
    label: "Tabs",
    description: "Segmented tab control previews and interaction states.",
    component: TabsStory,
  },
] as const;

export const getDesignSystemStory = (id?: string) =>
  designSystemStories.find((story) => story.id === id) ??
  designSystemStories[0];
