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
    errorMap: () => ({ message: "Issue Type is required" }),
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

  // handleSubmit already blocks submission when validation fails —
  // no need to re-check errors inside onSubmit.
  const onSubmit = (data: SupportRequestData) => {
    dispatch(submitSupportRequest(data));
    enqueueSnackbar("Support request submitted successfully", { variant: "success" });
    reset();
    setOpen(false);
  };

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Submit Support Request
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Submit Support Request
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Full Name */}
            <TextField
              {...register("fullName")}
              label="Full Name"
              fullWidth
              margin="normal"
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
            />

            {/* Email */}
            <TextField
              {...register("email")}
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            {/* Issue Type — Controller is the correct pattern for MUI selects */}
            <Controller
              control={control}
              name="issueType"
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  margin="normal"
                  label="Issue Type"
                  error={!!errors.issueType}
                  helperText={errors.issueType?.message}
                >
                  <MenuItem value="Bug Report">Bug Report</MenuItem>
                  <MenuItem value="Feature Request">Feature Request</MenuItem>
                  <MenuItem value="General Inquiry">General Inquiry</MenuItem>
                </TextField>
              )}
            />

            {/* Tags */}
            <Controller
              control={control}
              name="tags"
              render={({ field }) => (
                <FormControl fullWidth margin="normal" error={!!errors.tags}>
                  <InputLabel>Tags</InputLabel>
                  <Select
                    multiple
                    value={field.value}
                    onChange={field.onChange}
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

            {/* Steps to Reproduce */}
            <Box mt={2}>
              Steps to Reproduce:
              {fields.length === 0 && (
                <FormHelperText error sx={{ ml: 2 }}>
                  At least one step is required
                </FormHelperText>
              )}
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
              <Button
                onClick={() => append({ step: "" })}
                variant="outlined"
                color="primary"
                sx={{ mt: 2 }}
              >
                + Add Step
              </Button>
            </Box>
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SupportRequestForm;
