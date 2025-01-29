import React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Box, Button, TextField, MenuItem, Chip } from "@mui/material";
import { SupportRequestData } from "../../interfaces/ISupportRequest";
import { useDispatch } from "react-redux";
import { submitSupportRequest } from "../../stateManagement/supportRequestSlice";

const schema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  issueType: z.enum(["General Inquiry", "Feature Request", "Bug Report"]),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  steps: z.array(z.object({ step: z.string().min(1, "Step is required") })).min(1, "At least one step is required"),
});

const SupportRequestForm: React.FC = () => {
  const { control, handleSubmit, register, setValue, watch, reset } = useForm<SupportRequestData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      issueType: "Bug Report",
      tags: [],
      steps: [{ step: "" }],
    },
  });

  const dispatch = useDispatch();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "steps",
  });

  const onSubmit = (data: SupportRequestData) => {
    console.log("Submitted Data:", data);
    dispatch(submitSupportRequest(data));
    reset();
  };

  return (
    <Box p={4} maxWidth={500} mx="auto">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box mt={2}>
          <TextField
            {...register("fullName")}
            variant="outlined"
            fullWidth
            label="Full Name"
            error={!!watch("fullName") && !watch("fullName").trim()}
            helperText={watch("fullName") && !watch("fullName").trim() ? "Full Name is required" : ""}
          />
        </Box>
        <Box mt={2}>
          <TextField
            {...register("email")}
            variant="outlined"
            fullWidth
            label="Email Address"
            type="email"
            error={!!watch("email") && !watch("email").includes("@")}
            helperText={watch("email") && !watch("email").includes("@") ? "Invalid email address" : ""}
          />
        </Box>
        <Box mt={2}>
          <TextField {...register("issueType")} select fullWidth variant="outlined" label="Issue Type">
            <MenuItem value="Bug Report">Bug Report</MenuItem>
            <MenuItem value="Feature Request">Feature Request</MenuItem>
            <MenuItem value="General Inquiry">General Inquiry</MenuItem>
          </TextField>
        </Box>
        <Box mt={2}>
          <Controller
            control={control}
            name="tags"
            render={({ field }) => (
              <TextField
                variant="outlined"
                fullWidth
                label="Tags (comma separated)"
                value={field.value.join(", ")}
                onChange={(e) => setValue("tags", e.target.value.split(",").map((tag) => tag.trim()))}
                helperText="Example: UI, Backend, Performance"
              />
            )}
          />
        </Box>
        <Box mt={2}>
          <label>Steps to Reproduce:</label>
          {fields.map((field, index) => (
            <Box key={field.id} display="flex" alignItems="center" mt={1}>
              <TextField
                {...register(`steps.${index}.step`)}
                variant="outlined"
                fullWidth
                label={`Step ${index + 1}`}
              />
              <Button onClick={() => remove(index)} color="error" sx={{ ml: 1 }}>
                Remove
              </Button>
            </Box>
          ))}
          <Button onClick={() => append({ step: "" })} variant="outlined" color="primary" sx={{ mt: 2 }}>
            + Add Step
          </Button>
        </Box>
        <Box mt={4}>
          <Button type="submit" fullWidth variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default SupportRequestForm;