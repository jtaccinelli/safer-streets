import React from "react";
import useAsync from "~/hooks/use-async";
import fetchSeverities from "~/lib/fetch-severities";
import Select from "~/components/inputs/select";

export function SeveritySelect() {
  const { data, isLoading } = useAsync(fetchSeverities, { immediate: true });

  if (!isLoading && (!data || data.length === 0)) return null;

  return (
    <Select
      label="Severity"
      name="severity"
      placeholder="Loading severities..."
      options={data?.map((result) => ({
        label: result.title,
        value: result.handle,
      }))}
      onChange={console.log}
      loading={isLoading}
      value={data?.[0].handle}
    />
  );
}
