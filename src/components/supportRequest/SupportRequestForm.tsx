import React, { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  Chip,
  FormHelperText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { SupportRequestData } from "../../interfaces/ISupportRequest";
import { useDispatch } from "react-redux";
import { submitSupportRequest } from "../../stateManagement/supportRequestSlice";
import { useSnackbar } from "notistack";

const schema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  issueType: z.enum(["General Inquiry", "Feature Request", "Bug Report"], {
    errorMap: () => {
      return { message: "Issue Type is required" };
    },
  }),
  tags: z.array(z.enum(["UI", "Backend", "Performance"])).optional(),
  steps: z
    .array(z.object({ step: z.string().min(1, "Step is required") }))
    .min(1, "At least one step is required"),
});

const TAG_OPTIONS = ["UI", "Backend", "Performance"] as const;

const SupportRequestForm: React.FC = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const {
    control,
    handleSubmit,
    register,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SupportRequestData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      issueType: "",
      tags: [],
      steps: [{ step: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "steps",
  });

  const onSubmit = (data: SupportRequestData) => {
    if (Object.keys(errors).length > 0) {
      enqueueSnackbar("Please fix the errors before submitting", { variant: "error" });
      return;
    }
    dispatch(submitSupportRequest(data));
    enqueueSnackbar("Support request submitted successfully", { variant: "success" });
    reset();
    setOpen(false);
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Submit Support Request
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Submit Support Request
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              {...register("fullName")}
              label="Full Name"
              fullWidth
              margin="normal"
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
            />
            <TextField
              {...register("email")}
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              {...register("issueType")}
              select
              fullWidth
              margin="normal"
              label="Issue Type"
              error={!!errors.issueType}
              helperText={errors.issueType?.message}
              value={watch("issueType") ?? ""}
            >
              <MenuItem value="Bug Report">Bug Report</MenuItem>
              <MenuItem value="Feature Request">Feature Request</MenuItem>
              <MenuItem value="General Inquiry">General Inquiry</MenuItem>
            </TextField>
            <Controller
              control={control}
              name="tags"
              render={({ field }) => (
                <FormControl fullWidth margin="normal" error={!!errors.tags}>
                  <InputLabel>Tags</InputLabel>
                  <Select
                    multiple
                    value={field.value}
                    onChange={(e) => setValue("tags", e.target.value as string[])}
                    input={<OutlinedInput label="Tags" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {TAG_OPTIONS.map((tag) => (
                      <MenuItem key={tag} value={tag}>
                        {tag}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            <Box mt={2}>
              Steps to Reproduce: {fields.length === 0 && <FormHelperText error sx={{ ml: 2 }}>At least one step is required</FormHelperText>}
              {fields.map((field, index) => (
                <Box key={field.id} display="flex" alignItems="center" mt={1}>
                  <TextField
                    {...register(`steps.${index}.step`)}
                    fullWidth
                    label={`Step ${index + 1}`}
                    error={!!errors.steps?.[index]?.step}
                    helperText={errors.steps?.[index]?.step?.message}
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
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit(onSubmit)} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SupportRequestForm;