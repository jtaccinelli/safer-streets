import React, { useEffect, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

import { useFilterTypes } from "~/hooks/filter/use-filter-types";
import { capitaliseString } from "~/utils/string";

import Text from "~/components/inputs/text";

export default function CustomField() {
  const { types } = useFilterTypes();
  const { control } = useFormContext();
  const type = useWatch({ name: "type" });

  const [fields, setFields] = useState(
    types.find(({ handle }) => handle === type)?.custom_fields ?? {}
  );

  useEffect(() => {
    setFields(types.find(({ handle }) => handle === type)?.custom_fields ?? {});
    //   eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  return (
    <>
      {Object.keys(fields).map((key) => (
        <Controller
          key={key}
          control={control}
          name={`custom.${key}`}
          render={({ field, fieldState: { error } }) => (
            <Text {...field} label={capitaliseString(key)} error={error} />
          )}
          defaultValue=""
        />
      ))}
    </>
  );
}
