"use client";

import { Issue, User } from "@prisma/client";
import { Select, Skeleton } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function AssigneeSelect({ issue }: { issue: Issue }) {
  const userQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => axios.get<User[]>("/api/users").then((res) => res.data),
    staleTime: 1000 * 60,
  });

  const handleChange = (userId: string) => {
    axios.patch(`/api/issues/${issue.id}`, {
      assignedToUserId: userId === "unassigned" ? null : userId,
    });
  };

  if (userQuery.isPending) return <Skeleton height="2rem" />;

  if (userQuery.error) return null;

  return (
    <Select.Root onValueChange={handleChange} defaultValue={issue.assignedToUserId || "unassigned"}>
      <Select.Trigger placeholder="Assign..." />
      <Select.Content>
        <Select.Group>
          <Select.Label>Suggestions</Select.Label>
          <Select.Item value="unassigned">Unassigned</Select.Item>
          {userQuery.data?.map((user) => (
            <Select.Item key={user.id} value={user.id}>
              {user.name}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
}
export default AssigneeSelect;
