import { Text } from "@/components/typography/Text";
import { Incident } from "@/types/incident.type";
import { FC } from "react";
import { IncidentCardWrapper } from "./incident-card-wrapper";
import { IconInput } from "@/components/ui/input";
import { SendHorizonal } from "lucide-react";

export const IncidentComments: FC<{ data: Incident.Item }> = (x) => {
  return (
    <div className="flex flex-col gap-1">
      <Text.Large>Комментарии по задаче</Text.Large>
      <IncidentCardWrapper className="h-52 overflow-auto gap-2 justify-end">
        {x.data.comments.map((v, i) => (
          <div key={i} className="bg-accent p-3 text-accent-foreground rounded-xl rounded-br-none">
            {v}
          </div>
        ))}
      </IncidentCardWrapper>
      <IconInput
        className="bg-card"
        placeholder="Написать комментарий"
        rightIcon={
          <button className="pointer-events-auto text-secondary size-5 mb-2">
            <SendHorizonal />
          </button>
        }
      />
    </div>
  );
};
