import { InputNumber } from "../../../../components/inputs/InputNumber";
import { StoryExample } from "../../components/StoryExample";

export const InputNumberStory = () => {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <StoryExample
        title="Optional Empty"
        description="Enabled, optional, and ready for manual entry."
      >
        <InputNumber label="Weight" suffix="kg" placeholder="0" />
      </StoryExample>

      <StoryExample
        title="Optional Default Value"
        description="Uncontrolled input with a default numeric value."
      >
        <InputNumber label="Weight" suffix="kg" defaultValue={72} />
      </StoryExample>

      <StoryExample
        title="Required Empty"
        description="Required field with no starting value."
      >
        <InputNumber label="Weight" suffix="kg" required placeholder="0" />
      </StoryExample>

      <StoryExample
        title="Required Default Value"
        description="Required field with an existing value already present."
      >
        <InputNumber label="Weight" suffix="kg" required defaultValue={84} />
      </StoryExample>

      <StoryExample
        title="Error Message"
        description="Validation feedback shown without shifting layout."
      >
        <InputNumber
          label="Weight"
          suffix="kg"
          defaultValue={0}
          error="Weight must be greater than 0"
        />
      </StoryExample>

      <StoryExample
        title="Disabled"
        description="Disabled input with a prefilled value."
      >
        <InputNumber label="Weight" suffix="kg" defaultValue={128} disabled />
      </StoryExample>
    </div>
  );
};
