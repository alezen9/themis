import { Tab, Tabs } from "../../../../components/Tabs";
import { StoryExample } from "../../components/StoryExample";

export const TabsStory = () => {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <StoryExample
        title="Default"
        description="Basic segmented navigation with the first tab active."
      >
        <Tabs>
          <Tab>First</Tab>
          <Tab>Second</Tab>
          <Tab>Third</Tab>
        </Tabs>
      </StoryExample>

      <StoryExample
        title="Alternate Default"
        description="Same component with a different default active tab."
      >
        <Tabs defaultActiveIndex={1}>
          <Tab>Dead Load</Tab>
          <Tab>Live Load</Tab>
          <Tab>Wind</Tab>
        </Tabs>
      </StoryExample>
    </div>
  );
};
